import { AYANAMSAS, GANA_HI, NADI_HI, YONI_HI, ZONES, planetName, signName } from '../data/catalog.js';
import { formatParts } from '../engine/math.js';
import { HOUSE_TEXT, t } from '../i18n.js';
import { ChartFigure, Sudarshan, chartEntries } from './Charts.jsx';
import { chunk, dignityLabel, fmtDate, fmtWhen, karanaLabel, nakshatraLabel, paragraph, tithiLabel, yoginiName } from './format.js';

function Table({ columns, rows }) {
  return (
    <table className="grid">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function P({ children }) {
  return <p className="prose">{children}</p>;
}

export function buildPages(chart) {
  const lang = chart.form.language === 'hi' ? 'hi' : 'en';
  const hi = lang === 'hi';
  const off = chart.form.zoneOffset;
  const pages = [];
  const add = (title, body) => pages.push({ title, body });
  const L = (en, hindi) => (hi ? hindi : en);

  add(L('Title page', 'मुख पृष्ठ'), <Title chart={chart} />);
  add(
    L('Nirayana longitudes and Lagna, Chandra, Navamsa, Bhava Chalit', 'निरयण स्पष्ट ग्रह तथा लग्न, चन्द्र, नवांश, भाव चलित'),
    <Nirayana chart={chart} />,
  );
  add(L('Sayana longitudes and aspects', 'सायन स्पष्ट ग्रह तथा दृष्टि'), <Sayana chart={chart} />);
  add(L('Bhava positions and Bhava Chalit', 'भाव स्थिति तथा भाव चलित'), <BhavaPage chart={chart} />);
  add(L('Sudarshan Chakra', 'सुदर्शन चक्र'), <SudarshanPage chart={chart} />);
  add(L('KP — page 1', 'के.पी. — पृष्ठ 1'), <KpPlanets chart={chart} />);
  add(L('KP — page 2', 'के.पी. — पृष्ठ 2'), <KpCusps chart={chart} />);
  add(L('Sade Sati — page 1', 'साढ़े साती — पृष्ठ 1'), <SadeIntro chart={chart} />);
  add(L('Sade Sati — page 2', 'साढ़े साती — पृष्ठ 2'), <SadeTable chart={chart} />);
  add(L('Manglik consideration', 'मांगलिक विचार'), <ManglikPage chart={chart} />);

  const groups = [
    ['D1', 'D2', 'D3', 'D4'],
    ['D7', 'D9', 'D10', 'D12'],
    ['D16', 'D20', 'D24', 'D27'],
    ['D30', 'D40', 'D45', 'D60'],
  ];
  const groupNames = [
    L('Rasi, Hora, Drekkana, Chaturthamsa', 'राशि, होरा, द्रेष्काण, चतुर्थांश'),
    L('Saptamsa, Navamsa, Dasamsa, Dwadasamsa', 'सप्तांश, नवांश, दशांश, द्वादशांश'),
    L('Shodasamsa, Vimsamsa, Chaturvimsamsa, Saptavimsamsa', 'षोडशांश, विंशांश, चतुर्विंशांश, सप्तविंशांश'),
    L('Trimsamsa, Khavedamsa, Akshavedamsa, Shashtiamsa', 'त्रिंशांश, खवेदांश, अक्षवेदांश, षष्ट्यंश'),
  ];
  groups.forEach((ids, index) => {
    add(L(`Shodashvarga page ${index + 1}: ${groupNames[index]}`, `षोडशवर्ग पृष्ठ ${index + 1}: ${groupNames[index]}`), (
      <Vargas chart={chart} ids={ids} />
    ));
  });
  add(L('Shodashvarga table', 'षोडशवर्ग सारणी'), <VargaTable chart={chart} />);
  chunk(chart.vimshottari.mahas, 3).forEach((rows, index, all) => {
    add(L(`Vimshottari mahadasha and antardasha ${index + 1}`, `विंशोत्तरी महादशा तथा अन्तर्दशा ${index + 1}`), (
      <MahaAntar chart={chart} rows={rows} showBalance={index === 0} page={index + 1} total={all.length} />
    ));
  });

  const pratyantarRows = [];
  chart.vimshottari.mahas.forEach((maha) => {
    maha.antars.forEach((antar) => {
      antar.children.forEach((p) => {
        pratyantarRows.push([
          planetName(maha.lord, lang),
          planetName(antar.lord, lang),
          planetName(p.lord, lang),
          fmtDate(p.start, off, lang),
          fmtDate(p.end, off, lang),
        ]);
      });
    });
  });
  chunk(pratyantarRows, 25).forEach((rows, index, all) => {
    add(L(`Vimshottari pratyantar dasha page ${index + 1}`, `विंशोत्तरी प्रत्यन्तर दशा पृष्ठ ${index + 1}`), (
      <section>
        <P>
          {L(
            `Pratyantar periods, page ${index + 1} of ${all.length}. Dates follow the birth time zone.`,
            `प्रत्यन्तर काल, पृष्ठ ${index + 1} / ${all.length}। तिथियाँ जन्म के समय क्षेत्र के अनुसार हैं।`,
          )}
        </P>
        <Table columns={[L('Maha', 'महा'), L('Antar', 'अन्तर'), L('Pratyantar', 'प्रत्यन्तर'), L('From', 'से'), L('To', 'तक')]} rows={rows} />
      </section>
    ));
  });

  chunk(chart.yogini.mahas, 4).forEach((rows, index) => {
    add(L(`Yogini mahadasha page ${index + 1}`, `योगिनी महादशा पृष्ठ ${index + 1}`), <YoginiMaha chart={chart} rows={rows} />);
  });
  chunk(yoginiPratyantarRows(chart, lang), 18).forEach((rows, index, all) => {
    add(L(`Yogini pratyantar page ${index + 1}`, `योगिनी प्रत्यन्तर पृष्ठ ${index + 1}`), (
      <YoginiPratyantar chart={chart} rows={rows} page={index + 1} total={all.length} />
    ));
  });
  chunk(chart.chara.rows, 6).forEach((rows, index) => {
    add(L(`Chara dasha cycle ${index + 1}`, `चर दशा चक्र ${index + 1}`), <CharaPage chart={chart} rows={rows} />);
  });

  const general = generalParagraphs(chart);
  chunk(general, 3).forEach((rows, index) => {
    add(L(`General predictions part ${index + 1}`, `सामान्य फल भाग ${index + 1}`), (
      <section>
        {rows.map((text) => (
          <P key={text}>{text}</P>
        ))}
      </section>
    ));
  });

  chunk(chart.bodies, 3).forEach((rows, index) => {
    add(L(`Planetary position predictions page ${index + 1}`, `ग्रह स्थिति फल पृष्ठ ${index + 1}`), (
      <section>
        {rows.map((body) => (
          <P key={body.id}>{paragraph(body, lang)}</P>
        ))}
      </section>
    ));
  });

  const rashi = rashiParagraphs(chart);
  chunk(rashi, 6).forEach((rows, index) => {
    add(L(`Rashi position predictions page ${index + 1}`, `राशि स्थिति फल पृष्ठ ${index + 1}`), (
      <section>
        {rows.map((text) => (
          <P key={text}>{text}</P>
        ))}
      </section>
    ));
  });

  const aspectText = chart.aspects.map((aspect) => aspectLine(aspect, lang));
  chunk(aspectText.length ? aspectText : [L('No special planetary aspect is formed in this chart.', 'इस कुण्डली में कोई विशेष ग्रह दृष्टि नहीं बनी।')], 8).forEach((rows, index) => {
    add(L(`Interpretation of aspects: page ${index + 1}`, `दृष्टि विचार: पृष्ठ ${index + 1}`), (
      <section>
        {rows.map((text) => (
          <P key={text}>{text}</P>
        ))}
      </section>
    ));
  });

  chart.varshphal.forEach((year) => {
    add(L(`Varshphal ${year.year}: page 1`, `वर्षफल ${year.year}: पृष्ठ 1`), <VarshaChart chart={chart} year={year} />);
    add(L(`Varshphal ${year.year}: page 2`, `वर्षफल ${year.year}: पृष्ठ 2`), <VarshaPlanets chart={chart} year={year} />);
    add(L(`Varshphal ${year.year}: page 3`, `वर्षफल ${year.year}: पृष्ठ 3`), <VarshaDasha chart={chart} year={year} />);
  });

  return pages;
}

function Title({ chart }) {
  const lang = chart.form.language;
  const hi = lang === 'hi';
  const f = chart.form;
  const zone = ZONES.find((z) => z.id === f.zoneId);
  const ayan = AYANAMSAS.find((a) => a.id === f.ayanamsa);
  const av = chart.avkahada;
  const rows = [
    [hi ? 'नाम' : 'Name', f.name],
    [hi ? 'लिंग' : 'Sex', hi ? (f.sex === 'Female' ? 'स्त्री' : 'पुरुष') : f.sex],
    [hi ? 'जन्म' : 'Birth', fmtWhen(chart.utc, f.zoneOffset, lang)],
    [hi ? 'स्थान' : 'Place', f.placeName],
    [hi ? 'अक्षांश / देशान्तर' : 'Latitude / longitude', `${Math.abs(chart.latitude).toFixed(2)}° ${chart.latitude >= 0 ? 'N' : 'S'}, ${Math.abs(chart.longitude).toFixed(2)}° ${chart.longitude >= 0 ? 'E' : 'W'}`],
    [hi ? 'समय क्षेत्र' : 'Time zone', zone ? zone.label : ''],
    [hi ? 'अयनांश' : 'Ayanamsa', `${hi ? ayan.hi : ayan.en} (${chart.ayanamsa.toFixed(4)}°)`],
    [hi ? 'राहु' : 'Rahu', f.node === 'mean' ? (hi ? 'मध्यम' : 'Mean') : hi ? 'स्पष्ट' : 'True'],
    [hi ? 'पिता' : 'Father', f.father || '—'],
    [hi ? 'माता' : 'Mother', f.mother || '—'],
    [hi ? 'दादा' : 'Grandfather', f.grandfather || '—'],
    [hi ? 'गोत्र' : 'Gotra', f.gotra || '—'],
  ];
  return (
    <section>
      <p className="brand-line">{t(lang, 'app')}</p>
      <Table columns={[hi ? 'विषय' : 'Item', hi ? 'विवरण' : 'Detail']} rows={rows} />
      <h2>{hi ? 'पञ्चाङ्ग और अवकहडा' : 'Panchang and avkahada'}</h2>
      <Table
        columns={[hi ? 'विषय' : 'Item', hi ? 'मान' : 'Value']}
        rows={[
          [hi ? 'तिथि' : 'Tithi', tithiLabel(chart.panchang, lang)],
          [hi ? 'वार' : 'Vara', hi ? ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'][chart.panchang.weekday] : chart.panchang.weekdayName],
          [hi ? 'नक्षत्र' : 'Nakshatra', `${nakshatraLabel(av.nakshatra, lang)} ${hi ? 'पद' : 'pada'} ${av.pada}`],
          [hi ? 'योग' : 'Yoga', hi ? chart.panchang.yogaHi : chart.panchang.yogaName],
          [hi ? 'करण' : 'Karana', karanaLabel(chart.panchang.karana, lang)],
          [hi ? 'वर्ण' : 'Varna', av.varna],
          [hi ? 'वश्य' : 'Vashya', av.vashya],
          [hi ? 'योनि' : 'Yoni', hi ? YONI_HI[av.nakshatra] : av.yoni],
          [hi ? 'गण' : 'Gana', hi ? GANA_HI[av.gana] : av.gana],
          [hi ? 'नाड़ी' : 'Nadi', hi ? NADI_HI[av.nadi] : av.nadi],
        ]}
      />
      <p className="fine">
        {hi
          ? 'ग्रह स्थिति प्रकाशित खगोलीय गणना और शास्त्रीय पाराशरी नियमों से स्वतन्त्र रूप से निकाली गई है।'
          : 'Positions are calculated independently from published astronomy and classical Parashari rules.'}
      </p>
    </section>
  );
}

function Nirayana({ chart }) {
  const lang = chart.form.language;
  const hi = lang === 'hi';
  const style = chart.form.charting === 'south' ? 'south' : 'north';
  const specs = [
    ['lagna', hi ? 'लग्न कुण्डली' : 'Lagna kundli'],
    ['moon', hi ? 'चन्द्र कुण्डली' : 'Chandra kundli'],
    ['navamsa', hi ? 'नवांश' : 'Navamsa'],
    ['bhava', hi ? 'भाव चलित' : 'Bhava chalit'],
  ];
  return (
    <section>
      <div className="chart-grid">
        {specs.map(([kind, title]) => {
          const model = chartEntries(chart, kind);
          return <ChartFigure key={kind} title={title} style={style} originSign={model.origin} entries={model.entries} marker={model.marker} lang={lang} />;
        })}
      </div>
      <Table
        columns={[hi ? 'ग्रह' : 'Planet', hi ? 'राशि' : 'Sign', hi ? 'अंश' : 'Degree', hi ? 'नक्षत्र' : 'Nakshatra', hi ? 'भाव' : 'House', hi ? 'गति' : 'Motion']}
        rows={chart.bodies.map((b) => [
          planetName(b.id, lang),
          signName(b.sign, lang),
          b.parts.text,
          `${nakshatraLabel(b.nakshatra.index, lang)} ${b.nakshatra.pada}`,
          b.house,
          b.retro ? (hi ? 'वक्री' : 'Retro') : hi ? 'मार्गी' : 'Direct',
        ])}
      />
    </section>
  );
}

function Sayana({ chart }) {
  const lang = chart.form.language;
  const hi = lang === 'hi';
  return (
    <section>
      <P>
        {hi
          ? `अयनांश ${chart.ayanamsa.toFixed(4)}° घटाकर निरयण स्थिति बनाई गई है। नीचे सायन (ट्रॉपिकल) देशान्तर है।`
          : `Nirayana positions are tropical longitude minus ayanamsa ${chart.ayanamsa.toFixed(4)}°. Sayana longitudes are below.`}
      </P>
      <Table
        columns={[hi ? 'ग्रह' : 'Planet', hi ? 'सायन' : 'Sayana', hi ? 'निरयण' : 'Nirayana', hi ? 'राशि' : 'Sign']}
        rows={[
          [hi ? 'लग्न' : 'Lagna', chart.lagna.parts ? formatTropical(chart.lagna.tropical) : '', chart.lagna.parts.text, signName(chart.lagna.sign, lang)],
          ...chart.bodies.map((b) => [planetName(b.id, lang), formatTropical(b.tropical), b.parts.text, signName(b.sign, lang)]),
        ]}
      />
      <h2>{hi ? 'दृष्टि' : 'Aspects'}</h2>
      {chart.aspects.slice(0, 12).map((aspect) => (
        <P key={`${aspect.from}-${aspect.to}-${aspect.house}`}>{aspectLine(aspect, lang)}</P>
      ))}
    </section>
  );
}

function formatTropical(lon) {
  const n = ((lon % 360) + 360) % 360;
  const d = Math.floor(n);
  const m = Math.floor((n - d) * 60);
  return `${d}°${String(m).padStart(2, '0')}'`;
}

function BhavaPage({ chart }) {
  const lang = chart.form.language;
  const hi = lang === 'hi';
  const style = chart.form.charting === 'south' ? 'south' : 'north';
  const model = chartEntries(chart, 'bhava');
  return (
    <section>
      <P>
        {hi
          ? 'भाव चलित पोर्फिरी भावों पर है। राशि कुण्डली पूर्ण राशि से है। यदि दोनों भाव अलग हों तो ग्रह चलित में खिसका हुआ दिखेगा।'
          : 'Bhava chalit uses Porphyry houses. The rasi chart uses whole signs. A planet is shown shifted when the two houses differ.'}
      </P>
      <ChartFigure title={hi ? 'भाव चलित' : 'Bhava chalit'} style={style} originSign={model.origin} entries={model.entries} marker={model.marker} lang={lang} />
      <Table
        columns={[hi ? 'भाव' : 'House', hi ? 'भावारम्भ' : 'Cusp', hi ? 'राशि' : 'Sign', hi ? 'ग्रह (राशि / चलित)' : 'Planets (rasi / chalit)']}
        rows={chart.cusps.map((cusp) => {
          const inRasi = chart.bodies.filter((b) => b.house === cusp.house).map((b) => planetName(b.id, lang));
          const inBhava = chart.bodies.filter((b) => b.bhava === cusp.house).map((b) => planetName(b.id, lang));
          return [cusp.house, cusp.parts.text, signName(cusp.sign, lang), `${inRasi.join(', ') || '—'} / ${inBhava.join(', ') || '—'}`];
        })}
      />
    </section>
  );
}

function SudarshanPage({ chart }) {
  const hi = chart.form.language === 'hi';
  return (
    <section>
      <P>
        {hi
          ? 'बाहरी चक्र लग्न से, मध्य चक्र चन्द्र से और भीतरी चक्र सूर्य से है। प्रत्येक खण्ड उस केन्द्र से गिना गया भाव है।'
          : 'The outer ring is counted from the lagna, the middle ring from the Moon, and the inner ring from the Sun.'}
      </P>
      <Sudarshan chart={chart} />
    </section>
  );
}

function KpPlanets({ chart }) {
  const lang = chart.form.language;
  const hi = lang === 'hi';
  const rows = [chart.lagna, ...chart.bodies].map((b) => [
    b.id === 'lagna' ? (hi ? 'लग्न' : 'Ascendant') : planetName(b.id, lang),
    signName(b.sign, lang),
    b.parts.text,
    planetName(b.kp.star, lang),
    planetName(b.kp.sub, lang),
    planetName(b.kp.subSub, lang),
  ]);
  return (
    <section>
      <P>
        {hi
          ? 'नक्षत्र स्वामी और उपस्वामी विंशोत्तरी अनुपात से बाँटे गए हैं। भावारम्भ पोर्फिरी हैं।'
          : 'Star and sub lords follow the Vimshottari proportions inside each nakshatra. Cusps are Porphyry.'}
      </P>
      <Table columns={[hi ? 'ग्रह' : 'Planet', hi ? 'राशि' : 'Sign', hi ? 'अंश' : 'Degree', hi ? 'नक्षत्र स्वामी' : 'Star', hi ? 'उप' : 'Sub', hi ? 'प्रत्योप' : 'Sub-sub']} rows={rows} />
    </section>
  );
}

function KpCusps({ chart }) {
  const lang = chart.form.language;
  const hi = lang === 'hi';
  return (
    <section>
      <Table
        columns={[hi ? 'भाव' : 'Cusp', hi ? 'राशि' : 'Sign', hi ? 'अंश' : 'Degree', hi ? 'नक्षत्र स्वामी' : 'Star', hi ? 'उप' : 'Sub', hi ? 'प्रत्योप' : 'Sub-sub']}
        rows={chart.cusps.map((c) => [c.house, signName(c.sign, lang), c.parts.text, planetName(c.kp.star, lang), planetName(c.kp.sub, lang), planetName(c.kp.subSub, lang)])}
      />
    </section>
  );
}

function SadeIntro({ chart }) {
  const hi = chart.form.language === 'hi';
  const moon = signName(chart.bodies.find((b) => b.id === 'moon').sign, chart.form.language);
  return (
    <section>
      <P>
        {hi
          ? `साढ़े साती तब होती है जब शनि चन्द्र राशि ${moon} से द्वादश, प्रथम या द्वितीय राशि में गोचर करता है। उदय, चरम और अस्त लगभग ढाई-ढाई वर्ष के होते हैं।`
          : `Sade Sati runs while Saturn transits the twelfth, first or second sign from the Moon sign ${moon}. Rising, peak and setting each last about two and a half years.`}
      </P>
      <P>
        {hi
          ? 'नीचे दिए काल जन्म के आस-पास से आगे लगभग 85 वर्ष तक के गोचर से जोड़े गए हैं।'
          : 'The periods below are grouped from Saturn’s transit from just before birth through about 85 years.'}
      </P>
    </section>
  );
}

function SadeTable({ chart }) {
  const lang = chart.form.language;
  const hi = lang === 'hi';
  const phase = { rising: hi ? 'उदय' : 'Rising', peak: hi ? 'चरम' : 'Peak', setting: hi ? 'अस्त' : 'Setting' };
  const rows = chart.sadeSati.map((p) => [phase[p.phase], fmtDate(p.start, chart.form.zoneOffset, lang), fmtDate(p.end, chart.form.zoneOffset, lang)]);
  return <Table columns={[hi ? 'चरण' : 'Phase', hi ? 'से' : 'From', hi ? 'तक' : 'To']} rows={rows.length ? rows : [['—', '—', '—']]} />;
}

function ManglikPage({ chart }) {
  const lang = chart.form.language;
  const hi = lang === 'hi';
  const m = chart.manglik;
  const flag = (on) => (on ? (hi ? 'हाँ' : 'Yes') : hi ? 'नहीं' : 'No');
  return (
    <section>
      <P>
        {hi
          ? 'मांगलिक दोष तब गिना गया है जब मंगल लग्न, चन्द्र या शुक्र से 1, 2, 4, 7, 8 या 12 भाव में हो। मंगल की उच्च या स्वराशि, तथा गुरु की दृष्टि, शास्त्र में शमन माने जाते हैं।'
          : 'Manglik dosha is counted when Mars occupies house 1, 2, 4, 7, 8 or 12 from the lagna, Moon or Venus. Own sign, exaltation, and Jupiter’s aspect are classical mitigations.'}
      </P>
      <Table
        columns={[hi ? 'केन्द्र' : 'Reference', hi ? 'मंगल का भाव' : 'Mars house', hi ? 'मांगलिक' : 'Manglik']}
        rows={[
          [hi ? 'लग्न' : 'Lagna', m.lagnaHouse, flag(m.flags.lagna)],
          [hi ? 'चन्द्र' : 'Moon', m.moonHouse, flag(m.flags.moon)],
          [hi ? 'शुक्र' : 'Venus', m.venusHouse, flag(m.flags.venus)],
        ]}
      />
      <P>
        {m.active
          ? hi
            ? `दोष सक्रिय है। शमन: ${m.exceptions.length ? m.exceptions.join(', ') : 'कोई स्पष्ट शमन नहीं'}. ${m.cancelled ? 'लग्न से दोष नहीं है, इसलिए शमन को बल दिया जा सकता है।' : ''}`
            : `The condition is present. Mitigation: ${m.exceptions.length ? m.exceptions.join(', ') : 'none noted'}. ${m.cancelled ? 'It is absent from the lagna, so the mitigation carries more weight.' : ''}`
          : hi
            ? 'इस गणना में मंगल मांगलिक भावों में नहीं है।'
            : 'Mars does not occupy a Manglik house in this calculation.'}
      </P>
    </section>
  );
}

function Vargas({ chart, ids }) {
  const lang = chart.form.language;
  const style = chart.form.charting === 'south' ? 'south' : 'north';
  const names = { D1: 'Rasi', D2: 'Hora', D3: 'Drekkana', D4: 'Chaturthamsa', D7: 'Saptamsa', D9: 'Navamsa', D10: 'Dasamsa', D12: 'Dwadasamsa', D16: 'Shodasamsa', D20: 'Vimsamsa', D24: 'Chaturvimsamsa', D27: 'Saptavimsamsa', D30: 'Trimsamsa', D40: 'Khavedamsa', D45: 'Akshavedamsa', D60: 'Shashtiamsa' };
  return (
    <div className="chart-grid">
      {ids.map((id) => {
        const origin = id === 'D1' ? chart.lagna.sign : chart.lagna.vargas[id];
        const entries = chart.bodies.map((b) => ({
          sign: b.vargas[id],
          house: ((b.vargas[id] - origin + 12) % 12) + 1,
          label: planetName(b.id, lang).slice(0, lang === 'hi' ? 4 : 2),
        }));
        return <ChartFigure key={id} title={names[id]} style={style} originSign={origin} entries={entries} marker={lang === 'hi' ? 'ल' : 'Asc'} lang={lang} />;
      })}
    </div>
  );
}

function VargaTable({ chart }) {
  const lang = chart.form.language;
  const hi = lang === 'hi';
  const ids = ['D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'];
  const header = [hi ? 'ग्रह' : 'Planet', ...ids];
  const rows = [chart.lagna, ...chart.bodies].map((b) => [
    b.id === 'lagna' ? (hi ? 'लग्न' : 'Asc') : planetName(b.id, lang),
    ...ids.map((id) => signName(b.vargas[id], lang)),
  ]);
  return <Table columns={header} rows={rows} />;
}

function MahaAntar({ chart, rows, showBalance, page, total }) {
  const lang = chart.form.language;
  const hi = lang === 'hi';
  const off = chart.form.zoneOffset;
  const balance = chart.vimshottari.balanceYears;
  return (
    <section>
      {showBalance ? (
        <P>
          {hi
            ? `जन्म के समय ${planetName(chart.vimshottari.lord, lang)} महादशा का शेष ${balance.toFixed(2)} वर्ष है। पृष्ठ ${page} / ${total}।`
            : `At birth, ${balance.toFixed(2)} years remain in the ${planetName(chart.vimshottari.lord, lang)} mahadasha. Page ${page} of ${total}.`}
        </P>
      ) : null}
      {rows.map((maha) => (
        <div key={maha.lord + maha.start.toISOString()}>
          <h2>
            {planetName(maha.lord, lang)} · {fmtDate(maha.start, off, lang)} – {fmtDate(maha.end, off, lang)}
          </h2>
          <Table
            columns={[hi ? 'अन्तर' : 'Antar', hi ? 'से' : 'From', hi ? 'तक' : 'To']}
            rows={maha.antars.map((a) => [planetName(a.lord, lang), fmtDate(a.start, off, lang), fmtDate(a.end, off, lang)])}
          />
        </div>
      ))}
    </section>
  );
}

function YoginiMaha({ chart, rows }) {
  const lang = chart.form.language;
  const hi = lang === 'hi';
  const off = chart.form.zoneOffset;
  return (
    <section>
      {rows.map((maha) => (
        <div key={maha.start.toISOString()}>
          <h2>
            {yoginiName(maha.index, lang)} · {fmtDate(maha.start, off, lang)} – {fmtDate(maha.end, off, lang)}
          </h2>
          <Table
            columns={[hi ? 'अन्तर' : 'Antar', hi ? 'से' : 'From', hi ? 'तक' : 'To']}
            rows={maha.antars.map((a) => [yoginiName(a.index, lang), fmtDate(a.start, off, lang), fmtDate(a.end, off, lang)])}
          />
        </div>
      ))}
    </section>
  );
}

function yoginiPratyantarRows(chart, lang) {
  const off = chart.form.zoneOffset;
  const from = chart.yoginiFrom.getTime();
  const until = from + 3 * 365.25 * 86400000;
  const rows = [];
  chart.yogini.mahas.forEach((maha) => {
    maha.antars.forEach((antar) => {
      antar.pratyantar.forEach((p) => {
        if (p.end.getTime() >= from && p.start.getTime() <= until) {
          rows.push([yoginiName(maha.index, lang), yoginiName(antar.index, lang), yoginiName(p.index, lang), fmtDate(p.start, off, lang), fmtDate(p.end, off, lang)]);
        }
      });
    });
  });
  return rows;
}

function YoginiPratyantar({ chart, rows, page, total }) {
  const lang = chart.form.language;
  const hi = lang === 'hi';
  return (
    <section>
      <P>
        {hi
          ? `योगिनी प्रत्यन्तर ${fmtDate(chart.yoginiFrom, 0, lang)} से अगले तीन वर्षों तक। पृष्ठ ${page} / ${total}।`
          : `Yogini pratyantar from ${fmtDate(chart.yoginiFrom, 0, lang)} through the following three years. Page ${page} of ${total}.`}
      </P>
      <Table columns={[hi ? 'महा' : 'Maha', hi ? 'अन्तर' : 'Antar', hi ? 'प्रत्यन्तर' : 'Pratyantar', hi ? 'से' : 'From', hi ? 'तक' : 'To']} rows={rows.length ? rows : [['—', '—', '—', '—', '—']]} />
    </section>
  );
}

function CharaPage({ chart, rows }) {
  const lang = chart.form.language;
  const hi = lang === 'hi';
  const off = chart.form.zoneOffset;
  return (
    <section>
      <P>
        {hi
          ? `चर दशा लग्न से ${chart.chara.forward ? 'सव्य' : 'अपसव्य'} क्रम में है। वर्ष संख्या राशि से उसके स्वामी तक की गिनती है।`
          : `Chara dasha runs ${chart.chara.forward ? 'forward' : 'backward'} from the lagna. Years equal the count from the sign to its lord.`}
      </P>
      <Table
        columns={[hi ? 'राशि' : 'Sign', hi ? 'वर्ष' : 'Years', hi ? 'से' : 'From', hi ? 'तक' : 'To']}
        rows={rows.map((row) => [signName(row.sign, lang), row.years, fmtDate(row.start, off, lang), fmtDate(row.end, off, lang)])}
      />
    </section>
  );
}

function generalParagraphs(chart) {
  const lang = chart.form.language;
  const hi = lang === 'hi';
  const lagna = signName(chart.lagna.sign, lang);
  const moon = chart.bodies.find((b) => b.id === 'moon');
  const sun = chart.bodies.find((b) => b.id === 'sun');
  const tenth = (chart.lagna.sign + 9) % 12;
  const seventh = (chart.lagna.sign + 6) % 12;
  const now = new Date();
  const maha = chart.vimshottari.mahas.find((row) => now >= row.start && now < row.end) || chart.vimshottari.mahas[0];
  const antar = maha.antars.find((row) => now >= row.start && now < row.end) || maha.antars[0];
  const yogaText = chart.yogas.length
    ? chart.yogas.map((y) => (hi ? y.hi : y.en)).join(', ')
    : hi
      ? 'कोई प्रमुख नामित योग नहीं चुना गया'
      : 'no major named yoga was selected';
  if (hi) {
    return [
      `${chart.form.name} की लग्न ${lagna} है। ${HOUSE_TEXT.hi[0]} लग्न का स्वामी ${lordName(chart.lagna.sign, lang)} इस जातक के जीवन की दिशा बताता है।`,
      `चन्द्र ${signName(moon.sign, lang)} का है और ${moon.house} भाव में है। ${HOUSE_TEXT.hi[moon.house - 1]} मन और लोकप्रियता मुख्यतः इसी स्थिति से पढ़े जाते हैं।`,
      `सूर्य ${signName(sun.sign, lang)} में ${sun.house} भाव का है। ${HOUSE_TEXT.hi[sun.house - 1]}`,
      `दशम भाव ${signName(tenth, lang)} का है। कर्म और प्रतिष्ठा इस भाव के स्वामी तथा उसमें बैठे ग्रहों से बनती है।`,
      `सप्तम भाव ${signName(seventh, lang)} का है। विवाह और साझेदारी इसी भाव तथा शुक्र की स्थिति से देखे जाते हैं।`,
      `इस समय ${planetName(maha.lord, lang)} महादशा और ${planetName(antar.lord, lang)} अन्तर्दशा चल रही है। फल इन दोनों ग्रहों के भाव और राशि बल के अनुसार आता है।`,
      `चुने गए योग: ${yogaText}। योग तभी पूरा फल देता है जब दोनों ग्रह बलवान हों और बाधित न हों।`,
      moon.dignity === 'debilitated'
        ? 'चन्द्र नीच है, इसलिए मन की स्थिरता के लिए नियमित दिनचर्या सहायक है।'
        : 'चन्द्र की स्थिति मन को उसके राशि स्वभाव के अनुरूप रखती है।',
    ];
  }
  return [
    `${chart.form.name} has ${lagna} lagna. ${HOUSE_TEXT.en[0]} The lagna lord, ${planetName(lordId(chart.lagna.sign), lang)}, sets much of the life direction.`,
    `The Moon is in ${signName(moon.sign, lang)} and house ${moon.house}. ${HOUSE_TEXT.en[moon.house - 1]} Mind and popularity are read mainly from this placement.`,
    `The Sun is in ${signName(sun.sign, lang)}, house ${sun.house}. ${HOUSE_TEXT.en[sun.house - 1]}`,
    `The tenth house is ${signName(tenth, lang)}. Profession and public standing follow its lord and the planets that occupy it.`,
    `The seventh house is ${signName(seventh, lang)}. Marriage and partnership are read from this house together with Venus.`,
    `The period operating now is ${planetName(maha.lord, lang)} mahadasha and ${planetName(antar.lord, lang)} antardasha. Results follow the houses and dignity of those two planets.`,
    `Named yogas found: ${yogaText}. A yoga gives its full result when both planets are strong and unobstructed.`,
    moon.dignity === 'debilitated'
      ? 'The Moon is debilitated, so a steady daily rhythm helps the mind.'
      : 'The Moon expresses the temperament of its sign without classical debilitation.',
  ];
}

function lordId(sign) {
  return ['mars', 'venus', 'mercury', 'moon', 'sun', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter'][sign];
}

function lordName(sign, lang) {
  return planetName(lordId(sign), lang);
}

function rashiParagraphs(chart) {
  const lang = chart.form.language;
  const hi = lang === 'hi';
  const lines = [];
  lines.push(
    hi
      ? `लग्न राशि ${signName(chart.lagna.sign, lang)} जातक के शरीर और स्वभाव की पृष्ठभूमि है।`
      : `${signName(chart.lagna.sign, lang)} rising is the background of body and temperament.`,
  );
  chart.bodies.forEach((b) => {
    lines.push(
      hi
        ? `${planetName(b.id, lang)} की राशि ${signName(b.sign, lang)} है (${dignityLabel(b.dignity, lang)})। राशि फल भाव फल के साथ पढ़ा जाता है।`
        : `${planetName(b.id, lang)} occupies ${signName(b.sign, lang)} (${dignityLabel(b.dignity, lang)}). The sign result is read together with the house result.`,
    );
  });
  return lines;
}

function aspectLine(aspect, lang) {
  const hi = lang === 'hi';
  const from = planetName(aspect.from, lang);
  const to = planetName(aspect.to, lang);
  if (hi) return `${from} की ${aspect.house} वीं दृष्टि ${to} पर है। दृष्ट ग्रह के भाव दोनों ग्रहों के स्वभाव से रंगे जाते हैं।`;
  return `${from} casts its ${aspect.house}th aspect on ${to}. The houses of the aspected planet take on the nature of both planets.`;
}

function VarshaChart({ chart, year }) {
  const lang = chart.form.language;
  const hi = lang === 'hi';
  const style = chart.form.charting === 'south' ? 'south' : 'north';
  const entries = Object.entries(year.planets).map(([id, lon]) => {
    const sign = Math.floor((((lon % 360) + 360) % 360) / 30);
    return {
      sign,
      house: ((sign - year.lagnaSign + 12) % 12) + 1,
      label: planetName(id, lang).slice(0, hi ? 3 : 2),
    };
  });
  return (
    <section>
      <P>
        {hi
          ? `वर्ष ${year.year} का सौर वर्षार्म्भ ${fmtWhen(year.date, chart.form.zoneOffset, lang)} को है। मुन्था ${signName(year.muntha, lang)} में है। आयु गणना ${year.age}।`
          : `The solar return for ${year.year} falls on ${fmtWhen(year.date, chart.form.zoneOffset, lang)}. Muntha is in ${signName(year.muntha, lang)}. Completed years counted: ${year.age}.`}
      </P>
      <ChartFigure title={hi ? 'वर्ष कुण्डली' : 'Annual chart'} style={style} originSign={year.lagnaSign} entries={entries} marker={hi ? 'ल' : 'Asc'} lang={lang} />
    </section>
  );
}

function VarshaPlanets({ chart, year }) {
  const lang = chart.form.language;
  const hi = lang === 'hi';
  const lagna = formatParts(year.lagna);
  const rows = [[hi ? 'लग्न' : 'Ascendant', signName(year.lagnaSign, lang), lagna.text]];
  Object.entries(year.planets).forEach(([id, lon]) => {
    const parts = formatParts(lon);
    rows.push([planetName(id, lang), signName(parts.sign, lang), parts.text]);
  });
  return (
    <section>
      <P>
        {hi
          ? `वर्ष ${year.year} की वर्ष कुण्डली में ग्रह स्थिति।`
          : `Sidereal positions in the ${year.year} annual chart.`}
      </P>
      <Table columns={[hi ? 'ग्रह' : 'Planet', hi ? 'राशि' : 'Sign', hi ? 'ांश' : 'Longitude']} rows={rows} />
    </section>
  );
}

function VarshaDasha({ chart, year }) {
  const lang = chart.form.language;
  const hi = lang === 'hi';
  const off = chart.form.zoneOffset;
  return (
    <section>
      <P>
        {hi
          ? 'मुद्दा दशा वार्षिक चन्द्र नक्षत्र से आरम्भ होकर एक सौर वर्ष में पूरी विंशोत्तरी होती है।'
          : 'Mudda dasha starts from the annual Moon nakshatra and completes one Vimshottari cycle inside the solar year.'}
      </P>
      <Table
        columns={[hi ? 'दशा' : 'Dasha', hi ? 'से' : 'From', hi ? 'तक' : 'To']}
        rows={year.mudda.map((row) => [planetName(row.lord, lang), fmtDate(row.start, off, lang), fmtDate(row.end, off, lang)])}
      />
    </section>
  );
}
