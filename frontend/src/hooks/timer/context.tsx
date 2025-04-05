import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
// Remove tutorial context import

interface TimerContextType {
  isPaused: boolean; // Represents manual pause state ONLY
  togglePause: () => void; // Manual toggle
  getElapsedTime: () => string; // returns zero-padded mm:ss
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

interface TimerProviderProps {
  children: ReactNode;
}

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  // Remove tutorial context usage
  // Restore local isPaused state for manual pausing
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [displayTime, setDisplayTime] = useState<number>(0); // in seconds

  const startTimeRef = useRef<number>(Date.now() / 1000); // fixed start
  const pauseStartRef = useRef<number | null>(null);
  const totalPausedRef = useRef<number>(0); // in seconds
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Remove effect that depended on effectiveIsPaused

  // Restore original useEffect for interval calculation based on local isPaused
  useEffect(() => {
    // This effect handles the pause timing based on the isPaused state
    const now = Date.now() / 1000;
    if (isPaused) {
      // Start pausing if not already paused
      if (pauseStartRef.current === null) {
        pauseStartRef.current = now;
      }
    } else {
      // Resume if it was paused
      if (pauseStartRef.current !== null) {
        const pausedDuration = now - pauseStartRef.current;
        totalPausedRef.current += pausedDuration;
        pauseStartRef.current = null; // Reset pause start time
      }
    }
  }, [isPaused]);


  useEffect(() => {
    // This effect calculates the displayed time
    intervalRef.current = setInterval(() => {
      const now = Date.now() / 1000;

      let currentPauseDuration = 0;
      // Use local isPaused state
      if (isPaused && pauseStartRef.current !== null) {
        currentPauseDuration = now - pauseStartRef.current;
      }

      // Original calculation
      const totalElapsed = now - startTimeRef.current - totalPausedRef.current - currentPauseDuration;
      const seconds = Math.max(0, Math.floor(totalElapsed));
      setDisplayTime(seconds);
    }, 500); // update twice per second

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // Effect depends on local isPaused state again for display updates
  }, [isPaused]);

  // Restore original togglePause logic acting on local state
  const togglePause = () => {
    // This now only controls the manual pause state
    setIsPaused(prev => !prev);
  };


  const formatTime = (seconds: number): string => {
    const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
    const ss = (seconds % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const getElapsedTime = (): string => {
    return formatTime(displayTime);
  };

  // Provide local isPaused state and togglePause
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
