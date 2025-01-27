"use client";

import { useState, useEffect } from "react";

type CountdownTimerProps = {
  targetTime: string; 
  onComplete: () => void; 
};

export default function useCountdownTimer({ targetTime, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!targetTime) return;

    const updateTimer = () => {
      const now = Date.now();
      const endTime = new Date(targetTime).getTime();
      const remainingTime = Math.max(Math.floor((endTime - now) / 1000), 0);
      setTimeLeft(remainingTime);

      if (remainingTime <= 0) {
        onComplete();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetTime, onComplete]);

  return timeLeft;
}