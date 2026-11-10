'use client';

interface HeritageBannerProps {
  banner: string;
  color: string;
}

export default function HeritageBanner({ banner, color }: HeritageBannerProps) {
  const commonProps = { width: '100%', height: '160', viewBox: '0 0 400 160', preserveAspectRatio: 'xMidYMid slice' };

  const gradId = `bg-${banner}`;
  const accentGradId = `accent-${banner}`;

  return (
    <svg {...commonProps}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="50%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id={accentGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect width="400" height="160" fill={`url(#${gradId})`} />
      {renderBannerContent(banner, color, gradId, accentGradId)}
    </svg>
  );
}

function renderBannerContent(banner: string, color: string, gradId: string, accentGradId: string) {
  const stroke = color;
  const sw = 1.2;
  const sw2 = 0.8;
  const op = 0.5;
  const op2 = 0.35;
  const op3 = 0.2;

  switch (banner) {
    case 'opera':
      return (
        <g>
          <path d="M40 140 Q40 30 200 30 Q360 30 360 140" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M60 140 Q60 50 200 50 Q340 50 340 140" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M120 70 L120 130 M120 70 Q150 60 180 70 L180 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M220 70 L220 130 M220 70 Q250 60 280 70 L280 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="150" cy="100" r="8" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="250" cy="100" r="8" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M100 20 Q120 10 140 20" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M260 20 Q280 10 300 20" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M180 15 Q200 5 220 15" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
        </g>
      );

    case 'guqin':
      return (
        <g>
          <path d="M60 80 L340 80 L340 90 L60 90 Z" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <line x1="80" y1="82" x2="80" y2="88" stroke={stroke} strokeWidth={0.5} opacity={op2} />
          <line x1="100" y1="82" x2="100" y2="88" stroke={stroke} strokeWidth={0.5} opacity={op2} />
          <line x1="120" y1="82" x2="120" y2="88" stroke={stroke} strokeWidth={0.5} opacity={op2} />
          <line x1="140" y1="82" x2="140" y2="88" stroke={stroke} strokeWidth={0.5} opacity={op2} />
          <line x1="160" y1="82" x2="160" y2="88" stroke={stroke} strokeWidth={0.5} opacity={op2} />
          <line x1="180" y1="82" x2="180" y2="88" stroke={stroke} strokeWidth={0.5} opacity={op2} />
          <line x1="200" y1="82" x2="200" y2="88" stroke={stroke} strokeWidth={0.5} opacity={op2} />
          <circle cx="90" cy="85" r="3" fill="none" stroke={stroke} strokeWidth={0.5} opacity={op2} />
          <circle cx="130" cy="85" r="3" fill="none" stroke={stroke} strokeWidth={0.5} opacity={op2} />
          <circle cx="170" cy="85" r="3" fill="none" stroke={stroke} strokeWidth={0.5} opacity={op2} />
          <circle cx="210" cy="85" r="3" fill="none" stroke={stroke} strokeWidth={0.5} opacity={op2} />
          <path d="M40 120 Q80 110 120 120 Q160 130 200 120 Q240 110 280 120 Q320 130 360 120" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M40 140 Q80 130 120 140 Q160 150 200 140 Q240 130 280 140 Q320 150 360 140" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M30 40 Q50 30 70 40" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M330 40 Q350 30 370 40" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
        </g>
      );

    case 'grassland':
      return (
        <g>
          <path d="M0 100 Q100 80 200 100 Q300 120 400 100" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M0 120 Q100 100 200 120 Q300 140 400 120" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M0 140 Q100 120 200 140 Q300 160 400 140" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M80 100 Q75 70 85 50 Q95 30 90 20" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M85 50 Q80 45 90 40" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M90 20 Q95 15 100 20" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M280 100 Q275 70 285 50 Q295 30 290 20" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M285 50 Q280 45 290 40" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="340" cy="35" r="12" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M150 110 Q160 100 170 110" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M230 110 Q240 100 250 110" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M120 130 Q130 120 140 130" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M260 130 Q270 120 280 130" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
        </g>
      );

    case 'muqam':
      return (
        <g>
          <path d="M40 140 L40 60 Q40 40 60 40 L100 40 Q120 40 120 60 L120 140" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M60 40 Q80 20 100 40" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="80" cy="30" r="4" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M160 80 Q180 50 200 80 Q220 110 200 80" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="200" cy="80" r="6" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M240 60 L240 130 M250 60 L250 130 M260 60 L260 130" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M240 70 L260 70 M240 90 L260 90 M240 110 L260 110" stroke={stroke} strokeWidth={0.5} opacity={op3} />
          <path d="M300 50 Q320 30 340 50 Q360 70 340 90 Q320 110 340 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="340" cy="50" r="3" fill={stroke} opacity={op2} />
          <circle cx="320" cy="90" r="3" fill={stroke} opacity={op2} />
        </g>
      );

    case 'calligraphy':
      return (
        <g>
          <path d="M70 30 L70 130" stroke={stroke} strokeWidth={3} opacity={op} strokeLinecap="round" />
          <path d="M70 30 Q80 35 75 45" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M100 40 Q120 30 140 40 Q130 60 110 50" fill="none" stroke={stroke} strokeWidth={2} opacity={op} />
          <path d="M110 50 Q115 70 105 80" fill="none" stroke={stroke} strokeWidth={1.5} opacity={op2} />
          <path d="M160 35 Q180 25 200 35 Q190 55 170 45" fill="none" stroke={stroke} strokeWidth={2} opacity={op} />
          <path d="M170 45 Q175 65 165 75" fill="none" stroke={stroke} strokeWidth={1.5} opacity={op2} />
          <rect x="240" y="50" width="50" height="40" rx="3" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <rect x="250" y="60" width="30" height="20" rx="2" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M310 40 Q330 30 350 40 Q340 60 320 50" fill="none" stroke={stroke} strokeWidth={2} opacity={op} />
          <path d="M320 50 Q325 70 315 80" fill="none" stroke={stroke} strokeWidth={1.5} opacity={op2} />
          <circle cx="270" cy="110" r="8" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
        </g>
      );

    case 'papercut':
      return (
        <g>
          <path d="M60 40 Q80 20 100 40 Q80 60 60 40 Z" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M70 40 Q80 30 90 40 Q80 50 70 40 Z" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M120 60 Q140 40 160 60 Q140 80 120 60 Z" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M130 60 Q140 50 150 60 Q140 70 130 60 Z" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M180 40 Q200 20 220 40 Q200 60 180 40 Z" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M190 40 Q200 30 210 40 Q200 50 190 40 Z" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M240 60 Q260 40 280 60 Q260 80 240 60 Z" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M250 60 Q260 50 270 60 Q260 70 250 60 Z" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M300 40 Q320 20 340 40 Q320 60 300 40 Z" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M310 40 Q320 30 330 40 Q320 50 310 40 Z" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M80 90 Q100 80 120 90 Q100 100 80 90" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M200 90 Q220 80 240 90 Q220 100 200 90" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M320 90 Q340 80 360 90 Q340 100 320 90" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M40 110 Q200 100 360 110" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
        </g>
      );

    case 'tea':
      return (
        <g>
          <path d="M60 50 Q70 30 80 50 Q90 70 80 90 Q70 110 80 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M70 40 Q75 35 80 40" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <ellipse cx="75" cy="55" rx="8" ry="4" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M120 50 Q130 30 140 50 Q150 70 140 90 Q130 110 140 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <ellipse cx="135" cy="55" rx="8" ry="4" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M200 70 L200 130 M200 70 Q230 65 260 70 L260 130 Q230 125 200 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M260 80 Q280 75 280 95 Q280 115 260 110" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <ellipse cx="230" cy="70" rx="30" ry="5" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M320 100 Q330 80 340 100 Q350 120 340 100" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <circle cx="340" cy="100" r="4" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M310 130 Q330 120 350 130" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
        </g>
      );

    case 'porcelain':
      return (
        <g>
          <path d="M100 40 Q100 30 110 30 L130 30 Q140 30 140 40 L140 50 Q150 55 150 70 L150 110 Q150 125 140 130 L100 130 Q90 125 90 110 L90 70 Q90 55 100 50 Z" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <ellipse cx="120" cy="40" rx="20" ry="5" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M100 60 Q120 55 140 60" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M100 80 Q120 75 140 80" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M100 100 Q120 95 140 100" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M200 50 Q200 40 210 40 L230 40 Q240 40 240 50 L240 60 Q245 65 245 80 L245 110 Q245 120 240 125 L200 125 Q195 120 195 110 L195 80 Q195 65 200 60 Z" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <ellipse cx="220" cy="50" rx="20" ry="4" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M280 60 Q280 50 290 50 L310 50 Q320 50 320 60 L320 70 Q325 75 325 85 L325 110 Q325 118 320 122 L280 122 Q275 118 275 110 L275 85 Q275 75 280 70 Z" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <ellipse cx="300" cy="60" rx="20" ry="3" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M30 140 Q200 130 370 140" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
        </g>
      );

    case 'embroidery':
      return (
        <g>
          <path d="M60 30 Q80 20 100 30 Q120 40 140 30" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M60 50 Q80 40 100 50 Q120 60 140 50" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M60 70 Q80 60 100 70 Q120 80 140 70" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M160 40 Q180 20 200 40 Q220 60 200 80 Q180 100 200 120" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="200" cy="40" r="4" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M240 30 Q260 20 280 30 Q300 40 320 30" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M240 50 Q260 40 280 50 Q300 60 320 50" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M240 70 Q260 60 280 70 Q300 80 320 70" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M340 40 Q350 30 360 40 Q350 50 340 40" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M340 60 Q350 50 360 60 Q350 70 340 60" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M340 80 Q350 70 360 80 Q350 90 340 80" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
        </g>
      );

    case 'architecture':
      return (
        <g>
          <path d="M80 130 L80 60 L120 40 L160 60 L160 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M70 60 L130 35 L190 60" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M60 60 L140 30 L220 60" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <rect x="95" y="70" width="15" height="25" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <rect x="130" y="70" width="15" height="25" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M85 60 Q100 55 115 60 Q130 55 145 60 Q160 55 175 60" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M85 50 Q100 45 115 50 Q130 45 145 50 Q160 45 175 50" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M240 130 L240 80 L280 60 L320 80 L320 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M230 80 L290 55 L350 80" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <rect x="260" y="90" width="12" height="20" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <rect x="290" y="90" width="12" height="20" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M245 80 Q260 75 275 80 Q290 75 305 80 Q320 75 335 80" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
        </g>
      );

    case 'acupuncture':
      return (
        <g>
          <circle cx="100" cy="80" r="35" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M100 45 L100 115" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M65 80 L135 80" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="100" cy="60" r="3" fill={stroke} opacity={op} />
          <circle cx="100" cy="100" r="3" fill={stroke} opacity={op} />
          <circle cx="80" cy="80" r="3" fill={stroke} opacity={op} />
          <circle cx="120" cy="80" r="3" fill={stroke} opacity={op} />
          <path d="M100 60 L100 45" stroke={stroke} strokeWidth={1} opacity={op} />
          <path d="M100 100 L100 115" stroke={stroke} strokeWidth={1} opacity={op} />
          <path d="M80 80 L65 80" stroke={stroke} strokeWidth={1} opacity={op} />
          <path d="M120 80 L135 80" stroke={stroke} strokeWidth={1} opacity={op} />
          <path d="M170 50 Q190 30 210 50 Q230 70 210 90 Q190 110 210 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="210" cy="50" r="3" fill={stroke} opacity={op2} />
          <circle cx="190" cy="90" r="3" fill={stroke} opacity={op2} />
          <path d="M260 40 L260 130 M260 40 L300 40 L300 130 L260 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M270 55 L290 55 M270 70 L290 70 M270 85 L290 85 M270 100 L290 100" stroke={stroke} strokeWidth={0.5} opacity={op3} />
          <path d="M330 60 Q350 40 370 60 Q350 80 330 60" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
        </g>
      );

    case 'herb':
      return (
        <g>
          <path d="M70 30 Q80 20 90 30 Q80 40 70 30" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M80 30 L80 60" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M75 45 Q85 40 80 50" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M120 30 Q130 20 140 30 Q130 40 120 30" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M130 30 L130 60" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M125 45 Q135 40 130 50" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <ellipse cx="200" cy="90" rx="40" ry="20" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <ellipse cx="200" cy="90" rx="35" ry="15" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M170 80 Q180 70 190 80" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M210 80 Q220 70 230 80" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M160 70 Q170 50 180 70" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M220 70 Q230 50 240 70" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M280 40 Q290 30 300 40 Q290 50 280 40" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M290 40 L290 70" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M320 40 Q330 30 340 40 Q330 50 320 40" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M330 40 L330 70" stroke={stroke} strokeWidth={sw2} opacity={op2} />
        </g>
      );

    case 'taichi':
      return (
        <g>
          <circle cx="120" cy="80" r="40" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M120 40 A40 40 0 0 1 120 120 A20 20 0 0 0 120 80 A20 20 0 0 1 120 40" fill={stroke} opacity={op2} />
          <circle cx="120" cy="60" r="5" fill={stroke} opacity={op} />
          <circle cx="120" cy="100" r="5" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op} />
          <path d="M200 50 Q220 30 240 50 Q260 70 240 90 Q220 110 240 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="240" cy="50" r="4" fill={stroke} opacity={op2} />
          <circle cx="220" cy="90" r="4" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M280 40 Q300 30 320 40 Q340 50 360 40" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M280 80 Q300 70 320 80 Q340 90 360 80" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M280 120 Q300 110 320 120 Q340 130 360 120" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
        </g>
      );

    case 'pekingopera':
      return (
        <g>
          <ellipse cx="100" cy="80" rx="35" ry="45" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M75 60 Q100 50 125 60" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M80 70 Q90 65 100 70 Q110 65 120 70" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="88" cy="80" r="5" fill={stroke} opacity={op} />
          <circle cx="112" cy="80" r="5" fill={stroke} opacity={op} />
          <path d="M90 95 Q100 90 110 95" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M70 50 Q85 30 100 35 Q115 30 130 50" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M75 35 Q100 20 125 35" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M180 50 Q200 30 220 50 Q240 70 220 90 Q200 110 220 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="220" cy="50" r="4" fill={stroke} opacity={op2} />
          <path d="M260 60 Q280 40 300 60 Q320 80 300 100 Q280 120 300 140" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="300" cy="60" r="3" fill={stroke} opacity={op2} />
          <circle cx="280" cy="100" r="3" fill={stroke} opacity={op2} />
        </g>
      );

    case 'dragonboat':
      return (
        <g>
          <path d="M30 90 Q50 70 80 80 L320 80 Q350 70 370 90" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M30 90 Q20 85 30 80" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M370 90 Q380 85 370 80" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M30 95 Q50 75 80 85 L320 85 Q350 75 370 95" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="30" cy="85" r="6" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="30" cy="85" r="3" fill={stroke} opacity={op} />
          <path d="M100 70 L100 80 M140 65 L140 80 M180 70 L180 80 M220 65 L220 80 M260 70 L260 80 M300 65 L300 80" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M0 110 Q100 100 200 110 Q300 120 400 110" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M0 125 Q100 115 200 125 Q300 135 400 125" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M0 140 Q100 130 200 140 Q300 150 400 140" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
        </g>
      );

    case 'springfestival':
      return (
        <g>
          <ellipse cx="80" cy="60" rx="25" ry="30" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M80 30 L80 90" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M55 60 L105 60" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <rect x="70" y="50" width="20" height="20" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M75 30 Q70 20 80 15 Q90 20 85 30" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <ellipse cx="200" cy="60" rx="25" ry="30" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M200 30 L200 90" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M175 60 L225 60" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <rect x="190" y="50" width="20" height="20" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M195 30 Q190 20 200 15 Q210 20 205 30" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M260 30 L260 130 M260 30 L310 30 L310 130 L260 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M270 45 L300 45 M270 60 L300 60 M270 75 L300 75 M270 90 L300 90 M270 105 L300 105" stroke={stroke} strokeWidth={0.5} opacity={op3} />
          <path d="M340 40 Q350 20 360 40 Q350 60 340 40" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M350 30 L350 50" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M340 80 Q350 60 360 80 Q350 100 340 80" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M350 70 L350 90" stroke={stroke} strokeWidth={sw2} opacity={op3} />
        </g>
      );

    case 'solarterms':
      return (
        <g>
          <circle cx="200" cy="80" r="50" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="200" cy="80" r="40" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="200" cy="80" r="30" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="200" cy="80" r="20" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <circle cx="200" cy="80" r="10" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <line x1="200" y1="30" x2="200" y2="130" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <line x1="150" y1="80" x2="250" y2="80" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <line x1="165" y1="45" x2="235" y2="115" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <line x1="165" y1="115" x2="235" y2="45" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <circle cx="200" cy="30" r="4" fill={stroke} opacity={op} />
          <circle cx="200" cy="130" r="4" fill={stroke} opacity={op} />
          <circle cx="150" cy="80" r="4" fill={stroke} opacity={op} />
          <circle cx="250" cy="80" r="4" fill={stroke} opacity={op} />
          <circle cx="165" cy="45" r="3" fill={stroke} opacity={op2} />
          <circle cx="235" cy="115" r="3" fill={stroke} opacity={op2} />
          <circle cx="165" cy="115" r="3" fill={stroke} opacity={op2} />
          <circle cx="235" cy="45" r="3" fill={stroke} opacity={op2} />
          <circle cx="200" cy="80" r="5" fill={stroke} opacity={op} />
        </g>
      );

    case 'mazu':
      return (
        <g>
          <path d="M40 130 L40 70 Q40 50 60 50 L100 50 Q120 50 120 70 L120 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M50 50 Q80 30 110 50" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M55 50 Q80 35 105 50" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <rect x="65" y="80" width="15" height="25" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <rect x="85" y="80" width="15" height="25" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M160 90 Q180 70 200 90 Q220 110 200 90" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M200 90 L230 80 L250 90" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M160 90 L150 85" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M250 90 L260 85" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M180 75 L180 65 M200 70 L200 60 M220 75 L220 65" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M280 100 Q300 80 320 100 Q340 120 320 100" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M0 140 Q100 130 200 140 Q300 150 400 140" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
        </g>
      );

    case 'gesar':
      return (
        <g>
          <path d="M0 120 Q100 100 200 120 Q300 140 400 120" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M0 140 Q100 120 200 140 Q300 160 400 140" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M80 120 Q75 90 85 70 Q95 50 90 40" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M85 70 L100 65 L95 75" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M90 40 Q95 35 105 40" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M80 120 L70 115 L75 125" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="100" cy="55" r="5" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M160 120 Q155 90 165 70 Q175 50 170 40" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M165 70 L180 65 L175 75" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="180" cy="55" r="5" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M250 40 Q270 20 290 40 Q310 60 290 80 Q270 100 290 120" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="290" cy="40" r="4" fill={stroke} opacity={op2} />
          <circle cx="270" cy="80" r="4" fill={stroke} opacity={op2} />
          <path d="M330 50 Q350 30 370 50 Q350 70 330 50" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
        </g>
      );

    case 'butterfly':
      return (
        <g>
          <path d="M100 80 Q70 50 50 70 Q30 90 50 100 Q70 110 100 80" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M100 80 Q70 100 50 120 Q30 140 50 130 Q70 120 100 80" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M100 80 Q130 50 150 70 Q170 90 150 100 Q130 110 100 80" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M100 80 Q130 100 150 120 Q170 140 150 130 Q130 120 100 80" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <ellipse cx="100" cy="80" rx="4" ry="25" fill={stroke} opacity={op} />
          <circle cx="50" cy="70" r="4" fill={stroke} opacity={op2} />
          <circle cx="150" cy="70" r="4" fill={stroke} opacity={op2} />
          <path d="M100 55 L95 45 L100 50 L105 45" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M220 80 Q190 50 170 70 Q150 90 170 100 Q190 110 220 80" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M220 80 Q190 100 170 120 Q150 140 170 130 Q190 120 220 80" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M220 80 Q250 50 270 70 Q290 90 270 100 Q250 110 220 80" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M220 80 Q250 100 270 120 Q290 140 270 130 Q250 120 220 80" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <ellipse cx="220" cy="80" rx="4" ry="25" fill={stroke} opacity={op} />
          <circle cx="170" cy="70" r="4" fill={stroke} opacity={op2} />
          <circle cx="270" cy="70" r="4" fill={stroke} opacity={op2} />
          <path d="M220 55 L215 45 L220 50 L225 45" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M330 60 Q340 40 350 60 Q340 80 330 60" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M340 50 L340 70" stroke={stroke} strokeWidth={sw2} opacity={op3} />
        </g>
      );

    case 'yunjin':
      return (
        <g>
          <rect x="50" y="40" width="80" height="80" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <rect x="60" y="50" width="60" height="60" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M70 60 Q80 50 90 60 Q100 70 110 60" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M70 80 Q80 70 90 80 Q100 90 110 80" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M70 100 Q80 90 90 100 Q100 110 110 100" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M150 40 Q170 20 190 40 Q210 60 190 80 Q170 100 190 120" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="190" cy="40" r="4" fill={stroke} opacity={op2} />
          <circle cx="170" cy="80" r="4" fill={stroke} opacity={op2} />
          <rect x="230" y="40" width="80" height="80" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <rect x="240" y="50" width="60" height="60" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M250 60 Q260 50 270 60 Q280 70 290 60" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M250 80 Q260 70 270 80 Q280 90 290 80" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M250 100 Q260 90 270 100 Q280 110 290 100" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M330 60 Q340 40 350 60 Q340 80 330 60" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
        </g>
      );

    case 'shadow':
      return (
        <g>
          <rect x="40" y="30" width="120" height="100" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <rect x="50" y="40" width="100" height="80" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M70 50 Q80 45 90 50 L85 70 Q80 75 75 70 Z" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="80" cy="55" r="3" fill={stroke} opacity={op2} />
          <path d="M80 70 L80 90 M80 90 L75 110 M80 90 L85 110" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M80 75 L70 85 M80 75 L90 85" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M110 50 Q120 45 130 50 L125 70 Q120 75 115 70 Z" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="120" cy="55" r="3" fill={stroke} opacity={op2} />
          <path d="M120 70 L120 90 M120 90 L115 110 M120 90 L125 110" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M120 75 L110 85 M120 75 L130 85" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="200" cy="80" r="20" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M200 60 L200 100 M180 80 L220 80" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M250 40 L250 130 M250 40 L290 40 L290 130 L250 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M260 55 L280 55 M260 70 L280 70 M260 85 L280 85 M260 100 L280 100" stroke={stroke} strokeWidth={0.5} opacity={op3} />
          <path d="M320 60 Q340 40 360 60 Q340 80 320 60" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
        </g>
      );

    case 'silver':
      return (
        <g>
          <circle cx="80" cy="60" r="20" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="80" cy="60" r="15" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="80" cy="60" r="10" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M65 50 Q70 40 80 45 Q90 40 95 50" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M65 70 Q70 80 80 75 Q90 80 95 70" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="80" cy="60" r="3" fill={stroke} opacity={op} />
          <path d="M120 50 Q140 30 160 50 Q180 70 160 90 Q140 110 160 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="160" cy="50" r="4" fill={stroke} opacity={op2} />
          <circle cx="140" cy="90" r="4" fill={stroke} opacity={op2} />
          <circle cx="220" cy="60" r="20" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="220" cy="60" r="15" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M205 50 Q210 40 220 45 Q230 40 235 50" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M205 70 Q210 80 220 75 Q230 80 235 70" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="220" cy="60" r="3" fill={stroke} opacity={op} />
          <path d="M260 40 Q280 20 300 40 Q320 60 300 80 Q280 100 300 120" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="300" cy="40" r="3" fill={stroke} opacity={op2} />
          <path d="M340 50 Q350 40 360 50 Q350 60 340 50" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M340 70 Q350 60 360 70 Q350 80 340 70" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
        </g>
      );

    case 'printing':
      return (
        <g>
          <rect x="50" y="40" width="100" height="80" rx="3" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <line x1="60" y1="55" x2="140" y2="55" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <line x1="60" y1="65" x2="140" y2="65" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <line x1="60" y1="75" x2="135" y2="75" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <line x1="60" y1="85" x2="140" y2="85" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <line x1="60" y1="95" x2="130" y2="95" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <line x1="60" y1="105" x2="140" y2="105" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M170 50 Q190 30 210 50 Q230 70 210 90 Q190 110 210 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="210" cy="50" r="4" fill={stroke} opacity={op2} />
          <circle cx="190" cy="90" r="4" fill={stroke} opacity={op2} />
          <rect x="250" y="40" width="100" height="80" rx="3" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <line x1="260" y1="55" x2="340" y2="55" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <line x1="260" y1="65" x2="340" y2="65" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <line x1="260" y1="75" x2="335" y2="75" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <line x1="260" y1="85" x2="340" y2="85" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <line x1="260" y1="95" x2="330" y2="95" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <line x1="260" y1="105" x2="340" y2="105" stroke={stroke} strokeWidth={sw2} opacity={op2} />
        </g>
      );

    case 'thangka':
      return (
        <g>
          <rect x="80" y="20" width="80" height="120" rx="4" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <rect x="90" y="30" width="60" height="100" rx="2" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="120" cy="60" r="15" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="120" cy="60" r="10" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="120" cy="60" r="5" fill={stroke} opacity={op2} />
          <path d="M105 80 Q120 75 135 80" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M100 90 Q120 85 140 90" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M95 100 Q120 95 145 100" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M100 110 Q120 105 140 110" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M80 20 L70 10 M160 20 L170 10" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M80 140 L70 150 M160 140 L170 150" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M200 50 Q220 30 240 50 Q260 70 240 90 Q220 110 240 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="240" cy="50" r="4" fill={stroke} opacity={op2} />
          <circle cx="220" cy="90" r="4" fill={stroke} opacity={op2} />
          <path d="M280 30 L280 130 M280 30 L330 30 L330 130 L280 130" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M290 45 L320 45 M290 60 L320 60 M290 75 L320 75 M290 90 L320 90 M290 105 L320 105" stroke={stroke} strokeWidth={0.5} opacity={op3} />
        </g>
      );

    case 'silk':
      return (
        <g>
          <ellipse cx="70" cy="50" rx="15" ry="20" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M65 35 Q70 25 75 35" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M70 70 L70 90" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M60 55 Q50 60 45 70" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M80 55 Q90 60 95 70" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M120 40 Q140 20 160 40 Q180 60 160 80 Q140 100 160 120" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="160" cy="40" r="4" fill={stroke} opacity={op2} />
          <circle cx="140" cy="80" r="4" fill={stroke} opacity={op2} />
          <path d="M200 30 Q220 20 240 30" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M200 50 Q220 40 240 50" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M200 70 Q220 60 240 70" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M200 90 Q220 80 240 90" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M200 110 Q220 100 240 110" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M260 40 Q280 20 300 40 Q320 60 300 80 Q280 100 300 120" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="300" cy="40" r="3" fill={stroke} opacity={op3} />
          <path d="M340 50 Q350 30 360 50 Q350 70 340 50" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
        </g>
      );

    case 'celadon':
      return (
        <g>
          <path d="M80 50 Q80 40 90 40 L110 40 Q120 40 120 50 L120 55 Q125 60 125 70 L125 110 Q125 120 120 125 L80 125 Q75 120 75 110 L75 70 Q75 60 80 55 Z" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <ellipse cx="100" cy="50" rx="20" ry="5" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M80 65 Q100 60 120 65" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M80 85 Q100 80 120 85" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M80 105 Q100 100 120 105" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <ellipse cx="200" cy="70" rx="35" ry="15" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <ellipse cx="200" cy="70" rx="30" ry="10" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M170 80 Q200 75 230 80" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M180 90 Q200 85 220 90" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M270 50 Q270 40 280 40 L300 40 Q310 40 310 50 L310 55 Q315 60 315 70 L315 110 Q315 120 310 125 L270 125 Q265 120 265 110 L265 70 Q265 60 270 55 Z" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <ellipse cx="290" cy="50" rx="20" ry="4" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M270 65 Q290 60 310 65" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M270 85 Q290 80 310 85" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
        </g>
      );

    case 'xuanpaper':
      return (
        <g>
          <rect x="50" y="30" width="60" height="100" rx="2" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <line x1="55" y1="40" x2="105" y2="40" stroke={stroke} strokeWidth={0.5} opacity={op3} />
          <line x1="55" y1="50" x2="105" y2="50" stroke={stroke} strokeWidth={0.5} opacity={op3} />
          <line x1="55" y1="60" x2="100" y2="60" stroke={stroke} strokeWidth={0.5} opacity={op3} />
          <line x1="55" y1="70" x2="105" y2="70" stroke={stroke} strokeWidth={0.5} opacity={op3} />
          <line x1="55" y1="80" x2="95" y2="80" stroke={stroke} strokeWidth={0.5} opacity={op3} />
          <line x1="55" y1="90" x2="105" y2="90" stroke={stroke} strokeWidth={0.5} opacity={op3} />
          <line x1="55" y1="100" x2="100" y2="100" stroke={stroke} strokeWidth={0.5} opacity={op3} />
          <line x1="55" y1="110" x2="105" y2="110" stroke={stroke} strokeWidth={0.5} opacity={op3} />
          <path d="M130 40 L130 130 M130 40 L180 40 L180 130 L130 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M140 55 L170 55 M140 70 L170 70 M140 85 L170 85 M140 100 L170 100 M140 115 L170 115" stroke={stroke} strokeWidth={0.5} opacity={op3} />
          <path d="M200 30 Q220 20 240 30" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M200 50 Q220 40 240 50" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M200 70 Q220 60 240 70" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M200 90 Q220 80 240 90" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M200 110 Q220 100 240 110" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M270 40 Q290 20 310 40 Q330 60 310 80 Q290 100 310 120" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="310" cy="40" r="4" fill={stroke} opacity={op2} />
          <circle cx="290" cy="80" r="4" fill={stroke} opacity={op2} />
        </g>
      );

    case 'drum':
      return (
        <g>
          <ellipse cx="100" cy="60" rx="40" ry="15" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M60 60 L60 100 Q60 110 100 110 Q140 110 140 100 L140 60" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <ellipse cx="100" cy="100" rx="40" ry="10" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M70 60 Q80 55 90 60 Q100 65 110 60 Q120 55 130 60" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M70 80 Q80 75 90 80 Q100 85 110 80 Q120 75 130 80" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M180 40 L180 130 M180 40 L220 40 L220 130 L180 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M190 55 L210 55 M190 70 L210 70 M190 85 L210 85 M190 100 L210 100 M190 115 L210 115" stroke={stroke} strokeWidth={0.5} opacity={op3} />
          <path d="M250 60 Q270 40 290 60 Q310 80 290 100 Q270 120 290 140" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="290" cy="60" r="4" fill={stroke} opacity={op2} />
          <circle cx="270" cy="100" r="4" fill={stroke} opacity={op2} />
          <ellipse cx="350" cy="70" rx="25" ry="10" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M325 70 L325 100 Q325 108 350 108 Q375 108 375 100 L375 70" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
        </g>
      );

    case 'cantoneseopera':
      return (
        <g>
          <path d="M40 140 Q40 30 200 30 Q360 30 360 140" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M60 140 Q60 50 200 50 Q340 50 340 140" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <ellipse cx="120" cy="80" rx="20" ry="25" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="115" cy="75" r="3" fill={stroke} opacity={op} />
          <circle cx="125" cy="75" r="3" fill={stroke} opacity={op} />
          <path d="M115 85 Q120 82 125 85" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M100 55 Q120 45 140 55" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M110 45 Q120 35 130 45" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <ellipse cx="220" cy="80" rx="20" ry="25" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="215" cy="75" r="3" fill={stroke} opacity={op} />
          <circle cx="225" cy="75" r="3" fill={stroke} opacity={op} />
          <path d="M215 85 Q220 82 225 85" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M200 55 Q220 45 240 55" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M210 45 Q220 35 230 45" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M280 50 Q300 30 320 50 Q340 70 320 90 Q300 110 320 130" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="320" cy="50" r="3" fill={stroke} opacity={op3} />
        </g>
      );

    case 'flower':
      return (
        <g>
          <path d="M0 120 Q100 100 200 120 Q300 140 400 120" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M0 140 Q100 120 200 140 Q300 160 400 140" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M60 120 Q55 90 65 70" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="65" cy="70" r="8" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="65" cy="70" r="4" fill={stroke} opacity={op2} />
          <path d="M60 80 Q50 75 55 65" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M70 80 Q80 75 75 65" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M140 120 Q135 85 145 65" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="145" cy="65" r="10" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="145" cy="65" r="5" fill={stroke} opacity={op2} />
          <path d="M140 75 Q130 70 135 60" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M150 75 Q160 70 155 60" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M240 120 Q235 90 245 70" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="245" cy="70" r="8" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="245" cy="70" r="4" fill={stroke} opacity={op2} />
          <path d="M340 120 Q335 85 345 65" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="345" cy="65" r="10" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="345" cy="65" r="5" fill={stroke} opacity={op2} />
          <path d="M340 75 Q330 70 335 60" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M350 75 Q360 70 355 60" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
        </g>
      );

    case 'farmerdance':
      return (
        <g>
          <circle cx="80" cy="50" r="12" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M80 62 L80 100 M80 75 L65 85 M80 75 L95 85 M80 100 L70 120 M80 100 L90 120" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <ellipse cx="80" cy="40" rx="15" ry="5" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <ellipse cx="200" cy="60" rx="30" ry="10" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M170 60 L170 100 Q170 110 200 110 Q230 110 230 100 L230 60" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <ellipse cx="200" cy="100" rx="30" ry="8" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M180 60 Q190 55 200 60 Q210 65 220 60" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="320" cy="50" r="12" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M320 62 L320 100 M320 75 L305 85 M320 75 L335 85 M320 100 L310 120 M320 100 L330 120" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <ellipse cx="320" cy="40" rx="15" ry="5" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M0 140 Q200 130 400 140" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
        </g>
      );

    case 'throat':
      return (
        <g>
          <path d="M0 100 Q100 80 200 100 Q300 120 400 100" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M0 120 Q100 100 200 120 Q300 140 400 120" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="100" cy="50" r="15" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M100 65 L100 90" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M90 90 Q100 100 110 90" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M80 40 Q100 30 120 40" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M70 35 Q100 20 130 35" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M140 30 Q160 20 180 30 Q200 40 180 50" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M210 30 Q230 20 250 30 Q270 40 250 50" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M280 30 Q300 20 320 30 Q340 40 320 50" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="160" cy="35" r="2" fill={stroke} opacity={op} />
          <circle cx="230" cy="35" r="2" fill={stroke} opacity={op} />
          <circle cx="300" cy="35" r="2" fill={stroke} opacity={op} />
        </g>
      );

    case 'nanyin':
      return (
        <g>
          <path d="M60 50 Q60 40 70 40 L90 40 Q100 40 100 50 L100 100 Q100 110 90 110 L70 110 Q60 110 60 100 Z" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <ellipse cx="80" cy="50" rx="20" ry="5" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M70 60 L90 60 M70 70 L90 70 M70 80 L90 80 M70 90 L90 90" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M130 30 L130 130 M130 30 L180 30 L180 130 L130 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M140 45 L170 45 M140 60 L170 60 M140 75 L170 75 M140 90 L170 90 M140 105 L170 105 M140 120 L170 120" stroke={stroke} strokeWidth={0.5} opacity={op3} />
          <path d="M200 50 Q220 30 240 50 Q260 70 240 90 Q220 110 240 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="240" cy="50" r="4" fill={stroke} opacity={op2} />
          <circle cx="220" cy="90" r="4" fill={stroke} opacity={op2} />
          <path d="M280 40 L280 130 M280 40 L330 40 L330 130 L280 130" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M290 55 L320 55 M290 70 L320 70 M290 85 L320 85 M290 100 L320 100 M290 115 L320 115" stroke={stroke} strokeWidth={0.5} opacity={op3} />
        </g>
      );

    case 'tibetanopera':
      return (
        <g>
          <path d="M0 120 Q100 100 200 120 Q300 140 400 120" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M0 140 Q100 120 200 140 Q300 160 400 140" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <ellipse cx="100" cy="70" rx="25" ry="30" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M80 50 Q100 35 120 50" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M85 40 Q100 25 115 40" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="92" cy="65" r="4" fill={stroke} opacity={op} />
          <circle cx="108" cy="65" r="4" fill={stroke} opacity={op} />
          <path d="M90 80 Q100 75 110 80" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M85 85 Q100 80 115 85" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M150 50 Q170 30 190 50 Q210 70 190 90 Q170 110 190 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="190" cy="50" r="4" fill={stroke} opacity={op2} />
          <circle cx="170" cy="90" r="4" fill={stroke} opacity={op2} />
          <ellipse cx="280" cy="70" rx="25" ry="30" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M260 50 Q280 35 300 50" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="272" cy="65" r="3" fill={stroke} opacity={op2} />
          <circle cx="288" cy="65" r="3" fill={stroke} opacity={op2} />
        </g>
      );

    case 'qiang':
      return (
        <g>
          <path d="M0 120 Q100 100 200 120 Q300 140 400 120" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <rect x="80" y="40" width="30" height="90" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <rect x="85" y="45" width="20" height="80" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M80 40 Q95 25 110 40" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M85 35 Q95 20 105 35" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <rect x="90" y="55" width="10" height="10" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <rect x="90" y="75" width="10" height="10" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <rect x="90" y="95" width="10" height="10" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <rect x="180" y="50" width="25" height="80" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M180 50 Q192 35 205 50" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <rect x="185" y="60" width="15" height="10" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <rect x="185" y="80" width="15" height="10" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <rect x="185" y="100" width="15" height="10" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M250 40 Q270 20 290 40 Q310 60 290 80 Q270 100 290 120" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="290" cy="40" r="4" fill={stroke} opacity={op2} />
          <circle cx="270" cy="80" r="4" fill={stroke} opacity={op2} />
          <path d="M330 50 Q340 30 350 50 Q340 70 330 50" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
        </g>
      );

    case 'litextile':
      return (
        <g>
          <rect x="50" y="40" width="100" height="80" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <rect x="60" y="50" width="80" height="60" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M60 55 L140 55 M60 65 L140 65 M60 75 L140 75 M60 85 L140 85 M60 95 L140 95 M60 105 L140 105" stroke={stroke} strokeWidth={0.5} opacity={op3} />
          <path d="M70 55 L70 105 M90 55 L90 105 M110 55 L110 105 M130 55 L130 105" stroke={stroke} strokeWidth={0.5} opacity={op3} />
          <path d="M170 50 Q190 30 210 50 Q230 70 210 90 Q190 110 210 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="210" cy="50" r="4" fill={stroke} opacity={op2} />
          <circle cx="190" cy="90" r="4" fill={stroke} opacity={op2} />
          <rect x="250" y="40" width="100" height="80" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <rect x="260" y="50" width="80" height="60" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M260 55 L340 55 M260 65 L340 65 M260 75 L340 75 M260 85 L340 85 M260 95 L340 95 M260 105 L340 105" stroke={stroke} strokeWidth={0.5} opacity={op3} />
          <path d="M270 55 L270 105 M290 55 L290 105 M310 55 L310 105 M330 55 L330 105" stroke={stroke} strokeWidth={0.5} opacity={op3} />
        </g>
      );

    case 'meshrep':
      return (
        <g>
          <circle cx="200" cy="80" r="50" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="200" cy="80" r="40" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="200" cy="80" r="30" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="200" cy="80" r="20" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <circle cx="200" cy="80" r="10" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <circle cx="200" cy="30" r="5" fill={stroke} opacity={op} />
          <circle cx="250" cy="80" r="5" fill={stroke} opacity={op} />
          <circle cx="200" cy="130" r="5" fill={stroke} opacity={op} />
          <circle cx="150" cy="80" r="5" fill={stroke} opacity={op} />
          <circle cx="235" cy="45" r="4" fill={stroke} opacity={op2} />
          <circle cx="235" cy="115" r="4" fill={stroke} opacity={op2} />
          <circle cx="165" cy="45" r="4" fill={stroke} opacity={op2} />
          <circle cx="165" cy="115" r="4" fill={stroke} opacity={op2} />
          <path d="M60 50 Q80 30 100 50 Q120 70 100 90 Q80 110 100 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="100" cy="50" r="4" fill={stroke} opacity={op2} />
          <circle cx="80" cy="90" r="4" fill={stroke} opacity={op2} />
          <path d="M300 50 Q320 30 340 50 Q360 70 340 90 Q320 110 340 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="340" cy="50" r="4" fill={stroke} opacity={op2} />
          <circle cx="320" cy="90" r="4" fill={stroke} opacity={op2} />
        </g>
      );

    case 'yimakan':
      return (
        <g>
          <path d="M80 50 Q80 40 90 40 L110 40 Q120 40 120 50 L120 90 Q120 100 110 100 L90 100 Q80 100 80 90 Z" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="100" cy="55" r="5" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M95 65 Q100 60 105 65" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M100 70 L100 85" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M80 100 L70 120 M120 100 L130 120" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M50 120 L150 120" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M160 40 Q180 20 200 40 Q220 60 200 80 Q180 100 200 120" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="200" cy="40" r="4" fill={stroke} opacity={op2} />
          <circle cx="180" cy="80" r="4" fill={stroke} opacity={op2} />
          <path d="M240 30 L240 130 M240 30 L290 30 L290 130 L240 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M250 45 L280 45 M250 60 L280 60 M250 75 L280 75 M250 90 L280 90 M250 105 L280 105 M250 120 L280 120" stroke={stroke} strokeWidth={0.5} opacity={op3} />
          <path d="M310 50 Q330 30 350 50 Q370 70 350 90 Q330 110 350 130" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="350" cy="50" r="3" fill={stroke} opacity={op3} />
        </g>
      );

    case 'puppet':
      return (
        <g>
          <ellipse cx="100" cy="50" rx="15" ry="18" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="95" cy="48" r="3" fill={stroke} opacity={op} />
          <circle cx="105" cy="48" r="3" fill={stroke} opacity={op} />
          <path d="M95 55 Q100 52 105 55" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M100 68 L100 90 M100 75 L85 80 M100 75 L115 80 M100 90 L90 110 M100 90 L110 110" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M85 20 L100 32 M115 20 L100 32" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M80 15 L85 20 M120 15 L115 20" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="80" cy="15" r="2" fill={stroke} opacity={op2} />
          <circle cx="120" cy="15" r="2" fill={stroke} opacity={op2} />
          <rect x="160" y="30" width="100" height="100" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <rect x="170" y="40" width="80" height="80" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <ellipse cx="210" cy="60" rx="10" ry="12" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M210 72 L210 90 M210 80 L200 85 M210 80 L220 85" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M280 50 Q300 30 320 50 Q340 70 320 90 Q300 110 320 130" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="320" cy="50" r="3" fill={stroke} opacity={op3} />
        </g>
      );

    case 'abacus':
      return (
        <g>
          <rect x="40" y="40" width="320" height="80" rx="4" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <line x1="40" y1="65" x2="360" y2="65" stroke={stroke} strokeWidth={sw} opacity={op} />
          <line x1="40" y1="95" x2="360" y2="95" stroke={stroke} strokeWidth={sw} opacity={op} />
          <line x1="80" y1="40" x2="80" y2="120" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <line x1="120" y1="40" x2="120" y2="120" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <line x1="160" y1="40" x2="160" y2="120" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <line x1="200" y1="40" x2="200" y2="120" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <line x1="240" y1="40" x2="240" y2="120" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <line x1="280" y1="40" x2="280" y2="120" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <line x1="320" y1="40" x2="320" y2="120" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="60" cy="52" r="4" fill={stroke} opacity={op} />
          <circle cx="100" cy="52" r="4" fill={stroke} opacity={op} />
          <circle cx="140" cy="52" r="4" fill={stroke} opacity={op} />
          <circle cx="180" cy="52" r="4" fill={stroke} opacity={op} />
          <circle cx="220" cy="52" r="4" fill={stroke} opacity={op} />
          <circle cx="260" cy="52" r="4" fill={stroke} opacity={op} />
          <circle cx="300" cy="52" r="4" fill={stroke} opacity={op} />
          <circle cx="340" cy="52" r="4" fill={stroke} opacity={op} />
          <circle cx="60" cy="78" r="4" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="100" cy="78" r="4" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="140" cy="78" r="4" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="180" cy="78" r="4" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="220" cy="78" r="4" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="260" cy="78" r="4" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="300" cy="78" r="4" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="340" cy="78" r="4" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="60" cy="108" r="4" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="100" cy="108" r="4" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="140" cy="108" r="4" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="180" cy="108" r="4" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="220" cy="108" r="4" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="260" cy="108" r="4" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="300" cy="108" r="4" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="340" cy="108" r="4" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
        </g>
      );

    case 'wangchuan':
      return (
        <g>
          <path d="M40 90 Q60 70 90 80 L310 80 Q340 70 360 90" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M40 90 Q30 85 40 80" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M360 90 Q370 85 360 80" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M40 95 Q60 75 90 85 L310 85 Q340 75 360 95" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <rect x="120" y="55" width="40" height="25" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <rect x="180" y="55" width="40" height="25" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <rect x="240" y="55" width="40" height="25" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M120 55 L140 40 L160 55" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M180 55 L200 40 L220 55" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M240 55 L260 40 L280 55" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M140 40 L140 30 M200 40 L200 25 M260 40 L260 30" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M0 110 Q100 100 200 110 Q300 120 400 110" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M0 125 Q100 115 200 125 Q300 135 400 125" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M0 140 Q100 130 200 140 Q300 150 400 140" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
        </g>
      );

    case 'dongsong':
      return (
        <g>
          <path d="M120 130 L120 50 L160 30 L200 50 L200 130" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M110 50 L170 25 L230 50" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <path d="M100 50 L180 20 L260 50" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <rect x="135" y="60" width="15" height="20" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <rect x="170" y="60" width="15" height="20" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M125 50 Q140 45 155 50 Q170 45 185 50 Q200 45 215 50" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="80" cy="70" r="8" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="80" cy="70" r="4" fill={stroke} opacity={op2} />
          <circle cx="280" cy="70" r="8" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="280" cy="70" r="4" fill={stroke} opacity={op2} />
          <circle cx="320" cy="80" r="6" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="340" cy="80" r="6" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="360" cy="80" r="6" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <path d="M50 100 Q80 90 110 100" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
        </g>
      );

    default:
      return (
        <g>
          <circle cx="200" cy="80" r="40" fill="none" stroke={stroke} strokeWidth={sw} opacity={op} />
          <circle cx="200" cy="80" r="25" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op2} />
          <circle cx="200" cy="80" r="10" fill={stroke} opacity={op2} />
          <path d="M100 40 Q150 20 200 40 Q250 20 300 40" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
          <path d="M100 120 Q150 100 200 120 Q250 100 300 120" fill="none" stroke={stroke} strokeWidth={sw2} opacity={op3} />
        </g>
      );
  }
}