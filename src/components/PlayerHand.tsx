import { motion, AnimatePresence } from 'framer-motion';
import { Card as CardType } from '../constants';
import CardComponent from './Card';
import { useGameStore } from '../store/gameStore';

interface PlayerHandProps {
  player: 'player1' | 'player2';
  cards: CardType[];
}

const PlayerHand: React.FC<PlayerHandProps> = ({ player, cards }) => {
  const { currentTurn, playCard, discardPile, currentColor } = useGameStore();
  const topCard = discardPile[discardPile.length - 1];
  const isCurrentPlayer = currentTurn === player;

  const isPlayable = (card: CardType) => {
    if (!isCurrentPlayer) return false;
    if (card.value.startsWith('wild')) {
        if (card.value === 'wild-draw-four') {
            return !cards.some(c => c.color === currentColor);
        }
        return true;
    }
    return card.color === currentColor || card.value === topCard.value;
  };

  const cardWidth = 112; // w-28
  const overlap = 60;
  const totalWidth = cards.length > 0 ? (cards.length - 1) * (cardWidth - overlap) + cardWidth : 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className={`text-2xl font-bold transition-all ${isCurrentPlayer ? 'text-brand-secondary scale-110' : 'text-brand-textSecondary'}`}>
        {player === 'player1' ? 'Your Hand' : 'Opponent'} ({cards.length})
      </h2>
      <div
        className="relative flex justify-center items-end h-48 transition-all duration-500"
        style={{ width: `${totalWidth}px`, minWidth: '200px' }}
      >
        <AnimatePresence>
          {cards.map((card, index) => {
            const offset = (index - (cards.length - 1) / 2) * (cardWidth - overlap);
            const rotation = (index - (cards.length - 1) / 2) * 5;
            
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  x: offset,
                  rotate: rotation,
                  scale: 1,
                  zIndex: index,
                }}
                exit={{ opacity: 0, y: -100, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute"
              >
                <CardComponent
                  card={card}
                  isPlayable={isPlayable(card)}
                  onClick={() => isPlayable(card) && playCard(player, card)}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlayerHand;
