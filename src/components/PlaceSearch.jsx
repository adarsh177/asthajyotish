import { useEffect, useRef, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { ZONES } from '../data/catalog.js';
import { t } from '../i18n.js';

const KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function split(value, limit) {
  const sign = value < 0 ? -1 : 1;
  const abs = Math.min(Math.abs(value), limit);
  const degrees = Math.floor(abs);
  const minutes = Math.round((abs - degrees) * 60);
  if (minutes === 60) return { degrees: Math.min(degrees + 1, limit), minutes: 0, sign };
  return { degrees, minutes, sign };
}

export default function PlaceSearch({ form, lang, onPlace }) {
  const [options, setOptions] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = useRef(crypto.randomUUID());
  const request = useRef(0);

  useEffect(() => {
    if (!KEY) return undefined;
    const text = query.trim();
    if (text.length < 2) {
      setOptions([]);
      return undefined;
    }
    const id = ++request.current;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': KEY,
            'X-Goog-FieldMask': 'suggestions.placePrediction.placeId,suggestions.placePrediction.text',
          },
          body: JSON.stringify({ input: text, sessionToken: token.current }),
        });
        if (!response.ok) throw new Error('search');
        const data = await response.json();
        if (request.current !== id) return;
        setOptions(
          (data.suggestions || [])
            .map((item) => item.placePrediction)
            .filter((prediction) => prediction?.placeId && prediction.text?.text)
            .map((prediction) => ({ placeId: prediction.placeId, label: prediction.text.text })),
        );
        setError('');
      } catch {
        if (request.current === id) setError(t(lang, 'placeError'));
      } finally {
        if (request.current === id) setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, lang]);

  async function choose(option) {
    if (!option?.placeId) return;
    setLoading(true);
    try {
      const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(option.placeId)}?sessionToken=${encodeURIComponent(token.current)}`, {
        headers: {
          'X-Goog-Api-Key': KEY,
          'X-Goog-FieldMask': 'location,formattedAddress,utcOffsetMinutes',
        },
      });
      if (!response.ok) throw new Error('details');
      const place = await response.json();
      token.current = crypto.randomUUID();
      const latitude = place.location?.latitude;
      const longitude = place.location?.longitude;
      if (latitude == null || longitude == null) {
        setError(t(lang, 'placeError'));
        return;
      }
      const lat = split(latitude, 90);
      const lon = split(longitude, 180);
      const offset = place.utcOffsetMinutes;
      const zone = Number.isFinite(offset) ? ZONES.find((item) => item.offset === offset) : null;
      onPlace({
        placeId: option.placeId,
        placeName: place.formattedAddress || option.label,
        latDeg: lat.degrees,
        latMin: lat.minutes,
        latDir: lat.sign < 0 ? 'S' : 'N',
        lonDeg: lon.degrees,
        lonMin: lon.minutes,
        lonDir: lon.sign < 0 ? 'W' : 'E',
        ...(Number.isFinite(offset) ? { zoneOffsetMinutes: offset, zoneId: zone ? zone.id : 'custom' } : {}),
      });
      setQuery('');
      setError('');
    } catch {
      setError(t(lang, 'placeError'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Autocomplete
      freeSolo
      filterOptions={(items) => items}
      options={options}
      loading={loading}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
      inputValue={form.placeName || ''}
      onInputChange={(_, value, reason) => {
        if (reason === 'input') {
          onPlace({ placeName: value });
          setQuery(value);
        }
        if (reason === 'clear') {
          onPlace({ placeName: '' });
          setQuery('');
          setOptions([]);
        }
      }}
      onChange={(_, option) => {
        if (option && typeof option !== 'string') choose(option);
      }}
      noOptionsText={t(lang, 'placeEmpty')}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t(lang, 'place')}
          placeholder={t(lang, 'placeHint')}
          error={Boolean(error) || !KEY}
          helperText={!KEY ? t(lang, 'placeKey') : error}
        />
      )}
    />
  );
}
