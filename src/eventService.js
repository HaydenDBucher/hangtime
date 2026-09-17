const API_URL = "https://app.ticketmaster.com/discovery/v2/events.json";

const fallbackEvents = [
  {
    id: "pins-after-dark",
    title: "Pins After Dark",
    venue: "Pins Mechanical Co.",
    area: "Short North",
    time: "8:30 PM",
    category: "Social",
    attending: 84,
    groups: 18,
    lat: 39.9669,
    lng: -82.9954,
    x: 49,
    y: 37,
    promoted: true,
    offer: "Skip the cover before 10",
    deal: "Free cover before 10 with 4 committed",
    wait: "10–15 min",
    cover: "$5 after 10",
    trend: "Rising",
    peak: "10:15 PM",
    updated: "6 min ago",
    confidence: "High confidence",
    friends: 7,
    tone: "coral",
  },
  {
    id: "live-at-aces",
    title: "Live at Aces",
    venue: "Aces High",
    area: "Old North",
    time: "9:00 PM",
    category: "Live music",
    attending: 47,
    groups: 11,
    lat: 40.0147,
    lng: -83.0112,
    x: 50,
    y: 17,
    wait: "No line",
    cover: "$12 tickets",
    trend: "Steady",
    peak: "9:30 PM",
    updated: "11 min ago",
    confidence: "Verified event",
    friends: 2,
    tone: "violet",
  },
  {
    id: "crew-watch-party",
    title: "Crew Watch Party",
    venue: "Standard Hall",
    area: "Short North",
    time: "7:30 PM",
    category: "Sports",
    attending: 126,
    groups: 24,
    lat: 39.9863,
    lng: -83.0057,
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
    tone: "lime",
  },
  {
    id: "comedy-night",
    title: "Late Show",
    venue: "The Attic Comedy Club",
    area: "Old North",
    time: "10:00 PM",
    category: "Comedy",
    attending: 31,
    groups: 7,
    lat: 39.9637,
    lng: -82.9748,
    x: 39,
    y: 24,
    wait: "5 min",
    cover: "$18 tickets",
    trend: "Steady",
    peak: "9:50 PM",
    updated: "9 min ago",
    confidence: "Venue reported",
    friends: 1,
    tone: "blue",
  },
  {
    id: "east-market-social",
    title: "Night Market Social",
    venue: "East Market",
    area: "Franklin Park",
    time: "7:00 PM",
    category: "Food + drink",
    attending: 68,
    groups: 14,
    lat: 39.9608,
    lng: -82.9732,
    x: 76,
    y: 62,
    promoted: true,
    offer: "Two-for-one group tasting",
    deal: "Two-for-one tasting for the whole crew",
    wait: "No line",
    cover: "Free",
    trend: "Rising",
    peak: "8:30 PM",
    updated: "8 min ago",
    confidence: "Venue reported",
    friends: 4,
    tone: "amber",
  },
  {
    id: "arena-district-dj",
    title: "Friday Frequency",
    venue: "The Forum",
    area: "Arena District",
    time: "10:30 PM",
    category: "DJ",
    attending: 93,
    groups: 20,
    lat: 39.9665,
    lng: -83.0016,
    x: 38,
    y: 59,
    wait: "15–20 min",
    cover: "$10 before 11",
    trend: "Rising",
    peak: "11:30 PM",
    updated: "5 min ago",
    confidence: "High confidence",
    friends: 5,
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
    venue: venue?.name || "Columbus",
    area: venue?.city?.name || "Columbus",
    time: formatTime(event?.dates?.start?.dateTime || event?.dates?.start?.localDate),
    category: event?.classifications?.[0]?.genre?.name || event?.classifications?.[0]?.segment?.name || "Event",
    attending: groups * (3 + (index % 3)),
    groups,
    lat: Number.isFinite(latitude) ? latitude : 39.976 + ((index % 4) - 1.5) * .009,
    lng: Number.isFinite(longitude) ? longitude : -83.002 + ((index % 5) - 2) * .009,
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
