const GUESTBOOK_KEY = 'my-website-guestbook';
const SCORES_KEY = 'my-website-scores';

interface LocalMessage {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

interface LocalScore {
  id: number;
  player_name: string;
  attempts: number;
  target_number: number;
  created_at: string;
}

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function set<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* quota exceeded, silently fail */ }
}

export function getLocalMessages(): LocalMessage[] {
  return get<LocalMessage[]>(GUESTBOOK_KEY, []);
}

export function addLocalMessage(name: string, message: string): LocalMessage {
  const messages = getLocalMessages();
  const entry: LocalMessage = {
    id: Date.now(),
    name,
    message,
    created_at: new Date().toISOString(),
  };
  messages.unshift(entry);
  set(GUESTBOOK_KEY, messages);
  return entry;
}

export function getLocalScores(): LocalScore[] {
  const scores = get<LocalScore[]>(SCORES_KEY, []);
  return scores.sort((a, b) => a.attempts - b.attempts || new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function addLocalScore(player_name: string, attempts: number, target_number: number): LocalScore {
  const scores = getLocalScores();
  const entry: LocalScore = {
    id: Date.now(),
    player_name,
    attempts,
    target_number,
    created_at: new Date().toISOString(),
  };
  scores.push(entry);
  set(SCORES_KEY, scores);
  return entry;
}
