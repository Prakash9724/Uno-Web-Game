import { useGameStore } from '../store/gameStore';
import { Color } from '../constants';
import { AnimatePresence, motion } from 'framer-motion';

const colorClasses: Record<Color, string> = {
  red: 'bg-uno-red',
  green: 'bg-uno-green',
  blue: 'bg-uno-blue',
  yellow: 'bg-uno-yellow',
};

const GameInfo: React.FC = () => {
  const { currentTurn, currentColor, messages } = useGameStore();

  return (
    <div className="flex flex-col items-center gap-4 p-4 rounded-xl bg-brand-surface/50 border border-brand-border backdrop-blur-sm w-full max-w-xs">
      <div className="text-center">
        <p className="text-sm text-brand-textSecondary">Current Turn</p>
        <p className="text-2xl font-bold text-brand-primary">{currentTurn === 'player1' ? 'You' : 'Opponent'}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-brand-textSecondary">Current Color</p>
        <div className="flex items-center justify-center gap-2">
          <div className={`w-6 h-6 rounded-full ${colorClasses[currentColor]} shadow-lg`}></div>
          <p className="text-2xl font-bold text-white capitalize">{currentColor}</p>
        </div>
      </div>
      <div className="w-full h-24 bg-brand-background/50 rounded-lg p-2 overflow-hidden">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-brand-textSecondary"
            >
              {msg}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GameInfo;
