const EVENTS_KEY = "hangtime.mvp.events.v1";
const SESSION_KEY = "hangtime.mvp.session.v1";

function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function sessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function trackExperimentEvent(name, properties = {}) {
  const events = read(EVENTS_KEY, []);
  events.push({ name, properties, sessionId: sessionId(), timestamp: new Date().toISOString() });
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events.slice(-250)));
}

export function getExperimentEvents() {
  return read(EVENTS_KEY, []);
}

export function exportExperimentEvents() {
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    notice: "Anonymous prototype interaction events. Review before sharing.",
    events: getExperimentEvents(),
  }, null, 2);
}
