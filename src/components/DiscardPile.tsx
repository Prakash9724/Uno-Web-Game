import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import CardComponent from './Card';

const DiscardPile: React.FC = () => {
  const { discardPile } = useGameStore();
  const topCard = discardPile[discardPile.length - 1];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-40">
        <AnimatePresence>
          {topCard && (
            <motion.div
              key={topCard.id}
              initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 30 }}
              transition={{ duration: 0.3 }}
              className="absolute"
            >
              <CardComponent card={topCard} isPlayable={false} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span className="font-semibold text-brand-textSecondary">Discard Pile</span>
    </div>
  );
};

export default DiscardPile;
