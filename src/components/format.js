import { KARANAS, KARANAS_HI, MONTHS, NAKSHATRAS, PLANETS, TITHIS_HI, YOGINIS, planetName, signName } from '../data/catalog.js';
import { DIGNITY_TEXT, HOUSE_TEXT } from '../i18n.js';

export function fmtDate(date, offset, lang) {
  const z = new Date(date.getTime() + offset * 60000);
  const month = MONTHS[z.getUTCMonth()][lang === 'hi' ? 1 : 0];
  return `${z.getUTCDate()} ${month} ${z.getUTCFullYear()}`;
}

export function fmtWhen(date, offset, lang) {
  const z = new Date(date.getTime() + offset * 60000);
  let h = z.getUTCHours();
  const ampm = h >= 12 ? (lang === 'hi' ? 'अपराह्न' : 'PM') : lang === 'hi' ? 'पूर्वाह्न' : 'AM';
  h = h % 12 || 12;
  const min = String(z.getUTCMinutes()).padStart(2, '0');
  const sec = String(z.getUTCSeconds()).padStart(2, '0');
  return `${fmtDate(date, offset, lang)}, ${h}:${min}:${sec} ${ampm}`;
}

export function dignityLabel(dignity, lang) {
  const en = { exalted: 'Exalted', debilitated: 'Debilitated', own: 'Own sign', neutral: '—' };
  const hi = { exalted: 'उच्च', debilitated: 'नीच', own: 'स्वराशि', neutral: '—' };
  return (lang === 'hi' ? hi : en)[dignity];
}

export function paragraph(body, lang) {
  const name = planetName(body.id, lang);
  const sign = signName(body.sign, lang);
  const dig = DIGNITY_TEXT[lang === 'hi' ? 'hi' : 'en'][body.dignity];
  const house = HOUSE_TEXT[lang === 'hi' ? 'hi' : 'en'][body.house - 1];
  const retro = body.retro && body.id !== 'rahu' && body.id !== 'ketu'
    ? lang === 'hi'
      ? ' यह वक्री है, इसलिए फल देर से और पुनर्विचार के बाद खुलता है।'
      : ' It is retrograde, so the result ripens after delay and review.'
    : '';
  if (lang === 'hi') {
    return `${name} ${sign} राशि में ${body.house} भाव में स्थित है। ${dig} ${house}${retro}`;
  }
  return `${name} is in ${sign}, house ${body.house}. ${dig} ${house}${retro}`;
}

export function chunk(list, size) {
  const pages = [];
  for (let i = 0; i < list.length; i += size) pages.push(list.slice(i, i + size));
  return pages.length ? pages : [[]];
}

export function nakshatraLabel(index, lang) {
  const row = NAKSHATRAS[index];
  return lang === 'hi' ? row[1] : row[0];
}

export function tithiLabel(panchang, lang) {
  const paksha = panchang.paksha === 'Shukla' ? (lang === 'hi' ? 'शुक्ल' : 'Shukla') : lang === 'hi' ? 'कृष्ण' : 'Krishna';
  const name = lang === 'hi' ? TITHIS_HI[panchang.tithi] : panchang.tithiName;
  return `${paksha} ${name}`;
}

export function karanaLabel(index, lang) {
  return lang === 'hi' ? KARANAS_HI[index] : KARANAS[index];
}

export function yoginiName(index, lang) {
  const y = YOGINIS[index];
  return lang === 'hi' ? y.hi : y.en;
}

export function planetList() {
  return PLANETS;
}
