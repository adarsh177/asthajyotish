import { PLANETS, ZONES } from '../data/catalog.js';
import {
  ayanamsaOf,
  birthUtc,
  coordsFromForm,
  dignity,
  formatParts,
  houseFromCusps,
  isRetrograde,
  kpLords,
  meanNodeTropical,
  nakshatraOf,
  norm,
  porphyryCusps,
  signOf,
  tropicalAngles,
  tropicalLongitude,
  trueNodeTropical,
  wholeSignHouse,
} from './math.js';
import { allVargas } from './vargas.js';
import {
  ashtakavarga,
  aspectPairs,
  avkahada,
  charaDasha,
  detectYogas,
  manglik,
  muddaDasha,
  panchang,
  sadeSati,
  varshphalYear,
  vimshottari,
  yoginiDasha,
} from './periods.js';

const GRAHAS = PLANETS.map((p) => p.id);

export function buildKundli(form) {
  const zone = ZONES.find((z) => z.id === form.zoneId);
  form = { ...form, zoneOffset: zone ? zone.offset : 330 };
  const utc = birthUtc(form);
  const { lat, lon } = coordsFromForm(form);
  const ayan = ayanamsaOf(form.ayanamsa, utc);
  const angles = tropicalAngles(utc, lat, lon);
  const lagnaTropical = angles.asc;
  const lagna = norm(lagnaTropical - ayan);
  const lagnaSign = signOf(lagna);
  const cuspsTropical = porphyryCusps(angles.asc, angles.mc);
  const cusps = cuspsTropical.map((c) => norm(c - ayan));

  const bodies = GRAHAS.map((id) => {
    let tropical;
    if (id === 'rahu') {
      tropical = form.node === 'mean' ? meanNodeTropical(utc) : trueNodeTropical(utc);
    } else if (id === 'ketu') {
      return null;
    } else {
      tropical = tropicalLongitude(id, utc);
    }
    const sidereal = norm(tropical - ayan);
    const retro = id === 'rahu' || id === 'ketu' ? true : isRetrograde(id, utc);
    return makeBody(id, tropical, sidereal, lagnaSign, cusps, retro);
  }).filter(Boolean);

  const rahu = bodies.find((b) => b.id === 'rahu');
  bodies.push(makeBody('ketu', norm(rahu.tropical + 180), norm(rahu.sidereal + 180), lagnaSign, cusps, true));

  const lagnaBody = {
    id: 'lagna',
    tropical: lagnaTropical,
    sidereal: lagna,
    sign: lagnaSign,
    parts: formatParts(lagna),
    house: 1,
    bhava: 1,
    dignity: 'neutral',
    retro: false,
    nakshatra: nakshatraOf(lagna),
    kp: kpLords(lagna),
    vargas: allVargas(lagna),
  };

  const moon = bodies.find((b) => b.id === 'moon');
  const sun = bodies.find((b) => b.id === 'sun');
  const signs = Object.fromEntries(bodies.map((b) => [b.id, b.sign]));
  signs.lagna = lagnaSign;

  const vims = vimshottari(moon.sidereal, utc);
  const yogini = yoginiDasha(moon.sidereal, utc);
  const chara = scheduleChara(charaDasha(lagnaSign, signs), utc);
  const panch = panchang(utc, sun.tropical, moon.tropical, lat, lon);
  const avk = avkahada(moon.sidereal);
  const ashtak = ashtakavarga(signs, lagnaSign);
  const sati = sadeSati(moon.sign, utc, form.ayanamsa);
  const mang = manglik(
    lagnaSign,
    moon.sign,
    bodies.find((b) => b.id === 'venus').sign,
    bodies.find((b) => b.id === 'mars').sign,
    bodies.find((b) => b.id === 'jupiter').sign,
  );
  const aspects = aspectPairs(signs);
  const yogas = detectYogas([...bodies, lagnaBody]);

  const years = Math.max(1, Math.min(10, Number(form.varshphalYears) || 1));
  const fromYear = Number(form.varshphalYear);
  const varshphal = [];
  for (let i = 0; i < years; i += 1) {
    const year = fromYear + i;
    const annual = varshphalYear(sun.sidereal, year, lat, lon, form.ayanamsa);
    if (!annual) continue;
    const muntha = (lagnaSign + (year - Number(form.year)) + 1200) % 12;
    const moonSid = annual.planets.moon;
    varshphal.push({
      year,
      ...annual,
      muntha,
      mudda: muddaDasha(moonSid, annual.date),
      age: year - Number(form.year),
    });
  }

  const yoginiFrom = new Date(Date.UTC(Number(form.yoginiYear), Number(form.yoginiMonth) - 1, Number(form.yoginiDay)));

  return {
    form,
    utc,
    latitude: lat,
    longitude: lon,
    ayanamsa: ayan,
    lagna: lagnaBody,
    mc: { sidereal: norm(angles.mc - ayan), tropical: angles.mc, parts: formatParts(norm(angles.mc - ayan)) },
    cusps: cusps.map((lon, i) => ({
      house: i + 1,
      sidereal: lon,
      parts: formatParts(lon),
      sign: signOf(lon),
      kp: kpLords(lon),
    })),
    bodies,
    panchang: panch,
    avkahada: avk,
    vimshottari: vims,
    yogini,
    yoginiFrom,
    chara,
    ashtakavarga: ashtak,
    sadeSati: sati,
    manglik: mang,
    aspects,
    yogas,
    varshphal,
  };
}

function makeBody(id, tropical, sidereal, lagnaSign, cusps, retro) {
  const sign = signOf(sidereal);
  return {
    id,
    tropical,
    sidereal,
    sign,
    parts: formatParts(sidereal),
    tropicalParts: formatParts(tropical),
    house: wholeSignHouse(sidereal, lagnaSign),
    bhava: houseFromCusps(sidereal, cusps),
    dignity: dignity(id, sign),
    retro,
    nakshatra: nakshatraOf(sidereal),
    kp: kpLords(sidereal),
    vargas: allVargas(sidereal),
  };
}

function scheduleChara(chara, birth) {
  let cursor = birth;
  const rows = chara.rows.map((row) => {
    const end = new Date(cursor.getTime() + row.years * 365.25 * 24 * 3600 * 1000);
    const item = { ...row, start: new Date(cursor), end };
    cursor = end;
    return item;
  });
  return { forward: chara.forward, rows };
}

export function currentPeriod(rows, date) {
  return rows.find((row) => date >= row.start && date < row.end) || rows[rows.length - 1];
}
