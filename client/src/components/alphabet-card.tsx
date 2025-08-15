import { motion } from "framer-motion";
import { useAudio } from "@/hooks/use-audio";
import { useProgress } from "@/hooks/use-progress";
import { cn } from "@/lib/utils";

interface AlphabetCardProps {
  letter: string;
  word: string;
  emoji: string;
  color: string;
  onLetterClick?: (letter: string, word: string, emoji: string) => void;
}

export default function AlphabetCard({ 
  letter, 
  word, 
  emoji, 
  color,
  onLetterClick 
}: AlphabetCardProps) {
  const { playLetterSound } = useAudio();
  const { updateProgress } = useProgress();

  const handleClick = () => {
    playLetterSound(letter);
    updateProgress("alphabets", letter);
    onLetterClick?.(letter, word, emoji);
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
      data-testid={`alphabet-card-${letter}`}
    >
      <div className="text-5xl font-kid font-bold mb-2">{letter}</div>
      <div className="text-3xl mb-2">{emoji}</div>
      <div className="text-lg font-semibold">{word}</div>
    </motion.div>
  );
}
