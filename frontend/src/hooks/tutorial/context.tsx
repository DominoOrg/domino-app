import React, { createContext, useContext, ReactNode } from 'react';
// Import the named internal logic function and the state type
import { _internal_useTutorialLogic, TutorialState } from './useTutorial';
// Import useTimer to get togglePause
import { useTimer } from '../timer/context';

// Define the shape of the context data
interface TutorialContextProps {
  state: TutorialState;
  updateProgress: () => void;
  toggleTutorial: () => void;
}

// Create the context with a default value (or null/undefined and check in consumer)
// Using undefined and checking in the consumer hook is safer to ensure provider is used.
const TutorialContext = createContext<TutorialContextProps | undefined>(undefined);

// Create the Provider component
interface TutorialProviderProps {
  children: ReactNode;
}

export const TutorialProvider: React.FC<TutorialProviderProps> = ({ children }) => {
  // Get togglePause from the timer context
  const { togglePause } = useTimer();
  // Pass togglePause to the internal logic function
  const tutorial = _internal_useTutorialLogic(togglePause);

  return (
    <TutorialContext.Provider value={tutorial}>
      {children}
    </TutorialContext.Provider>
  );
};

// Create a custom hook to consume the context
export const useTutorialContext = () => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorialContext must be used within a TutorialProvider');
  }
  return context;
};
