import { useState } from "react";
import { motion } from "framer-motion";
import { useAudio } from "@/hooks/use-audio";
import { useProgress } from "@/hooks/use-progress";

interface ShapeCardProps {
  shape: string;
  emoji: string;
  initialColor: string;
}

const colors = ["kidblue", "kidorange", "kidgreen", "kidpink", "kidpurple", "kidyellow", "kidred"];

export default function ShapeCard({ shape, emoji, initialColor }: ShapeCardProps) {
  const [currentColor, setCurrentColor] = useState(initialColor);
  const { playClickSound } = useAudio();
  const { updateProgress } = useProgress();

  const changeColor = () => {
    const availableColors = colors.filter(color => color !== currentColor);
    const newColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    setCurrentColor(newColor);
    playClickSound();
    updateProgress("shapes", shape);
  };

  return (
    <div className="text-center">
      <motion.div
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={changeColor}
        className="w-32 h-32 mx-auto mb-4 cursor-pointer"
        data-testid={`shape-card-${shape.toLowerCase()}`}
      >
        <div className={`w-full h-full bg-${currentColor} card-3d flex items-center justify-center transition-colors duration-300 ${
          shape === "Circle" ? "rounded-full" : 
          shape === "Square" ? "rounded-lg" : 
          shape === "Triangle" ? "rounded-lg" : 
          "rounded-lg"
        }`}>
          <span className="text-white text-4xl">{emoji}</span>
        </div>
      </motion.div>
      <h3 className="text-2xl font-kid font-bold text-kidnavy">{shape}</h3>
    </div>
  );
}
