export interface Answer {
  text: string;
  points: number;
}

export interface Question {
  id: number;
  question: string;
  answers: Answer[];
}
