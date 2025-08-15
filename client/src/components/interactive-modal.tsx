import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/hooks/use-audio";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "animal-facts" | "letter" | "number";
  data?: {
    letter?: string;
    word?: string;
    emoji?: string;
    animal?: string;
    fact?: string;
    number?: number;
    message?: string;
  };
}

export default function InteractiveModal({ isOpen, onClose, type, data = {} }: ModalProps) {
  const { playSuccessSound, playLetterSound, playAnimalSound } = useAudio();

  const handlePlaySound = () => {
    if (type === "letter" && data.letter) {
      playLetterSound(data.letter);
    } else if (type === "animal-facts" && data.animal) {
      playAnimalSound(data.animal);
    } else {
      playSuccessSound();
    }
  };

  const renderContent = () => {
    switch (type) {
      case "success":
        return (
          <div className="text-center">
            <motion.div
              className="text-6xl mb-4"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.6, repeat: 1 }}
            >
              🎉
            </motion.div>
            <h3 className="text-3xl font-kid font-bold text-kidnavy mb-4">Great Job!</h3>
            <p className="text-xl text-gray-600 mb-6">
              {data.message || "You found the right answer!"}
            </p>
            <div className="flex justify-center space-x-2 mb-6">
              {Array.from({ length: 3 }, (_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 360, 0]
                  }}
                  transition={{ 
                    duration: 0.8, 
                    delay: i * 0.2,
                    repeat: 1
                  }}
                  className="text-3xl"
                >
                  ⭐
                </motion.div>
              ))}
            </div>
            <Button
              onClick={() => {
                playSuccessSound();
                onClose();
              }}
              className="bg-kidgreen hover:bg-kidgreen/90 text-white px-8 py-4 rounded-2xl font-bold text-xl btn-3d"
              data-testid="button-continue-learning"
            >
              Continue Learning!
            </Button>
          </div>
        );

      case "animal-facts":
        return (
          <div className="text-center">
            <div className="text-6xl mb-4">{data.emoji}</div>
            <h3 className="text-3xl font-kid font-bold text-kidnavy mb-4">
              Amazing {data.animal} Facts!
            </h3>
            <div className="text-lg text-gray-600 mb-6">
              <p>{data.fact}</p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handlePlaySound}
                className="bg-kidorange hover:bg-kidorange/90 text-white px-6 py-3 rounded-2xl font-bold text-lg btn-3d"
                data-testid="button-play-animal-sound"
              >
                <Volume2 className="mr-2" size={20} />
                Play Sound
              </Button>
              <Button
                onClick={onClose}
                className="bg-kidblue hover:bg-kidblue/90 text-white px-8 py-3 rounded-2xl font-bold text-lg btn-3d"
                data-testid="button-close-animal-modal"
              >
                <Heart className="mr-2" size={20} />
                Cool!
              </Button>
            </div>
          </div>
        );

      case "letter":
        return (
          <div className="text-center">
            <motion.div
              className="text-6xl font-kid font-bold text-kidblue mb-4"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: 1 }}
            >
              {data.letter}
            </motion.div>
            <h3 className="text-3xl font-kid font-bold text-kidnavy mb-4">
              {data.letter} is for {data.word}!
            </h3>
            <div className="text-6xl mb-6">{data.emoji}</div>
            <p className="text-xl text-gray-600 mb-6">
              The letter {data.letter} makes the sound!
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handlePlaySound}
                className="bg-kidorange hover:bg-kidorange/90 text-white px-6 py-3 rounded-2xl font-bold text-lg btn-3d"
                data-testid="button-play-letter-sound"
              >
                <Volume2 className="mr-2" size={20} />
                Play Sound
              </Button>
              <Button
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-2xl font-bold text-lg btn-3d"
                data-testid="button-next-letter"
              >
                Next Letter
              </Button>
            </div>
          </div>
        );

      case "number":
        return (
          <div className="text-center">
            <motion.div
              className="text-6xl font-kid font-bold text-kidorange mb-4"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: 1 }}
            >
              {data.number}
            </motion.div>
            <h3 className="text-3xl font-kid font-bold text-kidnavy mb-4">
              {data.number} {data.word}!
            </h3>
            <div className="text-4xl mb-6">{data.emoji}</div>
            <p className="text-xl text-gray-600 mb-6">
              Count them all: {data.number} items!
            </p>
            <Button
              onClick={onClose}
              className="bg-kidgreen hover:bg-kidgreen/90 text-white px-8 py-4 rounded-2xl font-bold text-xl btn-3d"
              data-testid="button-continue-counting"
            >
              Keep Counting!
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg mx-auto p-8 relative"
          >
            <Button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 p-0"
              data-testid="button-close-modal"
            >
              <X size={16} />
            </Button>
            {renderContent()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
