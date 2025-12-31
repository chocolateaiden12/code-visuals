import React, { useEffect, useRef, useState } from 'react';

type Props = {
  size?: number;
  timeZone?: string;
  showNumbers?: boolean;
  ariaLabel?: string;
};

export default function AnalogClock({ size = 320, timeZone = 'UTC', showNumbers = true, ariaLabel }: Props) {
  const rafRef = useRef<number | null>(null);
  const [, setTick] = useState(0); // force re-render
  const last = useRef<number>(performance.now());

  // We'll use requestAnimationFrame to animate smoothly.
  useEffect(() => {
    function frame(now: number) {
      // update once per frame
      setTick((t) => t + 1);
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Compute hour/min/sec/ms for the given timezone
  function getTimeParts(tz: string) {
    const nowUtcMs = Date.now();
    const d = new Date(nowUtcMs);
    // Use formatToParts to get timezone hour/min/sec (reflects timezone)
    const f = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).formatToParts(d);

    const parts: Record<string, string> = {};
    for (const p of f) {
      if (p.type !== 'literal' && p.value) parts[p.type] = p.value;
    }
    // fallback parsing
    const hour = Number(parts.hour ?? d.getUTCHours());
    const minute = Number(parts.minute ?? d.getUTCMinutes());
    const second = Number(parts.second ?? d.getUTCSeconds());
    const ms = nowUtcMs % 1000;
    return { hour, minute, second, ms };
  }

  const { hour, minute, second, ms } = getTimeParts(timeZone);

  // Hand angles (degrees)
  const secondWithMs = second + ms / 1000;
  const secondAngle = (secondWithMs / 60) * 360;
  const minuteAngle = ((minute + secondWithMs / 60) / 60) * 360;
  const hourAngle = ((hour % 12 + (minute + secondWithMs / 60) / 60) / 12) * 360;

  const r = size / 2;
  const stroke = Math.max(2, Math.round(size * 0.01));
  const center = { x: r, y: r };

  // small helper to position numbers around the circle
  function numberPos(n: number) {
    const theta = ((n / 12) * 2 * Math.PI) - Math.PI / 2;
    const dist = r * 0.78;
    return {
      x: center.x + dist * Math.cos(theta),
      y: center.y + dist * Math.sin(theta)
    };
  }

  return (
    <figure
      role="img"
      aria-label={ariaLabel ?? `Analog clock (${timeZone})`}
      style={{ width: size, height: size }}
      className="select-none"
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="false" focusable="true">
        {/* face */}
        <defs>
          <radialGradient id="g" cx="30%" cy="30%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.02)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.12)" />
          </radialGradient>
        </defs>

        <circle cx={center.x} cy={center.y} r={r - stroke} fill="url(#g)" stroke="currentColor" strokeWidth={stroke * 0.5} opacity="0.06" />

        {/* tick marks */}
        <g stroke="currentColor" strokeOpacity="0.6" strokeWidth={stroke / 1.6}>
          {Array.from({ length: 60 }).map((_, i) => {
            const ang = (i / 60) * 2 * Math.PI;
            const inner = i % 5 === 0 ? r * 0.82 : r * 0.88;
            const outer = r * 0.95;
            const x1 = center.x + inner * Math.cos(ang);
            const y1 = center.y + inner * Math.sin(ang);
            const x2 = center.x + outer * Math.cos(ang);
            const y2 = center.y + outer * Math.sin(ang);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeLinecap="round" />;
          })}
        </g>

        {/* numbers */}
        {showNumbers &&
          Array.from({ length: 12 }).map((_, i) => {
            const n = i + 1;
            const p = numberPos(n % 12);
            return (
              <text
                key={n}
                x={p.x}
                y={p.y + size * 0.03}
                textAnchor="middle"
                fontSize={Math.max(10, size * 0.06)}
                fill="currentColor"
                fillOpacity="0.9"
                style={{ fontWeight: 600 }}
              >
                {n}
              </text>
            );
          })}

        {/* hour hand */}
        <g transform={`rotate(${hourAngle} ${center.x} ${center.y})`}>
          <line
            x1={center.x}
            y1={center.y}
            x2={center.x}
            y2={center.y - r * 0.42}
            stroke="currentColor"
            strokeWidth={Math.max(4, stroke * 2)}
            strokeLinecap="round"
          />
        </g>

        {/* minute hand */}
        <g transform={`rotate(${minuteAngle} ${center.x} ${center.y})`}>
          <line
            x1={center.x}
            y1={center.y}
            x2={center.x}
            y2={center.y - r * 0.58}
            stroke="currentColor"
            strokeWidth={Math.max(3, stroke * 1.2)}
            strokeLinecap="round"
          />
        </g>

        {/* second hand */}
        <g transform={`rotate(${secondAngle} ${center.x} ${center.y})`}>
          <line
            x1={center.x}
            y1={center.y + r * 0.12}
            x2={center.x}
            y2={center.y - r * 0.72}
            stroke="#f97316"
            strokeWidth={Math.max(2, stroke * 0.6)}
            strokeLinecap="round"
          />
          {/* counterbalance */}
          <circle cx={center.x} cy={center.y + r * 0.14} r={Math.max(3, stroke)} fill="#f97316" />
        </g>

        {/* center cap */}
        <circle cx={center.x} cy={center.y} r={Math.max(4, stroke * 1.2)} fill="currentColor" />
      </svg>
    </figure>
  );
}
