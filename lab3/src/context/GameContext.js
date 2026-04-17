import React, { createContext, useState } from 'react';

export const GameContext = createContext();

const initialChallenges = [
  { id: 'tap10', title: 'Tap 10 times', target: 10, progress: 0, completed: false },
  { id: 'double5', title: 'Double-tap 5 times', target: 5, progress: 0, completed: false },
  { id: 'long3', title: 'Long press 3 seconds', target: 1, progress: 0, completed: false },
  { id: 'drag', title: 'Drag the object', target: 1, progress: 0, completed: false },
  { id: 'swipeRight', title: 'Swipe Right', target: 1, progress: 0, completed: false },
  { id: 'swipeLeft', title: 'Swipe Left', target: 1, progress: 0, completed: false },
  { id: 'pinch', title: 'Pinch to resize', target: 1, progress: 0, completed: false },
  { id: 'reach100', title: 'Reach 100 points', target: 100, progress: 0, completed: false },
  { id: 'custom', title: 'My Custom Task: Rotate', target: 1, progress: 0, completed: false },
];

export const GameProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [challenges, setChallenges] = useState(initialChallenges);

  const addScore = (points) => {
    setScore((prevScore) => {
      const newScore = prevScore + points;
      updateChallengeProgress('reach100', newScore);
      return newScore;
    });
  };

  const updateChallengeProgress = (id, amount = 1) => {
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === id && !ch.completed) {
          const newProgress = id === 'reach100' ? amount : ch.progress + amount;
          return {
            ...ch,
            progress: newProgress,
            completed: newProgress >= ch.target,
          };
        }
        return ch;
      })
    );
  };

  return (
    <GameContext.Provider value={{ score, addScore, challenges, updateChallengeProgress }}>
      {children}
    </GameContext.Provider>
  );
};