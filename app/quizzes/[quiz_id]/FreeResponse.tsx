"use client";

type FreeResponseProps = {
  question: {
    id: number;
    text: string;
  };
  setAnswer: (answer: string) => void;
  answer: string | null;
};

export default function FreeResponse({ question, setAnswer, answer }: FreeResponseProps) {
  return (
    <div className="mt-6 w-full max-w-[800px] mx-auto">
      <h2 className="text-2xl font-bold text-gray-900">{question.text}</h2>
      <textarea
        className="w-full mt-4 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-lg shadow-sm"
        value={answer || ""}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here..."
        rows={4}
      />
    </div>
  );
}