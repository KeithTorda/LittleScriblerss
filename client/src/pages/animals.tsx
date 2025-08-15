import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimalCard from "@/components/animal-card";
import InteractiveModal from "@/components/interactive-modal";
import { animalData } from "@/lib/learning-data";

export default function Animals() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    animal: string;
    emoji: string;
    fact: string;
  } | null>(null);

  const handleAnimalClick = (name: string, emoji: string, fact: string) => {
    setModalData({ animal: name, emoji, fact });
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
          🐾 Meet the Animals
        </h2>
        <p className="text-xl text-gray-600 mb-6">
          Click on animals to hear their sounds and learn fun facts!
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {animalData.map((animal, index) => (
          <motion.div
            key={animal.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <AnimalCard
              name={animal.name}
              emoji={animal.emoji}
              sound={animal.sound}
              fact={animal.fact}
              color={animal.color}
              onAnimalClick={handleAnimalClick}
            />
          </motion.div>
        ))}
      </motion.div>

      <InteractiveModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="animal-facts"
        data={modalData || {}}
      />
    </main>
  );
}
