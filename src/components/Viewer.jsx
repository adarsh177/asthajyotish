import { useEffect, useRef } from 'react';
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PrintIcon from '@mui/icons-material/Print';
import { useTheme } from '@mui/material/styles';
import { t } from '../i18n.js';
import LanguageToggle from './LanguageToggle.jsx';

const MM = 96 / 25.4;
const PRINT_WIDTH = 190 * MM;
const PRINT_HEIGHT = 277 * MM;

function fitSheets() {
  const sheets = [...document.querySelectorAll('.sheet')];
  sheets.forEach((sheet) => {
    sheet.style.display = 'block';
    sheet.style.boxSizing = 'border-box';
    sheet.style.width = `${PRINT_WIDTH}px`;
    sheet.style.maxWidth = `${PRINT_WIDTH}px`;
    sheet.style.margin = '0';
    sheet.style.padding = '0';
    sheet.style.zoom = '1';
    sheet.style.height = 'auto';
    sheet.style.maxHeight = 'none';
    sheet.style.overflow = 'visible';
  });
  sheets.forEach((sheet) => {
    const needed = Math.max(sheet.scrollHeight, 1);
    const scale = Math.min(1, (PRINT_HEIGHT - 4) / needed);
    sheet.style.zoom = String(scale);
    sheet.style.height = `${Math.floor((PRINT_HEIGHT - 4) / scale)}px`;
    sheet.style.overflow = 'hidden';
  });
}

function resetSheets() {
  document.querySelectorAll('.sheet').forEach((sheet) => {
    sheet.style.zoom = '';
    sheet.style.height = '';
    sheet.style.maxHeight = '';
    sheet.style.overflow = '';
    sheet.style.display = '';
    sheet.style.width = '';
    sheet.style.maxWidth = '';
    sheet.style.margin = '';
    sheet.style.padding = '';
    sheet.style.boxSizing = '';
  });
}

export default function Viewer({ lang, pages, index, setIndex, onBack, onPrint, onLanguage }) {
  const theme = useTheme();
  const wide = useMediaQuery(theme.breakpoints.up('md'));
  const scroller = useRef(null);

  useEffect(() => {
    scroller.current?.scrollTo(0, 0);
  }, [index, lang]);

  useEffect(() => {
    const before = () => fitSheets();
    const after = () => resetSheets();
    window.addEventListener('beforeprint', before);
    window.addEventListener('afterprint', after);
    return () => {
      window.removeEventListener('beforeprint', before);
      window.removeEventListener('afterprint', after);
    };
  }, [pages]);

  return (
    <Box className="viewer">
      <AppBar position="static" color="primary" className="no-print" elevation={1}>
        <Toolbar sx={{ gap: 1 }}>
          <IconButton color="inherit" edge="start" onClick={onBack} aria-label={t(lang, 'back')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }} noWrap>{t(lang, 'app')}</Typography>
          <LanguageToggle lang={lang} onChange={onLanguage} />
          <Button color="inherit" startIcon={<PrintIcon />} onClick={onPrint}>{t(lang, 'print')}</Button>
        </Toolbar>
      </AppBar>
      <Box className="viewer-body">
        {wide ? (
          <Drawer
            variant="permanent"
            open
            className="no-print page-drawer"
            sx={{
              width: 300,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: 300,
                position: 'relative',
                height: '100%',
                borderRight: '1px solid #e0e4f5',
              },
            }}
          >
            <Typography variant="subtitle2" sx={{ px: 2, pt: 2, pb: 1 }}>{t(lang, 'pages')}</Typography>
            <List dense className="page-list">
              {pages.map((item, i) => (
                <ListItemButton key={`${item.title}-${i}`} selected={i === index} onClick={() => setIndex(i)}>
                  <ListItemText primary={`${i + 1}. ${item.title}`} slotProps={{ primary: { variant: 'body2' } }} />
                </ListItemButton>
              ))}
            </List>
          </Drawer>
        ) : null}
        <Box className="viewer-main">
          <Box className="no-print viewer-tools">
            {!wide ? (
              <select className="page-select" value={index} onChange={(event) => setIndex(Number(event.target.value))} aria-label={t(lang, 'pages')}>
                {pages.map((item, i) => (
                  <option key={`${item.title}-${i}`} value={i}>{i + 1}. {item.title}</option>
                ))}
              </select>
            ) : null}
            <IconButton onClick={() => setIndex((n) => Math.max(0, n - 1))} disabled={index === 0} aria-label="Previous page"><ChevronLeftIcon /></IconButton>
            <Typography variant="body2">{t(lang, 'page')} {index + 1} {t(lang, 'of')} {pages.length}</Typography>
            <IconButton onClick={() => setIndex((n) => Math.min(pages.length - 1, n + 1))} disabled={index === pages.length - 1} aria-label="Next page"><ChevronRightIcon /></IconButton>
          </Box>
          <div className="viewer-scroll" ref={scroller}>
            <div id="kundli-pages">
              {pages.map((item, i) => (
                <article key={`${item.title}-${i}`} className={i === index ? 'sheet active' : 'sheet'}>
                  <header className="sheet-head">
                    <span>{t(lang, 'app')}</span>
                    <span>{i + 1} / {pages.length}</span>
                  </header>
                  <h1>{item.title}</h1>
                  {item.body}
                </article>
              ))}
            </div>
          </div>
        </Box>
      </Box>
    </Box>
  );
}
