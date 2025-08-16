import { useState, useEffect, createContext, useContext } from "react";
import { motion } from "framer-motion";
import { Music, UserCheck, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import InteractiveModal from "@/components/interactive-modal";
import { Link } from "wouter";

// Audio Context for global sound management
const AudioContext = createContext<{
  isMusicPlaying: boolean;
  isSoundEnabled: boolean;
  toggleMusic: () => void;
  toggleSound: () => void;
}>({
  isMusicPlaying: false,
  isSoundEnabled: true,
  toggleMusic: () => {},
  toggleSound: () => {},
});

export const useAudioSettings = () => useContext(AudioContext);

export default function Header() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [parentalModalOpen, setParentalModalOpen] = useState(false);
  const [backgroundAudio, setBackgroundAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create background music audio element
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.3;
    
    // Generate simple background music using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    
    setBackgroundAudio(audio);
    
    return () => {
      if (audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, []);

  const toggleMusic = () => {
    if (backgroundAudio) {
      if (isMusicPlaying) {
        backgroundAudio.pause();
      } else {
        backgroundAudio.play().catch(console.error);
      }
    }
    setIsMusicPlaying(!isMusicPlaying);
    
    // Save to localStorage
    localStorage.setItem('littlescribler-music', (!isMusicPlaying).toString());
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
    
    // Save to localStorage  
    localStorage.setItem('littlescribler-sound', (!isSoundEnabled).toString());
  };

  const openParentalMode = () => {
    setParentalModalOpen(true);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white shadow-lg border-b-4 border-kidblue sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-kidorange to-kidpink rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">✏️</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-kid font-bold text-kidnavy">
                LittleScribler
              </h1>
            </motion.div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={toggleSound}
                className={`w-12 h-12 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 ${
                  isSoundEnabled ? "bg-kidgreen hover:bg-kidgreen/90" : "bg-gray-400 hover:bg-gray-500"
                }`}
                data-testid="button-toggle-sound"
              >
                {isSoundEnabled ? (
                  <Volume2 className="text-white text-lg" />
                ) : (
                  <VolumeX className="text-white text-lg" />
                )}
              </Button>
              
              <Button
                onClick={toggleMusic}
                className={`w-12 h-12 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 ${
                  isMusicPlaying ? "bg-kidgreen hover:bg-kidgreen/90" : "bg-gray-400 hover:bg-gray-500"
                }`}
                data-testid="button-toggle-music"
              >
                <Music className={`text-white text-lg ${isMusicPlaying ? "animate-wiggle" : ""}`} />
              </Button>
              
              <Button
                onClick={openParentalMode}
                className="bg-kidpurple hover:bg-kidpurple/90 text-white px-4 py-2 rounded-2xl font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300"
                data-testid="button-parental-mode"
              >
                <UserCheck className="mr-2" />
                Parent
              </Button>
            </div>
          </div>
        </div>
        
        <InteractiveModal
          isOpen={parentalModalOpen}
          onClose={() => setParentalModalOpen(false)}
          type="success"
          data={{
            message: "Welcome to Parental Mode! Here you can view your child's learning progress and achievements.",
            emoji: "👨‍👩‍👧‍👦"
          }}
        />
      </motion.header>

      {/* Floating Flappy Bird Button */}
      <motion.div 
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 1
        }}
        whileHover={{ 
          scale: 1.1,
          rotate: [0, -10, 10, -10, 10, 0],
          transition: { duration: 0.5 }
        }}
      >
        <Link href="/flappy-bird">
          <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold p-4 rounded-full shadow-xl h-16 w-16 flex items-center justify-center">
            <div className="text-3xl">🦊</div>
          </Button>
          <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full transform translate-x-1/3 -translate-y-1/3">
            NEW!
          </div>
        </Link>
      </motion.div>
    </>
  );
}
