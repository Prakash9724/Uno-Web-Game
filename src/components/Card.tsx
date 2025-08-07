import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { Card as CardType, Color } from '../constants';
import { Ban, RefreshCw, Plus, Star } from 'lucide-react';

interface CardProps {
  card: CardType;
  isPlayable?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const cardColorStyles: Record<Color | 'black', string> = {
  red: 'bg-uno-red text-white',
  green: 'bg-uno-green text-white',
  blue: 'bg-uno-blue text-white',
  yellow: 'bg-uno-yellow text-black',
  black: 'bg-uno-black text-white',
};

const getCardSymbol = (value: CardType['value']) => {
  switch (value) {
    case 'skip': return <Ban size={48} className="text-white" />;
    case 'reverse': return <RefreshCw size={48} className="text-white" />;
    case 'draw-two': return <div className="font-black text-4xl text-white flex items-center justify-center">+2</div>;
    case 'wild': return <Star size={48} className="text-white fill-white" />;
    case 'wild-draw-four': return <div className="font-black text-4xl text-white flex items-center justify-center">+4</div>;
    default: return <span className="font-black text-6xl">{value}</span>;
  }
};

const CardComponent: React.FC<CardProps> = ({ card, isPlayable, onClick, className, style }) => {
  const { color, value } = card;
  const bgColor = color ? cardColorStyles[color] : cardColorStyles.black;

  const isWild = value.startsWith('wild');

  return (
    <motion.div
      layoutId={card.id}
      onClick={onClick}
      style={style}
      className={twMerge(
        "relative w-28 h-40 rounded-xl shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300",
        bgColor,
        isPlayable && "hover:-translate-y-4 hover:shadow-2xl",
        !isPlayable && "opacity-70 cursor-not-allowed",
        className
      )}
    >
      <div className="absolute inset-0 rounded-xl border-4 border-white/80"></div>
      <div className={twMerge(
        "absolute w-[calc(100%-24px)] h-[calc(100%-48px)] rounded-md",
        isWild ? "bg-gradient-to-br from-uno-red via-uno-blue to-uno-yellow" : "bg-white"
      )}></div>
      
      <div className="relative z-10 flex items-center justify-center">
        {getCardSymbol(value)}
      </div>

      <div className="absolute top-2 left-3 text-2xl font-black">
        {value.length === 1 && value}
      </div>
      <div className="absolute bottom-2 right-3 text-2xl font-black transform rotate-180">
        {value.length === 1 && value}
      </div>
    </motion.div>
  );
};

export default CardComponent;
