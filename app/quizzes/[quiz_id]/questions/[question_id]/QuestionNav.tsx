"use client";

type QuestionNavProps = {
  onNext: () => void;
  isLastQuestion: boolean;
  isNextDisabled: boolean;
};

export default function QuestionNav({ onNext, isLastQuestion, isNextDisabled }: QuestionNavProps) {
  return (
    <div className="mt-6 flex justify-center">
      <button
        onClick={onNext}
        disabled={isNextDisabled}
        className={`w-full max-w-[400px] px-6 py-3 text-white font-semibold rounded-lg text-lg transition-all ${
          isNextDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl"
        }`}
      >
        {isLastQuestion ? "See Results" : "Next Question"}
      </button>
    </div>
  );
}