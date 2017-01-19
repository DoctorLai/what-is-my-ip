function getChromeVersion() {     
  var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
  return raw ? parseInt(raw[2], 10) : false;
}

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

var ipaddress = '';
getLocalIPs(function(ips) { // <!-- ips is an array of local IP addresses.
    ipaddress = ips.join('-');
    $('pre#ip2').html(ipaddress);
});

function logit(msg) {
    var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();    
    $('pre#log').append(time + " " + msg + "\n");
}

function callServer(server) {
    var api = "https://" + server + ".com/api/what-is-my-ip/?version=" + getChromeVersion();
    logit("Connecting API: " + api);
    $.ajax({
        type: "GET",
        url: api,
        success: function(data) {
            $('pre#ip').append(data + "\n");
        },
        error: function(request, status, error) {
            logit('Response: ' + request.responseText);
            logit('Error: ' + error );
            logit('Status: ' + status);
        },
        complete: function(data) {
            logit('API Finished: ' + api);
        }             
    });    
}

document.addEventListener('DOMContentLoaded', function() {
    logit("Chrome Version: " + getChromeVersion());
    callServer("helloacm");
    callServer("uploadbeta");
    callServer("happyukgo");
}, false);

