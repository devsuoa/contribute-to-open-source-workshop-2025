import { Types } from "mongoose";

export const YEAR_LEVELS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "5+",
  "Postgraduate",
] as const;

export const LANGUAGES = ["cpp", "python", "java"] as const;
export type YearLevel = (typeof YEAR_LEVELS)[number];
export type Language = (typeof LANGUAGES)[number];

export interface User {
  email: string;
  nick: string;
  yearLevel: YearLevel;
  preferredLanguage: Language;
}

export interface Competition {
  _id?: string | Types.ObjectId;
  startTime: Date;
  endTime: Date;
  problems: string[];
  leaderboard: { user: string; points: number }[];
}

export interface ProblemLean {
  _id: Types.ObjectId;
  name: string;
  problemPoints: number;
  problemTag?: string;
}

export interface CompetitionLean {
  _id: Types.ObjectId;
  problems: ProblemLean[];
}

export interface TagOrderLean {
  _id: Types.ObjectId;
  scope: string;
  order: string[];
}
