import React from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, RotateCcw, X, GraduationCap, Users } from 'lucide-react';
import { CharacterType } from '../types/game';
import { LEVELS } from '../data/levels';

interface TeacherMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevelId: number;
  onSelectLevel: (lvlId: number) => void;
  onRestartLevel: () => void;
  onSwitchCharacter: () => void;
  currentCharacter: CharacterType;
  isMuted: boolean;
  onToggleMute: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const TeacherMenu: React.FC<TeacherMenuProps> = ({
  isOpen,
  onClose,
  currentLevelId,
  onSelectLevel,
  onRestartLevel,
  onSwitchCharacter,
  currentCharacter,
  isMuted,
  onToggleMute,
  isFullscreen,
  onToggleFullscreen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-sky-500 overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-700 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-7 h-7 text-yellow-300" />
            <div>
              <h2 className="text-xl font-black">Menu Guru & Bilik Darjah</h2>
              <p className="text-xs text-sky-100 font-medium">
                Pendidikan Moral KSSR Semakan Tahun 1
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* QUICK LEVEL SELECT (TEACHER DEMONSTRATION MODE) */}
          <div>
            <label className="text-xs font-black tracking-wider text-slate-500 uppercase block mb-2">
              Pilihan Tahap Pembelajaran (Pilih Cepat untuk Mengajar)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {LEVELS.map((lvl) => {
                const isActive = lvl.id === currentLevelId;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => {
                      onSelectLevel(lvl.id);
                      onClose();
                    }}
                    className={`p-3 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                      isActive
                        ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-200'
                        : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-extrabold text-sky-700 block">
                        Tahap {lvl.id}
                      </span>
                      <span className="text-sm font-black text-slate-900 block">
                        Nilai {lvl.moralValue}
                      </span>
                    </div>
                    {isActive && (
                      <span className="text-xs bg-sky-600 text-white font-bold px-2 py-0.5 rounded-lg">
                        Sedang Main
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CLASSROOM ACTIONS & CONTROLS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Fullscreen */}
            <button
              onClick={onToggleFullscreen}
              className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-slate-700 font-bold text-xs"
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5 text-sky-600" />
              ) : (
                <Maximize2 className="w-5 h-5 text-sky-600" />
              )}
              <span>{isFullscreen ? 'Kecilkan Skrin' : 'Skrin Penuh (TV)'}</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={onToggleMute}
              className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-slate-700 font-bold text-xs"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-rose-600" />
              ) : (
                <Volume2 className="w-5 h-5 text-emerald-600" />
              )}
              <span>{isMuted ? 'Buka Suara' : 'Senyapkan'}</span>
            </button>

            {/* Restart Level */}
            <button
              onClick={() => {
                onRestartLevel();
                onClose();
              }}
              className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-slate-700 font-bold text-xs"
            >
              <RotateCcw className="w-5 h-5 text-amber-600" />
              <span>Mula Semula Tahap</span>
            </button>

            {/* Switch Character */}
            <button
              onClick={() => {
                onSwitchCharacter();
                onClose();
              }}
              className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-slate-700 font-bold text-xs"
            >
              <Users className="w-5 h-5 text-purple-600" />
              <span>Tukar Wira ({currentCharacter.toUpperCase()})</span>
            </button>
          </div>

          {/* PEDAGOGICAL TIPS FOR TEACHER */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-1">
            <p className="font-bold text-sm text-amber-900">
              💡 Panduan Guru di Bilik Darjah:
            </p>
            <p>
              • Setiap tahap memfokuskan kepada satu <b>Nilai Murni Utama</b> dalam silibus Tahun 1.
            </p>
            <p>
              • Murid perlu melompat dan mengetuk blok bertanda <b>[?]</b> untuk menjawab soalan bergambar sebelum pintu pagar emas boleh dibuka.
            </p>
            <p>
              • Sambungkan komputer riba ke Smart TV atau projektor 16:9 untuk paparan kelas yang jelas.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-slate-100 px-6 py-3 flex justify-end border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-95"
          >
            Sambung Permainan
          </button>
        </div>
      </div>
    </div>
  );
};
