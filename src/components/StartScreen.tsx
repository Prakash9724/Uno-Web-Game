import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CardBack from './CardBack';

const StartScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-7xl md:text-9xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-uno-red via-uno-yellow to-uno-blue mb-4">
          UNO
        </h1>
        <p className="text-xl text-brand-textSecondary mb-12">The Classic Card Game, Reimagined</p>
      </motion.div>

      <div className="flex -space-x-16 mb-12">
        <motion.div initial={{ rotate: -20, x: -20 }} animate={{ rotate: -15, x: 0 }} transition={{ yoyo: Infinity, duration: 1.5, ease: 'easeInOut' }}>
          <CardBack />
        </motion.div>
        <motion.div initial={{ y: -20 }} animate={{ y: 0 }} transition={{ yoyo: Infinity, duration: 1.2, ease: 'easeInOut' }}>
          <CardBack />
        </motion.div>
        <motion.div initial={{ rotate: 20, x: 20 }} animate={{ rotate: 15, x: 0 }} transition={{ yoyo: Infinity, duration: 1.8, ease: 'easeInOut' }}>
          <CardBack />
        </motion.div>
      </div>

      <motion.button
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        whileHover={{ scale: 1.05, boxShadow: '0px 0px 20px rgba(158, 127, 255, 0.5)' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/select-mode')}
        className="px-12 py-4 bg-brand-primary text-white font-bold text-2xl rounded-xl shadow-lg transition-all"
      >
        Start Game
      </motion.button>
    </div>
  );
};

export default StartScreen;
