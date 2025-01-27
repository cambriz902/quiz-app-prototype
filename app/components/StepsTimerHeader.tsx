"use client";

import useCountdownTimer from "@/utils/useCountdownTimer";

type StepsTimerHeaderProps = {
  targetTime: string; 
  currentStep: number; 
  totalSteps: number; 
  onTimerEnd: () => void; 
  label?: string; 
};

export default function StepsTimerHeader({
  targetTime,
  currentStep,
  totalSteps,
  onTimerEnd,
  label = "Step",
}: StepsTimerHeaderProps) {
  const timeLeft = useCountdownTimer({ targetTime, onComplete: onTimerEnd });

  return (
    <div className="flex justify-between items-center mb-4 p-4 bg-gray-100 rounded-lg shadow">
      <p className="text-lg font-semibold text-gray-700">
        {label} {currentStep + 1} of {totalSteps}
      </p>
      <p className="text-lg font-semibold text-red-500">
        Time Left: {timeLeft !== null ? `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}` : "00:00"}
      </p>
    </div>
  );
}