import { useMemo, useState } from 'react';
import { Alert, Box, CircularProgress, Container, CssBaseline, ThemeProvider } from '@mui/material';
import { PLACES } from './data/catalog.js';
import { buildKundli } from './engine/build.js';
import { t } from './i18n.js';
import BirthForm from './components/BirthForm.jsx';
import Viewer from './components/Viewer.jsx';
import { buildPages } from './components/report.jsx';
import theme from './theme.js';

const initial = {
  name: 'Adarsh Shrivastava',
  sex: 'Male',
  day: 17,
  month: 7,
  year: 2000,
  hour: 4,
  minute: 30,
  second: 0,
  ampm: 'PM',
  zoneId: 'ist',
  placeId: 'bhopal',
  latDeg: 23,
  latMin: 16,
  latDir: 'N',
  lonDeg: 77,
  lonMin: 25,
  lonDir: 'E',
  correctionSign: '+',
  correctionHours: 0,
  correctionMinutes: 0,
  ayanamsa: 'lahiri',
  charting: 'north',
  node: 'true',
  language: 'en',
  father: 'R K Shrivastava',
  mother: 'Rekha Shrivastava',
  grandfather: 'Narayan Prasad Shrivastava',
  gotra: 'Kashyap',
  yoginiDay: 25,
  yoginiMonth: 9,
  yoginiYear: 1986,
  varshphalYear: 2026,
  varshphalYears: 1,
};

export default function App() {
  const [form, setForm] = useState(initial);
  const [chart, setChart] = useState(null);
  const [page, setPage] = useState(0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const lang = form.language === 'hi' ? 'hi' : 'en';

  const pages = useMemo(() => (chart ? buildPages(chart) : []), [chart]);

  function calculate() {
    const place = PLACES.find((item) => item.id === form.placeId);
    const prepared = {
      ...form,
      placeName: place && place.id !== 'custom' ? (lang === 'hi' ? place.hi : place.en) : (lang === 'hi' ? 'निर्दिष्ट स्थान' : 'Specified place'),
      name: form.name.trim(),
    };
    if (!prepared.name) throw new Error(lang === 'hi' ? 'नाम लिखें।' : 'Enter a name.');
    if (prepared.latDeg < 0 || prepared.latDeg > 90 || prepared.lonDeg < 0 || prepared.lonDeg > 180) {
      throw new Error(lang === 'hi' ? 'अक्षांश या देशान्तर सीमा से बाहर है।' : 'Latitude or longitude is out of range.');
    }
    const dayCount = new Date(Date.UTC(prepared.year, prepared.month, 0)).getUTCDate();
    if (prepared.day > dayCount) throw new Error(lang === 'hi' ? 'यह तिथि उस माह में नहीं है।' : 'That day does not exist in the selected month.');
    return buildKundli(prepared);
  }

  function onPreview() {
    setBusy(true);
    setError('');
    window.setTimeout(() => {
      try {
        const next = calculate();
        setChart(next);
        setPage(0);
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        setBusy(false);
      }
    }, 30);
  }

  function onLanguage(language) {
    setForm((prev) => ({ ...prev, language }));
    setChart((prev) => {
      if (!prev) return prev;
      const place = PLACES.find((item) => item.id === prev.form.placeId);
      const placeName = place && place.id !== 'custom'
        ? (language === 'hi' ? place.hi : place.en)
        : (language === 'hi' ? 'निर्दिष्ट स्थान' : 'Specified place');
      return { ...prev, form: { ...prev.form, language, placeName } };
    });
  }

  function onPrint() {
    if (!chart) {
      try {
        const next = calculate();
        setChart(next);
        setPage(0);
        window.setTimeout(() => window.print(), 400);
      } catch (err) {
        setError(err.message || String(err));
      }
      return;
    }
    window.print();
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {chart ? (
        <Viewer lang={chart.form.language} pages={pages} index={page} setIndex={setPage} onBack={() => setChart(null)} onPrint={onPrint} onLanguage={onLanguage} />
      ) : (
        <Container maxWidth="md" sx={{ py: 3 }}>
          <BirthForm form={form} setForm={setForm} onPreview={onPreview} onPrint={onPrint} onLanguage={onLanguage} />
          {busy ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <CircularProgress size={22} />
              <span>{t(lang, 'calculating')}</span>
            </Box>
          ) : null}
          {error ? <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert> : null}
          <Alert severity="info" sx={{ mt: 2 }}>{t(lang, 'printHint')}</Alert>
        </Container>
      )}
    </ThemeProvider>
  );
}
