import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import CardComponent from './Card';

const DiscardPile: React.FC = () => {
  const { discardPile } = useGameStore();
  const cardsToShow = discardPile.slice(-5); // Show the last 5 cards for a stack effect

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-40">
        {cardsToShow.length === 0 ? (
          <div className="w-28 h-40 rounded-xl border-2 border-dashed border-brand-border/50 flex items-center justify-center">
            <span className="text-brand-textSecondary text-sm text-center">Play Area</span>
          </div>
        ) : (
          <AnimatePresence>
            {cardsToShow.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: -50, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotate: (index - (cardsToShow.length - 1)) * 5, // Fan out the cards
                  zIndex: index,
                }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 50 }}
                className="absolute"
              >
                <CardComponent card={card} isPlayable={false} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      <span className="font-semibold text-brand-textSecondary">Discard Pile</span>
    </div>
  );
};

export default DiscardPile;
