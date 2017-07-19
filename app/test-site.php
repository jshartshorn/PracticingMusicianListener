<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Practicing Musician</title>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

    <link rel="stylesheet" type="text/css" href="pm-listener/css/notation.css">

    <script type="text/javascript" src="pm-listener/js/logger.js"></script>

    <script type="text/javascript" src="pm-listener/js/kotlin.js"></script>
    <script type="text/javascript" src="pm-listener/js/practicingmusician.js"></script>

    <script src="pm-listener/js/audio.js"></script>

    <script src="https://unpkg.com/vexflow/releases/vexflow-min.js"></script>
    <script src="pm-listener/js/easyscore_util.js"></script>

    <script src="pm-listener/js/index.js"></script>

    <style>
      /* override CSS for the SASS code */
div.feedbackItem.incorrect_note {
    background-image: url("pm-listener/images/incorrect-note.png");
}

div.feedbackItem.off_note {
    background-image: url("pm-listener/images/off-note-icon.png");
}
    </style>
</head>
<body>

<div id="notationWindow">
    <div id="notationHeader">
        <span id="settingsButton"></span>
        <span id="playPauseButton" onclick="javascript:listenerApp.toggleState()"></span>
        <span id="repeatButton"></span>

        <div id="metronomeContainer">
            <!-- this gets filled dynamically -->
        </div>

        <span id="medalIndicator"></span>
        <span id="exitFullScreenButton"></span>
    </div>
    <div id="notationBody">
        <!-- this gets filled dynamically -->
    </div>
</div>
<script src="pm-listener/js/exercises/<?=$_GET['exercise_file']>"></script>

<script type="text/javascript">
    window.onload = function() {
        listenerApp.runApp({
            url: "",
            audioAssetPath: "pm-listener/audio/",

            notationContainerName : "notationBody",
            metronomeContainerName : "metronomeContainer",

            userID: 1234,
            exerciseID: 1235,

            databaseEndpoint: "localhost:8080/db",

            allowableCentsMargin : 40,
            allowableRhythmMargin : 0.25,
            allowableLengthMargin : 0.25,

            comparisonFlags: {
              testPitch: true,
              testRhythm: true,
              testDuration: true,
            },
        })
    }
</script>
</body>
</html>
