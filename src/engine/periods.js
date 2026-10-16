import * as Astronomy from 'astronomy-engine';
import { ASHTAK, DASHA_LORDS, DASHA_YEARS, GANA, KARANAS, NADI, SIGN_LORDS, TITHIS, WEEKDAYS, YOGA_NAMES, YOGINIS, YONI } from '../data/catalog.js';
import { YEAR_MS, addYears, ayanamsaOf, formatParts, houseFromCusps, meanNodeTropical, nakshatraOf, norm, signOf, tropicalAngles, tropicalLongitude, trueNodeTropical, wholeSignHouse } from './math.js';
import { lordOf } from './vargas.js';

export function vimshottari(moonLon, birth) {
  const nak = nakshatraOf(moonLon);
  const span = 360 / 27;
  const elapsedFrac = nak.offset / span;
  const total = DASHA_YEARS[nak.lord];
  const balance = total * (1 - elapsedFrac);
  const elapsed = total * elapsedFrac;
  const cycleStart = new Date(birth.getTime() - elapsed * YEAR_MS);
  const startIndex = DASHA_LORDS.indexOf(nak.lord);
  const mahas = [];
  let cursor = cycleStart;
  for (let i = 0; i < 9; i += 1) {
    const lord = DASHA_LORDS[(startIndex + i) % 9];
    const years = DASHA_YEARS[lord];
    const end = addYears(cursor, years);
    const antars = subdivide(lord, cursor, years, 1);
    mahas.push({ lord, start: new Date(cursor), end, years, antars });
    cursor = end;
  }
  return { lord: nak.lord, balanceYears: balance, elapsedYears: elapsed, mahas };
}

function subdivide(parentLord, start, parentYears, depth) {
  const startIndex = DASHA_LORDS.indexOf(parentLord);
  const rows = [];
  let cursor = start;
  for (let i = 0; i < 9; i += 1) {
    const lord = DASHA_LORDS[(startIndex + i) % 9];
    const years = parentYears * (DASHA_YEARS[lord] / 120);
    const end = addYears(cursor, years);
    const row = { lord, start: new Date(cursor), end, years };
    if (depth < 2) row.children = subdivide(lord, cursor, years, depth + 1);
    rows.push(row);
    cursor = end;
  }
  return rows;
}

export function yoginiDasha(moonLon, birth) {
  const nak = nakshatraOf(moonLon);
  const index = nak.index % 8;
  const span = 360 / 27;
  const frac = nak.offset / span;
  const years = YOGINIS[index].years;
  const elapsed = years * frac;
  let cursor = new Date(birth.getTime() - elapsed * YEAR_MS);
  const mahas = [];
  for (let i = 0; i < 8; i += 1) {
    const y = YOGINIS[(index + i) % 8];
    const end = addYears(cursor, y.years);
    const antars = [];
    let aCursor = new Date(cursor);
    for (let j = 0; j < 8; j += 1) {
      const ay = YOGINIS[(index + i + j) % 8];
      const aYears = y.years * (ay.years / 36);
      const aEnd = addYears(aCursor, aYears);
      const praty = [];
      let pCursor = new Date(aCursor);
      for (let k = 0; k < 8; k += 1) {
        const py = YOGINIS[(index + i + j + k) % 8];
        const pYears = aYears * (py.years / 36);
        const pEnd = addYears(pCursor, pYears);
        praty.push({ index: (index + i + j + k) % 8, start: new Date(pCursor), end: pEnd });
        pCursor = pEnd;
      }
      antars.push({ index: (index + i + j) % 8, start: new Date(aCursor), end: aEnd, pratyantar: praty });
      aCursor = aEnd;
    }
    mahas.push({ index: (index + i) % 8, start: new Date(cursor), end, antars });
    cursor = end;
  }
  return { startIndex: index, mahas };
}

export function charaDasha(lagnaSign, planetSigns) {
  const yearsOf = (sign) => {
    const lordSign = planetSigns[lordOf(sign)];
    const forward = sign % 2 === 0;
    const diff = forward ? (lordSign - sign + 12) % 12 : (sign - lordSign + 12) % 12;
    return diff === 0 ? 12 : diff;
  };
  const forwardSeq = lagnaSign % 2 === 0;
  const rows = [];
  for (let i = 0; i < 12; i += 1) {
    const sign = forwardSeq ? (lagnaSign + i) % 12 : (lagnaSign - i + 12) % 12;
    rows.push({ sign, years: yearsOf(sign) });
  }
  return { forward: forwardSeq, rows };
}

export function panchang(date, sunLon, moonLon, lat, lon) {
  const elong = norm(moonLon - sunLon);
  const tithi = Math.min(29, Math.floor(elong / 12));
  const paksha = tithi < 15 ? 'Shukla' : 'Krishna';
  const yoga = Math.min(26, Math.floor(norm(sunLon + moonLon) / (360 / 27)));
  const karana = karanaOf(elong);
  const observer = new Astronomy.Observer(lat, lon, 0);
  const rise = Astronomy.SearchRiseSet(
    Astronomy.Body.Sun,
    observer,
    +1,
    new Date(date.getTime() - 36 * 3600 * 1000),
    3,
  );
  let varaDate = date;
  if (rise && date.getTime() < rise.date.getTime()) {
    varaDate = new Date(date.getTime() - 24 * 3600 * 1000);
  }
  const weekday = varaDate.getUTCDay();
  return {
    tithi,
    paksha,
    tithiName: TITHIS[tithi],
    yoga,
    yogaName: YOGA_NAMES[yoga][0],
    yogaHi: YOGA_NAMES[yoga][1],
    karana,
    weekday,
    weekdayName: WEEKDAYS[weekday][0],
    sunrise: rise ? rise.date : null,
  };
}

function karanaOf(elong) {
  const half = Math.floor(elong / 6);
  if (half <= 0) return 10;
  if (half >= 57) return [7, 8, 9][Math.min(2, half - 57)];
  return (half - 1) % 7;
}

export function avkahada(moonLon) {
  const nak = nakshatraOf(moonLon);
  const sign = signOf(moonLon);
  const vashyaMap = ['Chatushpada', 'Chatushpada', 'Manava', 'Jalachara', 'Vanachara', 'Manava', 'Manava', 'Keeta', 'Manava', 'Chatushpada', 'Manava', 'Jalachara'];
  const varnaMap = ['Kshatriya', 'Vaishya', 'Shudra', 'Brahmin', 'Kshatriya', 'Vaishya', 'Shudra', 'Brahmin', 'Kshatriya', 'Vaishya', 'Shudra', 'Brahmin'];
  const yunja = nak.index < 9 ? 'Adi' : nak.index < 18 ? 'Madhya' : 'Antya';
  return {
    nakshatra: nak.index,
    pada: nak.pada,
    gana: GANA[nak.index],
    nadi: NADI[nak.index],
    yoni: YONI[nak.index],
    vashya: vashyaMap[sign],
    varna: varnaMap[sign],
    yunja,
    sign,
  };
}

export function ashtakavarga(planetSigns, lagnaSign) {
  const contributors = { ...planetSigns, lagna: lagnaSign };
  const bav = {};
  for (const planet of Object.keys(ASHTAK)) {
    const rows = Array.from({ length: 12 }, () => 0);
    for (const [source, places] of Object.entries(ASHTAK[planet])) {
      const from = contributors[source];
      places.forEach((house) => {
        rows[(from + house - 1) % 12] += 1;
      });
    }
    bav[planet] = rows;
  }
  const sav = Array.from({ length: 12 }, (_, i) =>
    Object.values(bav).reduce((sum, row) => sum + row[i], 0),
  );
  return { bav, sav, total: sav.reduce((a, b) => a + b, 0) };
}

export function sadeSati(moonSign, birth, ayanamsaSystem) {
  const start = new Date(birth.getTime() - 2 * YEAR_MS);
  const end = new Date(birth.getTime() + 85 * YEAR_MS);
  const step = 15 * 24 * 3600 * 1000;
  const points = [];
  for (let t = start.getTime(); t <= end.getTime(); t += step) {
    const date = new Date(t);
    const ayan = ayanamsaOf(ayanamsaSystem, date);
    const sat = norm(tropicalLongitude('saturn', date) - ayan);
    const sign = signOf(sat);
    const rel = (sign - moonSign + 12) % 12;
    let phase = null;
    if (rel === 11) phase = 'rising';
    else if (rel === 0) phase = 'peak';
    else if (rel === 1) phase = 'setting';
    points.push({ date, phase });
  }
  const periods = [];
  let open = null;
  points.forEach((p) => {
    if (p.phase && !open) open = { phase: p.phase, start: p.date, end: p.date };
    else if (p.phase && open && p.phase === open.phase) open.end = p.date;
    else if (open) {
      periods.push(open);
      open = p.phase ? { phase: p.phase, start: p.date, end: p.date } : null;
    }
  });
  if (open) periods.push(open);
  return periods.filter((p) => p.end.getTime() - p.start.getTime() > 20 * 24 * 3600 * 1000);
}

export function manglik(lagnaSign, moonSign, venusSign, marsSign, jupiterSign) {
  const houses = [1, 2, 4, 7, 8, 12];
  const from = (ref) => ((marsSign - ref + 12) % 12) + 1;
  const lagnaHouse = from(lagnaSign);
  const moonHouse = from(moonSign);
  const venusHouse = from(venusSign);
  const flags = {
    lagna: houses.includes(lagnaHouse),
    moon: houses.includes(moonHouse),
    venus: houses.includes(venusHouse),
  };
  const exceptions = [];
  if ([0, 7, 9].includes(marsSign)) exceptions.push('own-or-exalted');
  const jupFromMars = ((jupiterSign - marsSign + 12) % 12) + 1;
  if ([1, 5, 7, 9].includes(jupFromMars)) exceptions.push('jupiter-aspect');
  const active = flags.lagna || flags.moon || flags.venus;
  const cancelled = active && exceptions.length > 0 && !flags.lagna;
  return { flags, lagnaHouse, moonHouse, venusHouse, exceptions, active, cancelled };
}

export function varshphalYear(natalSunSidereal, year, latitude, longitude, ayanamsaSystem) {
  let t = Date.UTC(year, 0, 1);
  const sid = (time) => {
    const date = new Date(time);
    return norm(tropicalLongitude('sun', date) - ayanamsaOf(ayanamsaSystem, date));
  };
  let prevT = t;
  let prev = sid(t);
  let hit = null;
  for (let i = 0; i < 380; i += 1) {
    const nextT = prevT + 86400000;
    const cur = sid(nextT);
    const span = norm(cur - prev);
    const toTarget = norm(natalSunSidereal - prev);
    if (span > 0 && span < 2 && toTarget <= span) {
      hit = bisect(prevT, nextT, natalSunSidereal, sid);
      break;
    }
    prevT = nextT;
    prev = cur;
  }
  if (!hit) return null;
  const date = new Date(hit);
  const ayan = ayanamsaOf(ayanamsaSystem, date);
  const angles = tropicalAngles(date, latitude, longitude);
  const lagna = norm(angles.asc - ayan);
  const planets = {};
  ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'].forEach((id) => {
    planets[id] = norm(tropicalLongitude(id, date) - ayan);
  });
  planets.rahu = norm(trueNodeTropical(date) - ayan);
  planets.ketu = norm(planets.rahu + 180);
  const lagnaSign = signOf(lagna);
  const age = year - 0;
  return { date, lagna, lagnaSign, planets, mc: norm(angles.mc - ayan), ayan };
}

function bisect(a, b, target, sid) {
  let lo = a;
  let hi = b;
  for (let i = 0; i < 32; i += 1) {
    const mid = (lo + hi) / 2;
    const span = norm(sid(mid) - sid(lo));
    const toTarget = norm(target - sid(lo));
    if (toTarget <= span) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

export function muddaDasha(moonLon, start) {
  const nak = nakshatraOf(moonLon);
  const startIndex = DASHA_LORDS.indexOf(nak.lord);
  const rows = [];
  let cursor = start;
  const yearDays = 365.25;
  for (let i = 0; i < 9; i += 1) {
    const lord = DASHA_LORDS[(startIndex + i) % 9];
    const days = yearDays * (DASHA_YEARS[lord] / 120);
    const end = new Date(cursor.getTime() + days * 86400000);
    rows.push({ lord, start: new Date(cursor), end, days });
    cursor = end;
  }
  return rows;
}

export function aspectPairs(signs) {
  const ids = Object.keys(signs);
  const aspects = [];
  ids.forEach((from) => {
    const houses = [7];
    if (from === 'mars') houses.push(4, 8);
    if (from === 'jupiter' || from === 'rahu' || from === 'ketu') houses.push(5, 9);
    if (from === 'saturn') houses.push(3, 10);
    houses.forEach((h) => {
      const target = (signs[from] + h - 1) % 12;
      ids.forEach((to) => {
        if (to !== from && signs[to] === target) {
          aspects.push({ from, to, house: h, sign: target });
        }
      });
    });
  });
  return aspects;
}

export function detectYogas(bodies) {
  const byId = Object.fromEntries(bodies.map((b) => [b.id, b]));
  const yogas = [];
  const dist = (a, b) => (b.sign - a.sign + 12) % 12;
  if ([0, 3, 6, 9].includes(dist(byId.moon, byId.jupiter))) {
    yogas.push({ id: 'gajakesari', en: 'Gajakesari Yoga', hi: 'गजकेसरी योग' });
  }
  if (byId.sun.sign === byId.mercury.sign) {
    yogas.push({ id: 'budhaditya', en: 'Budhaditya Yoga', hi: 'बुधादित्य योग' });
  }
  if (byId.moon.sign === byId.mars.sign) {
    yogas.push({ id: 'chandra-mangal', en: 'Chandra-Mangal Yoga', hi: 'चन्द्र-मंगल योग' });
  }
  const mahapurusha = [
    ['mars', 'Ruchaka', 'रुचक'],
    ['mercury', 'Bhadra', 'भद्र'],
    ['jupiter', 'Hamsa', 'हंस'],
    ['venus', 'Malavya', 'मालव्य'],
    ['saturn', 'Sasha', 'शश'],
  ];
  mahapurusha.forEach(([id, en, hi]) => {
    const b = byId[id];
    if ([1, 4, 7, 10].includes(b.house) && (b.dignity === 'own' || b.dignity === 'exalted')) {
      yogas.push({ id: en.toLowerCase(), en: `${en} Yoga`, hi: `${hi} योग` });
    }
  });
  const kendra = [1, 4, 7, 10].map((h) => lordOf((bodies.find((b) => b.id === 'lagna').sign + h - 1) % 12));
  const trikona = [1, 5, 9].map((h) => lordOf((bodies.find((b) => b.id === 'lagna').sign + h - 1) % 12));
  const joined = kendra.some((k) => trikona.some((t) => k !== t && byId[k] && byId[t] && (byId[k].sign === byId[t].sign || byId[k].house === byId[t].house)));
  if (joined) yogas.push({ id: 'raj', en: 'Raja Yoga', hi: 'राज योग' });
  const moonHouse = byId.moon.house;
  const neighbours = bodies.filter((b) => !['moon', 'rahu', 'ketu', 'lagna'].includes(b.id) && (b.house === ((moonHouse + 10) % 12) + 1 || b.house === (moonHouse % 12) + 1));
  const kendraFromMoon = [0, 3, 6, 9].map((step) => ((moonHouse - 1 + step) % 12) + 1);
  const supported = bodies.some((b) => !['moon', 'rahu', 'ketu', 'lagna'].includes(b.id) && kendraFromMoon.includes(b.house));
  if (neighbours.length === 0 && !supported) yogas.push({ id: 'kemadruma', en: 'Kemadruma Yoga', hi: 'केमद्रुम योग' });
  return yogas;
}

export function placementHouse(lon, lagnaSign, cusps) {
  return {
    rasi: wholeSignHouse(lon, lagnaSign),
    bhava: houseFromCusps(lon, cusps),
    sign: signOf(lon),
    parts: formatParts(lon),
  };
}

void meanNodeTropical;
