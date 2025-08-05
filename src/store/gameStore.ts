import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Card, Color, generateDeck, shuffleDeck, calculateHandPoints, WINNING_SCORE, COLORS } from '../constants';

type Player = 'player1' | 'player2';
type GameMode = 'none' | 'ai' | 'friends' | 'random';

interface GameState {
  gameStarted: boolean;
  gameMode: GameMode;
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
  isAIThinking: boolean;
  colorPickerOpen: boolean;
  messages: string[];
}

interface GameActions {
  startGame: (mode: GameMode) => void;
  playCard: (playerId: Player, card: Card) => void;
  drawCard: (playerId: Player) => void;
  callUno: (playerId: Player) => void;
  setColor: (color: Color) => void;
  setAIThinking: (isThinking: boolean) => void;
  startNextRound: () => void;
  resetGame: () => void;
  addMessage: (message: string) => void;
}

const initialState: Omit<GameState, 'playerScores' | 'round'> = {
  gameStarted: false,
  gameMode: 'none',
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
  isAIThinking: false,
  colorPickerOpen: false,
  messages: [],
};

const setupNewRound = (set: (fn: (state: GameState) => Partial<GameState> | GameState) => void, get: () => GameState) => {
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
  const opponentName = get().gameMode === 'ai' ? 'AI' : 'Player 2';

  set(state => ({
    ...state,
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
    messages: [`Round ${get().round} started! ${startingPlayer === 'player1' ? 'Your' : `${opponentName}'s`} turn.`],
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

      startGame: (mode) => {
        set({ ...initialState, playerScores: { player1: 0, player2: 0 }, round: 1, gameMode: mode });
        setupNewRound(set, get);
      },

      playCard: (playerId, card) => {
        const { currentTurn, players, discardPile, deck, unoCalled, currentColor, gameMode } = get();
        if (playerId !== currentTurn) return;

        const topCard = discardPile[discardPile.length - 1];
        const opponentName = gameMode === 'ai' ? 'AI' : (playerId === 'player1' ? 'Player 2' : 'Player 1');
        const playerName = playerId === 'player1' ? 'You' : opponentName;

        const isValidMove = (c: Card) => {
          if (c.value.startsWith('wild')) return true;
          if (c.color === currentColor || c.value === topCard.value) return true;
          return false;
        };
        
        if (!isValidMove(card)) return;

        const newHand = players[playerId].filter(c => c.id !== card.id);

        if (newHand.length === 1 && !unoCalled[playerId]) {
          get().addMessage(`${playerName} forgot to call UNO! Drawing 2 cards.`);
          const cardsToDraw = deck.slice(-2);
          const newDeck = deck.slice(0, -2);
          set({
            deck: newDeck,
            players: { ...players, [playerId]: [...newHand, ...cardsToDraw] }
          });
          // The turn still passes after penalty
        } else {
           set(state => ({
            players: { ...state.players, [playerId]: newHand },
          }));
        }
        
        set(state => ({
          discardPile: [...state.discardPile, card],
          unoCalled: { ...state.unoCalled, [playerId]: false }
        }));

        if (get().players[playerId].length === 0) {
          const opponent = playerId === 'player1' ? 'player2' : 'player1';
          const handPoints = calculateHandPoints(get().players[opponent]);
          const newScores = {
            ...get().playerScores,
            [playerId]: get().playerScores[playerId] + handPoints,
          };

          if (newScores[playerId] >= WINNING_SCORE) {
            set({
              playerScores: newScores,
              finalWinner: playerId,
              pointsScoredThisRound: handPoints,
              messages: [...get().messages, `${playerName} won the game!`],
            });
          } else {
            set({
              playerScores: newScores,
              roundWinner: playerId,
              pointsScoredThisRound: handPoints,
              messages: [...get().messages, `${playerName} won the round!`],
            });
          }
          return;
        }

        let nextTurn: Player = currentTurn === 'player1' ? 'player2' : 'player1';
        let newDeck = [...deck];
        const nextPlayerName = nextTurn === 'player1' ? 'Your' : opponentName;

        const applyDraw = (count: number) => {
          const opponent = nextTurn;
          const cardsToDraw = newDeck.slice(-count);
          newDeck = newDeck.slice(0, -count);
          set(state => ({
            players: { ...state.players, [opponent]: [...state.players[opponent], ...cardsToDraw] },
          }));
          get().addMessage(`${opponentName} draws ${count} cards!`);
        };

        switch (card.value) {
          case 'draw-two':
            applyDraw(2);
            nextTurn = playerId;
            break;
          case 'skip':
          case 'reverse':
            nextTurn = playerId;
            get().addMessage(`${opponentName} was skipped!`);
            break;
          case 'wild':
            set({ colorPickerOpen: true });
            return; // Wait for color selection
          case 'wild-draw-four':
            applyDraw(4);
            nextTurn = playerId;
            set({ colorPickerOpen: true });
            return; // Wait for color selection
        }

        set({
          deck: newDeck,
          currentTurn: nextTurn,
          currentColor: card.color || get().currentColor,
          messages: [...get().messages, `${nextPlayerName} turn.`],
        });
      },

      drawCard: (playerId) => {
        const { currentTurn, deck, players, isDrawing, gameMode } = get();
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
        
        const playerName = playerId === 'player1' ? 'You' : 'AI';
        const nextPlayerName = nextTurn === 'player1' ? 'Your' : 'AI\'s';

        set(state => ({
          deck: currentDeck,
          players: { ...state.players, [playerId]: newHand },
          currentTurn: nextTurn,
          isDrawing: false,
          messages: [...state.messages, `${playerName} drew a card.`, `${nextPlayerName} turn.`]
        }));
      },

      callUno: (playerId) => {
        const { currentTurn, players } = get();
        if (playerId !== currentTurn || players[playerId].length !== 2) return;
        const playerName = playerId === 'player1' ? 'You' : 'AI';
        set(state => ({
          unoCalled: { ...state.unoCalled, [playerId]: true },
          messages: [...state.messages, `${playerName} called UNO!`]
        }));
      },

      setColor: (color) => {
        const { currentTurn, gameMode } = get();
        const nextTurn = currentTurn === 'player1' ? 'player2' : 'player1';
        const nextPlayerName = nextTurn === 'player1' ? 'Your' : (gameMode === 'ai' ? 'AI\'s' : 'Player 2\'s');
        
        set({
          currentColor: color,
          colorPickerOpen: false,
          currentTurn: nextTurn,
          messages: [...get().messages, `Color changed to ${color}.`, `${nextPlayerName} turn.`]
        });
      },
      
      setAIThinking: (isThinking) => set({ isAIThinking: isThinking }),

      startNextRound: () => {
        set(state => ({ round: state.round + 1 }));
        setupNewRound(set, get);
      },

      resetGame: () => {
        get().startGame('none');
      },
    }),
    {
      name: 'uno-game-storage',
      partialize: (state) => ({ playerScores: state.playerScores, round: state.round, gameMode: state.gameMode }),
    }
  )
);
