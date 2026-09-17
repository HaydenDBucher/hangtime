const SESSION_KEY = "hangtime.session.v1";
const USERS_KEY = "hangtime.users.v1";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const cloudEnabled = Boolean(supabaseUrl && supabaseKey);

const readJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const saveSession = (session) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
};

const hashPassword = async (password) => {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

const cloudRequest = async (path, body) => {
  const response = await fetch(`${supabaseUrl}/auth/v1/${path}`, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.msg || payload.error_description || "Authentication failed.");
  return payload;
};

export function getSession() {
  return readJson(SESSION_KEY, null);
}

export function isCloudAuthEnabled() {
  return cloudEnabled;
}

export async function signUp({ email, password, profile }) {
  const normalizedEmail = email.trim().toLowerCase();
  if (cloudEnabled) {
    const payload = await cloudRequest("signup", { email: normalizedEmail, password, data: profile });
    const session = {
      accessToken: payload.access_token || null,
      mode: "cloud",
      profile: { ...profile, email: normalizedEmail, id: payload.user?.id },
      needsVerification: !payload.access_token,
    };
    return saveSession(session);
  }

  const users = readJson(USERS_KEY, []);
  if (users.some((user) => user.email === normalizedEmail)) throw new Error("An account already exists for that email.");
  const user = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    passwordHash: await hashPassword(password),
    profile: { ...profile, email: normalizedEmail },
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  return saveSession({ mode: "prototype", profile: { ...user.profile, id: user.id } });
}

export async function signIn({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  if (cloudEnabled) {
    const payload = await cloudRequest("token?grant_type=password", { email: normalizedEmail, password });
    const session = {
      accessToken: payload.access_token,
      refreshToken: payload.refresh_token,
      mode: "cloud",
      profile: { email: normalizedEmail, id: payload.user?.id, ...payload.user?.user_metadata },
    };
    return saveSession(session);
  }

  const users = readJson(USERS_KEY, []);
  const passwordHash = await hashPassword(password);
  const user = users.find((candidate) => candidate.email === normalizedEmail && candidate.passwordHash === passwordHash);
  if (!user) throw new Error("Email or password is incorrect.");
  return saveSession({ mode: "prototype", profile: { ...user.profile, id: user.id } });
}

export function updateSessionProfile(profile) {
  const session = getSession();
  if (!session) return null;
  const next = { ...session, profile: { ...session.profile, ...profile } };
  saveSession(next);
  if (session.mode === "prototype") {
    const users = readJson(USERS_KEY, []);
    localStorage.setItem(USERS_KEY, JSON.stringify(users.map((user) => user.id === next.profile.id ? { ...user, profile: next.profile } : user)));
  }
  return next;
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
}
