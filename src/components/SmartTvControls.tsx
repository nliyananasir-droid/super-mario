import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

interface SmartTvControlsProps {
  onInputStart: (action: 'left' | 'right' | 'jump') => void;
  onInputEnd: (action: 'left' | 'right' | 'jump') => void;
  activeInputs: {
    left: boolean;
    right: boolean;
    jump: boolean;
  };
}

export const SmartTvControls: React.FC<SmartTvControlsProps> = ({
  onInputStart,
  onInputEnd,
  activeInputs,
}) => {
  return (
    <div className="w-full flex items-center justify-between px-4 sm:px-8 py-3 select-none touch-none">
      {/* LEFT / RIGHT D-PAD */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onMouseDown={() => onInputStart('left')}
          onMouseUp={() => onInputEnd('left')}
          onMouseLeave={() => onInputEnd('left')}
          onTouchStart={(e) => {
            e.preventDefault();
            onInputStart('left');
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onInputEnd('left');
          }}
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-black text-white shadow-lg active:scale-95 transition-all ${
            activeInputs.left
              ? 'bg-sky-700 ring-4 ring-sky-300 scale-95'
              : 'bg-sky-500 hover:bg-sky-600 border-b-4 border-sky-800'
          }`}
          aria-label="Bergerak ke Kiri"
        >
          <ArrowLeft className="w-8 h-8 sm:w-10 sm:h-10" />
        </button>

        <button
          type="button"
          onMouseDown={() => onInputStart('right')}
          onMouseUp={() => onInputEnd('right')}
          onMouseLeave={() => onInputEnd('right')}
          onTouchStart={(e) => {
            e.preventDefault();
            onInputStart('right');
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onInputEnd('right');
          }}
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-black text-white shadow-lg active:scale-95 transition-all ${
            activeInputs.right
              ? 'bg-sky-700 ring-4 ring-sky-300 scale-95'
              : 'bg-sky-500 hover:bg-sky-600 border-b-4 border-sky-800'
          }`}
          aria-label="Bergerak ke Kanan"
        >
          <ArrowRight className="w-8 h-8 sm:w-10 sm:h-10" />
        </button>
      </div>

      {/* JUMP BUTTON (LARGE & PROMINENT) */}
      <button
        type="button"
        onMouseDown={() => onInputStart('jump')}
        onMouseUp={() => onInputEnd('jump')}
        onMouseLeave={() => onInputEnd('jump')}
        onTouchStart={(e) => {
          e.preventDefault();
          onInputStart('jump');
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          onInputEnd('jump');
        }}
        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex flex-col items-center justify-center text-white font-black shadow-xl active:scale-95 transition-all ${
          activeInputs.jump
            ? 'bg-emerald-700 ring-4 ring-emerald-300 scale-95'
            : 'bg-emerald-500 hover:bg-emerald-600 border-b-4 border-emerald-800'
        }`}
        aria-label="Lompat"
      >
        <ArrowUp className="w-9 h-9 sm:w-11 sm:h-11" />
        <span className="text-[11px] font-extrabold uppercase tracking-wider">Lompat</span>
      </button>
    </div>
  );
};
