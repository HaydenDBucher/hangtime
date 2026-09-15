import { useEffect, useMemo, useState } from "react";
import { getTonightEvents } from "./eventService";

const crew = [
  { name: "You", initials: "HB", tone: "ink" },
  { name: "Jake", initials: "JK", tone: "lime" },
  { name: "Maya", initials: "MY", tone: "coral" },
  { name: "Connor", initials: "CO", tone: "violet" },
];

const matches = [
  { id: 1, name: "Lane Ave crew", score: 96, members: 5, range: "21–24", distance: "0.4 mi", vibe: "Social", status: "Pins at 9:30", overlap: "Same stop", mutuals: 3, verified: 5, socials: ["Instagram", "TikTok"], interests: ["Live music", "Patios", "Buckeyes"], initials: ["EM", "JR", "SL", "+2"], blurb: "OSU seniors. Competitive at games, easygoing everywhere else." },
  { id: 2, name: "Clintonville four", score: 91, members: 4, range: "22–25", distance: "0.8 mi", vibe: "Low-key", status: "Dinner, then north", overlap: "Similar night", mutuals: 1, verified: 4, socials: ["Instagram"], interests: ["Food", "Indie", "Trivia"], initials: ["NB", "LE", "RA", "MO"], blurb: "Recent grads looking for a patio and a night that can go either way." },
  { id: 3, name: "Campus collective", score: 87, members: 6, range: "21–23", distance: "1.1 mi", vibe: "Live", status: "Show, then Short North", overlap: "Same area", mutuals: 0, verified: 6, socials: ["Instagram", "TikTok"], interests: ["Concerts", "Dancing", "Photos"], initials: ["DW", "AP", "CJ", "+3"], blurb: "A campus friend group catching a show before a late-night bite." },
  { id: 4, name: "German Village crew", score: 82, members: 4, range: "23–26", distance: "1.7 mi", vibe: "Social", status: "Open to ideas", overlap: "Friend overlap", mutuals: 5, verified: 4, socials: ["Instagram"], interests: ["Cocktails", "Comedy", "Crew"], initials: ["AR", "KP", "SV", "DC"], blurb: "Neighbors, coworkers, and one cousin. Here for the stories." },
];

const filters = ["Best fit", "Same stop", "Mutuals", "Similar size"];
const vibes = ["Social", "Dance", "Live", "Low-key"];

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

function App() {
  const [events, setEvents] = useState([]);
  const [eventSource, setEventSource] = useState("loading");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeView, setActiveView] = useState("map");
  const [matchFilter, setMatchFilter] = useState("Best fit");
  const [planOpen, setPlanOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [matchedGroup, setMatchedGroup] = useState(null);
  const [toast, setToast] = useState("");
  const [plan, setPlan] = useState({ crew: "The usual four", area: "Short North", vibe: "Social", time: "9:30 PM", event: "Open plan" });
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
    if (matchFilter === "Similar size") return next.sort((a, b) => Math.abs(a.members - 4) - Math.abs(b.members - 4));
    if (matchFilter === "Same stop") return next.sort((a, b) => Number(b.overlap === "Same stop") - Number(a.overlap === "Same stop"));
    return next;
  }, [matchFilter]);

  const joinEvent = (event) => {
    setPlan((current) => ({ ...current, event: event.title, area: event.area }));
    setToast(`${event.title} added to your night`);
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
        <section className="intro shell">
          <div className="eyebrow"><span>{tonightLabel}</span><i></i><span>Now forming</span></div>
          <h1>Find your<br/><em>people tonight.</em></h1>
          <div className="intro-side"><p>See what’s happening. Find the groups who fit. Make one plan.</p><button className="primary-action" onClick={() => setPlanOpen(true)}>Set tonight’s plan<Icon name="arrow"/></button></div>
        </section>

        <section className="plan-bar shell" aria-label="Your plan tonight">
          <div className="plan-crew"><AvatarStack/><span><small>Your crew</small><strong>{plan.crew}</strong></span></div>
          <button onClick={() => setPlanOpen(true)}><Icon name="pin"/><span><small>Area</small><strong>{plan.area}</strong></span></button>
          <button onClick={() => setPlanOpen(true)}><Icon name="spark"/><span><small>Vibe</small><strong>{plan.vibe}</strong></span></button>
          <button onClick={() => setPlanOpen(true)}><Icon name="clock"/><span><small>Start</small><strong>{plan.time}</strong></span></button>
          <div className="plan-event"><span><small>Plan</small><strong>{plan.event}</strong></span></div>
          <button className="edit-plan" onClick={() => setPlanOpen(true)}>Edit</button>
        </section>

        <section className="tonight shell" id="tonight">
          <div className="section-title-row">
            <div><span className="kicker">THE CITY, RIGHT NOW</span><h2>Where everyone’s going.</h2></div>
            <div className="view-tabs" aria-label="Choose view">{["map", "events"].map((view) => <button className={activeView === view ? "active" : ""} onClick={() => setActiveView(view)} key={view}>{view === "map" ? <Icon name="compass" size={17}/> : <Icon name="calendar" size={17}/>} {view}</button>)}</div>
          </div>

          <div className={`city-board ${activeView}`}>
            <NightMap events={events} selected={selectedEvent} onSelect={setSelectedEvent}/>
            <EventRail events={events} source={eventSource} selected={selectedEvent} onSelect={setSelectedEvent} onJoin={joinEvent}/>
          </div>
        </section>

        <section className="matches shell" id="matches">
          <div className="section-title-row matches-heading">
            <div><span className="kicker">PRIVATE UNTIL IT’S MUTUAL</span><h2>Groups on your wavelength.</h2></div>
            <div className="filter-row"><Icon name="tune" size={17}/>{filters.map((filter) => <button className={matchFilter === filter ? "active" : ""} onClick={() => setMatchFilter(filter)} key={filter}>{filter}</button>)}</div>
          </div>
          <div className="match-grid">{orderedMatches.map((group, index) => <MatchCard group={group} featured={index === 0} onOpen={() => setProfile(group)} onWave={() => sendWave(group)} key={group.id}/>)}</div>
        </section>

        <section className="privacy shell" id="safety">
          <div className="privacy-mark"><Icon name="shield" size={30}/></div>
          <div><span className="kicker">DESIGNED FOR DISCRETION</span><h2>Interest first.<br/>Identity after.</h2></div>
          <p>Before a mutual match, groups see compatibility, shared context, verification, and blurred profiles—not a directory of strangers.</p>
          <div className="privacy-points"><span><Icon name="check" size={15}/>Group-only by default</span><span><Icon name="check" size={15}/>Socials stay private</span><span><Icon name="check" size={15}/>Meet-up safety tools</span></div>
        </section>

        <section className="promotions shell">
          <div className="promo-copy"><span className="sponsor-tag">PROMOTED · LOCAL PARTNER</span><h2>Good night,<br/>already handled.</h2><p>Group perks appear when they actually fit your plan.</p></div>
          <article className="promo-card coral"><span>TONIGHT ONLY</span><h3>Skip the cover before 10.</h3><p>Pins Mechanical Co. · Short North</p><button onClick={() => events[0] && joinEvent(events[0])}>Add to plan<Icon name="arrow" size={18}/></button></article>
          <article className="promo-card dark"><span>FOR GROUPS OF 4+</span><h3>Your first round of games is on us.</h3><p>Forty Deuce · Easton</p><button onClick={() => setToast("Offer saved for your crew")}>Save offer<Icon name="arrow" size={18}/></button></article>
        </section>
      </main>

      <footer className="footer shell"><Logo/><p>One plan. More possibilities.</p><div><a href="#safety">Safety</a><button onClick={() => setToast("Venue partner form coming next")}>For venues</button><span>Concept MVP</span></div></footer>

      {planOpen && (
        <PlanModal plan={plan} onClose={() => setPlanOpen(false)} onSave={(next) => { setPlan(next); setPlanOpen(false); setToast("Tonight’s plan is live"); }}/>
      )}
      {profile && (
        <ProfileModal group={profile} onClose={() => setProfile(null)} onWave={() => sendWave(profile)}/>
      )}
      {matchedGroup && (
        <MatchModal group={matchedGroup} onClose={() => setMatchedGroup(null)} onMessage={() => { setMatchedGroup(null); setToast("Group chat opened"); }}/>
      )}
      {toast && <div className="toast" role="status"><Icon name="check" size={17}/>{toast}</div>}
    </div>
  );
}

function NightMap({ events, selected, onSelect }) {
  return <div className="map-panel" aria-label="Tonight activity map">
    <div className="map-grid"></div><div className="river"></div>
    <span className="map-label campus">CAMPUS</span><span className="map-label short-north">SHORT NORTH</span><span className="map-label downtown">DOWNTOWN</span><span className="map-label old-north">OLD NORTH</span>
    <span className="road road-one"></span><span className="road road-two"></span><span className="road road-three"></span><span className="road road-four"></span>
    {events.map((event) => <button className={`map-marker ${selected?.id === event.id ? "selected" : ""}`} style={{ left: `${event.x}%`, top: `${event.y}%`, "--heat": `${Math.min(92, 42 + event.attending / 2)}px` }} onClick={() => onSelect(event)} aria-label={`${event.title}, ${event.groups} groups`} key={event.id}><span className={`heat ${event.tone}`}></span><b>{event.groups}</b><small>groups</small></button>)}
    <div className="map-legend"><span><i className="warm"></i>More active</span><span><i></i>Less active</span></div>
    <button className="locate-button" aria-label="Use my location" onClick={() => navigator.geolocation?.getCurrentPosition(() => {}, () => {})}><Icon name="compass" size={18}/></button>
  </div>;
}

function EventRail({ events, source, selected, onSelect, onJoin }) {
  return <aside className="event-rail">
    <div className="rail-top"><div><span className={`source-dot ${source}`}></span><strong>{source === "live" ? "Live events" : source === "loading" ? "Finding events" : "Tonight preview"}</strong></div><span>{events.length} nearby</span></div>
    <div className="event-scroll">{events.map((event) => <article className={`event-row ${selected?.id === event.id ? "selected" : ""}`} onClick={() => onSelect(event)} key={event.id}>
      <div className={`event-time ${event.tone}`}><strong>{event.time.split(" ")[0]}</strong><span>{event.time.split(" ")[1] || ""}</span></div>
      <div className="event-info">{event.promoted && <small className="promoted-label">PROMOTED</small>}<h3>{event.title}</h3><p>{event.venue} · {event.area}</p><div><span><Icon name="users" size={13}/>{event.attending} going</span><span>{event.category}</span></div></div>
      <button className="row-arrow" onClick={(eventClick) => { eventClick.stopPropagation(); onJoin(event); }} aria-label={`Add ${event.title} to plan`}><Icon name="arrow" size={17}/></button>
    </article>)}</div>
    {source === "demo" && <p className="data-note">Demo attendance protects real identities. Add a Ticketmaster key to pull the current event lineup.</p>}
  </aside>;
}

function MatchCard({ group, featured, onOpen, onWave }) {
  return <article className={`match-card ${featured ? "featured" : ""}`}>
    <div className="match-top"><AvatarStack people={group.initials} masked/><div className="score"><strong>{group.score}</strong><span>% fit</span></div></div>
    <div className="match-status"><span className="live-dot"></span>{group.status}</div><h3>{group.name}</h3><p>{group.members} people · Ages {group.range} · {group.distance}</p>
    <div className="reason-row"><span>{group.overlap}</span><span>{group.vibe}</span>{group.mutuals > 0 && <span>{group.mutuals} mutuals</span>}</div>
    <div className="social-proof"><Icon name="shield" size={14}/>{group.verified}/{group.members} verified <i></i><Icon name="instagram" size={14}/>{group.socials.length} socials linked</div>
    <div className="match-actions"><button onClick={onOpen}>View fit</button><button className="wave" onClick={onWave}>Wave <Icon name="arrow" size={16}/></button></div>
  </article>;
}

function ModalShell({ children, onClose, label, className = "" }) {
  return <div className="modal-layer" role="dialog" aria-modal="true" aria-label={label}><button className="modal-backdrop" onClick={onClose} aria-label="Close"></button><div className={`modal ${className}`}><button className="modal-close" onClick={onClose} aria-label="Close"><Icon name="close"/></button>{children}</div></div>;
}

function PlanModal({ plan, onClose, onSave }) {
  const [next, setNext] = useState(plan);
  const set = (key, value) => setNext((current) => ({ ...current, [key]: value }));
  return <ModalShell onClose={onClose} label="Set tonight's plan" className="plan-modal">
    <span className="kicker">30-SECOND SETUP</span><h2>What’s the move?</h2><p>One screen. Change anything later.</p>
    <label><span>Who’s in?</span><div className="modal-crew"><AvatarStack/><strong>The usual four</strong><button>Change</button></div></label>
    <label><span>Where?</span><div className="choice-grid">{["Short North", "Campus", "Downtown", "Open to ideas"].map((area) => <button className={next.area === area ? "selected" : ""} onClick={() => set("area", area)} key={area}>{area}</button>)}</div></label>
    <label><span>What energy?</span><div className="choice-grid vibes">{vibes.map((vibe) => <button className={next.vibe === vibe ? "selected" : ""} onClick={() => set("vibe", vibe)} key={vibe}>{vibe}</button>)}</div></label>
    <label><span>Starting around</span><div className="choice-grid time">{["8:30 PM", "9:30 PM", "10:30 PM", "Whenever"].map((time) => <button className={next.time === time ? "selected" : ""} onClick={() => set("time", time)} key={time}>{time}</button>)}</div></label>
    <button className="modal-primary" onClick={() => onSave(next)}>Go live <Icon name="arrow"/></button>
  </ModalShell>;
}

function ProfileModal({ group, onClose, onWave }) {
  return <ModalShell onClose={onClose} label={`${group.name} profile`} className="profile-modal">
    <div className="profile-visual"><AvatarStack people={group.initials} masked size="large"/><div><span className="score-pill">{group.score}% FIT</span><h2>{group.name}</h2><p>{group.members} people · Ages {group.range}</p></div></div>
    <div className="identity-note"><Icon name="lock" size={18}/><div><strong>Faces unlock after you both match</strong><span>Names and accounts stay private until then.</span></div></div>
    <div className="fit-breakdown"><div><span>Same vibe</span><strong>98%</strong></div><div><span>Plan overlap</span><strong>96%</strong></div><div><span>Group fit</span><strong>92%</strong></div></div>
    <section><span className="kicker">TONIGHT</span><h3>{group.status}</h3><p>{group.overlap} · {group.distance} away</p></section>
    <section><span className="kicker">A LITTLE CONTEXT</span><p>{group.blurb}</p><div className="interest-list">{group.interests.map((interest) => <span key={interest}>{interest}</span>)}</div></section>
    <div className="account-links"><span><Icon name="shield" size={16}/>{group.verified}/{group.members} identity verified</span><span><Icon name="instagram" size={16}/>{group.socials.join(" + ")} connected</span><span><Icon name="users" size={16}/>{group.mutuals || "No"} mutual connections</span></div>
    <button className="modal-primary" onClick={onWave}>Wave to this group <Icon name="arrow"/></button>
  </ModalShell>;
}

function MatchModal({ group, onClose, onMessage }) {
  return <ModalShell onClose={onClose} label="It's a match" className="matched-modal">
    <span className="burst"><Icon name="spark" size={28}/></span><span className="kicker">IT’S MUTUAL</span><h2>You found<br/>your people.</h2>
    <div className="mutual-groups"><div><AvatarStack/><strong>The usual four</strong></div><span>+</span><div><AvatarStack people={group.initials}/><strong>{group.name}</strong></div></div>
    <p>Both groups are heading to Pins around 9:30.</p>
    <div className="unlocked"><Icon name="instagram"/><span><strong>Profiles unlocked</strong><small>First names and connected accounts are now visible.</small></span></div>
    <button className="modal-primary" onClick={onMessage}><Icon name="message"/>Open group chat</button><button className="text-button" onClick={onClose}>Keep exploring</button>
  </ModalShell>;
}

export default App;
