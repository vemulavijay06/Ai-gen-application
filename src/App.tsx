import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Gamepad2, Headphones, Github, Twitter, Info } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-bg-dark">
      {/* Scanline Effect */}
      <div className="scanline" />

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-neon-cyan/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-neon-magenta/5 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.1]" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center border-b border-white/10 backdrop-blur-sm bg-black/40">
        <div className="flex items-center gap-4">
          <div className="p-2 border border-neon-cyan/50 rounded-lg bg-neon-cyan/10">
            <Gamepad2 className="w-6 h-6 text-neon-cyan" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter neon-glow-cyan text-neon-cyan uppercase leading-none">
              SYNTH-SNAKE <span className="text-xs font-normal opacity-50 tracking-widest ml-2">V 2.0.4</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-[0.3em] uppercase mt-1">
              Neural Link Stabilized
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-12 text-[10px] font-mono uppercase tracking-[0.3em] text-slate-400">
           <a href="#" className="hover:text-neon-cyan transition-colors border-b border-transparent hover:border-neon-cyan pb-1">Mainframe</a>
           <a href="#" className="hover:text-neon-magenta transition-colors border-b border-transparent hover:border-neon-magenta pb-1">Archive</a>
           <a href="#" className="hover:text-neon-lime transition-colors border-b border-transparent hover:border-neon-lime pb-1">Protocols</a>
        </div>

        <div className="flex items-center gap-4">
           <button className="p-2 glass-panel rounded-lg hover:border-neon-magenta transition-all text-slate-400 hover:text-neon-magenta">
             <Info className="w-5 h-5" />
           </button>
           <button className="p-2 glass-panel rounded-lg hover:border-neon-cyan transition-all text-slate-400 hover:text-neon-cyan">
             <Github className="w-5 h-5" />
           </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="relative z-10 max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-120px)] overflow-hidden">
        
        {/* Left Side: Playlist Area */}
        <motion.section 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-3 flex flex-col h-full overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xs font-mono uppercase tracking-[0.4em] text-slate-500 font-bold">Neural Playlist</h2>
          </div>
          <MusicPlayer />
        </motion.section>

        {/* Center: Game Area */}
        <motion.section 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-6 flex flex-col items-center justify-center glass-panel rounded-2xl border-white/5 bg-black/60 relative overflow-hidden"
        >
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,243,255,0.03),transparent_70%)] pointer-events-none" />
          
          <div className="relative z-10 w-full flex flex-col items-center p-4">
             <div className="w-full">
               <SnakeGame />
             </div>
          </div>
        </motion.section>

        {/* Right Side: Stats / Ranking */}
        <motion.section 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-3 flex flex-col h-full overflow-hidden gap-4"
        >
          <div className="p-6 glass-panel rounded-2xl border-white/5 flex-1">
            <h2 className="text-xs uppercase tracking-[0.4em] mb-6 text-slate-500 font-bold">Global Ranking</h2>
            <div className="space-y-6">
              {[
                { rank: '01', user: 'XENO_MORPH', score: '9820', p: '90%', active: true },
                { rank: '02', user: 'BIT_SLAYER', score: '7450', p: '75%', active: false },
                { rank: '03', user: 'VOID_WALK', score: '6100', p: '60%', active: false },
              ].map((item) => (
                <div key={item.rank} className="flex items-center gap-3">
                  <span className="text-xs font-bold opacity-30 font-mono">{item.rank}</span>
                  <div className="flex-1">
                    <p className={`text-sm tracking-widest ${item.active ? 'text-neon-cyan' : 'text-slate-400'}`}>{item.user}</p>
                    <div className="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden">
                      <div className="bg-neon-cyan h-full transition-all duration-1000" style={{ width: item.p }}></div>
                    </div>
                  </div>
                  <span className="text-xs text-neon-cyan font-mono">{item.score}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 glass-panel rounded-2xl border-white/5 bg-neon-magenta/5 border-neon-magenta/20">
             <h2 className="text-xs uppercase tracking-[0.4em] mb-4 text-neon-magenta/70 font-bold">Local Stats</h2>
             <div className="space-y-2 text-[11px] font-mono">
               <div className="flex justify-between">
                 <span className="opacity-60 text-slate-400">UPTIME</span>
                 <span className="text-neon-magenta">04:12:44</span>
               </div>
               <div className="flex justify-between">
                 <span className="opacity-60 text-slate-400">NODES</span>
                 <span className="text-neon-magenta">12 UNIT</span>
               </div>
             </div>
          </div>
        </motion.section>
      </main>

      {/* Status Bar */}
      <footer className="fixed bottom-0 left-0 w-full p-2 bg-black/80 border-t border-white/10 backdrop-blur-md z-20 flex justify-between items-center px-8">
        <div className="flex items-center gap-12 font-mono text-[9px] uppercase tracking-widest">
           <div className="flex items-center gap-2">
             <span className="text-slate-600">Sync Mode</span>
             <span className="text-neon-lime">OPTIMIZED</span>
           </div>
           <div className="flex items-center gap-2 hidden sm:flex">
             <span className="text-slate-600">Packet Loss</span>
             <span className="text-neon-magenta">0.00%</span>
           </div>
        </div>
        
        <div className="text-[10px] font-mono text-slate-700 tracking-tighter">
           TERMINAL_REVISION // PROXY_V2
        </div>
      </footer>
    </div>
  );
}
