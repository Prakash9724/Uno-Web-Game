import { Card, Color, COLORS } from '../constants';

/**
 * Determines the AI's next move.
 * Simple logic: find the first playable card. If a Wild Draw Four is the only option,
 * it checks if it's a legal move (no other cards of the current color).
 * If no cards are playable, the AI decides to draw.
 */
export const getAIMove = ({
  aiHand,
  topCard,
  currentColor,
}: {
  aiHand: Card[];
  topCard: Card;
  currentColor: Color;
}): { type: 'play'; card: Card } | { type: 'draw' } => {
  
  // Find a regular playable card first
  let playableCard = aiHand.find(card => card.color === currentColor || card.value === topCard.value);

  // If no regular card, find a regular wild card
  if (!playableCard) {
    playableCard = aiHand.find(card => card.value === 'wild');
  }

  // If still no card, check for Wild Draw Four
  if (!playableCard) {
    const canPlayWildDrawFour = !aiHand.some(c => c.color === currentColor);
    if (canPlayWildDrawFour) {
      playableCard = aiHand.find(c => c.value === 'wild-draw-four');
    }
  }

  if (playableCard) {
    return { type: 'play', card: playableCard };
  }

  return { type: 'draw' };
};

/**
 * When the AI plays a Wild card, it needs to choose a color.
 * This logic picks the color that the AI has the most of in its remaining hand.
 */
export const getBestColorForAI = (aiHand: Card[]): Color => {
  const colorCounts: Record<string, number> = {};

  aiHand.forEach(card => {
    if (card.color) {
      colorCounts[card.color] = (colorCounts[card.color] || 0) + 1;
    }
  });

  if (Object.keys(colorCounts).length === 0) {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  const bestColor = Object.keys(colorCounts).reduce((a, b) => colorCounts[a] > colorCounts[b] ? a : b);
  
  return bestColor as Color;
};
