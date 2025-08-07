import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bot, Globe, Users } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Button } from '../components/ui/button';

const SelectMode = () => {
  const navigate = useNavigate();
  const startGame = useGameStore((state) => state.startGame);

  const handleModeSelect = (path: string, mode: 'ai' | 'friends' | 'random') => {
    // In a real app, you'd pass the mode to the store, e.g., startGame(mode)
    startGame();
    navigate(path, { state: { fromSelectMode: true } });
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        type: 'spring',
        stiffness: 260,
        damping: 20,
      },
    }),
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4">
      <motion.h1 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl md:text-7xl font-black mb-4 text-center"
      >
        Choose Your Arena
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-lg text-brand-textSecondary mb-12 text-center"
      >
        How do you want to play today?
      </motion.p>

      <div className="flex flex-col items-center gap-6 w-full max-w-xs md:max-w-sm">
        {[
          { icon: Bot, label: 'Play vs AI', path: '/ai', mode: 'ai' },
          { icon: Users, label: 'Play with Friends', path: '/room', mode: 'friends' },
          { icon: Globe, label: 'Play with Randoms', path: '/matchmaking', mode: 'random' },
        ].map((item, index) => (
          <motion.div
            key={item.path}
            custom={index}
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            className="w-full"
          >
            <Button
              onClick={() => handleModeSelect(item.path, item.mode as any)}
              className="w-full text-lg font-semibold h-16 bg-brand-surface border border-brand-border hover:bg-brand-primary/20 hover:border-brand-primary transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-start px-6 gap-4 drop-shadow-lg"
            >
              <item.icon className="h-6 w-6 text-brand-secondary" />
              <span>{item.label}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SelectMode;
