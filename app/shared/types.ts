export interface Question {
  Type: string;
  Answer: string;
  Hint1: string;
  Hint2: string;
  Hint3: string;
  Hint4: string;
  score: number;
  wrongAttempts: number;
  penalty: number;
  isCorrect: boolean;
  showAnswer: boolean;
  isOpened: boolean;
}
