import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SPREADSHEET_ID = '1k4H-t2RN91TqLL9RYCO7WKdMDgF1gNP1SeZuLnz5srA';
const RATE_LIMIT_WINDOW_HOURS = 1;
const MAX_ATTEMPTS_PER_WINDOW = 5;

async function getAccessToken(credentials: any): Promise<string> {
  const jwtHeader = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const jwtClaimSet = btoa(JSON.stringify({
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }));

  const signatureInput = `${jwtHeader}.${jwtClaimSet}`;
  const privateKey = credentials.private_key;
  const pemContents = privateKey
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\n/g, '')
    .replace(/\s/g, '')
    .trim();

  const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signatureInput)
  );

  const jwtSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  const jwt = `${jwtHeader}.${jwtClaimSet}.${jwtSignature}`;

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!tokenResponse.ok) {
    throw new Error('Failed to get Google access token');
  }

  const { access_token } = await tokenResponse.json();
  return access_token;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, phone, email, school, role, message } = await req.json();

    // Validate required fields
    if (!name || !email || !school || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (name.length > 200 || email.length > 255 || school.length > 200 || (role && role.length > 200) || message.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Field length exceeded' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Rate limiting
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } }
    );

    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    const ipIdentifier = `contact:${clientIP}`;
    const emailIdentifier = `contact-email:${email.toLowerCase()}`;
    const windowCutoff = new Date(Date.now() - RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000).toISOString();

    const [ipResult, emailResult] = await Promise.all([
      supabase.from('newsletter_rate_limits').select('*').eq('identifier', ipIdentifier).gte('last_attempt_at', windowCutoff).single(),
      supabase.from('newsletter_rate_limits').select('*').eq('identifier', emailIdentifier).gte('last_attempt_at', windowCutoff).single(),
    ]);

    const ipExceeded = ipResult.data && ipResult.data.attempt_count >= MAX_ATTEMPTS_PER_WINDOW;
    const emailExceeded = emailResult.data && emailResult.data.attempt_count >= MAX_ATTEMPTS_PER_WINDOW;

    if (ipExceeded || emailExceeded) {
      console.log(`Contact form rate limit exceeded - IP: ${ipExceeded}, Email: ${emailExceeded}`);
      return new Response(
        JSON.stringify({ error: 'Too many submissions. Please try again later.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
      );
    }

    const googleCredentials = Deno.env.get('GOOGLE_SHEETS_CREDENTIALS');
    if (!googleCredentials) {
      console.error('GOOGLE_SHEETS_CREDENTIALS not found');
      throw new Error('Google Sheets credentials not configured');
    }

    console.log('Parsing credentials...');
    const credentials = JSON.parse(googleCredentials);
    console.log('Service account email:', credentials.client_email);
    
    console.log('Getting access token...');
    const accessToken = await getAccessToken(credentials);
    console.log('Got access token successfully');

    const now = new Date();
    const dateStr = now.toLocaleString('en-US', { timeZone: 'America/New_York' });

    const rowData = [dateStr, name, phone || '', email, school, role || '', message];

    const appendResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1!A:G:append?valueInputOption=RAW`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values: [rowData] }),
      }
    );

    if (!appendResponse.ok) {
      const errorData = await appendResponse.json();
      console.error('Google Sheets API error:', errorData);
      throw new Error('Failed to append to Google Sheet');
    }

    console.log('Contact form submitted successfully for:', name);

    // Update rate limits
    const nowISO = new Date().toISOString();
    const upsertRateLimit = async (id: string, existing: any) => {
      if (existing) {
        await supabase.from('newsletter_rate_limits').update({ attempt_count: existing.attempt_count + 1, last_attempt_at: nowISO }).eq('id', existing.id);
      } else {
        await supabase.from('newsletter_rate_limits').insert({ identifier: id, attempt_count: 1, first_attempt_at: nowISO, last_attempt_at: nowISO });
      }
    };

    await Promise.all([
      upsertRateLimit(ipIdentifier, ipResult.data),
      upsertRateLimit(emailIdentifier, emailResult.data),
    ]);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error in submit-contact-form:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to submit. Please try again.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
