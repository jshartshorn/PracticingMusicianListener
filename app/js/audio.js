//pm_log("Setting up audio js...")

var sourceNode = null;
var analyser = null;
var audioContext = null;
var buflen = 1024;
var buf = new Float32Array( buflen );
var rafID = null;

//setup the Web Audio API streaming stuff
function setupMedia() {
        audioContext = new AudioContext();
        var constraints = { audio: {latency: 0.002}, video: false }
        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
            /* use the stream */
            pm_log("Using the stream")
            gotStream(stream)
        }).catch(function(err) {
            /* handle the error */
            pm_log("Error: " + err,10)
        });
}

function getSampleRate() {
    return audioContext.sampleRate
}


function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Connect it to the destination.
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    mediaStreamSource.connect( analyser );
}

//get the current pitch
function updatePitch(timestamp) {
    if (analyser == null)
        return

    //pm_log("Updating pitch")

    var cycles = new Array;
	analyser.getFloatTimeDomainData( buf );
	var ac = autoCorrelate( buf, audioContext.sampleRate );

    return ac
}

var MIN_SAMPLES=0;var GOOD_ENOUGH_CORRELATION=.9;function autoCorrelate(a,r){var e=a.length;var t=Math.floor(e/2);var n=-1;var o=0;var u=0;var i=false;var l=new Array(t);for(var v=0;v<e;v++){var f=a[v];u+=f*f}u=Math.sqrt(u/e);if(u<.01)return-1;var c=1;for(var s=MIN_SAMPLES;s<t;s++){var d=0;for(var v=0;v<t;v++){d+=Math.abs(a[v]-a[v+s])}d=1-d/t;l[s]=d;if(d>GOOD_ENOUGH_CORRELATION&&d>c){i=true;if(d>o){o=d;n=s}}else if(i){var m=(l[n+1]-l[n-1])/l[n];return r/(n+8*m)}c=d}if(o>.01){return r/n}return-1}