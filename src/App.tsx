import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Heart,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  GraduationCap,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { CharacterType, GameState } from './types/game';
import { LEVELS } from './data/levels';
import { CharacterSelection } from './components/CharacterSelection';
import { PlatformerCanvas } from './components/PlatformerCanvas';
import { QuestionModal } from './components/QuestionModal';
import { SmartTvControls } from './components/SmartTvControls';
import { TeacherMenu } from './components/TeacherMenu';
import { TreasureRoom } from './components/TreasureRoom';
import { CertificateModal } from './components/CertificateModal';
import { sound } from './utils/audio';
import { speakMalay } from './utils/speech';

export default function App() {
  // Game Flow State
  const [gameState, setGameState] = useState<GameState>('CHARACTER_SELECT');
  const [character, setCharacter] = useState<CharacterType>('adam');
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);

  // Player Stats & Rewards
  const [lives, setLives] = useState<number>(3);
  const [coins, setCoins] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [keysCollected, setKeysCollected] = useState<boolean[]>([false, false, false, false, false]);
  const [levelQuestionsSolved, setLevelQuestionsSolved] = useState<boolean[]>([false, false, false, false, false]);

  // Audio & Fullscreen
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Modals & Menus
  const [isTeacherMenuOpen, setIsTeacherMenuOpen] = useState<boolean>(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);

  // Input states for Platformer Canvas
  const [inputState, setInputState] = useState({
    left: false,
    right: false,
    jump: false,
  });

  const currentLevel = LEVELS[currentLevelIndex];

  // ==========================================
  // KEYBOARD CONTROLS (A/D, Arrows, Space, W, P, R)
  // ==========================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger movement if answering question or typing
      if (gameState === 'QUESTION_ACTIVE' || isTeacherMenuOpen || isCertificateOpen) {
        return;
      }

      // Movement keys
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        setInputState((prev) => ({ ...prev, left: true }));
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        setInputState((prev) => ({ ...prev, right: true }));
      } else if (e.key === 'ArrowUp' || e.key === ' ' || e.key.toLowerCase() === 'w') {
        setInputState((prev) => ({ ...prev, jump: true }));
      } else if (e.key.toLowerCase() === 'p') {
        // Toggle pause
        setIsPaused((p) => !p);
      } else if (e.key.toLowerCase() === 'r') {
        // Restart level from checkpoint
        handleRestartLevel();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        setInputState((prev) => ({ ...prev, left: false }));
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        setInputState((prev) => ({ ...prev, right: false }));
      } else if (e.key === 'ArrowUp' || e.key === ' ' || e.key.toLowerCase() === 'w') {
        setInputState((prev) => ({ ...prev, jump: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, isTeacherMenuOpen, isCertificateOpen]);

  // Touch / On-screen inputs
  const handleTouchStart = (action: 'left' | 'right' | 'jump') => {
    setInputState((prev) => ({ ...prev, [action]: true }));
  };

  const handleTouchEnd = (action: 'left' | 'right' | 'jump') => {
    setInputState((prev) => ({ ...prev, [action]: false }));
  };

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Audio Mute Toggle
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
  };

  // ==========================================
  // GAME EVENTS & HANDLERS
  // ==========================================

  // Select Character and Begin
  const handleSelectCharacter = (char: CharacterType) => {
    setCharacter(char);
    setGameState('PLAYING');
    setIsPaused(false);
    speakMalay(`Tahap Satu: Nilai Hormat. Mari kita mula mengembara!`);
  };

  // Collect Coin
  const handleCoinCollect = () => {
    setCoins((c) => c + 1);
    setScore((s) => s + 1);
  };

  // Underside Question Block Hit
  const handleQuestionTrigger = () => {
    if (!levelQuestionsSolved[currentLevelIndex]) {
      setIsPaused(true);
      setGameState('QUESTION_ACTIVE');
    }
  };

  // Correct Question Answered
  const handleQuestionCorrect = () => {
    // Award 10 points
    setScore((s) => s + 10);

    // Mark question solved
    const newSolved = [...levelQuestionsSolved];
    newSolved[currentLevelIndex] = true;
    setLevelQuestionsSolved(newSolved);

    // Unlock Key
    const newKeys = [...keysCollected];
    newKeys[currentLevelIndex] = true;
    setKeysCollected(newKeys);
    sound.playKeyCollect();

    // Close modal & resume play
    setGameState('PLAYING');
    setIsPaused(false);
  };

  // Checkpoint activated
  const handleCheckpointTrigger = () => {
    speakMalay('Titik semak diaktifkan!');
  };

  // Pit fall -> Lose 1 heart
  const handleLoseLife = () => {
    setLives((l) => {
      const nextLife = l - 1;
      if (nextLife <= 0) {
        setGameState('GAME_OVER');
        speakMalay('Jangan putus asa! Tekan Cuba Lagi untuk teruskan kembara!');
        return 0;
      }
      return nextLife;
    });
  };

  // Game Over -> Continue with 3 restored hearts without losing keys or questions
  const handleGameOverRetry = () => {
    sound.playCheckpoint();
    setLives(3);
    setGameState('PLAYING');
    setIsPaused(false);
  };

  // Level Clear
  const handleLevelComplete = () => {
    setIsPaused(true);
    if (currentLevelIndex < 4) {
      setGameState('LEVEL_CLEARED');
      speakMalay(`Tahniah! Tahap ${currentLevel.id} Nilai ${currentLevel.moralValue} berjaya diselesaikan!`);
    } else {
      // Reached finish of Level 5 -> Final Treasure Room
      setGameState('TREASURE_ROOM');
    }
  };

  // Next Level
  const handleNextLevel = () => {
    const nextIdx = currentLevelIndex + 1;
    setCurrentLevelIndex(nextIdx);
    setGameState('PLAYING');
    setIsPaused(false);
    speakMalay(`Tahap ${LEVELS[nextIdx].id}: Nilai ${LEVELS[nextIdx].moralValue}. Teruskan perjuangan!`);
  };

  // Restart Current Level
  const handleRestartLevel = () => {
    sound.playCheckpoint();
    setIsPaused(false);
    setGameState('PLAYING');
  };

  // Teacher Quick Level Jump
  const handleJumpToLevel = (levelId: number) => {
    const targetIdx = LEVELS.findIndex((l) => l.id === levelId);
    if (targetIdx !== -1) {
      setCurrentLevelIndex(targetIdx);
      setIsPaused(false);
      setGameState('PLAYING');
      speakMalay(`Tahap ${levelId}: Nilai ${LEVELS[targetIdx].moralValue}`);
    }
  };

  // Switch Character
  const handleSwitchCharacter = () => {
    setCharacter((c) => (c === 'adam' ? 'aisyah' : 'adam'));
  };

  // Replay Entire Game from Beginning
  const handleReplayGame = () => {
    setCurrentLevelIndex(0);
    setLives(3);
    setCoins(0);
    setScore(0);
    setKeysCollected([false, false, false, false, false]);
    setLevelQuestionsSolved([false, false, false, false, false]);
    setGameState('CHARACTER_SELECT');
    setIsPaused(false);
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* 1. CHARACTER SELECTION VIEW */}
      {gameState === 'CHARACTER_SELECT' && (
        <CharacterSelection
          selectedCharacter={character}
          onSelectCharacter={handleSelectCharacter}
        />
      )}

      {/* 2. TREASURE ROOM VICTORY VIEW */}
      {gameState === 'TREASURE_ROOM' && (
        <TreasureRoom
          character={character}
          score={score}
          onReplay={handleReplayGame}
          onOpenCertificate={() => setIsCertificateOpen(true)}
        />
      )}

      {/* 3. ACTIVE GAMEPLAY & LEVEL CLEAR VIEWS */}
      {(gameState === 'PLAYING' ||
        gameState === 'QUESTION_ACTIVE' ||
        gameState === 'LEVEL_CLEARED' ||
        gameState === 'GAME_OVER') && (
        <div className="flex-1 flex flex-col justify-between p-2 sm:p-4 max-w-6xl mx-auto w-full">
          {/* ================= TOP HUD BAR ================= */}
          <header className="bg-slate-800/95 backdrop-blur-md rounded-2xl border-2 border-slate-700/80 px-4 py-2.5 mb-2 flex items-center justify-between shadow-lg flex-wrap gap-2">
            {/* Level & Moral Value Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setGameState('CHARACTER_SELECT')}
                className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
                title="Pilih Wira Semula"
              >
                ← {character === 'adam' ? 'Adam (Topi Merah)' : 'Aisyah (Tudung Pink)'}
              </button>
              <div className="hidden sm:block w-px h-5 bg-slate-600" />
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                  Tahap {currentLevel.id} / 5
                </span>
                <span className="text-sm sm:text-base font-black text-white">
                  Nilai {currentLevel.moralValue}
                </span>
              </div>
            </div>

            {/* 3 HEARTS / LIVES */}
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700">
              {[1, 2, 3].map((heartIndex) => (
                <Heart
                  key={heartIndex}
                  className={`w-5 h-5 transition-transform ${
                    heartIndex <= lives
                      ? 'fill-rose-500 text-rose-500 scale-100'
                      : 'fill-slate-600 text-slate-600 scale-90'
                  }`}
                />
              ))}
            </div>

            {/* 5 GOLDEN KEY SLOTS */}
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700">
              {[0, 1, 2, 3, 4].map((idx) => (
                <div
                  key={idx}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all ${
                    keysCollected[idx]
                      ? 'bg-amber-400 text-amber-950 shadow-md scale-105 font-bold'
                      : 'bg-slate-800 text-slate-600 border border-slate-700'
                  }`}
                  title={`Kunci Nilai ${LEVELS[idx].moralValue}`}
                >
                  {keysCollected[idx] ? '🔑' : idx + 1}
                </div>
              ))}
            </div>

            {/* COINS & SCORE */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-yellow-300 font-extrabold text-sm sm:text-base bg-amber-950/60 border border-amber-600/40 px-3 py-1 rounded-xl">
                <span>🪙</span>
                <span>{coins}</span>
              </div>

              {/* ACTION BUTTONS (Mute, Fullscreen, Teacher Menu) */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleMute}
                  className="w-9 h-9 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center justify-center transition-all"
                  title={isMuted ? 'Buka Suara' : 'Senyapkan'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="w-9 h-9 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center justify-center transition-all hidden sm:flex"
                  title={isFullscreen ? 'Keluar Skrin Penuh' : 'Skrin Penuh (Smart TV)'}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsTeacherMenuOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                  title="Menu Guru & Silibus"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span className="hidden md:inline">Menu Guru</span>
                </button>
              </div>
            </div>
          </header>

          {/* ================= 2D PLATFORMER CANVAS ================= */}
          <main className="relative flex-1 flex items-center justify-center">
            <PlatformerCanvas
              level={currentLevel}
              character={character}
              lives={lives}
              keysCollected={keysCollected}
              coins={coins}
              isPaused={isPaused || gameState !== 'PLAYING'}
              questionAnswered={levelQuestionsSolved[currentLevelIndex]}
              onCoinCollect={handleCoinCollect}
              onQuestionTrigger={handleQuestionTrigger}
              onCheckpointTrigger={handleCheckpointTrigger}
              onLevelComplete={handleLevelComplete}
              onLoseLife={handleLoseLife}
              onGameOver={() => setGameState('GAME_OVER')}
              inputState={inputState}
            />

            {/* PAUSE OVERLAY */}
            {isPaused && gameState === 'PLAYING' && (
              <div className="absolute inset-0 z-30 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl">
                <div className="bg-slate-800 border-4 border-amber-400 p-6 rounded-3xl text-center shadow-2xl max-w-sm">
                  <Pause className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                  <h3 className="text-2xl font-black text-white mb-1">Permainan Dijeda</h3>
                  <p className="text-xs text-slate-300 mb-4">
                    Tekan <b>P</b> pada papan kekunci atau klik butang di bawah untuk sambung:
                  </p>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl text-base shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5 fill-white" /> Sambung Main
                  </button>
                </div>
              </div>
            )}
          </main>

          {/* ================= ON-SCREEN TOUCH CONTROLS (MOBILE & TABLET) ================= */}
          <footer className="mt-2">
            <SmartTvControls
              onInputStart={handleTouchStart}
              onInputEnd={handleTouchEnd}
              activeInputs={inputState}
            />
          </footer>
        </div>
      )}

      {/* ================= 4. QUESTION POPUP MODAL ================= */}
      {gameState === 'QUESTION_ACTIVE' && (
        <QuestionModal
          question={currentLevel.question}
          onCorrect={handleQuestionCorrect}
        />
      )}

      {/* ================= 5. LEVEL CLEARED MODAL ================= */}
      {gameState === 'LEVEL_CLEARED' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-emerald-500 p-6 text-center text-slate-900 overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Trophy className="w-9 h-9" />
            </div>

            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 block">
              Tahap Selesai!
            </span>
            <h3 className="text-2xl font-black text-slate-900 mb-1">
              Tahap {currentLevel.id}: Nilai {currentLevel.moralValue}
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Kunci Emas telah disimpan ke dalam beg kembara anda!
            </p>

            {/* Collected Key Animation Badge */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-center gap-3 mb-6">
              <span className="text-4xl animate-bounce">🔑</span>
              <div className="text-left">
                <span className="text-xs font-bold text-amber-900 block">Kunci Emas Ke-{currentLevel.id}</span>
                <span className="text-sm font-black text-amber-800 block">Nilai {currentLevel.moralValue}</span>
              </div>
            </div>

            <button
              onClick={handleNextLevel}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-lg rounded-2xl shadow-xl flex items-center justify-center gap-2 border-b-4 border-emerald-800 transition-all active:scale-95"
            >
              <span>TERUSKAN KE TAHAP SETERUSNYA</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ================= 6. GAME OVER / JANGAN PUTUS ASA MODAL ================= */}
      {gameState === 'GAME_OVER' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-amber-500 p-6 text-center text-slate-900">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <ShieldAlert className="w-9 h-9" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
              JANGAN PUTUS ASA!
            </h3>
            <p className="text-sm font-semibold text-slate-600 mb-6">
              Kunci emas dan soalan yang telah kamu jawab tetap selamat! Tekan butang di bawah untuk bangkit semula:
            </p>

            <button
              onClick={handleGameOverRetry}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-black text-xl rounded-2xl shadow-xl flex items-center justify-center gap-2 border-b-4 border-amber-800 transition-all active:scale-95"
            >
              <RotateCcw className="w-6 h-6" />
              <span>CUBA LAGI (PULIHKAN 3 NYAWA)</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= 7. TEACHER MENU OVERLAY ================= */}
      <TeacherMenu
        isOpen={isTeacherMenuOpen}
        onClose={() => setIsTeacherMenuOpen(false)}
        currentLevelId={currentLevel.id}
        onSelectLevel={handleJumpToLevel}
        onRestartLevel={handleRestartLevel}
        onSwitchCharacter={handleSwitchCharacter}
        currentCharacter={character}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* ================= 8. PRINTABLE CERTIFICATE MODAL ================= */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        character={character}
        score={score}
      />
    </div>
  );
}
