const API_URL = "https://app.ticketmaster.com/discovery/v2/events.json";

const fallbackEvents = [
  {
    id: "newport-after-dark",
    title: "Newport After Dark",
    venue: "Newport Music Hall",
    area: "University District",
    time: "8:30 PM",
    category: "Social",
    attending: 84,
    groups: 18,
    lat: 40.0008,
    lng: -83.0095,
    x: 49,
    y: 37,
    promoted: true,
    offer: "Student entry before 9:30",
    deal: "$5 student entry before 9:30 with BuckID",
    wait: "10–15 min",
    cover: "$5 with BuckID",
    trend: "Rising",
    peak: "10:15 PM",
    updated: "6 min ago",
    confidence: "High confidence",
    friends: 7,
    age: "18+",
    tone: "coral",
  },
  {
    id: "gateway-late-screening",
    title: "Late Screening + Patio",
    venue: "Gateway Film Center",
    area: "South Campus",
    time: "9:00 PM",
    category: "Live music",
    attending: 47,
    groups: 11,
    lat: 40.0022,
    lng: -83.0124,
    x: 50,
    y: 17,
    wait: "No line",
    cover: "$9 student ticket",
    trend: "Steady",
    peak: "9:30 PM",
    updated: "11 min ago",
    confidence: "Verified event",
    friends: 2,
    age: "All ages",
    tone: "violet",
  },
  {
    id: "midway-watch-party",
    title: "Buckeye Watch Party",
    venue: "Midway",
    area: "High Street",
    time: "7:30 PM",
    category: "Sports",
    attending: 126,
    groups: 24,
    lat: 40.0041,
    lng: -83.0101,
    x: 59,
    y: 43,
    deal: "First round of games free for crews of 4+",
    wait: "20–25 min",
    cover: "Free",
    trend: "Filling fast",
    peak: "8:45 PM",
    updated: "3 min ago",
    confidence: "High confidence",
    friends: 11,
    age: "21+ after 9",
    tone: "lime",
  },
  {
    id: "union-comedy-night",
    title: "Campus Comedy Night",
    venue: "Ohio Union",
    area: "Central Campus",
    time: "10:00 PM",
    category: "Comedy",
    attending: 31,
    groups: 7,
    lat: 39.9978,
    lng: -83.0088,
    x: 39,
    y: 24,
    wait: "5 min",
    cover: "Free with BuckID",
    trend: "Steady",
    peak: "9:50 PM",
    updated: "9 min ago",
    confidence: "Venue reported",
    friends: 1,
    age: "All students",
    tone: "blue",
  },
  {
    id: "adriaticos-late-night",
    title: "Late-night pizza stop",
    venue: "Adriatico's",
    area: "South Campus",
    time: "7:00 PM",
    category: "Food",
    attending: 68,
    groups: 14,
    lat: 39.9949,
    lng: -83.0139,
    x: 76,
    y: 62,
    promoted: false,
    offer: null,
    deal: null,
    wait: "10 min",
    cover: "Avg $9/person",
    trend: "Rising",
    peak: "8:30 PM",
    updated: "8 min ago",
    confidence: "Venue reported",
    friends: 4,
    age: "All ages",
    tone: "amber",
  },
  {
    id: "buckeye-donuts-late-night",
    title: "Late-night food run",
    venue: "Buckeye Donuts",
    area: "High Street",
    time: "10:30 PM",
    category: "Food",
    attending: 93,
    groups: 20,
    lat: 40.0049,
    lng: -83.0091,
    x: 38,
    y: 59,
    wait: "15–20 min",
    cover: "Avg $8/person",
    trend: "Rising",
    peak: "11:30 PM",
    updated: "5 min ago",
    confidence: "High confidence",
    friends: 5,
    age: "All ages",
    tone: "pink",
  },
];

const formatTime = (date) => {
  if (!date) return "Tonight";
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
};

const approximateMapPosition = (event, index) => {
  const longitude = Number(event?._embedded?.venues?.[0]?.location?.longitude);
  const latitude = Number(event?._embedded?.venues?.[0]?.location?.latitude);
  if (Number.isFinite(longitude) && Number.isFinite(latitude)) {
    return {
      x: Math.max(12, Math.min(88, 50 + (longitude + 82.9988) * 42)),
      y: Math.max(10, Math.min(88, 48 - (latitude - 39.9612) * 55)),
    };
  }
  return { x: 24 + ((index * 19) % 62), y: 18 + ((index * 23) % 64) };
};

const normalizeEvent = (event, index) => {
  const venue = event?._embedded?.venues?.[0];
  const position = approximateMapPosition(event, index);
  const latitude = Number(venue?.location?.latitude);
  const longitude = Number(venue?.location?.longitude);
  const popularity = Math.round(Number(event?.pleaseNote?.length || event?.info?.length || 34) / 3);
  const groups = Math.max(4, Math.min(28, 7 + popularity + index * 2));

  return {
    id: event.id,
    title: event.name,
    venue: venue?.name || "Ohio State area",
    area: venue?.city?.name || "Campus area",
    time: formatTime(event?.dates?.start?.dateTime || event?.dates?.start?.localDate),
    category: event?.classifications?.[0]?.genre?.name || event?.classifications?.[0]?.segment?.name || "Event",
    attending: groups * (3 + (index % 3)),
    groups,
    lat: Number.isFinite(latitude) ? latitude : 40.003 + ((index % 4) - 1.5) * .004,
    lng: Number.isFinite(longitude) ? longitude : -83.012 + ((index % 5) - 2) * .004,
    x: position.x,
    y: position.y,
    url: event.url,
    image: event.images?.find((image) => image.ratio === "16_9")?.url || event.images?.[0]?.url,
    wait: index % 3 === 0 ? "10–15 min" : index % 3 === 1 ? "No line" : "20 min",
    cover: event?.priceRanges?.[0]?.min ? `From $${Math.round(event.priceRanges[0].min)}` : "Check venue",
    trend: index % 2 === 0 ? "Rising" : "Steady",
    peak: formatTime(event?.dates?.start?.dateTime),
    updated: "Live listing",
    confidence: "Verified event",
    friends: 1 + (index % 6),
    age: event?.ageRestrictions?.legalAgeEnforced ? "21+" : "Check age policy",
    tone: ["coral", "violet", "lime", "blue", "amber", "pink"][index % 6],
  };
};

export async function getTonightEvents({ city = "Columbus", signal } = {}) {
  const apiKey = import.meta.env.VITE_TICKETMASTER_API_KEY;
  if (!apiKey) return { events: fallbackEvents, source: "demo" };

  const start = new Date();
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);
  const params = new URLSearchParams({
    apikey: apiKey,
    city,
    stateCode: "OH",
    countryCode: "US",
    latlong: "40.0030,-83.0120",
    radius: "3",
    unit: "miles",
    startDateTime: start.toISOString().replace(/\.\d{3}Z$/, "Z"),
    endDateTime: end.toISOString().replace(/\.\d{3}Z$/, "Z"),
    sort: "date,asc",
    size: "18",
  });

  try {
    const response = await fetch(`${API_URL}?${params}`, { signal });
    if (!response.ok) throw new Error(`Ticketmaster returned ${response.status}`);
    const payload = await response.json();
    const events = payload?._embedded?.events?.map(normalizeEvent) || [];
    return events.length ? { events, source: "live" } : { events: fallbackEvents, source: "demo" };
  } catch (error) {
    if (error.name === "AbortError") throw error;
    console.warn("Live events unavailable; using Hangtime demo events.", error);
    return { events: fallbackEvents, source: "demo" };
  }
}

export { fallbackEvents };
