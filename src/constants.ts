import { v4 as uuidv4 } from 'uuid';

export const COLORS = ['red', 'green', 'blue', 'yellow'] as const;
export const VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', 'reverse', 'draw-two'] as const;
export const WILD_VALUES = ['wild', 'wild-draw-four'] as const;
export const WINNING_SCORE = 500;

export type Color = typeof COLORS[number];
export type Value = typeof VALUES[number];
export type WildValue = typeof WILD_VALUES[number];
export type CardValue = Value | WildValue;

export interface Card {
  id: string;
  color?: Color;
  value: CardValue;
}

export const generateDeck = (): Card[] => {
  const deck: Card[] = [];

  COLORS.forEach(color => {
    deck.push({ id: uuidv4(), color, value: '0' });
    for (let i = 1; i <= 9; i++) {
      deck.push({ id: uuidv4(), color, value: i.toString() as Value });
      deck.push({ id: uuidv4(), color, value: i.toString() as Value });
    }
    ['skip', 'reverse', 'draw-two'].forEach(action => {
      deck.push({ id: uuidv4(), color, value: action as Value });
      deck.push({ id: uuidv4(), color, value: action as Value });
    });
  });

  for (let i = 0; i < 4; i++) {
    deck.push({ id: uuidv4(), value: 'wild' });
    deck.push({ id: uuidv4(), value: 'wild-draw-four' });
  }

  return deck;
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Calculates points for a single card played.
 */
export const getCardPoints = (card: Card): number => {
  const value = card.value;
  if (WILD_VALUES.includes(value as WildValue)) {
    return 50;
  }
  if (['skip', 'reverse', 'draw-two'].includes(value)) {
    return 20;
  }
  const numValue = parseInt(value, 10);
  if (!isNaN(numValue)) {
    return numValue;
  }
  return 0;
};


/**
 * Calculates points from a player's remaining hand at the end of a round.
 */
export const calculateHandPoints = (cards: Card[]): number => {
  return cards.reduce((total, card) => {
    if (WILD_VALUES.includes(card.value as WildValue)) {
      return total + 50;
    }
    if (['skip', 'reverse', 'draw-two'].includes(card.value)) {
      return total + 20;
    }
    // It's a number card
    return total + parseInt(card.value, 10);
  }, 0);
};
