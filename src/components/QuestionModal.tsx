import React, { useEffect, useState } from 'react';
import { Volume2, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { QuestionData, QuestionOption } from '../types/game';
import { sound } from '../utils/audio';
import { speakMalay } from '../utils/speech';

interface QuestionModalProps {
  question: QuestionData;
  onCorrect: () => void;
  onClose?: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  onCorrect,
}) => {
  const [selectedOption, setSelectedOption] = useState<QuestionOption | null>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Play audio prompt when modal appears
  useEffect(() => {
    playPromptVoice();
    
    // Keyboard shortcuts (1 or 2, A or B)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (feedbackState === 'correct') return;
      if (e.key === '1' || e.key.toLowerCase() === 'a') {
        handleSelect(question.options[0]);
      } else if (e.key === '2' || e.key.toLowerCase() === 'b') {
        handleSelect(question.options[1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question, feedbackState]);

  const playPromptVoice = () => {
    setIsSpeaking(true);
    speakMalay(question.audioPrompt, () => {
      setIsSpeaking(false);
    });
  };

  const handleSelect = (option: QuestionOption) => {
    setSelectedOption(option);

    if (option.isCorrect) {
      sound.playCorrect();
      setFeedbackState('correct');
      speakMalay(option.feedback);

      // Give child 1.8 seconds to celebrate before returning to game
      setTimeout(() => {
        onCorrect();
      }, 1900);
    } else {
      sound.playWrong();
      setFeedbackState('wrong');
      speakMalay(option.feedback);
    }
  };

  const handleRetry = () => {
    setFeedbackState('idle');
    setSelectedOption(null);
    playPromptVoice();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden flex flex-col max-h-[92vh]">
        {/* HEADER BAR */}
        <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-amber-500 text-white font-black text-xl flex items-center justify-center shadow-inner">
              ?
            </span>
            <div>
              <span className="text-xs font-bold tracking-wider text-amber-900 uppercase">
                Cabaran Nilai Murni
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {question.moralValue}
              </h2>
            </div>
          </div>

          <button
            onClick={playPromptVoice}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm ${
              isSpeaking
                ? 'bg-amber-600 text-white scale-95 ring-2 ring-white'
                : 'bg-white text-amber-900 hover:bg-amber-50 active:scale-95'
            }`}
            title="Dengar Arahan Suara"
          >
            <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-bounce' : ''}`} />
            <span className="hidden sm:inline">Dengar Suara</span>
          </button>
        </div>

        {/* SITUATION PROMPT (1 SHORT SENTENCE FOR 7-YEAR-OLDS) */}
        <div className="bg-amber-50/70 border-b border-amber-200/80 px-6 py-3 text-center">
          <p className="text-base sm:text-xl font-bold text-slate-800">
            {question.situation}
          </p>
          <p className="text-xs text-amber-800 font-semibold mt-0.5">
            Pilih tindakan yang paling bermoral dan berakhlak mulia:
          </p>
        </div>

        {/* 2 ILLUSTRATED CHOICES */}
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 flex-1 overflow-y-auto">
          {question.options.map((option, idx) => {
            const isSelected = selectedOption?.id === option.id;
            const isCardWrong = isSelected && feedbackState === 'wrong';
            const isCardCorrect = isSelected && feedbackState === 'correct';

            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option)}
                disabled={feedbackState === 'correct'}
                className={`group relative text-left rounded-2xl border-4 p-4 transition-all duration-200 flex flex-col items-center justify-between ${
                  isCardCorrect
                    ? 'border-emerald-500 bg-emerald-50 shadow-lg scale-102 ring-4 ring-emerald-200'
                    : isCardWrong
                    ? 'border-rose-400 bg-rose-50 shake shadow-md'
                    : 'border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50/30 hover:shadow-xl active:scale-98'
                }`}
              >
                {/* Badge A or B */}
                <div className="w-full flex items-center justify-between mb-3">
                  <span
                    className={`px-3 py-1 rounded-xl text-sm font-black transition-colors ${
                      isCardCorrect
                        ? 'bg-emerald-600 text-white'
                        : isCardWrong
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-100 text-slate-700 group-hover:bg-amber-400 group-hover:text-slate-900'
                    }`}
                  >
                    Pilihan {option.id} {idx === 0 ? '(Tekan 1)' : '(Tekan 2)'}
                  </span>
                  {isCardCorrect && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Betul!
                    </span>
                  )}
                </div>

                {/* ILLUSTRATION CANVAS/SVG */}
                <div className="w-full h-44 sm:h-52 bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200/80 mb-3 flex items-center justify-center">
                  <IllustrationViewer type={option.illustrationType} />
                </div>

                {/* OPTION SHORT LABEL */}
                <p className="text-sm sm:text-base font-bold text-slate-800 text-center leading-snug w-full">
                  {option.label}
                </p>
              </button>
            );
          })}
        </div>

        {/* FEEDBACK STATUS OVERLAY / FOOTER */}
        {feedbackState === 'correct' && (
          <div className="bg-emerald-600 text-white p-4 flex items-center justify-center gap-3 animate-bounce">
            <Sparkles className="w-6 h-6 text-yellow-300" />
            <span className="font-extrabold text-lg sm:text-xl">
              Tahniah! Jawapan Tepat! (+10 Mata & Kunci Emas Dibuka!)
            </span>
          </div>
        )}

        {feedbackState === 'wrong' && (
          <div className="bg-rose-600 text-white p-4 flex items-center justify-between px-6 flex-wrap gap-2">
            <div>
              <p className="font-extrabold text-base sm:text-lg">Alamak! Cuba lagi!</p>
              <p className="text-xs sm:text-sm text-rose-100">
                {selectedOption?.feedback}
              </p>
            </div>
            <button
              onClick={handleRetry}
              className="px-5 py-2 bg-white text-rose-700 hover:bg-rose-50 rounded-xl font-black text-sm flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              Pilih Semula
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Dedicated Cartoon SVG Illustrations for all moral situations
 */
function IllustrationViewer({ type }: { type: string }) {
  switch (type) {
    // LEVEL 1: HORMAT
    case 'greet_teacher':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          {/* Background School Corridor */}
          <rect width="320" height="200" fill="#E0F2FE" />
          <rect y="140" width="320" height="60" fill="#CBD5E1" />
          <line x1="0" y1="140" x2="320" y2="140" stroke="#94A3B8" strokeWidth="2" />
          {/* Corridor Window */}
          <rect x="30" y="30" width="70" height="60" rx="6" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
          <line x1="65" y1="30" x2="65" y2="90" stroke="#0284C7" strokeWidth="2" />
          {/* Teacher (Right) */}
          <g transform="translate(190, 45)">
            {/* Hijab */}
            <path d="M 30 20 C 30 5 70 5 70 20 C 70 40 68 85 50 85 C 32 85 30 40 30 20 Z" fill="#0D9488" />
            <circle cx="50" cy="30" r="14" fill="#FBD3B6" />
            {/* Glasses */}
            <circle cx="45" cy="28" r="4" fill="none" stroke="#0F172A" strokeWidth="1.5" />
            <circle cx="55" cy="28" r="4" fill="none" stroke="#0F172A" strokeWidth="1.5" />
            <line x1="49" y1="28" x2="51" y2="28" stroke="#0F172A" strokeWidth="1.5" />
            {/* Smile */}
            <path d="M 46 35 Q 50 39 54 35" stroke="#0F172A" strokeWidth="1.5" fill="none" />
            {/* Baju Kurung */}
            <path d="M 32 50 L 68 50 L 74 110 L 26 110 Z" fill="#14B8A6" />
            {/* Teaching file / books */}
            <rect x="22" y="65" width="22" height="28" rx="3" fill="#F59E0B" />
          </g>
          {/* Pupil bowing politely & greeting */}
          <g transform="translate(60, 65)">
            <ellipse cx="40" cy="100" rx="18" ry="4" fill="rgba(0,0,0,0.15)" />
            {/* Pupil bowing */}
            <circle cx="45" cy="35" r="14" fill="#FBD3B6" />
            <path d="M 35 25 C 40 18 55 18 60 25 Z" fill="#EF4444" />
            {/* Hands in polite salam greeting */}
            <ellipse cx="60" cy="55" rx="6" ry="4" fill="#FBD3B6" />
            {/* Shirt & Overalls */}
            <rect x="35" y="48" width="20" height="24" rx="4" fill="#3B82F6" />
            <rect x="36" y="70" width="8" height="24" fill="#1E3A8A" />
            <rect x="46" y="70" width="8" height="24" fill="#1E3A8A" />
            {/* Speech bubble */}
            <g transform="translate(10, -35)">
              <rect width="90" height="28" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
              <polygon points="40,28 45,35 50,28" fill="#FFFFFF" />
              <text x="45" y="18" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0369A1">
                "Selamat pagi cikgu!"
              </text>
            </g>
          </g>
          {/* Sparkles */}
          <text x="280" y="50" fontSize="22">✨</text>
        </svg>
      );

    case 'ignore_teacher':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <rect width="320" height="200" fill="#FEE2E2" />
          <rect y="140" width="320" height="60" fill="#CBD5E1" />
          {/* Teacher looking puzzled */}
          <g transform="translate(70, 45)">
            <path d="M 30 20 C 30 5 70 5 70 20 C 70 40 68 85 50 85 C 32 85 30 40 30 20 Z" fill="#0D9488" />
            <circle cx="50" cy="30" r="14" fill="#FBD3B6" />
            <circle cx="55" cy="28" r="4" fill="none" stroke="#0F172A" strokeWidth="1.5" />
            {/* Question mark near teacher */}
            <text x="65" y="20" fontSize="16" fontWeight="bold" fill="#DC2626">?</text>
            <path d="M 32 50 L 68 50 L 74 110 L 26 110 Z" fill="#14B8A6" />
          </g>
          {/* Pupil running away facing away */}
          <g transform="translate(180, 65)">
            <circle cx="50" cy="35" r="13" fill="#FBD3B6" />
            <path d="M 40 25 C 45 18 60 18 65 25 Z" fill="#EF4444" />
            <rect x="40" y="48" width="20" height="22" rx="4" fill="#3B82F6" />
            {/* Running legs */}
            <line x1="44" y1="70" x2="30" y2="92" stroke="#1E3A8A" strokeWidth="6" strokeLinecap="round" />
            <line x1="56" y1="70" x2="70" y2="92" stroke="#1E3A8A" strokeWidth="6" strokeLinecap="round" />
            {/* Dust clouds */}
            <circle cx="20" cy="90" r="6" fill="#94A3B8" opacity="0.6" />
            <circle cx="10" cy="94" r="4" fill="#94A3B8" opacity="0.4" />
          </g>
          {/* Red X badge */}
          <text x="270" y="45" fontSize="24">❌</text>
        </svg>
      );

    // LEVEL 2: JUJUR
    case 'return_pencil':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <rect width="320" height="200" fill="#FEF3C7" />
          <rect y="145" width="320" height="55" fill="#E2E8F0" />
          {/* Left pupil handing over pencil case */}
          <g transform="translate(60, 55)">
            <circle cx="35" cy="30" r="14" fill="#FBD3B6" />
            <path d="M 25 22 C 30 15 45 15 50 22 Z" fill="#EF4444" />
            <rect x="25" y="44" width="20" height="24" rx="4" fill="#DC2626" />
            {/* Hands holding pencil box */}
            <rect x="42" y="52" width="30" height="15" rx="3" fill="#8B5CF6" stroke="#4C1D95" strokeWidth="1" />
            <line x1="45" y1="58" x2="68" y2="58" stroke="#FDE047" strokeWidth="2" />
          </g>
          {/* Right pupil happy to receive */}
          <g transform="translate(180, 55)">
            <circle cx="45" cy="30" r="14" fill="#FBD3B6" />
            <path d="M 40 34 Q 45 40 50 34" stroke="#0F172A" strokeWidth="1.5" fill="none" />
            <rect x="35" y="44" width="20" height="24" rx="4" fill="#10B981" />
            {/* Heart symbol of gratitude */}
            <text x="35" y="15" fontSize="16" fill="#EC4899">❤️</text>
          </g>
          {/* Speech bubble */}
          <g transform="translate(80, 10)">
            <rect width="160" height="26" rx="6" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.5" />
            <text x="80" y="17" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#92400E">
              "Ini kotak pensel awak!"
            </text>
          </g>
        </svg>
      );

    case 'keep_pencil':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <rect width="320" height="200" fill="#FEE2E2" />
          <rect y="145" width="320" height="55" fill="#E2E8F0" />
          {/* Pupil quietly hiding pencil case inside schoolbag */}
          <g transform="translate(110, 55)">
            <circle cx="40" cy="30" r="14" fill="#FBD3B6" />
            {/* Sneaky eyes */}
            <ellipse cx="36" cy="28" rx="2" ry="1.5" fill="#111827" />
            <ellipse cx="44" cy="28" rx="2" ry="1.5" fill="#111827" />
            {/* Backpack */}
            <rect x="55" y="45" width="35" height="45" rx="6" fill="#B91C1C" />
            {/* Pencil case halfway into bag */}
            <rect x="50" y="42" width="26" height="14" rx="3" fill="#8B5CF6" transform="rotate(-15, 60, 50)" />
            {/* Shushing finger */}
            <rect x="38" y="36" width="4" height="10" rx="2" fill="#FBD3B6" />
          </g>
          {/* Sad friend looking on table far away */}
          <g transform="translate(20, 60)">
            <rect x="10" y="65" width="40" height="30" fill="#78350F" />
            <text x="25" y="40" fontSize="14">😢</text>
          </g>
          <text x="260" y="45" fontSize="24">❌</text>
        </svg>
      );

    // LEVEL 3: TOLERANSI
    case 'share_swing':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <rect width="320" height="200" fill="#ECFDF5" />
          <rect y="140" width="320" height="60" fill="#86EFAC" />
          {/* Swing Set */}
          <line x1="80" y1="20" x2="220" y2="20" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
          <line x1="80" y1="20" x2="60" y2="150" stroke="#475569" strokeWidth="4" />
          <line x1="220" y1="20" x2="240" y2="150" stroke="#475569" strokeWidth="4" />
          {/* Swing ropes & seat */}
          <line x1="130" y1="20" x2="125" y2="110" stroke="#94A3B8" strokeWidth="2" />
          <line x1="170" y1="20" x2="165" y2="110" stroke="#94A3B8" strokeWidth="2" />
          <rect x="115" y="110" width="65" height="8" rx="3" fill="#B45309" />
          {/* Child on swing smiling */}
          <circle cx="145" cy="85" r="11" fill="#FBD3B6" />
          <text x="142" y="88" fontSize="8">😊</text>
          {/* Friend waiting politely next to swing */}
          <g transform="translate(210, 75)">
            <circle cx="20" cy="20" r="11" fill="#FBD3B6" />
            <text x="17" y="23" fontSize="8">😄</text>
            <rect x="14" y="32" width="12" height="18" fill="#3B82F6" />
            <text x="10" y="0" fontSize="9" fontWeight="bold" fill="#047857">"Giliran saya nanti!"</text>
          </g>
          <text x="270" y="45" fontSize="22">⭐</text>
        </svg>
      );

    case 'push_swing':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <rect width="320" height="200" fill="#FEE2E2" />
          <rect y="140" width="320" height="60" fill="#FCA5A5" />
          {/* Swing Set */}
          <line x1="80" y1="20" x2="220" y2="20" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
          <line x1="140" y1="20" x2="135" y2="105" stroke="#94A3B8" strokeWidth="2" />
          <line x1="175" y1="20" x2="170" y2="105" stroke="#94A3B8" strokeWidth="2" />
          <rect x="130" y="105" width="50" height="8" rx="2" fill="#B45309" />
          {/* Two children pulling and fighting */}
          <g transform="translate(110, 70)">
            {/* Child 1 pulling */}
            <circle cx="20" cy="20" r="11" fill="#FBD3B6" />
            <text x="16" y="24" fontSize="10">😡</text>
            {/* Child 2 pushing */}
            <circle cx="50" cy="20" r="11" fill="#FBD3B6" />
            <text x="46" y="24" fontSize="10">😠</text>
            {/* Fight lightning bolt */}
            <text x="30" y="10" fontSize="14">⚡</text>
          </g>
          <text x="260" y="45" fontSize="24">❌</text>
        </svg>
      );

    // LEVEL 4: TANGGUNGJAWAB
    case 'clean_trash':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <rect width="320" height="200" fill="#E0F2FE" />
          <rect y="140" width="320" height="60" fill="#CBD5E1" />
          {/* Green Recycling Bin */}
          <g transform="translate(200, 75)">
            <path d="M 10 20 L 50 20 L 45 70 L 15 70 Z" fill="#16A34A" />
            <rect x="6" y="14" width="48" height="8" rx="2" fill="#15803D" />
            {/* Recycle logo */}
            <text x="24" y="48" fontSize="16" fill="#FFFFFF">♻️</text>
          </g>
          {/* Pupil picking up trash responsibly */}
          <g transform="translate(80, 70)">
            <ellipse cx="30" cy="72" rx="14" ry="4" fill="rgba(0,0,0,0.15)" />
            <circle cx="30" cy="22" r="12" fill="#FBD3B6" />
            <rect x="23" y="34" width="14" height="20" fill="#3B82F6" />
            {/* Arm reaching down to pick paper */}
            <line x1="36" y1="40" x2="70" y2="60" stroke="#FBD3B6" strokeWidth="4" strokeLinecap="round" />
            <rect x="65" y="55" width="14" height="10" rx="2" fill="#F1F5F9" stroke="#94A3B8" />
          </g>
          {/* Speech bubble */}
          <g transform="translate(40, 15)">
            <rect width="160" height="26" rx="6" fill="#FFFFFF" stroke="#16A34A" strokeWidth="1.5" />
            <text x="80" y="17" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#15803D">
              "Kelas bersih, kita selesa!"
            </text>
          </g>
          <text x="270" y="45" fontSize="22">✨</text>
        </svg>
      );

    case 'leave_trash':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <rect width="320" height="200" fill="#FEE2E2" />
          <rect y="140" width="320" height="60" fill="#E2E8F0" />
          {/* Litter all over the floor */}
          <g transform="translate(50, 150)">
            <rect x="20" y="5" width="16" height="10" fill="#CBD5E1" transform="rotate(20)" />
            <rect x="80" y="10" width="20" height="12" fill="#FDE047" transform="rotate(-15)" />
            <rect x="140" y="2" width="14" height="14" fill="#F87171" transform="rotate(45)" />
            <rect x="200" y="8" width="18" height="8" fill="#A7F3D0" />
          </g>
          {/* Pupil walking past with hands in pocket */}
          <g transform="translate(180, 65)">
            <circle cx="30" cy="22" r="12" fill="#FBD3B6" />
            <text x="26" y="26" fontSize="10">🙄</text>
            <rect x="23" y="34" width="14" height="24" fill="#64748B" />
            <line x1="26" y1="58" x2="16" y2="80" stroke="#334155" strokeWidth="4" />
            <line x1="34" y1="58" x2="44" y2="80" stroke="#334155" strokeWidth="4" />
          </g>
          <text x="260" y="45" fontSize="24">❌</text>
        </svg>
      );

    // LEVEL 5: BERTERIMA KASIH
    case 'say_thanks':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <rect width="320" height="200" fill="#FEF9C3" />
          <rect y="140" width="320" height="60" fill="#FDE68A" />
          {/* Friend holding heavy stack of books */}
          <g transform="translate(60, 50)">
            <circle cx="30" cy="24" r="12" fill="#FBD3B6" />
            <rect x="23" y="36" width="14" height="24" fill="#3B82F6" />
            {/* Stack of books */}
            <rect x="36" y="40" width="28" height="8" rx="2" fill="#EF4444" />
            <rect x="35" y="48" width="30" height="8" rx="2" fill="#3B82F6" />
            <rect x="37" y="56" width="26" height="8" rx="2" fill="#10B981" />
          </g>
          {/* Pupil expressing heartfelt "Terima Kasih" */}
          <g transform="translate(180, 50)">
            <circle cx="30" cy="24" r="12" fill="#FBD3B6" />
            <text x="26" y="27" fontSize="10">😊</text>
            <rect x="23" y="36" width="14" height="24" fill="#EC4899" />
            {/* Hand on heart */}
            <ellipse cx="30" cy="45" rx="5" ry="3" fill="#FBD3B6" />
          </g>
          {/* Large cheerful speech bubble */}
          <g transform="translate(120, 10)">
            <rect width="140" height="28" rx="8" fill="#FFFFFF" stroke="#EA580C" strokeWidth="1.5" />
            <text x="70" y="18" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#C2410C">
              "Terima Kasih kawan!"
            </text>
          </g>
          <text x="280" y="45" fontSize="22">💖</text>
        </svg>
      );

    case 'walk_away':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <rect width="320" height="200" fill="#FEE2E2" />
          <rect y="140" width="320" height="60" fill="#E2E8F0" />
          {/* Friend struggling holding books alone */}
          <g transform="translate(50, 55)">
            <circle cx="30" cy="24" r="12" fill="#FBD3B6" />
            <text x="26" y="27" fontSize="10">😰</text>
            <rect x="36" y="40" width="28" height="8" rx="2" fill="#EF4444" />
            <rect x="35" y="48" width="30" height="8" rx="2" fill="#3B82F6" />
            <rect x="37" y="56" width="26" height="8" rx="2" fill="#10B981" />
          </g>
          {/* Pupil walking away looking arrogant */}
          <g transform="translate(200, 55)">
            <circle cx="30" cy="24" r="12" fill="#FBD3B6" />
            <rect x="23" y="36" width="14" height="24" fill="#64748B" />
            <line x1="26" y1="60" x2="16" y2="82" stroke="#334155" strokeWidth="4" />
            <line x1="34" y1="60" x2="44" y2="82" stroke="#334155" strokeWidth="4" />
            <text x="32" y="15" fontSize="12">💨</text>
          </g>
          <text x="260" y="45" fontSize="24">❌</text>
        </svg>
      );

    default:
      return null;
  }
}
