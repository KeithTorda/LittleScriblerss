import { useState } from "react";
import { motion } from "framer-motion";
import { Music, UserCheck, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  const openParentalMode = () => {
    // TODO: Implement parental mode modal
    console.log("Opening parental mode");
  };

  return (
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
    </motion.header>
  );
}
