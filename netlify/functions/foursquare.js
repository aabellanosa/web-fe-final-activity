// netlify/functions/foursquare.js

export async function handler(event) {
  try {
    const params = event.queryStringParameters;

    const lat = parseFloat(params.lat);
    const lon = parseFloat(params.lon);
    const query = params.query || "";
    const limit = parseInt(params.limit || 8);

    const ll = `${lat.toFixed(5)},${lon.toFixed(5)}`;

    const url = `https://places-api.foursquare.com/v3/places/search?ll=${ll}&query=${query}&limit=${limit}`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: process.env.FOURSQUARE_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Foursquare API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ results: data.results }),
    };
  } catch (err) {
    console.error("FSQ ERROR:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Serverless error" }),
    };
  }
}
