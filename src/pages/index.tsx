import React from "react";
import dynamic from "next/dynamic";

const QuizGame = dynamic(() => import("../components/QuizGame"), {
  ssr: false,
});

const IndexPage: React.FC = () => {
  return (
    <div>
      <QuizGame />
    </div>
  );
};

export default IndexPage;
