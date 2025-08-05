import { twMerge } from 'tailwind-merge';

interface CardBackProps {
  onClick?: () => void;
  className?: string;
}

const CardBack: React.FC<CardBackProps> = ({ onClick, className }) => {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        "relative w-28 h-40 rounded-xl bg-uno-black flex items-center justify-center shadow-lg",
        className
      )}
    >
      <div className="absolute inset-0 rounded-xl border-4 border-white/80"></div>
      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-uno-red via-uno-blue to-uno-yellow flex items-center justify-center">
        <span className="text-white font-black text-3xl italic -rotate-12">UNO</span>
      </div>
    </div>
  );
};

export default CardBack;
