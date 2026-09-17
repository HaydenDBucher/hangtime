import { useEffect, useMemo, useState } from "react";
import { getTonightEvents } from "./eventService";

const crew = [
  { name: "You", initials: "HB", tone: "ink" },
  { name: "Jake", initials: "JK", tone: "lime" },
  { name: "Maya", initials: "MY", tone: "coral" },
  { name: "Connor", initials: "CO", tone: "violet" },
];

const matches = [
  {
    id: 1, name: "Lane Ave crew", score: 96, members: 4, range: "21–24", distance: "0.4 mi", night: "Drinks, then decide", status: "Pins at 9:15 → maybe Standard Hall", overlap: "Same first stop", mutuals: 3, verified: 4, socials: ["Instagram", "TikTok"], interests: ["Live music", "Patios", "Buckeyes"], blurb: "OSU seniors. Competitive at games, easygoing everywhere else.",
    timeline: [{ time: "9:15", action: "Meet at Pins", place: "Short North" }, { time: "10:30", action: "See how it’s going", place: "Standard Hall, maybe" }],
    people: [
      { name: "Emma", age: 22, role: "Design student", photo: 0, bio: "Usually finds the table and orders for everyone.", interests: ["Concerts", "Tennis", "Film"] },
      { name: "Ryan", age: 23, role: "Finance major", photo: 1, bio: "Will challenge anyone to duckpin bowling.", interests: ["Crew", "Golf", "Trivia"] },
      { name: "Simone", age: 22, role: "Nursing student", photo: 2, bio: "Here for live music and a good patio.", interests: ["R&B", "Running", "Food"] },
      { name: "Theo", age: 24, role: "Software engineer", photo: 3, bio: "The one who actually makes the reservation.", interests: ["Climbing", "DJs", "Coffee"] },
    ],
  },
  {
    id: 2, name: "Clintonville four", score: 91, members: 4, range: "22–25", distance: "0.8 mi", night: "Dinner into drinks", status: "Comune at 8:00 → patio drinks", overlap: "Similar route", mutuals: 1, verified: 4, socials: ["Instagram"], interests: ["Food", "Indie", "Trivia"], blurb: "Recent grads looking for dinner and a night that can go either way.",
    timeline: [{ time: "8:00", action: "Dinner at Comune", place: "German Village" }, { time: "9:45", action: "Find a patio", place: "Brewery District" }],
    people: [
      { name: "Noah", age: 24, role: "Product designer", photo: 4, bio: "New restaurant list is always ready.", interests: ["Food", "Art", "Cycling"] },
      { name: "Lucy", age: 23, role: "Teacher", photo: 5, bio: "Prefers patios where you can hear each other.", interests: ["Books", "Travel", "Indie"] },
      { name: "Rafa", age: 25, role: "Architect", photo: 6, bio: "Can turn one drink into a neighborhood tour.", interests: ["Design", "Soccer", "Vinyl"] },
      { name: "Mina", age: 23, role: "Grad student", photo: 7, bio: "Always knows the late-night food spot.", interests: ["Comedy", "Food", "Photos"] },
    ],
  },
  {
    id: 3, name: "Campus collective", score: 87, members: 4, range: "21–23", distance: "1.1 mi", night: "Catch a show", status: "KEMBA Live at 8:30 → Short North", overlap: "Same area later", mutuals: 0, verified: 4, socials: ["Instagram", "TikTok"], interests: ["Concerts", "Dancing", "Photos"], blurb: "A campus friend group catching a show before a late-night bite.",
    timeline: [{ time: "8:30", action: "Show at KEMBA Live", place: "Arena District" }, { time: "11:00", action: "Late food and drinks", place: "Short North" }],
    people: [
      { name: "Dani", age: 22, role: "Marketing major", photo: 8, bio: "Has the playlist ready before the preshow.", interests: ["Pop", "Photos", "Thrifting"] },
      { name: "Austin", age: 23, role: "Journalism major", photo: 9, bio: "Never misses an opener.", interests: ["Live music", "Running", "Film"] },
      { name: "Chloe", age: 21, role: "Psychology major", photo: 10, bio: "Will stay out for one more song.", interests: ["Dance", "Coffee", "Travel"] },
      { name: "Malik", age: 23, role: "Photographer", photo: 11, bio: "Documents the night without slowing it down.", interests: ["Photos", "House", "Basketball"] },
    ],
  },
  {
    id: 4, name: "German Village crew", score: 82, members: 4, range: "23–26", distance: "1.7 mi", night: "Show and one round", status: "Comedy at 8:00 → one drink nearby", overlap: "Same timing", mutuals: 5, verified: 4, socials: ["Instagram"], interests: ["Cocktails", "Comedy", "Crew"], blurb: "Neighbors, coworkers, and one cousin. Here for the stories.",
    timeline: [{ time: "8:00", action: "Comedy at The Attic", place: "Old North" }, { time: "9:45", action: "One round nearby", place: "Open" }],
    people: [
      { name: "Andre", age: 25, role: "Account manager", photo: 12, bio: "Knows when to call it and when not to.", interests: ["Comedy", "Crew", "Cooking"] },
      { name: "Kiara", age: 24, role: "Event producer", photo: 13, bio: "A very reliable judge of whether a place is worth it.", interests: ["Events", "Fashion", "Podcasts"] },
      { name: "Sam", age: 26, role: "Physical therapist", photo: 14, bio: "Here for jokes, sports, and exactly one round.", interests: ["Soccer", "Comedy", "Travel"] },
      { name: "Delaney", age: 24, role: "Copywriter", photo: 15, bio: "Always has a backup plan within walking distance.", interests: ["Writing", "Wine", "Yoga"] },
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
  const [events, setEvents] = useState([]);
  const [eventSource, setEventSource] = useState("loading");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeView, setActiveView] = useState("map");
  const [matchFilter, setMatchFilter] = useState("Best plan");
  const [planOpen, setPlanOpen] = useState(false);
  const [pollOpen, setPollOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [personProfile, setPersonProfile] = useState(null);
  const [matchedGroup, setMatchedGroup] = useState(null);
  const [intentions, setIntentions] = useState({});
  const [claimedDeals, setClaimedDeals] = useState([]);
  const [openToMeet, setOpenToMeet] = useState(true);
  const [toast, setToast] = useState("");
  const [plan, setPlan] = useState({ crew: "The usual four", area: "Short North", night: "Drinks, then decide", time: "9:30 PM", event: "Open plan" });
  const tonightLabel = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date());

  useEffect(() => {
    const controller = new AbortController();
    getTonightEvents({ city: "Columbus", signal: controller.signal }).then(({ events: nextEvents, source }) => {
      setEvents(nextEvents);
      setEventSource(source);
      setSelectedEvent(nextEvents[0]);
    }).catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const orderedMatches = useMemo(() => {
    const next = [...matches];
    if (matchFilter === "Mutuals") return next.sort((a, b) => b.mutuals - a.mutuals);
    if (matchFilter === "Same timing") return next.sort((a, b) => Number(b.timeline[0].time === "9:15") - Number(a.timeline[0].time === "9:15"));
    if (matchFilter === "Same places") return next.sort((a, b) => Number(b.overlap === "Same first stop") - Number(a.overlap === "Same first stop"));
    return next;
  }, [matchFilter]);

  const joinEvent = (event) => {
    setPlan((current) => ({ ...current, event: event.title, area: event.area }));
    setToast(`${event.title} added to your night`);
  };

  const setIntent = (event, intent) => {
    setIntentions((current) => ({ ...current, [event.id]: intent }));
    setPlan((current) => ({ ...current, event: event.title, area: event.area }));
    setToast(intent === "here" ? `Checked in at ${event.venue}` : intent === "heading" ? `Your crew is heading to ${event.venue}` : `${event.venue} added to your shortlist`);
  };

  const claimDeal = (event) => {
    setClaimedDeals((current) => current.includes(event.id) ? current : [...current, event.id]);
    setToast(`Crew deal saved for ${event.venue}`);
  };

  const sendWave = (group) => {
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
        <button className="city-switcher"><span className="status-dot"></span>Columbus tonight<Icon name="chevron" size={16}/></button>
        <nav aria-label="Primary navigation"><a className="active" href="#tonight">Tonight</a><a href="#matches">Matches</a><a href="#safety">Safety</a></nav>
        <button className="profile-button"><span>HB</span><span className="profile-copy"><strong>Hayden</strong><small>4 in your crew</small></span><Icon name="chevron" size={16}/></button>
      </header>

      <main>
        <section className="pulse-hero shell">
          <div className="pulse-copy"><div className="eyebrow"><span>{tonightLabel}</span><i></i><span>Live city pulse</span></div><h1>Columbus,<br/><em>tonight.</em></h1><p>Know where the night is moving before your crew commits.</p></div>
          <div className="pulse-board">
            <div><span>CREWS MAKING PLANS</span><strong>97</strong><small>+18 in the last hour</small></div>
            <div><span>MOST ACTIVE</span><strong>Short North</strong><small>Activity rising</small></div>
            <div><span>BEST ARRIVAL</span><strong>9:15–9:45</strong><small>Before waits peak</small></div>
            <button className="primary-action" onClick={() => setPollOpen(true)}>Ask the crew<Icon name="arrow"/></button>
          </div>
        </section>

        <section className="plan-bar shell" aria-label="Your plan tonight">
          <div className="plan-crew"><AvatarStack/><span><small>Your crew</small><strong>{plan.crew}</strong></span></div>
          <button onClick={() => setPlanOpen(true)}><Icon name="pin"/><span><small>Area</small><strong>{plan.area}</strong></span></button>
          <button onClick={() => setPlanOpen(true)}><Icon name="spark"/><span><small>Type of night</small><strong>{plan.night}</strong></span></button>
          <button onClick={() => setPlanOpen(true)}><Icon name="clock"/><span><small>Start</small><strong>{plan.time}</strong></span></button>
          <div className="plan-event"><span><small>Plan</small><strong>{plan.event}</strong></span></div>
          <div className="plan-actions"><button onClick={() => setPlanOpen(true)}>Edit</button><button onClick={() => setPollOpen(true)}>Crew vote</button></div>
        </section>

        <section className="tonight shell" id="tonight">
          <div className="section-title-row">
            <div><span className="kicker">THE CITY, RIGHT NOW</span><h2>Choose your first move.</h2></div>
            <div className="view-tabs" aria-label="Choose view">{["map", "events"].map((view) => <button className={activeView === view ? "active" : ""} onClick={() => setActiveView(view)} key={view}>{view === "map" ? <Icon name="compass" size={17}/> : <Icon name="calendar" size={17}/>} {view}</button>)}</div>
          </div>

          <div className={`city-board ${activeView}`}>
            <NightMap events={events} selected={selectedEvent} intentions={intentions} onSelect={setSelectedEvent}/>
            <EventRail events={events} source={eventSource} selected={selectedEvent} intention={selectedEvent ? intentions[selectedEvent.id] : null} claimed={selectedEvent ? claimedDeals.includes(selectedEvent.id) : false} onSelect={setSelectedEvent} onJoin={joinEvent} onIntent={setIntent} onClaim={claimDeal}/>
          </div>
        </section>

        <NextMoves events={events} onSelect={(event) => { setSelectedEvent(event); document.getElementById("tonight")?.scrollIntoView({ behavior: "smooth" }); }}/>

        <section className="matches shell" id="matches">
          <div className="section-title-row matches-heading">
            <div><span className="kicker">{openToMeet ? "OPEN TO ONE INTRODUCTION" : "DISCOVERY PAUSED"}</span><h2>Crews whose plans overlap.</h2></div>
            <div className="filter-row"><Icon name="tune" size={17}/>{filters.map((filter) => <button className={matchFilter === filter ? "active" : ""} onClick={() => setMatchFilter(filter)} key={filter}>{filter}</button>)}</div>
          </div>
          <div className="meeting-control"><div><span className="live-dot"></span><p><strong>Meet another crew tonight</strong><small>Only groups near the same place and time can see you.</small></p></div><button className={openToMeet ? "on" : ""} onClick={() => setOpenToMeet((current) => !current)} aria-pressed={openToMeet}><i></i></button></div>
          {openToMeet ? <div className="match-grid">{orderedMatches.map((group, index) => <MatchCard group={group} featured={index === 0} onOpen={() => setProfile(group)} onPerson={(person) => setPersonProfile({ person, group })} onWave={() => sendWave(group)} key={group.id}/>)}</div> : <div className="matches-paused"><Icon name="lock" size={24}/><strong>Introductions are paused</strong><p>Your plan remains visible only to your crew.</p></div>}
        </section>

        <section className="privacy shell" id="safety">
          <div className="privacy-mark"><Icon name="shield" size={30}/></div>
          <div><span className="kicker">DESIGNED FOR DISCRETION</span><h2>People visible.<br/>Access controlled.</h2></div>
          <p>See who you may meet and open individual profiles. Direct social handles, messaging, and contact details stay private until both groups match.</p>
          <div className="privacy-points"><span><Icon name="check" size={15}/>Real photos up front</span><span><Icon name="check" size={15}/>Handles after matching</span><span><Icon name="check" size={15}/>Group-only introductions</span></div>
        </section>

        <DealsSection events={events} claimedDeals={claimedDeals} onClaim={claimDeal}/>
      </main>

      <footer className="footer shell"><Logo/><p>One plan. More possibilities.</p><div><a href="#safety">Safety</a><button onClick={() => setToast("Venue partner form coming next")}>For venues</button><span>Concept MVP</span></div></footer>

      {planOpen && (
        <PlanModal plan={plan} onClose={() => setPlanOpen(false)} onSave={(next) => { setPlan(next); setPlanOpen(false); setToast("Tonight’s plan is live"); }}/>
      )}
      {pollOpen && (
        <CrewPoll events={events.slice(0, 3)} onClose={() => setPollOpen(false)} onChoose={(event) => { joinEvent(event); setPollOpen(false); setToast(`${event.venue} won the crew vote`); }}/>
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
      {toast && <div className="toast" role="status"><Icon name="check" size={17}/>{toast}</div>}
    </div>
  );
}

function NightMap({ events, selected, intentions, onSelect }) {
  return <div className="map-panel" aria-label="Tonight activity map">
    <div className="map-grid"></div><div className="river"></div>
    <span className="map-label campus">CAMPUS</span><span className="map-label short-north">SHORT NORTH</span><span className="map-label downtown">DOWNTOWN</span><span className="map-label old-north">OLD NORTH</span>
    <span className="road road-one"></span><span className="road road-two"></span><span className="road road-three"></span><span className="road road-four"></span>
    {events.map((event) => <button className={`map-marker ${selected?.id === event.id ? "selected" : ""} ${intentions[event.id] ? "committed" : ""}`} style={{ left: `${event.x}%`, top: `${event.y}%`, "--heat": `${Math.min(92, 42 + event.attending / 2)}px` }} onClick={() => onSelect(event)} aria-label={`${event.title}, ${event.groups} groups`} key={event.id}><span className={`heat ${event.tone}`}></span>{intentions[event.id] && <i className="intent-pin"><Icon name="check" size={10}/></i>}<b>{event.groups + (intentions[event.id] ? 1 : 0)}</b><small>crews</small></button>)}
    <div className="map-legend"><span><i className="warm"></i>More active</span><span><i></i>Less active</span></div>
    <button className="locate-button" aria-label="Use my location" onClick={() => navigator.geolocation?.getCurrentPosition(() => {}, () => {})}><Icon name="compass" size={18}/></button>
  </div>;
}

function EventRail({ events, source, selected, intention, claimed, onSelect, onJoin, onIntent, onClaim }) {
  return <aside className="event-rail">
    <div className="rail-top"><div><span className={`source-dot ${source}`}></span><strong>{source === "live" ? "Live events" : source === "loading" ? "Finding events" : "Tonight preview"}</strong></div><span>{events.length} nearby</span></div>
    {selected && <div className="venue-intel">
      <div className="intel-live"><span className="live-dot"></span><strong>{selected.trend || "Steady"}</strong><small>Updated {selected.updated || "recently"}</small></div>
      <h2>{selected.venue}</h2><p>{selected.title} · {selected.time}</p>
      <div className="intel-grid"><div><small>WAIT</small><strong>{selected.wait || "Check venue"}</strong></div><div><small>COVER</small><strong>{selected.cover || "Check venue"}</strong></div><div><small>PEAK</small><strong>{selected.peak || selected.time}</strong></div><div><small>YOUR NETWORK</small><strong>{selected.friends || 0} going</strong></div></div>
      <div className="confidence"><Icon name="shield" size={13}/>{selected.confidence || "Community estimate"} · {selected.groups} crews committed</div>
      {selected.deal && <div className="intel-deal"><span>CREW UNLOCK</span><strong>{selected.deal}</strong><button className={claimed ? "claimed" : ""} onClick={() => onClaim(selected)}>{claimed ? "Saved" : "Save"}</button></div>}
      <div className="intent-picker"><span>Your crew</span><div>{[["considering","Considering"],["heading","Heading there"],["here","Here now"]].map(([value,label]) => <button className={intention === value ? "active" : ""} onClick={() => onIntent(selected,value)} key={value}>{intention === value && <Icon name="check" size={12}/>} {label}</button>)}</div></div>
    </div>}
    <div className="event-scroll">{events.map((event) => <article className={`event-row ${selected?.id === event.id ? "selected" : ""}`} onClick={() => onSelect(event)} key={event.id}>
      <div className={`event-time ${event.tone}`}><strong>{event.time.split(" ")[0]}</strong><span>{event.time.split(" ")[1] || ""}</span></div>
      <div className="event-info">{event.promoted && <small className="promoted-label">PROMOTED</small>}<h3>{event.venue}</h3><p>{event.title} · {event.area}</p><div><span><Icon name="users" size={13}/>{event.groups} crews</span><span className="trend-chip">{event.trend || "Steady"}</span></div></div>
      <button className="row-arrow" onClick={(eventClick) => { eventClick.stopPropagation(); onJoin(event); }} aria-label={`Add ${event.title} to plan`}><Icon name="arrow" size={17}/></button>
    </article>)}</div>
    {source === "demo" && <p className="data-note">Demo attendance protects real identities. Add a Ticketmaster key to pull the current event lineup.</p>}
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
  const deals = events.filter((event) => event.deal).slice(0, 2);
  if (!deals.length) return null;
  return <section className="promotions shell">
    <div className="promo-copy"><span className="sponsor-tag">CREW UNLOCKS · VERIFIED</span><h2>Deals worth<br/>changing plans for.</h2><p>No generic ads. These activate only when your group commits.</p></div>
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
  return <ModalShell onClose={onClose} label="Crew destination vote" className="poll-modal"><span className="kicker">THE USUAL FOUR</span><h2>Where should we start?</h2><p>One tap each. Highest vote becomes the plan.</p><div className="poll-members"><AvatarStack/><span>3 of 4 voted</span></div><div className="poll-options">{events.map((event,index) => <button className={yourVote === index ? "selected" : ""} onClick={() => vote(index)} key={event.id}><span><strong>{event.venue}</strong><small>{event.wait} wait · {event.cover}</small></span><b>{votes[index]}</b></button>)}</div><button className="modal-primary" onClick={() => onChoose(events[winner])}>Lock the winner <Icon name="arrow"/></button></ModalShell>;
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
  return <div className="modal-layer" role="dialog" aria-modal="true" aria-label={label}><button className="modal-backdrop" onClick={onClose} aria-label="Close"></button><div className={`modal ${className}`}><button className="modal-close" onClick={onClose} aria-label="Close"><Icon name="close"/></button>{children}</div></div>;
}

function PlanModal({ plan, onClose, onSave }) {
  const [next, setNext] = useState(plan);
  const set = (key, value) => setNext((current) => ({ ...current, [key]: value }));
  return <ModalShell onClose={onClose} label="Set tonight's plan" className="plan-modal">
    <span className="kicker">30-SECOND SETUP</span><h2>What are you actually doing?</h2><p>Pick the closest version. You can change it later.</p>
    <label><span>Who’s in?</span><div className="modal-crew"><AvatarStack/><strong>The usual four</strong><button>Change</button></div></label>
    <label><span>Where?</span><div className="choice-grid">{["Short North", "Campus", "Downtown", "Open to ideas"].map((area) => <button className={next.area === area ? "selected" : ""} onClick={() => set("area", area)} key={area}>{area}</button>)}</div></label>
    <label><span>What kind of night?</span><div className="night-choice-grid">{nightOptions.map((option) => <button className={next.night === option.label ? "selected" : ""} onClick={() => set("night", option.label)} key={option.label}><strong>{option.label}</strong><small>{option.detail}</small></button>)}</div></label>
    <label><span>Starting around</span><div className="choice-grid time">{["8:30 PM", "9:30 PM", "10:30 PM", "Whenever"].map((time) => <button className={next.time === time ? "selected" : ""} onClick={() => set("time", time)} key={time}>{time}</button>)}</div></label>
    <button className="modal-primary" onClick={() => onSave(next)}>Go live <Icon name="arrow"/></button>
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
  </ModalShell>;
}

function PersonModal({ person, group, onClose, onBack }) {
  return <ModalShell onClose={onClose} label={`${person.name}'s profile`} className="person-modal">
    <button className="person-back" onClick={onBack}>← {group.name}</button>
    <div className="person-hero"><ProfilePhoto person={person} size="hero"/><span className="verified-person"><Icon name="shield" size={14}/>Verified</span></div>
    <div className="person-heading"><span className="kicker">{group.name}</span><h2>{person.name}, {person.age}</h2><p>{person.role} · Columbus</p></div>
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
