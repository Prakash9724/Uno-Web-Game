import GameBoard from '../components/GameBoard';
import { useAIOpponent } from '../hooks/useAIOpponent';
import { useGameStore } from '../store/gameStore';
import { Navigate } from 'react-router-dom';

const AIGame = () => {
  // This hook will automatically listen for the AI's turn and play.
  useAIOpponent();
  
  const gameStarted = useGameStore(state => state.gameStarted);

  // Redirect if the game hasn't been initialized properly
  if (!gameStarted) {
    return <Navigate to="/select-mode" replace />;
  }

  return <GameBoard />;
};

export default AIGame;
