type P = { className?: string };

export const SwimIcon = ({ className }: P) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <circle cx="34" cy="13" r="4" />
    <path d="M8 26l9-7 7 4 6-5" />
    <path d="M4 34c3 0 3 2 6.5 2S14 34 17.5 34 21 36 24.5 36 28 34 31.5 34 35 36 38.5 36 42 34 44 34" />
    <path d="M4 41c3 0 3 2 6.5 2S14 41 17.5 41 21 43 24.5 43 28 41 31.5 41 35 43 38.5 43 42 41 44 41" />
  </svg>
);

export const BikeIcon = ({ className }: P) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <circle cx="11" cy="32" r="8" />
    <circle cx="37" cy="32" r="8" />
    <path d="M11 32l8-14h12l6 14M19 18l7 14h11M24 12h6" />
    <circle cx="31" cy="9" r="2.5" />
  </svg>
);

export const RunIcon = ({ className }: P) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <circle cx="29" cy="7" r="4" />
    <path d="M14 22l7-6 8 3 3 8 6 2" />
    <path d="M21 16l-3 12 8 5-3 11" />
    <path d="M18 28l-6 8H6" />
  </svg>
);

export const WhatsAppIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.43 9.43 0 01-4.81-1.32l-.34-.2-3.58.94.96-3.49-.23-.36A9.43 9.43 0 1121.5 12.06c0 5.2-4.24 9.44-9.45 9.44zm8.03-17.47A11.3 11.3 0 0012.05.7C5.8.7.7 5.79.7 12.05c0 2 .52 3.95 1.52 5.67L.6 23.6l6.02-1.58a11.33 11.33 0 005.42 1.38h.01c6.25 0 11.35-5.09 11.35-11.35 0-3.03-1.18-5.88-3.32-8.02z" />
  </svg>
);

export const ArrowIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const base = { viewBox: "0 0 48 48", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export const TeamIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="24" cy="14" r="5" />
    <circle cx="11" cy="18" r="4" />
    <circle cx="37" cy="18" r="4" />
    <path d="M15 40v-6a9 9 0 0118 0v6M4 38v-3a7 7 0 0110-6M44 38v-3a7 7 0 00-10-6" />
  </svg>
);

export const CalendarIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="6" y="9" width="36" height="33" rx="3" />
    <path d="M6 18h36M15 5v8M33 5v8M14 26h4M22 26h4M30 26h4M14 34h4M22 34h4" />
  </svg>
);

export const TrophyIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M15 6h18v12a9 9 0 01-18 0V6zM15 10H7v3a7 7 0 008 7M33 10h8v3a7 7 0 01-8 7M24 27v7M16 42h16M18 42l2-8h8l2 8" />
  </svg>
);

export const PinIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
  </svg>
);

export const disciplineIcon = { natacion: SwimIcon, ciclismo: BikeIcon, running: RunIcon };
