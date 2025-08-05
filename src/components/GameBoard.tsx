import { useGameStore } from '../store/gameStore';
import PlayerHand from './PlayerHand';
import Deck from './Deck';
import DiscardPile from './DiscardPile';
import UnoButton from './UnoButton';
import ColorPicker from './ColorPicker';
import GameInfo from './GameInfo';
import Scoreboard from './Scoreboard';
import { Loader2 } from 'lucide-react';

const GameBoard: React.FC = () => {
  const { players, colorPickerOpen, gameMode, currentTurn, isAIThinking } = useGameStore();

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen w-full p-4 md:p-8 overflow-hidden">
      {colorPickerOpen && <ColorPicker />}
      
      <Scoreboard />

      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
        <GameInfo />
      </div>
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20">
        <Deck />
      </div>

      <div className="w-full flex justify-center pt-28 md:pt-24">
        <PlayerHand player="player2" cards={players.player2} />
      </div>

      <div className="flex items-center justify-center gap-8 my-auto relative">
        <DiscardPile />
        {gameMode === 'ai' && isAIThinking && currentTurn === 'player2' && (
          <div className="absolute left-full ml-6 flex items-center gap-2 bg-brand-surface/80 backdrop-blur-sm text-brand-textSecondary px-3 py-2 rounded-lg text-sm whitespace-nowrap">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>AI is thinking...</span>
          </div>
        )}
        <UnoButton />
      </div>

      <div className="w-full flex justify-center pb-16 md:pb-0">
        <PlayerHand player="player1" cards={players.player1} />
      </div>
    </div>
  );
};

export default GameBoard;
