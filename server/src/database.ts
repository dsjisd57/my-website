import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbDir = process.env.DB_PATH || path.join(__dirname, '..', 'data');
const dbPath = path.join(dbDir, 'website.db');

let db: Database.Database | null = null;

function initTables() {
  if (!db) return;
  db.exec(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      student_id TEXT NOT NULL,
      school TEXT NOT NULL,
      bio TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_name TEXT NOT NULL,
      attempts INTEGER NOT NULL,
      target_number INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const count = db.prepare('SELECT COUNT(*) as cnt FROM profile').get() as { cnt: number };
  if (count.cnt === 0) {
    db.prepare(`
      INSERT INTO profile (id, name, student_id, school, bio)
      VALUES (1, '李宥榆', '111110504', '國立金門大學', '熱愛程式開發的學生，喜歡學習新技術。')
    `).run();
  }
}

export function initDb(): void {
  if (db) return;
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  initTables();
}

export function getDb(): Database.Database {
  if (!db) {
    initDb();
  }
  if (!db) {
    throw new Error('Database failed to initialize');
  }
  return db;
}
