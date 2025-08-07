import { useGameStore } from '../store/gameStore';
import PlayerHand from './PlayerHand';
import Deck from './Deck';
import DiscardPile from './DiscardPile';
import UnoButton from './UnoButton';
import ColorPicker from './ColorPicker';
import GameInfo from './GameInfo';

const GameBoard: React.FC = () => {
  const { players, colorPickerOpen } = useGameStore();

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen w-full p-4 md:p-8 overflow-hidden">
      {colorPickerOpen && <ColorPicker />}
      
      {/* Opponent's Hand */}
      <div className="w-full">
        <PlayerHand player="player2" cards={players.player2} />
      </div>

      {/* Center Area */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 my-8 w-full">
        <GameInfo />
        <Deck />
        <DiscardPile />
        <UnoButton />
      </div>

      {/* Player's Hand */}
      <div className="w-full">
        <PlayerHand player="player1" cards={players.player1} />
      </div>
    </div>
  );
};

export default GameBoard;
