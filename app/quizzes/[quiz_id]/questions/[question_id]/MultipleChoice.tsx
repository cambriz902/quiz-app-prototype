"use client";

type MultipleChoiceProps = {
  question: {
    id: number;
    text: string;
    multipleChoiceOptions: { id: number; value: string }[];
  };
  setAnswer: (questionId: number, answer: number) => void;
  selectedAnswer?: number;
};

export default function MultipleChoice({ question, setAnswer, selectedAnswer }: MultipleChoiceProps) {
  return (
    <div className="mt-6 w-full max-w-[800px] mx-auto">
      <h2 className="text-2xl font-bold text-gray-900">{question.text}</h2>
      <div className="mt-4 space-y-3">
        {question.multipleChoiceOptions.map((option) => (
          <label
            key={option.id}
            className={`flex items-center justify-between w-full p-4 rounded-lg border-2 transition-all cursor-pointer ${
              selectedAnswer === option.id ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-white hover:border-blue-400"
            }`}
          >
            <span className="text-lg font-medium text-gray-800">{option.value}</span>
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option.id}
              checked={selectedAnswer === option.id}
              onChange={() => setAnswer(question.id, option.id)}
              className="hidden"
            />
            <div className={`w-6 h-6 flex items-center justify-center rounded-full border ${selectedAnswer === option.id ? "border-blue-500 bg-blue-500" : "border-gray-400 bg-white"}`}>
              {selectedAnswer === option.id && <div className="w-3 h-3 bg-white rounded-full" />}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}