export interface Lesson {
  title: string;
  topic: string;
  intro: string;
  principle: string;
  example: string;
  action: string;
}
export interface Question {
  id: string;
  topic: number;
  prompt: string;
  options: string[];
  correct: number;
  why: string;
}
export interface Attempt {
  id: string;
  date: string;
  ids: string[];
  picks: number[];
}
export interface Progress {
  version: 1;
  lessons: number[];
  cases: string[];
  attempts: Attempt[];
}
