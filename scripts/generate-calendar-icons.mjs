// One-off script: generates 48x48 PNG icons for the email Add-to-Calendar buttons.
// Run from `website/` with `node scripts/generate-calendar-icons.mjs`.
// Each icon is a gold-themed glyph (matches the email's brand palette).

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'images', 'calendar');

const GOLD = '#C6B158';
const DARK = '#0a0a0a';
const CREAM = '#f5f5f0';

// Each icon is a 48x48 SVG: filled gold circle with a single white letter centred.
// Plain letter glyphs in the email's brand colour — not reproductions of any
// trademarked provider logo. The brand name lives in alt/title for clarity.
function makeSvg(letter, opts = {}) {
  const bg = opts.bg ?? GOLD;
  const fg = opts.fg ?? CREAM;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <circle cx="24" cy="24" r="22" fill="${bg}" />
  <text x="24" y="24" text-anchor="middle" dominant-baseline="central"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="26" font-weight="600" fill="${fg}">${letter}</text>
</svg>`;
}

const ICONS = [
  { name: 'google',      letter: 'G' },
  { name: 'apple',       letter: 'A' },
  { name: 'outlook',     letter: 'O' },
  { name: 'outlook-com', letter: 'O', opts: { bg: DARK, fg: GOLD } }, // visually distinct from Office
  { name: 'yahoo',       letter: 'Y' },
];

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  for (const icon of ICONS) {
    const svg = makeSvg(icon.letter, icon.opts);
    const outPath = join(OUT_DIR, `${icon.name}.png`);
    await sharp(Buffer.from(svg, 'utf-8'))
      .resize(48, 48)
      .png({ compressionLevel: 9 })
      .toFile(outPath);
    console.log(`✓ wrote ${outPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
