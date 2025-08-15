import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LearningCardProps {
  title: string;
  emoji: string;
  description: string;
  badge: string;
  colorClass: string;
  onClick: () => void;
  className?: string;
}

export default function LearningCard({
  title,
  emoji,
  description,
  badge,
  colorClass,
  onClick,
  className
}: LearningCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "card-3d rounded-3xl p-8 text-white cursor-pointer text-center",
        colorClass,
        className
      )}
      data-testid={`card-${title.toLowerCase()}`}
    >
      <motion.div
        className="text-6xl mb-4"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        {emoji}
      </motion.div>
      <h3 className="text-3xl font-kid font-bold mb-3">{title}</h3>
      <p className="text-xl opacity-90 mb-4">{description}</p>
      <div className="bg-white bg-opacity-20 rounded-2xl py-2 px-4">
        <span className="text-lg font-semibold">{badge}</span>
      </div>
    </motion.div>
  );
}
