import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

const UnoButton: React.FC = () => {
  const { players, currentTurn, callUno, unoCalled } = useGameStore();
  const showButton = players[currentTurn]?.length === 2 && !unoCalled[currentTurn];

  if (!showButton) return null;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => callUno(currentTurn)}
      className="w-28 h-28 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-white font-black text-4xl italic shadow-lg animate-glow"
    >
      UNO
    </motion.button>
  );
};

export default UnoButton;
