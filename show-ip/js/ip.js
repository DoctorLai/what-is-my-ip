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
  const next = IP.dedupePrepend(prevAddr, currentIp);
  if (next.length !== prevAddr.length) {
    prevAddr = next;
    $('#ip3').val(prevAddr.map(annotate).join('\n'));
    saveSettings();
  }
}

function callThirdParty(server, name) {
  logit('Connecting ' + name + ' ...');
  $.ajax({
    type: 'GET',
    url: server,
    success: function (data) {
      const currentIp = IP.parseIpResponse(data);
      if (currentIp) {
        $('#ip').append(annotate(currentIp) + '\n');
        process(currentIp);
      }
    },
    error: function (request, status, error) {
      logit('Error: ' + error + ' (' + status + ')');
    },
    complete: function () {
      logit('API Finished: ' + name + ' Server!');
    },
  });
}

function copyTextToClipboard(text, target) {
  const copyFrom = $('<textarea/>');
  copyFrom.text(text);
  $('body').append(copyFrom);
  copyFrom.select();
  document.execCommand('copy');
  copyFrom.remove();
  $(target).html('Copied!');
  setTimeout(() => $(target).html(''), 1500);
}

document.addEventListener(
  'DOMContentLoaded',
  function () {
    $('#show_log').click(() => $('div#loglog').toggle());
    $('#code').html('PodcastInIt' + new Date().getFullYear());
    $('#c1').click(() => copyTextToClipboard($('#ip').val(), $('#log1')));
    $('#c2').click(() => copyTextToClipboard($('#ip2').val(), $('#log2')));
    $('#c3').click(() => copyTextToClipboard($('#ip3').val(), $('#log3')));
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
      callThirdParty(
        'https://what-is-my-ip.functionapi.workers.dev/?from=chrome-extension',
        'what-is-my-ip.justyy.workers.dev'
      );
      callThirdParty('https://api.ipify.org?format=json', 'ipify.org');
    });

    getLocalIPs((ips) => $('#ip2').html(ips.map(annotate).join('\n')));

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
