/*
 * what-is-my-ip — Show My IP Addresses (External and Local)
 * Chrome extension popup logic. Pure helpers live in iputils.js so they can be
 * unit-tested in Node; this file wires them to the DOM, jQuery and Chrome APIs.
 *
 * Web tool:  https://helloacm.com/what-is-my-ip/
 * Donate:    https://www.paypal.me/doctorlai/3
 */

const IP = typeof IPUtils !== 'undefined' ? IPUtils : require('./iputils');

let prevAddr = [];

// Cap the stored public-IP history so it can never grow without bound.
const MAX_HISTORY = 50;

// Number of in-flight external lookups, used to drive the Refresh button state.
let pendingLookups = 0;

function setBusy(busy) {
  pendingLookups = busy ? pendingLookups + 1 : Math.max(0, pendingLookups - 1);
  const active = pendingLookups > 0;
  $('#refreshbtn')
    .prop('disabled', active)
    .text(active ? 'Refreshing\u2026' : 'Refresh');
}

function saveSettings() {
  chrome.storage.sync.set({ showip: { external_ip: prevAddr } });
}

function annotate(ip) {
  const kind = IP.classifyIP(ip);
  if (kind === 'invalid') return ip;
  const scope = IP.isPrivateIP(ip) ? 'private' : 'public';
  return ip + '  [' + (kind === 'ipv6' ? 'IPv6' : 'IPv4') + ', ' + scope + ']';
}

function getLocalIPs(callback) {
  const RTCPeerConnection =
    window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
  if (!RTCPeerConnection) {
    callback([]);
    return;
  }
  const ips = [];
  const pc = new RTCPeerConnection({ iceServers: [] });
  pc.createDataChannel('');
  pc.onicecandidate = function (e) {
    if (!e.candidate) {
      pc.close();
      callback(ips);
      return;
    }
    const ip = IP.extractIpFromCandidate(e.candidate.candidate);
    if (ip && ips.indexOf(ip) === -1) ips.push(ip);
  };
  pc.createOffer(
    (sdp) => pc.setLocalDescription(sdp),
    function onerror() {}
  );
}

function logit(msg) {
  $('#log').append(IP.formatTime(new Date()) + ' ' + msg + '\n');
}

function process(currentIp) {
  const next = IP.dedupePrepend(prevAddr, currentIp, MAX_HISTORY);
  if (next.length !== prevAddr.length) {
    prevAddr = next;
    $('#ip3').val(prevAddr.map(annotate).join('\n'));
    saveSettings();
  }
}

function callThirdParty(server, name) {
  logit('Connecting ' + name + ' ...');
  setBusy(true);
  $.ajax({
    type: 'GET',
    url: server,
    timeout: 8000,
    success: function (data) {
      const currentIp = IP.parseIpResponse(data);
      if (currentIp) {
        const line = annotate(currentIp);
        const existing = $('#ip').val();
        // Set via .val() (not .append()): once a <textarea> is cleared with
        // .val(''), its dirty-value flag means .append() no longer re-renders.
        $('#ip').val(existing ? existing + '\n' + line : line);
        process(currentIp);
      }
    },
    error: function (request, status, error) {
      logit('Error: ' + error + ' (' + status + ')');
    },
    complete: function () {
      logit('API Finished: ' + name + ' Server!');
      setBusy(false);
    },
  });
}

function copyTextToClipboard(text, target) {
  const notify = () => {
    $(target).html('Copied!');
    setTimeout(() => $(target).html(''), 1500);
  };
  const legacyCopy = () => {
    const copyFrom = $('<textarea/>');
    copyFrom.text(text);
    $('body').append(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.remove();
    notify();
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(notify, legacyCopy);
  } else {
    legacyCopy();
  }
}

function lookupExternalIP() {
  $('#ip').val('');
  callThirdParty(
    'https://what-is-my-ip.functionapi.workers.dev/?from=chrome-extension',
    'what-is-my-ip.justyy.workers.dev'
  );
  callThirdParty('https://api.ipify.org?format=json', 'ipify.org');
}

function lookupLocalIP() {
  $('#ip2').val('');
  getLocalIPs((ips) => $('#ip2').val(ips.map(annotate).join('\n')));
}

function refresh() {
  logit('Refreshing ...');
  lookupExternalIP();
  lookupLocalIP();
}

document.addEventListener(
  'DOMContentLoaded',
  function () {
    $('#show_log').click(() => $('div#loglog').toggle());
    $('#code').html('PodcastInIt' + new Date().getFullYear());
    $('#c1').click(() => copyTextToClipboard($('#ip').val(), $('#log1')));
    $('#c2').click(() => copyTextToClipboard($('#ip2').val(), $('#log2')));
    $('#c3').click(() => copyTextToClipboard($('#ip3').val(), $('#log3')));
    $('#refreshbtn').click(refresh);
    $('#resetbtn').click(() => {
      $('#ip3').val('');
      prevAddr = [];
      saveSettings();
    });

    chrome.storage.sync.get('showip', function (data) {
      if (data && data.showip) {
        prevAddr = data.showip.external_ip || [];
        $('#ip3').val(prevAddr.map(annotate).join('\n'));
      }
      lookupExternalIP();
    });

    lookupLocalIP();

    const manifest = chrome.runtime.getManifest();
    logit(manifest.name);
    logit('Version: ' + manifest.version);
    logit('Chrome Version: ' + IP.getChromeVersion(navigator.userAgent));
  },
  false
);

if (typeof module === 'object' && module.exports) {
  module.exports = { annotate, process, copyTextToClipboard };
}
