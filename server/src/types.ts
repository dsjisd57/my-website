export interface ProfileRow {
  id: number;
  name: string;
  student_id: string;
  school: string;
  bio: string;
}

export interface MessageRow {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

export interface ScoreRow {
  id: number;
  player_name: string;
  attempts: number;
  target_number: number;
  created_at: string;
}
