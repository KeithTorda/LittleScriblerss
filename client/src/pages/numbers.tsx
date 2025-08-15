import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import NumberCard from "@/components/number-card";
import InteractiveModal from "@/components/interactive-modal";
import { numberData } from "@/lib/learning-data";

export default function Numbers() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    number: number;
    word: string;
    emoji: string;
  } | null>(null);

  const handleNumberClick = (number: number, word: string, emoji: string) => {
    setModalData({ number, word, emoji });
    setModalOpen(true);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <Link href="/">
          <Button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-2xl font-bold text-xl mb-6 btn-3d">
            <ArrowLeft className="mr-2" size={20} />
            Back to Home
          </Button>
        </Link>
        
        <h2 className="text-4xl md:text-5xl font-kid font-bold text-kidnavy mb-4">
          🔢 Learn Numbers
        </h2>
        <p className="text-xl text-gray-600 mb-6">
          Count objects and practice simple math!
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {numberData.map((item, index) => (
          <motion.div
            key={item.number}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <NumberCard
              number={item.number}
              word={item.word}
              emoji={item.emoji}
              color={item.color}
              onNumberClick={handleNumberClick}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="bg-white rounded-3xl p-8 shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-3xl font-kid font-bold text-kidnavy text-center mb-6">
          🧮 Simple Addition
        </h3>
        <div className="text-center mb-6">
          <div className="text-6xl font-kid font-bold text-kidnavy mb-4">
            <span>2</span>
            <span className="mx-4">+</span>
            <span>3</span>
            <span className="mx-4">=</span>
            <span className="text-kidorange">?</span>
          </div>
          <p className="text-xl text-gray-600">Can you solve this?</p>
        </div>
        
        <div className="flex justify-center space-x-4 mb-6">
          <div className="bg-gray-200 border-4 border-dashed border-gray-400 rounded-3xl w-24 h-24 flex items-center justify-center text-4xl font-bold">
            <span className="text-gray-400">?</span>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
          {[4, 5, 6, 7].map((answer, index) => (
            <motion.div
              key={answer}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="card-3d bg-kidblue hover:bg-kidblue/90 text-white rounded-2xl p-6 text-3xl font-bold text-center cursor-pointer"
              data-testid={`answer-option-${answer}`}
            >
              {answer}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <InteractiveModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="number"
        data={modalData || {}}
      />
    </main>
  );
}
