<?php

if (!isset($_GET['exercise_file'])) {
	$_GET['exercise_file'] = "CMajorScale.js";
	$_GET['testDuration'] = 'true';
	$_GET['testPitch'] = 'true';
	$_GET['testRhythm'] = 'true';
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Practicing Musician</title>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

    <link rel="stylesheet" type="text/css" href="pm-listener/css/notation.css">

    <script type="text/javascript" src="pm-listener/js/logger.js"></script>

    <script type="text/javascript" src="pm-listener/js/kotlin.js"></script>
    <script type="text/javascript" src="pm-listener/js/PracticingMusician.js"></script>

    <script src="pm-listener/js/audio.js"></script>

    <script src="https://unpkg.com/vexflow@1.2.83/releases/vexflow-debug.js"></script>
    <script src="pm-listener/js/easyscore_util.js"></script>

    <script src="pm-listener/js/index.js"></script>

    <style>
		body {
			font-family: Verdana;
		}
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
<script src="pm-listener/js/exercises/<?=$_GET['exercise_file']?>"></script>

<script type="text/javascript">
    window.onload = function() {
        listenerApp.runApp({
            url: "",
            audioAssetPath: "pm-listener/audio/",

            notationContainerName : "notationBody",
            metronomeContainerName : "metronomeContainer",

            userID: 1234,
            exerciseID: 1235,

            databaseEndpoint: "/db",

            allowableCentsMargin : 40,
            allowableRhythmMargin : 0.33,
            allowableDurationRatio : 0.35,

            largestBeatDifference: 1.0,
            largestDurationRatioDifference: 0.2,
            minDurationInBeats: 0.1,

            comparisonFlags: {
              testPitch: <?=$_GET['testPitch']?>,
              testRhythm: <?=$_GET['testRhythm']?>,
              testDuration: <?=$_GET['testDuration']?>,
            },
        })
    }
</script>
<!--
	<form method="GET" action="">
		<input type="hidden" name="testPitch" value="<?=$_GET['testPitch']?>"/>
		<input type="hidden" name="testRhythm" value="<?=$_GET['testRhythm']?>"/>
		<input type="hidden" name="testDuration" value="<?=$_GET['testDuration']?>"/>
		<select name="exercise_file">
		  <option value="CMajorScale.js">C Major Scale</option>
		  <option value="FMajorScale.js">F Major Scale</option>
		  <option disabled>_________</option>
		  <option value="rhythm_101/rhythm_exercise_1.js">Rhythm Exercise 1</option>
		  <option value="rhythm_101/rhythm_exercise_2.js">Rhythm Exercise 2</option>
		  <option value="rhythm_101/rhythm_exercise_3.js">Rhythm Exercise 3</option>
		  <option value="rhythm_101/rhythm_exercise_4.js">Rhythm Exercise 4</option>
		  <option value="rhythm_101/rhythm_exercise_5.js">Rhythm Exercise 5</option>
		  <option disabled>_________</option>
		  <option value="pitch_101/pitch_exercise_1.js">Pitch Exercise 1</option>
		  <option value="pitch_101/pitch_exercise_2.js">Pitch Exercise 2</option>
		  <option value="pitch_101/pitch_exercise_3.js">Pitch Exercise 3</option>
		  <option value="pitch_101/pitch_exercise_4.js">Pitch Exercise 4</option>
		  <option value="pitch_101/pitch_exercise_5.js">Pitch Exercise 5</option>
		  <option disabled>_________</option>
		  <option value="song_library_1/song_1.js">Hot Cross Buns</option>
		  <option value="song_library_1/song_2.js">Mary Had a Little Lamb</option>
		  <option value="song_library_1/song_3.js">Lightly Row</option>
		  <option value="song_library_1/song_4.js">A Tisket, a Tasket</option>
		  <option value="song_library_1/song_5.js">Twinkle, Twinkle, Little Star</option>
		  <option value="song_library_1/song_6.js">Good Morning to You</option>
		</select>
		<input type="submit"/>
	</form>
-->
	<style>
		h2 {
			font-weight: normal;
			font-size: 1.3em;
		}
		ul li.sep {
			list-style: none;
			display: block;
			height: 16px;
		}
		ul li {
			margin-bottom: 6px;
		}
		a {
			color: #555;
		}
		a:visited {
			color: #bbb;
		}
		p {
			line-height: 1.2em;
			padding: 10px;
		}
	</style>
	<h2>Instructions</h2>
	<p>
		Make sure you are using an accepted browser (Chrome, Firefox) -- Safari will not work.  When asked to enable microphone input, do so.
	</p>
	<p>
		Choose the exercise you want from the list below.  Click the play button near the upper left to start.  The count-offs are two bars long (minus whatever pickup the exercise has).  Play along with the exercise and then mouse-over the red feedback items to see what was missed.
	</p>
	<p>For best results, use headphones while recording so that you can hear the metronome without it interfering with the recording an analysis of your instrument.</p>
	<h2>Exercise List</h2>
	<ul>
		<li><a href="?exercise_file=CMajorScale.js&testPitch=true&testRhythm=true&testDuration=false">C Major Scale</a></li>
		<li><a href="?exercise_file=FMajorScale.js&testPitch=true&testRhythm=true&testDuration=false">F Major Scale</a></li>

		<li class="sep"></li>

		<li><a href="?exercise_file=rhythm_101/rhythm_exercise_1.js&testPitch=false&testRhythm=true&testDuration=true">Rhythm Exercise 1</a></li>
		<li><a href="?exercise_file=rhythm_101/rhythm_exercise_2.js&testPitch=false&testRhythm=true&testDuration=true">Rhythm Exercise 2</a></li>
		<li><a href="?exercise_file=rhythm_101/rhythm_exercise_3.js&testPitch=false&testRhythm=true&testDuration=true">Rhythm Exercise 3</a></li>
		<li><a href="?exercise_file=rhythm_101/rhythm_exercise_4.js&testPitch=false&testRhythm=true&testDuration=true">Rhythm Exercise 4</a></li>
		<li><a href="?exercise_file=rhythm_101/rhythm_exercise_5.js&testPitch=false&testRhythm=true&testDuration=true">Rhythm Exercise 5</a></li>

		<li class="sep"></li>

		<li><a href="?exercise_file=pitch_101/pitch_exercise_1.js&testPitch=true&testRhythm=true&testDuration=false">Pitch Exercise 1</a></li>
		<li><a href="?exercise_file=pitch_101/pitch_exercise_2.js&testPitch=true&testRhythm=true&testDuration=false">Pitch Exercise 2</a></li>
		<li><a href="?exercise_file=pitch_101/pitch_exercise_3.js&testPitch=true&testRhythm=true&testDuration=false">Pitch Exercise 3</a></li>
		<li><a href="?exercise_file=pitch_101/pitch_exercise_4.js&testPitch=true&testRhythm=true&testDuration=false">Pitch Exercise 4</a></li>
		<li><a href="?exercise_file=pitch_101/pitch_exercise_5.js&testPitch=true&testRhythm=true&testDuration=false">Pitch Exercise 5</a></li>

		<li class="sep"></li>

		<li><a href="?exercise_file=song_library_1/song_1.js&testPitch=true&testRhythm=true&testDuration=true">Hot Cross Buns</a></li>
		<li><a href="?exercise_file=song_library_1/song_2.js&testPitch=true&testRhythm=true&testDuration=true">Mary Had a Little Lamb</a></li>
		<li><a href="?exercise_file=song_library_1/song_3.js&testPitch=true&testRhythm=true&testDuration=true">Lightly Row</a></li>
		<li><a href="?exercise_file=song_library_1/song_4.js&testPitch=true&testRhythm=true&testDuration=true">A Tisket, a Tasket</a></li>
		<li><a href="?exercise_file=song_library_1/song_5.js&testPitch=true&testRhythm=true&testDuration=true">Twinkle, Twinkle, Little Star</a></li>
		<li><a href="?exercise_file=song_library_1/song_6.js&testPitch=true&testRhythm=true&testDuration=true">Good Morning to You</a></li>
	</ul>

</body>
</html>
