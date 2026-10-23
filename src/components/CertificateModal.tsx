import React, { useState } from 'react';
import { X, Printer, Award, Sparkles } from 'lucide-react';
import { CharacterType } from '../types/game';
import { CharacterAvatar } from './CharacterSprites';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: CharacterType;
  score: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  character,
  score,
}) => {
  const [studentName, setStudentName] = useState('MURID TAHUN 1');
  const [className, setClassName] = useState('1 BESTARI');
  const currentDate = new Date().toLocaleDateString('ms-MY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      {/* Container with print utility styles */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border-4 border-amber-400 my-auto">
        {/* NON-PRINT HEADER ACTIONS */}
        <div className="print:hidden bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-200" />
            <h3 className="font-black text-lg sm:text-xl">
              Sijil Penghargaan Wira Nilai Murni
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white text-amber-900 hover:bg-amber-50 font-black rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-black/10 hover:bg-black/20 flex items-center justify-center"
              aria-label="Tutup"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* PRINT FORM EDIT CONTROLS (HIDDEN DURING PRINT) */}
        <div className="print:hidden bg-amber-50 border-b border-amber-200 px-6 py-3 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Nama Murid:</span>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="px-3 py-1 rounded-lg border border-slate-300 font-bold uppercase text-slate-800 bg-white"
              placeholder="Masukkan nama murid"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Kelas:</span>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="px-3 py-1 rounded-lg border border-slate-300 font-bold uppercase text-slate-800 bg-white w-32"
              placeholder="Contoh: 1 Amanah"
            />
          </div>
        </div>

        {/* ================= ACTUAL PRINTABLE CERTIFICATE ================= */}
        <div className="p-8 sm:p-12 bg-[#FCFAF2] text-slate-900 border-8 border-double border-amber-500 m-4 rounded-2xl relative select-none">
          {/* Watermark / Corner Ornaments */}
          <div className="absolute top-4 left-4 text-amber-400 text-3xl font-serif">❦</div>
          <div className="absolute top-4 right-4 text-amber-400 text-3xl font-serif">❦</div>
          <div className="absolute bottom-4 left-4 text-amber-400 text-3xl font-serif">❦</div>
          <div className="absolute bottom-4 right-4 text-amber-400 text-3xl font-serif">❦</div>

          {/* Ministry / Syllabus Header */}
          <div className="text-center space-y-1 mb-6">
            <p className="text-xs font-black tracking-widest text-amber-800 uppercase">
              Kementerian Pendidikan Malaysia · Kurikulum Standard Sekolah Rendah (KSSR)
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-amber-900 tracking-tight font-serif uppercase">
              Sijil Wira Nilai Murni
            </h2>
            <p className="text-sm font-bold text-amber-700">
              Super Moral Adventure — Misi 5 Kunci Emas
            </p>
          </div>

          {/* Certificate Body Text */}
          <div className="text-center space-y-4 max-w-2xl mx-auto my-4">
            <p className="text-sm text-slate-600 italic">
              Dengan ini diperakui bahawa murid berikut:
            </p>

            <div className="border-b-2 border-amber-600 pb-2 inline-block min-w-[280px]">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-wide uppercase">
                {studentName || 'NAMA MURID'}
              </h3>
            </div>

            <p className="text-xs font-bold text-slate-700">
              Kelas: <span className="uppercase text-amber-800">{className}</span>
            </p>

            <p className="text-sm leading-relaxed text-slate-800">
              Telah berjaya menamatkan kesemua 5 cabaran platformer dan menguasai 5 Nilai Murni utama Tahun 1:
            </p>

            {/* 5 Moral Value Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 py-2">
              {['HORMAT', 'JUJUR', 'TOLERANSI', 'TANGGUNGJAWAB', 'BERTERIMA KASIH'].map((val, idx) => (
                <span
                  key={val}
                  className="px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 rounded-full text-xs font-extrabold flex items-center gap-1 shadow-sm"
                >
                  <span>🔑</span> {idx + 1}. {val}
                </span>
              ))}
            </div>

            <p className="text-xs text-slate-600">
              Jumlah Mata Terkumpul: <b className="text-amber-800">{score} Mata</b> · Status: <b className="text-emerald-700">LULUS DENGAN CEMERLANG</b>
            </p>
          </div>

          {/* Footer Seals & Character Artwork */}
          <div className="mt-8 pt-6 border-t border-amber-200/80 flex items-end justify-between px-4 sm:px-8">
            {/* Left: Chosen Character Avatar Stamp */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-20">
                <CharacterAvatar type={character} state="victory" size={70} />
              </div>
              <span className="text-[10px] font-black uppercase text-slate-600 mt-1">
                Wira: {character.toUpperCase()}
              </span>
            </div>

            {/* Center: Golden Medal Emboss */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 p-1 shadow-lg flex items-center justify-center">
                <div className="w-full h-full rounded-full border-2 border-dashed border-amber-800 flex items-center justify-center text-center">
                  <Sparkles className="w-8 h-8 text-amber-900" />
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-amber-900 mt-1 uppercase tracking-wider">
                METERAI EMAS
              </span>
            </div>

            {/* Right: Signature Line */}
            <div className="flex flex-col items-center text-center">
              <div className="w-36 border-b-2 border-slate-700 h-8 mb-1 flex items-end justify-center">
                <span className="text-xs font-serif text-slate-400 italic">Tandatangan Guru</span>
              </div>
              <span className="text-[11px] font-bold text-slate-800">Guru Pendidikan Moral</span>
              <span className="text-[10px] text-slate-500">Tarikh: {currentDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
