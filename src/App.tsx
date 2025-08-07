import GameBoard from './components/GameBoard';
import StartScreen from './components/StartScreen';
import WinnerModal from './components/WinnerModal';
import { useGameStore } from './store/gameStore';

export default function App() {
  const { gameStarted, winner } = useGameStore((state) => ({
    gameStarted: state.deck.length > 0,
    winner: state.winner,
  }));

  return (
    <main className="relative min-h-screen w-full bg-brand-background bg-[radial-gradient(#2F2F2F_1px,transparent_1px)] [background-size:24px_24px]">
      {!gameStarted ? <StartScreen /> : <GameBoard />}
      {winner && <WinnerModal />}
    </main>
  );
}
