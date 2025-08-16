import { useCallback, useRef, useState, useEffect } from "react";

export function useAudio() {
  const audioContext = useRef<AudioContext | null>(null);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
    
    // Check sound preferences from localStorage
    const soundPref = localStorage.getItem('littlescribler-sound');
    if (soundPref) {
      setIsSoundEnabled(soundPref === 'true');
    }
  }, []);

  const initAudio = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Resume audio context if it's suspended
    if (audioContext.current.state === 'suspended') {
      audioContext.current.resume();
    }
  }, []);

  const playTone = useCallback((frequency: number, duration: number = 0.3, waveType: OscillatorType = 'sine') => {
    if (!isSoundEnabled) return;
    
    initAudio();
    if (!audioContext.current) return;

    try {
      const oscillator = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.current.currentTime);
      oscillator.type = waveType;

      gainNode.gain.setValueAtTime(0.2, audioContext.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration);

      oscillator.start(audioContext.current.currentTime);
      oscillator.stop(audioContext.current.currentTime + duration);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, [initAudio, isSoundEnabled]);

  const playSuccessSound = useCallback(() => {
    playTone(523.25); // C5
    setTimeout(() => playTone(659.25), 150); // E5
    setTimeout(() => playTone(783.99), 300); // G5
  }, [playTone]);

  const playClickSound = useCallback(() => {
    playTone(800, 0.1);
  }, [playTone]);

  const speakText = useCallback((text: string, rate: number = 1) => {
    if (!isSoundEnabled || !speechSynthesis) return;
    
    try {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = 1.2; // Higher pitch for kids
      utterance.volume = 0.8;
      
      // Try to use a child-friendly voice
      const voices = speechSynthesis.getVoices();
      const kidVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Female') ||
        voice.name.includes('Child')
      );
      if (kidVoice) utterance.voice = kidVoice;
      
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.warn('Speech synthesis failed:', error);
    }
  }, [speechSynthesis, isSoundEnabled]);

  const playLetterSound = useCallback((letter: string) => {
    if (!isSoundEnabled) return;
    
    // Play both the letter sound and speak it
    const frequencies: Record<string, number> = {
      A: 440, B: 493.88, C: 523.25, D: 587.33, E: 659.25, F: 698.46,
      G: 783.99, H: 880, I: 987.77, J: 1046.5, K: 1174.66, L: 1318.51,
      M: 1396.91, N: 1567.98, O: 1760, P: 1975.53, Q: 2093, R: 2349.32,
      S: 2637.02, T: 2793.83, U: 3135.96, V: 3520, W: 3951.07, X: 4186.01,
      Y: 4698.63, Z: 5274.04
    };
    
    const frequency = frequencies[letter.toUpperCase()] || 440;
    playTone(frequency, 0.3);
    
    // Also speak the letter
    setTimeout(() => {
      speakText(`Letter ${letter.toUpperCase()}`);
    }, 400);
  }, [playTone, speakText, isSoundEnabled]);

  const playAnimalSound = useCallback((animal: string) => {
    if (!isSoundEnabled) return;
    
    const animalSounds: Record<string, { sound: string; tones: () => void }> = {
      dog: {
        sound: "Woof woof!",
        tones: () => {
          playTone(200, 0.15, 'square');
          setTimeout(() => playTone(300, 0.15, 'square'), 200);
          setTimeout(() => playTone(250, 0.1, 'square'), 400);
        }
      },
      cat: {
        sound: "Meow meow!",
        tones: () => {
          playTone(400, 0.4, 'sine');
          setTimeout(() => playTone(500, 0.3, 'sine'), 300);
        }
      },
      lion: {
        sound: "Roooooar!",
        tones: () => {
          playTone(150, 1.2, 'sawtooth');
          setTimeout(() => playTone(120, 0.8, 'sawtooth'), 400);
        }
      },
      elephant: {
        sound: "Trumpet trumpet!",
        tones: () => {
          playTone(100, 0.8, 'triangle');
          setTimeout(() => playTone(200, 0.6, 'triangle'), 600);
        }
      },
      cow: {
        sound: "Moooo moooo!",
        tones: () => {
          playTone(180, 0.8, 'sawtooth');
          setTimeout(() => playTone(160, 0.6, 'sawtooth'), 600);
        }
      },
      bird: {
        sound: "Tweet tweet chirp!",
        tones: () => {
          playTone(1000, 0.1, 'sine');
          setTimeout(() => playTone(1200, 0.1, 'sine'), 150);
          setTimeout(() => playTone(800, 0.1, 'sine'), 300);
          setTimeout(() => playTone(1100, 0.15, 'sine'), 450);
        }
      },
    };

    const animalData = animalSounds[animal.toLowerCase()];
    if (animalData) {
      // Play the tone pattern first
      animalData.tones();
      
      // Then speak the animal sound
      setTimeout(() => {
        speakText(animalData.sound, 0.9);
      }, 600);
    } else {
      playClickSound();
    }
  }, [playTone, speakText, playClickSound, isSoundEnabled]);

  const playNumberSound = useCallback((number: number) => {
    if (!isSoundEnabled) return;
    
    // Play a tone based on the number
    const baseFreq = 200 + (number * 50);
    playTone(baseFreq, 0.4);
    
    // Speak the number
    setTimeout(() => {
      speakText(`Number ${number}`);
    }, 500);
  }, [playTone, speakText, isSoundEnabled]);

  const playWordSound = useCallback((word: string) => {
    if (!isSoundEnabled) return;
    
    speakText(word, 0.8);
  }, [speakText, isSoundEnabled]);

  return {
    playSuccessSound,
    playClickSound,
    playLetterSound,
    playAnimalSound,
    playNumberSound,
    playWordSound,
    speakText,
    playTone,
    isSoundEnabled,
    setIsSoundEnabled,
  };
}
