// netlify/functions/foursquare.js
import fetch from "node-fetch";

export async function handler(event) {
  try {
    const params = event.queryStringParameters;

    const lat = params.lat;
    const lon = params.lon;
    const query = params.query || "";
    const limit = params.limit || 8;

    const url = `https://places-api.foursquare.com/v3/places/search?ll=${lat},${lon}&query=${query}&limit=${limit}`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: process.env.FOURSQUARE_API_KEY,
      },
    });

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
