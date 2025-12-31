import React, { useEffect, useState } from 'react';
import AnalogClock from './components/AnalogClock';

const timezones = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Kolkata',
  'Australia/Sydney'
];

export default function App() {
  const [tz, setTz] = useState<string>('UTC');
  const [size, setSize] = useState<number>(360);
  const [showNumbers, setShowNumbers] = useState<boolean>(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
  }, [theme]);

  return (
    <div className="container">
      <div className="max-w-2xl w-full space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Analog Clock</h1>
          <div className="flex gap-3 items-center">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={theme === 'light'}
                onChange={(e) => setTheme(e.target.checked ? 'light' : 'dark')}
                className="h-4 w-4"
                aria-label="Toggle light theme"
              />
              Light
            </label>
          </div>
        </header>

        <main className="bg-[var(--card)] rounded-xl p-6 shadow-lg flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 flex items-center justify-center">
            <AnalogClock
              size={size}
              timeZone={tz}
              showNumbers={showNumbers}
              ariaLabel={`Analog clock showing time in ${tz}`}
            />
          </div>

          <aside className="w-full md:w-64 space-y-4">
            <label className="block text-sm font-medium">Time zone</label>
            <select
              value={tz}
              onChange={(e) => setTz(e.target.value)}
              className="w-full rounded-md bg-transparent border px-3 py-2"
              aria-label="Select timezone"
            >
              {timezones.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium">Size</label>
            <input
              type="range"
              min={160}
              max={600}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              aria-label="Clock size"
              className="w-full"
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showNumbers}
                onChange={(e) => setShowNumbers(e.target.checked)}
                className="h-4 w-4"
                aria-label="Toggle numbers"
              />
              Show numbers
            </label>

            <p className="text-xs text-[var(--text)]/70">
              Smooth second hand, timezone-aware rendering, responsive. Built with React + TypeScript +
              Vite + Tailwind.
            </p>
          </aside>
        </main>

        <footer className="text-xs text-[var(--text)]/70">
          Tip: switch time zones, resize the clock, or toggle theme.
        </footer>
      </div>
    </div>
  );
}
