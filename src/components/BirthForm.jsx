import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AYANAMSAS, PLACES, ZONES } from '../data/catalog.js';
import { t } from '../i18n.js';
import LanguageToggle from './LanguageToggle.jsx';

function pad(value) {
  return String(value).padStart(2, '0');
}

function formatDate(year, month, day) {
  if (!year || !month || !day) return '';
  return `${pad(day)}-${pad(month)}-${String(year).padStart(4, '0')}`;
}

function parseDate(text) {
  const match = String(text).trim().match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || year < 1) return null;
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (day > last) return null;
  return { year, month, day };
}

function timeValue(hour, minute, second, ampm) {
  let h = Number(hour) % 12;
  if (ampm === 'PM') h += 12;
  return `${pad(h)}:${pad(minute)}:${pad(second || 0)}`;
}

function placeLabel(item, lang) {
  const city = lang === 'hi' ? item.hi : item.en;
  const country = lang === 'hi' ? item.countryHi : item.country;
  return country ? `${country} → ${city}` : city;
}

function split(value) {
  const abs = Math.abs(value);
  let deg = Math.floor(abs);
  let min = Math.round((abs - deg) * 60);
  if (min === 60) {
    min = 0;
    deg += 1;
  }
  return { deg, min };
}

export default function BirthForm({ form, setForm, onPreview, onPrint, onLanguage }) {
  const lang = form.language === 'hi' ? 'hi' : 'en';
  const [adjust, setAdjust] = useState(false);
  const set = (patch) => setForm((prev) => ({ ...prev, ...patch }));
  const place = PLACES.find((item) => item.id === form.placeId) || PLACES[PLACES.length - 1];
  const ayanLabel = AYANAMSAS.find((item) => item.id === form.ayanamsa);

  const onPlace = (placeId) => {
    const next = PLACES.find((item) => item.id === placeId);
    if (!next || next.lat == null) {
      set({ placeId });
      return;
    }
    const lat = split(next.lat);
    const lon = split(next.lon);
    set({
      placeId,
      zoneId: next.zone || form.zoneId,
      latDeg: lat.deg,
      latMin: lat.min,
      latDir: next.lat >= 0 ? 'N' : 'S',
      lonDeg: lon.deg,
      lonMin: lon.min,
      lonDir: next.lon >= 0 ? 'E' : 'W',
    });
  };

  const onTime = (value) => {
    const [h, minute, second] = value.split(':').map(Number);
    if (Number.isNaN(h) || Number.isNaN(minute)) return;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    set({ hour, minute, second: second || 0, ampm });
  };

  return (
    <Stack spacing={2.5} component="form" onSubmit={(event) => { event.preventDefault(); onPreview(); }}>
      <Box className="hero">
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="overline" sx={{ letterSpacing: 1.4, opacity: 0.85 }}>Vedic horoscope</Typography>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, fontSize: { xs: '2rem', sm: '2.6rem' } }}>{t(lang, 'app')}</Typography>
            <Typography sx={{ mt: 0.5, maxWidth: 520, opacity: 0.92 }}>{t(lang, 'subtitle')}</Typography>
          </Box>
          <LanguageToggle lang={lang} onChange={onLanguage} />
        </Box>
      </Box>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" gutterBottom>{t(lang, 'birth')}</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth required label={t(lang, 'name')} value={form.name} onChange={(e) => set({ name: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <SelectField label={t(lang, 'sex')} value={form.sex} onChange={(sex) => set({ sex })} options={[['Male', t(lang, 'male')], ['Female', t(lang, 'female')]]} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DateField
                required
                label={t(lang, 'birthDate')}
                year={form.year}
                month={form.month}
                day={form.day}
                onCommit={({ year, month, day }) => set({ year, month, day })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                type="time"
                label={t(lang, 'birthTime')}
                value={timeValue(form.hour, form.minute, form.second, form.ampm)}
                onChange={(e) => onTime(e.target.value)}
                slotProps={{ inputLabel: { shrink: true }, htmlInput: { step: 1 } }}
              />
            </Grid>
            <Grid size={12}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Autocomplete
                  sx={{ flex: 1 }}
                  options={PLACES}
                  value={place}
                  onChange={(_, next) => { if (next) onPlace(next.id); }}
                  getOptionLabel={(item) => placeLabel(item, lang)}
                  isOptionEqualToValue={(a, b) => a.id === b.id}
                  filterOptions={(options, state) => {
                    const query = state.inputValue.trim().toLowerCase();
                    if (!query) return options;
                    return options.filter((item) => (
                      item.en.toLowerCase().includes(query)
                      || item.country.toLowerCase().includes(query)
                      || item.hi.includes(state.inputValue.trim())
                      || item.countryHi.includes(state.inputValue.trim())
                    ));
                  }}
                  renderOption={(props, item) => {
                    const { key, ...rest } = props;
                    return <li key={key} {...rest}>{placeLabel(item, lang)}</li>;
                  }}
                  renderInput={(params) => <TextField {...params} label={t(lang, 'place')} />}
                />
                <Button type="button" variant="text" onClick={() => setAdjust((open) => !open)} sx={{ flexShrink: 0 }}>
                  {adjust ? t(lang, 'hideAdjust') : t(lang, 'showAdjust')}
                </Button>
              </Stack>
              <Collapse in={adjust}>
                <Box sx={{ pt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid size={12}>
                      <SelectField label={t(lang, 'zone')} value={form.zoneId} onChange={(zoneId) => set({ zoneId })} options={ZONES.map((z) => [z.id, z.label])} />
                    </Grid>
                    <Grid size={12}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>{t(lang, 'correction')}</Typography>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                        <Box sx={{ width: { sm: 96 }, flexShrink: 0 }}>
                          <SelectField label="±" value={form.correctionSign} onChange={(correctionSign) => set({ correctionSign })} options={[['+', '+'], ['-', '-']]} />
                        </Box>
                        <TextField fullWidth type="number" label={lang === 'hi' ? 'घण्टे' : 'Hours'} value={form.correctionHours} onChange={(e) => set({ correctionHours: Number(e.target.value) })} slotProps={{ htmlInput: { min: 0, max: 12 } }} />
                        <TextField fullWidth type="number" label={lang === 'hi' ? 'मिनट' : 'Minutes'} value={form.correctionMinutes} onChange={(e) => set({ correctionMinutes: Number(e.target.value) })} slotProps={{ htmlInput: { min: 0, max: 59 } }} />
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body2" color="text.secondary">{t(lang, 'latitude')}</Typography>
                      <Stack direction="row" spacing={1}>
                        <TextField type="number" label="°" value={form.latDeg} onChange={(e) => set({ latDeg: Number(e.target.value), placeId: 'custom' })} slotProps={{ htmlInput: { min: 0, max: 90 } }} />
                        <TextField type="number" label="'" value={form.latMin} onChange={(e) => set({ latMin: Number(e.target.value), placeId: 'custom' })} slotProps={{ htmlInput: { min: 0, max: 59 } }} />
                        <SelectField label="N/S" value={form.latDir} onChange={(latDir) => set({ latDir, placeId: 'custom' })} options={[['N', 'N'], ['S', 'S']]} />
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body2" color="text.secondary">{t(lang, 'longitude')}</Typography>
                      <Stack direction="row" spacing={1}>
                        <TextField type="number" label="°" value={form.lonDeg} onChange={(e) => set({ lonDeg: Number(e.target.value), placeId: 'custom' })} slotProps={{ htmlInput: { min: 0, max: 180 } }} />
                        <TextField type="number" label="'" value={form.lonMin} onChange={(e) => set({ lonMin: Number(e.target.value), placeId: 'custom' })} slotProps={{ htmlInput: { min: 0, max: 59 } }} />
                        <SelectField label="E/W" value={form.lonDir} onChange={(lonDir) => set({ lonDir, placeId: 'custom' })} options={[['E', 'E'], ['W', 'W']]} />
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" gutterBottom>{t(lang, 'basic')}</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label={t(lang, 'father')} value={form.father} onChange={(e) => set({ father: e.target.value })} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label={t(lang, 'mother')} value={form.mother} onChange={(e) => set({ mother: e.target.value })} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label={t(lang, 'grandfather')} value={form.grandfather} onChange={(e) => set({ grandfather: e.target.value })} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label={t(lang, 'gotra')} value={form.gotra} onChange={(e) => set({ gotra: e.target.value })} /></Grid>
          </Grid>
        </CardContent>
      </Card>

      <Accordion disableGutters elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '12px !important', '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box>
            <Typography variant="h6">{t(lang, 'options')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {(lang === 'hi' ? ayanLabel?.hi : ayanLabel?.en) || ''} · {form.charting === 'south' ? t(lang, 'south') : t(lang, 'north')} · {form.language === 'hi' ? 'हिन्दी' : 'English'}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}><SelectField label={t(lang, 'ayanamsa')} value={form.ayanamsa} onChange={(ayanamsa) => set({ ayanamsa })} options={AYANAMSAS.map((a) => [a.id, lang === 'hi' ? a.hi : a.en])} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><SelectField label={t(lang, 'charting')} value={form.charting} onChange={(charting) => set({ charting })} options={[['north', t(lang, 'north')], ['south', t(lang, 'south')]]} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><SelectField label={t(lang, 'node')} value={form.node} onChange={(node) => set({ node })} options={[['true', t(lang, 'trueNode')], ['mean', t(lang, 'meanNode')]]} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><SelectField label={t(lang, 'language')} value={form.language} onChange={(language) => set({ language })} options={[['hi', 'हिन्दी'], ['en', 'English']]} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <DateField
                label={`${t(lang, 'yogini')} · ${t(lang, 'yoginiFrom')}`}
                year={form.yoginiYear}
                month={form.yoginiMonth}
                day={form.yoginiDay}
                onCommit={({ year, month, day }) => set({ yoginiYear: year, yoginiMonth: month, yoginiDay: day })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">{t(lang, 'varshphal')}</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 1 }}>
                <TextField type="number" label={t(lang, 'fromYear')} value={form.varshphalYear} onChange={(e) => set({ varshphalYear: Number(e.target.value) })} slotProps={{ htmlInput: { min: 1900, max: 2200 } }} />
                <TextField type="number" label={`${t(lang, 'duration')} (${t(lang, 'years')})`} value={form.varshphalYears} onChange={(e) => set({ varshphalYears: Number(e.target.value) })} slotProps={{ htmlInput: { min: 1, max: 10 } }} />
              </Stack>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} className="no-print">
        <Button type="submit" variant="contained" size="large" startIcon={<VisibilityIcon />}>{t(lang, 'preview')}</Button>
        <Button type="button" variant="outlined" size="large" startIcon={<PrintIcon />} onClick={onPrint}>{t(lang, 'print')}</Button>
      </Stack>
    </Stack>
  );
}

function DateField({ label, year, month, day, onCommit, required }) {
  const committed = formatDate(year, month, day);
  const [text, setText] = useState(committed);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setText(committed);
  }, [committed, focused]);

  const commit = (value) => {
    const parsed = parseDate(value);
    if (parsed) onCommit(parsed);
    return parsed;
  };

  return (
    <TextField
      fullWidth
      required={required}
      label={label}
      placeholder="DD-MM-YYYY"
      value={text}
      onFocus={() => setFocused(true)}
      onChange={(event) => {
        setText(event.target.value);
        commit(event.target.value);
      }}
      onBlur={(event) => {
        setFocused(false);
        if (!commit(event.target.value)) setText(committed);
      }}
      slotProps={{ inputLabel: { shrink: true }, htmlInput: { inputMode: 'numeric', autoComplete: 'bday' } }}
    />
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select label={label} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map(([id, text]) => (
          <MenuItem key={String(id)} value={id}>{text}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
