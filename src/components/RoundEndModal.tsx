import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { Award } from 'lucide-react';

const RoundEndModal: React.FC = () => {
  const { roundWinner, pointsScoredThisRound, startNextRound } = useGameStore();

  const winnerName = roundWinner === 'player1' ? 'You' : 'Opponent';

  return (
    <AnimatePresence>
      {roundWinner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.5, y: -100 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-brand-surface p-8 rounded-2xl shadow-2xl border border-brand-border text-center w-full max-w-md"
          >
            <Award className="mx-auto h-16 w-16 text-brand-secondary mb-4" />
            <h2 className="text-4xl font-bold text-white mb-2">{winnerName} won the round!</h2>
            <p className="text-2xl text-brand-primary font-semibold mb-6">
              +{pointsScoredThisRound} points
            </p>
            <button
              onClick={startNextRound}
              className="px-8 py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-opacity-80 transition-all"
            >
              Start Next Round
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoundEndModal;
