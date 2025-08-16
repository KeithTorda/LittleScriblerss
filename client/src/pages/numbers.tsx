import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import NumberCard from "@/components/number-card";
import InteractiveModal from "@/components/interactive-modal";
import { numberData } from "@/lib/learning-data";
import { useAudio } from "@/hooks/use-audio";

export default function Numbers() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    number: number;
    word: string;
    emoji: string;
  } | null>(null);
  const [gameMode, setGameMode] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [currentProblem, setCurrentProblem] = useState({ a: 2, b: 3, answer: 5 });
  const { playSuccessSound, playClickSound } = useAudio();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameActive) {
      setGameActive(false);
      setModalData({ number: 0, word: "Time's up!", emoji: "⏰" });
      setModalOpen(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameActive]);

  const generateNewProblem = () => {
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 5) + 1;
    setCurrentProblem({ a, b, answer: a + b });
    setCurrentAnswer(null);
    setTimeLeft(30);
  };

  const startGame = () => {
    setGameMode(true);
    setGameActive(true);
    generateNewProblem();
  };

  const handleAnswerClick = (answer: number) => {
    playClickSound();
    setCurrentAnswer(answer);
    
    if (answer === currentProblem.answer) {
      playSuccessSound();
      setGameActive(false);
      setModalData({ 
        number: answer, 
        word: "Correct!", 
        emoji: "🎉" 
      });
      setModalOpen(true);
      setTimeout(() => {
        generateNewProblem();
        setGameActive(true);
      }, 2000);
    } else {
      setModalData({ 
        number: answer, 
        word: "Better luck next time!", 
        emoji: "😊" 
      });
      setModalOpen(true);
    }
  };

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
          🧮 Simple Addition Game
        </h3>
        
        {!gameMode ? (
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-6">
              Ready to test your math skills? You have 30 seconds to solve each problem!
            </p>
            <Button
              onClick={startGame}
              className="bg-kidgreen hover:bg-kidgreen/90 text-white px-8 py-4 rounded-2xl font-bold text-xl btn-3d"
              data-testid="button-start-math-game"
            >
              Start Math Game!
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-center items-center mb-6">
              <div className="bg-kidyellow text-kidnavy px-4 py-2 rounded-2xl font-bold text-xl flex items-center">
                <Clock className="mr-2" size={24} />
                {timeLeft}s
              </div>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-6xl font-kid font-bold text-kidnavy mb-4">
                <span>{currentProblem.a}</span>
                <span className="mx-4">+</span>
                <span>{currentProblem.b}</span>
                <span className="mx-4">=</span>
                <span className="text-kidorange">{currentAnswer || "?"}</span>
              </div>
              <p className="text-xl text-gray-600">Can you solve this?</p>
            </div>
            
            <div className="flex justify-center space-x-4 mb-6">
              <div className={`border-4 border-dashed rounded-3xl w-24 h-24 flex items-center justify-center text-4xl font-bold transition-colors ${
                currentAnswer 
                  ? currentAnswer === currentProblem.answer 
                    ? "bg-green-200 border-green-400 text-green-600" 
                    : "bg-red-200 border-red-400 text-red-600"
                  : "bg-gray-200 border-gray-400 text-gray-400"
              }`}>
                <span>{currentAnswer || "?"}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
              {[
                currentProblem.answer,
                currentProblem.answer + 1,
                currentProblem.answer - 1,
                currentProblem.answer + 2
              ].sort(() => Math.random() - 0.5).map((answer, index) => (
                <motion.div
                  key={`${answer}-${index}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleAnswerClick(answer)}
                  className={`card-3d text-white rounded-2xl p-6 text-3xl font-bold text-center cursor-pointer transition-colors ${
                    currentAnswer === answer
                      ? answer === currentProblem.answer
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                      : "bg-kidblue hover:bg-kidblue/90"
                  }`}
                  data-testid={`answer-option-${answer}`}
                >
                  {answer}
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-6">
              <Button
                onClick={() => {
                  setGameMode(false);
                  setGameActive(false);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-2xl font-bold"
                data-testid="button-stop-game"
              >
                Stop Game
              </Button>
            </div>
          </>
        )}
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
