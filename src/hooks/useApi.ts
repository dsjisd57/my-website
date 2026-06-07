import { useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.PROD ? '' : '/api';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface Message {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

interface Score {
  id: number;
  player_name: string;
  attempts: number;
  target_number: number;
  created_at: string;
}

interface Profile {
  id: number;
  name: string;
  student_id: string;
  school: string;
  bio: string;
}

export function useProfile() {
  const [state, setState] = useState<FetchState<Profile>>({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/profile`)
      .then(r => r.json())
      .then(data => { if (!cancelled) setState({ data, loading: false, error: null }); })
      .catch(err => { if (!cancelled) setState({ data: null, loading: false, error: err.message }); });
    return () => { cancelled = true; };
  }, []);

  return state;
}

export function useMessages() {
  const [state, setState] = useState<FetchState<Message[]>>({ data: null, loading: true, error: null });
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/messages`)
      .then(r => r.json())
      .then(data => { if (!cancelled) setState({ data, loading: false, error: null }); })
      .catch(err => { if (!cancelled) setState({ data: null, loading: false, error: err.message }); });
    return () => { cancelled = true; };
  }, [refreshKey]);

  const addMessage = useCallback(async (name: string, message: string) => {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save');
    }
    refresh();
  }, [refresh]);

  return { ...state, addMessage, refresh };
}

export function useScores() {
  const [state, setState] = useState<FetchState<Score[]>>({ data: null, loading: true, error: null });
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/scores`)
      .then(r => r.json())
      .then(data => { if (!cancelled) setState({ data, loading: false, error: null }); })
      .catch(err => { if (!cancelled) setState({ data: null, loading: false, error: err.message }); });
    return () => { cancelled = true; };
  }, [refreshKey]);

  const addScore = useCallback(async (player_name: string, attempts: number, target_number: number) => {
    const res = await fetch(`${API_BASE}/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_name, attempts, target_number }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save');
    }
    refresh();
  }, [refresh]);

  return { ...state, addScore, refresh };
}
