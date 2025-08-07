import { useGameStore } from '../store/gameStore';
import PlayerHand from './PlayerHand';
import Deck from './Deck';
import DiscardPile from './DiscardPile';
import UnoButton from './UnoButton';
import ColorPicker from './ColorPicker';
import GameInfo from './GameInfo';
import Scoreboard from './Scoreboard';

const GameBoard: React.FC = () => {
  const { players, colorPickerOpen } = useGameStore();

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen w-full p-4 md:p-8 overflow-hidden">
      {colorPickerOpen && <ColorPicker />}
      
      <Scoreboard />

      {/* Corner elements */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
        <GameInfo />
      </div>
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20">
        <Deck />
      </div>

      {/* Opponent's Hand */}
      <div className="w-full flex justify-center pt-28 md:pt-24">
        <PlayerHand player="player2" cards={players.player2} />
      </div>

      {/* Center Area */}
      <div className="flex items-center justify-center gap-8 my-auto">
        <DiscardPile />
        <UnoButton />
      </div>

      {/* Player's Hand */}
      <div className="w-full flex justify-center pb-16 md:pb-0">
        <PlayerHand player="player1" cards={players.player1} />
      </div>
    </div>
  );
};

export default GameBoard;
