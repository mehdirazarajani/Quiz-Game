import React from "react";
import { Question } from "../shared/types";
import { COLORS, FONT_FAMILY, FONT_SIZES, SPACING } from "../shared/theme";

interface QuestionListScreenProps {
  questions: Question[];
  onSelectQuestion: (index: number) => void;
}

const QuestionBox: React.FC<{
  number: number;
  isOpened: boolean;
  onClick: () => void;
}> = ({ number, isOpened, onClick }) => (
  <button
    onClick={onClick}
    disabled={isOpened}
    className={`
      aspect-square flex items-center justify-center
      rounded-lg transition-all duration-300 ease-in-out
      ${
        isOpened
          ? "bg-opacity-50 cursor-not-allowed"
          : "hover:shadow-lg hover:scale-105 cursor-pointer"
      }
    `}
    style={{
      backgroundColor: isOpened ? COLORS.secondary : COLORS.primary,
      color: isOpened ? COLORS.text.secondary : COLORS.text.primary,
      fontFamily: FONT_FAMILY,
      fontSize: FONT_SIZES.large,
      fontWeight: "800",
      padding: SPACING.medium,
    }}
  >
    {isOpened ? "" : `Question ${number}`}
  </button>
);
const QuestionListScreen: React.FC<QuestionListScreenProps> = ({
  questions,
  onSelectQuestion,
}) => {
  return (
    <div className="container mx-auto px-8" style={{ fontFamily: FONT_FAMILY }}>
      <h1
        className="text-center mb-12"
        style={{
          color: COLORS.text.primary,
          fontSize: FONT_SIZES.xxlarge,
          fontWeight: "800",
        }}
      >
        Quiz Questions
      </h1>
      <div className="flex gap-4 flex-wrap justify-center">
        {questions.map((question, index) => (
          <QuestionBox
            key={index}
            number={index + 1}
            isOpened={question.isOpened}
            onClick={() => onSelectQuestion(index)}
          />
        ))}
      </div>
    </div>
  );
};



export default QuestionListScreen;
