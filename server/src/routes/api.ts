import { Router, Request, Response } from 'express';
import { getDb } from '../database.js';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.get('/status', (_req: Request, res: Response) => {
  try {
    const db = getDb();
    const profileCount = (db.prepare('SELECT COUNT(*) as cnt FROM profile').get() as { cnt: number }).cnt;
    const messageCount = (db.prepare('SELECT COUNT(*) as cnt FROM messages').get() as { cnt: number }).cnt;
    const scoreCount = (db.prepare('SELECT COUNT(*) as cnt FROM scores').get() as { cnt: number }).cnt;
    res.json({
      status: 'ok',
      database: 'connected',
      profile: profileCount > 0 ? 'seeded' : 'empty',
      messages: messageCount,
      scores: scoreCount,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: err instanceof Error ? err.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

router.get('/profile', (_req: Request, res: Response) => {
  try {
    const db = getDb();
    const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get() as { id: number; name: string; student_id: string; school: string; bio: string } | undefined;
    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.get('/messages', (_req: Request, res: Response) => {
  try {
    const db = getDb();
    const messages = db.prepare('SELECT * FROM messages ORDER BY created_at DESC LIMIT 50').all();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.post('/messages', (req: Request, res: Response) => {
  try {
    const { name, message } = req.body;
    if (!name || !message || name.trim().length === 0 || message.trim().length === 0) {
      res.status(400).json({ error: 'Name and message are required' });
      return;
    }
    if (name.length > 50 || message.length > 500) {
      res.status(400).json({ error: 'Name max 50 chars, message max 500 chars' });
      return;
    }
    const db = getDb();
    const result = db.prepare('INSERT INTO messages (name, message) VALUES (?, ?)').run(name.trim(), message.trim());
    res.status(201).json({ id: result.lastInsertRowid, name: name.trim(), message: message.trim() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

router.get('/scores', (_req: Request, res: Response) => {
  try {
    const db = getDb();
    const scores = db.prepare('SELECT * FROM scores ORDER BY attempts ASC, created_at DESC LIMIT 20').all();
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

router.post('/scores', (req: Request, res: Response) => {
  try {
    const { player_name, attempts, target_number } = req.body;
    if (!player_name || !attempts || !target_number) {
      res.status(400).json({ error: 'player_name, attempts, and target_number are required' });
      return;
    }
    if (player_name.length > 50) {
      res.status(400).json({ error: 'Name max 50 chars' });
      return;
    }
    const db = getDb();
    db.prepare('INSERT INTO scores (player_name, attempts, target_number) VALUES (?, ?, ?)').run(
      player_name.trim(),
      attempts,
      target_number
    );
    res.status(201).json({ message: 'Score saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save score' });
  }
});

export default router;
