import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import AlphabetCard from "@/components/alphabet-card";
import InteractiveModal from "@/components/interactive-modal";
import { alphabetData, vowels } from "@/lib/learning-data";
import { useAudio } from "@/hooks/use-audio";

export default function Alphabets() {
  const [showVowelsOnly, setShowVowelsOnly] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    letter: string;
    word: string;
    emoji: string;
  } | null>(null);
  const [gameMode, setGameMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [currentLetter, setCurrentLetter] = useState<any>(null);
  const [score, setScore] = useState(0);
  const { playSuccessSound, playClickSound } = useAudio();

  const filteredAlphabets = showVowelsOnly 
    ? alphabetData.filter(item => vowels.includes(item.letter))
    : alphabetData;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameActive) {
      setGameActive(false);
      setModalData({ 
        letter: "⏰", 
        word: `Time's up! Score: ${score}`, 
        emoji: "⏰" 
      });
      setModalOpen(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameActive, score]);

  const startLetterGame = () => {
    setGameMode(true);
    setGameActive(true);
    setScore(0);
    setTimeLeft(30);
    generateNewLetter();
  };

  const generateNewLetter = () => {
    const randomLetter = alphabetData[Math.floor(Math.random() * alphabetData.length)];
    setCurrentLetter(randomLetter);
  };

  const handleGameLetterClick = (letter: string, word: string, emoji: string) => {
    playClickSound();
    
    if (currentLetter && letter === currentLetter.letter) {
      playSuccessSound();
      setScore(prev => prev + 10);
      setModalData({ 
        letter, 
        word: "Correct! Well done!", 
        emoji: "🎉" 
      });
      setModalOpen(true);
      setTimeout(() => {
        generateNewLetter();
      }, 1500);
    } else {
      setModalData({ 
        letter, 
        word: "Better luck next time!", 
        emoji: "😊" 
      });
      setModalOpen(true);
    }
  };

  const handleLetterClick = (letter: string, word: string, emoji: string) => {
    if (gameMode && gameActive) {
      handleGameLetterClick(letter, word, emoji);
    } else {
      setModalData({ letter, word, emoji });
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
          🔤 Learn Alphabets
        </h2>
        <p className="text-xl text-gray-600 mb-6">
          Click on each letter to hear its sound and see an example!
        </p>
        
        <div className="flex justify-center space-x-4 mb-8">
          {!gameMode ? (
            <>
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
              <Button
                onClick={startLetterGame}
                className="bg-kidpurple hover:bg-kidpurple/90 text-white px-6 py-3 rounded-2xl font-bold text-lg btn-3d"
                data-testid="button-start-letter-game"
              >
                Letter Game!
              </Button>
            </>
          ) : (
            <>
              <div className="bg-kidyellow text-kidnavy px-4 py-2 rounded-2xl font-bold text-xl flex items-center">
                <Clock className="mr-2" size={24} />
                {timeLeft}s
              </div>
              <div className="bg-kidgreen text-white px-4 py-2 rounded-2xl font-bold text-xl">
                Score: {score}
              </div>
              <Button
                onClick={() => {
                  setGameMode(false);
                  setGameActive(false);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-2xl font-bold"
                data-testid="button-stop-letter-game"
              >
                Stop Game
              </Button>
            </>
          )}
        </div>
        
        {gameMode && currentLetter && (
          <motion.div
            className="bg-white rounded-3xl p-6 shadow-lg mb-8 text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <h3 className="text-2xl font-kid font-bold text-kidnavy mb-4">
              Find the letter: <span className="text-kidorange text-4xl">{currentLetter.letter}</span>
            </h3>
            <p className="text-xl text-gray-600">
              {currentLetter.letter} is for {currentLetter.word} {currentLetter.emoji}
            </p>
          </motion.div>
        )}
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
