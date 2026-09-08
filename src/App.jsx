import { useEffect, useMemo, useState } from "react";

const members = [
  { name: "Jake", initials: "JK", tone: "amber" },
  { name: "Connor", initials: "CO", tone: "blue" },
  { name: "Maya", initials: "MY", tone: "rose" },
  { name: "Alex", initials: "AL", tone: "green" },
  { name: "You", initials: "YOU", tone: "orange" },
];

const groups = [
  {
    id: 1,
    name: "Lane Ave Crew",
    people: 5,
    ages: "21–23",
    distance: "0.4 mi",
    destination: "Short North",
    vibe: "Going Out",
    compatibility: 94,
    plan: "Pins → Standard Hall",
    mutuals: 3,
    verified: true,
    initials: ["EM", "JR", "SL", "TY", "KC"],
    interests: ["Buckeye football", "Live music", "New spots", "Trivia"],
    blurb: "Five OSU seniors making the most of a rare free Friday. Starting competitive, ending wherever the night goes.",
  },
  {
    id: 2,
    name: "Clintonville Crew",
    people: 4,
    ages: "22–24",
    distance: "0.8 mi",
    destination: "Short North",
    vibe: "Chill Drinks",
    compatibility: 86,
    plan: "Dinner then bars",
    mutuals: 1,
    verified: true,
    initials: ["NB", "LE", "RA", "MO"],
    interests: ["Foodies", "Patios", "Indie music", "Travel"],
    blurb: "A laid-back group of recent grads looking for a good patio and better conversation.",
  },
  {
    id: 3,
    name: "Campus Crew",
    people: 6,
    ages: "21–22",
    distance: "1.1 mi",
    destination: "Short North",
    vibe: "Live Music",
    compatibility: 79,
    plan: "Concert then Short North",
    mutuals: 0,
    verified: false,
    initials: ["DW", "AP", "CJ", "MK", "LS", "+1"],
    interests: ["Concerts", "Dancing", "Photography", "Festivals"],
    blurb: "Friends from campus catching a show before heading north for a late-night bite.",
  },
];

const vibes = ["Going Out", "Chill Drinks", "Sports Bar", "Live Music", "Dinner", "Concert", "House Party", "Sober / Low-Key"];
const lookingOptions = ["Meet another group", "Find somewhere to go", "Both"];

function Icon({ name, size = 20 }) {
  const paths = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    back: <><path d="M19 12H5"/><path d="m11 18-6-6 6-6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>,
    message: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/>,
    spark: <path d="m12 2 1.7 5.3L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.7L12 2ZM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    close: <><path d="m6 6 12 12"/><path d="m18 6-12 12"/></>,
    restart: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
  };
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Logo({ compact = false }) {
  return (
    <a className={`logo ${compact ? "compact" : ""}`} href="#top" aria-label="Hangtime home">
      <span className="logo-mark" aria-hidden="true"><i></i><i></i><b>H</b></span>
      <strong>hangtime<span>.</span></strong>
    </a>
  );
}

function AvatarStack({ initials, large = false }) {
  return <div className={`avatar-stack ${large ? "large" : ""}`} aria-label={`${initials.length} group members`}>{initials.map((initial, index) => <span key={`${initial}-${index}`} style={{ "--index": index }}>{initial}</span>)}</div>;
}

function VerifiedBadge({ children = "Verified" }) {
  return <span className="verified"><Icon name="check" size={12}/>{children}</span>;
}

function App() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("demo-open", demoOpen);
    return () => document.body.classList.remove("demo-open");
  }, [demoOpen]);

  const openDemo = () => {
    setMobileOpen(false);
    setDemoOpen(true);
  };

  const scrollTo = (id) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header className="navbar" id="top">
        <div className="nav-inner">
          <Logo />
          <nav className={mobileOpen ? "open" : ""} aria-label="Main navigation">
            <button onClick={() => scrollTo("how-it-works")}>How It Works</button>
            <button onClick={() => scrollTo("safety")}>Safety</button>
            <button onClick={() => scrollTo("venues")}>For Venues</button>
            <button className="nav-cta" onClick={openDemo}>Find Your Crew <Icon name="arrow" size={16}/></button>
          </nav>
          <button className="menu-button" onClick={() => setMobileOpen(value => !value)} aria-label="Toggle navigation" aria-expanded={mobileOpen}><span></span><span></span></button>
        </div>
      </header>

      <main>
        <section className="hero section-shell">
          <div className="hero-glow one"></div><div className="hero-glow two"></div>
          <div className="hero-copy reveal">
            <span className="section-tag"><i></i> Social discovery, reimagined</span>
            <h1>Your group is going out.<br/><em>Who are you meeting?</em></h1>
            <p>Hangtime matches friend groups going out nearby based on location, plans, and vibe—so meeting new people doesn’t have to depend on luck.</p>
            <div className="hero-actions">
              <button className="button primary" onClick={openDemo}>Find Your Crew <Icon name="arrow" size={18}/></button>
              <button className="button ghost" onClick={() => scrollTo("how-it-works")}>See How It Works</button>
            </div>
            <div className="hero-note"><AvatarStack initials={["JK","MY","AL","YOU"]}/><span>Tonight is better together.</span></div>
          </div>
          <HeroPhone onDemo={openDemo}/>
        </section>

        <div className="marquee" aria-hidden="true"><div>YOUR CREW <b>✦</b> THEIR CREW <b>✦</b> ONE BETTER NIGHT <b>✦</b> YOUR CREW <b>✦</b> THEIR CREW <b>✦</b> ONE BETTER NIGHT <b>✦</b></div></div>

        <HowItWorks />
        <ProblemSection />
        <GroupsFeature />
        <SafetySection />
        <VenueSection onDemo={openDemo} />
        <SituationsSection />
        <MvpSection />

        <section className="final-cta section-shell">
          <div className="cta-orbit" aria-hidden="true"><span></span><span></span><span></span></div>
          <span className="section-tag"><i></i> Tonight starts here</span>
          <h2>Your night already has a plan.<br/><em>Now find the people.</em></h2>
          <button className="button primary large" onClick={openDemo}>Start a Hangtime <Icon name="arrow" size={19}/></button>
        </section>
      </main>

      <footer className="site-footer section-shell">
        <div><Logo/><p>Your crew. Their crew. One better night.</p></div>
        <div className="footer-links"><button onClick={() => scrollTo("how-it-works")}>Product</button><button onClick={() => scrollTo("safety")}>Safety</button><button onClick={() => scrollTo("venues")}>Venues</button><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a><a href="https://tiktok.com" target="_blank" rel="noreferrer">TikTok</a></div>
        <span className="concept-pill">Concept MVP</span>
      </footer>

      <button className="pitch-button" onClick={openDemo}><span><Icon name="spark" size={15}/></span> Pitch Demo</button>
      {demoOpen && <ProductDemo onClose={() => setDemoOpen(false)} />}
    </>
  );
}

function HeroPhone({ onDemo }) {
  return (
    <div className="hero-visual reveal delay-one">
      <div className="orbit-label label-one"><span>94%</span> vibe match</div>
      <div className="orbit-label label-two"><Icon name="shield" size={15}/> groups verified</div>
      <div className="phone-wrap">
        <div className="phone">
          <div className="phone-speaker"></div>
          <div className="phone-screen">
            <div className="phone-status"><span>9:14</span><span>● ◔ ▰</span></div>
            <div className="phone-heading"><div><small>TONIGHT IN COLUMBUS</small><strong>Short North</strong></div><span className="mini-avatar">YOU</span></div>
            <div className="your-crew-card">
              <div className="mini-label">YOUR CREW</div>
              <div className="crew-line"><AvatarStack initials={["JK","CO","MY","YOU"]}/><strong>4 going out</strong></div>
              <div className="plan-grid"><span><small>VIBE</small>Bars + Social</span><span><small>DESTINATION</small>Short North</span><span><small>TIME</small>9:30 PM</span></div>
            </div>
            <div className="matches-label"><span>GROUPS FOR YOU</span><b>12 nearby</b></div>
            <div className="mini-match-card">
              <div><AvatarStack initials={["EM","JR","SL"]}/><span className="match-percent">94%</span></div>
              <h4>Lane Ave Crew</h4><p>5 people · 0.4 mi</p>
              <div className="mini-plan"><Icon name="pin" size={13}/> Pins → Standard Hall</div>
            </div>
            <button className="phone-demo-button" onClick={onDemo}>Try the live demo <Icon name="arrow" size={15}/></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ tag, title, copy, centered = false }) {
  return <div className={`section-heading ${centered ? "centered" : ""}`}><span className="section-tag"><i></i>{tag}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</div>;
}

function HowItWorks() {
  const steps = [
    ["01", "Build Your Crew", "Create different groups for roommates, classmates, teammates, coworkers, or whoever you go out with.", "users"],
    ["02", "Set the Vibe", "Tell Hangtime who’s going, where you’re headed, and what kind of night you want.", "spark"],
    ["03", "Match & Meet", "Discover compatible groups nearby, match, chat, and meet in real life.", "message"],
  ];
  return <section className="content-section section-shell" id="how-it-works"><SectionHeading tag="How it works" title={<>Three taps between your group<br/>and a better night.</>} centered/><div className="steps-grid">{steps.map(([number,title,copy,icon]) => <article className="step-card" key={number}><span className="step-number">{number}</span><div className="step-icon"><Icon name={icon}/></div><h3>{title}</h3><p>{copy}</p><i className="connector"></i></article>)}</div></section>;
}

function ProblemSection() {
  return <section className="problem-section" id="problem"><div className="section-shell problem-inner"><div><SectionHeading tag="The problem" title={<>Going out shouldn’t<br/>depend on luck.</>} copy="Groups already invest in the night. The missing piece is a simple way to discover who else is headed the same direction."/><div className="spend-list">{["Uber / Lyft","Covers & tickets","Drinks & food","Hours making plans"].map(item => <span key={item}><Icon name="check" size={14}/>{item}</span>)}</div></div><div className="problem-flow"><FlowCard muted title="THE GROUP CHAT" items={["Where are we going?","Who else is out?","No idea."]}/><div className="versus">VS</div><FlowCard title="HANGTIME" items={["See nearby groups","Match the vibe","Meet tonight"]}/></div></div></section>;
}

function FlowCard({ title, items, muted = false }) {
  return <div className={`flow-card ${muted ? "muted" : "active"}`}><span>{title}</span>{items.map((item,index) => <div key={item}><p>{item}</p>{index < items.length - 1 && <b>↓</b>}</div>)}</div>;
}

function GroupsFeature() {
  const crews = [["College Friends","CF","orange"],["Roommates","RM","blue"],["Work Crew","WK","rose"],["Gym Friends","GF","green"],["Couples Group","CG","violet"]];
  return <section className="content-section section-shell groups-feature"><div className="groups-phone"><div className="groups-phone-head"><span>YOUR GROUPS</span><i className="add-group" aria-hidden="true">＋</i></div>{crews.map(([name,initial,tone],index) => <div className={`crew-list-item ${index === 0 ? "selected" : ""}`} key={name}><span className={`crew-icon ${tone}`}>{initial}</span><div><strong>{name}</strong><small>{[5,4,7,3,6][index]} members</small></div><b>›</b></div>)}</div><div className="groups-copy"><SectionHeading tag="Your people, organized" title={<>You don’t have one friend group.</>} copy="Hangtime shouldn’t make you choose. Build a crew for every part of your life, then decide who’s in for tonight."/><div className="quote-line"><span>“</span><p>The right group for<br/>whatever the night becomes.</p></div></div></section>;
}

function SafetySection() {
  const items = [["Identity verification","Know there’s a real person behind every profile."],["Connected socials","Optional context without exposing private accounts."],["Mutual connections","See the people and communities you share."],["Group-based matching","Meet together, never one-on-one by default."],["Reporting & blocking","Clear tools before, during, and after a meetup."],["Post-meet trust signals","Build a history of reliable group experiences."]];
  return <section className="safety-section" id="safety"><div className="section-shell"><SectionHeading tag="Safety by design" title={<>Meet new people.<br/><em>Know who you’re meeting.</em></>} copy="Context creates confidence. Hangtime layers verification, shared connections, and group accountability into every introduction."/><div className="safety-grid">{items.map(([title,copy],index) => <article key={title}><span>{index < 3 ? <Icon name="shield"/> : index === 3 ? <Icon name="users"/> : <Icon name="lock"/>}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></div></section>;
}

function VenueSection({ onDemo }) {
  return <section className="venue-section section-shell" id="venues"><SectionHeading tag="The business" title={<>Where social discovery<br/>meets local nightlife.</>} copy="Revenue follows the moment of intent—when groups are actively deciding where to go and what to do."/><div className="business-grid"><article className="business-card"><div className="business-icon plus">H+</div><span>FOR PEOPLE</span><h3>Hangtime+</h3><p>Premium controls for people who want more ways to shape the night.</p><ul>{["Advanced filters","More discovery options","Boosted plans","Travel mode","Additional match controls"].map(item => <li key={item}><Icon name="check" size={14}/>{item}</li>)}</ul></article><article className="business-card venue"><div className="business-icon"><Icon name="pin"/></div><span>FOR BUSINESSES</span><h3>Hangtime for Venues</h3><p>Reach groups at the exact moment they’re choosing where to go.</p><ul>{["Promoted placement","Group specials","Decision-time offers","Sponsored experiences"].map(item => <li key={item}><Icon name="check" size={14}/>{item}</li>)}</ul></article><article className="promotion-card"><div className="promotion-image"><div className="bowling-ball"><i></i><i></i><i></i></div><span>VENUE PICK</span></div><div className="promotion-copy"><small>GROUPS NEAR SHORT NORTH TONIGHT</small><h3>Pins Mechanical Co.</h3><p>Skip the cover before 10 PM</p><button onClick={onDemo}>View Venue <Icon name="arrow" size={15}/></button></div></article></div></section>;
}

function SituationsSection() {
  const situations = [["Campus nightlife","01"],["Concerts","02"],["Tailgates","03"],["Bar crawls","04"],["Festivals","05"],["New cities","06"]];
  return <section className="situations-section"><div className="section-shell"><SectionHeading tag="Use cases" title="Built for nights like these." centered/><div className="situations-grid">{situations.map(([name,number]) => <article key={name}><span>{number}</span><h3>{name}</h3><i></i></article>)}</div></div></section>;
}

function MvpSection() {
  const tests = ["Recruit college friend groups","Let them create a night","Show compatible groups nearby","Measure match intent","Measure whether groups would meet"];
  return <section className="mvp-section section-shell"><div className="assumption-card"><span className="section-tag"><i></i>The riskiest assumption</span><h2>What we need<br/>to prove.</h2><blockquote>“Will existing friend groups actually choose to meet another group they don’t already know?”</blockquote></div><div className="test-card"><span>MVP TEST</span>{tests.map((test,index) => <div key={test}><b>{String(index + 1).padStart(2,"0")}</b><p>{test}</p>{index < tests.length - 1 && <i></i>}</div>)}</div></section>;
}

function ProductDemo({ onClose }) {
  const [screen, setScreen] = useState("crew");
  const [selectedMembers, setSelectedMembers] = useState(["Jake", "Connor", "Maya", "You"]);
  const [vibe, setVibe] = useState("Going Out");
  const [looking, setLooking] = useState("Both");
  const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  const [skipped, setSkipped] = useState([]);
  const [meetupSet, setMeetupSet] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    ["Lane Ave Crew", "We’re heading to Pins around 9:45", "9:31"],
    ["The Boys", "Perfect, we’re two blocks away", "9:32", "mine"],
    ["Lane Ave Crew", "Meet by the patio?", "9:33"],
    ["The Boys", "Bet 🤝", "9:33", "mine"],
  ]);
  const [draft, setDraft] = useState("");

  const order = ["crew", "plan", "discover", "profile", "match", "chat"];
  const progressIndex = order.indexOf(screen);
  const visibleGroups = useMemo(() => groups.filter(group => !skipped.includes(group.id)), [skipped]);

  const restart = () => {
    setScreen("crew"); setSelectedMembers(["Jake", "Connor", "Maya", "You"]); setVibe("Going Out"); setLooking("Both"); setSelectedGroup(groups[0]); setSkipped([]); setMeetupSet(false);
  };
  const goBack = () => {
    const back = { plan: "crew", discover: "plan", profile: "discover", match: "profile", chat: "match" };
    if (back[screen]) setScreen(back[screen]);
  };
  const chooseGroup = (group, destination) => { setSelectedGroup(group); setScreen(destination); };
  const submitMessage = event => {
    event.preventDefault();
    if (!draft.trim()) return;
    setChatMessages(messages => [...messages, ["The Boys", draft.trim(), "now", "mine"]]);
    setDraft("");
  };

  return (
    <div className="demo-layer" role="dialog" aria-modal="true" aria-label="Interactive Hangtime product demo">
      <div className="demo-backdrop" onClick={onClose}></div>
      <div className="demo-shell">
        <header className="demo-topbar">
          <Logo compact/>
          <div className="demo-progress" aria-label={`Demo step ${progressIndex + 1} of 6`}>{order.map((item,index) => <i key={item} className={index <= progressIndex ? "active" : ""}></i>)}</div>
          <div className="demo-tools"><button onClick={restart}><Icon name="restart" size={16}/><span>Restart Demo</span></button><button className="demo-close" onClick={onClose} aria-label="Close demo"><Icon name="close"/></button></div>
        </header>
        <div className="demo-body">
          {screen !== "crew" && <button className="demo-back" onClick={goBack}><Icon name="back" size={17}/> Back</button>}
          {screen === "crew" && <CrewScreen selected={selectedMembers} setSelected={setSelectedMembers} onNext={() => setScreen("plan")}/>} 
          {screen === "plan" && <PlanScreen count={selectedMembers.length} vibe={vibe} setVibe={setVibe} looking={looking} setLooking={setLooking} onNext={() => setScreen("discover")}/>} 
          {screen === "discover" && <DiscoveryScreen groups={visibleGroups} onSkip={group => setSkipped(items => [...items, group.id])} onView={group => chooseGroup(group,"profile")} onMatch={group => chooseGroup(group,"match")} onReset={() => setSkipped([])}/>} 
          {screen === "profile" && <ProfileScreen group={selectedGroup} onMatch={() => setScreen("match")}/>} 
          {screen === "match" && <MatchScreen group={selectedGroup} onChat={() => setScreen("chat")} onMeet={() => { setMeetupSet(true); setScreen("chat"); }}/>} 
          {screen === "chat" && <ChatScreen group={selectedGroup} messages={chatMessages} draft={draft} setDraft={setDraft} onSubmit={submitMessage} meetupSet={meetupSet} setMeetupSet={setMeetupSet}/>} 
        </div>
      </div>
    </div>
  );
}

function DemoHeading({ eyebrow, title, copy }) {
  return <div className="demo-heading"><span>{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</div>;
}

function CrewScreen({ selected, setSelected, onNext }) {
  const toggle = name => setSelected(items => items.includes(name) ? items.filter(item => item !== name) : [...items, name]);
  return <div className="demo-screen narrow"><DemoHeading eyebrow="YOUR GROUP" title="Who’s out tonight?" copy="Tap the people joining tonight’s plan."/><div className="group-title-card"><div className="group-avatar">TB</div><div><h3>The Boys</h3><p>{members.length} members · Columbus, OH</p></div><VerifiedBadge>Group verified</VerifiedBadge></div><div className="member-list">{members.map(member => { const active = selected.includes(member.name); return <button className={active ? "selected" : ""} onClick={() => toggle(member.name)} key={member.name} aria-pressed={active}><span className={`member-avatar ${member.tone}`}>{member.initials}</span><strong>{member.name}</strong><i>{active && <Icon name="check" size={16}/>}</i></button>; })}</div><div className="selection-summary"><span><b>{selected.length}</b> going out tonight</span><AvatarStack initials={members.filter(member => selected.includes(member.name)).map(member => member.initials)}/></div><button className="demo-primary" disabled={selected.length < 2} onClick={onNext}>Build Tonight’s Plan <Icon name="arrow" size={18}/></button></div>;
}

function PlanScreen({ count, vibe, setVibe, looking, setLooking, onNext }) {
  return <div className="demo-screen plan-screen"><DemoHeading eyebrow="SET THE NIGHT" title="What’s the move?" copy="A little context makes every introduction better."/><div className="plan-layout"><div className="plan-main"><label>Choose your vibe</label><div className="chip-grid">{vibes.map(item => <button key={item} className={vibe === item ? "selected" : ""} onClick={() => setVibe(item)}>{item}</button>)}</div><label>What are you looking for?</label><div className="choice-row">{lookingOptions.map(item => <button key={item} className={looking === item ? "selected" : ""} onClick={() => setLooking(item)}><i>{looking === item && <Icon name="check" size={13}/>}</i>{item}</button>)}</div></div><aside className="tonight-card"><span>TONIGHT’S PLAN</span><div><Icon name="pin"/><p><small>LOCATION</small><strong>Short North, Columbus</strong></p></div><div className="split"><p><small>TIME</small><strong>9:30 PM</strong></p><p><small>GROUP</small><strong>{count} people</strong></p></div><div className="plan-vibe"><small>VIBE</small><strong>{vibe}</strong></div></aside></div><button className="demo-primary" onClick={onNext}>Find Groups <Icon name="spark" size={18}/></button></div>;
}

function DiscoveryScreen({ groups: visible, onSkip, onView, onMatch, onReset }) {
  return <div className="demo-screen discovery-screen"><DemoHeading eyebrow="DISCOVER" title="Groups near you tonight" copy="Matched by your crew, destination, and vibe."/>{visible.length ? <div className="discovery-grid">{visible.map((group,index) => <GroupCard key={group.id} group={group} featured={index === 0} onSkip={() => onSkip(group)} onView={() => onView(group)} onMatch={() => onMatch(group)}/>)}</div> : <div className="empty-state"><div>↻</div><h3>You’ve seen everyone nearby</h3><p>Reset the deck to bring the groups back for the demo.</p><button className="demo-primary" onClick={onReset}>Reset groups</button></div>}</div>;
}

function GroupCard({ group, featured, onSkip, onView, onMatch }) {
  return <article className={`group-card ${featured ? "featured" : ""}`}>{featured && <span className="top-match"><Icon name="spark" size={13}/> TOP MATCH</span>}<div className="group-card-top"><AvatarStack initials={group.initials} large/><div className="compatibility"><strong>{group.compatibility}%</strong><span>match</span></div></div><h3>{group.name}</h3><p className="group-meta">{group.people} people · Ages {group.ages} · {group.distance}</p><div className="badge-row">{group.verified && <VerifiedBadge/>}{group.mutuals > 0 && <span className="mutuals"><Icon name="users" size={12}/>{group.mutuals} mutual {group.mutuals === 1 ? "connection" : "connections"}</span>}</div><div className="group-details"><div><small>VIBE</small><strong>{group.vibe}</strong></div><div><small>GOING TO</small><strong>{group.destination}</strong></div><div className="wide"><small>THE PLAN</small><strong>{group.plan}</strong></div></div><div className="card-actions"><button onClick={onSkip}>Skip</button><button onClick={onView}>View Group</button><button className="match-button" onClick={onMatch}>Match <span>→</span></button></div></article>;
}

function ProfileScreen({ group, onMatch }) {
  return <div className="demo-screen profile-screen"><div className="profile-hero"><AvatarStack initials={group.initials} large/><div className="profile-score"><strong>{group.compatibility}%</strong><span>vibe match</span></div><h2>{group.name}</h2><p>{group.people} people · Ages {group.ages} · {group.distance} away</p><div className="badge-row centered">{group.verified && <VerifiedBadge/>}{group.mutuals > 0 && <span className="mutuals"><Icon name="users" size={12}/>{group.mutuals} mutual connections</span>}</div></div><div className="profile-layout"><div><section className="profile-section"><span>ABOUT THE GROUP</span><p>{group.blurb}</p></section><section className="profile-section"><span>INTERESTS</span><div className="interest-row">{group.interests.map(item => <i key={item}>{item}</i>)}</div></section><section className="profile-section tonight-profile"><span>TONIGHT</span><div><p><small>PLAN</small><strong>{group.plan}</strong></p><p><small>VIBE</small><strong>{group.vibe}</strong></p><p><small>AREA</small><strong>{group.destination}</strong></p></div></section></div><aside className="trust-card"><span><Icon name="shield"/> TRUST & SAFETY</span>{["Identity verified","Socials connected","Reliable Hangtime history"].map(item => <div key={item}><i><Icon name="check" size={13}/></i>{item}</div>)}<p>Hangtime keeps first meetings group-based and gives everyone clear safety controls.</p></aside></div><button className="demo-primary profile-match" onClick={onMatch}>Match Groups <Icon name="spark" size={18}/></button></div>;
}

function MatchScreen({ group, onChat, onMeet }) {
  return <div className="demo-screen match-screen"><div className="confetti" aria-hidden="true">{Array.from({length: 18},(_,index) => <i key={index} style={{"--i":index}}></i>)}</div><span className="match-kicker"><Icon name="spark" size={15}/> GROUPS MATCHED</span><h2>It’s a <em>Hangtime!</em></h2><div className="matched-groups"><div><AvatarStack initials={["JK","CO","MY","YOU"]} large/><strong>The Boys</strong></div><span>×</span><div><AvatarStack initials={group.initials} large/><strong>{group.name}</strong></div></div><p>Both groups are headed to the <strong>Short North.</strong></p><div className="match-plan"><Icon name="pin"/><div><small>SAME DESTINATION · SIMILAR VIBE</small><strong>{group.plan}</strong></div></div><div className="match-actions"><button className="demo-primary" onClick={onChat}><Icon name="message" size={18}/> Open Group Chat</button><button className="demo-secondary" onClick={onMeet}>Suggest a Meet-Up</button></div></div>;
}

function ChatScreen({ group, messages, draft, setDraft, onSubmit, meetupSet, setMeetupSet }) {
  return <div className="demo-screen chat-screen"><div className="chat-shell"><header><div className="chat-group"><div className="chat-avatars"><AvatarStack initials={["JK","MY",...group.initials.slice(0,2)]}/></div><div><strong>The Boys × {group.name}</strong><span><i></i>{4 + group.people} people · Active tonight</span></div></div><span className="chat-options" aria-hidden="true">•••</span></header><div className="chat-context"><Icon name="pin" size={15}/><span>Both groups are going to <strong>Short North</strong></span></div><div className="messages"><div className="chat-date">TONIGHT · 9:30 PM</div>{messages.map(([sender,text,time,type],index) => <div className={`message ${type || ""}`} key={`${text}-${index}`}><span className="message-avatar">{sender === "The Boys" ? "TB" : group.initials[index % group.initials.length]}</span><div><small>{sender}</small><p>{text}</p><time>{time}</time></div></div>)}{meetupSet && <div className="meetup-confirmation"><i><Icon name="check"/></i><div><small>MEET-UP SET</small><strong>Pins Mechanical Co. · 9:50 PM</strong><span>Both groups can see this plan</span></div></div>}</div><div className="suggestion-bar"><span>Quick suggestion</span><button onClick={() => setMeetupSet(true)}><Icon name="pin" size={14}/> Meet at Pins · 9:50</button></div><form className="chat-input" onSubmit={onSubmit}><span className="chat-add" aria-hidden="true">＋</span><input value={draft} onChange={event => setDraft(event.target.value)} placeholder="Message both groups…" aria-label="Chat message"/><button className="send-button" aria-label="Send message"><Icon name="send" size={17}/></button></form></div><div className="demo-payoff"><span className="section-tag"><i></i>The payoff</span><h3>Plans become people.</h3><p>In one flow, two existing groups discover each other, build trust, and turn “who else is out?” into a real meetup.</p><button className="demo-secondary" onClick={() => setMeetupSet(true)}>{meetupSet ? "Meet-up confirmed ✓" : "Confirm the meet-up"}</button></div></div>;
}

export default App;
