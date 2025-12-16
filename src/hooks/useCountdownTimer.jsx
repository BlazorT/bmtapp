import { useEffect, useState, useRef } from 'react';

const formatTime = totalSeconds => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = num => String(num).padStart(2, '0');

  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
};

const useCountdownTimer = (initialSeconds, resetKey) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const timerRef = useRef(null);

  useEffect(() => {
    setSecondsLeft(initialSeconds);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [initialSeconds, resetKey]);

  return formatTime(secondsLeft);
};

export default useCountdownTimer;
