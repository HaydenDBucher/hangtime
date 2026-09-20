import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { NIGHT_CENTER, NIGHT_RADIUS_MILES, getTonightEvents, isWithinNightRadius } from "./eventService";
import { getSession, isCloudAuthEnabled, signIn, signOut, signUp, updateSessionProfile } from "./authService";
import { getCampusRidePreview, getRideLink } from "./rideService";
import { exportExperimentEvents, getExperimentEvents, trackExperimentEvent } from "./experimentService";

const NIGHT_LAT_DELTA = NIGHT_RADIUS_MILES / 69;
const NIGHT_LNG_DELTA = NIGHT_RADIUS_MILES / (69 * Math.cos(NIGHT_CENTER.lat * Math.PI / 180));
const NIGHT_BOUNDS = [
  [NIGHT_CENTER.lat - NIGHT_LAT_DELTA, NIGHT_CENTER.lng - NIGHT_LNG_DELTA],
  [NIGHT_CENTER.lat + NIGHT_LAT_DELTA, NIGHT_CENTER.lng + NIGHT_LNG_DELTA],
];
const SOUTH_VIEW_ANCHOR = [39.9505, -83.0010];
const PLAN_STATE_KEY = "hangtime.plan.v1";

function readSavedPlanState() {
  try {
    const saved = JSON.parse(localStorage.getItem(PLAN_STATE_KEY));
    return saved && typeof saved === "object" ? saved : null;
  } catch {
    return null;
  }
}

const crew = [
  { name: "You", initials: "HB", tone: "ink" },
  { name: "Jake", initials: "JK", tone: "lime" },
  { name: "Maya", initials: "MY", tone: "coral" },
  { name: "Connor", initials: "CO", tone: "violet" },
];

const matches = [
  {
    id: 1, name: "Lane Ave seniors", score: 96, members: 4, range: "21–24", distance: "0.4 mi", night: "Drinks, then decide", status: "Newport at 9:15 → maybe Midway", overlap: "Same first stop", mutuals: 3, verified: 4, socials: ["Instagram", "TikTok"], interests: ["Live music", "Patios", "Buckeyes"], blurb: "Ohio State seniors. Competitive at games, easygoing everywhere else.",
    timeline: [{ time: "9:15", action: "Meet at Newport", place: "High Street" }, { time: "10:30", action: "See how it’s going", place: "Midway, maybe" }],
    people: [
      { name: "Emma", age: 22, role: "Design student", photo: 0, bio: "Usually finds the table and orders for everyone.", interests: ["Concerts", "Tennis", "Film"] },
      { name: "Ryan", age: 23, role: "Finance major", photo: 1, bio: "Will challenge anyone to duckpin bowling.", interests: ["Crew", "Golf", "Trivia"] },
      { name: "Simone", age: 22, role: "Nursing student", photo: 2, bio: "Here for live music and a good patio.", interests: ["R&B", "Running", "Food"] },
      { name: "Theo", age: 24, role: "Software engineer", photo: 3, bio: "The one who actually makes the reservation.", interests: ["Climbing", "DJs", "Coffee"] },
    ],
  },
  {
    id: 2, name: "Grad school four", score: 91, members: 4, range: "22–25", distance: "0.8 mi", night: "Dinner into drinks", status: "South Campus at 8:00 → High Street", overlap: "Similar route", mutuals: 1, verified: 4, socials: ["Instagram"], interests: ["Food", "Indie", "Trivia"], blurb: "Ohio State grad students looking for dinner and a night that can go either way.",
    timeline: [{ time: "8:00", action: "Dinner near campus", place: "South Campus" }, { time: "9:45", action: "Find a patio", place: "High Street" }],
    people: [
      { name: "Noah", age: 24, role: "Product designer", photo: 4, bio: "New restaurant list is always ready.", interests: ["Food", "Art", "Cycling"] },
      { name: "Lucy", age: 23, role: "Teacher", photo: 5, bio: "Prefers patios where you can hear each other.", interests: ["Books", "Travel", "Indie"] },
      { name: "Rafa", age: 25, role: "Architect", photo: 6, bio: "Can turn one drink into a neighborhood tour.", interests: ["Design", "Soccer", "Vinyl"] },
      { name: "Mina", age: 23, role: "Grad student", photo: 7, bio: "Always knows the late-night food spot.", interests: ["Comedy", "Food", "Photos"] },
    ],
  },
  {
    id: 3, name: "North campus roommates", score: 87, members: 4, range: "21–23", distance: "1.1 mi", night: "Catch a show", status: "Newport at 8:30 → late food nearby", overlap: "Same area later", mutuals: 0, verified: 4, socials: ["Instagram", "TikTok"], interests: ["Concerts", "Dancing", "Photos"], blurb: "Ohio State juniors catching a show before a late-night bite.",
    timeline: [{ time: "8:30", action: "Show at Newport", place: "University District" }, { time: "11:00", action: "Late food", place: "High Street" }],
    people: [
      { name: "Dani", age: 22, role: "Marketing major", photo: 8, bio: "Has the playlist ready before the preshow.", interests: ["Pop", "Photos", "Thrifting"] },
      { name: "Austin", age: 23, role: "Journalism major", photo: 9, bio: "Never misses an opener.", interests: ["Live music", "Running", "Film"] },
      { name: "Chloe", age: 21, role: "Psychology major", photo: 10, bio: "Will stay out for one more song.", interests: ["Dance", "Coffee", "Travel"] },
      { name: "Malik", age: 23, role: "Photographer", photo: 11, bio: "Documents the night without slowing it down.", interests: ["Photos", "House", "Basketball"] },
    ],
  },
  {
    id: 4, name: "South campus friends", score: 82, members: 4, range: "21–24", distance: "0.7 mi", night: "Show and one round", status: "Union comedy at 8:00 → one drink nearby", overlap: "Same timing", mutuals: 5, verified: 4, socials: ["Instagram"], interests: ["Comedy", "Buckeyes", "Crew"], blurb: "Classmates, roommates, and one recent grad. Here for the stories.",
    timeline: [{ time: "8:00", action: "Comedy at Ohio Union", place: "Central Campus" }, { time: "9:45", action: "One round nearby", place: "High Street" }],
    people: [
      { name: "Andre", age: 25, role: "Account manager", photo: 12, bio: "Knows when to call it and when not to.", interests: ["Comedy", "Crew", "Cooking"] },
      { name: "Kiara", age: 24, role: "Event producer", photo: 13, bio: "A very reliable judge of whether a place is worth it.", interests: ["Events", "Fashion", "Podcasts"] },
      { name: "Sam", age: 26, role: "Physical therapist", photo: 14, bio: "Here for jokes, sports, and exactly one round.", interests: ["Soccer", "Comedy", "Travel"] },
      { name: "Delaney", age: 24, role: "Copywriter", photo: 15, bio: "Always has a backup plan within walking distance.", interests: ["Writing", "Wine", "Yoga"] },
    ],
  },
  {
    id: 5, name: "High Street house", score: 89, members: 4, range: "21–23", distance: "0.5 mi", night: "Try a few places", status: "Bodega at 8:45 → Pins if there is room", overlap: "Same route south", mutuals: 2, verified: 4, socials: ["Instagram", "TikTok"], interests: ["Games", "Patios", "House music"], blurb: "Four roommates heading south with no commitment beyond the first stop.",
    timeline: [{ time: "8:45", action: "Start on the patio", place: "Bodega" }, { time: "10:15", action: "Games or keep moving", place: "Short North" }],
    people: [
      { name: "Avery", age: 22, role: "Public policy major", photo: 3, bio: "Keeps the group moving when a line gets too long.", interests: ["Patios", "Politics", "Dance"] },
      { name: "Jordan", age: 23, role: "Analyst", photo: 8, bio: "Always down for one competitive game.", interests: ["Basketball", "Games", "DJs"] },
      { name: "Nia", age: 21, role: "Communications major", photo: 13, bio: "Knows which room has the better music.", interests: ["Fashion", "R&B", "Travel"] },
      { name: "Ben", age: 22, role: "Engineering major", photo: 6, bio: "The route planner who pretends not to be.", interests: ["Cycling", "Trivia", "Food"] },
    ],
  },
  {
    id: 6, name: "Short North roommates", score: 86, members: 4, range: "22–25", distance: "1.4 mi", night: "Dinner into drinks", status: "TownHall at 8:00 → rooftop around 10", overlap: "Same second stop", mutuals: 4, verified: 4, socials: ["Instagram"], interests: ["Restaurants", "Rooftops", "Live music"], blurb: "Roommates and coworkers meeting for dinner before deciding how late the night goes.",
    timeline: [{ time: "8:00", action: "Dinner reservation", place: "TownHall" }, { time: "10:00", action: "Find a rooftop", place: "Downtown North" }],
    people: [
      { name: "Priya", age: 24, role: "Research coordinator", photo: 1, bio: "Books the table and lets everyone else choose the next stop.", interests: ["Food", "Pilates", "Indie"] },
      { name: "Marcus", age: 25, role: "Civil engineer", photo: 10, bio: "Prefers a view and a drink you can pronounce.", interests: ["Architecture", "Soccer", "Travel"] },
      { name: "Elise", age: 23, role: "Media planner", photo: 5, bio: "Usually has tickets saved for something nearby.", interests: ["Concerts", "Film", "Running"] },
      { name: "Cam", age: 24, role: "UX designer", photo: 14, bio: "Picks the place based on how easy it is to keep talking.", interests: ["Design", "Coffee", "Vinyl"] },
    ],
  },
  {
    id: 7, name: "Downtown new grads", score: 84, members: 4, range: "22–26", distance: "2.6 mi", night: "Watch the game", status: "Arena District at 7:30 → downtown after", overlap: "Same destination", mutuals: 2, verified: 3, socials: ["Instagram", "LinkedIn"], interests: ["Sports", "Food", "Concerts"], blurb: "Recent grads starting near the arena and looking for a bigger group downtown afterward.",
    timeline: [{ time: "7:30", action: "Watch party", place: "Arena District" }, { time: "10:00", action: "Walk downtown", place: "High Street" }],
    people: [
      { name: "Taylor", age: 23, role: "Consultant", photo: 11, bio: "Will stay for overtime and still make the next plan.", interests: ["Hockey", "Food", "Podcasts"] },
      { name: "Owen", age: 25, role: "Sales associate", photo: 0, bio: "Talks to the next table before the group does.", interests: ["Football", "Golf", "Comedy"] },
      { name: "Jules", age: 24, role: "Lab technician", photo: 7, bio: "Always checks the set list before choosing a route.", interests: ["Live music", "Science", "Photos"] },
      { name: "Micah", age: 22, role: "Financial analyst", photo: 12, bio: "The dependable ride-home coordinator.", interests: ["Basketball", "Cooking", "Travel"] },
    ],
  },
  {
    id: 8, name: "Med campus crew", score: 80, members: 4, range: "23–27", distance: "1.2 mi", night: "Meet for one round", status: "Jackie O's at 9:00 → KEMBA plaza", overlap: "Similar timing", mutuals: 1, verified: 4, socials: ["Instagram"], interests: ["Breweries", "Shows", "Running"], blurb: "A post-shift crew meeting halfway between campus and downtown.",
    timeline: [{ time: "9:00", action: "First round", place: "Italian Village" }, { time: "10:15", action: "Walk toward the show", place: "Arena District" }],
    people: [
      { name: "Leah", age: 26, role: "Medical student", photo: 9, bio: "Off the clock and looking for somewhere lively but easy.", interests: ["Running", "Concerts", "Food"] },
      { name: "Dev", age: 25, role: "Resident", photo: 4, bio: "Will choose the shortest line every time.", interests: ["Soccer", "Coffee", "Comedy"] },
      { name: "Grace", age: 24, role: "PA student", photo: 15, bio: "The friend who gets everyone into one photo.", interests: ["Photos", "Dance", "Travel"] },
      { name: "Cole", age: 27, role: "Physical therapist", photo: 2, bio: "A live-show regular with a reliable food stop after.", interests: ["Guitar", "Climbing", "Pizza"] },
    ],
  },
];

const filters = ["Best plan", "Same places", "Same timing", "Mutuals"];
const nightOptions = [
  { label: "Drinks, then decide", detail: "Start somewhere. Keep the rest open." },
  { label: "Dinner into drinks", detail: "Sit down first, stay out after." },
  { label: "Catch a show", detail: "Music, comedy, or something live." },
  { label: "Watch the game", detail: "Find a crowd and a screen." },
  { label: "Try a few places", detail: "Move around, no fixed destination." },
  { label: "Meet for one round", detail: "Easy start. No pressure to stay out." },
  { label: "Dance somewhere", detail: "A late start and a real dance floor." },
  { label: "Low-key hang", detail: "Somewhere you can actually talk." },
  { label: "Late-night food", detail: "Food is the plan, anything else is extra." },
  { label: "Open to anything", detail: "See what’s busy and decide together." },
];

function estimatedPeople(event) {
  return Math.max(0, Math.round(Number(event?.attending) || Number(event?.groups || 0) * 4));
}

function Icon({ name, size = 20 }) {
  const paths = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>,
    message: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/>,
    spark: <path d="m12 2 1.7 5.3L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.7L12 2ZM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    close: <><path d="m6 6 12 12"/><path d="m18 6-12 12"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    tune: <><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/></>,
    compass: <><circle cx="12" cy="12" r="9"/><path d="m15 9-2 4-4 2 2-4 4-2Z"/></>,
    car: <><path d="m5 17-1 2v2M19 17l1 2v2M3 13l2-6h14l2 6"/><path d="M5 13h14a2 2 0 0 1 2 2v3H3v-3a2 2 0 0 1 2-2Z"/><circle cx="7" cy="15.5" r="1"/><circle cx="17" cy="15.5" r="1"/></>,
    food: <><path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 3v18M17 3c3 2 4 6 0 9"/></>,
  };
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Logo() {
  return <a className="logo" href="#top" aria-label="Hangtime home"><span>H</span><strong>hangtime</strong></a>;
}

function AvatarStack({ people = crew, masked = false, size = "normal" }) {
  const source = people.map((person) => typeof person === "string" ? { initials: person, tone: "masked" } : person);
  return <div className={`avatar-stack ${size}`}>{source.map((person, index) => <span className={masked ? "masked" : person.tone} style={{ "--index": index }} key={`${person.initials}-${index}`}>{masked && index < source.length - 1 ? "" : person.initials}</span>)}</div>;
}

function ProfilePhoto({ person, size = "normal", onClick }) {
  const column = person.photo % 4;
  const row = Math.floor(person.photo / 4);
  const style = {
    backgroundImage: `url(${import.meta.env.BASE_URL}profile-sprite.png)`,
    backgroundPosition: `${column * 33.333}% ${row * 33.333}%`,
  };
  const content = <span className={`profile-photo ${size}`} style={style} role="img" aria-label={`${person.name}'s profile photo`}></span>;
  return onClick ? <button className="profile-photo-button" onClick={onClick} aria-label={`View ${person.name}'s profile`}>{content}</button> : content;
}

function PhotoStack({ people, onPerson, size = "normal" }) {
  return <div className={`photo-stack ${size}`}>{people.map((person, index) => <ProfilePhoto person={person} size={size} onClick={onPerson ? () => onPerson(person) : undefined} key={person.name + index}/>)}</div>;
}

function App() {
  const savedPlanState = useMemo(() => readSavedPlanState(), []);
  const [events, setEvents] = useState([]);
  const [eventSource, setEventSource] = useState("loading");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeView, setActiveView] = useState("map");
  const [mapFilter, setMapFilter] = useState("Crowds");
  const [mapSearch, setMapSearch] = useState("");
  const [showAllLenses, setShowAllLenses] = useState(false);
  const [matchFilter, setMatchFilter] = useState("Best plan");
  const [planOpen, setPlanOpen] = useState(false);
  const [pollOpen, setPollOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [personProfile, setPersonProfile] = useState(null);
  const [matchedGroup, setMatchedGroup] = useState(null);
  const [intentions, setIntentions] = useState({});
  const [claimedDeals, setClaimedDeals] = useState([]);
  const [openToMeet, setOpenToMeet] = useState(true);
  const [account, setAccount] = useState(() => getSession()?.profile || null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [accountOpen, setAccountOpen] = useState(false);
  const [venueOpen, setVenueOpen] = useState(false);
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [planConfigured, setPlanConfigured] = useState(() => Boolean(savedPlanState?.planConfigured));
  const [planLocked, setPlanLocked] = useState(() => Boolean(savedPlanState?.planLocked));
  const [plan, setPlan] = useState(() => savedPlanState?.plan || { crew: "The usual four", area: "High Street", night: "Drinks, then decide", time: "9:30 PM", event: "Open plan" });
  const tonightLabel = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date());

  useEffect(() => {
    trackExperimentEvent("landing_viewed", { source: "github_pages" });
    const controller = new AbortController();
    getTonightEvents({ city: "Columbus", signal: controller.signal }).then(({ events: nextEvents, source }) => {
      setEvents(nextEvents);
      setEventSource(source);
      setSelectedEvent([...nextEvents].sort((a, b) => estimatedPeople(b) - estimatedPeople(a))[0] || null);
    }).catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    try {
      localStorage.setItem(PLAN_STATE_KEY, JSON.stringify({ plan, planConfigured, planLocked }));
    } catch {
      // The planning flow remains usable when browser storage is unavailable.
    }
  }, [plan, planConfigured, planLocked]);

  const orderedMatches = useMemo(() => {
    const next = [...matches];
    if (matchFilter === "Mutuals") return next.sort((a, b) => b.mutuals - a.mutuals);
    if (matchFilter === "Same timing") return next.sort((a, b) => Number(b.timeline[0].time === "9:15") - Number(a.timeline[0].time === "9:15"));
    if (matchFilter === "Same places") return next.sort((a, b) => Number(b.overlap === "Same first stop") - Number(a.overlap === "Same first stop"));
    return next;
  }, [matchFilter]);

  const lensStats = useMemo(() => {
    const people = events.reduce((total, event) => total + estimatedPeople(event), 0);
    const deals = events.filter((event) => event.deal).length;
    const food = events.filter((event) => /food|dinner|pizza|donut/i.test(`${event.category} ${event.title}`)).length;
    const rideMins = events.flatMap((event) => getCampusRidePreview({ name: event.venue, lat: event.lat, lng: event.lng }).providers.map((provider) => Number(provider.fare.match(/\d+/)?.[0] || 99)));
    const rideFrom = rideMins.length ? Math.min(...rideMins) : 6;
    return [
      { label: "Crowds", icon: "users", value: `${people} nearby`, detail: "Where people are going" },
      { label: "Deals", icon: "spark", value: `${deals} tonight`, detail: "Modeled student offers" },
      { label: "Events", icon: "calendar", value: `${events.length} tonight`, detail: "Music, games, comedy" },
      { label: "Food", icon: "food", value: `${food} late spots`, detail: "Food around campus" },
      { label: "Ride cost", icon: "car", value: `from $${rideFrom}`, detail: "From Ohio Union" },
    ];
  }, [events]);

  const visibleEvents = useMemo(() => events.filter((event) => {
    const query = mapSearch.trim().toLowerCase();
    const matchesSearch = !query || `${event.venue} ${event.title} ${event.area} ${event.category}`.toLowerCase().includes(query);
    const eventText = `${event.category} ${event.title}`;
    const isFood = /food|dinner|pizza|donut/i.test(eventText);
    const matchesFilter = mapFilter === "Crowds" || mapFilter === "Ride cost" || (mapFilter === "Deals" && event.deal) || (mapFilter === "Food" && isFood) || (mapFilter === "Events" && !isFood);
    return matchesSearch && matchesFilter;
  }), [events, mapFilter, mapSearch]);

  useEffect(() => {
    if (visibleEvents.length && !visibleEvents.some((event) => event.id === selectedEvent?.id)) {
      setSelectedEvent([...visibleEvents].sort((a, b) => estimatedPeople(b) - estimatedPeople(a))[0]);
    }
  }, [selectedEvent?.id, visibleEvents]);

  const joinEvent = (event) => {
    trackExperimentEvent("destination_added", { eventId: event.id, venue: event.venue });
    setPlan((current) => ({ ...current, event: event.title, area: event.area }));
    setToast(`${event.title} added to your night`);
  };

  const setIntent = (event, intent) => {
    const nextIntent = intentions[event.id] === intent ? null : intent;
    setIntentions((current) => ({ ...current, [event.id]: nextIntent }));
    setPlan((current) => ({ ...current, event: event.title, area: event.area }));
    trackExperimentEvent(nextIntent ? "crew_status_shared" : "crew_status_removed", { eventId: event.id, status: nextIntent });
    setToast(!nextIntent ? `Status removed from ${event.venue}` : nextIntent === "here" ? `Checked in at ${event.venue}` : nextIntent === "heading" ? `Your crew is heading to ${event.venue}` : `${event.venue} added to your shortlist`);
  };

  const claimDeal = (event) => {
    trackExperimentEvent("deal_saved", { eventId: event.id, venue: event.venue });
    setClaimedDeals((current) => current.includes(event.id) ? current : [...current, event.id]);
    setToast(`Crew deal saved for ${event.venue}`);
  };

  const sendWave = (group) => {
    trackExperimentEvent("introduction_requested", { groupId: group.id });
    if (group.id === 1) {
      setMatchedGroup(group);
      setProfile(null);
    } else {
      setToast(`Wave sent to ${group.name}`);
      setProfile(null);
    }
  };

  return (
    <div className="app" id="top">
      <header className="topbar">
        <Logo />
        <button className="city-switcher"><span className="status-dot"></span>Ohio State tonight<Icon name="chevron" size={16}/></button>
        <nav aria-label="Primary navigation"><a className="active" href="#tonight">Tonight</a>{planLocked && <a href="#matches">Matches</a>}<a href="#safety">Safety</a></nav>
        {account ? <button className="profile-button" onClick={() => setAccountOpen(true)}><span>{account.name?.split(" ").map((part) => part[0]).join("").slice(0,2).toUpperCase() || "HT"}</span><span className="profile-copy"><strong>{account.name}</strong><small>{account.crewName || "Build your crew"}</small></span><Icon name="chevron" size={16}/></button> : <div className="auth-actions"><button onClick={() => { setAuthMode("signin"); setAuthOpen(true); }}>Sign in</button><button onClick={() => { setAuthMode("signup"); setAuthOpen(true); }}>Create account</button></div>}
      </header>

      <main>
        <section className="tonight shell" id="tonight">
          <div className="map-first-heading">
            <div><div className="eyebrow"><span>{tonightLabel}</span><i></i><span>Ohio State tonight</span></div><h1>Pick tonight's<br/><em>first stop.</em></h1></div>
            <div className="map-head-actions"><p>See what's busy, compare your options, and choose together.</p><button onClick={() => { trackExperimentEvent("plan_started"); setPlanOpen(true); }}>{planConfigured ? "Edit tonight's plan" : "Start with your crew"}<Icon name="arrow"/></button></div>
          </div>

          <div className="single-next-step" role="status">
            <span>{planLocked ? <Icon name="check" size={14}/> : planConfigured ? "2" : "1"}</span>
            <div><strong>{planLocked ? `${plan.event} is locked` : planConfigured ? "Compare a few places, then vote" : "Tell us what kind of night you want"}</strong><small>{planLocked ? "Your plan is ready. Matching is now optional." : planConfigured ? "Tap a marker or ranked destination. Vote when you're ready." : "It takes about 30 seconds."}</small></div>
            {planConfigured && !planLocked && <button onClick={() => { trackExperimentEvent("crew_vote_opened"); setPollOpen(true); }}>Vote + lock</button>}
          </div>

          <details className="prototype-disclosure"><summary><Icon name="shield" size={14}/>Modeled demo data</summary><p>Crowd counts, profiles, matches, and offers are fictional or modeled unless labeled live. Do not enter real credentials.</p></details>

          <div className="night-lenses" aria-label="Explore tonight">{(showAllLenses || planConfigured ? lensStats : lensStats.slice(0, 3)).map((lens) => <button className={mapFilter === lens.label ? "active" : ""} onClick={() => setMapFilter(lens.label)} key={lens.label}><span><Icon name={lens.icon} size={15}/>{lens.label}</span><strong>{lens.value}</strong><small>{lens.detail}</small></button>)}{!showAllLenses && !planConfigured && <button className="more-lenses" onClick={() => setShowAllLenses(true)}><span><Icon name="tune" size={15}/>More</span><strong>Food + rides</strong><small>Show every planning signal</small></button>}</div>

          <div className="map-toolbar compact"><label><Icon name="compass" size={17}/><input value={mapSearch} onChange={(event) => setMapSearch(event.target.value)} placeholder="Search High Street + downtown"/></label><div className="view-tabs" aria-label="Choose view">{["map", "events"].map((view) => <button className={activeView === view ? "active" : ""} onClick={() => setActiveView(view)} key={view}>{view === "map" ? <Icon name="compass" size={17}/> : <Icon name="calendar" size={17}/>} {view}</button>)}</div></div>

          <div className={`city-board ${activeView}`}>
            {eventSource === "loading" ? <div className="map-panel map-loading"><span className="live-dot"></span><strong>Building tonight's map</strong></div> : <NightMap events={visibleEvents} selected={selectedEvent} intentions={intentions} lens={mapFilter} onSelect={setSelectedEvent}/>}
            <EventRail events={visibleEvents} source={eventSource} selected={selectedEvent} intention={selectedEvent ? intentions[selectedEvent.id] : null} claimed={selectedEvent ? claimedDeals.includes(selectedEvent.id) : false} onSelect={setSelectedEvent} onIntent={setIntent} onClaim={claimDeal}/>
          </div>
        </section>

        {planConfigured && <section className="plan-bar shell" aria-label="Your plan tonight">
          <div className="plan-crew"><AvatarStack/><span><small>{account ? account.crewName || "Your crew" : "Demo crew"}</small><strong>{plan.crew}</strong></span></div>
          <button onClick={() => setPlanOpen(true)}><Icon name="pin"/><span><small>Area</small><strong>{plan.area}</strong></span></button>
          <button onClick={() => setPlanOpen(true)}><Icon name="spark"/><span><small>Type of night</small><strong>{plan.night}</strong></span></button>
          <button onClick={() => setPlanOpen(true)}><Icon name="clock"/><span><small>Start</small><strong>{plan.time}</strong></span></button>
          <div className="plan-event"><span><small>Plan</small><strong>{plan.event}</strong></span></div>
          <div className="plan-actions"><button onClick={() => setPlanOpen(true)}>Edit</button><button className="lock-plan-cta" disabled={!events.length} onClick={() => { trackExperimentEvent("crew_vote_opened"); setPollOpen(true); }}>{planLocked ? "Vote again" : "Vote + lock plan"}</button></div>
        </section>}

        {planConfigured && <NextMoves events={events} onSelect={(event) => { setSelectedEvent(event); document.getElementById("tonight")?.scrollIntoView({ behavior: "smooth" }); }}/>}

        {planLocked && <section className="matches shell" id="matches">
          <div className="section-title-row matches-heading">
            <div><span className="kicker">{!planLocked ? "AVAILABLE AFTER YOUR PLAN IS LOCKED" : openToMeet ? "OPEN TO ONE INTRODUCTION" : "DISCOVERY PAUSED"}</span><h2>Crews whose plans overlap.</h2></div>
            <div className="filter-row"><Icon name="tune" size={17}/>{filters.map((filter) => <button className={matchFilter === filter ? "active" : ""} onClick={() => setMatchFilter(filter)} key={filter}>{filter}</button>)}</div>
          </div>
          <div className="meeting-control"><div><span className="live-dot"></span><p><strong>Meet another crew tonight</strong><small>{planLocked ? "Only groups near the same place and time can see you." : "First lock a destination so matching has a real place and time."}</small></p></div><button disabled={!planLocked} className={planLocked && openToMeet ? "on" : ""} onClick={() => setOpenToMeet((current) => !current)} aria-pressed={planLocked && openToMeet} aria-label={planLocked ? "Toggle crew introductions" : "Crew introductions unavailable until a destination is locked"}><i></i></button></div>
          {openToMeet ? <div className="match-grid">{orderedMatches.map((group, index) => <MatchCard group={group} featured={index === 0} onOpen={() => setProfile(group)} onPerson={(person) => setPersonProfile({ person, group })} onWave={() => sendWave(group)} key={group.id}/>)}</div> : <div className="matches-paused"><Icon name="lock" size={24}/><strong>Introductions are paused</strong><p>Your plan remains visible only to your crew.</p></div>}
        </section>}

        <section className="privacy shell" id="safety">
          <div className="privacy-mark"><Icon name="shield" size={30}/></div>
          <div><span className="kicker">DESIGNED FOR DISCRETION</span><h2>People visible.<br/>Access controlled.</h2></div>
          <p>See who you may meet and open individual profiles. Direct social handles, messaging, and contact details stay private until both groups match.</p>
          <div className="privacy-points"><span><Icon name="check" size={15}/>Fictional profiles in this concept</span><span><Icon name="check" size={15}/>Handles after matching</span><span><Icon name="check" size={15}/>Status sharing is reversible</span><span><Icon name="check" size={15}/>Report and block controls</span></div>
        </section>

        <DealsSection events={events} claimedDeals={claimedDeals} onClaim={claimDeal}/>
      </main>

      <footer className="footer shell"><Logo/><p>One plan. More possibilities.</p><div><a href="#safety">Safety</a><button onClick={() => { trackExperimentEvent("venue_interest_opened"); setVenueOpen(true); }}>For venues</button><button onClick={() => setEvidenceOpen(true)}>Test evidence</button><span>Concept MVP</span></div></footer>

      {planOpen && (
        <PlanModal plan={plan} onClose={() => setPlanOpen(false)} onSave={(next) => { trackExperimentEvent("plan_configured", { area: next.area, night: next.night, time: next.time }); setPlan(next); setPlanConfigured(true); setPlanOpen(false); setToast("Step 1 complete. Compare places, then vote."); }}/>
      )}
      {pollOpen && (
        <CrewPoll events={events.slice(0, 3)} onClose={() => setPollOpen(false)} onChoose={(event) => { trackExperimentEvent("destination_locked", { eventId: event.id, venue: event.venue }); joinEvent(event); setPlanConfigured(true); setPlanLocked(true); setPollOpen(false); setToast(`${event.venue} is locked as tonight's plan`); }}/>
      )}
      {authOpen && (
        <AuthModal initialMode={authMode} onClose={() => setAuthOpen(false)} onAuthenticated={(session) => { setAccount(session.profile); setAuthOpen(false); setToast(session.needsVerification ? "Check your email to verify your account" : `Welcome${session.profile.name ? `, ${session.profile.name.split(" ")[0]}` : ""}`); }}/>
      )}
      {accountOpen && account && (
        <AccountModal account={account} onClose={() => setAccountOpen(false)} onUpdate={(profile) => { const session = updateSessionProfile(profile); setAccount(session.profile); setToast("Profile updated"); }} onSignOut={() => { signOut(); setAccount(null); setAccountOpen(false); setToast("Signed out"); }}/>
      )}
      {profile && (
        <ProfileModal group={profile} onClose={() => setProfile(null)} onPerson={(person) => setPersonProfile({ person, group: profile })} onWave={() => sendWave(profile)}/>
      )}
      {personProfile && (
        <PersonModal person={personProfile.person} group={personProfile.group} onClose={() => setPersonProfile(null)} onBack={() => { setPersonProfile(null); setProfile(personProfile.group); }}/>
      )}
      {matchedGroup && (
        <MatchModal group={matchedGroup} onClose={() => setMatchedGroup(null)} onMessage={() => { setMatchedGroup(null); setToast("Group chat opened"); }}/>
      )}
      {venueOpen && <VenueInterestModal onClose={() => setVenueOpen(false)} onSubmit={(details) => { trackExperimentEvent("venue_interest_submitted", details); setVenueOpen(false); setToast("Venue interest recorded for this prototype"); }}/>} {/* local payer test */}
      {evidenceOpen && <EvidenceModal onClose={() => setEvidenceOpen(false)}/>} {/* local evidence export */}
      {toast && <div className="toast" role="status" aria-live="polite"><Icon name="check" size={17}/>{toast}</div>}
    </div>
  );
}

const crowdColors = {
  coral: "#4053c7",
  violet: "#756f96",
  lime: "#4f8062",
  blue: "#547f9e",
  amber: "#ad7b34",
  pink: "#995c70",
};

const crowdOffsets = [
  [.011, -.014],
  [-.009, .015],
  [.014, .009],
  [-.012, -.011],
  [.007, .018],
  [-.015, .006],
];

function projectedGroups(event, horizon, tick = 0) {
  const trendRate = /filling/i.test(event.trend || "") ? .52 : /rising/i.test(event.trend || "") ? .34 : .14;
  const forecast = Math.round(event.groups * trendRate * (horizon / 30));
  const liveChange = horizon === 0 ? [0, 1, 0, 2][tick % 4] : 0;
  return event.groups + forecast + liveChange;
}

function getCrowdFocus(events, horizon, intentions = {}) {
  const places = events.map((event) => {
    const lat = Number(event.lat);
    const lng = Number(event.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    const currentGroups = Math.max(1, Number(event.groups) || 1);
    const peoplePerGroup = Math.max(2, (Number(event.attending) || currentGroups * 4) / currentGroups);
    const intentBoost = intentions[event.id] === "here" ? 4 : intentions[event.id] === "heading" ? 2 : intentions[event.id] === "considering" ? 1 : 0;
    const people = projectedGroups(event, horizon) * peoplePerGroup + intentBoost;
    return { lat, lng, people, area: event.area || "campus" };
  }).filter(Boolean);

  const totalWeight = places.reduce((sum, place) => sum + place.people, 0);
  if (!places.length || !totalWeight) return null;
  const areaWeights = places.reduce((areas, place) => ({ ...areas, [place.area]: (areas[place.area] || 0) + place.people }), {});
  const area = Object.entries(areaWeights).sort((a, b) => b[1] - a[1])[0]?.[0] || "campus";
  return {
    lat: places.reduce((sum, place) => sum + place.lat * place.people, 0) / totalWeight,
    lng: places.reduce((sum, place) => sum + place.lng * place.people, 0) / totalWeight,
    people: Math.round(totalWeight),
    area,
  };
}

function NightMap({ events, selected, intentions, lens, onSelect }) {
  const mapNode = useRef(null);
  const mapInstance = useRef(null);
  const crowdLayer = useRef(null);
  const locationLayer = useRef(null);
  const initialSelectionSkipped = useRef(false);
  const [horizon, setHorizon] = useState(0);
  const [tick, setTick] = useState(0);
  const [locating, setLocating] = useState(false);
  const [mapZoom, setMapZoom] = useState(13.5);
  const activityCenter = useMemo(() => getCrowdFocus(events, horizon, intentions), [events, horizon, intentions]);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((current) => current + 1), 4500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!mapNode.current || mapInstance.current) return undefined;
    const map = L.map(mapNode.current, {
      center: [activityCenter?.lat || NIGHT_CENTER.lat, activityCenter?.lng || NIGHT_CENTER.lng],
      zoom: 13.5,
      zoomSnap: .5,
      minZoom: 13,
      maxZoom: 18,
      maxBounds: NIGHT_BOUNDS,
      maxBoundsViscosity: 1,
      zoomControl: false,
      attributionControl: true,
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    crowdLayer.current = L.layerGroup().addTo(map);
    locationLayer.current = L.layerGroup().addTo(map);
    mapInstance.current = map;
    map.on("zoomend", () => setMapZoom(map.getZoom()));
    const resizeObserver = new ResizeObserver(() => map.invalidateSize({ animate: false }));
    resizeObserver.observe(mapNode.current);
    window.setTimeout(() => map.invalidateSize({ animate: false }), 120);
    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!activityCenter || !mapInstance.current) return undefined;
    const timer = window.setTimeout(() => {
      mapInstance.current?.invalidateSize({ animate: false, pan: false });
      const points = events
        .map((event) => [Number(event.lat), Number(event.lng)])
        .filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng));
      if (points.length > 1) {
        mapInstance.current?.fitBounds(L.latLngBounds([...points, SOUTH_VIEW_ANCHOR]).pad(.06), { padding: [28, 28], maxZoom: 13.5, animate: false });
      } else {
        mapInstance.current?.setView([activityCenter.lat, activityCenter.lng], 13.5, { animate: false });
      }
    }, 180);
    return () => window.clearTimeout(timer);
  }, [activityCenter, events]);

  useEffect(() => {
    const map = mapInstance.current;
    const layer = crowdLayer.current;
    if (!map || !layer) return;
    layer.clearLayers();

    const showVenueDetail = mapZoom >= 14.5 || events.length <= 8;
    if (!showVenueDetail) {
      const districtName = (area = "") => {
        if (/downtown$/i.test(area)) return "Downtown";
        if (/arena|downtown north/i.test(area)) return "Arena District";
        if (/short north|italian/i.test(area)) return "Short North";
        return "Campus";
      };
      const districts = Object.values(events.reduce((result, event) => {
        const lat = Number(event.lat);
        const lng = Number(event.lng);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return result;
        const district = districtName(event.area);
        const groups = projectedGroups(event, horizon, tick);
        const current = result[district] || { district, groups: 0, latTotal: 0, lngTotal: 0, events: [] };
        current.groups += groups;
        current.latTotal += lat * groups;
        current.lngTotal += lng * groups;
        current.events.push(event);
        result[district] = current;
        return result;
      }, {}));

      districts.forEach((district) => {
        const point = [district.latTotal / district.groups, district.lngTotal / district.groups];
        const representative = [...district.events].sort((a, b) => b.groups - a.groups)[0];
        const selectedHere = district.events.some((event) => event.id === selected?.id);
        const value = lens === "Deals" ? district.events.filter((event) => event.deal).length : lens === "Events" || lens === "Food" ? district.events.length : district.groups;
        const unit = lens === "Deals" ? "deals" : lens === "Events" || lens === "Food" ? "spots" : "crews";
        L.circle(point, {
          radius: 240 + district.groups * 6,
          color: selectedHere ? "#4053c7" : "#17191f",
          weight: selectedHere ? 2 : 1,
          opacity: .3,
          fillColor: selectedHere ? "#4053c7" : "#17191f",
          fillOpacity: .08,
          interactive: false,
          className: "crowd-heat-circle",
        }).addTo(layer);
        const icon = L.divIcon({
          className: "hangtime-div-icon district-icon",
          html: `<div class="district-map-marker ${selectedHere ? "selected" : ""}"><strong>${value}</strong><span>${district.district}</span><small>${unit}</small></div>`,
          iconSize: [120, 48],
          iconAnchor: [60, 24],
        });
        L.marker(point, { icon, title: `${district.district}: ${district.groups} crews` })
          .on("click", () => onSelect(representative))
          .addTo(layer);
      });
    }

    events.forEach((event, index) => {
      const lat = Number(event.lat);
      const lng = Number(event.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
      const point = [lat, lng];
      const count = projectedGroups(event, horizon, tick);
      const color = crowdColors[event.tone] || crowdColors.coral;
      const isSelected = selected?.id === event.id;
      const ridePreview = getCampusRidePreview({ name: event.venue, lat, lng });
      const rideMinimum = ridePreview.providers[0].fare.match(/\d+/)?.[0] || "6";
      const markerValue = lens === "Ride cost" ? `$${rideMinimum}` : lens === "Deals" ? (event.deal ? "Deal" : "—") : count;
      const markerLabel = lens === "Ride cost" ? "ride" : lens === "Deals" ? "tonight" : lens === "Food" ? "people" : "crews";

      if (showVenueDetail) {
        L.circle(point, {
          radius: 115 + count * 10,
          color,
          weight: isSelected ? 2 : 1,
          opacity: isSelected ? .72 : .3,
          fillColor: color,
          fillOpacity: isSelected ? .18 : .1,
          interactive: false,
          className: "crowd-heat-circle",
        }).addTo(layer);

        const venueIcon = L.divIcon({
          className: "hangtime-div-icon",
          html: `<div class="venue-map-marker ${events.length > 12 ? "dense" : ""} ${isSelected ? "selected" : ""} ${intentions[event.id] ? "committed" : ""}" style="--marker:${color}"><strong>${markerValue}</strong><span>${markerLabel}</span>${intentions[event.id] ? '<i>✓</i>' : ""}</div>`,
          iconSize: events.length > 12 ? [48, 48] : [58, 58],
          iconAnchor: events.length > 12 ? [24, 24] : [29, 29],
        });
        L.marker(point, { icon: venueIcon, title: `${event.venue}: ${count} crews` })
          .on("click", () => onSelect(event))
          .addTo(layer);
      }

      if (showVenueDetail && lens === "Crowds" && index < 8) {
        const offset = crowdOffsets[index % crowdOffsets.length];
        let origin = [lat + offset[0], lng + offset[1]];
        if (!isWithinNightRadius({ lat: origin[0], lng: origin[1] })) origin = [lat + offset[0] * .4, lng + offset[1] * .4];
        const progress = Math.min(.88, .28 + ((tick + index) % 4) * .13 + horizon / 100);
        const moving = [origin[0] + (lat - origin[0]) * progress, origin[1] + (lng - origin[1]) * progress];
        const inbound = Math.max(1, Math.round(count * (/rising|filling/i.test(event.trend || "") ? .24 : .12)));
        L.polyline([origin, point], { color, weight: 1.5, opacity: .52, dashArray: "4 7", interactive: false }).addTo(layer);
        L.marker(moving, {
          interactive: false,
          icon: L.divIcon({
            className: "hangtime-div-icon moving-group-icon",
            html: `<div class="moving-group" style="--marker:${color}"><i></i><span>${inbound} inbound</span></div>`,
            iconSize: [82, 24],
            iconAnchor: [12, 12],
          }),
        }).addTo(layer);
      }
    });

  }, [activityCenter, events, horizon, intentions, lens, mapZoom, onSelect, selected?.id, tick]);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !selected || !Number.isFinite(Number(selected.lat)) || !Number.isFinite(Number(selected.lng))) return;
    if (!initialSelectionSkipped.current) {
      initialSelectionSkipped.current = true;
      return;
    }
    map.setView([selected.lat, selected.lng], Math.max(map.getZoom(), 15), { animate: false });
  }, [selected?.id]);

  const centerOnCrowd = () => {
    if (!activityCenter || !mapInstance.current) return;
    mapInstance.current.flyTo([activityCenter.lat, activityCenter.lng], 13.5, { duration: .65 });
  };

  const locate = () => {
    if (!navigator.geolocation || !mapInstance.current) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const point = [coords.latitude, coords.longitude];
      locationLayer.current?.clearLayers();
      L.circleMarker(point, { radius: 8, color: "#fff", weight: 3, fillColor: "#4053c7", fillOpacity: 1 })
        .bindTooltip("Your approximate location", { direction: "top" })
        .addTo(locationLayer.current);
      mapInstance.current.flyTo(point, 15, { duration: .7 });
      setLocating(false);
    }, () => setLocating(false), { enableHighAccuracy: false, timeout: 8000 });
  };

  const ranked = [...events].sort((a, b) => projectedGroups(b, horizon, tick) - projectedGroups(a, horizon, tick));
  const leader = ranked[0];
  const rising = events.filter((event) => /rising|filling/i.test(event.trend || "")).reduce((total, event) => total + Math.max(1, Math.round(event.groups * .2)), 0);
  const feedEvent = ranked[tick % Math.max(1, ranked.length)] || leader;
  const lensSummary = {
    Crowds: { title: activityCenter ? `${activityCenter.area} is tonight's center` : "Finding tonight's crowds", detail: activityCenter ? `Centered on ${activityCenter.people} people${horizon ? ` projected in ${horizon} minutes` : " active now"}.` : `${rising} crews are moving toward rising spots.` },
    Deals: { title: `${events.length} student deals tonight`, detail: "Tap a marker to see the offer and deadline." },
    Events: { title: `${events.length} events around campus`, detail: "Music, games, comedy, and student programming." },
    Food: { title: `${events.length} late food stops`, detail: "See where people are eating before and after." },
    "Ride cost": { title: `Corridor rides from ${leader ? getCampusRidePreview({ name: leader.venue, lat: leader.lat, lng: leader.lng }).providers[0].fare : "$6"}`, detail: "Modeled from Ohio Union. Open an app for the live fare." },
  }[lens] || { title: "Tonight along High Street", detail: "Tap any place to see the details." };

  return <div className="map-panel real-map-panel" aria-label="Live High Street to downtown Columbus crowd activity map">
    <div className="leaflet-map" ref={mapNode}></div>
    <div className="crowd-live-card">
      <div><span className="live-dot"></span><strong>{lens}</strong><small>Live activity center</small></div>
      <h3>{lensSummary.title}</h3>
      <p>{lensSummary.detail}</p>
      {lens === "Crowds" && <div className="forecast-tabs" aria-label="Crowd forecast time">{[0, 15, 30].map((minutes) => <button className={horizon === minutes ? "active" : ""} onClick={() => setHorizon(minutes)} key={minutes}>{minutes === 0 ? "Now" : `+${minutes} min`}</button>)}</div>}
    </div>
    {lens === "Crowds" && feedEvent && <div className="movement-feed"><span className="movement-pulse"></span><strong>{Math.max(2, Math.round(feedEvent.groups * .18))} crews moving toward {feedEvent.venue}</strong><small>updated just now</small></div>}
    <div className="map-privacy-note"><Icon name="shield" size={13}/>High Street → downtown · approximate groups</div>
    <div className="map-controls"><button onClick={() => mapInstance.current?.zoomIn()} aria-label="Zoom in">+</button><button onClick={() => mapInstance.current?.zoomOut()} aria-label="Zoom out">−</button><button onClick={centerOnCrowd} aria-label="Center on live crowd"><Icon name="users" size={16}/></button><button aria-label="Use my location" onClick={locate} className={locating ? "locating" : ""}><Icon name="compass" size={16}/></button></div>
    {!events.length && <div className="map-empty"><strong>No places match that view</strong><span>Try another filter or search.</span></div>}
  </div>;
}

function LegacyNightMap({ events, selected, intentions, scale, onScale, onSelect }) {
  return <div className="map-panel" aria-label="Tonight activity map">
    <div className="map-canvas" style={{ transform: `scale(${scale})` }}>
      <div className="map-grid"></div><div className="river"></div>
      <span className="map-label campus">CAMPUS</span><span className="map-label short-north">SHORT NORTH</span><span className="map-label downtown">DOWNTOWN</span><span className="map-label old-north">OLD NORTH</span>
      <span className="road road-one"></span><span className="road road-two"></span><span className="road road-three"></span><span className="road road-four"></span>
      {events.map((event) => <button className={`map-marker ${selected?.id === event.id ? "selected" : ""} ${intentions[event.id] ? "committed" : ""}`} style={{ left: `${event.x}%`, top: `${event.y}%`, "--heat": `${Math.min(92, 42 + event.attending / 2)}px` }} onClick={() => onSelect(event)} aria-label={`${event.title}, ${event.groups} groups`} key={event.id}><span className={`heat ${event.tone}`}></span>{intentions[event.id] && <i className="intent-pin"><Icon name="check" size={10}/></i>}<b>{event.groups + (intentions[event.id] ? 1 : 0)}</b><small>crews</small></button>)}
      {!events.length && <div className="map-empty"><strong>No places match that view</strong><span>Try another filter or search.</span></div>}
    </div>
    <div className="map-legend"><span><i className="warm"></i>More active</span><span><i></i>Less active</span></div>
    <div className="map-controls"><button onClick={() => onScale(Math.min(1.35, scale + .1))} aria-label="Zoom in">+</button><button onClick={() => onScale(Math.max(1, scale - .1))} aria-label="Zoom out">−</button><button aria-label="Use my location" onClick={() => navigator.geolocation?.getCurrentPosition(() => {}, () => {})}><Icon name="compass" size={16}/></button></div>
  </div>;
}

function RideOptions({ event }) {
  const destination = useMemo(() => ({ name: event.venue, lat: Number(event.lat), lng: Number(event.lng) }), [event.id, event.lat, event.lng, event.venue]);
  const preview = useMemo(() => getCampusRidePreview(destination), [destination]);
  return <section className="ride-preview" aria-label={`Ride options to ${event.venue}`}>
    <div className="ride-preview-head"><span><Icon name="car" size={14}/>Ride from Ohio Union</span><small>{preview.distance} · {preview.walkMinutes} min walk</small></div>
    <div className="ride-provider-grid">{preview.providers.map((provider) => <a href={getRideLink(provider.id, destination)} target="_blank" rel="noreferrer" key={provider.id}>
      <span><strong>{provider.name}</strong><small>{provider.eta} pickup</small></span><b>{provider.fare}</b><em>Check live fare ↗</em>
    </a>)}</div>
    <p>Campus estimate only. Uber and Lyft confirm the live price in their apps.</p>
  </section>;
}

function EventRail({ events, source, selected, intention, claimed, onSelect, onIntent, onClaim }) {
  const [showAllRankings, setShowAllRankings] = useState(false);
  const rankedEvents = useMemo(() => [...events].sort((a, b) => estimatedPeople(b) - estimatedPeople(a)), [events]);
  const totalPeople = rankedEvents.reduce((total, event) => total + estimatedPeople(event), 0);
  const maxPeople = Math.max(1, ...rankedEvents.map(estimatedPeople));
  const topEvents = rankedEvents.slice(0, 3);
  const selectedRank = selected ? rankedEvents.findIndex((event) => event.id === selected.id) + 1 : 0;
  const selectedOutsideTop = selectedRank > 0 && !topEvents.some((event) => event.id === selected.id) ? selected : null;
  const visibleRankings = showAllRankings ? rankedEvents : selectedOutsideTop ? [...topEvents, selectedOutsideTop] : topEvents;

  return <aside className="event-rail">
    <div className="rail-top"><div><span className={`source-dot ${source}`}></span><strong>{source === "live" ? "Live crowd ranking" : source === "loading" ? "Building ranking" : "Where people are"}</strong></div><span>{events.length} spots</span></div>
    <div className="ranking-overview"><div><span>TONIGHT, RIGHT NOW</span><strong>{totalPeople.toLocaleString()} people nearby</strong></div><small>Ranked by estimated attendance</small></div>
    <div className="ranked-places" aria-label="Places ranked by estimated attendance">
      {visibleRankings.map((event) => {
        const people = estimatedPeople(event);
        const rank = rankedEvents.findIndex((candidate) => candidate.id === event.id) + 1;
        const dealSummary = event.deal || `${event.cover || "No cover info"} · ${event.wait || "Check wait"}`;
        return <button className={`ranking-row ${selected?.id === event.id ? "selected" : ""}`} onClick={() => onSelect(event)} aria-label={`Rank ${rank}, ${event.venue}, ${people} people`} key={event.id}>
          <span className="rank-number">{String(rank).padStart(2, "0")}</span>
          <span className="rank-copy"><strong>{event.venue}</strong><small>{event.area} · {event.trend || "Steady"}</small><span className="rank-deal"><em>{event.deal ? "DEAL" : "INFO"}</em>{dealSummary}</span></span>
          <span className="rank-count"><strong>{people}</strong><small>people</small></span>
          <span className="rank-track"><i style={{ width: `${Math.max(12, people / maxPeople * 100)}%` }}></i></span>
        </button>;
      })}
    </div>
    {rankedEvents.length > 3 && <button className="ranking-toggle" onClick={() => setShowAllRankings((current) => !current)}>{showAllRankings ? "Show top three" : `View all ${rankedEvents.length} places`}<Icon name="chevron" size={14}/></button>}
    {selected && <div className="venue-intel">
      <div className="intel-live"><span className="live-dot"></span><strong>{selectedRank > 0 ? `#${selectedRank} tonight · ` : ""}{estimatedPeople(selected)} people</strong><small>Updated {selected.updated || "recently"}</small></div>
      <h2>{selected.venue}</h2><p>{selected.title} · {selected.time} · {selected.age || "Check age policy"}</p>
      <div className="intel-grid"><div><small>WAIT</small><strong>{selected.wait || "Check venue"}</strong></div><div><small>COVER</small><strong>{selected.cover || "Check venue"}</strong></div><div><small>PEAK</small><strong>{selected.peak || selected.time}</strong></div><div><small>YOUR NETWORK</small><strong>{selected.friends || 0} going</strong></div></div>
      <div className="confidence"><Icon name="shield" size={13}/>{selected.confidence || "Community estimate"} · {selected.groups} student crews committed</div>
      {selected.deal && <div className="intel-deal"><span>TONIGHT'S DEAL</span><strong>{selected.deal}</strong><button className={claimed ? "claimed" : ""} onClick={() => onClaim(selected)}>{claimed ? "Saved" : "Save"}</button></div>}
      <RideOptions event={selected}/>
      <div className="intent-picker"><span>Your crew</span><div>{[["considering","Considering"],["heading","Heading there"],["here","Here now"]].map(([value,label]) => <button className={intention === value ? "active" : ""} onClick={() => onIntent(selected,value)} key={value}>{intention === value && <Icon name="check" size={12}/>} {label}</button>)}</div></div>
    </div>}
    <p className="data-note">{source === "live" ? "Live event listings are mixed with modeled, privacy-safe crowds and prototype offers." : "Prototype data: crowds, waits, and offers are modeled to show the complete live experience."}</p>
  </aside>;
}

function NextMoves({ events, onSelect }) {
  if (events.length < 3) return null;
  const moves = [
    { tag: "BEST OVERALL", event: events[0], title: `${events[0].venue} before ${events[0].peak || "the rush"}`, detail: `${events[0].groups} crews · ${events[0].wait || "short wait"}` },
    { tag: "BEST DEAL", event: events.find((event) => event.deal) || events[1], title: (events.find((event) => event.deal) || events[1]).deal || "Lowest cover nearby", detail: (events.find((event) => event.deal) || events[1]).venue },
    { tag: "BEST PEOPLE", event: [...events].sort((a,b) => (b.friends || 0) - (a.friends || 0))[0], title: `${[...events].sort((a,b) => (b.friends || 0) - (a.friends || 0))[0].friends} people in your network`, detail: [...events].sort((a,b) => (b.friends || 0) - (a.friends || 0))[0].venue },
  ];
  return <section className="next-moves shell"><div className="next-label"><span className="kicker">IF YOU LEFT NOW</span><h2>Three good moves.</h2></div>{moves.map((move) => <button onClick={() => onSelect(move.event)} key={move.tag}><span>{move.tag}</span><strong>{move.title}</strong><small>{move.detail}</small><Icon name="arrow"/></button>)}</section>;
}

function DealsSection({ events, claimedDeals, onClaim }) {
  const deals = events.filter((event) => event.deal).slice(0, 3);
  if (!deals.length) return null;
  return <section className="promotions shell">
    <div className="promo-copy"><span className="sponsor-tag">CREW UNLOCKS · TONIGHT</span><h2>Deals worth<br/>changing plans for.</h2><p>Prototype offers show how local partners can reward groups that commit together.</p></div>
    {deals.map((event, index) => { const claimed = claimedDeals.includes(event.id); return <article className={`promo-card ${index === 0 ? "coral" : "dark"}`} key={event.id}><span>{event.venue.toUpperCase()} · TONIGHT</span><h3>{event.deal}</h3><p>{event.area} · {event.cover}</p><div className="unlock-progress"><div><i style={{ width: claimed ? "100%" : "75%" }}></i></div><small>{claimed ? "Unlocked for your crew" : "3 of 4 crew members committed"}</small></div><button onClick={() => onClaim(event)}>{claimed ? "Deal saved" : "Commit and unlock"}<Icon name={claimed ? "check" : "arrow"} size={18}/></button></article>; })}
  </section>;
}

function CrewPoll({ events, onClose, onChoose }) {
  const [votes, setVotes] = useState(events.map((_, index) => [2,1,1][index] || 0));
  const [yourVote, setYourVote] = useState(null);
  const vote = (index) => {
    setVotes((current) => current.map((count, itemIndex) => count + (itemIndex === index ? 1 : 0) - (itemIndex === yourVote ? 1 : 0)));
    setYourVote(index);
  };
  const winner = votes.indexOf(Math.max(...votes));
  return <ModalShell onClose={onClose} label="Crew destination vote" className="poll-modal"><span className="kicker">STEP 3 OF 3 · THE USUAL FOUR</span><h2>Where should we start?</h2><p>Cast your vote before locking the group winner.</p><div className="poll-members"><AvatarStack/><span>{yourVote === null ? "3 of 4 voted · your vote is next" : "4 of 4 voted · ready to lock"}</span></div><div className="poll-options">{events.map((event,index) => <button className={yourVote === index ? "selected" : ""} onClick={() => vote(index)} key={event.id}><span><strong>{event.venue}</strong><small>{event.wait} wait · {event.cover}</small></span><b>{votes[index]}</b></button>)}</div><button className="modal-primary" disabled={yourVote === null || !events.length} onClick={() => onChoose(events[winner])}>{yourVote === null ? "Vote to continue" : "Lock the winner"} <Icon name="arrow"/></button></ModalShell>;
}

function AuthModal({ initialMode, onClose, onAuthenticated }) {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ name: "", email: "", password: "", campus: "Ohio State", crewName: "The usual crew", instagram: "", ageConfirmed: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (mode === "signup" && !form.ageConfirmed) return setError("You must confirm that you are 18 or older.");
    if (form.password.length < 8) return setError("Use at least 8 characters for your password.");
    setLoading(true);
    try {
      const session = mode === "signup" ? await signUp({ email: form.email, password: form.password, profile: { name: form.name.trim(), campus: form.campus, crewName: form.crewName.trim(), instagram: form.instagram.trim(), ageConfirmed: form.ageConfirmed } }) : await signIn({ email: form.email, password: form.password });
      onAuthenticated(session);
    } catch (authError) {
      setError(authError.message);
    } finally {
      setLoading(false);
    }
  };
  return <ModalShell onClose={onClose} label={mode === "signup" ? "Create a Hangtime account" : "Sign in to Hangtime"} className="auth-modal">
    <div className="auth-brand"><Logo/><span>{isCloudAuthEnabled() ? "Secure cloud account" : "Browser-local prototype"}</span></div>
    <h2>{mode === "signup" ? "Make tonight easier." : "Welcome back."}</h2><p>{mode === "signup" ? "Save your crew, join plans, unlock deals, and meet people safely." : "Your crew and tonight’s plan are waiting."}</p>
    <div className="auth-tabs"><button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Create account</button><button className={mode === "signin" ? "active" : ""} onClick={() => setMode("signin")}>Sign in</button></div>
    <form className="auth-form" onSubmit={submit}>
      {mode === "signup" && <><label><span>Name</span><input required value={form.name} onChange={(event) => set("name", event.target.value)} placeholder="First and last name"/></label><div className="auth-split"><label><span>Campus or city</span><input required value={form.campus} onChange={(event) => set("campus", event.target.value)} /></label><label><span>Crew name</span><input required value={form.crewName} onChange={(event) => set("crewName", event.target.value)} /></label></div></>}
      <label><span>Email</span><input required type="email" autoComplete="email" value={form.email} onChange={(event) => set("email", event.target.value)} placeholder="you@school.edu"/></label>
      <label><span>Password</span><input required minLength="8" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} value={form.password} onChange={(event) => set("password", event.target.value)} placeholder="8 characters or more"/></label>
      {mode === "signup" && <><label><span>Instagram <small>Optional · hidden until matching</small></span><input value={form.instagram} onChange={(event) => set("instagram", event.target.value)} placeholder="@username"/></label><label className="age-check"><input type="checkbox" checked={form.ageConfirmed} onChange={(event) => set("ageConfirmed", event.target.checked)}/><span>I confirm that I’m at least 18 years old.</span></label></>}
      {error && <div className="auth-error" role="alert">{error}</div>}
      <button className="modal-primary" disabled={loading}>{loading ? "Working…" : mode === "signup" ? "Create my account" : "Sign in"}<Icon name="arrow"/></button>
    </form>
    {!isCloudAuthEnabled() && <p className="prototype-note"><Icon name="shield" size={14}/>Prototype accounts remain on this browser. Configure Supabase before collecting real user credentials.</p>}
  </ModalShell>;
}

function AccountModal({ account, onClose, onUpdate, onSignOut }) {
  const [profile, setProfile] = useState(account);
  const set = (key, value) => setProfile((current) => ({ ...current, [key]: value }));
  return <ModalShell onClose={onClose} label="Your Hangtime account" className="account-modal">
    <div className="account-avatar">{profile.name?.split(" ").map((part) => part[0]).join("").slice(0,2).toUpperCase()}</div><span className="kicker">YOUR ACCOUNT</span><h2>{profile.name}</h2><p>{profile.email}</p>
    <div className="account-stats"><div><strong>4</strong><span>Crew members</span></div><div><strong>3</strong><span>Nights planned</span></div><div><strong>2</strong><span>Trusted intros</span></div></div>
    <form className="auth-form" onSubmit={(event) => { event.preventDefault(); onUpdate(profile); onClose(); }}><label><span>Name</span><input value={profile.name || ""} onChange={(event) => set("name", event.target.value)}/></label><div className="auth-split"><label><span>Campus or city</span><input value={profile.campus || ""} onChange={(event) => set("campus", event.target.value)}/></label><label><span>Crew name</span><input value={profile.crewName || ""} onChange={(event) => set("crewName", event.target.value)}/></label></div><label><span>Instagram <small>Private until matching</small></span><input value={profile.instagram || ""} onChange={(event) => set("instagram", event.target.value)}/></label><button className="modal-primary">Save profile<Icon name="check"/></button></form>
    <button className="signout-button" onClick={onSignOut}>Sign out</button>
  </ModalShell>;
}

function MatchCard({ group, featured, onOpen, onPerson, onWave }) {
  return <article className={`match-card ${featured ? "featured" : ""}`}>
    <div className="match-top"><PhotoStack people={group.people} onPerson={onPerson}/><div className="score"><strong>{group.score}</strong><span>% plan fit</span></div></div>
    <div className="match-status"><span className="live-dot"></span>{group.night}</div><h3>{group.name}</h3><p>{group.members} people · Ages {group.range} · {group.distance}</p>
    <div className="card-plan"><small>THEIR NIGHT</small><strong>{group.status}</strong><span>{group.timeline[0].place} · starts {group.timeline[0].time}</span></div>
    <div className="reason-row"><span>{group.overlap}</span><span>Starts near you</span>{group.mutuals > 0 && <span>{group.mutuals} mutuals</span>}</div>
    <div className="social-proof"><Icon name="shield" size={14}/>{group.verified}/{group.members} verified <i></i><Icon name="instagram" size={14}/>{group.socials.length} socials linked</div>
    <div className="match-actions"><button onClick={onOpen}>People + plan</button><button className="wave" onClick={onWave}>Interested <Icon name="arrow" size={16}/></button></div>
  </article>;
}

function ModalShell({ children, onClose, label, className = "" }) {
  const modalRef = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const modal = modalRef.current;
    const focusable = () => [...(modal?.querySelectorAll("button, a, input, select, textarea, [tabindex]:not([tabindex='-1'])") || [])].filter((item) => !item.disabled);
    focusable()[0]?.focus();
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("keydown", handleKey); previous?.focus?.(); };
  }, [onClose]);
  return <div className="modal-layer" role="dialog" aria-modal="true" aria-label={label}><button className="modal-backdrop" onClick={onClose} aria-label="Close"></button><div className={`modal ${className}`} ref={modalRef}><button className="modal-close" onClick={onClose} aria-label="Close"><Icon name="close"/></button>{children}</div></div>;
}

function PlanModal({ plan, onClose, onSave }) {
  const [next, setNext] = useState(plan);
  const [showAllNights, setShowAllNights] = useState(false);
  const set = (key, value) => setNext((current) => ({ ...current, [key]: value }));
  return <ModalShell onClose={onClose} label="Set tonight's plan" className="plan-modal">
    <span className="kicker">STEP 1</span><h2>What sounds good tonight?</h2><p>Choose the closest fit. Nothing here is permanent.</p>
    <label><span>Who’s in?</span><div className="modal-crew"><AvatarStack/><strong>The usual four</strong><button>Change</button></div></label>
    <label><span>Where around campus?</span><div className="choice-grid">{["High Street", "North Campus", "South Campus", "Open to ideas"].map((area) => <button className={next.area === area ? "selected" : ""} onClick={() => set("area", area)} key={area}>{area}</button>)}</div></label>
    <label><span>What kind of night?</span><div className="night-choice-grid">{(showAllNights ? nightOptions : nightOptions.slice(0, 4)).map((option) => <button className={next.night === option.label ? "selected" : ""} onClick={() => set("night", option.label)} key={option.label}><strong>{option.label}</strong><small>{option.detail}</small></button>)}</div></label>
    {!showAllNights && <button className="night-options-toggle" onClick={() => setShowAllNights(true)}>Show more night types</button>}
    <label><span>Starting around</span><div className="choice-grid time">{["8:30 PM", "9:30 PM", "10:30 PM", "Whenever"].map((time) => <button className={next.time === time ? "selected" : ""} onClick={() => set("time", time)} key={time}>{time}</button>)}</div></label>
    <button className="modal-primary" onClick={() => onSave(next)}>Show me where to go <Icon name="arrow"/></button>
  </ModalShell>;
}

function ProfileModal({ group, onClose, onPerson, onWave }) {
  return <ModalShell onClose={onClose} label={`${group.name} profile`} className="profile-modal">
    <div className="profile-visual"><PhotoStack people={group.people} onPerson={onPerson} size="large"/><div><span className="score-pill">{group.score}% PLAN FIT</span><h2>{group.name}</h2><p>{group.members} people · Ages {group.range}</p></div></div>
    <div className="identity-note"><Icon name="lock" size={18}/><div><strong>Photos and first names are visible</strong><span>Social handles and direct messaging unlock after a mutual match.</span></div></div>
    <div className="member-directory"><span className="kicker">TAP A PERSON TO VIEW THEIR PROFILE</span><div>{group.people.map((person) => <button onClick={() => onPerson(person)} key={person.name}><ProfilePhoto person={person}/><span><strong>{person.name}, {person.age}</strong><small>{person.role}</small></span><Icon name="chevron" size={16}/></button>)}</div></div>
    <div className="fit-breakdown"><div><span>Plan overlap</span><strong>98%</strong></div><div><span>Timing</span><strong>96%</strong></div><div><span>Group fit</span><strong>92%</strong></div></div>
    <section className="tonight-plan"><span className="kicker">WHAT THEY’RE DOING</span><h3>{group.status}</h3><div className="plan-timeline">{group.timeline.map((stop) => <div key={stop.time + stop.action}><time>{stop.time}</time><i></i><span><strong>{stop.action}</strong><small>{stop.place}</small></span></div>)}</div></section>
    <section><span className="kicker">A LITTLE CONTEXT</span><p>{group.blurb}</p><div className="interest-list">{group.interests.map((interest) => <span key={interest}>{interest}</span>)}</div></section>
    <div className="account-links"><span><Icon name="shield" size={16}/>{group.verified}/{group.members} identity verified</span><span><Icon name="instagram" size={16}/>{group.socials.join(" + ")} connected</span><span><Icon name="users" size={16}/>{group.mutuals || "No"} mutual connections</span></div>
    <button className="modal-primary" onClick={onWave}>We’d meet them <Icon name="arrow"/></button>
    <div className="safety-actions"><button onClick={() => { trackExperimentEvent("profile_reported", { groupId: group.id }); onClose(); }}>Report profile</button><button onClick={() => { trackExperimentEvent("profile_blocked", { groupId: group.id }); onClose(); }}>Block this crew</button></div>
  </ModalShell>;
}

function VenueInterestModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ venue: "", role: "", pricing: "$75/month + $1 per redeemed offer" });
  return <ModalShell onClose={onClose} label="Venue partner interest" className="venue-modal">
    <span className="kicker">PAYER TEST</span><h2>Bring more groups through the door.</h2>
    <p>Hangtime is testing whether campus venues will pay for measurable group commitments instead of generic impressions.</p>
    <form className="auth-form" onSubmit={(event) => { event.preventDefault(); onSubmit(form); }}>
      <label><span>Venue name</span><input required value={form.venue} onChange={(event) => setForm({ ...form, venue: event.target.value })}/></label>
      <label><span>Your role</span><input required value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} placeholder="Owner, manager, promoter"/></label>
      <label><span>Offer being tested</span><select value={form.pricing} onChange={(event) => setForm({ ...form, pricing: event.target.value })}><option>$75/month + $1 per redeemed offer</option><option>$150/month flat</option><option>$2 per redeemed group offer</option><option>Interested, but pricing needs work</option></select></label>
      <p className="prototype-note">This concept form stores only an anonymous interaction event in this browser; it does not send contact information.</p>
      <button className="modal-primary">Record interest <Icon name="arrow"/></button>
    </form>
  </ModalShell>;
}

function EvidenceModal({ onClose }) {
  const events = getExperimentEvents();
  const download = () => {
    const blob = new Blob([exportExperimentEvents()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hangtime-test-events-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
  return <ModalShell onClose={onClose} label="MVP test evidence" className="evidence-modal">
    <span className="kicker">HONEST MVP TEST</span><h2>{events.length} anonymous interactions recorded.</h2>
    <p>The browser records the core behavioral funnel only: plan starts, destination comparisons, crew votes, locked destinations, deal saves, introductions, and venue interest.</p>
    <div className="evidence-rules"><strong>Precommitted decision rule</strong><span>Continue: at least 50% of qualified groups lock a destination within five minutes.</span><span>Change: 25-49% complete, or repeated help is required.</span><span>Stop/reframe: fewer than 25% complete.</span></div>
    <button className="modal-primary" onClick={download}>Download this browser's events <Icon name="arrow"/></button>
    <p className="prototype-note">Review the export before sharing. No names, emails, precise locations, or message content are included.</p>
  </ModalShell>;
}

function PersonModal({ person, group, onClose, onBack }) {
  return <ModalShell onClose={onClose} label={`${person.name}'s profile`} className="person-modal">
    <button className="person-back" onClick={onBack}>← {group.name}</button>
    <div className="person-hero"><ProfilePhoto person={person} size="hero"/><span className="verified-person"><Icon name="shield" size={14}/>Verified</span></div>
    <div className="person-heading"><span className="kicker">{group.name}</span><h2>{person.name}, {person.age}</h2><p>{person.role} · Ohio State area</p></div>
    <p className="person-bio">{person.bio}</p>
    <section><span className="kicker">THEIR PLAN TONIGHT</span><h3>{group.status}</h3><p>{group.night} · {group.distance} away</p></section>
    <section><span className="kicker">INTO</span><div className="interest-list">{person.interests.map((interest) => <span key={interest}>{interest}</span>)}</div></section>
    <div className="locked-social"><Icon name="instagram"/><span><strong>Instagram connected</strong><small>Handle unlocks if both groups match.</small></span><Icon name="lock" size={16}/></div>
  </ModalShell>;
}

function MatchModal({ group, onClose, onMessage }) {
  return <ModalShell onClose={onClose} label="It's a match" className="matched-modal">
    <span className="burst"><Icon name="spark" size={28}/></span><span className="kicker">IT’S MUTUAL</span><h2>You found<br/>your people.</h2>
    <div className="mutual-groups"><div><AvatarStack/><strong>The usual four</strong></div><span>+</span><div><PhotoStack people={group.people}/><strong>{group.name}</strong></div></div>
    <p>Your plans overlap at {group.timeline[0].place} around {group.timeline[0].time}.</p>
    <div className="unlocked"><Icon name="instagram"/><span><strong>Profiles unlocked</strong><small>First names and connected accounts are now visible.</small></span></div>
    <button className="modal-primary" onClick={onMessage}><Icon name="message"/>Open group chat</button><button className="text-button" onClick={onClose}>Keep exploring</button>
  </ModalShell>;
}

export default App;
