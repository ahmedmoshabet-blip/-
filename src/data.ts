export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  quiz?: QuizQuestion[];
}

import { part1 } from './data/part1';
import { part2 } from './data/part2';
import { part3 } from './data/part3';
import { part4 } from './data/part4';
import { part5 } from './data/part5';
import { part6 } from './data/part6';
import { part7 } from './data/part7';
import { part8 } from './data/part8';
import { part9 } from './data/part9';
import { part10 } from './data/part10';
import { part11 } from './data/part11';
import { part12 } from './data/part12';

export const lessons: Lesson[] = [
  ...part1,
  ...part2,
  ...part3,
  ...part4,
  ...part5,
  ...part6,
  ...part7,
  ...part8,
  ...part9,
  ...part10,
  ...part11,
  ...part12
];
