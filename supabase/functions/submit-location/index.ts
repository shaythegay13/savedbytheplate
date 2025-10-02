import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const locationData: LocationSubmission = await req.json();
    console.log('Received location submission:', locationData);

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

    // Spreadsheet ID extracted from the URL
    const spreadsheetId = '1IHwLQRW7kD3IGsO1k1vN0XmdpZ8K9Ji7i87adBs6Qu4';
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
    console.error('Error in submit-location function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
