export async function fetchNearbyPlaces({ lat, lon, kinds = "restaurants", limit = 10 }) {
  const url = `/.netlify/functions/opentripmap?lat=${lat}&lon=${lon}&kinds=${kinds}&limit=${limit}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed fetching OpenTripMap data");

  const data = await res.json();
  return data; // { results: [...] }
}
