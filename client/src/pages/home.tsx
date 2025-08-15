import { Link } from "wouter";
import { motion } from "framer-motion";
import LearningCard from "@/components/learning-card";
import ProgressTracker from "@/components/progress-tracker";

export default function Home() {
  const categories = [
    {
      title: "Alphabets",
      emoji: "🔤",
      description: "Learn A to Z with fun sounds!",
      badge: "26 Letters",
      colorClass: "bg-gradient-to-br from-kidblue to-blue-600",
      path: "/alphabets"
    },
    {
      title: "Numbers",
      emoji: "🔢",
      description: "Count from 1 to 20!",
      badge: "Math Games",
      colorClass: "bg-gradient-to-br from-kidorange to-orange-600",
      path: "/numbers"
    },
    {
      title: "Shapes",
      emoji: "🔺",
      description: "Discover colorful shapes!",
      badge: "Color Match",
      colorClass: "bg-gradient-to-br from-kidpink to-pink-600",
      path: "/shapes"
    },
    {
      title: "Animals",
      emoji: "🐾",
      description: "Meet animal friends!",
      badge: "Fun Sounds",
      colorClass: "bg-gradient-to-br from-kidgreen to-green-600",
      path: "/animals"
    }
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <motion.div
          className="mb-8"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <h2 className="text-4xl md:text-6xl font-kid font-bold text-kidnavy mb-4">
            Fun Learning for Kids! 🎉
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Choose your favorite learning adventure and let's explore together!
          </p>
        </motion.div>

        <ProgressTracker />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {categories.map((category, index) => (
            <Link key={category.title} href={category.path}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <LearningCard
                  title={category.title}
                  emoji={category.emoji}
                  description={category.description}
                  badge={category.badge}
                  colorClass={category.colorClass}
                  onClick={() => {}}
                />
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </motion.section>
    </main>
  );
}
