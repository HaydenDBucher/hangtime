export const CAMPUS_PICKUP = {
  name: "Ohio Union",
  lat: 39.9978,
  lng: -83.0088,
};

const toRadians = (degrees) => degrees * Math.PI / 180;

function distanceInMiles(start, end) {
  const earthRadiusMiles = 3958.8;
  const latDistance = toRadians(end.lat - start.lat);
  const lngDistance = toRadians(end.lng - start.lng);
  const startLat = toRadians(start.lat);
  const endLat = toRadians(end.lat);
  const a = Math.sin(latDistance / 2) ** 2 + Math.cos(startLat) * Math.cos(endLat) * Math.sin(lngDistance / 2) ** 2;
  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function fareRange(base, distance, duration, demand, spread = 1.7) {
  const midpoint = (base + distance * 1.7 + duration * .24) * demand;
  return `$${Math.max(6, Math.floor(midpoint - spread))}–${Math.max(8, Math.ceil(midpoint + spread))}`;
}

export function getCampusRidePreview(destination, now = new Date()) {
  const directDistance = distanceInMiles(CAMPUS_PICKUP, destination);
  const roadDistance = Math.max(.4, directDistance * 1.22);
  const duration = Math.max(4, Math.round(roadDistance * 4.2 + 3));
  const hour = now.getHours();
  const demand = hour >= 21 || hour < 2 ? 1.24 : hour >= 18 ? 1.1 : 1;
  const etaBase = hour >= 21 || hour < 2 ? 6 : 4;

  return {
    pickup: CAMPUS_PICKUP,
    distance: `${roadDistance.toFixed(1)} mi`,
    walkMinutes: Math.max(3, Math.round(directDistance * 19)),
    source: "modeled",
    updated: "Campus preview",
    providers: [
      { id: "uber", name: "Uber", fare: fareRange(5.6, roadDistance, duration, demand), eta: `${etaBase}–${etaBase + 3} min` },
      { id: "lyft", name: "Lyft", fare: fareRange(5.2, roadDistance, duration, demand * .98, 1.9), eta: `${etaBase + 1}–${etaBase + 4} min` },
    ],
  };
}

export function getRideLink(provider, destination) {
  if (provider === "uber") {
    const params = new URLSearchParams({
      action: "setPickup",
      pickup: "my_location",
      "dropoff[latitude]": String(destination.lat),
      "dropoff[longitude]": String(destination.lng),
      "dropoff[nickname]": destination.name,
      "dropoff[formatted_address]": `${destination.name}, Columbus, OH`,
    });
    const clientId = import.meta.env.VITE_UBER_CLIENT_ID;
    if (clientId) params.set("client_id", clientId);
    return `https://m.uber.com/ul/?${params}`;
  }

  const params = new URLSearchParams({
    id: "lyft",
    "pickup[latitude]": CAMPUS_PICKUP.lat,
    "pickup[longitude]": CAMPUS_PICKUP.lng,
    "destination[latitude]": destination.lat,
    "destination[longitude]": destination.lng,
  });
  return `https://www.lyft.com/ride?${params}`;
}
