/**
 * Original vector illustration (top-down noodle soup bowl). Not a photo of the restaurant —
 * replace with the owner's photography via <Image> once rights are granted.
 */
export function HeroArt({ label, className = "" }: { label: string; className?: string }) {
  return (
    <svg viewBox="0 0 600 600" role="img" aria-label={label} className={className}>
      <defs>
        <radialGradient id="broth" cx="45%" cy="40%" r="65%">
          <stop offset="0" stopColor="#E9B26A" />
          <stop offset="0.55" stopColor="#C9823F" />
          <stop offset="1" stopColor="#9A5A27" />
        </radialGradient>
        <radialGradient id="bowl" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#FFFDF8" />
          <stop offset="1" stopColor="#E4DCCB" />
        </radialGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="22" stdDeviation="22" floodColor="#0B261D" floodOpacity="0.35" />
        </filter>
        <clipPath id="soup">
          <circle cx="300" cy="300" r="196" />
        </clipPath>
      </defs>

      {/* bowl */}
      <circle cx="300" cy="300" r="250" fill="url(#bowl)" filter="url(#shadow)" />
      <circle cx="300" cy="300" r="250" fill="none" stroke="#12382C" strokeWidth="10" opacity="0.9" />
      <circle
        cx="300"
        cy="300"
        r="226"
        fill="none"
        stroke="#D95137"
        strokeWidth="2.5"
        strokeDasharray="2 14"
        strokeLinecap="round"
      />
      <circle cx="300" cy="300" r="200" fill="url(#broth)" />

      <g clipPath="url(#soup)">
        {/* noodles */}
        <g fill="none" stroke="#F6E7C4" strokeWidth="7" strokeLinecap="round" opacity="0.95">
          <path d="M120 330c40-30 80 30 120 0s80-30 120 0 80 30 120 0" />
          <path d="M110 360c40-30 80 30 120 0s80-30 120 0 80 30 120 0" />
          <path d="M130 390c40-30 80 30 120 0s80-30 120 0 80 30 110 0" />
          <path d="M150 420c40-30 80 30 120 0s80-30 120 0 60 20 90 0" />
          <path d="M180 450c40-30 80 30 120 0s60-25 100 0" />
        </g>
        {/* beef slices */}
        <g fill="#8A3B22">
          <path d="M215 175c35-18 85-10 98 12 8 14-8 26-30 28-34 4-72-2-80-16-4-8 2-18 12-24z" />
          <path d="M318 160c32-8 70 4 76 24 4 14-12 22-32 22-30 0-56-8-60-22-2-10 4-20 16-24z" opacity="0.92" />
          <path d="M250 225c28-6 64 4 68 20 2 12-14 18-32 18-26 0-50-8-52-20 0-8 6-16 16-18z" opacity="0.85" />
        </g>
        <g fill="none" stroke="#C46A4A" strokeWidth="2" opacity="0.6">
          <path d="M230 190c26-8 54-6 72 4" />
          <path d="M330 178c20-4 40 0 52 8" />
        </g>
        {/* spring onion rings */}
        <g fill="none" stroke="#6F8F4E" strokeWidth="5">
          <circle cx="392" cy="262" r="10" />
          <circle cx="418" cy="290" r="8" />
          <circle cx="182" cy="270" r="9" />
          <circle cx="205" cy="300" r="7" />
          <circle cx="360" cy="235" r="7" />
        </g>
        {/* chilli */}
        <g fill="#D95137">
          <circle cx="430" cy="340" r="11" />
          <circle cx="410" cy="362" r="9" />
          <circle cx="166" cy="232" r="9" />
        </g>
        <g fill="#F8F5ED">
          <circle cx="430" cy="340" r="3" />
          <circle cx="410" cy="362" r="2.5" />
          <circle cx="166" cy="232" r="2.5" />
        </g>
      </g>

      {/* herbs */}
      <g>
        <path d="M410 150c40-40 100-30 110-10-30 10-60 40-110 10z" fill="#3E6B3F" />
        <path d="M410 150c30-6 70-14 108-10" stroke="#264A2B" strokeWidth="2" fill="none" />
        <path d="M440 120c20-50 80-60 96-44-24 18-40 54-96 44z" fill="#5C8A4A" />
        <path d="M440 120c24-14 60-34 94-42" stroke="#33603A" strokeWidth="2" fill="none" />
        <path d="M120 450c-40 10-70 50-60 74 24-20 64-24 60-74z" fill="#5C8A4A" />
      </g>
      {/* lime */}
      <g transform="translate(470 430) rotate(-20)">
        <path d="M-56 0a56 56 0 0 1 112 0z" fill="#9FBF5A" />
        <path d="M-46 0a46 46 0 0 1 92 0z" fill="#DCEBA6" />
        <g stroke="#9FBF5A" strokeWidth="3">
          <line x1="0" y1="0" x2="0" y2="-44" />
          <line x1="0" y1="0" x2="-31" y2="-31" />
          <line x1="0" y1="0" x2="31" y2="-31" />
        </g>
      </g>
      {/* chopsticks */}
      <g strokeLinecap="round">
        <line x1="40" y1="120" x2="330" y2="40" stroke="#9B7453" strokeWidth="14" />
        <line x1="60" y1="150" x2="350" y2="72" stroke="#7A5A3E" strokeWidth="14" />
      </g>
    </svg>
  );
}
