import { planetAbbr, SIGNS, signName } from '../data/catalog.js';

const NORTH = {
  1: [150, 72],
  2: [72, 34],
  3: [34, 78],
  4: [72, 150],
  5: [34, 222],
  6: [72, 266],
  7: [150, 228],
  8: [228, 266],
  9: [266, 222],
  10: [228, 150],
  11: [266, 78],
  12: [228, 34],
};

const SOUTH = [
  { sign: 11, c: 0, r: 0 },
  { sign: 0, c: 1, r: 0 },
  { sign: 1, c: 2, r: 0 },
  { sign: 2, c: 3, r: 0 },
  { sign: 10, c: 0, r: 1 },
  { sign: 3, c: 3, r: 1 },
  { sign: 9, c: 0, r: 2 },
  { sign: 4, c: 3, r: 2 },
  { sign: 8, c: 0, r: 3 },
  { sign: 7, c: 1, r: 3 },
  { sign: 6, c: 2, r: 3 },
  { sign: 5, c: 3, r: 3 },
];

export function ChartFigure({ title, style, originSign, entries, marker, lang }) {
  return (
    <figure className="chart-figure">
      <figcaption>{title}</figcaption>
      {style === 'south' ? (
        <SouthChart originSign={originSign} entries={entries} marker={marker} lang={lang} />
      ) : (
        <NorthChart originSign={originSign} entries={entries} marker={marker} lang={lang} />
      )}
    </figure>
  );
}

function NorthChart({ originSign, entries, marker, lang }) {
  const byHouse = Array.from({ length: 12 }, () => []);
  entries.forEach((entry) => {
    const house = entry.house || ((entry.sign - originSign + 12) % 12) + 1;
    byHouse[house - 1].push(entry.label);
  });
  return (
    <svg viewBox="0 0 300 300" className="chart-svg" role="img">
      <rect x="1" y="1" width="298" height="298" className="chart-line" />
      <polygon points="150,1 299,150 150,299 1,150" className="chart-line" />
      <line x1="1" y1="1" x2="299" y2="299" className="chart-line" />
      <line x1="299" y1="1" x2="1" y2="299" className="chart-line" />
      {Object.entries(NORTH).map(([house, [x, y]]) => {
        const sign = (originSign + Number(house) - 1) % 12;
        const names = byHouse[Number(house) - 1];
        return (
          <g key={house}>
            <text x={x} y={y - 8} textAnchor="middle" className="chart-sign">
              {lang === 'hi' ? SIGNS[sign].hi : SIGNS[sign].short}
              {Number(house) === 1 ? ` ${marker}` : ''}
            </text>
            <text x={x} y={y + 10} textAnchor="middle" className="chart-planet">
              {names.slice(0, 4).join(' ')}
            </text>
            {names.length > 4 ? (
              <text x={x} y={y + 24} textAnchor="middle" className="chart-planet">
                {names.slice(4).join(' ')}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

function SouthChart({ originSign, entries, marker, lang }) {
  const bySign = Array.from({ length: 12 }, () => []);
  entries.forEach((entry) => bySign[entry.sign].push(entry.label));
  const cell = 75;
  return (
    <svg viewBox="0 0 300 300" className="chart-svg" role="img">
      {Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 4 }, (_, c) => (
          <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} className="chart-line" />
        )),
      )}
      <text x="150" y="158" textAnchor="middle" className="chart-sign">
        {lang === 'hi' ? 'कुण्डली' : 'Kundli'}
      </text>
      {SOUTH.map(({ sign, c, r }) => (
        <g key={sign}>
          <text x={c * cell + 8} y={r * cell + 16} className="chart-sign">
            {lang === 'hi' ? SIGNS[sign].hi : SIGNS[sign].short}
            {sign === originSign ? ` ${marker}` : ''}
          </text>
          <text x={c * cell + 8} y={r * cell + 40} className="chart-planet">
            {bySign[sign].slice(0, 3).join(' ')}
          </text>
          {bySign[sign].length > 3 ? (
            <text x={c * cell + 8} y={r * cell + 58} className="chart-planet">
              {bySign[sign].slice(3).join(' ')}
            </text>
          ) : null}
        </g>
      ))}
    </svg>
  );
}

export function chartEntries(chart, kind) {
  const lang = chart.form.language;
  const moon = chart.bodies.find((b) => b.id === 'moon');
  let origin = chart.lagna.sign;
  if (kind === 'moon') origin = moon.sign;
  if (kind === 'navamsa') origin = chart.lagna.vargas.D9;
  return {
    origin,
    marker: kind === 'moon' ? (lang === 'hi' ? 'चं' : 'Mo') : lang === 'hi' ? 'ल' : 'Asc',
    entries: chart.bodies.map((b) => {
      const sign = kind === 'navamsa' ? b.vargas.D9 : b.sign;
      const house = kind === 'bhava' ? b.bhava : ((sign - origin + 12) % 12) + 1;
      const label = `${planetAbbr(b.id, lang)}${b.retro && b.id !== 'rahu' && b.id !== 'ketu' ? '*' : ''}`;
      return { sign: kind === 'bhava' ? (chart.lagna.sign + b.bhava - 1) % 12 : sign, house, label };
    }),
  };
}

export function Sudarshan({ chart }) {
  const lang = chart.form.language;
  const moon = chart.bodies.find((b) => b.id === 'moon').sign;
  const sun = chart.bodies.find((b) => b.id === 'sun').sign;
  const rings = [
    { r: 118, origin: chart.lagna.sign, name: lang === 'hi' ? 'लग्न' : 'Lagna' },
    { r: 86, origin: moon, name: lang === 'hi' ? 'चन्द्र' : 'Moon' },
    { r: 54, origin: sun, name: lang === 'hi' ? 'सूर्य' : 'Sun' },
  ];
  return (
    <svg viewBox="0 0 280 280" className="chart-svg sudarshan" role="img">
      {rings.map((ring) => (
        <g key={ring.name}>
          <circle cx="140" cy="140" r={ring.r} className="chart-line" />
          {Array.from({ length: 12 }, (_, i) => {
            const a1 = ((i - 3) * Math.PI) / 6;
            const a2 = ((i - 2) * Math.PI) / 6;
            const mid = (a1 + a2) / 2;
            const sign = (ring.origin + i) % 12;
            const names = chart.bodies
              .filter((b) => ((b.sign - ring.origin + 12) % 12) === i)
              .map((b) => planetAbbr(b.id, lang));
            const x = 140 + Math.cos(mid) * (ring.r - 16);
            const y = 140 + Math.sin(mid) * (ring.r - 16);
            return (
              <g key={`${ring.name}-${i}`}>
                <line x1={140 + Math.cos(a1) * (ring.r - 32)} y1={140 + Math.sin(a1) * (ring.r - 32)} x2={140 + Math.cos(a1) * ring.r} y2={140 + Math.sin(a1) * ring.r} className="chart-line" />
                <text x={x} y={y} textAnchor="middle" className="chart-sign">
                  {signName(sign, lang).slice(0, 3)} {names.join(' ')}
                </text>
              </g>
            );
          })}
        </g>
      ))}
      <text x="140" y="144" textAnchor="middle" className="chart-sign">
        {lang === 'hi' ? 'सुदर्शन' : 'Sudarshan'}
      </text>
    </svg>
  );
}
