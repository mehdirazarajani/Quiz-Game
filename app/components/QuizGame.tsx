"use client";

import React, { useState, useEffect, useCallback } from "react";
import { APP_CONFIG } from "../shared/constants";
import { Question } from "../shared/types";
import QuestionListScreen from "./QuestionListScreen";
import QuizScreen from "./QuizScreen";

const parseCSV = (csv: string): Question[] => {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const question: any = headers.reduce((obj: any, header, index) => {
      obj[header.trim()] = values[index].trim();
      return obj;
    }, {});
    return {
      ...question,
      score: 0,
      wrongAttempts: 0,
      penalty: 0,
      isCorrect: false,
      showAnswer: false,
      isOpened: false,
    };
  });
};

const QuizGame: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [loadingState, setLoadingState] = useState<
    "loading" | "error" | "success"
  >("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoadingState("loading");
        const response = await fetch("/data/questions.csv");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvData = await response.text();
        const parsedQuestions = parseCSV(csvData);
        setQuestions(parsedQuestions);
        setLoadingState("success");
      } catch (error) {
        console.error("Failed to load questions from CSV:", error);
        setErrorMessage(
          error instanceof Error ? error.message : "An unknown error occurred",
        );
        setLoadingState("error");
      }
    };

    loadQuestions();
  }, []);

  const handleSelectQuestion = (index: number) => {
    setCurrentIndex(index);
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, i) => (i === index ? { ...q, isOpened: true } : q)),
    );
  };

  const handleUpdateQuestion = (updatedQuestion: Question) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, i) => (i === currentIndex ? updatedQuestion : q)),
    );
  };

  const handleExitQuiz = useCallback(() => {
    setCurrentIndex(null);
  }, []);

  if (loadingState === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-xl">Loading questions from CSV...</span>
      </div>
    );
  }

  if (loadingState === "error") {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Error Loading Questions from CSV
        </h2>
        <p className="text-lg">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gradient-to-b from-slate-500 via-slate-600 to-slate-700 text-white p-6 shadow-lg rounded-b-lg">
        <h1 className="text-lg md:text-4xl font-bold text-center text-emerald-50">
          {APP_CONFIG.eventTitle}
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex flex-col h-[84vh] p-8 overflow-hidden items-center justify-center">
        {currentIndex === null ? (
          <QuestionListScreen
            questions={questions}
            onSelectQuestion={handleSelectQuestion}
          />
        ) : (
          <QuizScreen
            question={questions[currentIndex]}
            onUpdateQuestion={handleUpdateQuestion}
            onExit={handleExitQuiz}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800 text-white p-4 shadow-lg rounded-t-lg">
        <p className="text-center text-lg">{APP_CONFIG.instituteName}</p>
      </footer>
    </div>
  );
};

export default QuizGame;
