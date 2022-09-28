/*
what-is-my-ip
Chrome Extension to show Both Local and Public IP Addresses. This chrome extension shows the external and internal IP addresses when you click the extension icon.

Chrome Extension URL
https://chrome.google.com/webstore/detail/show-my-ip-addresses-exte/opljiobgnagdjikipnagigiacllolpaj

Web Tool
https://helloacm.com/what-is-my-ip/

Buy me a Coffee
https://www.paypal.me/doctorlai/3
bitcoin:1J88t5UAgKBHhMgzkyH9bpY5mPdCYAe5XQ
*/

function getChromeVersion() {     
  var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
  return raw ? parseInt(raw[2], 10) : false;
}


let prev_addr = [];

// save settings
const saveSettings = () => {
    let settings = {};
    settings['external_ip'] = prev_addr;
    chrome.storage.sync.set({
        showip: settings
    }, function () {

    });
};

function getLocalIPs(callback) {
    var ips = [];

    var RTCPeerConnection = window.RTCPeerConnection ||
        window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

    var pc = new RTCPeerConnection({
        // Don't specify any stun/turn servers, otherwise you will
        // also find your public IP addresses.
        iceServers: []
    });
    // Add a media line, this is needed to activate candidate gathering.
    pc.createDataChannel('');
    
    // onicecandidate is triggered whenever a candidate has been found.
    pc.onicecandidate = function(e) {
        if (!e.candidate) { // Candidate gathering completed.
            pc.close();
            callback(ips);
            return;
        }
        var ip = /^candidate:.+ (\S+) \d+ typ/.exec(e.candidate.candidate)[1];
        if (ips.indexOf(ip) == -1) // avoid duplicate entries (tcp/udp)
            ips.push(ip);
    };
    pc.createOffer(function(sdp) {
        pc.setLocalDescription(sdp);
    }, function onerror() {});
}

function logit(msg) {
    var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();    
    $('#log').append(time + " " + msg + "\n");
}

function process(current_ip) {
    if (!prev_addr.includes(current_ip)) {
        prev_addr.unshift(current_ip);
        $("#ip3").val(prev_addr.join("\n"));
        saveSettings();
    }
}

function callThirdParty(server, name) {
    var api = server;
    logit("Connecting " + server + " ...");
    $.ajax({
        type: "GET",
        url: api,
        success: function(data) {
            let current_ip = "";
            if (data && data['ip']) {
                current_ip = data['ip'];
                $('#ip').append(current_ip + "\n");
            } else if (data) {
                current_ip = data;
                $('#ip').append(current_ip + "\n");
            }
            if (current_ip) {
                process(current_ip);
            }
        },
        error: function(request, status, error) {
            logit('Response: ' + request.responseText);
            logit('Error: ' + error );
            logit('Status: ' + status);
        },
        complete: function(data) {
            logit('API Finished: ' + name + " Server!");
        }             
    });    
}

// Copy provided text to the clipboard.
function copyTextToClipboard(text, t) {
    let copyFrom = $('<textarea/>');
    copyFrom.text(text);
    $('body').append(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.remove();
    $(t).html('Copied!');
}

document.addEventListener('DOMContentLoaded', function() {
    $('#show_log').click(function() {
        $('div#loglog').toggle();
    });
    $('#code').html("PodcastInIt" + (new Date()).getFullYear());
    $('#c1').click(function() {
        copyTextToClipboard($('#ip').val(), $('#log1'));
    });    
    $('#c2').click(function() {
        copyTextToClipboard($('#ip2').val(), $('#log2'));
    });    
    $('#c3').click(function () {
        copyTextToClipboard($('#ip3').val(), $('#log3'));
    });          
    $('#resetbtn').click(function () {
        $("#ip3").val("");
        prev_addr = [];
        saveSettings();
    });

    chrome.storage.sync.get('showip', function (data) {
        if (data && data.showip) {
            const settings = data.showip;
            prev_addr = settings['external_ip'];
            console.log("Previous IP Address: ", prev_addr);
            $("#ip3").val(prev_addr.join("\n"));
        } else {
            // first time set default parameters
            console.log("Previous IP Address Not Recorded.");
        }
        callThirdParty("https://what-is-my-ip.functionapi.workers.dev/?from=chrome-extension", "what-is-my-ip.justyy.workers.dev");
        callThirdParty("https://api.ipify.org?format=json", "ipify.org");        
    });       

    getLocalIPs(function(ips) { // <!-- ips is an array of local IP addresses.
        $('#ip2').html(ips.join('\n'));
    });

    const manifest = chrome.runtime.getManifest();
    logit(manifest.name);
    logit("Version: " + manifest.version);
    logit("Chrome Version: " + getChromeVersion());
}, false);