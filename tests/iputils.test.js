'use strict';

const IPUtils = require('../show-ip/js/iputils');

describe('isValidIPv4', () => {
  test.each(['0.0.0.0', '127.0.0.1', '192.168.1.1', '8.8.8.8', '255.255.255.255'])(
    'accepts %s',
    (ip) => {
      expect(IPUtils.isValidIPv4(ip)).toBe(true);
    }
  );

  test.each([
    '256.1.1.1',
    '1.2.3',
    '1.2.3.4.5',
    '01.2.3.4',
    '1.2.3.04',
    'abc',
    '',
    '192.168.1.',
    '...',
  ])('rejects %s', (ip) => {
    expect(IPUtils.isValidIPv4(ip)).toBe(false);
  });

  test('rejects non-string', () => {
    expect(IPUtils.isValidIPv4(null)).toBe(false);
    expect(IPUtils.isValidIPv4(undefined)).toBe(false);
    expect(IPUtils.isValidIPv4(12345)).toBe(false);
  });
});

describe('isValidIPv6', () => {
  test.each([
    '::1',
    '::',
    'fe80::1',
    '2001:db8::ff00:42:8329',
    '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
    '::ffff:192.168.0.1',
  ])('accepts %s', (ip) => {
    expect(IPUtils.isValidIPv6(ip)).toBe(true);
  });

  test.each([
    '192.168.1.1',
    'gggg::1',
    '1:2:3:4:5:6:7:8:9',
    ':::1',
    '2001:::1',
    '1:2:3:4:5:6:7:',
    ':1:2:3:4:5:6:7',
    '1:2:3:4:5:6::192.168.0.1',
    'fe80::1::2',
    '1.1.1.1:2.2.2.2',
    '1.2.3.4::1',
    'hello',
    '',
  ])('rejects %s', (ip) => {
    expect(IPUtils.isValidIPv6(ip)).toBe(false);
  });

  test('rejects non-string', () => {
    expect(IPUtils.isValidIPv6(null)).toBe(false);
    expect(IPUtils.isValidIPv6(undefined)).toBe(false);
    expect(IPUtils.isValidIPv6(2001)).toBe(false);
  });
});

describe('classifyIP', () => {
  test('detects ipv4', () => expect(IPUtils.classifyIP('1.2.3.4')).toBe('ipv4'));
  test('detects ipv6', () => expect(IPUtils.classifyIP('::1')).toBe('ipv6'));
  test('detects invalid', () => expect(IPUtils.classifyIP('nope')).toBe('invalid'));
});

describe('isPrivateIP', () => {
  test.each([
    '10.0.0.1',
    '172.16.5.4',
    '172.31.0.1',
    '192.168.0.1',
    '127.0.0.1',
    '169.254.1.1',
    '100.64.0.1',
    '::1',
    'fe80::abcd',
    'fc00::1',
    'fd12::1',
    'abc123.local',
  ])('flags %s as private', (ip) => {
    expect(IPUtils.isPrivateIP(ip)).toBe(true);
  });

  test.each(['8.8.8.8', '1.1.1.1', '172.32.0.1', '2001:db8::1'])('flags %s as public', (ip) => {
    expect(IPUtils.isPrivateIP(ip)).toBe(false);
  });

  test('returns false for non-IP input', () => {
    expect(IPUtils.isPrivateIP('not-an-ip')).toBe(false);
    expect(IPUtils.isPrivateIP('')).toBe(false);
    expect(IPUtils.isPrivateIP(42)).toBe(false);
    expect(IPUtils.isPrivateIP(null)).toBe(false);
  });
});

describe('extractIpFromCandidate', () => {
  test('extracts host candidate ip', () => {
    const line = 'candidate:1 1 UDP 2122252543 192.168.1.5 51111 typ host generation 0';
    expect(IPUtils.extractIpFromCandidate(line)).toBe('192.168.1.5');
  });

  test('returns null for garbage', () => {
    expect(IPUtils.extractIpFromCandidate('not a candidate')).toBeNull();
    expect(IPUtils.extractIpFromCandidate(null)).toBeNull();
  });
});

describe('parseIpResponse', () => {
  test('handles object', () => expect(IPUtils.parseIpResponse({ ip: '1.2.3.4' })).toBe('1.2.3.4'));
  test('handles string', () => expect(IPUtils.parseIpResponse(' 1.2.3.4 ')).toBe('1.2.3.4'));
  test('handles empty', () => {
    expect(IPUtils.parseIpResponse(null)).toBe('');
    expect(IPUtils.parseIpResponse({})).toBe('');
    expect(IPUtils.parseIpResponse({ ip: 123 })).toBe('');
  });
});

describe('dedupePrepend', () => {
  test('prepends new value', () => {
    expect(IPUtils.dedupePrepend(['a'], 'b')).toEqual(['b', 'a']);
  });
  test('ignores duplicate', () => {
    expect(IPUtils.dedupePrepend(['a'], 'a')).toEqual(['a']);
  });
  test('does not mutate input', () => {
    const input = ['a'];
    IPUtils.dedupePrepend(input, 'b');
    expect(input).toEqual(['a']);
  });
  test('tolerates bad input', () => {
    expect(IPUtils.dedupePrepend(null, 'a')).toEqual(['a']);
    expect(IPUtils.dedupePrepend(['a'], '')).toEqual(['a']);
  });
});

describe('getChromeVersion', () => {
  test('parses chrome', () => {
    expect(IPUtils.getChromeVersion('Mozilla/5.0 (X11) Chrome/120.0.0.0 Safari/537')).toBe(120);
  });
  test('returns false otherwise', () => {
    expect(IPUtils.getChromeVersion('Firefox')).toBe(false);
    expect(IPUtils.getChromeVersion(null)).toBe(false);
  });
});

describe('formatTime', () => {
  test('zero-pads time', () => {
    const d = new Date(2024, 0, 1, 9, 5, 3);
    expect(IPUtils.formatTime(d)).toBe('09:05:03');
  });

  test('falls back to now for non-Date input', () => {
    expect(IPUtils.formatTime('not a date')).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    expect(IPUtils.formatTime()).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });
});
