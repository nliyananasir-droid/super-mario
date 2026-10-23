import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, Play, Volume2 } from 'lucide-react';
import { CharacterType } from '../types/game';
import { CharacterAvatar } from './CharacterSprites';
import { sound } from '../utils/audio';
import { speakMalay } from '../utils/speech';

interface CharacterSelectionProps {
  onSelectCharacter: (char: CharacterType) => void;
  selectedCharacter: CharacterType;
}

export const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  onSelectCharacter,
  selectedCharacter,
}) => {
  const [activeChar, setActiveChar] = useState<CharacterType>(selectedCharacter);
  const [animFrame, setAnimFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimFrame((f) => (f + 1) % 60);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const handlePick = (char: CharacterType) => {
    setActiveChar(char);
    sound.playCoin();
    if (char === 'adam') {
      speakMalay('Hai! Saya Adam! Jom kita mulakan kembara moral mencari 5 kunci emas!');
    } else {
      speakMalay('Hai! Saya Aisyah! Mari kita kumpul semua kunci nilai murni bersama-sama!');
    }
  };

  const handleStart = () => {
    sound.playCheckpoint();
    onSelectCharacter(activeChar);
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-amber-100 flex flex-col items-center justify-between p-4 sm:p-8 select-none overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-6 left-10 w-32 h-14 bg-white/70 rounded-full blur-[1px] animate-pulse pointer-events-none" />
      <div className="absolute top-16 right-16 w-44 h-16 bg-white/80 rounded-full blur-[1px] pointer-events-none" />
      <div className="absolute top-28 left-1/3 w-36 h-12 bg-white/60 rounded-full blur-[1px] pointer-events-none" />

      {/* Floating Golden Coin / Stars */}
      <div className="absolute top-12 left-1/4 text-3xl animate-bounce">🪙</div>
      <div className="absolute top-20 right-1/4 text-3xl animate-bounce" style={{ animationDelay: '0.4s' }}>⭐</div>

      {/* HEADER & TITLE */}
      <div className="z-10 text-center max-w-3xl mt-2 sm:mt-4">
        <div className="inline-flex items-center gap-2 bg-amber-400/90 text-amber-950 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold shadow-md mb-2">
          <Trophy className="w-4 h-4 text-amber-800" />
          <span>Pendidikan Moral Tahun 1 Malaysia</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)] tracking-tight uppercase">
          Super Moral Adventure
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] tracking-wide mt-1">
          MISI 5 KUNCI EMAS
        </p>

        <p className="text-sm sm:text-base font-semibold text-slate-800 bg-white/70 backdrop-blur-sm px-4 py-1.5 rounded-2xl inline-block mt-3 shadow-sm">
          Pilih wira kamu untuk memulakan pengembaraan nilai murni!
        </p>
      </div>

      {/* CHARACTER CARDS */}
      <div className="z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 max-w-2xl w-full my-4">
        {/* ADAM */}
        <button
          onClick={() => handlePick('adam')}
          className={`relative flex flex-col items-center rounded-3xl p-6 transition-all duration-300 border-4 ${
            activeChar === 'adam'
              ? 'bg-gradient-to-b from-red-50 to-red-100 border-red-500 shadow-2xl scale-105 ring-4 ring-red-300'
              : 'bg-white/90 border-slate-200 hover:border-red-300 hover:scale-101 shadow-lg'
          }`}
        >
          {activeChar === 'adam' && (
            <span className="absolute -top-3.5 bg-red-600 text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Wira Pilihan
            </span>
          )}

          <div className="w-36 h-40 flex items-center justify-center my-2">
            <CharacterAvatar
              type="adam"
              state={activeChar === 'adam' ? 'victory' : 'idle'}
              size={140}
              frame={animFrame}
            />
          </div>

          <h3 className="text-2xl font-black text-slate-900 mt-2">ADAM</h3>
          <p className="text-xs sm:text-sm font-bold text-red-600 mt-1">
            Topi Merah & Baju Kasual
          </p>
          <p className="text-xs text-slate-600 text-center mt-1">
            Seorang budak lelaki yang bersemangat, ceria dan sentiasa suka membantu rakan!
          </p>

          <span className="mt-4 px-4 py-1.5 rounded-xl text-xs font-bold bg-red-500/10 text-red-700 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4" /> Suara Adam
          </span>
        </button>

        {/* AISYAH */}
        <button
          onClick={() => handlePick('aisyah')}
          className={`relative flex flex-col items-center rounded-3xl p-6 transition-all duration-300 border-4 ${
            activeChar === 'aisyah'
              ? 'bg-gradient-to-b from-pink-50 to-pink-100 border-pink-500 shadow-2xl scale-105 ring-4 ring-pink-300'
              : 'bg-white/90 border-slate-200 hover:border-pink-300 hover:scale-101 shadow-lg'
          }`}
        >
          {activeChar === 'aisyah' && (
            <span className="absolute -top-3.5 bg-pink-600 text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Wira Pilihan
            </span>
          )}

          <div className="w-36 h-40 flex items-center justify-center my-2">
            <CharacterAvatar
              type="aisyah"
              state={activeChar === 'aisyah' ? 'victory' : 'idle'}
              size={140}
              frame={animFrame}
            />
          </div>

          <h3 className="text-2xl font-black text-slate-900 mt-2">AISYAH</h3>
          <p className="text-xs sm:text-sm font-bold text-pink-600 mt-1">
            Tudung & Topi Merah Jambu
          </p>
          <p className="text-xs text-slate-600 text-center mt-1">
            Seorang budak perempuan yang berbudi bahasa, bijaksana dan penuh kasih sayang!
          </p>

          <span className="mt-4 px-4 py-1.5 rounded-xl text-xs font-bold bg-pink-500/10 text-pink-700 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4" /> Suara Aisyah
          </span>
        </button>
      </div>

      {/* START BUTTON & INSTRUCTIONS */}
      <div className="z-10 flex flex-col items-center gap-3 mb-4 w-full max-w-md">
        <button
          onClick={handleStart}
          className="w-full py-4 px-8 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-700 active:scale-95 text-white font-black text-xl sm:text-2xl rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all duration-200 border-b-4 border-emerald-800"
        >
          <Play className="w-7 h-7 fill-white" />
          <span>MULA KEMBARA!</span>
        </button>

        {/* CONTROLS GUIDE (SMART TV / KEYBOARD / TOUCH) */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-slate-200/80 text-center text-xs text-slate-700 font-semibold shadow-sm w-full">
          <span>🎮 Kawalan: <b>Anak Panah Kiri/Kanan</b> atau <b>A/D</b> untuk bergerak · <b>Spacebar / Atas</b> untuk melompat</span>
        </div>
      </div>
    </div>
  );
};
