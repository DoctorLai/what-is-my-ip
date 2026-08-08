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

  test('manifest and package.json report the same version', () => {
    const manifest = JSON.parse(readProjectFile('show-ip/manifest.json'));
    const pkg = JSON.parse(readProjectFile('package.json'));
    expect(manifest.version).toBe(pkg.version);
    expect(manifest.version).toMatch(/^\d+\.\d+\.\d+$/);
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
  test('labels private IPv6', () => expect(annotate('fe80::1')).toBe('fe80::1  [IPv6, private]'));
  test('passes through invalid', () => expect(annotate('nope')).toBe('nope'));
});

describe('process', () => {
  let processIp;
  let historyField;
  let setStorage;

  beforeEach(() => {
    jest.resetModules();
    global.document = { addEventListener() {} };
    historyField = { val: jest.fn() };
    setStorage = jest.fn();
    global.$ = jest.fn(() => historyField);
    global.chrome = { storage: { sync: { set: setStorage } } };
    ({ process: processIp } = require('../show-ip/js/ip'));
  });

  afterEach(() => {
    delete global.$;
    delete global.chrome;
  });

  test('persists a new IP when capped history stays the same length', () => {
    for (let index = 0; index < 50; index += 1) {
      processIp(`203.0.113.${index}`);
    }
    historyField.val.mockClear();
    setStorage.mockClear();

    processIp('198.51.100.1');

    const saved = setStorage.mock.calls[0][0].showip.external_ip;
    expect(saved).toHaveLength(50);
    expect(saved[0]).toBe('198.51.100.1');
    expect(saved).not.toContain('203.0.113.0');
    expect(historyField.val).toHaveBeenCalledTimes(1);
  });

  test('does not persist an unchanged history', () => {
    processIp('8.8.8.8');
    historyField.val.mockClear();
    setStorage.mockClear();

    processIp('8.8.8.8');

    expect(historyField.val).not.toHaveBeenCalled();
    expect(setStorage).not.toHaveBeenCalled();
  });
});

describe('locales', () => {
  const dir = path.join(root, 'show-ip', '_locales');
  const locales = fs.readdirSync(dir);
  const manifest = readProjectFile('show-ip/manifest.json');
  const manifestKeys = [...manifest.matchAll(/__MSG_(\w+)__/g)].map(([, key]) => key);

  test('ships 25+ locale folders', () => {
    expect(locales.length).toBeGreaterThanOrEqual(25);
  });

  test('covers 25+ distinct languages', () => {
    // Collapse regional variants (en_GB, zh_CN, pt_BR, ...) to their base language.
    const baseLanguages = new Set(locales.map((locale) => locale.split('_')[0]));
    expect(baseLanguages.size).toBeGreaterThanOrEqual(25);
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
