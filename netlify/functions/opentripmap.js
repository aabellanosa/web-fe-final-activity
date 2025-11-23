// netlify/functions/opentripmap.js

export async function handler(event, context) {
  try {
    const { lat, lon, radius = 10000, kinds = "restaurants", limit = 10 } =
      Object.fromEntries(new URLSearchParams(event.rawQuery || ""));

    if (!lat || !lon) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing lat or lon" }),
      };
    }

    const API_KEY = process.env.OPENTRIPMAP_KEY;
    if (!API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing API key" }),
      };
    }

    // Step 1: Search for nearby places (returns list of IDs)
    const listUrl = `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&kinds=${kinds}&limit=${limit}&apikey=${API_KEY}`;
    const listResp = await fetch(listUrl);
    const listData = await listResp.json();

    // Step 2: Fetch details for each place ID
    const detailed = [];

    for (const place of listData.features || []) {
      const xid = place.properties.xid;
      const detailUrl = `https://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=${API_KEY}`;

      const detailResp = await fetch(detailUrl);
      const detail = await detailResp.json();

      detailed.push({
        id: xid,
        name: detail.name || place.properties.name,
        dist: place.properties.dist,
        kinds: detail.kinds,
        address: detail.address,
        url: detail.url || null,
        preview: detail.preview?.source || null,
        lat: detail.point?.lat,
        lon: detail.point?.lon,
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ results: detailed }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
