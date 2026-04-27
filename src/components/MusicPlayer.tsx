import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, ListMusic } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Horizon",
    artist: "SynthWave AI",
    duration: "3:45",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#00f3ff"
  },
  {
    id: 2,
    title: "Midnight Drive",
    artist: "Cyber Soul",
    duration: "4:20",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#ff00ff"
  },
  {
    id: 3,
    title: "Digital Rain",
    artist: "Pixel Pulse",
    duration: "2:58",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#bcff00"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div className="w-full h-full flex flex-col glass-panel rounded-2xl overflow-hidden border-white/5">
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={skipForward}
      />
      
      {/* Visualizer / Album Art Placeholder */}
      <div className="h-48 relative flex items-center justify-center bg-black/40 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,var(--tw-gradient-from),transparent_70%)]" style={{ '--tw-gradient-from': currentTrack.color } as any}></div>
        </div>
        
        <motion.div 
          key={currentTrack.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 w-32 h-32 rounded-xl flex items-center justify-center border-2"
          style={{ borderColor: currentTrack.color, boxShadow: `0 0 40px ${currentTrack.color}44` }}
        >
          <Music className="w-16 h-16" style={{ color: currentTrack.color }} />
          
          {/* Animated bars */}
          <div className="absolute -bottom-4 flex gap-1 h-8 items-end">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div 
                key={i}
                animate={isPlaying ? { height: [4, 16, 8, 20, 6] } : { height: 4 }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                className="w-1 rounded-full"
                style={{ backgroundColor: currentTrack.color }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      <div className="p-6 flex flex-col gap-6">
        <div>
          <h3 className="text-xl font-display font-bold tracking-tight mb-1">{currentTrack.title}</h3>
          <p className="text-slate-500 font-mono text-sm uppercase tracking-wider">{currentTrack.artist}</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden cursor-pointer">
            <motion.div 
              className="h-full bg-white relative"
              style={{ width: `${progress}%`, backgroundColor: currentTrack.color }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: currentTrack.color, boxShadow: `0 0 10px ${currentTrack.color}` }} />
            </motion.div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>{audioRef.current ? Math.floor(audioRef.current.currentTime / 60) + ":" + (Math.floor(audioRef.current.currentTime % 60)).toString().padStart(2, '0') : "0:00"}</span>
            <span>{currentTrack.duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button onClick={skipBackward} className="p-2 text-slate-500 hover:text-neon-cyan transition-colors">
            <SkipBack className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 border"
            style={{ 
                backgroundColor: `${currentTrack.color}22`, 
                borderColor: currentTrack.color,
                boxShadow: `0 0 15px ${currentTrack.color}44` 
            }}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current" style={{ color: currentTrack.color }} />
            ) : (
              <Play className="w-8 h-8 fill-current translate-x-0.5" style={{ color: currentTrack.color }} />
            )}
          </button>

          <button onClick={skipForward} className="p-2 text-slate-500 hover:text-neon-cyan transition-colors">
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Volume2 className="w-4 h-4 text-slate-600" />
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setVolume(v);
              if (audioRef.current) audioRef.current.volume = v;
            }}
            className="flex-1 accent-neon-cyan h-1 cursor-pointer"
          />
        </div>
      </div>

      <div className="mt-auto px-6 pb-6 border-t border-white/5 pt-4">
        <div className="flex items-center gap-2 mb-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <ListMusic className="w-3 h-3" />
            <span>Neural Archive</span>
        </div>
        <div className="space-y-1">
          {TRACKS.map((track, index) => (
            <button 
              key={track.id}
              onClick={() => { setCurrentTrackIndex(index); setIsPlaying(true); }}
              className={`w-full flex items-center justify-between p-2 rounded border-l-2 transition-all text-left text-sm ${index === currentTrackIndex ? 'bg-white/10 text-white border-neon-cyan' : 'text-slate-500 border-transparent hover:bg-white/5 hover:text-slate-300'}`}
            >
              <div className="flex items-center gap-3">
                 <div className={`w-1.5 h-1.5 rounded-full ${index === currentTrackIndex ? 'bg-neon-cyan animate-pulse shadow-[0_0_8px_#00f3ff]' : 'bg-slate-700'}`} />
                 <span className="font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{track.title}</span>
              </div>
              <span className="text-[9px] font-mono opacity-40">{track.duration}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
