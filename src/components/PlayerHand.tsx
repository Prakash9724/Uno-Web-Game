import { useGameStore } from '../store/gameStore';
import Card from './Card';
import { Card as CardType } from '../constants';

interface PlayerHandProps {
  player: 'player1' | 'player2';
  cards: CardType[];
}

const PlayerHand: React.FC<PlayerHandProps> = ({ player, cards }) => {
  const { playCard, currentTurn, discardPile, currentColor, gameMode } = useGameStore();
  const topCard = discardPile[discardPile.length - 1];

  const isCardPlayable = (card: CardType) => {
    if (player !== currentTurn) return false;
    if (card.value.startsWith('wild')) {
        if (card.value === 'wild-draw-four') {
            return !cards.some(c => c.color === currentColor);
        }
        return true;
    }
    return card.color === currentColor || card.value === topCard.value;
  };

  const handleCardClick = (card: CardType) => {
    if (isCardPlayable(card)) {
      playCard(player, card);
    }
  };

  const isOpponent = player === 'player2';
  const handStyle = isOpponent
    ? "justify-center"
    : "justify-center";

  return (
    <div className={`flex ${handStyle} w-full max-w-4xl mx-auto relative h-40 items-center`}>
      {cards.map((card, index) => (
        <div
          key={card.id}
          className="absolute"
          style={{
            left: `calc(50% + ${(index - cards.length / 2) * 35}px)`,
            transform: 'translateX(-50%)',
            zIndex: index,
          }}
        >
          <Card
            card={card}
            onClick={() => handleCardClick(card)}
            isPlayable={isCardPlayable(card)}
            isHidden={isOpponent}
          />
        </div>
      ))}
    </div>
  );
};

export default PlayerHand;
