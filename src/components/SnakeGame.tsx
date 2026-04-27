import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Trophy, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const INITIAL_FOOD: Point = { x: 5, y: 5 };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>(INITIAL_FOOD);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      const head = { ...snake[0] };
      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check collision
      if (
        head.x < 0 || head.x >= GRID_SIZE ||
        head.y < 0 || head.y >= GRID_SIZE ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return;
      }

      const newSnake = [head, ...snake];
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }
      setSnake(newSnake);
    };

    const interval = setInterval(moveSnake, 150 - Math.min(score, 100)); // Speed increases slightly
    return () => clearInterval(interval);
  }, [snake, direction, food, gameOver, isPaused, score, generateFood, highScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw background grid (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
        ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#bcff00' : '#bcff0088';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#bcff00';
      ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    });

    // Draw food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Reset shadow
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] mb-2 px-4">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-slate-600 font-mono">Current Score</span>
          <span className="text-3xl font-mono neon-glow-lime text-neon-lime">{score.toString().padStart(6, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-slate-600 font-mono">High Score</span>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-neon-magenta" />
            <span className="text-3xl font-mono neon-glow-magenta text-neon-magenta">{highScore.toString().padStart(6, '0')}</span>
          </div>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-purple rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="relative glass-panel rounded-lg shadow-2xl border-2 border-white/5"
        />
        
        <AnimatePresence>
          {(isPaused || gameOver) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg"
            >
              <div className="text-center p-8 glass-panel rounded-2xl border-neon-lime/20">
                {gameOver ? (
                  <>
                    <h2 className="text-4xl font-display font-bold text-neon-magenta neon-glow-magenta mb-2">CRITICAL FAILURE</h2>
                    <p className="text-slate-400 mb-6 font-mono uppercase tracking-widest text-xs">Integrity Lost: {score} Units</p>
                    <button 
                      onClick={resetGame}
                      className="px-8 py-3 bg-neon-magenta/20 border border-neon-magenta text-neon-magenta rounded-lg font-mono uppercase tracking-widest hover:bg-neon-magenta hover:text-black transition-all flex items-center gap-2 mx-auto"
                    >
                      <RotateCcw className="w-4 h-4" /> REBOOT_SYSTEM
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-4xl font-display font-bold text-neon-lime neon-glow-lime mb-6 tracking-tighter">NEURAL_LINK</h2>
                    <button 
                      onClick={() => setIsPaused(false)}
                      className="px-12 py-4 bg-neon-lime/20 border border-neon-lime text-neon-lime rounded-lg font-mono uppercase tracking-[0.3em] hover:bg-neon-lime hover:text-black transition-all shadow-[0_0_20px_rgba(188,255,0,0.3)]"
                    >
                      INITIALIZE
                    </button>
                    <p className="mt-4 text-[9px] text-slate-500 font-mono tracking-widest uppercase italic">Press [SPACE] to authorize</p>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-4 flex gap-4 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-mono">
        <span>[Arrow Keys] Change Direction</span>
        <span>[P] Pause</span>
      </div>
    </div>
  );
}
