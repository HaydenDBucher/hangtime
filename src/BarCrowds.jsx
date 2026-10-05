import { useState } from 'react';
import { CROWD_LEVELS, crowdLevel, crowdPopulation } from './crowdService';

export default function BarCrowds({ events, loading, onSelect }) {
  const [preference, setPreference] = useState('all');
  const bars = events.filter(event => event.venueType === 'bar');
  const visible = bars.filter(event => preference === 'all' || crowdLevel(event)?.id === preference)
    .sort((a, b) => (crowdPopulation(a) ?? Infinity) - (crowdPopulation(b) ?? Infinity));
  return <section className="bar-crowds" aria-labelledby="bar-crowds-title">
    <span className="kicker">PICK YOUR KIND OF NIGHT</span>
    <h2 id="bar-crowds-title">How big a crowd are you looking for?</h2>
    <p>Compare the population at each bar before choosing your first stop.</p>
    <p className="crowd-disclosure">Modeled demo populations, not live headcounts. These count bands do not measure capacity, noise, or guarantee a venue's atmosphere.</p>
    <div className="crowd-filters" role="group" aria-label="Preferred bar crowd">
      <button aria-pressed={preference === 'all'} onClick={() => setPreference('all')}>All crowds</button>
      {CROWD_LEVELS.map(level => <button key={level.id} aria-pressed={preference === level.id} onClick={() => setPreference(level.id)}><strong>{level.label}</strong><small>{level.range}</small></button>)}
    </div>
    <p role="status">{loading ? 'Loading bar previews...' : `${visible.length} bar previews match your choice`}</p>
    <div className="bar-crowd-grid">{visible.map(event => {
      const count = crowdPopulation(event);
      const level = crowdLevel(event);
      return <article className="bar-crowd-card" key={event.id}>
        <span className={`crowd-badge ${level?.id || 'unknown'}`}>{level?.label || 'Population unavailable'}</span>
        <h3>{event.venue}</h3><p>{event.area}</p>
        <strong className="crowd-population">{count === null ? 'Unknown' : `~${count} people`}</strong>
        <small>Modeled population</small><p>{level?.detail || 'No population estimate available.'}</p>
        <p>Wait: {event.wait || 'Unknown'} · Entry: {event.age || 'Confirm with venue'}</p>
        <button onClick={() => onSelect(event)}>View bar and offers</button>
      </article>;
    })}</div>
    {!loading && !visible.length && <p>No bar previews match this crowd size. Choose another crowd size or check back when more data is available.</p>}
  </section>;
}
