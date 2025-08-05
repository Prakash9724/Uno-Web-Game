import { useGameStore } from '../store/gameStore';
import { Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';

const AnimatedCounter = ({ value }: { value: number }) => {
  const spring = useSpring(value, { mass: 0.8, stiffness: 100, damping: 20 });
  const rounded = useTransform(spring, (latest) => Math.round(latest));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{rounded}</motion.span>;
};

const Scoreboard = () => {
  const { playerScores, round, lastScoreUpdate } = useGameStore();
  const [pointIndicators, setPointIndicators] = useState<any[]>([]);

  useEffect(() => {
    if (lastScoreUpdate.player && lastScoreUpdate.points > 0) {
      const newIndicator = {
        id: lastScoreUpdate.key,
        player: lastScoreUpdate.player,
        points: lastScoreUpdate.points,
      };
      setPointIndicators(prev => [...prev, newIndicator]);
      const timer = setTimeout(() => {
        setPointIndicators(prev => prev.filter(p => p.id !== newIndicator.id));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [lastScoreUpdate]);

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 w-full px-4">
      <div className="relative bg-brand-surface/80 backdrop-blur-sm text-white px-6 py-2 rounded-xl shadow-lg border border-brand-border flex items-center gap-6">
        
        <div className="relative text-center w-24">
          <p className="text-sm text-brand-text-secondary">Player 1</p>
          <p className="text-xl font-bold text-brand-primary">
            <AnimatedCounter value={playerScores.player1} /> pts
          </p>
          <AnimatePresence>
            {pointIndicators.filter(p => p.player === 'player1').map(p => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                animate={{ opacity: 1, y: -25, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="absolute -top-2 left-1/2 -translate-x-1/2 text-sm font-bold text-emerald-400"
              >
                +{p.points}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="text-center self-stretch flex items-center justify-center">
            <Trophy className="h-6 w-6 text-brand-secondary" />
        </div>

        <div className="relative text-center w-24">
          <p className="text-sm text-brand-text-secondary">Player 2</p>
          <p className="text-xl font-bold text-sky-400">
            <AnimatedCounter value={playerScores.player2} /> pts
          </p>
          <AnimatePresence>
            {pointIndicators.filter(p => p.player === 'player2').map(p => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                animate={{ opacity: 1, y: -25, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="absolute -top-2 left-1/2 -translate-x-1/2 text-sm font-bold text-emerald-400"
              >
                +{p.points}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
      <div className="bg-neutral-900/80 text-brand-text-secondary px-3 py-1 text-xs font-semibold rounded-full border border-brand-border">
        Round {round}
      </div>
    </div>
  );
};

export default Scoreboard;
