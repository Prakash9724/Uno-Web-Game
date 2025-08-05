import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { getAIMove, getBestColorForAI } from '../lib/ai';

/**
 * This hook manages the AI opponent's turn.
 * It listens to the game state and when it's the AI's turn, it
 * simulates "thinking" and then executes the best move.
 */
export const useAIOpponent = () => {
  const {
    gameMode,
    currentTurn,
    players,
    discardPile,
    currentColor,
    gameStarted,
    finalWinner,
    playCard,
    drawCard,
    setColor,
    setAIThinking,
  } = useGameStore();

  useEffect(() => {
    if (gameMode !== 'ai' || currentTurn !== 'player2' || !gameStarted || finalWinner) {
      return;
    }

    const performAITurn = () => {
      const aiHand = players.player2;
      const topCard = discardPile[discardPile.length - 1];

      const move = getAIMove({ aiHand, topCard, currentColor });

      if (move.type === 'draw') {
        drawCard('player2');
      } else {
        const cardToPlay = move.card;
        playCard('player2', cardToPlay);

        // If a wild card was played, the turn doesn't pass automatically.
        // The AI must now choose a color to continue the game.
        if (cardToPlay.value.startsWith('wild')) {
          const bestColor = getBestColorForAI(players.player2.filter(c => c.id !== cardToPlay.id));
          // A small delay to make the color choice feel deliberate
          setTimeout(() => {
            setColor(bestColor);
          }, 500);
        }
      }
      setAIThinking(false);
    };

    setAIThinking(true);
    const timer = setTimeout(performAITurn, 1500); // AI "thinking" delay

    return () => clearTimeout(timer);

  }, [currentTurn, gameMode, gameStarted, finalWinner, discardPile.length]); // re-run if discard pile changes on our turn
};
