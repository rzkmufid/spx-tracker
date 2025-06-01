import { Handler } from '@netlify/functions';

const SPX_API_URL = 'https://spx.co.id';

export const handler: Handler = async (event) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Get the query parameters
    const params = new URLSearchParams(event.rawQuery);
    
    // Basic validation
    const trackingNumber = params.get('spx_tn');
    if (!trackingNumber?.startsWith('SPXID')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid tracking number format' }),
      };
    }

    // Forward the request to SPX API
    const response = await fetch(
      `${SPX_API_URL}/shipment/order/open/order/get_order_info?${event.rawQuery}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};