import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AlphabetCard from "@/components/alphabet-card";
import InteractiveModal from "@/components/interactive-modal";
import { alphabetData, vowels } from "@/lib/learning-data";

export default function Alphabets() {
  const [showVowelsOnly, setShowVowelsOnly] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    letter: string;
    word: string;
    emoji: string;
  } | null>(null);

  const filteredAlphabets = showVowelsOnly 
    ? alphabetData.filter(item => vowels.includes(item.letter))
    : alphabetData;

  const handleLetterClick = (letter: string, word: string, emoji: string) => {
    setModalData({ letter, word, emoji });
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
          🔤 Learn Alphabets
        </h2>
        <p className="text-xl text-gray-600 mb-6">
          Click on each letter to hear its sound and see an example!
        </p>
        
        <div className="flex justify-center space-x-4 mb-8">
          <Button
            onClick={() => setShowVowelsOnly(true)}
            className={`px-6 py-3 rounded-2xl font-bold text-lg btn-3d ${
              showVowelsOnly 
                ? "bg-kidblue hover:bg-kidblue/90" 
                : "bg-gray-400 hover:bg-gray-500"
            } text-white`}
            data-testid="button-vowels-only"
          >
            Vowels Only
          </Button>
          <Button
            onClick={() => setShowVowelsOnly(false)}
            className={`px-6 py-3 rounded-2xl font-bold text-lg btn-3d ${
              !showVowelsOnly 
                ? "bg-kidorange hover:bg-kidorange/90" 
                : "bg-gray-400 hover:bg-gray-500"
            } text-white`}
            data-testid="button-full-alphabet"
          >
            Full A-Z
          </Button>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {filteredAlphabets.map((item, index) => (
          <motion.div
            key={item.letter}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <AlphabetCard
              letter={item.letter}
              word={item.word}
              emoji={item.emoji}
              color={item.color}
              onLetterClick={handleLetterClick}
            />
          </motion.div>
        ))}
      </motion.div>

      <InteractiveModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="letter"
        data={modalData || {}}
      />
    </main>
  );
}
