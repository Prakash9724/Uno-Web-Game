import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { Card as CardType, Color, CardValue } from '../constants';
import { Ban, RefreshCw, Star } from 'lucide-react';

interface CardProps {
  card: CardType;
  isPlayable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const cardColorStyles: Record<Color | 'black', string> = {
  red: 'bg-uno-red',
  green: 'bg-uno-green',
  blue: 'bg-uno-blue',
  yellow: 'bg-uno-yellow',
  black: 'bg-uno-black',
};

const cardTextColorStyles: Record<Color, string> = {
  red: 'text-uno-red',
  green: 'text-uno-green',
  blue: 'text-uno-blue',
  yellow: 'text-uno-yellow',
};

const getCardSymbol = (value: CardValue, color?: Color) => {
  const isNumberCard = !isNaN(parseInt(value));
  const textColor = color && isNumberCard ? cardTextColorStyles[color] : 'text-white';

  switch (value) {
    case 'skip': return <Ban size={48} className="text-white" />;
    case 'reverse': return <RefreshCw size={48} className="text-white" />;
    case 'draw-two': return <div className="font-black text-5xl text-white flex items-center justify-center">+2</div>;
    case 'wild': return <Star size={48} className="text-white fill-white" />;
    case 'wild-draw-four': return <div className="font-black text-5xl text-white flex items-center justify-center">+4</div>;
    default: return <span className={twMerge("font-black text-7xl", textColor)}>{value}</span>;
  }
};

const CardComponent: React.FC<CardProps> = ({ card, isPlayable, className, style }) => {
  const { color, value } = card;
  const bgColor = color ? cardColorStyles[color] : cardColorStyles.black;
  const isNumberCard = !isNaN(parseInt(value));
  const isWild = value.startsWith('wild');
  const textColor = color && isNumberCard ? cardTextColorStyles[color] : 'text-white';

  return (
    <motion.div
      layout
      style={style}
      className={twMerge(
        "relative w-28 h-40 rounded-xl shadow-lg flex items-center justify-center transition-all duration-300",
        bgColor,
        isPlayable ? "cursor-pointer hover:shadow-2xl hover:shadow-brand-primary/50" : "opacity-80 cursor-not-allowed",
        className
      )}
    >
      <div className="absolute inset-0 rounded-xl border-4 border-white/80"></div>
      
      <div className={twMerge(
        "absolute w-[calc(100%-20px)] h-[calc(100%-40px)] transform -rotate-12 rounded-2xl",
        isWild && "bg-gradient-to-br from-uno-red via-uno-blue to-uno-yellow",
        isNumberCard && "bg-white"
      )}></div>
      
      <div className="relative z-10 flex items-center justify-center">
        {getCardSymbol(value, color)}
      </div>

      <div className={twMerge("absolute top-2 left-3 text-2xl font-black", textColor)}>
        {value.length === 1 && value}
      </div>
      <div className={twMerge("absolute bottom-2 right-3 text-2xl font-black transform rotate-180", textColor)}>
        {value.length === 1 && value}
      </div>
    </motion.div>
  );
};

export default CardComponent;
