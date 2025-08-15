import { motion } from "framer-motion";
import { useAudio } from "@/hooks/use-audio";
import { useProgress } from "@/hooks/use-progress";
import { cn } from "@/lib/utils";

interface AnimalCardProps {
  name: string;
  emoji: string;
  sound: string;
  fact: string;
  color: string;
  onAnimalClick?: (name: string, emoji: string, fact: string) => void;
}

export default function AnimalCard({ 
  name, 
  emoji, 
  sound, 
  fact,
  color,
  onAnimalClick 
}: AnimalCardProps) {
  const { playAnimalSound } = useAudio();
  const { updateProgress } = useProgress();

  const handleClick = () => {
    playAnimalSound(name);
    updateProgress("animals", name);
    onAnimalClick?.(name, emoji, fact);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="card-3d bg-white rounded-3xl p-6 text-center cursor-pointer"
      data-testid={`animal-card-${name.toLowerCase()}`}
    >
      <div className={cn(
        "text-6xl mb-4 w-16 h-16 mx-auto rounded-2xl flex items-center justify-center bg-gradient-to-br",
        color
      )}>
        {emoji}
      </div>
      <h3 className="text-2xl font-kid font-bold text-kidnavy mb-2">
        {emoji} {name}
      </h3>
      <p className="text-lg text-gray-600">"{sound}"</p>
    </motion.div>
  );
}
