#!/usr/bin/env node
'use strict';

/*
 * build.js — package the extension into a versioned zip for the Chrome Web Store.
 * Reads the version from show-ip/manifest.json and zips the show-ip/ folder.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'show-ip', 'manifest.json'), 'utf8'));
const dist = path.join(root, 'dist');
fs.mkdirSync(dist, { recursive: true });

const out = path.join(dist, `show-ip-${manifest.version}.zip`);
fs.rmSync(out, { force: true });
execSync(`cd "${path.join(root, 'show-ip')}" && zip -r "${out}" . -x '*.DS_Store'`, {
  stdio: 'inherit',
});
console.log(`\nPackaged ${out}`);
