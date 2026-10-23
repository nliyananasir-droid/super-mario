import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, RotateCcw, Printer, Award, Heart, CheckCircle2 } from 'lucide-react';
import { CharacterType } from '../types/game';
import { CharacterAvatar } from './CharacterSprites';
import { sound } from '../utils/audio';
import { speakMalay } from '../utils/speech';

interface TreasureRoomProps {
  character: CharacterType;
  score: number;
  onReplay: () => void;
  onOpenCertificate: () => void;
}

export const TreasureRoom: React.FC<TreasureRoomProps> = ({
  character,
  score,
  onReplay,
  onOpenCertificate,
}) => {
  const [isChestOpen, setIsChestOpen] = useState(false);
  const [animFrame, setAnimFrame] = useState(0);

  useEffect(() => {
    sound.playVictoryMusic();
    speakMalay(
      'Syabas dan tahniah! Kamu telah berjaya mengumpul kesemua lima kunci emas dan dinobatkan sebagai Wira Nilai Murni!'
    );

    const timer = setInterval(() => {
      setAnimFrame((f) => (f + 1) % 60);
    }, 50);

    // Auto-open chest after 1 second for cinematic reveal
    const chestTimer = setTimeout(() => {
      setIsChestOpen(true);
      sound.playKeyCollect();
    }, 900);

    return () => {
      clearInterval(timer);
      clearTimeout(chestTimer);
    };
  }, []);

  const moralValuesList = [
    {
      num: 1,
      title: 'HORMAT',
      desc: 'Menghormati guru, ibu bapa dan rakan-rakan',
      icon: '🤝',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      num: 2,
      title: 'JUJUR',
      desc: 'Bercakap benar dan memulangkan hak orang lain',
      icon: '💎',
      color: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      num: 3,
      title: 'TOLERANSI',
      desc: 'Bersabar, bertolak ansur dan berkongsi',
      icon: '🌈',
      color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    },
    {
      num: 4,
      title: 'TANGGUNGJAWAB',
      desc: 'Menjaga kebersihan bilik darjah dan sekolah',
      icon: '🌱',
      color: 'bg-sky-100 text-sky-800 border-sky-300',
    },
    {
      num: 5,
      title: 'BERTERIMA KASIH',
      desc: 'Sentiasa menghargai jasa dan bantuan rakan',
      icon: '💖',
      color: 'bg-rose-100 text-rose-800 border-rose-300',
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-purple-900 via-indigo-900 to-amber-950 flex flex-col items-center justify-between p-4 sm:p-8 select-none overflow-x-hidden">
      {/* Sparkle background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/4 text-4xl animate-bounce">✨</div>
        <div className="absolute top-16 right-1/4 text-3xl animate-bounce" style={{ animationDelay: '0.3s' }}>⭐</div>
        <div className="absolute top-32 left-10 text-4xl animate-pulse">🌟</div>
        <div className="absolute top-40 right-10 text-3xl animate-pulse" style={{ animationDelay: '0.5s' }}>✨</div>
      </div>

      {/* HEADER BANNER */}
      <div className="z-10 text-center max-w-2xl mt-2 sm:mt-4">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-yellow-400 text-yellow-950 text-xs sm:text-sm font-black shadow-lg mb-2">
          <Trophy className="w-4 h-4 text-amber-900" /> Kemenangan Mutlak!
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] tracking-tight">
          DEWAN PERMATA NILAI MURNI
        </h1>
        <p className="text-amber-300 text-sm sm:text-lg font-bold mt-1">
          Kesemua 5 Kunci Emas Telah Berjaya Dikumpulkan!
        </p>
      </div>

      {/* 5 FLOATING GOLDEN KEYS */}
      <div className="z-10 flex items-center justify-center gap-3 sm:gap-6 my-4 flex-wrap">
        {[1, 2, 3, 4, 5].map((k) => (
          <div
            key={k}
            className="flex flex-col items-center gap-1 bg-amber-400/20 backdrop-blur-md border-2 border-amber-300 p-3 rounded-2xl shadow-xl transform hover:scale-105 transition-all"
          >
            <div className="text-3xl sm:text-4xl animate-bounce" style={{ animationDelay: `${k * 0.15}s` }}>
              🔑
            </div>
            <span className="text-[11px] font-black text-amber-200">Kunci {k}</span>
          </div>
        ))}
      </div>

      {/* CENTER: TREASURE CHEST & MEDAL REVEAL */}
      <div className="z-10 relative flex flex-col items-center my-4">
        {/* Glow Halo */}
        <div className="absolute -inset-10 bg-amber-400/20 rounded-full blur-2xl animate-pulse pointer-events-none" />

        {/* The Medallion Rising From Chest */}
        {isChestOpen && (
          <div className="animate-bounce flex flex-col items-center mb-2 z-20">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-yellow-500 via-amber-300 to-yellow-600 p-2 shadow-2xl border-4 border-yellow-200 flex items-center justify-center">
              <div className="w-full h-full rounded-full border-2 border-dashed border-amber-900 flex flex-col items-center justify-center text-center p-2">
                <Award className="w-10 h-10 sm:w-14 sm:h-14 text-amber-950" />
                <span className="text-[10px] sm:text-xs font-black text-amber-950 uppercase tracking-tighter mt-0.5">
                  WIRA MORAL
                </span>
              </div>
            </div>
            <span className="mt-2 px-4 py-1 rounded-full bg-yellow-400 text-amber-950 text-xs sm:text-sm font-black shadow-lg">
              PINGAT WIRA NILAI MURNI TAHUN 1
            </span>
          </div>
        )}

        {/* Golden Treasure Chest SVG */}
        <div
          onClick={() => {
            setIsChestOpen(!isChestOpen);
            sound.playBlockHit();
          }}
          className="cursor-pointer transition-transform active:scale-95 z-10"
          title="Klik Peti Emas!"
        >
          <svg viewBox="0 0 200 130" className="w-52 sm:w-64 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
            {/* Chest Base */}
            <path
              d="M 20 50 L 180 50 L 170 120 L 30 120 Z"
              fill="#B45309"
              stroke="#78350F"
              strokeWidth="4"
            />
            {/* Chest Gold Straps */}
            <rect x="45" y="50" width="16" height="70" fill="#FBBF24" stroke="#92400E" strokeWidth="2" />
            <rect x="139" y="50" width="16" height="70" fill="#FBBF24" stroke="#92400E" strokeWidth="2" />

            {/* Chest Lid */}
            {isChestOpen ? (
              // Open lid tilted back with glowing light
              <g>
                <path
                  d="M 15 50 L 185 50 L 175 10 C 140 0 60 0 25 10 Z"
                  fill="#D97706"
                  stroke="#78350F"
                  strokeWidth="4"
                  transform="rotate(-25, 100, 50)"
                />
                {/* Golden Rays beam */}
                <polygon points="100,50 30,0 170,0" fill="rgba(253, 224, 71, 0.4)" />
              </g>
            ) : (
              // Closed lid
              <path
                d="M 15 50 L 185 50 L 175 20 C 140 10 60 10 25 20 Z"
                fill="#D97706"
                stroke="#78350F"
                strokeWidth="4"
              />
            )}

            {/* Golden Keyhole Plate */}
            <circle cx="100" cy="65" r="14" fill="#FDE047" stroke="#78350F" strokeWidth="2" />
            <circle cx="100" cy="63" r="4" fill="#78350F" />
            <polygon points="98,63 102,63 104,72 96,72" fill="#78350F" />
          </svg>
        </div>

        {/* Celebrating Hero Avatar */}
        <div className="flex items-center gap-3 mt-2">
          <div className="w-20 h-24">
            <CharacterAvatar type={character} state="victory" size={90} frame={animFrame} />
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg border-2 border-yellow-400">
            <p className="text-xs font-black text-slate-800">
              Wira {character === 'adam' ? 'Adam' : 'Aisyah'} Berjaya!
            </p>
            <p className="text-xs text-amber-700 font-bold">
              Markah Keseluruhan: {score} Mata 🌟
            </p>
          </div>
        </div>
      </div>

      {/* 5 LEARNED VALUES OVERVIEW CARDS */}
      <div className="z-10 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-5 gap-2.5 my-2">
        {moralValuesList.map((val) => (
          <div
            key={val.num}
            className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center shadow-md bg-white/95 backdrop-blur-sm`}
          >
            <span className="text-2xl mb-1">{val.icon}</span>
            <span className="text-xs font-black text-slate-900 tracking-tight">
              {val.num}. {val.title}
            </span>
            <span className="text-[10px] text-slate-600 font-medium leading-tight mt-1">
              {val.desc}
            </span>
          </div>
        ))}
      </div>

      {/* ACTION BUTTONS (REPLAY & PRINT CERTIFICATE) */}
      <div className="z-10 flex flex-wrap items-center justify-center gap-4 my-4 w-full max-w-lg">
        <button
          onClick={onOpenCertificate}
          className="flex-1 py-3.5 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl flex items-center justify-center gap-2 border-b-4 border-amber-800 transition-all active:scale-95"
        >
          <Printer className="w-5 h-5" />
          <span>CETAK SIJIL PENGHARGAAN</span>
        </button>

        <button
          onClick={onReplay}
          className="flex-1 py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl flex items-center justify-center gap-2 border-b-4 border-emerald-800 transition-all active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
          <span>MAIN SEMULA</span>
        </button>
      </div>
    </div>
  );
};
