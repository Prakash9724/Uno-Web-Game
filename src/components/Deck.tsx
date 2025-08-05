import { useGameStore } from '../store/gameStore';
import CardBack from './CardBack';

const Deck: React.FC = () => {
  const { deck, drawCard, currentTurn, isDrawing } = useGameStore();

  const handleDraw = () => {
    if (!isDrawing) {
      drawCard(currentTurn);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-40">
        {deck.length > 0 ? (
          <CardBack
            onClick={handleDraw}
            className="cursor-pointer hover:shadow-2xl hover:shadow-brand-secondary/50 transition-shadow"
          />
        ) : (
          <div className="w-28 h-40 rounded-xl border-2 border-dashed border-brand-border flex items-center justify-center">
            <span className="text-brand-textSecondary text-sm">Empty</span>
          </div>
        )}
      </div>
      <span className="font-semibold text-brand-textSecondary">Deck ({deck.length})</span>
    </div>
  );
};

export default Deck;
