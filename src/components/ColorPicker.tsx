import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { Color, COLORS } from '../constants';

const colorClasses: Record<Color, string> = {
  red: 'bg-uno-red hover:bg-uno-red/80',
  green: 'bg-uno-green hover:bg-uno-green/80',
  blue: 'bg-uno-blue hover:bg-uno-blue/80',
  yellow: 'bg-uno-yellow hover:bg-uno-yellow/80',
};

const ColorPicker: React.FC = () => {
  const setColor = useGameStore((state) => state.setColor);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40"
    >
      <motion.div
        initial={{ scale: 0.8, y: -50 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-brand-surface p-6 rounded-2xl shadow-2xl border border-brand-border"
      >
        <h3 className="text-2xl font-bold text-white text-center mb-4">Choose a Color</h3>
        <div className="grid grid-cols-2 gap-4">
          {COLORS.map((color) => (
            <motion.button
              key={color}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setColor(color)}
              className={`w-24 h-24 rounded-lg ${colorClasses[color]} transition-colors`}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ColorPicker;
