import opentype from 'opentype.js';
import { fileURLToPath } from 'node:url';

const fonts = Object.fromEntries(['Regular', 'SemiBold', 'Mono'].map(weight => [weight,
  opentype.loadSync(fileURLToPath(new URL(`../design/fonts/Geist${weight === 'Mono' ? 'Mono-Regular' : '-' + weight}.ttf`, import.meta.url)))
]));

export const themes = {
  dark: { bg: '#111511', panel: '#171D17', line: '#303B2C', ink: '#F0F2E7', muted: '#A5B09C', accent: '#C5EF78', soft: '#F1B799', tile: '#263321', side: '#273C1D' },
  light: { bg: '#F4F4EB', panel: '#E9ECDD', line: '#CDD3BE', ink: '#202A1A', muted: '#59664E', accent: '#496B1E', soft: '#A55235', tile: '#D2DCBB', side: '#ABB991' }
};
export const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
export const rect = (x, y, w, h, fill, radius = 0, stroke = 'none') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}"/>`;
export const line = (x1, y1, x2, y2, color, width = 1) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${color}" stroke-width="${width}" fill="none"/>`;
export const circle = (x, y, r, fill, stroke = 'none') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}"/>`;
export const path = (d, fill, stroke = 'none', width = 1) => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
export function text(value, x, y, size, color, weight = 'Regular', spacing = 0) {
  const font = fonts[weight];
  let content = '';
  for (const char of String(value)) {
    content += font.getPath(char, x, y, size).toPathData(2) + ' ';
    x += font.getAdvanceWidth(char, size) + spacing;
  }
  return `<g aria-label="${escape(value)}">${path(content.trim(), color)}</g>`;
}
export const label = (value, x, y, color, size = 11) => text(value, x, y, size, color, 'Mono', 1.15);
export const arrow = (x, y, c) => path(`M${x} ${y + 13}l13 -13m-12 0h12v12`, 'none', c, 1.5);
export function cube(x, y, size, height, top, left, right, stroke = 'none') {
  const h = size / 2;
  return path(`M${x} ${y}l${size} ${h}v${height}l-${size} -${h}Z`, left, stroke, .5)
    + path(`M${x + size} ${y + h}l${size} -${h}v${height}l-${size} ${h}Z`, right, stroke, .5)
    + path(`M${x} ${y}l${size} -${h}l${size} ${h}l-${size} ${h}Z`, top, stroke, .5);
}
export function svg(width, height, title, description, body, theme) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc"><title id="title">${escape(title)}</title><desc id="desc">${escape(description)}</desc>${rect(0, 0, width, height, theme.bg, 16)}${body}</svg>\n`;
}
