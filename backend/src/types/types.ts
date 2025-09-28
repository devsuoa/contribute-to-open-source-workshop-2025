export interface User {
  id: number;
  username: string;
  password: string;
}

export interface Problem {
  id: number;
  title: string;
  description: string;
  solution: string;
}

export interface UserProblemStatus {
  user_id: number;
  problem_id: number;
  last_attempt: Date | null; // ISO timestamp
  solved: boolean;
}

export interface UserToken {
  token_id: number;
  user_id: number;
  token: string;
  expires_at: Date; // ISO timestamp
}

export interface Competition {
  id: number;
  name: string;
  startTime: Date; // ISO timestamp
  endTime: Date;   // ISO timestamp
}