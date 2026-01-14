import React, { useState, useEffect, useCallback } from "react";
import { Question } from "../types";
import { APP_CONFIG } from "../config/constants";
import {
  Clock,
  Trophy,
  Target,
  User,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Eye,
  Lock,
} from "lucide-react";
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
  clueNumber: number;
}> = ({ title, content, isRevealed, onClick, clueNumber }) => {
  const getClueConfig = (number: number) => {
    const configs = [
      {
        iconBg: "bg-blue-100",
        textColor: "text-blue-700",
        borderColor: "border-blue-200",
        hoverBg: "hover:bg-blue-50",
      },
      {
        iconBg: "bg-purple-100",
        textColor: "text-purple-700",
        borderColor: "border-purple-200",
        hoverBg: "hover:bg-purple-50",
      },
      {
        iconBg: "bg-green-100",
        textColor: "text-green-700",
        borderColor: "border-green-200",
        hoverBg: "hover:bg-green-50",
      },
      {
        iconBg: "bg-orange-100",
        textColor: "text-orange-700",
        borderColor: "border-orange-200",
        hoverBg: "hover:bg-orange-50",
      },
    ];
    return configs[number - 1] || configs[0];
  };

  const config = getClueConfig(clueNumber);

  return (
    <div
      onClick={onClick}
      className={`
        professional-card w-full max-w-sm cursor-pointer group
        ${isRevealed ? `bg-white ${config.borderColor}` : `bg-neutral-50 border-neutral-300 ${config.hoverBg}`}
        transition-all duration-200 hover:-translate-y-1 hover:shadow-lg
      `}
    >
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-800">{title}</h3>
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 ${config.iconBg} rounded-full flex items-center justify-center`}
            >
              {isRevealed ? (
                <Eye className={`w-4 h-4 ${config.textColor}`} />
              ) : (
                <Lock className="w-4 h-4 text-neutral-500" />
              )}
            </div>
            <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-neutral-700">{clueNumber}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 min-h-[160px] flex items-center justify-center">
        {isRevealed ? (
          <div className="text-center">
            <p className="text-base leading-relaxed text-neutral-700 font-medium">{content}</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-200">
              <Lock className="w-6 h-6 text-neutral-400" />
            </div>
            <p className="text-neutral-600 font-medium mb-1 text-sm">Click to reveal</p>
            <p className="text-neutral-400 text-xs">Press {clueNumber}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Timer: React.FC<{ seconds: number; isWarning: boolean }> = ({ seconds, isWarning }) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div className={`timer ${isWarning ? "timer-warning" : "timer-normal"}`}>
      <Clock className="w-5 h-5" />
      <span className="text-lg font-semibold">
        {String(minutes).padStart(2, "0")}:{String(remainingSeconds).padStart(2, "0")}
      </span>
    </div>
  );
};

const QuizScreen: React.FC<QuizScreenProps> = ({ question, onUpdateQuestion, onExit }) => {
  const [revealedClues, setRevealedClues] = useState<number[]>([]);
  const [gameStatus, setGameStatus] = useState<"playing" | "answered">("playing");
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
    return baseScores[revealedClues.length] || APP_CONFIG.scoring.defaultMark;
  }, [revealedClues]);

  const handleRevealClue = useCallback(
    (boxNumber: number) => {
      if (!revealedClues.includes(boxNumber) && gameStatus === "playing") {
        const newRevealedClues = [...revealedClues, boxNumber];

        // If revealing the 4th clue, automatically reveal all remaining clues
        if (newRevealedClues.length === 4) {
          setRevealedClues([1, 2, 3, 4]);
        } else {
          setRevealedClues(newRevealedClues);
        }

        playSound("beep");
      }
    },
    [revealedClues, gameStatus]
  );

  const handleAnswer = useCallback(
    (isCorrect: boolean) => {
      if (gameStatus !== "playing") return;

      const updatedQuestion = { ...question };

      if (isCorrect) {
        // Reveal all clues when correct answer is given
        setRevealedClues([1, 2, 3, 4]);
        const score = calculatePossibleScore();
        updatedQuestion.score = score;
        updatedQuestion.isCorrect = true;
        setCurrentScore(score);
        setGameStatus("answered");
        playSound("correct");
      } else {
        setWrongAttempts(prev => prev + 1);
        if (wrongAttempts === 0 && revealedClues.length < 4) {
          // First wrong attempt - just penalize, don't reveal clues or end game
          playSound("wrong");
          return;
        }
        // Second wrong attempt - reveal all clues and mark as wrong
        setRevealedClues([1, 2, 3, 4]);
        updatedQuestion.isCorrect = false;
        updatedQuestion.penalty = APP_CONFIG.scoring.wrongPenalty;
        setCurrentScore(APP_CONFIG.scoring.wrongPenalty);
        setGameStatus("answered");
        playSound("wrong");
      }

      updatedQuestion.showAnswer = true;
      onUpdateQuestion(updatedQuestion);
    },
    [question, revealedClues, wrongAttempts, gameStatus, onUpdateQuestion, calculatePossibleScore]
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
        setTimeLeft(prev => {
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
    } else if (timeLeft % APP_CONFIG.timerConfig.warningBeepInterval === 0 && timeLeft > 0) {
      playSound("beep");
    }

    return () => {
      if (stopSound) stopSound();
    };
  }, [timeLeft]);

  const getQuestionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "personality":
        return User;
      case "place":
        return MapPin;
      case "event":
        return Calendar;
      default:
        return Target;
    }
  };

  const IconComponent = getQuestionIcon(question.Type);

  return (
    <div className="min-h-screen bg-gradient-professional relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="geometric-shape shape-1"></div>
        <div className="geometric-shape shape-2"></div>
        <div className="geometric-shape shape-3"></div>
        <div className="geometric-shape shape-4"></div>
        <div className="geometric-shape shape-5"></div>
        <div className="geometric-shape shape-6"></div>
        <div className="geometric-shape shape-7"></div>
        <div className="geometric-shape shape-8"></div>
        <div className="geometric-shape shape-9"></div>
        <div className="geometric-shape shape-10"></div>
        <div className="geometric-shape shape-11"></div>
        <div className="geometric-shape shape-12"></div>
        <div className="geometric-shape shape-13"></div>
        <div className="geometric-shape shape-14"></div>
        <div className="geometric-shape shape-15"></div>
      </div>
      <Timer seconds={timeLeft} isWarning={timeLeft <= APP_CONFIG.timerConfig.dangerZoneSeconds} />

      <button
        onClick={onExit}
        className="fixed top-4 left-4 bg-white border border-neutral-200 rounded-lg p-3 hover:bg-neutral-50 transition-colors duration-200 z-50 text-neutral-700"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="container py-8 relative z-10">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <IconComponent className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900">{question.Type} Challenge</h1>
                <p className="text-sm text-neutral-600">Reveal clues and guess the answer</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-warning-600 mb-1">
                {calculatePossibleScore()}
              </div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Points Available
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {revealedClues.length}/4
              </div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Clues Revealed
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div style={{ display: "flex", flexDirection: "row", gap: "32px", flexWrap: "wrap" }}>
            <div
              style={{
                flex: "2 1 600px",
                minWidth: "400px",
                display: "flex",
                alignItems: "stretch",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  width: "100%",
                  alignContent: "center",
                }}
              >
                <ClueBox
                  title="Clue 1"
                  content={question.Hint1}
                  isRevealed={revealedClues.includes(1)}
                  onClick={() => handleRevealClue(1)}
                  clueNumber={1}
                />
                <ClueBox
                  title="Clue 3"
                  content={question.Hint3}
                  isRevealed={revealedClues.includes(3)}
                  onClick={() => handleRevealClue(3)}
                  clueNumber={3}
                />
                <ClueBox
                  title="Clue 2"
                  content={question.Hint2}
                  isRevealed={revealedClues.includes(2)}
                  onClick={() => handleRevealClue(2)}
                  clueNumber={2}
                />
                <ClueBox
                  title="Clue 4"
                  content={question.Hint4}
                  isRevealed={revealedClues.includes(4)}
                  onClick={() => handleRevealClue(4)}
                  clueNumber={4}
                />
              </div>
            </div>

            <div
              style={{
                flex: "1 1 350px",
                width: "350px",
                minWidth: "350px",
                maxWidth: "350px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className={`
                  professional-card flex flex-col items-center justify-center text-center
                  ${
                    question.showAnswer
                      ? question.isCorrect
                        ? "bg-success-50 border-success-200"
                        : "bg-error-50 border-error-200"
                      : "bg-white border-neutral-200"
                  }
                `}
                style={{
                  width: "100%",
                  height: "400px",
                  minHeight: "400px",
                  maxHeight: "400px",
                  padding: "2rem",
                  overflow: "hidden",
                }}
              >
                {question.showAnswer ? (
                  <>
                    <div className="mb-6">
                      {question.isCorrect ? (
                        <div className="w-16 h-16 bg-success-500 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-error-500 rounded-full flex items-center justify-center mx-auto">
                          <XCircle className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>

                    <h2 className="text-3xl font-bold mb-6 text-neutral-900">{question.Answer}</h2>

                    <div
                      className={`
                      px-6 py-3 rounded-lg font-bold text-lg
                      ${
                        question.isCorrect ? "bg-success-500 text-white" : "bg-error-500 text-white"
                      }
                    `}
                    >
                      {question.isCorrect ? (
                        <span className="flex items-center gap-2 justify-center">
                          <Trophy className="w-5 h-5" />+{currentScore} Points
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 justify-center">
                          <XCircle className="w-5 h-5" />
                          {currentScore} Points
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                      <Target className="w-10 h-10 text-neutral-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-700 mb-2">Answer Reveal</h3>
                    <p className="text-neutral-500">The answer will appear here once revealed</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {gameStatus === "playing" && (
          <div
            style={{
              position: "fixed",
              bottom: "24px",
              left: "24px",
              zIndex: 50,
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              padding: "12px",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <span style={{ color: "#6b7280", fontSize: "12px", fontWeight: "500" }}>Coach</span>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => handleAnswer(false)}
                style={{
                  padding: "8px",
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseOver={e =>
                  ((e.target as HTMLButtonElement).style.backgroundColor = "#b91c1c")
                }
                onMouseOut={e =>
                  ((e.target as HTMLButtonElement).style.backgroundColor = "#dc2626")
                }
                title="Wrong Answer"
              >
                <XCircle size={16} />
              </button>
              <button
                onClick={() => handleAnswer(true)}
                style={{
                  padding: "8px",
                  backgroundColor: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseOver={e =>
                  ((e.target as HTMLButtonElement).style.backgroundColor = "#15803d")
                }
                onMouseOut={e =>
                  ((e.target as HTMLButtonElement).style.backgroundColor = "#16a34a")
                }
                title="Correct Answer"
              >
                <CheckCircle size={16} />
              </button>
            </div>
          </div>
        )}
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 50,
          }}
        >
          <div className="help-icon-group">
            <div
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                cursor: "help",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: "bold", color: "#6b7280" }}>?</span>
            </div>
            <div className="help-tooltip">
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div>
                  <kbd
                    style={{
                      padding: "2px 4px",
                      backgroundColor: "#374151",
                      borderRadius: "4px",
                      fontSize: "10px",
                    }}
                  >
                    1-4
                  </kbd>{" "}
                  Reveal clues
                </div>
                <div>
                  <kbd
                    style={{
                      padding: "2px 4px",
                      backgroundColor: "#374151",
                      borderRadius: "4px",
                      fontSize: "10px",
                    }}
                  >
                    +
                  </kbd>{" "}
                  Correct answer
                </div>
                <div>
                  <kbd
                    style={{
                      padding: "2px 4px",
                      backgroundColor: "#374151",
                      borderRadius: "4px",
                      fontSize: "10px",
                    }}
                  >
                    -
                  </kbd>{" "}
                  Wrong answer
                </div>
                <div>
                  <kbd
                    style={{
                      padding: "2px 4px",
                      backgroundColor: "#374151",
                      borderRadius: "4px",
                      fontSize: "10px",
                    }}
                  >
                    ESC
                  </kbd>{" "}
                  Exit quiz
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
