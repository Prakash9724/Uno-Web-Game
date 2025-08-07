import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Card, Color, generateDeck, shuffleDeck, calculateHandPoints, getCardPoints, WINNING_SCORE, COLORS, CardValue } from '../constants';

type Player = 'player1' | 'player2';

interface GameState {
  gameStarted: boolean;
  deck: Card[];
  players: Record<Player, Card[]>;
  discardPile: Card[];
  currentTurn: Player;
  currentColor: Color;
  playerScores: { player1: number; player2: number };
  round: number;
  roundWinner: Player | null;
  finalWinner: Player | null;
  pointsScoredThisRound: number;
  unoCalled: Record<Player, boolean>;
  isDrawing: boolean;
  colorPickerOpen: boolean;
  messages: string[];
  lastScoreUpdate: { player: Player | null; points: number; key: number };
}

interface GameActions {
  startGame: () => void;
  playCard: (playerId: Player, card: Card) => void;
  drawCard: (playerId: Player) => void;
  callUno: (playerId: Player) => void;
  setColor: (color: Color) => void;
  startNextRound: () => void;
  resetGame: () => void;
  addMessage: (message: string) => void;
}

const initialState: Omit<GameState, 'playerScores' | 'round'> = {
  gameStarted: false,
  deck: [],
  players: { player1: [], player2: [] },
  discardPile: [],
  currentTurn: 'player1',
  currentColor: 'red',
  roundWinner: null,
  finalWinner: null,
  pointsScoredThisRound: 0,
  unoCalled: { player1: false, player2: false },
  isDrawing: false,
  colorPickerOpen: false,
  messages: [],
  lastScoreUpdate: { player: null, points: 0, key: 0 },
};

const setupNewRound = (set: (fn: (state: GameState) => Partial<GameState>) => void, get: () => GameState) => {
  const newDeck = shuffleDeck(generateDeck());
  const player1Hand: Card[] = [];
  const player2Hand: Card[] = [];

  for (let i = 0; i < 7; i++) {
    player1Hand.push(newDeck.pop()!);
    player2Hand.push(newDeck.pop()!);
  }

  let firstCard = newDeck.pop()!;
  while (firstCard.value === 'wild-draw-four') {
    newDeck.push(firstCard);
    shuffleDeck(newDeck);
    firstCard = newDeck.pop()!;
  }

  const startingPlayer = Math.random() < 0.5 ? 'player1' : 'player2';

  set(state => ({
    gameStarted: true,
    deck: newDeck,
    players: { player1: player1Hand, player2: player2Hand },
    discardPile: [firstCard],
    currentTurn: startingPlayer,
    currentColor: firstCard.color || COLORS[Math.floor(Math.random() * COLORS.length)],
    roundWinner: null,
    finalWinner: null,
    pointsScoredThisRound: 0,
    unoCalled: { player1: false, player2: false },
    colorPickerOpen: false,
    messages: [`Round ${get().round} started! ${startingPlayer}'s turn.`],
  }));
};

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      playerScores: { player1: 0, player2: 0 },
      round: 1,

      addMessage: (message: string) => {
        set((state) => ({ messages: [...state.messages.slice(-4), message] }));
      },

      startGame: () => {
        set({ ...initialState, playerScores: { player1: 0, player2: 0 }, round: 1 });
        setupNewRound(set, get);
      },

      playCard: (playerId, card) => {
        const { currentTurn, players, discardPile, deck, unoCalled, currentColor } = get();
        if (playerId !== currentTurn) return;

        const topCard = discardPile[discardPile.length - 1];

        const isValidMove = (c: Card) => {
          if (c.value.startsWith('wild')) return true;
          if (c.color === currentColor || c.value === topCard.value) return true;
          return false;
        };

        const isWildDrawFourPlayable = () => !players[playerId].some(c => c.color === currentColor);

        if (card.value === 'wild-draw-four' && !isWildDrawFourPlayable()) {
          get().addMessage("Cannot play Wild Draw Four. You have a card of the current color.");
          return;
        }

        if (!isValidMove(card)) return;

        const newHand = players[playerId].filter(c => c.id !== card.id);

        if (newHand.length === 1 && !unoCalled[playerId]) {
          get().addMessage(`${playerId} forgot to call UNO! Drawing 2 cards.`);
          const cardsToDraw = deck.slice(-2);
          const newDeck = deck.slice(0, -2);
          set({
            deck: newDeck,
            players: { ...players, [playerId]: [...newHand, ...cardsToDraw] }
          });
          return;
        }
        
        // Real-time scoring
        const points = getCardPoints(card);
        const newScores = {
            ...get().playerScores,
            [playerId]: get().playerScores[playerId] + points,
        };

        set(state => ({
          playerScores: newScores,
          lastScoreUpdate: { player: playerId, points, key: Date.now() },
          players: { ...state.players, [playerId]: newHand },
          discardPile: [...state.discardPile, card],
          unoCalled: { ...state.unoCalled, [playerId]: false }
        }));

        if (newHand.length === 0) {
          const opponent = playerId === 'player1' ? 'player2' : 'player1';
          const handPoints = calculateHandPoints(get().players[opponent]);
          const finalScores = {
            ...get().playerScores,
            [playerId]: get().playerScores[playerId] + handPoints,
          };

          if (finalScores[playerId] >= WINNING_SCORE) {
            set({
              playerScores: finalScores,
              finalWinner: playerId,
              pointsScoredThisRound: handPoints,
              messages: [...get().messages, `${playerId} wins the game!`],
            });
          } else {
            set({
              playerScores: finalScores,
              roundWinner: playerId,
              pointsScoredThisRound: handPoints,
              messages: [...get().messages, `${playerId} wins the round!`],
            });
          }
          return;
        }

        let nextTurn: Player = currentTurn === 'player1' ? 'player2' : 'player1';
        let newDeck = [...deck];

        const applyDraw = (count: number) => {
          const opponent = nextTurn;
          const cardsToDraw = newDeck.slice(-count);
          newDeck = newDeck.slice(0, -count);
          set(state => ({
            players: { ...state.players, [opponent]: [...state.players[opponent], ...cardsToDraw] },
          }));
          get().addMessage(`${opponent} draws ${count} cards!`);
        };

        switch (card.value) {
          case 'draw-two':
            applyDraw(2);
            nextTurn = playerId;
            break;
          case 'skip':
          case 'reverse':
            nextTurn = playerId;
            get().addMessage(`${currentTurn === 'player1' ? 'player2' : 'player1'} was skipped!`);
            break;
          case 'wild':
            set({ colorPickerOpen: true });
            return;
          case 'wild-draw-four':
            applyDraw(4);
            nextTurn = playerId;
            set({ colorPickerOpen: true });
            return;
        }

        set({
          deck: newDeck,
          currentTurn: nextTurn,
          currentColor: card.color || get().currentColor,
          messages: [...get().messages, `${nextTurn}'s turn.`],
        });
      },

      drawCard: (playerId) => {
        const { currentTurn, deck, players, isDrawing } = get();
        if (playerId !== currentTurn || isDrawing) return;

        set({ isDrawing: true });

        let currentDeck = [...deck];
        if (currentDeck.length === 0) {
          const newShuffledDeck = shuffleDeck(get().discardPile.slice(0, -1));
          set({ discardPile: [get().discardPile.slice(-1)[0]] });
          currentDeck = newShuffledDeck;
        }

        const newCard = currentDeck.pop()!;
        const newHand = [...players[playerId], newCard];
        const nextTurn = currentTurn === 'player1' ? 'player2' : 'player1';

        set(state => ({
          deck: currentDeck,
          players: { ...state.players, [playerId]: newHand },
          currentTurn: nextTurn,
          isDrawing: false,
          messages: [...state.messages, `${playerId} drew a card.`, `${nextTurn}'s turn.`]
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
          currentTurn: get().currentTurn, // Turn was already skipped by wild card
          messages: [...get().messages, `Color changed to ${color}.`, `${nextTurn}'s turn.`]
        });
      },

      startNextRound: () => {
        set(state => ({ round: state.round + 1 }));
        setupNewRound(set, get);
      },

      resetGame: () => {
        get().startGame();
      },
    }),
    {
      name: 'uno-game-storage',
      partialize: (state) => ({ playerScores: state.playerScores, round: state.round }),
    }
  )
);
