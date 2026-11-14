import React from 'react';

interface BorderBeamProps {
  colorFrom?: string;
  colorTo?: string;
  duration?: number;
  borderWidth?: number;
  className?: string;
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  colorFrom = '#00BAF2',
  colorTo = '#002970',
  duration = 6,
  borderWidth = 1.5,
  className = '',
}) => {
  return (
    <div
      style={
        {
          '--color-from': colorFrom,
          '--color-to': colorTo,
          '--duration': `${duration}s`,
          '--border-width': `${borderWidth}px`,
        } as React.CSSProperties
      }
      className={`pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)] ${className}`}
    >
      <div
        className="absolute aspect-square w-full animate-beam bg-gradient-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent"
        style={{
          width: '200%',
          left: '-50%',
          top: '-50%',
        }}
      />
    </div>
  );
};
