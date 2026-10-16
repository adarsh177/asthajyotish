import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { t } from '../i18n.js';

export default function LanguageToggle({ lang, onChange }) {
  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={lang}
      onChange={(_, value) => { if (value) onChange(value); }}
      aria-label={t(lang, 'language')}
      sx={{
        bgcolor: 'rgba(255,255,255,0.12)',
        '& .MuiToggleButton-root': { color: 'white', borderColor: 'rgba(255,255,255,0.35)', px: 1.25, py: 0.4, textTransform: 'none' },
        '& .Mui-selected': { bgcolor: 'white !important', color: '#3949ab !important' },
      }}
    >
      <ToggleButton value="en" type="button">English</ToggleButton>
      <ToggleButton value="hi" type="button">हिन्दी</ToggleButton>
    </ToggleButtonGroup>
  );
}
