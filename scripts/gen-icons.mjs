// Generates public/icon-192.png and public/icon-512.png
// Solid #C8FF00 (brand lime) PNG — no external dependencies, uses Node built-in zlib
import { writeFileSync } from 'fs';
import { deflateSync } from 'zlib';

function crc32(buf) {
  const t = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : (c >>> 1);
    t[n] = c;
  }
  let c = 0xFFFFFFFF;
  for (const b of buf) c = t[(c ^ b) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function chunk(type, data) {
  const tp = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const payload = Buffer.concat([tp, data]);
  const crcBuf = Buffer.alloc(4); crcBuf.writeUInt32BE(crc32(payload));
  return Buffer.concat([len, tp, data, crcBuf]);
}

function solidPNG(size, r, g, b) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8-bit depth, RGB colour
  const row = Buffer.alloc(1 + size * 3);
  row[0] = 0; // filter: None
  for (let x = 0; x < size; x++) {
    row[1 + x * 3]     = r;
    row[1 + x * 3 + 1] = g;
    row[1 + x * 3 + 2] = b;
  }
  const raw = Buffer.concat(Array.from({ length: size }, () => row));
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// Brand colour #C8FF00 = rgb(200, 255, 0)
const R = 200, G = 255, B = 0;
writeFileSync('public/icon-192.png', solidPNG(192, R, G, B));
writeFileSync('public/icon-512.png', solidPNG(512, R, G, B));
console.log('Generated public/icon-192.png and public/icon-512.png');
