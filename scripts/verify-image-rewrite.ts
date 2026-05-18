import { rewriteMigratedImageUrls } from '../lib/adapters/news-adapter';

const BASE = 'https://club-mareva.s3.eu-west-2.amazonaws.com/migration/wordpress/';

const galleryImages = [
  { imageUrls: { original: `${BASE}Mareva20260108-L0013-5957af22a01e.webp` } },
  { imageUrls: { original: `${BASE}Mareva20260108-L0015-dac0c4342537.webp` } },
  { imageUrls: { original: `${BASE}Mareva20260108-L0017-e5db5e10cc42.webp` } },
  { imageUrls: { original: `${BASE}Mareva20260108-L0023-3d2f67afaaca.webp` } },
  { imageUrls: { original: `${BASE}Mareva20260108-L0030-de3f44367c16.webp` } },
];

const inputHtml =
  '<p>x</p>' +
  '<img src="https://clubmarevabeirut.com/wp-content/uploads/2026/01/Mareva20260108-L0013.jpg"/>' +
  '<img src="https://clubmarevabeirut.com/wp-content/uploads/2026/01/Mareva20260108-L0015.jpg"/>' +
  '<img src="https://clubmarevabeirut.com/wp-content/uploads/2026/01/Mareva20260108-L0099.jpg"/>';

const output = rewriteMigratedImageUrls(inputHtml, galleryImages);

// L0013 and L0015 must be rewritten — no WP URL remaining for them
const wpL0013 = 'clubmarevabeirut.com/wp-content/uploads/2026/01/Mareva20260108-L0013.jpg';
const wpL0015 = 'clubmarevabeirut.com/wp-content/uploads/2026/01/Mareva20260108-L0015.jpg';
const s3L0013 = `${BASE}Mareva20260108-L0013-5957af22a01e.webp`;
const s3L0015 = `${BASE}Mareva20260108-L0015-dac0c4342537.webp`;
// L0099 has no gallery match — must remain unchanged
const wpL0099 = 'clubmarevabeirut.com/wp-content/uploads/2026/01/Mareva20260108-L0099.jpg';

let failed = false;

function assert(condition: boolean, message: string): void {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    failed = true;
  }
}

assert(!output.includes(wpL0013), 'L0013 WP URL must be replaced');
assert(!output.includes(wpL0015), 'L0015 WP URL must be replaced');
assert(output.includes(s3L0013), 'L0013 S3 URL must be present');
assert(output.includes(s3L0015), 'L0015 S3 URL must be present');
assert(output.includes(wpL0099), 'L0099 WP URL must remain (no gallery match)');

if (failed) {
  console.log('\nOutput HTML:');
  console.log(output);
  process.exit(1);
}

console.log('PASS');
