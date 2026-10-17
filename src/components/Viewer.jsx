import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

function fitSheet(sheet, measureHidden) {
  const body = sheet?.querySelector('.sheet-body');
  if (!body) return;
  if (measureHidden) sheet.classList.add('sheet-measure');
  body.style.setProperty('--sheet-fit', '1');
  const style = getComputedStyle(sheet);
  const room = sheet.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
  const scale = Math.min(1, (room - 1) / Math.max(body.scrollHeight, 1));
  body.style.setProperty('--sheet-fit', String(Math.max(0.45, scale)));
  if (measureHidden) sheet.classList.remove('sheet-measure');
}

export default function Viewer({ lang, pages, index, setIndex, onBack, onPrint, onLanguage }) {
  const theme = useTheme();
  const wide = useMediaQuery(theme.breakpoints.up('md'));
  const scroller = useRef(null);
  const frame = useRef(null);
  const sheet = useRef(null);
  const [fit, setFit] = useState({ scale: 1, height: 0 });

  useEffect(() => {
    scroller.current?.scrollTo(0, 0);
  }, [index, lang]);

  useLayoutEffect(() => {
    fitSheet(sheet.current, false);
  }, [index, lang, pages]);

  useEffect(() => {
    const beforePrint = () => {
      frame.current?.querySelectorAll('.sheet').forEach((node) => fitSheet(node, true));
    };
    window.addEventListener('beforeprint', beforePrint);
    return () => window.removeEventListener('beforeprint', beforePrint);
  }, [pages, lang]);

  useLayoutEffect(() => {
    const frameEl = frame.current;
    const sheetEl = sheet.current;
    if (!frameEl || !sheetEl) return undefined;
    const measure = () => {
      if (!sheetEl.offsetWidth || !frameEl.clientWidth) return;
      const scale = frameEl.clientWidth / sheetEl.offsetWidth;
      const height = sheetEl.offsetHeight * scale;
      setFit({ scale, height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frameEl);
    return () => observer.disconnect();
  }, [index, lang, pages]);

  return (
    <Box className="viewer">
      <AppBar position="static" color="primary" className="no-print preview-header" elevation={1}>
        <Toolbar sx={{ gap: 1, px: { xs: 1, sm: 2 } }}>
          <IconButton color="inherit" edge="start" onClick={onBack} aria-label={t(lang, 'back')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, minWidth: 0 }} noWrap>{t(lang, 'app')}</Typography>
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
            <div className="sheet-frame" id="kundli-pages" ref={frame}>
              {pages.map((item, i) => (
                <div key={`${item.title}-${i}`} className="sheet-slot" style={i === index ? { height: fit.height || undefined } : undefined}>
                  <article
                    ref={i === index ? sheet : undefined}
                    className={i === index ? 'sheet active' : 'sheet'}
                    style={i === index ? { transform: `scale(${fit.scale})` } : undefined}
                  >
                    <div className="sheet-body">
                      <header className="sheet-head">
                        <span>{t(lang, 'app')}</span>
                        <span>{i + 1} / {pages.length}</span>
                      </header>
                      <h1>{item.title}</h1>
                      {item.body}
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </Box>
      </Box>
    </Box>
  );
}
