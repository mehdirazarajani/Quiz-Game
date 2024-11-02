import React, { useState, useEffect, useCallback } from "react";
import { Question } from "../types";
import { APP_CONFIG } from "../config/constants";
import { Clock, Star, Type as TypeIcon, Award, X } from "lucide-react";
import { playSound, playLoopedSound } from "../utils/soundUtils";

interface QuizScreenProps {
  question: Question;
  onUpdateQuestion: (updatedQuestion: Question) => void;
  onExit: () => void;
}

const ClueBox: React.FC<{
  title: string;
  content: string;
  isRevealed: boolean;
  onClick: () => void;
}> = ({ title, content, isRevealed, onClick }) => (
  <div
    onClick={onClick}
    className={`clue-box ${isRevealed ? "clue-box-revealed" : "clue-box-unrevealed"}`}
    style={{ minHeight: "200px" }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50 opacity-50" />
    <div className="p-6 relative z-10">
      <h3 className="text-xl mb-4 font-semibold text-blue-800">{title}</h3>
      {isRevealed ? (
        <p className="text-gray-700 leading-relaxed">{content}</p>
      ) : (
        <div className="flex items-center justify-center h-24">
          <span className="text-blue-400">Click to reveal</span>
        </div>
      )}
    </div>
  </div>
);

const Timer: React.FC<{ seconds: number; isWarning: boolean }> = ({
  seconds,
  isWarning,
}) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div
      className={`timer ${isWarning ? "timer-warning" : "timer-normal"}`}
      style={{ zIndex: 1000 }}
    >
      <Clock className="w-6 h-6 text-white" />
      <span className="text-xl font-semibold text-white">
        {String(minutes).padStart(2, "0")}:
        {String(remainingSeconds).padStart(2, "0")}
      </span>
    </div>
  );
};
const QuizScreen: React.FC<QuizScreenProps> = ({
  question,
  onUpdateQuestion,
  onExit,
}) => {
  const [revealedClues, setRevealedClues] = useState<number[]>([]);
  const [gameStatus, setGameStatus] = useState<"playing" | "answered">(
    "playing",
  );
  const [timeLeft, setTimeLeft] = useState(APP_CONFIG.timerConfig.totalSeconds);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);

  const calculatePossibleScore = useCallback(() => {
    const baseScores = [
      APP_CONFIG.scoring.firstClue,
      APP_CONFIG.scoring.secondClue,
      APP_CONFIG.scoring.thirdClue,
      APP_CONFIG.scoring.fourthClue,
    ];
    return baseScores[revealedClues.length] || 0;
  }, [revealedClues]);

  const handleRevealClue = useCallback(
    (boxNumber: number) => {
      if (!revealedClues.includes(boxNumber) && gameStatus === "playing") {
        setRevealedClues((prev) => [...prev, boxNumber]);
        playSound("beep");
      }
    },
    [revealedClues, gameStatus],
  );

  const handleAnswer = useCallback(
    (isCorrect: boolean) => {
      if (gameStatus !== "playing") return;

      const updatedQuestion = { ...question };

      if (isCorrect) {
        const score = calculatePossibleScore();
        updatedQuestion.score = score;
        updatedQuestion.isCorrect = true;
        setCurrentScore(score);
        setGameStatus("answered");
        playSound("correct");
      } else {
        setWrongAttempts((prev) => prev + 1);
        if (wrongAttempts === 0 && revealedClues.length < 4) {
          playSound("wrong");
          return;
        }
        updatedQuestion.isCorrect = false;
        updatedQuestion.penalty = APP_CONFIG.scoring.wrongPenalty;
        setCurrentScore(APP_CONFIG.scoring.wrongPenalty);
        setGameStatus("answered");
        playSound("wrong");
        setRevealedClues([1, 2, 3, 4]);
      }

      updatedQuestion.showAnswer = true;
      onUpdateQuestion(updatedQuestion);
    },
    [
      question,
      revealedClues,
      wrongAttempts,
      gameStatus,
      onUpdateQuestion,
      calculatePossibleScore,
    ],
  );

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onExit();
      } else if (gameStatus === "playing") {
        if (["1", "2", "3", "4"].includes(event.key)) {
          handleRevealClue(parseInt(event.key));
        } else if (event.key === "+") {
          handleAnswer(true);
        } else if (event.key === "-") {
          handleAnswer(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleRevealClue, handleAnswer, onExit, gameStatus]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStatus === "playing" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAnswer(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStatus, timeLeft, handleAnswer]);

  useEffect(() => {
    let stopSound: (() => void) | null = null;

    if (timeLeft <= APP_CONFIG.timerConfig.dangerZoneSeconds && timeLeft > 0) {
      stopSound = playLoopedSound("tick", 1000);
    } else if (
      timeLeft % APP_CONFIG.timerConfig.warningBeepInterval === 0 &&
      timeLeft > 0
    ) {
      playSound("beep");
    }

    return () => {
      if (stopSound) stopSound();
    };
  }, [timeLeft]);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Timer */}
      <Timer
        seconds={timeLeft}
        isWarning={timeLeft <= APP_CONFIG.timerConfig.dangerZoneSeconds}
      />

      {/* Info Bar */}
      <div className="mb-8">
        {/* Type and Score */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-blue-50 p-4 rounded-lg">
            <TypeIcon className="w-5 h-5 text-blue-600" />
            <span className="font-medium">{question.Type}</span>
          </div>
          <div className="flex items-center gap-2 bg-green-50 p-4 rounded-lg">
            <Award className="w-5 h-5 text-green-600" />
            <span className="font-medium">
              Possible Score: {calculatePossibleScore()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* First Row */}
        <ClueBox
          title="Clue 1"
          content={question.Hint1}
          isRevealed={revealedClues.includes(1)}
          onClick={() => handleRevealClue(1)}
        />

        {/* Answer Box */}
        <div className="row-span-2 flex items-center justify-center">
          {question.showAnswer ? (
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-full h-full flex flex-col items-center justify-center">
              <h2 className="text-2xl font-semibold mb-4">{question.Answer}</h2>
              {question.isCorrect ? (
                <div className="text-green-500">
                  <Star className="w-12 h-12 mb-2 mx-auto fill-current" />
                  <p className="font-medium">Score: +{currentScore}</p>
                </div>
              ) : (
                <div className="text-red-500">
                  <X className="w-12 h-12 mb-2 mx-auto" />
                  <p className="font-medium">Penalty: {currentScore}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-blue-50 rounded-2xl p-6 w-full h-full flex items-center justify-center">
              <span className="text-blue-400">Answer will appear here</span>
            </div>
          )}
        </div>

        <ClueBox
          title="Clue 3"
          content={question.Hint3}
          isRevealed={revealedClues.includes(3)}
          onClick={() => handleRevealClue(3)}
        />

        {/* Second Row */}
        <ClueBox
          title="Clue 2"
          content={question.Hint2}
          isRevealed={revealedClues.includes(2)}
          onClick={() => handleRevealClue(2)}
        />
        <ClueBox
          title="Clue 4"
          content={question.Hint4}
          isRevealed={revealedClues.includes(4)}
          onClick={() => handleRevealClue(4)}
        />
      </div>
    </div>
  );
};

export default QuizScreen;
