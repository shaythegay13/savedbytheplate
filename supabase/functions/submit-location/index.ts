import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LocationSubmission {
  name: string;
  type: string;
  owner: string;
  address: string;
  neighborhood: string;
  openHours?: string;
  contact?: string;
  localItems?: string;
  description?: string;
  website?: string;
  socialMedia?: string;
}

// Server-side validation function
const validateLocationSubmission = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Required fields
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  } else if (data.name.length > 200) {
    errors.push('Name must be less than 200 characters');
  }
  
  if (!data.type || typeof data.type !== 'string') {
    errors.push('Type is required');
  }
  
  if (!data.owner || typeof data.owner !== 'string' || data.owner.trim().length === 0) {
    errors.push('Owner is required');
  } else if (data.owner.length > 200) {
    errors.push('Owner must be less than 200 characters');
  }
  
  if (!data.address || typeof data.address !== 'string' || data.address.trim().length === 0) {
    errors.push('Address is required');
  } else if (data.address.length > 500) {
    errors.push('Address must be less than 500 characters');
  }
  
  if (!data.neighborhood || typeof data.neighborhood !== 'string' || data.neighborhood.trim().length === 0) {
    errors.push('Neighborhood is required');
  } else if (data.neighborhood.length > 200) {
    errors.push('Neighborhood must be less than 200 characters');
  }
  
  // Optional fields - validate if present
  if (data.openHours && (typeof data.openHours !== 'string' || data.openHours.length > 500)) {
    errors.push('Open hours must be a string less than 500 characters');
  }
  
  if (data.contact && (typeof data.contact !== 'string' || data.contact.length > 200)) {
    errors.push('Contact must be a string less than 200 characters');
  }
  
  if (data.localItems && (typeof data.localItems !== 'string' || data.localItems.length > 1000)) {
    errors.push('Local items must be a string less than 1000 characters');
  }
  
  if (data.description && (typeof data.description !== 'string' || data.description.length > 2000)) {
    errors.push('Description must be a string less than 2000 characters');
  }
  
  if (data.website && (typeof data.website !== 'string' || data.website.length > 500)) {
    errors.push('Website must be a string less than 500 characters');
  }
  
  if (data.socialMedia && (typeof data.socialMedia !== 'string' || data.socialMedia.length > 500)) {
    errors.push('Social media must be a string less than 500 characters');
  }
  
  return { valid: errors.length === 0, errors };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify user authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    console.log('Authenticated user:', user.id);
    
    const locationData: LocationSubmission = await req.json();
    
    // Server-side validation
    const validation = validateLocationSubmission(locationData);
    if (!validation.valid) {
      console.error('Validation errors:', validation.errors);
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: validation.errors }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
    
    console.log('Received valid location submission:', locationData.name);

    // Get Google Sheets credentials from environment
    const googleCredentials = Deno.env.get('GOOGLE_SHEETS_CREDENTIALS');
    if (!googleCredentials) {
      throw new Error('Google Sheets credentials not configured');
    }

    const credentials = JSON.parse(googleCredentials);
    
    // Get access token from Google
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
    
    // Import private key
    const privateKey = credentials.private_key;
    const pemHeader = '-----BEGIN PRIVATE KEY-----';
    const pemFooter = '-----END PRIVATE KEY-----';
    const pemContents = privateKey.substring(
      pemHeader.length,
      privateKey.length - pemFooter.length
    ).trim();
    
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

    // Get access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get access token');
    }

    const { access_token } = await tokenResponse.json();

    // Get spreadsheet ID from environment variable for security
    const spreadsheetId = Deno.env.get('GOOGLE_SHEETS_SPREADSHEET_ID');
    if (!spreadsheetId) {
      throw new Error('Google Sheets spreadsheet ID not configured');
    }
    const range = 'Total List!A:N';

    // Get current data to determine next ID
    const getResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const currentData = await getResponse.json();
    const nextId = currentData.values ? currentData.values.length : 1;

    // Prepare row data in the specified format
    const rowData = [
      nextId.toString(), // id
      locationData.name, // name
      locationData.address, // address
      locationData.neighborhood, // neighborhood
      '', // lat (to be filled later with geocoding)
      '', // long (to be filled later with geocoding)
      locationData.description || '', // description
      locationData.type, // type
      locationData.openHours || '', // open hours
      locationData.owner, // owner
      locationData.localItems || '', // local items selling
      locationData.contact || '', // contact information
      locationData.website || '', // social media/website1
      locationData.socialMedia || '', // social media/website2
    ];

    // Append to Google Sheet
    const appendResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=RAW`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [rowData],
        }),
      }
    );

    if (!appendResponse.ok) {
      const errorData = await appendResponse.json();
      console.error('Google Sheets API error:', errorData);
      throw new Error('Failed to append to Google Sheet');
    }

    console.log('Successfully added location to Google Sheet');

    return new Response(
      JSON.stringify({ success: true, message: 'Location submitted successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    const requestId = crypto.randomUUID();
    console.error('Error in submit-location function:', requestId, error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to submit location. Please try again.',
        requestId 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
