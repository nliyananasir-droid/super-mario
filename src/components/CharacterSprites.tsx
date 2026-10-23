import React from 'react';
import { CharacterType } from '../types/game';

interface CharacterProps {
  type: CharacterType;
  state?: 'idle' | 'run' | 'jump' | 'fall' | 'hurt' | 'victory';
  facingRight?: boolean;
  size?: number;
  className?: string;
  frame?: number;
}

/**
 * High-definition Cartoon Vector Illustration for Adam & Aisyah
 * Preschool/Primary Malaysian Moral Adventure Theme
 */
export const CharacterAvatar: React.FC<CharacterProps> = ({
  type,
  state = 'idle',
  facingRight = true,
  size = 120,
  className = '',
  frame = 0,
}) => {
  const isAdam = type === 'adam';

  // Primary colors
  const skinColor = '#FBD3B6';
  const blushColor = '#FCA5A5';
  const capColor = isAdam ? '#EF4444' : '#F472B6'; // Red for Adam, Pink for Aisyah
  const shirtColor = isAdam ? '#DC2626' : '#F9A8D4'; // Red shirt or soft pink inner
  const overallColor = '#2563EB'; // Blue denim
  const buttonColor = '#FBBF24'; // Gold buttons
  const shoeColor = isAdam ? '#DC2626' : '#EC4899'; // Red shoes or Pink shoes

  // Animation offsets based on frame & state
  let bounceY = 0;
  let legLeftAngle = 0;
  let legRightAngle = 0;
  let armLeftAngle = 0;
  let armRightAngle = 0;

  if (state === 'idle') {
    bounceY = Math.sin((frame * Math.PI) / 15) * 3;
  } else if (state === 'run') {
    bounceY = Math.abs(Math.sin((frame * Math.PI) / 8)) * -5;
    legLeftAngle = Math.sin((frame * Math.PI) / 8) * 22;
    legRightAngle = -Math.sin((frame * Math.PI) / 8) * 22;
    armLeftAngle = -Math.sin((frame * Math.PI) / 8) * 24;
    armRightAngle = Math.sin((frame * Math.PI) / 8) * 24;
  } else if (state === 'jump') {
    bounceY = -8;
    legLeftAngle = -20;
    legRightAngle = 15;
    armLeftAngle = -45;
    armRightAngle = -45;
  } else if (state === 'fall') {
    bounceY = 4;
    legLeftAngle = 10;
    legRightAngle = -10;
    armLeftAngle = 30;
    armRightAngle = -30;
  } else if (state === 'victory') {
    bounceY = Math.sin((frame * Math.PI) / 10) * 8;
    armLeftAngle = -65;
    armRightAngle = -65;
  }

  const transformFlip = facingRight ? 'scaleX(1)' : 'scaleX(-1)';

  return (
    <div
      className={`relative inline-block select-none ${className}`}
      style={{
        width: size,
        height: size,
        transform: transformFlip,
        transformOrigin: 'center center',
      }}
    >
      <svg
        viewBox="0 0 100 120"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <g transform={`translate(0, ${bounceY})`}>
          {/* SHADOW */}
          <ellipse
            cx="50"
            cy="114"
            rx={state === 'jump' ? '18' : '26'}
            ry="6"
            fill="rgba(0,0,0,0.18)"
          />

          {/* LEGS & SHOES */}
          {/* Left Leg */}
          <g transform={`rotate(${legLeftAngle}, 42, 85)`}>
            <rect x="37" y="84" width="10" height="20" rx="4" fill="#1D4ED8" />
            {/* Shoe */}
            <path
              d="M 33 102 C 33 98 47 98 51 102 L 53 108 C 53 111 31 111 31 108 Z"
              fill={shoeColor}
            />
            <rect x="31" y="106" width="22" height="3" rx="1.5" fill="#FFFFFF" />
          </g>

          {/* Right Leg */}
          <g transform={`rotate(${legRightAngle}, 58, 85)`}>
            <rect x="53" y="84" width="10" height="20" rx="4" fill="#1D4ED8" />
            {/* Shoe */}
            <path
              d="M 49 102 C 49 98 63 98 67 102 L 69 108 C 69 111 47 111 47 108 Z"
              fill={shoeColor}
            />
            <rect x="47" y="106" width="22" height="3" rx="1.5" fill="#FFFFFF" />
          </g>

          {/* TORSO / SHIRT */}
          <rect x="36" y="58" width="28" height="26" rx="6" fill={shirtColor} />

          {/* OVERALLS */}
          <path
            d="M 36 68 L 64 68 L 65 92 C 65 94 62 96 59 96 L 41 96 C 38 96 35 94 35 92 Z"
            fill={overallColor}
          />
          {/* Overalls Straps */}
          <rect x="38" y="58" width="6" height="18" rx="2" fill="#1E40AF" />
          <rect x="56" y="58" width="6" height="18" rx="2" fill="#1E40AF" />
          {/* Golden Buttons */}
          <circle cx="41" cy="74" r="2.2" fill={buttonColor} />
          <circle cx="59" cy="74" r="2.2" fill={buttonColor} />
          {/* Pocket */}
          <path
            d="M 45 78 L 55 78 L 53 86 L 47 86 Z"
            fill="#1E40AF"
            stroke="#60A5FA"
            strokeWidth="0.8"
          />

          {/* ARMS */}
          {/* Left Arm */}
          <g transform={`rotate(${armLeftAngle}, 35, 62)`}>
            <rect x="25" y="60" width="10" height="18" rx="5" fill={shirtColor} />
            <circle cx="29" cy="79" r="5" fill={skinColor} />
          </g>
          {/* Right Arm */}
          <g transform={`rotate(${armRightAngle}, 65, 62)`}>
            <rect x="65" y="60" width="10" height="18" rx="5" fill={shirtColor} />
            <circle cx="71" cy="79" r="5" fill={skinColor} />
          </g>

          {/* HEAD & FACE */}
          {/* If Aisyah: Pink Hijab wrapping head */}
          {!isAdam && (
            <path
              d="M 27 42 C 27 22 73 22 73 42 C 73 58 71 68 50 68 C 29 68 27 58 27 42 Z"
              fill="#F472B6"
            />
          )}

          {/* Face base */}
          <ellipse cx="50" cy="46" rx="18" ry="17" fill={skinColor} />

          {/* Adam's hair */}
          {isAdam && (
            <path
              d="M 32 38 C 32 30 40 28 50 28 C 60 28 68 30 68 38 C 69 44 67 46 66 48 C 64 45 62 44 59 45 C 56 42 53 44 50 43 C 46 44 43 42 41 45 C 38 44 35 46 33 48 C 32 46 31 43 32 38 Z"
              fill="#1F2937"
            />
          )}

          {/* EYES */}
          {state === 'hurt' ? (
            // Dizzy/surprised eyes
            <g stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round">
              <line x1="40" y1="42" x2="46" y2="48" />
              <line x1="46" y1="42" x2="40" y2="48" />
              <line x1="54" y1="42" x2="60" y2="48" />
              <line x1="60" y1="42" x2="54" y2="48" />
            </g>
          ) : (
            <g>
              {/* Left Eye */}
              <ellipse cx="43" cy="46" rx="3.5" ry="4.5" fill="#111827" />
              <circle cx="42" cy="44" r="1.5" fill="#FFFFFF" />
              <circle cx="44.5" cy="47" r="0.7" fill="#FFFFFF" />
              {/* Right Eye */}
              <ellipse cx="57" cy="46" rx="3.5" ry="4.5" fill="#111827" />
              <circle cx="56" cy="44" r="1.5" fill="#FFFFFF" />
              <circle cx="58.5" cy="47" r="0.7" fill="#FFFFFF" />

              {/* Aisyah Eyelashes */}
              {!isAdam && (
                <>
                  <path d="M 40 43 Q 38 41 39 39" stroke="#111827" strokeWidth="1.2" fill="none" />
                  <path d="M 60 43 Q 62 41 61 39" stroke="#111827" strokeWidth="1.2" fill="none" />
                </>
              )}
            </g>
          )}

          {/* Rosy Cheeks */}
          <ellipse cx="37" cy="50" rx="3.5" ry="2" fill={blushColor} opacity="0.8" />
          <ellipse cx="63" cy="50" rx="3.5" ry="2" fill={blushColor} opacity="0.8" />

          {/* Nose */}
          <circle cx="50" cy="49" r="1.2" fill="#E09F76" />

          {/* Smile Mouth */}
          {state === 'hurt' ? (
            <ellipse cx="50" cy="54" rx="3" ry="3.5" fill="#991B1B" />
          ) : (
            <path
              d="M 45 52 Q 50 58 55 52"
              fill="#991B1B"
              stroke="#991B1B"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          )}

          {/* CAP (Topi) */}
          <g>
            {/* Cap Dome */}
            <path
              d="M 30 36 C 30 18 70 18 70 36 Z"
              fill={capColor}
            />
            {/* Cap Visor / Brim */}
            <path
              d="M 28 35 C 40 33 60 33 74 36 C 79 38 78 41 72 40 C 60 38 38 38 28 37 Z"
              fill={isAdam ? '#B91C1C' : '#DB2777'}
            />
            {/* Cap button on top */}
            <circle cx="50" cy="20" r="2.5" fill={isAdam ? '#FCA5A5' : '#FCE7F3'} />
            {/* Front Star Badge on Cap */}
            <polygon
              points="50,25 51.5,29 55.5,29 52.5,31.5 53.5,35.5 50,33 46.5,35.5 47.5,31.5 44.5,29 48.5,29"
              fill="#FDE047"
            />
          </g>

          {/* Aisyah's tidy hijab collar & pin */}
          {!isAdam && (
            <g>
              <path
                d="M 38 60 C 45 66 55 66 62 60 C 58 64 42 64 38 60 Z"
                fill="#DB2777"
              />
              <circle cx="50" cy="62" r="2" fill="#FDE047" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

/**
 * High-performance Canvas Character Drawer
 * Renders Adam and Aisyah cleanly on CanvasRenderingContext2D at 60 FPS
 */
export function drawCanvasCharacter(
  ctx: CanvasRenderingContext2D,
  type: CharacterType,
  x: number,
  y: number,
  width: number,
  height: number,
  facingRight: boolean,
  state: 'idle' | 'run' | 'jump' | 'fall' | 'hurt' | 'victory',
  frame: number,
  isInvulnerable: boolean
) {
  if (isInvulnerable && Math.floor(frame / 3) % 2 === 0) {
    // Flash transparent when invincible
    return;
  }

  ctx.save();
  ctx.translate(x + width / 2, y + height);

  if (!facingRight) {
    ctx.scale(-1, 1);
  }

  const isAdam = type === 'adam';
  const capColor = isAdam ? '#EF4444' : '#F472B6';
  const shirtColor = isAdam ? '#DC2626' : '#F9A8D4';
  const overallColor = '#2563EB';
  const shoeColor = isAdam ? '#DC2626' : '#EC4899';
  const skinColor = '#FBD3B6';
  const blushColor = '#FCA5A5';

  // Animation offsets
  let bounceY = 0;
  let legSpread = 0;
  let armSpread = 0;

  if (state === 'idle') {
    bounceY = Math.sin((frame * Math.PI) / 12) * 2;
  } else if (state === 'run') {
    bounceY = Math.abs(Math.sin((frame * Math.PI) / 6)) * -4;
    legSpread = Math.sin((frame * Math.PI) / 6) * 8;
    armSpread = -Math.sin((frame * Math.PI) / 6) * 10;
  } else if (state === 'jump') {
    bounceY = -6;
    legSpread = -6;
    armSpread = -12;
  } else if (state === 'fall') {
    bounceY = 2;
    armSpread = 8;
  } else if (state === 'victory') {
    bounceY = Math.sin((frame * Math.PI) / 8) * 6;
    armSpread = -16;
  }

  // Draw shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.beginPath();
  ctx.ellipse(0, -2, width * 0.35, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.translate(0, bounceY);

  // Scale relative to 40x48 base bounding box
  const s = width / 40;

  // LEGS & SHOES
  // Left leg
  ctx.fillStyle = '#1D4ED8';
  ctx.fillRect((-9 + legSpread) * s, -14 * s, 6 * s, 10 * s);
  ctx.fillStyle = shoeColor;
  ctx.beginPath();
  ctx.roundRect((-12 + legSpread) * s, -6 * s, 10 * s, 6 * s, 3 * s);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect((-12 + legSpread) * s, -2 * s, 10 * s, 2 * s);

  // Right leg
  ctx.fillStyle = '#1D4ED8';
  ctx.fillRect((3 - legSpread) * s, -14 * s, 6 * s, 10 * s);
  ctx.fillStyle = shoeColor;
  ctx.beginPath();
  ctx.roundRect((0 - legSpread) * s, -6 * s, 10 * s, 6 * s, 3 * s);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect((0 - legSpread) * s, -2 * s, 10 * s, 2 * s);

  // BODY & SHIRT
  ctx.fillStyle = shirtColor;
  ctx.beginPath();
  ctx.roundRect(-10 * s, -28 * s, 20 * s, 16 * s, 4 * s);
  ctx.fill();

  // OVERALLS
  ctx.fillStyle = overallColor;
  ctx.beginPath();
  ctx.roundRect(-9 * s, -22 * s, 18 * s, 10 * s, 3 * s);
  ctx.fill();

  // Straps
  ctx.fillStyle = '#1E40AF';
  ctx.fillRect(-8 * s, -27 * s, 4 * s, 8 * s);
  ctx.fillRect(4 * s, -27 * s, 4 * s, 8 * s);

  // Golden buttons
  ctx.fillStyle = '#FBBF24';
  ctx.beginPath();
  ctx.arc(-6 * s, -20 * s, 1.5 * s, 0, Math.PI * 2);
  ctx.arc(6 * s, -20 * s, 1.5 * s, 0, Math.PI * 2);
  ctx.fill();

  // ARMS
  // Left arm
  ctx.fillStyle = shirtColor;
  ctx.beginPath();
  ctx.roundRect((-15 + armSpread) * s, -26 * s, 5 * s, 12 * s, 2.5 * s);
  ctx.fill();
  ctx.fillStyle = skinColor;
  ctx.beginPath();
  ctx.arc((-12.5 + armSpread) * s, -14 * s, 3 * s, 0, Math.PI * 2);
  ctx.fill();

  // Right arm
  ctx.fillStyle = shirtColor;
  ctx.beginPath();
  ctx.roundRect((10 - armSpread) * s, -26 * s, 5 * s, 12 * s, 2.5 * s);
  ctx.fill();
  ctx.fillStyle = skinColor;
  ctx.beginPath();
  ctx.arc((12.5 - armSpread) * s, -14 * s, 3 * s, 0, Math.PI * 2);
  ctx.fill();

  // HEAD & FACE
  if (!isAdam) {
    // Aisyah Pink Hijab base
    ctx.fillStyle = '#F472B6';
    ctx.beginPath();
    ctx.arc(0, -35 * s, 13 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  // Face
  ctx.fillStyle = skinColor;
  ctx.beginPath();
  ctx.arc(0, -34 * s, 10 * s, 0, Math.PI * 2);
  ctx.fill();

  if (isAdam) {
    // Hair
    ctx.fillStyle = '#1F2937';
    ctx.beginPath();
    ctx.arc(0, -37 * s, 10.5 * s, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill();
  }

  // Eyes
  if (state === 'hurt') {
    ctx.strokeStyle = '#1F2937';
    ctx.lineWidth = 1.5 * s;
    ctx.beginPath();
    ctx.moveTo(-4 * s, -36 * s);
    ctx.lineTo(-1 * s, -33 * s);
    ctx.moveTo(-1 * s, -36 * s);
    ctx.lineTo(-4 * s, -33 * s);

    ctx.moveTo(1 * s, -36 * s);
    ctx.lineTo(4 * s, -33 * s);
    ctx.moveTo(4 * s, -36 * s);
    ctx.lineTo(1 * s, -33 * s);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.ellipse(-3.5 * s, -34 * s, 1.8 * s, 2.5 * s, 0, 0, Math.PI * 2);
    ctx.ellipse(3.5 * s, -34 * s, 1.8 * s, 2.5 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye catchlights
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-4 * s, -35 * s, 0.9 * s, 0, Math.PI * 2);
    ctx.arc(3 * s, -35 * s, 0.9 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  // Cheeks
  ctx.fillStyle = blushColor;
  ctx.beginPath();
  ctx.arc(-6.5 * s, -31 * s, 2 * s, 0, Math.PI * 2);
  ctx.arc(6.5 * s, -31 * s, 2 * s, 0, Math.PI * 2);
  ctx.fill();

  // Smile
  ctx.strokeStyle = '#991B1B';
  ctx.lineWidth = 1.2 * s;
  ctx.beginPath();
  ctx.arc(0, -32 * s, 2.5 * s, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // CAP
  ctx.fillStyle = capColor;
  ctx.beginPath();
  ctx.arc(0, -40 * s, 10 * s, Math.PI * 0.9, Math.PI * 2.1);
  ctx.fill();

  // Visor / Brim
  ctx.fillStyle = isAdam ? '#B91C1C' : '#DB2777';
  ctx.beginPath();
  ctx.ellipse(3 * s, -38 * s, 10 * s, 2.5 * s, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Cap star
  ctx.fillStyle = '#FDE047';
  ctx.beginPath();
  ctx.arc(0, -42 * s, 2 * s, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
