"use client";

import { useSyncExternalStore } from "react";

/**
 * Original, stylised city map (not to scale, not a copy of any map provider) with an animated,
 * *illustrative* route from a generic "Your location" to Trang An. Pure SVG: no tiles, no
 * geolocation, no third-party requests.
 *
 * The starting point is deliberately drawn as an approximate area (soft ring), not a precise dot —
 * the site does not know where the visitor is.
 *
 * Motion — one shared SMIL timeline (CYCLE), so every part stays in sync without JavaScript timers:
 *   0 → 60 %   the route draws itself and a glowing marker travels along it (eased)
 *   ~60 %      marker arrives: the pin hops and a ripple spreads from it
 *   60 → 88 %  hold (whole route visible)
 *   88 → 100 % route + marker fade out, then the loop restarts
 * With prefers-reduced-motion (and during SSR/hydration) no animation elements are rendered: the
 * route is shown fully drawn and static.
 */

const ROUTE = "M64 236 H204 Q220 236 220 220 V166 Q220 150 236 150 H290";
const CYCLE = "4.8s";
const T = "0;0.6;0.88;1";
const EASE = "0.45 0 0.2 1;0 0 1 1;0 0 1 1";

function subscribe(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const allowsMotion = () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// Server + hydration render the static map; animation elements are added on the client only.
const noMotionOnServer = () => false;

export function RouteMap({
  label,
  originLabel,
  originHint,
  className = "",
}: {
  label: string;
  originLabel: string;
  originHint: string;
  className?: string;
}) {
  const motion = useSyncExternalStore(subscribe, allowsMotion, noMotionOnServer);
  const loop = { dur: CYCLE, repeatCount: "indefinite" } as const;

  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label={label} className={className}>
      <defs>
        <filter id="rm-shadow" x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1E3A5F" floodOpacity="0.18" />
        </filter>
        <filter id="rm-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <linearGradient id="rm-water" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#C9DEF4" />
          <stop offset="1" stopColor="#B4D0EE" />
        </linearGradient>
      </defs>

      {/* land / blocks */}
      <rect width="400" height="300" fill="#E3EAF2" />
      <g fill="#ECF1F7">
        <rect x="14" y="10" width="40" height="30" rx="4" />
        <rect x="128" y="12" width="70" height="34" rx="4" />
        <rect x="236" y="8" width="64" height="40" rx="4" />
        <rect x="340" y="14" width="48" height="30" rx="4" />
        <rect x="18" y="74" width="74" height="60" rx="5" />
        <rect x="128" y="76" width="78" height="58" rx="5" />
        <rect x="236" y="74" width="34" height="56" rx="5" />
        <rect x="338" y="72" width="52" height="64" rx="5" />
        <rect x="16" y="164" width="80" height="56" rx="5" />
        <rect x="126" y="166" width="80" height="54" rx="5" />
        <rect x="338" y="166" width="50" height="56" rx="5" />
      </g>
      {/* park */}
      <rect x="236" y="166" width="72" height="56" rx="10" fill="#D6E8DC" />
      <g fill="#C3DDCB">
        <circle cx="256" cy="186" r="7" />
        <circle cx="282" cy="200" r="9" />
        <circle cx="262" cy="208" r="5" />
      </g>
      {/* river */}
      <path d="M-10 266 C 70 250, 150 284, 240 266 S 370 252, 410 268 V310 H-10 Z" fill="url(#rm-water)" />

      {/* roads: casing, then surface */}
      <g fill="none" stroke="#D2DCE8" strokeLinecap="round">
        <path d="M-10 60 H410 M-10 236 H410 M110 -10 V256 M320 -10 V256" strokeWidth="14" />
        <path d="M-10 150 H410 M220 -10 V256" strokeWidth="20" />
        <path d="M-20 124 L150 -20" strokeWidth="12" />
      </g>
      <g fill="none" stroke="#FFFFFF" strokeLinecap="round">
        <path d="M-10 60 H410 M-10 236 H410 M110 -10 V256 M320 -10 V256" strokeWidth="10" />
        <path d="M-10 150 H410 M220 -10 V256" strokeWidth="15" />
        <path d="M-20 124 L150 -20" strokeWidth="8" />
      </g>
      <text x="150" y="153.5" textAnchor="middle" fontSize="8.5" fontWeight="600" letterSpacing="0.6" fill="#8796A8">
        Železničiarska
      </text>

      {/* route: white casing + light base (always visible), then the animated progress line */}
      <path d={ROUTE} fill="none" stroke="#FFFFFF" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d={ROUTE}
        fill="none"
        stroke="#2F6FE4"
        strokeOpacity="0.28"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={ROUTE}
        pathLength={1}
        strokeDasharray="1"
        fill="none"
        stroke="#2F6FE4"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        data-route-progress
      >
        {motion && (
          <>
            <animate
              attributeName="stroke-dashoffset"
              values="1;0;0;0"
              keyTimes={T}
              calcMode="spline"
              keySplines={EASE}
              {...loop}
            />
            <animate attributeName="opacity" values="1;1;1;0" keyTimes={T} {...loop} />
          </>
        )}
      </path>

      {/* generic starting point: an approximate area, not a precise position */}
      <g>
        <title>{originHint}</title>
        <circle
          cx="64"
          cy="236"
          r="20"
          fill="#2F6FE4"
          fillOpacity="0.1"
          stroke="#2F6FE4"
          strokeOpacity="0.4"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        {motion && (
          <circle cx="64" cy="236" r="10" fill="none" stroke="#2F6FE4" strokeWidth="2">
            <animate attributeName="r" values="8;26" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.5;0" dur="2.4s" repeatCount="indefinite" />
          </circle>
        )}
        <circle cx="64" cy="236" r="5" fill="#2F6FE4" stroke="#FFFFFF" strokeWidth="2.5" />
        <g filter="url(#rm-shadow)">
          <rect x="16" y="194" width="96" height="22" rx="11" fill="#FFFFFF" />
          <text x="64" y="209" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#1E3A5F">
            {originLabel}
          </text>
        </g>
      </g>

      {/* travelling marker (glow + dot) */}
      {motion && (
        <g data-route-marker>
          <circle r="11" fill="#2F6FE4" opacity="0.45" filter="url(#rm-glow)" />
          <circle r="6.5" fill="#FFFFFF" stroke="#2F6FE4" strokeWidth="3.5" />
          <animateMotion path={ROUTE} keyPoints="0;1;1;1" keyTimes={T} calcMode="spline" keySplines={EASE} {...loop} />
          <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;0.05;0.6;0.88;1" {...loop} />
        </g>
      )}

      {/* arrival ripple */}
      {motion && (
        <circle cx="290" cy="150" r="6" fill="none" stroke="#B83D27" strokeWidth="2" opacity="0">
          <animate attributeName="r" values="6;6;6;28;28" keyTimes="0;0.59;0.6;0.84;1" {...loop} />
          <animate attributeName="opacity" values="0;0;0.55;0;0" keyTimes="0;0.59;0.6;0.84;1" {...loop} />
        </circle>
      )}

      {/* restaurant pin */}
      <ellipse cx="290" cy="152" rx="9" ry="3" fill="#1E3A5F" opacity="0.22" />
      <g filter="url(#rm-shadow)">
        <g>
          <path
            d="M290 150 C 284 140, 273 133, 273 121 A17 17 0 1 1 307 121 C 307 133, 296 140, 290 150 Z"
            fill="#B83D27"
          />
          <circle cx="290" cy="121" r="7" fill="#FFFFFF" />
          <path d="M285.5 121h9a4.5 4.5 0 0 1-9 0z" fill="#B83D27" />
          {motion && (
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 0;0 0;0 -7;0 0;0 0"
              keyTimes="0;0.58;0.65;0.74;1"
              {...loop}
            />
          )}
        </g>
      </g>
      <g filter="url(#rm-shadow)">
        <rect x="312" y="106" width="76" height="26" rx="13" fill="#FFFFFF" />
        <text x="350" y="123" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#12382C">
          Trang An
        </text>
      </g>
    </svg>
  );
}
