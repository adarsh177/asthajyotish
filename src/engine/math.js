import * as Astronomy from 'astronomy-engine';
import { DASHA_LORDS, DASHA_YEARS, EXALT, OWN } from '../data/catalog.js';

export function norm(deg) {
  const x = deg % 360;
  return x < 0 ? x + 360 : x;
}

export function signOf(lon) {
  return Math.floor(norm(lon) / 30) % 12;
}

export function jdUt(date) {
  return Astronomy.MakeTime(date).ut + 2451545.0;
}

export function ayanamsaOf(system, date) {
  const jd = jdUt(date);
  const T = (jd - 2451545.0) / 36525;
  const lahiri = 23.85305556 + 1.39604167 * T + 0.000308 * T * T;
  if (system === 'raman') return norm(lahiri - 1.393194);
  if (system === 'krishnamurti') {
    const years = (jd - 2415020.5) / 365.24219;
    return norm(22.377778 + years * (50.2388475 / 3600));
  }
  if (system === 'yukteshwar') {
    const years = (jd - 1903393.5) / 365.24219;
    return norm(years * (50.29 / 3600));
  }
  return norm(lahiri);
}

export function tropicalLongitude(id, date) {
  if (id === 'moon') return norm(Astronomy.EclipticGeoMoon(date).lon);
  const body = {
    sun: Astronomy.Body.Sun,
    mercury: Astronomy.Body.Mercury,
    venus: Astronomy.Body.Venus,
    mars: Astronomy.Body.Mars,
    jupiter: Astronomy.Body.Jupiter,
    saturn: Astronomy.Body.Saturn,
  }[id];
  return norm(Astronomy.Ecliptic(Astronomy.GeoVector(body, date, true)).elon);
}

function eclipticCartesian(date) {
  const eq = Astronomy.GeoVector(Astronomy.Body.Moon, date, false);
  if (typeof Astronomy.Rotation_EQJ_ECL === 'function' && typeof Astronomy.RotateVector === 'function') {
    return Astronomy.RotateVector(Astronomy.Rotation_EQJ_ECL(), eq);
  }
  const eps = (23.4392911 * Math.PI) / 180;
  return {
    x: eq.x,
    y: eq.y * Math.cos(eps) + eq.z * Math.sin(eps),
    z: -eq.y * Math.sin(eps) + eq.z * Math.cos(eps),
  };
}

export function trueNodeTropical(date) {
  const dt = 4 * 3600 * 1000;
  const a = eclipticCartesian(new Date(date.getTime() - dt));
  const b = eclipticCartesian(new Date(date.getTime() + dt));
  const vx = b.x - a.x;
  const vy = b.y - a.y;
  const vz = b.z - a.z;
  const hx = b.y * vz - b.z * vy;
  const hy = b.z * vx - b.x * vz;
  let lon = norm((Math.atan2(hx, -hy) * 180) / Math.PI);
  const mean = meanNodeTropical(date);
  const gap = Math.abs(norm(lon - mean + 180) - 180);
  if (gap > 90) lon = norm(lon + 180);
  return lon;
}

export function meanNodeTropical(date) {
  const T = (jdUt(date) - 2451545.0) / 36525;
  return norm(
    125.0445479 -
      1934.1362891 * T +
      0.0020754 * T * T +
      (T * T * T) / 467441 -
      (T * T * T * T) / 60616000,
  );
}

export function tropicalAngles(date, latitude, longitude) {
  const gastHours = Astronomy.SiderealTime(date);
  const ramcDeg = norm(gastHours * 15 + longitude);
  const eps = (Astronomy.e_tilt(Astronomy.MakeTime(date)).tobl * Math.PI) / 180;
  const ramc = (ramcDeg * Math.PI) / 180;
  const phi = (latitude * Math.PI) / 180;
  const asc = Math.atan2(
    Math.cos(ramc),
    -(Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps)),
  );
  const mc = Math.atan2(Math.sin(ramc), Math.cos(ramc) * Math.cos(eps));
  return {
    asc: norm((asc * 180) / Math.PI),
    mc: norm((mc * 180) / Math.PI),
    ramc: ramcDeg,
  };
}

function forward(from, to) {
  return norm(to - from);
}

export function porphyryCusps(asc, mc) {
  const c = Array(12);
  c[0] = norm(asc);
  c[9] = norm(mc);
  c[6] = norm(asc + 180);
  c[3] = norm(mc + 180);
  const arc = (a, b) => forward(a, b);
  c[10] = norm(c[9] + arc(c[9], c[0]) / 3);
  c[11] = norm(c[9] + (2 * arc(c[9], c[0])) / 3);
  c[1] = norm(c[0] + arc(c[0], c[3]) / 3);
  c[2] = norm(c[0] + (2 * arc(c[0], c[3])) / 3);
  c[4] = norm(c[3] + arc(c[3], c[6]) / 3);
  c[5] = norm(c[3] + (2 * arc(c[3], c[6])) / 3);
  c[7] = norm(c[6] + arc(c[6], c[9]) / 3);
  c[8] = norm(c[6] + (2 * arc(c[6], c[9])) / 3);
  return c;
}

export function houseFromCusps(lon, cusps) {
  const x = norm(lon);
  for (let i = 0; i < 12; i += 1) {
    const a = cusps[i];
    const b = cusps[(i + 1) % 12];
    const span = forward(a, b);
    if (forward(a, x) <= span + 1e-8) return i + 1;
  }
  return 1;
}

export function wholeSignHouse(lon, lagnaSign) {
  return ((signOf(lon) - lagnaSign + 12) % 12) + 1;
}

export function formatParts(lon) {
  const n = norm(lon);
  const sign = Math.floor(n / 30);
  let within = n - sign * 30;
  let d = Math.floor(within);
  let mf = (within - d) * 60;
  let m = Math.floor(mf);
  let s = Math.round((mf - m) * 60);
  if (s === 60) {
    s = 0;
    m += 1;
  }
  if (m === 60) {
    m = 0;
    d += 1;
  }
  if (d === 30) {
    d = 0;
  }
  const text = `${d}°${String(m).padStart(2, '0')}'${String(s).padStart(2, '0')}"`;
  return { sign, d, m, s, text };
}

export function formatLon(lon) {
  const p = formatParts(lon);
  return `${p.text}`;
}

export function dignity(id, sign) {
  if (EXALT[id] === sign) return 'exalted';
  if (EXALT[id] != null && (EXALT[id] + 6) % 12 === sign) return 'debilitated';
  if (OWN[id]?.includes(sign)) return 'own';
  return 'neutral';
}

export function nakshatraOf(lon) {
  const span = 360 / 27;
  const n = norm(lon);
  const index = Math.min(26, Math.floor(n / span));
  const offset = n - index * span;
  const pada = Math.min(4, Math.floor(offset / (span / 4)) + 1);
  const lord = DASHA_LORDS[index % 9];
  return { index, pada, lord, offset, span };
}

export function kpLords(lon) {
  const nak = nakshatraOf(lon);
  const start = DASHA_LORDS.indexOf(nak.lord);
  let cursor = 0;
  let sub = nak.lord;
  for (let k = 0; k < 9; k += 1) {
    const lord = DASHA_LORDS[(start + k) % 9];
    const width = nak.span * (DASHA_YEARS[lord] / 120);
    if (nak.offset <= cursor + width + 1e-8) {
      sub = lord;
      const into = nak.offset - cursor;
      let subCursor = 0;
      let subSub = lord;
      const subStart = DASHA_LORDS.indexOf(lord);
      for (let j = 0; j < 9; j += 1) {
        const sl = DASHA_LORDS[(subStart + j) % 9];
        const sw = width * (DASHA_YEARS[sl] / 120);
        if (into <= subCursor + sw + 1e-8) {
          subSub = sl;
          break;
        }
        subCursor += sw;
      }
      return { star: nak.lord, sub, subSub };
    }
    cursor += width;
  }
  return { star: nak.lord, sub, subSub: sub };
}

export function isRetrograde(id, date) {
  if (id === 'rahu' || id === 'ketu') return true;
  const a = tropicalLongitude(id, date);
  const b = tropicalLongitude(id, new Date(date.getTime() + 24 * 3600 * 1000));
  const delta = norm(b - a + 180) - 180;
  return delta < -0.02;
}

export const YEAR_MS = 365.25 * 24 * 3600 * 1000;

export function addYears(date, years) {
  return new Date(date.getTime() + years * YEAR_MS);
}

export function coordsFromForm(form) {
  const lat = (form.latDeg + form.latMin / 60) * (form.latDir === 'S' ? -1 : 1);
  const lon = (form.lonDeg + form.lonMin / 60) * (form.lonDir === 'W' ? -1 : 1);
  return { lat, lon };
}

export function birthUtc(form) {
  const sign = form.correctionSign === '-' ? -1 : 1;
  let hour = form.hour % 12;
  if (form.ampm === 'PM') hour += 12;
  const corr = sign * (Number(form.correctionHours) * 60 + Number(form.correctionMinutes));
  const localMinutes = hour * 60 + Number(form.minute) + Number(form.second) / 60 + corr;
  const utc = new Date(Date.UTC(Number(form.year), Number(form.month) - 1, Number(form.day), 0, 0, 0));
  utc.setTime(utc.getTime() + (localMinutes - Number(form.zoneOffset)) * 60 * 1000);
  return utc;
}

export function dateFromParts(y, m, d) {
  return new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), 0, 0, 0));
}
