import { motion } from 'framer-motion';
import { Card as CardType, cardColorMap, cardSymbolMap } from '../constants';
import { cn } from '../lib/utils';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  className?: string;
  isPlayable?: boolean;
  isHidden?: boolean;
}

const Card: React.FC<CardProps> = ({ card, onClick, className, isPlayable, isHidden }) => {
  const { color, value } = card;
  const bgColor = color ? cardColorMap[color] : 'bg-neutral-900';
  const Symbol = cardSymbolMap[value];

  if (isHidden) {
    return (
      <div className={cn(
        "relative w-20 h-28 md:w-24 md:h-36 rounded-lg bg-brand-surface border-2 border-brand-border shadow-lg flex items-center justify-center",
        className
      )}>
        <div className="w-12 h-12 rounded-full bg-brand-primary/20 flex items-center justify-center">
          <span className="text-brand-primary font-black text-2xl">U</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layoutId={`card-${card.id}`}
      onClick={onClick}
      className={cn(
        "relative w-20 h-28 md:w-24 md:h-36 rounded-lg text-white font-black shadow-xl transition-all duration-300 ease-in-out cursor-pointer",
        bgColor,
        isPlayable ? 'hover:-translate-y-4 hover:shadow-2xl' : 'opacity-70 cursor-not-allowed',
        className
      )}
      whileHover={{ scale: isPlayable ? 1.05 : 1 }}
      whileTap={{ scale: isPlayable ? 0.95 : 1 }}
    >
      <div className="absolute top-2 left-2 text-2xl">{Symbol && <Symbol size={24} />}</div>
      <div className="absolute bottom-2 right-2 text-2xl transform rotate-180">{Symbol && <Symbol size={24} />}</div>
      <div className="flex items-center justify-center h-full text-5xl">
        {Symbol ? <Symbol size={50} /> : value}
      </div>
    </motion.div>
  );
};

export default Card;
