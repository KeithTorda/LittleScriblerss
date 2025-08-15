import { motion } from "framer-motion";
import { useProgress } from "@/hooks/use-progress";
import { Star } from "lucide-react";

export default function ProgressTracker() {
  const { getStars, getCompletionPercentage } = useProgress();
  const stars = getStars();
  const percentage = getCompletionPercentage();

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="bg-white rounded-3xl p-6 shadow-lg max-w-md mx-auto mb-8"
    >
      <h3 className="text-2xl font-kid font-bold text-kidnavy mb-4">Your Progress</h3>
      
      <div className="flex justify-center space-x-1 mb-4">
        {Array.from({ length: 5 }, (_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Star
              className={`text-2xl ${
                i < stars ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
              size={32}
            />
          </motion.div>
        ))}
      </div>
      
      <div className="bg-gray-200 rounded-full h-4 mb-2">
        <motion.div
          className="bg-gradient-to-r from-kidgreen to-kidblue h-4 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1 }}
        />
      </div>
      
      <span className="text-lg font-semibold text-kidnavy">
        {percentage}% Complete - Keep Going!
      </span>
    </motion.div>
  );
}
