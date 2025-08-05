import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { Trophy } from 'lucide-react';
import Confetti from 'react-confetti';
import useWindowSize from '../hooks/useWindowSize';

const GameEndModal: React.FC = () => {
  const { finalWinner, resetGame, playerScores } = useGameStore();
  const { width, height } = useWindowSize();

  const winnerName = finalWinner === 'player1' ? 'You' : 'Opponent';

  return (
    <AnimatePresence>
      {finalWinner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <Confetti width={width} height={height} recycle={false} numberOfPieces={400} gravity={0.1} />
          <motion.div
            initial={{ scale: 0.5, y: -100 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-brand-surface p-8 rounded-2xl shadow-2xl border border-brand-border text-center w-full max-w-md"
          >
            <Trophy className="mx-auto h-16 w-16 text-yellow-400 mb-4" />
            <h2 className="text-4xl font-bold text-white mb-2">GAME OVER</h2>
            <p className="text-2xl text-brand-primary font-semibold mb-4">{winnerName} won the game!</p>
            <div className="bg-neutral-800/50 p-4 rounded-lg mb-6 border border-brand-border">
                <h3 className="text-lg font-bold text-white mb-2">Final Scores</h3>
                <div className="flex justify-around text-left">
                    <p className="text-brand-text-secondary">Player 1: <span className="font-bold text-white">{playerScores.player1}</span></p>
                    <p className="text-brand-text-secondary">Player 2: <span className="font-bold text-white">{playerScores.player2}</span></p>
                </div>
            </div>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-opacity-80 transition-all"
            >
              Play Again
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameEndModal;
