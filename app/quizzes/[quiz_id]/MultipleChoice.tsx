"use client";

import { QuestionModel } from "@/types/question";

type MultipleChoiceProps = {
  question: QuestionModel;
  setAnswer: (answer: number) => void;
  selectedAnswer: number | null;
};

export default function MultipleChoice({ question, setAnswer, selectedAnswer }: MultipleChoiceProps) {
  const handleSelect = (id: number) => {
    setAnswer(id);
  };

  return (
    <div className="mt-4 space-y-2">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{question.text}</h2>
      {question.multipleChoiceOptions?.map((option) => (
        <button
          key={option.id}
          className={`w-full p-3 text-left rounded-lg border ${
            selectedAnswer === option.id ? "border-blue-500 bg-blue-100" : "border-gray-300"
          }`}
          onClick={() => handleSelect(option.id)}
        >
          {option.value}
        </button>
      ))}
    </div>
  );
}