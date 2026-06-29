/*
 * iputils.js — pure, dependency-free helpers for the Show My IP extension.
 *
 * Written as a UMD module so the exact same code runs inside the browser
 * extension (attached to `window.IPUtils`) and inside Node for unit tests.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.IPUtils = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /**
   * Validate an IPv4 address (strict dotted-quad, octets 0-255, no leading zeros).
   * @param {string} ip
   * @returns {boolean}
   */
  function isValidIPv4(ip) {
    if (typeof ip !== 'string') return false;
    const parts = ip.trim().split('.');
    if (parts.length !== 4) return false;
    return parts.every((part) => {
      if (!/^\d{1,3}$/.test(part)) return false;
      if (part.length > 1 && part[0] === '0') return false; // no leading zeros
      const n = Number(part);
      return n >= 0 && n <= 255;
    });
  }

  /**
   * Validate an IPv6 address, including the `::` compressed form and
   * IPv4-mapped addresses such as `::ffff:192.168.0.1`.
   * @param {string} ip
   * @returns {boolean}
   */
  function isValidIPv6(ip) {
    if (typeof ip !== 'string') return false;
    const addr = ip.trim();
    if (addr.indexOf(':') === -1) return false;

    const compressed = addr.split('::');
    if (compressed.length > 2) return false;
    if (compressed.length === 1 && (addr.startsWith(':') || addr.endsWith(':'))) {
      return false;
    }

    const groups = compressed.flatMap((part) => (part ? part.split(':') : []));
    if (groups.some((group) => !group)) return false;

    const v4Groups = groups.filter((group) => group.indexOf('.') !== -1);
    if (v4Groups.length > 1) return false;
    const hasV4Tail = v4Groups.length === 1;
    if (hasV4Tail) {
      const tail = groups[groups.length - 1];
      if (v4Groups[0] !== tail || !isValidIPv4(tail)) return false;
    }

    const hextets = hasV4Tail ? groups.slice(0, -1) : groups;
    if (!hextets.every((g) => /^[0-9a-fA-F]{1,4}$/.test(g))) return false;

    const groupCount = hextets.length + (hasV4Tail ? 2 : 0);
    return compressed.length === 2 ? groupCount < 8 : groupCount === 8;
  }

  /**
   * Classify an address as ipv4 / ipv6 / invalid.
   * @param {string} ip
   * @returns {'ipv4'|'ipv6'|'invalid'}
   */
  function classifyIP(ip) {
    if (isValidIPv4(ip)) return 'ipv4';
    if (isValidIPv6(ip)) return 'ipv6';
    return 'invalid';
  }

  /**
   * Detect private / loopback / link-local addresses and mDNS hostnames.
   * @param {string} ip
   * @returns {boolean}
   */
  function isPrivateIP(ip) {
    if (typeof ip !== 'string') return false;
    const addr = ip.trim().toLowerCase();
    if (addr.endsWith('.local')) return true; // mDNS hostname

    if (isValidIPv4(addr)) {
      const [a, b] = addr.split('.').map(Number);
      if (a === 10) return true;
      if (a === 127) return true;
      if (a === 192 && b === 168) return true;
      if (a === 172 && b >= 16 && b <= 31) return true;
      if (a === 169 && b === 254) return true; // link-local
      if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
      return false;
    }

    if (isValidIPv6(addr)) {
      if (addr === '::1') return true; // loopback
      if (addr.startsWith('fe80')) return true; // link-local
      return /^f[cd]/.test(addr); // unique local (fc00::/7)
    }
    return false;
  }

  /**
   * Extract the IP from a WebRTC ICE candidate line.
   * @param {string} candidate
   * @returns {string|null}
   */
  function extractIpFromCandidate(candidate) {
    if (typeof candidate !== 'string') return null;
    const match = /candidate:.+ (\S+) \d+ typ/.exec(candidate);
    return match ? match[1] : null;
  }

  /**
   * Normalise an IP-lookup API response into a plain string.
   * @param {string|{ip?:string}|null|undefined} data
   * @returns {string}
   */
  function parseIpResponse(data) {
    if (!data) return '';
    if (typeof data === 'string') return data.trim();
    if (typeof data === 'object' && typeof data.ip === 'string') {
      return data.ip.trim();
    }
    return '';
  }

  /**
   * Prepend an IP to history without duplicates, returning a NEW array.
   * @param {string[]} list
   * @param {string} ip
   * @returns {string[]}
   */
  function dedupePrepend(list, ip) {
    const safe = Array.isArray(list) ? list : [];
    if (!ip || safe.includes(ip)) return safe.slice();
    return [ip, ...safe];
  }

  /**
   * Parse the major Chrome/Chromium version from a user-agent string.
   * @param {string} ua
   * @returns {number|false}
   */
  function getChromeVersion(ua) {
    if (typeof ua !== 'string') return false;
    const raw = ua.match(/Chrom(?:e|ium)\/(\d+)\./);
    return raw ? parseInt(raw[1], 10) : false;
  }

  /**
   * Zero-padded HH:MM:SS timestamp for the activity log.
   * @param {Date} date
   * @returns {string}
   */
  function formatTime(date) {
    const d = date instanceof Date ? date : new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  return {
    isValidIPv4,
    isValidIPv6,
    classifyIP,
    isPrivateIP,
    extractIpFromCandidate,
    parseIpResponse,
    dedupePrepend,
    getChromeVersion,
    formatTime,
  };
});
