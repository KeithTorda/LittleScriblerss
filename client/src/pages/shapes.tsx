import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShapeCard from "@/components/shape-card";
import InteractiveModal from "@/components/interactive-modal";
import { shapeData } from "@/lib/learning-data";
import { useAudio } from "@/hooks/use-audio";

export default function Shapes() {
  const [gameMode, setGameMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [draggedShape, setDraggedShape] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, boolean>>({});
  const { playSuccessSound, playClickSound } = useAudio();

  const shapePairs = [
    { shape: "Circle", color: "Red", emoji: "🔴" },
    { shape: "Square", color: "Blue", emoji: "🟦" },
    { shape: "Triangle", color: "Green", emoji: "🔺" },
    { shape: "Star", color: "Yellow", emoji: "⭐" }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameActive) {
      setGameActive(false);
      setModalData({ 
        message: `Time's up! You scored ${score} points!`, 
        emoji: "⏰" 
      });
      setModalOpen(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameActive, score]);

  const startGame = () => {
    setGameMode(true);
    setGameActive(true);
    setScore(0);
    setMatches({});
    setTimeLeft(30);
  };

  const handleDragStart = (shape: string) => {
    setDraggedShape(shape);
  };

  const handleDrop = (color: string) => {
    if (!draggedShape || !gameActive) return;
    
    const correctPair = shapePairs.find(pair => 
      pair.shape === draggedShape && pair.color === color
    );
    
    if (correctPair && !matches[draggedShape]) {
      playSuccessSound();
      setMatches(prev => ({ ...prev, [draggedShape]: true }));
      setScore(prev => prev + 10);
      
      if (Object.keys(matches).length === shapePairs.length - 1) {
        setGameActive(false);
        setModalData({ 
          message: "Perfect! You matched all shapes!", 
          emoji: "🎉" 
        });
        setModalOpen(true);
      }
    } else {
      setModalData({ 
        message: "Better luck next time! Try again!", 
        emoji: "😊" 
      });
      setModalOpen(true);
    }
    
    setDraggedShape(null);
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
          🔺 Shapes & Colors
        </h2>
        <p className="text-xl text-gray-600 mb-6">
          Click shapes to change colors and play matching games!
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {shapeData.map((shape, index) => (
          <motion.div
            key={shape.shape}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <ShapeCard
              shape={shape.shape}
              emoji={shape.emoji}
              initialColor={shape.color}
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
          🎯 Shape Color Match Game
        </h3>
        
        {!gameMode ? (
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-6">
              Drag shapes to their matching colors! You have 30 seconds!
            </p>
            <Button
              onClick={startGame}
              className="bg-kidpink hover:bg-kidpink/90 text-white px-8 py-4 rounded-2xl font-bold text-xl btn-3d"
              data-testid="button-start-shape-game"
            >
              Start Shape Game!
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-center items-center mb-6 space-x-6">
              <div className="bg-kidyellow text-kidnavy px-4 py-2 rounded-2xl font-bold text-xl flex items-center">
                <Clock className="mr-2" size={24} />
                {timeLeft}s
              </div>
              <div className="bg-kidgreen text-white px-4 py-2 rounded-2xl font-bold text-xl">
                Score: {score}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-2xl font-kid font-bold text-center">Shapes</h4>
                <div className="space-y-3">
                  {shapePairs.map((pair) => (
                    <motion.div
                      key={pair.shape}
                      whileHover={{ scale: 1.05 }}
                      className={`card-3d rounded-2xl p-4 flex items-center justify-center cursor-move transition-colors ${
                        matches[pair.shape] 
                          ? "bg-green-200 border-green-400" 
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      draggable={!matches[pair.shape]}
                      onDragStart={() => handleDragStart(pair.shape)}
                      data-testid={`drag-${pair.color.toLowerCase()}-${pair.shape.toLowerCase()}`}
                    >
                      <div className="text-4xl mr-4">{pair.emoji}</div>
                      <span className="text-xl font-bold">{pair.shape}</span>
                      {matches[pair.shape] && <span className="ml-2 text-2xl">✅</span>}
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-2xl font-kid font-bold text-center">Colors</h4>
                <div className="space-y-3">
                  {shapePairs.map((pair) => (
                    <div
                      key={pair.color}
                      className={`border-4 border-dashed rounded-2xl p-6 text-center transition-colors ${
                        pair.color === "Red" ? "border-red-400 bg-red-100 hover:bg-red-200" :
                        pair.color === "Blue" ? "border-blue-400 bg-blue-100 hover:bg-blue-200" :
                        pair.color === "Green" ? "border-green-400 bg-green-100 hover:bg-green-200" :
                        "border-yellow-400 bg-yellow-100 hover:bg-yellow-200"
                      }`}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(pair.color)}
                      data-testid={`drop-zone-${pair.color.toLowerCase()}`}
                    >
                      <div className={`text-2xl font-bold ${
                        pair.color === "Red" ? "text-red-600" :
                        pair.color === "Blue" ? "text-blue-600" :
                        pair.color === "Green" ? "text-green-600" :
                        "text-yellow-600"
                      }`}>
                        {pair.color}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <Button
                onClick={() => {
                  setGameMode(false);
                  setGameActive(false);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-2xl font-bold"
                data-testid="button-stop-shape-game"
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
        type="success"
        data={modalData || {}}
      />
    </main>
  );
}
