import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { AYANAMSAS, ZONES } from '../data/catalog.js';
import { t } from '../i18n.js';
import LanguageToggle from './LanguageToggle.jsx';
import PlaceSearch from './PlaceSearch.jsx';

function dateValue(year, month, day) {
  return year && month && day ? dayjs(new Date(year, month - 1, day)) : null;
}

function timeValue(hour, minute, second, ampm) {
  let h = Number(hour) % 12;
  if (ampm === 'PM') h += 12;
  return dayjs().hour(h).minute(Number(minute) || 0).second(Number(second) || 0);
}

const pickerSlots = { openPickerButton: { type: 'button' } };

function formatOffset(minutes) {
  const sign = minutes < 0 ? '-' : '+';
  const abs = Math.abs(Math.round(minutes));
  const hours = Math.floor(abs / 60);
  const mins = abs % 60;
  return `UTC${sign}${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

function zoneChoices(form) {
  const rows = ZONES.map((zone) => [zone.id, zone.label]);
  if (!ZONES.some((zone) => zone.id === form.zoneId) && Number.isFinite(form.zoneOffsetMinutes)) {
    rows.unshift([form.zoneId, formatOffset(form.zoneOffsetMinutes)]);
  }
  return rows;
}

export default function BirthForm({ form, setForm, onPreview, onPrint, onLanguage }) {
  const lang = form.language === 'hi' ? 'hi' : 'en';
  const [adjust, setAdjust] = useState(false);
  const set = (patch) => setForm((prev) => ({ ...prev, ...patch }));
  const ayanLabel = AYANAMSAS.find((item) => item.id === form.ayanamsa);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
              <DesktopDatePicker
                label={t(lang, 'birthDate')}
                format="DD-MM-YYYY"
                value={dateValue(form.year, form.month, form.day)}
                onChange={(next) => {
                  if (next?.isValid()) set({ year: next.year(), month: next.month() + 1, day: next.date() });
                }}
                slotProps={{ ...pickerSlots, textField: { fullWidth: true, required: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DesktopTimePicker
                label={t(lang, 'birthTime')}
                format="hh:mm:ss A"
                views={['hours', 'minutes', 'seconds']}
                value={timeValue(form.hour, form.minute, form.second, form.ampm)}
                onChange={(next) => {
                  if (!next?.isValid()) return;
                  const hour24 = next.hour();
                  set({ hour: hour24 % 12 || 12, minute: next.minute(), second: next.second(), ampm: hour24 >= 12 ? 'PM' : 'AM' });
                }}
                slotProps={{ ...pickerSlots, textField: { fullWidth: true, required: true } }}
              />
            </Grid>
            <Grid size={12}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <PlaceSearch form={form} lang={lang} onPlace={set} />
                </Box>
                {/* Temporarily hidden. Place search fills the coordinates and time zone. */}
                <Button type="button" variant="text" onClick={() => setAdjust((open) => !open)} sx={{ flexShrink: 0, mt: 1, display: 'none' }}>
                  {adjust ? t(lang, 'hideAdjust') : t(lang, 'showAdjust')}
                </Button>
              </Stack>
              <Collapse in={adjust}>
                <Box sx={{ pt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid size={12}>
                      <SelectField
                        label={t(lang, 'zone')}
                        value={form.zoneId}
                        onChange={(zoneId) => {
                          const next = ZONES.find((item) => item.id === zoneId);
                          set({ zoneId, zoneOffsetMinutes: next ? next.offset : form.zoneOffsetMinutes });
                        }}
                        options={zoneChoices(form)}
                      />
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
              <DesktopDatePicker
                label={`${t(lang, 'yogini')} · ${t(lang, 'yoginiFrom')}`}
                format="DD-MM-YYYY"
                value={dateValue(form.yoginiYear, form.yoginiMonth, form.yoginiDay)}
                onChange={(next) => {
                  if (next?.isValid()) set({ yoginiYear: next.year(), yoginiMonth: next.month() + 1, yoginiDay: next.date() });
                }}
                slotProps={{ ...pickerSlots, textField: { fullWidth: true } }}
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
    </LocalizationProvider>
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
