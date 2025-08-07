import { v4 as uuidv4 } from 'uuid';

export const COLORS = ['red', 'green', 'blue', 'yellow'] as const;
export const VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', 'reverse', 'draw-two'] as const;
export const WILD_VALUES = ['wild', 'wild-draw-four'] as const;

export type Color = typeof COLORS[number];
export type Value = typeof VALUES[number];
export type WildValue = typeof WILD_VALUES[number];
export type CardType = Value | WildValue;

export interface Card {
  id: string;
  color?: Color;
  value: CardType;
}

export const generateDeck = (): Card[] => {
  const deck: Card[] = [];

  COLORS.forEach(color => {
    // One '0' card
    deck.push({ id: uuidv4(), color, value: '0' });
    // Two of each number 1-9
    for (let i = 1; i <= 9; i++) {
      deck.push({ id: uuidv4(), color, value: i.toString() as Value });
      deck.push({ id: uuidv4(), color, value: i.toString() as Value });
    }
    // Two of each action card
    ['skip', 'reverse', 'draw-two'].forEach(action => {
      deck.push({ id: uuidv4(), color, value: action as Value });
      deck.push({ id: uuidv4(), color, value: action as Value });
    });
  });

  // Four of each wild card
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
