#!/usr/bin/env node
'use strict';

/*
 * build.js — package the extension into a versioned zip for the Chrome Web Store.
 *
 * Reads the version from show-ip/manifest.json and zips the contents of the
 * show-ip/ folder into dist/show-ip-<version>.zip. Uses the `archiver` library
 * so the build runs on any OS (Windows/macOS/Linux) without a system `zip`.
 */
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const root = path.join(__dirname, '..');
const source = path.join(root, 'show-ip');
const manifest = JSON.parse(fs.readFileSync(path.join(source, 'manifest.json'), 'utf8'));

const dist = path.join(root, 'dist');
fs.mkdirSync(dist, { recursive: true });

const out = path.join(dist, `show-ip-${manifest.version}.zip`);
fs.rmSync(out, { force: true });

const output = fs.createWriteStream(out);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  const kb = (archive.pointer() / 1024).toFixed(1);
  console.log(`Packaged ${path.relative(root, out)} (${kb} KB)`);
});

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    console.warn(err.message);
  } else {
    throw err;
  }
});
archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);
archive.glob('**/*', {
  cwd: source,
  ignore: ['**/.DS_Store', '**/Thumbs.db'],
  dot: false,
});
archive.finalize();
