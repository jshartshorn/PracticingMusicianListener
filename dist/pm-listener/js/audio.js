//pm_log("Setting up audio js...")

var AudioAnalyzer = function() {

    //used after init
    this.isFunctional = true
    this.hasMicrophoneAccess = false
    this.errorMessages = []

    this.sourceNode = null;
    this. analyzer = null;
    this.audioContext = null;
    this.buflen = 1024;
    this.buf = new Float32Array( this.buflen );
    this.rafID = null;

    //setup the Web Audio API streaming stuff
    this.setupMedia = function() {
            if (window.AudioContext == undefined) {
              this.errorMessages += "Could not find audio context"
              this.isFunctional = false

              displayFlashMessages(
                [{type:"danger",
                  message:"Couldn't setup microphone access.  Please make sure you are using either Chrome or Firefox."
                }]
              )

              return
            }

            this.audioContext = new AudioContext();
            var constraints = { audio: {latency: 0.002}, video: false }
            var analyzerObj = this
            navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
                /* use the stream */
                pm_log("Using the stream")
                analyzerObj.isFunctional = true
                analyzerObj.hasMicrophoneAccess = true
                analyzerObj.gotStream(stream)
            }).catch(function(err) {
                /* handle the error */
                analyzerObj.errorMessages += err
                analyzerObj.isFunctional = false
                displayFlashMessages(
                [{type:"danger",
                  message:"Couldn't get access to microphone stream"
                }]
              )

                pm_log("Error: " + err,10)
            });
    }

    this.getSampleRate = function() {
        return this.audioContext.sampleRate
    }


    this.gotStream = function(stream) {
        console.log("Got stream")
        // Create an AudioNode from the stream.
        mediaStreamSource = this.audioContext.createMediaStreamSource(stream);

        // Connect it to the destination.
        this.analyzer = this.audioContext.createAnalyser();
        this.analyzer.fftSize = 2048;
        mediaStreamSource.connect( this. analyzer );
    }

    //get the current pitch
    this.updatePitch = function(timestamp) {
        if (this.analyzer == null)
            return

        //pm_log("Updating pitch")

        var cycles = new Array;
        this.analyzer.getFloatTimeDomainData( this.buf );
        var ac = this.autoCorrelate( this.buf, this.audioContext.sampleRate );

        return ac
    }

    this.autoCorrelate = function(a,r){var e=a.length;var t=Math.floor(e/2);var n=-1;var o=0;var u=0;var i=false;var l=new Array(t);for(var v=0;v<e;v++){var f=a[v];u+=f*f}u=Math.sqrt(u/e);if(u<.01)return-1;var c=1;for(var s=MIN_SAMPLES;s<t;s++){var d=0;for(var v=0;v<t;v++){d+=Math.abs(a[v]-a[v+s])}d=1-d/t;l[s]=d;if(d>GOOD_ENOUGH_CORRELATION&&d>c){i=true;if(d>o){o=d;n=s}}else if(i){var m=(l[n+1]-l[n-1])/l[n];return r/(n+8*m)}c=d}if(o>.01){return r/n}return-1}
}
var MIN_SAMPLES=0;var GOOD_ENOUGH_CORRELATION=.9;
var audioAnalyzer = new AudioAnalyzer()


