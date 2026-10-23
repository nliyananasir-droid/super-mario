import React, { useEffect, useRef, useState, useCallback } from 'react';
import { LevelConfig, CharacterType } from '../types/game';
import { drawCanvasCharacter } from './CharacterSprites';
import { sound } from '../utils/audio';

interface PlatformerCanvasProps {
  level: LevelConfig;
  character: CharacterType;
  lives: number;
  keysCollected: boolean[];
  coins: number;
  isPaused: boolean;
  questionAnswered: boolean;
  onCoinCollect: () => void;
  onQuestionTrigger: () => void;
  onCheckpointTrigger: () => void;
  onLevelComplete: () => void;
  onLoseLife: () => void;
  onGameOver: () => void;
  inputState: {
    left: boolean;
    right: boolean;
    jump: boolean;
  };
}

export const PlatformerCanvas: React.FC<PlatformerCanvasProps> = ({
  level,
  character,
  lives,
  questionAnswered,
  isPaused,
  onCoinCollect,
  onQuestionTrigger,
  onCheckpointTrigger,
  onLevelComplete,
  onLoseLife,
  inputState,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Virtual Game Resolution (16:9 widescreen)
  const GAME_WIDTH = 960;
  const GAME_HEIGHT = 540;

  // Player state
  const playerRef = useRef({
    x: level.spawn.x,
    y: level.spawn.y,
    width: 38,
    height: 48,
    vx: 0,
    vy: 0,
    isGrounded: false,
    facingRight: true,
    state: 'idle' as 'idle' | 'run' | 'jump' | 'fall' | 'hurt' | 'victory',
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    invulnerableTimer: 0,
    checkpoint: { x: level.spawn.x, y: level.spawn.y },
    hasActiveCheckpoint: false,
  });

  // Level dynamic entities
  const coinsRef = useRef<Array<{ id: number; x: number; y: number; collected: boolean; bob: number }>>([]);
  const qBlockRef = useRef({
    x: level.questionBlock.x,
    y: level.questionBlock.y,
    width: level.questionBlock.width,
    height: level.questionBlock.height,
    hit: questionAnswered,
    bumpY: 0,
    bumpVy: 0,
  });
  const checkpointRef = useRef({
    x: level.checkpoint.x,
    y: level.checkpoint.y,
    activated: false,
  });

  // Camera X position
  const cameraXRef = useRef(0);

  // Animation frame counter
  const animFrameRef = useRef(0);

  // Visual notification alert overlay in canvas
  const notificationRef = useRef<{ text: string; timer: number; color: string } | null>(null);

  // Particles
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; color: string; size: number; alpha: number; life: number }>>([]);

  // Initialize level objects when level changes
  useEffect(() => {
    playerRef.current.x = level.spawn.x;
    playerRef.current.y = level.spawn.y;
    playerRef.current.vx = 0;
    playerRef.current.vy = 0;
    playerRef.current.checkpoint = { x: level.spawn.x, y: level.spawn.y };
    playerRef.current.hasActiveCheckpoint = false;
    playerRef.current.invulnerableTimer = 0;

    coinsRef.current = level.coins.map((c) => ({
      ...c,
      collected: false,
      bob: Math.random() * Math.PI * 2,
    }));

    qBlockRef.current = {
      x: level.questionBlock.x,
      y: level.questionBlock.y,
      width: level.questionBlock.width,
      height: level.questionBlock.height,
      hit: questionAnswered,
      bumpY: 0,
      bumpVy: 0,
    };

    checkpointRef.current = {
      x: level.checkpoint.x,
      y: level.checkpoint.y,
      activated: false,
    };

    cameraXRef.current = 0;
    particlesRef.current = [];
  }, [level, questionAnswered]);

  // Sync question block state when parent updates questionAnswered
  useEffect(() => {
    qBlockRef.current.hit = questionAnswered;
  }, [questionAnswered]);

  const showNotification = useCallback((text: string, color: string = '#EF4444', duration: number = 90) => {
    notificationRef.current = { text, timer: duration, color };
  }, []);

  // Spawn visual sparkle particles
  const spawnSparkles = useCallback((x: number, y: number, color: string = '#FBBF24', count: number = 8) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const speed = 1.5 + Math.random() * 3.5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        color,
        size: 3 + Math.random() * 4,
        alpha: 1,
        life: 30 + Math.random() * 20,
      });
    }
  }, []);

  // Respawn from pit fall
  const handlePitFall = useCallback(() => {
    sound.playPitFall();
    showNotification('ALAMAK! CUBA LAGI!', '#DC2626', 80);

    onLoseLife();

    const p = playerRef.current;
    p.x = p.checkpoint.x;
    p.y = p.checkpoint.y;
    p.vx = 0;
    p.vy = 0;
    p.invulnerableTimer = 90; // 1.5 seconds at 60fps
    p.state = 'idle';
  }, [onLoseLife, showNotification]);

  // Main 60 FPS Game Loop
  useEffect(() => {
    let animationId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const GRAVITY = 0.68;
    const MAX_FALL = 11;
    const ACCEL = 0.65;
    const FRICTION = 0.78;
    const MAX_RUN = 5.2;
    const JUMP_POWER = -13.6;

    const gameLoop = () => {
      animFrameRef.current++;
      const frame = animFrameRef.current;

      const p = playerRef.current;

      // Only run physics if not paused
      if (!isPaused) {
        // Decrease timers
        if (p.coyoteTimer > 0) p.coyoteTimer--;
        if (p.jumpBufferTimer > 0) p.jumpBufferTimer--;
        if (p.invulnerableTimer > 0) p.invulnerableTimer--;

        // Check Jump Buffer input
        if (inputState.jump) {
          p.jumpBufferTimer = 7; // Remember jump press for 7 frames
        }

        // Horizontal Movement & Acceleration
        if (inputState.left) {
          p.vx -= ACCEL;
          if (p.vx < -MAX_RUN) p.vx = -MAX_RUN;
          p.facingRight = false;
        } else if (inputState.right) {
          p.vx += ACCEL;
          if (p.vx > MAX_RUN) p.vx = MAX_RUN;
          p.facingRight = true;
        } else {
          p.vx *= FRICTION;
          if (Math.abs(p.vx) < 0.1) p.vx = 0;
        }

        // Jump Execution (Normal jump or Coyote jump)
        if (p.jumpBufferTimer > 0 && (p.isGrounded || p.coyoteTimer > 0)) {
          p.vy = JUMP_POWER;
          p.isGrounded = false;
          p.coyoteTimer = 0;
          p.jumpBufferTimer = 0;
          sound.playJump();
          spawnSparkles(p.x + p.width / 2, p.y + p.height, '#E2E8F0', 5);
        }

        // Apply Gravity
        p.vy += GRAVITY;
        if (p.vy > MAX_FALL) p.vy = MAX_FALL;

        // Apply Horizontal Velocity & Collision
        p.x += p.vx;
        if (p.x < 0) {
          p.x = 0;
          p.vx = 0;
        }
        if (p.x + p.width > level.worldWidth) {
          p.x = level.worldWidth - p.width;
          p.vx = 0;
        }

        // Apply Vertical Velocity
        p.y += p.vy;

        // Reset grounded state before checking platforms
        const wasGrounded = p.isGrounded;
        p.isGrounded = false;

        // Platform Collisions (AABB & One-way top landing)
        level.platforms.forEach((plat) => {
          // Check horizontal overlap
          const overlapX = p.x + p.width > plat.x && p.x < plat.x + plat.width;
          if (!overlapX) return;

          // Landing on top of platform
          if (p.vy >= 0) {
            // Player feet were above or at platform top last frame and now penetrate
            const prevFootY = p.y - p.vy + p.height;
            const currFootY = p.y + p.height;

            if (prevFootY <= plat.y + 12 && currFootY >= plat.y) {
              p.y = plat.y - p.height;
              p.vy = 0;
              p.isGrounded = true;
            }
          }
        });

        // Set coyote time if walked off an edge without jumping
        if (wasGrounded && !p.isGrounded && p.vy > 0) {
          p.coyoteTimer = 7;
        }

        // QUESTION BLOCK COLLISION (GENUINE UNDERSIDE HIT)
        const qb = qBlockRef.current;
        if (qb.bumpY < 0) {
          // Animate question block spring bounce
          qb.bumpVy += 1.8;
          qb.bumpY += qb.bumpVy;
          if (qb.bumpY >= 0) {
            qb.bumpY = 0;
            qb.bumpVy = 0;
          }
        }

        // Check head hitting underside of question block
        const headXOverlap = p.x + p.width > qb.x && p.x < qb.x + qb.width;
        if (headXOverlap) {
          // If moving upwards and head enters bottom of question block
          const prevHeadY = p.y - p.vy;
          const currHeadY = p.y;
          const blockBottom = qb.y + qb.height;

          if (p.vy < 0 && prevHeadY >= blockBottom - 8 && currHeadY <= blockBottom) {
            // Head hit bottom of block!
            p.y = blockBottom;
            p.vy = 2; // Bounce player head downward

            if (!qb.hit) {
              // Trigger block hit bounce
              qb.bumpY = -12;
              qb.bumpVy = -4;
              sound.playBlockHit();
              spawnSparkles(qb.x + qb.width / 2, qb.y, '#FBBF24', 12);
              onQuestionTrigger();
            } else {
              sound.playBlockHit();
            }
          }
        }

        // CHECKPOINT FLAG TRIGGER
        const cp = checkpointRef.current;
        if (!cp.activated) {
          const distToCp = Math.abs(p.x + p.width / 2 - cp.x);
          if (distToCp < 35 && p.y + p.height >= cp.y - 80) {
            cp.activated = true;
            p.checkpoint = { x: cp.x, y: cp.y };
            p.hasActiveCheckpoint = true;
            sound.playCheckpoint();
            showNotification('TITIK SEMAK DIAKTIFKAN!', '#10B981', 90);
            spawnSparkles(cp.x, cp.y - 40, '#10B981', 14);
            onCheckpointTrigger();
          }
        }

        // COIN COLLECTION
        coinsRef.current.forEach((coin) => {
          if (coin.collected) return;
          const dist = Math.hypot(
            p.x + p.width / 2 - coin.x,
            p.y + p.height / 2 - coin.y
          );
          if (dist < 26) {
            coin.collected = true;
            sound.playCoin();
            spawnSparkles(coin.x, coin.y, '#FDE047', 6);
            onCoinCollect();
          }
        });

        // FINISH GATE TRIGGER
        const fg = level.finishGate;
        const reachedGate =
          p.x + p.width > fg.x &&
          p.x < fg.x + fg.width &&
          p.y + p.height > fg.y &&
          p.y < fg.y + fg.height;

        if (reachedGate) {
          if (qBlockRef.current.hit) {
            // Stage Clear!
            sound.playLevelComplete();
            p.state = 'victory';
            spawnSparkles(fg.x + fg.width / 2, fg.y + fg.height / 2, '#38BDF8', 20);
            onLevelComplete();
          } else {
            // Friendly prompt to answer the question block first
            if (animFrameRef.current % 90 === 0) {
              sound.playWrong();
              showNotification('Dapatkan Kunci Emas di Blok [?] dahulu!', '#F59E0B', 90);
            }
          }
        }

        // PIT FALL CHECK
        if (p.y > 540) {
          handlePitFall();
        }

        // Character Animation State
        if (p.invulnerableTimer > 60) {
          p.state = 'hurt';
        } else if (!p.isGrounded) {
          p.state = p.vy < 0 ? 'jump' : 'fall';
        } else if (Math.abs(p.vx) > 0.4) {
          p.state = 'run';
        } else {
          p.state = 'idle';
        }

        // Camera Tracking (Smooth follow player with clamp)
        const targetCamX = p.x + p.width / 2 - GAME_WIDTH / 2;
        cameraXRef.current += (targetCamX - cameraXRef.current) * 0.12;
        if (cameraXRef.current < 0) cameraXRef.current = 0;
        if (cameraXRef.current > level.worldWidth - GAME_WIDTH) {
          cameraXRef.current = level.worldWidth - GAME_WIDTH;
        }

        // Update Particles
        particlesRef.current.forEach((pt) => {
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.vy += 0.15; // particle gravity
          pt.alpha -= 1 / pt.life;
        });
        particlesRef.current = particlesRef.current.filter((pt) => pt.alpha > 0);

        // Update Notification Timer
        if (notificationRef.current) {
          notificationRef.current.timer--;
          if (notificationRef.current.timer <= 0) {
            notificationRef.current = null;
          }
        }
      }

      // ==================== RENDERING ====================
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      const camX = cameraXRef.current;

      // 1. Sky & Parallax Background
      drawParallaxBackground(ctx, level.theme, camX, GAME_WIDTH, GAME_HEIGHT, frame);

      // Save canvas state for camera translation
      ctx.save();
      ctx.translate(-camX, 0);

      // 2. Draw Checkpoint Flag
      drawCheckpointFlag(ctx, checkpointRef.current.x, checkpointRef.current.y, checkpointRef.current.activated, frame);

      // 3. Draw Finish Gate
      drawFinishGate(ctx, level.finishGate, qBlockRef.current.hit, frame);

      // 4. Draw Platforms & Pits
      drawPlatforms(ctx, level.platforms, level.theme);

      // 5. Draw Question Block
      drawQuestionBlock(ctx, qBlockRef.current, frame);

      // 6. Draw Collectible Coins
      drawCoins(ctx, coinsRef.current, frame);

      // 7. Draw Particles
      particlesRef.current.forEach((pt) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 8. Draw Player (Adam or Aisyah)
      drawCanvasCharacter(
        ctx,
        character,
        p.x,
        p.y,
        p.width,
        p.height,
        p.facingRight,
        p.state,
        frame,
        p.invulnerableTimer > 0
      );

      ctx.restore();

      // 9. Screen Overlay Notification Banner (e.g. 'ALAMAK! CUBA LAGI!')
      if (notificationRef.current) {
        ctx.save();
        ctx.fillStyle = notificationRef.current.color;
        ctx.beginPath();
        ctx.roundRect(GAME_WIDTH / 2 - 200, 40, 400, 48, 24);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 22px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(notificationRef.current.text, GAME_WIDTH / 2, 64);
        ctx.restore();
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [level, character, isPaused, inputState, handlePitFall, onCoinCollect, onCheckpointTrigger, onLevelComplete, onQuestionTrigger, showNotification, spawnSparkles]);

  return (
    <div className="relative w-full aspect-video max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-sky-300">
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="w-full h-full block select-none"
      />
    </div>
  );
};

// ==========================================
// CANVAS RENDERING HELPERS
// ==========================================

function drawParallaxBackground(
  ctx: CanvasRenderingContext2D,
  theme: string,
  camX: number,
  width: number,
  height: number,
  frame: number
) {
  // Gradient Sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  if (theme === 'village') {
    skyGrad.addColorStop(0, '#38BDF8');
    skyGrad.addColorStop(1, '#BAE6FD');
  } else if (theme === 'market') {
    skyGrad.addColorStop(0, '#F59E0B');
    skyGrad.addColorStop(0.5, '#FDE68A');
    skyGrad.addColorStop(1, '#FEF3C7');
  } else if (theme === 'playground') {
    skyGrad.addColorStop(0, '#818CF8');
    skyGrad.addColorStop(0.6, '#C7D2FE');
    skyGrad.addColorStop(1, '#FBCFE8');
  } else if (theme === 'school') {
    skyGrad.addColorStop(0, '#0284C7');
    skyGrad.addColorStop(0.7, '#7DD3FC');
    skyGrad.addColorStop(1, '#E0F2FE');
  } else {
    // Castle
    skyGrad.addColorStop(0, '#6366F1');
    skyGrad.addColorStop(0.6, '#A855F7');
    skyGrad.addColorStop(1, '#F3E8FF');
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Distant clouds parallax (camX * 0.2)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  for (let i = 0; i < 6; i++) {
    const cloudX = ((i * 320 - camX * 0.2 + frame * 0.2) % (width + 300)) - 100;
    const cloudY = 50 + (i % 3) * 35;
    ctx.beginPath();
    ctx.arc(cloudX, cloudY, 30, 0, Math.PI * 2);
    ctx.arc(cloudX + 25, cloudY - 12, 35, 0, Math.PI * 2);
    ctx.arc(cloudX + 55, cloudY, 28, 0, Math.PI * 2);
    ctx.fill();
  }

  // Distant Mountains / Hills / Buildings (camX * 0.4)
  ctx.fillStyle = theme === 'castle' ? '#475569' : '#86EFAC';
  ctx.beginPath();
  ctx.moveTo(0, height);
  for (let x = 0; x <= width; x += 40) {
    const worldX = x + camX * 0.4;
    const hillY = height - 120 + Math.sin(worldX * 0.003) * 45 + Math.cos(worldX * 0.007) * 25;
    ctx.lineTo(x, hillY);
  }
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  // Midground Trees / Scenery (camX * 0.7)
  ctx.fillStyle = theme === 'castle' ? '#334155' : '#22C55E';
  for (let i = 0; i < 8; i++) {
    const treeX = ((i * 260 - camX * 0.7) % (width + 200)) - 50;
    const treeBaseY = height - 90;
    // Trunk
    ctx.fillStyle = '#78350F';
    ctx.fillRect(treeX + 16, treeBaseY - 30, 12, 30);
    // Leaves
    ctx.fillStyle = theme === 'market' ? '#EA580C' : theme === 'castle' ? '#1E293B' : '#15803D';
    ctx.beginPath();
    ctx.arc(treeX + 22, treeBaseY - 45, 26, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPlatforms(
  ctx: CanvasRenderingContext2D,
  platforms: LevelConfig['platforms'],
  theme: string
) {
  platforms.forEach((plat) => {
    // Top Grass or Border
    let topColor = '#4ADE80';
    let baseColor = '#78350F';

    if (plat.type === 'wood' || theme === 'market') {
      topColor = '#FBBF24';
      baseColor = '#92400E';
    } else if (plat.type === 'cloud') {
      topColor = '#FFFFFF';
      baseColor = '#93C5FD';
    } else if (plat.type === 'stone' || theme === 'castle') {
      topColor = '#94A3B8';
      baseColor = '#334155';
    } else if (theme === 'school') {
      topColor = '#38BDF8';
      baseColor = '#1E3A8A';
    }

    // Platform Body
    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.roundRect(plat.x, plat.y, plat.width, plat.height, 6);
    ctx.fill();

    // Platform Top Grass Cap
    ctx.fillStyle = topColor;
    ctx.beginPath();
    ctx.roundRect(plat.x, plat.y, plat.width, 10, [6, 6, 0, 0]);
    ctx.fill();

    // Grass fringe detail
    ctx.fillStyle = topColor;
    for (let gx = plat.x + 8; gx < plat.x + plat.width - 8; gx += 16) {
      ctx.beginPath();
      ctx.moveTo(gx, plat.y + 10);
      ctx.lineTo(gx + 4, plat.y + 15);
      ctx.lineTo(gx + 8, plat.y + 10);
      ctx.fill();
    }
  });
}

function drawQuestionBlock(
  ctx: CanvasRenderingContext2D,
  qb: { x: number; y: number; width: number; height: number; hit: boolean; bumpY: number },
  frame: number
) {
  const currentY = qb.y + qb.bumpY;

  ctx.save();
  if (qb.hit) {
    // Used Metallic Block
    ctx.fillStyle = '#64748B';
    ctx.beginPath();
    ctx.roundRect(qb.x, currentY, qb.width, qb.height, 8);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center exclamation / dot
    ctx.fillStyle = '#94A3B8';
    ctx.beginPath();
    ctx.arc(qb.x + qb.width / 2, currentY + qb.height / 2, 6, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Golden Pulsing Question Block
    const pulse = Math.sin((frame * Math.PI) / 15) * 2;
    const grad = ctx.createLinearGradient(qb.x, currentY, qb.x, currentY + qb.height);
    grad.addColorStop(0, '#FDE047');
    grad.addColorStop(1, '#D97706');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(qb.x - pulse / 2, currentY - pulse / 2, qb.width + pulse, qb.height + pulse, 8);
    ctx.fill();

    ctx.strokeStyle = '#78350F';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Screws in corners
    ctx.fillStyle = '#78350F';
    ctx.fillRect(qb.x + 4, currentY + 4, 3, 3);
    ctx.fillRect(qb.x + qb.width - 7, currentY + 4, 3, 3);
    ctx.fillRect(qb.x + 4, currentY + qb.height - 7, 3, 3);
    ctx.fillRect(qb.x + qb.width - 7, currentY + qb.height - 7, 3, 3);

    // Glowing '?' Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 28px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', qb.x + qb.width / 2, currentY + qb.height / 2 + 1);
  }
  ctx.restore();
}

function drawCoins(
  ctx: CanvasRenderingContext2D,
  coins: Array<{ id: number; x: number; y: number; collected: boolean; bob: number }>,
  frame: number
) {
  coins.forEach((c) => {
    if (c.collected) return;
    const bobY = Math.sin((frame * 0.08) + c.bob) * 5;
    const spinWidth = Math.abs(Math.cos(frame * 0.08 + c.bob)) * 14 + 4;

    ctx.save();
    ctx.translate(c.x, c.y + bobY);

    // Golden Coin Glow
    ctx.fillStyle = 'rgba(253, 224, 71, 0.4)';
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();

    // Outer Coin
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.ellipse(0, 0, spinWidth, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Inner Coin
    ctx.fillStyle = '#FDE047';
    ctx.beginPath();
    ctx.ellipse(0, 0, Math.max(2, spinWidth - 3), 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Star inside
    if (spinWidth > 8) {
      ctx.fillStyle = '#B45309';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★', 0, 1);
    }

    ctx.restore();
  });
}

function drawCheckpointFlag(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  activated: boolean,
  frame: number
) {
  ctx.save();

  // Pole
  ctx.fillStyle = '#94A3B8';
  ctx.fillRect(x - 3, y - 80, 6, 80);

  // Ball top
  ctx.fillStyle = activated ? '#10B981' : '#FBBF24';
  ctx.beginPath();
  ctx.arc(x, y - 82, 6, 0, Math.PI * 2);
  ctx.fill();

  // Flag cloth (waving)
  const wave = Math.sin((frame * 0.1)) * 4;
  ctx.fillStyle = activated ? '#22C55E' : '#EF4444';
  ctx.beginPath();
  ctx.moveTo(x + 3, y - 80);
  ctx.quadraticCurveTo(x + 20, y - 70 + wave, x + 35, y - 65);
  ctx.lineTo(x + 3, y - 50);
  ctx.closePath();
  ctx.fill();

  // Star or check on flag
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(activated ? '✓' : '🚩', x + 16, y - 65 + wave * 0.5);

  ctx.restore();
}

function drawFinishGate(
  ctx: CanvasRenderingContext2D,
  fg: { x: number; y: number; width: number; height: number },
  isUnlocked: boolean,
  frame: number
) {
  ctx.save();

  // Gate Arch Pillars
  ctx.fillStyle = isUnlocked ? '#0284C7' : '#64748B';
  ctx.fillRect(fg.x, fg.y, 14, fg.height);
  ctx.fillRect(fg.x + fg.width - 14, fg.y, 14, fg.height);

  // Top Arch Bar
  ctx.beginPath();
  ctx.roundRect(fg.x - 6, fg.y - 12, fg.width + 12, 18, 6);
  ctx.fill();

  // Portal Beam / Energy
  if (isUnlocked) {
    const pulse = (Math.sin(frame * 0.1) + 1) * 0.5;
    const portalGrad = ctx.createLinearGradient(fg.x, fg.y, fg.x, fg.y + fg.height);
    portalGrad.addColorStop(0, `rgba(56, 189, 248, ${0.4 + pulse * 0.3})`);
    portalGrad.addColorStop(1, `rgba(168, 85, 247, ${0.3 + pulse * 0.2})`);

    ctx.fillStyle = portalGrad;
    ctx.fillRect(fg.x + 14, fg.y + 6, fg.width - 28, fg.height - 6);

    // Glowing Golden Key icon on top
    ctx.fillStyle = '#FDE047';
    ctx.font = '22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🔑', fg.x + fg.width / 2, fg.y - 16);
  } else {
    // Locked Padlock
    ctx.fillStyle = '#94A3B8';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🔒', fg.x + fg.width / 2, fg.y + fg.height / 2);
  }

  ctx.restore();
}
