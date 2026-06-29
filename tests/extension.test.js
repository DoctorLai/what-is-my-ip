'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function readProjectFile(filePath) {
  return fs.readFileSync(path.join(root, filePath), 'utf8');
}

describe('extension package', () => {
  test('main.html loads IPUtils before popup logic', () => {
    const html = readProjectFile('show-ip/main.html');
    expect(html.indexOf('js/iputils.js')).toBeGreaterThan(-1);
    expect(html.indexOf('js/ip.js')).toBeGreaterThan(html.indexOf('js/iputils.js'));
  });

  test('manifest allows every network endpoint used by the popup', () => {
    const manifest = JSON.parse(readProjectFile('show-ip/manifest.json'));
    const popup = readProjectFile('show-ip/js/ip.js');
    const endpointHosts = [...popup.matchAll(/callThirdParty\(\s*'(https:\/\/[^']+)'/g)].map(
      ([, url]) => new URL(url).origin + '/'
    );

    expect(manifest.host_permissions).toEqual(expect.arrayContaining(endpointHosts));
  });
});

describe('annotate', () => {
  global.document = { addEventListener() {} };
  const { annotate } = require('../show-ip/js/ip');

  test('labels public IPv4', () => expect(annotate('8.8.8.8')).toBe('8.8.8.8  [IPv4, public]'));
  test('labels private IPv4', () =>
    expect(annotate('192.168.1.1')).toBe('192.168.1.1  [IPv4, private]'));
  test('labels public IPv6', () =>
    expect(annotate('2001:db8::1')).toBe('2001:db8::1  [IPv6, public]'));
  test('passes through invalid', () => expect(annotate('nope')).toBe('nope'));
});

describe('locales', () => {
  const dir = path.join(root, 'show-ip', '_locales');
  const locales = fs.readdirSync(dir);
  const manifest = readProjectFile('show-ip/manifest.json');
  const manifestKeys = [...manifest.matchAll(/__MSG_(\w+)__/g)].map(([, key]) => key);

  test('ships 20+ languages', () => {
    expect(locales.length).toBeGreaterThanOrEqual(20);
  });

  test.each(locales)('%s has valid appName/appDesc messages', (locale) => {
    const msgs = JSON.parse(readProjectFile(`show-ip/_locales/${locale}/messages.json`));
    expect(msgs.appName.message.length).toBeGreaterThan(0);
    expect(msgs.appDesc.message.length).toBeGreaterThan(0);
  });

  test.each(locales)('%s defines every manifest __MSG_*__ key', (locale) => {
    expect(manifestKeys.length).toBeGreaterThan(0);
    const msgs = JSON.parse(readProjectFile(`show-ip/_locales/${locale}/messages.json`));
    manifestKeys.forEach((key) => expect(msgs[key]).toBeDefined());
  });

  test.each(locales)('%s manifest strings fit Chrome length limits', (locale) => {
    const msgs = JSON.parse(readProjectFile(`show-ip/_locales/${locale}/messages.json`));
    expect([...msgs.appName.message].length).toBeLessThanOrEqual(45);
    expect([...msgs.appDesc.message].length).toBeLessThanOrEqual(132);
  });
});
