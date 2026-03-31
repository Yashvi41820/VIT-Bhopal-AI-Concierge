
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { Mic, MicOff, Volume2, VolumeX, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AudioProcessor, AudioPlayer } from '../lib/audio-utils';
import { SYSTEM_INSTRUCTION } from '../constants';

interface VoiceInterfaceProps {
  onTranscription?: (text: string, isModel: boolean) => void;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onTranscription }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const sessionRef = useRef<any>(null);
  const audioProcessorRef = useRef<AudioProcessor | null>(null);
  const audioPlayerRef = useRef<AudioPlayer | null>(null);

  const toggleVoice = async () => {
    if (isActive) {
      stopSession();
    } else {
      await startSession();
    }
  };

  const startSession = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      audioPlayerRef.current = new AudioPlayer();
      
      const session = await ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: SYSTEM_INSTRUCTION,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            startAudioCapture();
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle audio output
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioPlayerRef.current) {
              audioPlayerRef.current.playChunk(base64Audio);
            }

            // Handle transcription
            if (message.serverContent?.modelTurn?.parts?.[0]?.text) {
               onTranscription?.(message.serverContent.modelTurn.parts[0].text, true);
            }
            
            // Handle user transcription
            const userText = (message.serverContent as any)?.userTurn?.parts?.[0]?.text;
            if (userText) {
               onTranscription?.(userText, false);
            }

            // Handle interruption
            if (message.serverContent?.interrupted) {
              // In a more complex app, we'd stop the current audio playback
              console.log("Interrupted");
            }
          },
          onclose: () => {
            stopSession();
          },
          onerror: (err) => {
            console.error("Live API Error:", err);
            setError("Connection error. Please try again.");
            stopSession();
          }
        }
      });

      sessionRef.current = session;
    } catch (err) {
      console.error("Failed to start session:", err);
      setError("Failed to initialize V-Guide Voice.");
      setIsConnecting(false);
    }
  };

  const startAudioCapture = async () => {
    try {
      audioProcessorRef.current = new AudioProcessor((base64Data) => {
        if (sessionRef.current && !isMuted) {
          sessionRef.current.sendRealtimeInput({
            audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
          });
        }
      });
      await audioProcessorRef.current.start();
    } catch (err) {
      console.error("Mic access error:", err);
      setError("Microphone access denied.");
      stopSession();
    }
  };

  const stopSession = () => {
    setIsActive(false);
    setIsConnecting(false);
    
    if (audioProcessorRef.current) {
      audioProcessorRef.current.stop();
      audioProcessorRef.current = null;
    }
    
    if (audioPlayerRef.current) {
      audioPlayerRef.current.stop();
      audioPlayerRef.current = null;
    }

    if (sessionRef.current) {
      // sessionRef.current.close(); // If available
      sessionRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-500 text-sm font-medium bg-red-50 px-3 py-1 rounded-full border border-red-100"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        {isActive && (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-vit-orange/30 rounded-full blur-xl"
          />
        )}
        
        <button
          onClick={toggleVoice}
          disabled={isConnecting}
          className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            isActive 
              ? 'bg-vit-orange text-white scale-110' 
              : 'bg-vit-blue text-white hover:bg-vit-blue/90'
          } ${isConnecting ? 'opacity-80 cursor-wait' : ''}`}
        >
          {isConnecting ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : isActive ? (
            <Mic className="w-8 h-8" />
          ) : (
            <MicOff className="w-8 h-8" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={`p-2 rounded-full transition-colors ${isMuted ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        
        <div className="flex flex-col items-center">
          <span className={`text-sm font-bold tracking-wider uppercase ${isActive ? 'text-vit-orange' : 'text-slate-400'}`}>
            {isActive ? 'Live Session' : isConnecting ? 'Connecting...' : 'Voice Mode Off'}
          </span>
          {isActive && (
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4].map(i => (
                <motion.div
                  key={i}
                  animate={{ height: [4, 12, 4] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                  className="w-1 bg-vit-orange rounded-full"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
