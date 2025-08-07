import { Routes, Route, Navigate } from 'react-router-dom';
import GameBoard from '@/components/GameBoard';
import StartScreen from '@/components/StartScreen';
import RoundEndModal from '@/components/RoundEndModal';
import GameEndModal from '@/components/GameEndModal';
import SelectMode from '@/pages/SelectMode';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useGameStore } from '@/store/gameStore';

export default function App() {
  const { roundWinner, finalWinner } = useGameStore((state) => ({
    roundWinner: state.roundWinner,
    finalWinner: state.finalWinner,
  }));

  return (
    <main className="relative min-h-screen w-full bg-brand-background bg-[radial-gradient(#2F2F2F_1px,transparent_1px)] [background-size:24px_24px]">
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/select-mode" element={<SelectMode />} />
        
        <Route path="/ai" element={<ProtectedRoute><GameBoard /></ProtectedRoute>} />
        <Route path="/room" element={<ProtectedRoute><GameBoard /></ProtectedRoute>} />
        <Route path="/matchmaking" element={<ProtectedRoute><GameBoard /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global modals controlled by Zustand state */}
      {roundWinner && !finalWinner && <RoundEndModal />}
      {finalWinner && <GameEndModal />}
    </main>
  );
}
