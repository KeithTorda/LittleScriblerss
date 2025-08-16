import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimalCard from "@/components/animal-card";
import InteractiveModal from "@/components/interactive-modal";
import { animalData } from "@/lib/learning-data";
import { useAudio } from "@/hooks/use-audio";

export default function Animals() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    animal: string;
    emoji: string;
    fact: string;
  } | null>(null);
  const [gameMode, setGameMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [currentAnimal, setCurrentAnimal] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const { playSuccessSound, playClickSound, playAnimalSound } = useAudio();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameActive) {
      setGameActive(false);
      setModalData({ 
        animal: "⏰", 
        emoji: "⏰", 
        fact: `Time's up! You scored ${score} points!` 
      });
      setModalOpen(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameActive, score]);

  const startAnimalGame = () => {
    setGameMode(true);
    setGameActive(true);
    setScore(0);
    setTimeLeft(30);
    setShowHint(false);
    generateNewAnimal();
  };

  const generateNewAnimal = () => {
    const randomAnimal = animalData[Math.floor(Math.random() * animalData.length)];
    setCurrentAnimal(randomAnimal);
    setShowHint(false);
    
    // Play the animal sound as a clue
    setTimeout(() => {
      playAnimalSound(randomAnimal.name);
    }, 500);
  };

  const handleGameAnimalClick = (name: string, emoji: string, fact: string) => {
    playClickSound();
    
    if (currentAnimal && name === currentAnimal.name) {
      playSuccessSound();
      setScore(prev => prev + 15);
      setModalData({ 
        animal: name, 
        emoji, 
        fact: "Correct! Well done!" 
      });
      setModalOpen(true);
      setTimeout(() => {
        generateNewAnimal();
      }, 2000);
    } else {
      setModalData({ 
        animal: name, 
        emoji, 
        fact: "Better luck next time! Listen to the sound again!" 
      });
      setModalOpen(true);
    }
  };

  const handleAnimalClick = (name: string, emoji: string, fact: string) => {
    if (gameMode && gameActive) {
      handleGameAnimalClick(name, emoji, fact);
    } else {
      setModalData({ animal: name, emoji, fact });
      setModalOpen(true);
    }
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
        
        {!gameMode ? (
          <div className="text-center mb-8">
            <Button
              onClick={startAnimalGame}
              className="bg-kidpurple hover:bg-kidpurple/90 text-white px-8 py-4 rounded-2xl font-bold text-xl btn-3d"
              data-testid="button-start-animal-game"
            >
              Animal Sound Game!
            </Button>
          </div>
        ) : (
          <div className="flex justify-center items-center mb-6 space-x-6">
            <div className="bg-kidyellow text-kidnavy px-4 py-2 rounded-2xl font-bold text-xl flex items-center">
              <Clock className="mr-2" size={24} />
              {timeLeft}s
            </div>
            <div className="bg-kidgreen text-white px-4 py-2 rounded-2xl font-bold text-xl">
              Score: {score}
            </div>
            <Button
              onClick={() => setShowHint(!showHint)}
              className="bg-kidorange hover:bg-kidorange/90 text-white px-4 py-2 rounded-2xl font-bold"
              data-testid="button-show-hint"
            >
              {showHint ? "Hide" : "Show"} Hint
            </Button>
            <Button
              onClick={() => {
                setGameMode(false);
                setGameActive(false);
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-2xl font-bold"
              data-testid="button-stop-animal-game"
            >
              Stop Game
            </Button>
          </div>
        )}
        
        {gameMode && currentAnimal && (
          <motion.div
            className="bg-white rounded-3xl p-6 shadow-lg mb-8 text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <h3 className="text-2xl font-kid font-bold text-kidnavy mb-4">
              🎵 Which animal makes this sound?
            </h3>
            <Button
              onClick={() => playAnimalSound(currentAnimal.name)}
              className="bg-kidblue hover:bg-kidblue/90 text-white px-6 py-3 rounded-2xl font-bold text-lg mb-4"
              data-testid="button-replay-sound"
            >
              🔊 Play Sound Again
            </Button>
            {showHint && (
              <p className="text-xl text-gray-600">
                Hint: {currentAnimal.sound} - It's a {currentAnimal.name}!
              </p>
            )}
          </motion.div>
        )}
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
