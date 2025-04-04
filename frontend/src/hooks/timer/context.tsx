import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';

interface TimerContextType {
  isPaused: boolean;
  togglePause: () => void;
  getElapsedTime: () => string; // returns zero-padded mm:ss
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

interface TimerProviderProps {
  children: ReactNode;
}

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [displayTime, setDisplayTime] = useState<number>(0); // in seconds

  const startTimeRef = useRef<number>(Date.now() / 1000); // fixed start
  const pauseStartRef = useRef<number | null>(null);
  const totalPausedRef = useRef<number>(0); // in seconds
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const now = Date.now() / 1000;

      let pausedDuration = 0;
      if (isPaused && pauseStartRef.current !== null) {
        pausedDuration = now - pauseStartRef.current;
      }

      const totalElapsed = now - startTimeRef.current - totalPausedRef.current - pausedDuration;
      const seconds = Math.max(0, Math.floor(totalElapsed));
      setDisplayTime(seconds);
    }, 500); // update twice per second

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  const togglePause = () => {
    const now = Date.now() / 1000;

    if (!isPaused) {
      // Start pausing
      pauseStartRef.current = now;
      setIsPaused(true);
    } else {
      // Resume
      if (pauseStartRef.current !== null) {
        const pausedDuration = now - pauseStartRef.current;
        totalPausedRef.current += pausedDuration;
        pauseStartRef.current = null;
      }
      setIsPaused(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
    const ss = (seconds % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const getElapsedTime = (): string => {
    return formatTime(displayTime);
  };

  return (
    <TimerContext.Provider value={{ isPaused, togglePause, getElapsedTime }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
