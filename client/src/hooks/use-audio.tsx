import { useCallback, useRef } from "react";

export function useAudio() {
  const audioContext = useRef<AudioContext | null>(null);

  const initAudio = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  const playTone = useCallback((frequency: number, duration: number = 0.3) => {
    initAudio();
    if (!audioContext.current) return;

    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.current.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration);

    oscillator.start(audioContext.current.currentTime);
    oscillator.stop(audioContext.current.currentTime + duration);
  }, [initAudio]);

  const playSuccessSound = useCallback(() => {
    playTone(523.25); // C5
    setTimeout(() => playTone(659.25), 150); // E5
    setTimeout(() => playTone(783.99), 300); // G5
  }, [playTone]);

  const playClickSound = useCallback(() => {
    playTone(800, 0.1);
  }, [playTone]);

  const playLetterSound = useCallback((letter: string) => {
    // Different tones for different letters
    const frequencies: Record<string, number> = {
      A: 440, B: 493.88, C: 523.25, D: 587.33, E: 659.25, F: 698.46,
      G: 783.99, H: 880, I: 987.77, J: 1046.5, K: 1174.66, L: 1318.51,
      M: 1396.91, N: 1567.98, O: 1760, P: 1975.53, Q: 2093, R: 2349.32,
      S: 2637.02, T: 2793.83, U: 3135.96, V: 3520, W: 3951.07, X: 4186.01,
      Y: 4698.63, Z: 5274.04
    };
    
    const frequency = frequencies[letter.toUpperCase()] || 440;
    playTone(frequency, 0.5);
  }, [playTone]);

  const playAnimalSound = useCallback((animal: string) => {
    // Different sound patterns for different animals
    const patterns: Record<string, () => void> = {
      dog: () => {
        playTone(200, 0.1);
        setTimeout(() => playTone(300, 0.1), 100);
      },
      cat: () => {
        playTone(400, 0.3);
        setTimeout(() => playTone(500, 0.2), 200);
      },
      lion: () => {
        playTone(150, 0.8);
      },
      elephant: () => {
        playTone(100, 1.0);
      },
      cow: () => {
        playTone(250, 0.6);
      },
      bird: () => {
        playTone(1000, 0.1);
        setTimeout(() => playTone(1200, 0.1), 100);
        setTimeout(() => playTone(800, 0.1), 200);
      },
    };

    const pattern = patterns[animal.toLowerCase()];
    if (pattern) {
      pattern();
    } else {
      playClickSound();
    }
  }, [playTone, playClickSound]);

  return {
    playSuccessSound,
    playClickSound,
    playLetterSound,
    playAnimalSound,
    playTone,
  };
}
