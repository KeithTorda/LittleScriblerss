import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Define animal characters that will rotate
const animals = [
  { name: "Bird", emoji: "🐦", color: "#FFD166" },
  { name: "Frog", emoji: "🐸", color: "#06D6A0" },
  { name: "Cat", emoji: "🐱", color: "#EF476F" },
  { name: "Dog", emoji: "🐶", color: "#118AB2" },
  { name: "Rabbit", emoji: "🐰", color: "#073B4C" },
  { name: "Pig", emoji: "🐷", color: "#FF90B3" },
  { name: "Fox", emoji: "🦊", color: "#FF9F1C" },
  { name: "Panda", emoji: "🐼", color: "#4A5859" },
];

export default function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [currentAnimalIndex, setCurrentAnimalIndex] = useState(0);
  const { toast } = useToast();

  // Game variables
  const gameRef = useRef({
    bird: {
      x: 50,
      y: 200,
      width: 30,  // Reduced hitbox size
      height: 30, // Reduced hitbox size
      velocity: 0,
      gravity: 0.5,
      jump: -8,
    },
    pipes: [] as {x: number, top: number, bottom: number, passed: boolean}[],
    gameSpeed: 2,
    pipeGap: 170, // Increased gap size
    pipeWidth: 60,
    pipeInterval: 1500, // ms
    lastPipeTime: 0,
    animationFrameId: 0,
    currentAnimalIndex: 0,
  });

  // Start game
  const startGame = () => {
    if (gameOver) {
      // Reset game state
      gameRef.current = {
        ...gameRef.current,
        bird: {
          ...gameRef.current.bird,
          x: 50,
          y: 200,
          velocity: 0,
        },
        pipes: [],
        lastPipeTime: 0,
        currentAnimalIndex: 0,
      };
      setScore(0);
      setCurrentAnimalIndex(0);
      setGameOver(false);
    }
    setGameStarted(true);
  };

  // Handle jump
  const handleJump = () => {
    if (!gameStarted) {
      startGame();
      return;
    }
    
    if (!gameOver) {
      gameRef.current.bird.velocity = gameRef.current.bird.jump;
    }
  };

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 400;
    canvas.height = 600;

    // Game loop
    const gameLoop = (timestamp: number) => {
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      ctx.fillStyle = "#87CEEB"; // Sky blue
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update bird position
      gameRef.current.bird.velocity += gameRef.current.bird.gravity;
      gameRef.current.bird.y += gameRef.current.bird.velocity;

      // Draw bird
      const currentAnimal = animals[gameRef.current.currentAnimalIndex];
      ctx.fillStyle = currentAnimal.color;
      ctx.font = "40px Arial";
      ctx.fillText(
        currentAnimal.emoji, 
        gameRef.current.bird.x - 15, // Center the emoji
        gameRef.current.bird.y + 15  // Center the emoji
      );
      
      // Debug hitbox (uncomment to see)
      // ctx.strokeStyle = "red";
      // ctx.strokeRect(
      //   gameRef.current.bird.x, 
      //   gameRef.current.bird.y, 
      //   gameRef.current.bird.width, 
      //   gameRef.current.bird.height
      // );

      // Generate pipes
      if (timestamp - gameRef.current.lastPipeTime > gameRef.current.pipeInterval) {
        const pipeGap = gameRef.current.pipeGap;
        const pipeTop = Math.random() * (canvas.height - pipeGap - 150) + 80; // Adjusted for better gameplay
        
        gameRef.current.pipes.push({
          x: canvas.width,
          top: pipeTop,
          bottom: pipeTop + pipeGap,
          passed: false,
        });
        
        gameRef.current.lastPipeTime = timestamp;
      }

      // Update and draw pipes
      for (let i = 0; i < gameRef.current.pipes.length; i++) {
        const pipe = gameRef.current.pipes[i];
        
        // Move pipe
        pipe.x -= gameRef.current.gameSpeed;

        // Draw top pipe
        ctx.fillStyle = "#2E8B57"; // Sea green
        ctx.fillRect(pipe.x, 0, gameRef.current.pipeWidth, pipe.top);

        // Draw bottom pipe
        ctx.fillRect(
          pipe.x,
          pipe.bottom,
          gameRef.current.pipeWidth,
          canvas.height - pipe.bottom
        );

        // Check if bird passed the pipe
        if (!pipe.passed && pipe.x + gameRef.current.pipeWidth < gameRef.current.bird.x) {
          pipe.passed = true;
          setScore(prevScore => prevScore + 1);
          
          // Change animal character
          const nextAnimalIndex = (gameRef.current.currentAnimalIndex + 1) % animals.length;
          gameRef.current.currentAnimalIndex = nextAnimalIndex;
          setCurrentAnimalIndex(nextAnimalIndex);
          
          toast({
            title: "New animal!",
            description: `You're now a ${animals[nextAnimalIndex].name}!`,
            duration: 2000,
          });
        }

        // Check collision with pipes - more accurate collision detection
        const birdRight = gameRef.current.bird.x + gameRef.current.bird.width;
        const birdBottom = gameRef.current.bird.y + gameRef.current.bird.height;
        
        // Only check collision if the bird is horizontally aligned with the pipe
        if (birdRight > pipe.x && gameRef.current.bird.x < pipe.x + gameRef.current.pipeWidth) {
          // Check if bird hits top pipe
          if (gameRef.current.bird.y < pipe.top) {
            setGameOver(true);
          }
          
          // Check if bird hits bottom pipe
          if (birdBottom > pipe.bottom) {
            setGameOver(true);
          }
        }
      }

      // Remove pipes that are off screen
      gameRef.current.pipes = gameRef.current.pipes.filter(pipe => pipe.x + gameRef.current.pipeWidth > 0);

      // Check if bird hits the ground or ceiling
      if (
        gameRef.current.bird.y + gameRef.current.bird.height > canvas.height ||
        gameRef.current.bird.y < 0
      ) {
        setGameOver(true);
      }

      // Draw score
      ctx.fillStyle = "white";
      ctx.font = "24px Arial";
      ctx.fillText(`Score: ${score}`, 10, 30);

      // Continue game loop if not game over
      if (!gameOver) {
        gameRef.current.animationFrameId = requestAnimationFrame(gameLoop);
      }
    };

    // Start game loop
    gameRef.current.animationFrameId = requestAnimationFrame(gameLoop);

    // Cleanup
    return () => {
      cancelAnimationFrame(gameRef.current.animationFrameId);
    };
  }, [gameStarted, gameOver, score, toast]);

  // Handle key press for jumping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        handleJump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameStarted, gameOver]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-6xl font-kid font-bold text-kidnavy mb-4">
          Flappy Animals! 🐾
        </h2>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Tap or press SPACE to jump! Avoid obstacles and watch your animal change with each point!
        </p>

        <div className="flex flex-col items-center justify-center">
          <div className="relative mb-4">
            <canvas
              ref={canvasRef}
              width={400}
              height={600}
              className="border-4 border-kidnavy rounded-lg bg-sky-200 cursor-pointer"
              onClick={handleJump}
            />
            
            {!gameStarted && !gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <Button 
                  onClick={startGame}
                  className="text-2xl px-8 py-6 bg-kidgreen hover:bg-green-600"
                >
                  Start Game
                </Button>
              </div>
            )}
            
            {gameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <h3 className="text-4xl font-bold text-white mb-4">Game Over!</h3>
                <p className="text-2xl text-white mb-4">Score: {score}</p>
                <Button 
                  onClick={startGame}
                  className="text-2xl px-8 py-6 bg-kidorange hover:bg-orange-600"
                >
                  Play Again
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Current Animal</h3>
              <div className="text-5xl">{animals[currentAnimalIndex].emoji}</div>
              <p className="mt-2">{animals[currentAnimalIndex].name}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Score</h3>
              <div className="text-5xl">{score}</div>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
} 