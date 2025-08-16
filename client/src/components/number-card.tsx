import { motion } from "framer-motion";
import { useAudio } from "@/hooks/use-audio";
import { useProgress } from "@/hooks/use-progress";
import { cn } from "@/lib/utils";

interface NumberCardProps {
  number: number;
  word: string;
  emoji: string;
  color: string;
  onNumberClick?: (number: number, word: string, emoji: string) => void;
}

export default function NumberCard({ 
  number, 
  word, 
  emoji, 
  color,
  onNumberClick 
}: NumberCardProps) {
  const { playNumberSound } = useAudio();
  const { updateProgress } = useProgress();

  const handleClick = () => {
    playNumberSound(number);
    updateProgress("numbers", number.toString());
    onNumberClick?.(number, word, emoji);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1, rotateY: 10 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={cn(
        "card-3d bg-gradient-to-br rounded-3xl p-6 text-white text-center cursor-pointer",
        color
      )}
      data-testid={`number-card-${number}`}
    >
      <div className="text-5xl font-kid font-bold mb-2">{number}</div>
      <div className="text-2xl mb-2">{emoji}</div>
      <div className="text-lg font-semibold">{word}</div>
    </motion.div>
  );
}
