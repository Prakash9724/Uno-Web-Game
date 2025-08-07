import { create } from 'zustand';
import { Card, Color, generateDeck, shuffleDeck } from '../constants';

type Player = 'player1' | 'player2';

interface GameState {
  gameStarted: boolean;
  deck: Card[];
  players: Record<Player, Card[]>;
  discardPile: Card[];
  currentTurn: Player;
  currentColor: Color;
  winner: Player | null;
  unoCalled: Record<Player, boolean>;
  isDrawing: boolean;
  colorPickerOpen: boolean;
  messages: string[];
}

interface GameActions {
  startGame: () => void;
  playCard: (playerId: Player, card: Card) => void;
  drawCard: (playerId: Player) => void;
  callUno: (playerId: Player) => void;
  setColor: (color: Color) => void;
  resetGame: () => void;
}

const initialState: GameState = {
  gameStarted: false,
  deck: [],
  players: { player1: [], player2: [] },
  discardPile: [],
  currentTurn: 'player1',
  currentColor: 'red',
  winner: null,
  unoCalled: { player1: false, player2: false },
  isDrawing: false,
  colorPickerOpen: false,
  messages: [],
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,

  addMessage: (message: string) => {
    set((state) => ({ messages: [...state.messages.slice(-4), message] }));
  },

  startGame: () => {
    const newDeck = shuffleDeck(generateDeck());
    const player1Hand: Card[] = [];
    const player2Hand: Card[] = [];

    for (let i = 0; i < 7; i++) {
      player1Hand.push(newDeck.pop()!);
      player2Hand.push(newDeck.pop()!);
    }

    let firstCard = newDeck.pop()!;
    // Ensure the first card is not a wild draw four
    while (firstCard.value === 'wild-draw-four') {
        newDeck.push(firstCard);
        shuffleDeck(newDeck);
        firstCard = newDeck.pop()!;
    }

    set({
      gameStarted: true,
      deck: newDeck,
      players: { player1: player1Hand, player2: player2Hand },
      discardPile: [firstCard],
      currentTurn: 'player1',
      currentColor: firstCard.color || COLORS[Math.floor(Math.random() * COLORS.length)],
      winner: null,
      unoCalled: { player1: false, player2: false },
      messages: ["Game started! Player 1's turn."],
    });
  },

  playCard: (playerId, card) => {
    const { currentTurn, players, discardPile, deck, unoCalled } = get();
    if (playerId !== currentTurn) return;

    const topCard = discardPile[discardPile.length - 1];
    const currentColor = get().currentColor;

    const isValidMove = (c: Card) => {
      if (c.value.startsWith('wild')) return true;
      if (c.color === currentColor || c.value === topCard.value) return true;
      return false;
    };
    
    const isWildDrawFourPlayable = () => {
        const hand = players[playerId];
        return !hand.some(c => c.color === currentColor);
    }

    if (card.value === 'wild-draw-four' && !isWildDrawFourPlayable()) {
        get().addMessage("Cannot play Wild Draw Four. You have a card of the current color.");
        return;
    }

    if (!isValidMove(card)) return;

    const newHand = players[playerId].filter(c => c.id !== card.id);
    const newDiscardPile = [...discardPile, card];
    
    // UNO Check
    if (players[playerId].length === 2 && !unoCalled[playerId]) {
        get().addMessage(`${playerId} forgot to call UNO! Drawing 2 cards.`);
        const newCards = deck.slice(-2);
        const newDeck = deck.slice(0, -2);
        set({
            deck: newDeck,
            players: { ...players, [playerId]: [...newHand, ...newCards, card] }
        });
        // Card is returned to hand, turn does not switch
        return;
    }


    set(state => ({
        players: { ...state.players, [playerId]: newHand },
        discardPile: newDiscardPile,
        unoCalled: { ...state.unoCalled, [playerId]: false } // Reset UNO status after playing
    }));

    if (newHand.length === 0) {
      set({ winner: playerId, messages: [`${playerId} wins!`] });
      return;
    }

    // Handle card actions
    let nextTurn: Player = currentTurn === 'player1' ? 'player2' : 'player1';
    let newDeck = [...deck];

    const applyDraw = (count: number) => {
        const opponent = nextTurn;
        const cardsToDraw = newDeck.slice(-count);
        newDeck = newDeck.slice(0, -count);
        set(state => ({
            players: { ...state.players, [opponent]: [...state.players[opponent], ...cardsToDraw] },
            deck: newDeck,
        }));
        get().addMessage(`${opponent} draws ${count} cards!`);
    }

    switch (card.value) {
      case 'draw-two':
        applyDraw(2);
        nextTurn = playerId; // Skip opponent's turn
        break;
      case 'skip':
      case 'reverse': // In 2-player, reverse is a skip
        nextTurn = playerId; // Skip opponent's turn
        get().addMessage(`${nextTurn} was skipped!`);
        break;
      case 'wild':
        set({ colorPickerOpen: true });
        return; // Wait for color selection
      case 'wild-draw-four':
        applyDraw(4);
        set({ colorPickerOpen: true });
        nextTurn = playerId; // Skip opponent's turn
        return; // Wait for color selection
    }

    set({
        currentTurn: nextTurn,
        currentColor: card.color || get().currentColor,
        messages: [...get().messages, `${nextTurn}'s turn.`],
    });
  },

  drawCard: (playerId) => {
    const { currentTurn, deck, players, isDrawing } = get();
    if (playerId !== currentTurn || isDrawing) return;

    set({ isDrawing: true });

    if (deck.length === 0) {
        // Reshuffle discard pile into deck
        const newDeck = shuffleDeck(get().discardPile.slice(0, -1));
        set({ deck: newDeck, discardPile: [get().discardPile.slice(-1)[0]] });
    }

    const newCard = get().deck.pop()!;
    const newDeck = get().deck;
    const newHand = [...players[playerId], newCard];

    set(state => ({
        deck: newDeck,
        players: { ...state.players, [playerId]: newHand },
        currentTurn: state.currentTurn === 'player1' ? 'player2' : 'player1',
        isDrawing: false,
        messages: [...state.messages, `${playerId} drew a card.`, `${state.currentTurn === 'player1' ? 'player2' : 'player1'}'s turn.`]
    }));
  },

  callUno: (playerId) => {
    const { currentTurn, players } = get();
    if (playerId !== currentTurn || players[playerId].length !== 2) return;
    set(state => ({
        unoCalled: { ...state.unoCalled, [playerId]: true },
        messages: [...state.messages, `${playerId} called UNO!`]
    }));
  },

  setColor: (color) => {
    const nextTurn = get().currentTurn === 'player1' ? 'player2' : 'player1';
    set({
        currentColor: color,
        colorPickerOpen: false,
        currentTurn: nextTurn,
        messages: [...get().messages, `Color changed to ${color}.`, `${nextTurn}'s turn.`]
    });
  },

  resetGame: () => {
    set(initialState);
    get().startGame();
  },
}));

const COLORS = ['red', 'green', 'blue', 'yellow'] as const;
