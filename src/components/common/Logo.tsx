import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  onClick
}) => {
  const sizeMap = {
    sm: { icon: 26, text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 34, text: 'text-2xl', sub: 'text-[10px]' },
    lg: { icon: 46, text: 'text-3xl', sub: 'text-xs' },
    xl: { icon: 60, text: 'text-5xl', sub: 'text-sm' }
  };

  const current = sizeMap[size];

  return (
    <div
      id="rnd-brand-logo"
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none cursor-pointer group transition-all duration-300 ${className}`}
    >
      {/* Abstract geometric power emblem */}
      <div 
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-black p-1.5 border border-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:border-[#D4AF37] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300"
        style={{ width: current.icon + 12, height: current.icon + 12 }}
      >
        {/* Subtle interior glow */}
        <div className="absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/20 via-transparent to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />

        <svg
          width={current.icon}
          height={current.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 transition-transform duration-300 group-hover:scale-105"
        >
          {/* Dynamic athletic power shield with lightning cut */}
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F9E29D" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#AA7C11" />
            </linearGradient>
            <linearGradient id="redAccent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF4D4D" />
              <stop offset="100%" stopColor="#CC0000" />
            </linearGradient>
          </defs>

          {/* Hexagonal power polygon */}
          <polygon
            points="50,6 88,27 88,73 50,94 12,73 12,27"
            stroke="url(#goldGrad)"
            strokeWidth="3.5"
            fill="none"
            opacity="0.85"
          />

          {/* Dynamic lightning/strength slash */}
          <path
            d="M56 18L32 52H50L44 82L68 46H50L56 18Z"
            fill="url(#goldGrad)"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
          />

          {/* High-octane red energy accent spark */}
          <circle cx="68" cy="46" r="3" fill="url(#redAccent)" />
          <polygon points="78,32 84,36 80,42" fill="url(#redAccent)" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5">
          <span 
            className={`font-black tracking-wider uppercase bg-gradient-to-r from-white via-neutral-100 to-[#D4AF37] bg-clip-text text-transparent ${current.text} leading-none font-display`}
          >
            RND
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`tracking-[0.25em] font-semibold text-neutral-400 uppercase ${current.sub}`}>
              SPORTS NUTRITION
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
