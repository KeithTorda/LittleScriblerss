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

// Hook to detect screen size
const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 400,
    height: typeof window !== 'undefined' ? window.innerHeight : 600,
    isMobile: typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= 768
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

export default function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [currentAnimalIndex, setCurrentAnimalIndex] = useState(0);
  const { toast } = useToast();
  const { width: screenWidth, height: screenHeight, isMobile } = useScreenSize();

  // Calculate responsive canvas dimensions
  const getCanvasDimensions = () => {
    const maxWidth = isMobile ? Math.min(screenWidth * 0.9, 350) : 400;
    const maxHeight = isMobile ? Math.min(screenHeight * 0.6, 500) : 600;
    
    return {
      width: maxWidth,
      height: maxHeight,
      scale: maxWidth / 400 // Scale factor for game elements
    };
  };

  const canvasDimensions = getCanvasDimensions();

  // Game variables
  const gameRef = useRef({
    bird: {
      x: 50 * canvasDimensions.scale,
      y: canvasDimensions.height / 3,
      width: 30 * canvasDimensions.scale,  
      height: 30 * canvasDimensions.scale, 
      velocity: 0,
      gravity: isMobile ? 0.2 : 0.3, // Even slower on mobile
      jump: isMobile ? -5 : -6,       // Gentler jump on mobile
    },
    pipes: [] as {x: number, top: number, bottom: number, passed: boolean}[],
    gameSpeed: isMobile ? 0.8 : 1.2,   // Much slower on mobile
    pipeGap: isMobile ? 220 * canvasDimensions.scale : 200 * canvasDimensions.scale, // Bigger gap on mobile
    pipeWidth: 60 * canvasDimensions.scale,
    pipeInterval: isMobile ? 2500 : 2000, // More time between pipes on mobile
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
          x: 50 * canvasDimensions.scale,
          y: canvasDimensions.height / 3,
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
    canvas.width = canvasDimensions.width;
    canvas.height = canvasDimensions.height;

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
      ctx.font = `${40 * canvasDimensions.scale}px Arial`;
      ctx.fillText(
        currentAnimal.emoji, 
        gameRef.current.bird.x - (15 * canvasDimensions.scale), // Center the emoji
        gameRef.current.bird.y + (15 * canvasDimensions.scale)  // Center the emoji
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
        const pipeTop = Math.random() * (canvas.height - pipeGap - 150 * canvasDimensions.scale) + 80 * canvasDimensions.scale; // Adjusted for better gameplay
        
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
      ctx.font = `${24 * canvasDimensions.scale}px Arial`;
      ctx.fillText(`Score: ${score}`, 10 * canvasDimensions.scale, 30 * canvasDimensions.scale);

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
          Tap the screen or press SPACE to jump! Avoid the green pipes and watch your animal change with each point!
        </p>

        <div className="flex flex-col items-center justify-center px-2">
          <div className="relative mb-4 w-full max-w-md">
            <canvas
              ref={canvasRef}
              width={canvasDimensions.width}
              height={canvasDimensions.height}
              className="border-4 border-kidnavy rounded-lg bg-sky-200 cursor-pointer touch-none select-none w-full h-auto max-w-full"
              onClick={handleJump}
              onTouchStart={(e) => {
                e.preventDefault();
                handleJump();
              }}
              style={{
                maxWidth: '100%',
                height: 'auto',
                aspectRatio: `${canvasDimensions.width} / ${canvasDimensions.height}`
              }}
            />
            
            {!gameStarted && !gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <Button 
                  onClick={startGame}
                  className={`${isMobile ? 'text-xl px-6 py-4' : 'text-2xl px-8 py-6'} bg-kidgreen hover:bg-green-600`}
                >
                  Start Game
                </Button>
              </div>
            )}
            
            {gameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-lg p-4">
                <h3 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold text-white mb-4`}>Game Over!</h3>
                <p className={`${isMobile ? 'text-lg' : 'text-2xl'} text-white mb-4`}>Score: {score}</p>
                <Button 
                  onClick={startGame}
                  className={`${isMobile ? 'text-xl px-6 py-4' : 'text-2xl px-8 py-6'} bg-kidorange hover:bg-orange-600`}
                >
                  Play Again
                </Button>
              </div>
            )}
          </div>
          
          <div className={`flex ${isMobile ? 'flex-col gap-3' : 'flex-wrap justify-center gap-4'} mt-4 w-full max-w-lg`}>
            <div className="bg-white p-4 rounded-lg shadow-md flex-1 text-center">
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold mb-2`}>Current Animal</h3>
              <div className={`${isMobile ? 'text-3xl' : 'text-5xl'}`}>{animals[currentAnimalIndex].emoji}</div>
              <p className={`mt-2 ${isMobile ? 'text-sm' : 'text-base'}`}>{animals[currentAnimalIndex].name}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md flex-1 text-center">
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold mb-2`}>Score</h3>
              <div className={`${isMobile ? 'text-3xl' : 'text-5xl'}`}>{score}</div>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
} 