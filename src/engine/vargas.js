import { SIGN_LORDS } from '../data/catalog.js';
import { norm, signOf } from './math.js';

function partSign(lon, parts, oddStart, evenStart) {
  const sign = signOf(lon);
  const within = norm(lon) % 30;
  const index = Math.min(parts - 1, Math.floor(within / (30 / parts)));
  const start = sign % 2 === 0 ? oddStart(sign) : evenStart(sign);
  return (start + index) % 12;
}

export function vargaSign(vargaId, lon) {
  const sign = signOf(lon);
  const within = norm(lon) % 30;
  if (vargaId === 'D1') return sign;
  if (vargaId === 'D2') {
    const second = within >= 15;
    if (sign % 2 === 0) return second ? 3 : 4;
    return second ? 4 : 3;
  }
  if (vargaId === 'D3') return (sign + Math.floor(within / 10) * 4) % 12;
  if (vargaId === 'D4') return (sign + Math.floor(within / 7.5) * 3) % 12;
  if (vargaId === 'D7') {
    const start = sign % 2 === 0 ? sign : (sign + 6) % 12;
    return (start + Math.floor(within / (30 / 7))) % 12;
  }
  if (vargaId === 'D9') {
    const starts = [0, 9, 6, 3];
    const start = starts[sign % 4];
    return (start + Math.floor(within / (30 / 9))) % 12;
  }
  if (vargaId === 'D10') {
    const start = sign % 2 === 0 ? sign : (sign + 8) % 12;
    return (start + Math.floor(within / 3)) % 12;
  }
  if (vargaId === 'D12') return (sign + Math.floor(within / 2.5)) % 12;
  if (vargaId === 'D16') {
    const starts = [0, 4, 8];
    return (starts[sign % 3] + Math.floor(within / (30 / 16))) % 12;
  }
  if (vargaId === 'D20') {
    const starts = [0, 8, 4];
    return (starts[sign % 3] + Math.floor(within / 1.5)) % 12;
  }
  if (vargaId === 'D24') {
    const start = sign % 2 === 0 ? 4 : 3;
    return (start + Math.floor(within / 1.25)) % 12;
  }
  if (vargaId === 'D27') {
    const starts = [0, 3, 6, 9];
    return (starts[sign % 4] + Math.floor(within / (30 / 27))) % 12;
  }
  if (vargaId === 'D30') return trimsamsa(sign, within);
  if (vargaId === 'D40') {
    const start = sign % 2 === 0 ? 0 : 6;
    return (start + Math.floor(within / 0.75)) % 12;
  }
  if (vargaId === 'D45') {
    const starts = [0, 4, 8];
    return (starts[sign % 3] + Math.floor(within / (30 / 45))) % 12;
  }
  if (vargaId === 'D60') {
    const part = Math.min(59, Math.floor(within * 2));
    if (sign % 2 === 0) return (sign + part) % 12;
    return (sign + (59 - part)) % 12;
  }
  return sign;
}

function trimsamsa(sign, within) {
  const odd = sign % 2 === 0;
  const bands = odd
    ? [[5, 0], [10, 10], [18, 8], [25, 2], [30, 6]]
    : [[5, 1], [12, 5], [20, 11], [25, 9], [30, 7]];
  for (const [limit, mapped] of bands) {
    if (within < limit) return mapped;
  }
  return bands[bands.length - 1][1];
}

export function allVargas(lon) {
  const ids = ['D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'];
  const out = {};
  ids.forEach((id) => {
    out[id] = vargaSign(id, lon);
  });
  return out;
}

export function lordOf(sign) {
  return SIGN_LORDS[sign];
}

void partSign;
