import { createContext, useContext, useState, useEffect } from "react";
import type { Progress } from "@shared/schema";

interface ProgressContextType {
  progress: Record<string, Progress>;
  updateProgress: (category: string, itemId: string) => void;
  getStars: () => number;
  getCompletionPercentage: () => number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<Record<string, Progress>>({});

  useEffect(() => {
    // Load progress from localStorage
    const saved = localStorage.getItem("littlescribler-progress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProgress(parsed);
      } catch (error) {
        console.error("Failed to load progress:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Save progress to localStorage
    localStorage.setItem("littlescribler-progress", JSON.stringify(progress));
  }, [progress]);

  const updateProgress = (category: string, itemId: string) => {
    setProgress(prev => {
      const existing = prev[category] || {
        id: category,
        category: category as any,
        completedItems: [],
        stars: 0,
        lastPlayed: new Date(),
      };

      if (existing.completedItems.includes(itemId)) {
        return prev;
      }

      const newCompletedItems = [...existing.completedItems, itemId];
      const newStars = Math.min(5, Math.floor(newCompletedItems.length / 3));

      return {
        ...prev,
        [category]: {
          ...existing,
          completedItems: newCompletedItems,
          stars: newStars,
          lastPlayed: new Date(),
        },
      };
    });
  };

  const getStars = () => {
    return Object.values(progress).reduce((total, p) => total + p.stars, 0);
  };

  const getCompletionPercentage = () => {
    const totalItems = 26 + 20 + 4 + 6; // alphabets + numbers + shapes + animals
    const completedItems = Object.values(progress).reduce(
      (total, p) => total + p.completedItems.length,
      0
    );
    return Math.round((completedItems / totalItems) * 100);
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        updateProgress,
        getStars,
        getCompletionPercentage,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return context;
}
