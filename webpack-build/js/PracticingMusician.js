if (typeof kotlin === 'undefined') {
  throw new Error("Error loading module 'PracticingMusician'. Its dependency 'kotlin' was not found. Please, check whether 'kotlin' is loaded prior to 'PracticingMusician'.");
}
var PracticingMusician = function (_, Kotlin) {
  'use strict';
  var println = Kotlin.kotlin.io.println_s8jyv4$;
  var reversed = Kotlin.kotlin.collections.reversed_7wnvza$;
  var removeAll = Kotlin.kotlin.collections.removeAll_qafx1e$;
  var List = Kotlin.kotlin.collections.List;
  var toMutableList = Kotlin.kotlin.collections.toMutableList_4c7yge$;
  var zip = Kotlin.kotlin.collections.zip_45mdf7$;
  var until = Kotlin.kotlin.ranges.until_dqglrj$;
  var withIndex = Kotlin.kotlin.collections.withIndex_7wnvza$;
  var DoubleCompanionObject = Kotlin.kotlin.js.internal.DoubleCompanionObject;
  var get_indices = Kotlin.kotlin.collections.get_indices_gzk92b$;
  var Enum = Kotlin.kotlin.Enum;
  var IntRange = Kotlin.kotlin.ranges.IntRange;
  var step = Kotlin.kotlin.ranges.step_xsgg7u$;
  var listOf = Kotlin.kotlin.collections.listOf_i5x0yv$;
  Slice$MarkerType.prototype = Object.create(Enum.prototype);
  Slice$MarkerType.prototype.constructor = Slice$MarkerType;
  TimeKeeper$TimeKeeperState.prototype = Object.create(Enum.prototype);
  TimeKeeper$TimeKeeperState.prototype.constructor = TimeKeeper$TimeKeeperState;
  var app;
  function main$lambda(it) {
    Note$Companion_getInstance().createAllNotes();
    setupMedia();
    runProgram();
  }
  function main(args) {
    window.onload = main$lambda;
  }
  function runProgram() {
    println('Running...');
  }
  function App() {
    this.audioManager = new AudioManager();
    this.exerciseManager = new ExerciseManager(this.audioManager);
  }
  App.prototype.toggleState = function () {
    var tmp$;
    tmp$ = this.exerciseManager.timeKeeper.state;
    if (Kotlin.equals(tmp$, TimeKeeper$TimeKeeperState$Stopped_getInstance())) {
      this.exerciseManager.createSteppables();
      this.exerciseManager.setup();
      this.exerciseManager.loadExercise();
      this.exerciseManager.run();
    }
     else if (Kotlin.equals(tmp$, TimeKeeper$TimeKeeperState$Running_getInstance()))
      this.exerciseManager.stop();
  };
  App.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'App',
    interfaces: []
  };
  function AppSettings() {
    AppSettings_instance = this;
    this.pitch = 440;
  }
  AppSettings.$metadata$ = {
    kind: Kotlin.Kind.OBJECT,
    simpleName: 'AppSettings',
    interfaces: []
  };
  var AppSettings_instance = null;
  function AppSettings_getInstance() {
    if (AppSettings_instance === null) {
      new AppSettings();
    }
    return AppSettings_instance;
  }
  function AudioManager() {
    this.loadedAudio = Kotlin.kotlin.collections.LinkedHashMap_init_q3lmfv$();
    this.timeoutKeys = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
  }
  AudioManager.prototype.loadAudioFile_puj7f4$ = function (filename, key) {
    var audio = new Audio(filename);
    this.loadedAudio.put_xwzc9p$(key, audio);
    return audio;
  };
  AudioManager.prototype.playAudioNow_61zpoe$ = function (key) {
    console.log('**** (( Playing...');
    var audio = this.loadedAudio.get_11rb$(key);
    audio.currentTime = 0;
    audio.play();
  };
  function AudioManager$playAudio$lambda(closure$atTime, closure$audio) {
    return function () {
      console.log('(( Playing...' + Kotlin.toString(closure$atTime));
      closure$audio.currentTime = 0;
      return closure$audio.play();
    };
  }
  AudioManager.prototype.playAudio_bm4lxs$ = function (key, atTime) {
    var audio = this.loadedAudio.get_11rb$(key);
    var timeoutKey = window.setTimeout(AudioManager$playAudio$lambda(atTime, audio), atTime);
    this.timeoutKeys.add_11rb$(timeoutKey);
  };
  function AudioManager$cancelAllAudio$lambda(it) {
    return true;
  }
  AudioManager.prototype.cancelAllAudio = function () {
    var tmp$;
    tmp$ = reversed(this.timeoutKeys).iterator();
    while (tmp$.hasNext()) {
      var element = tmp$.next();
      println('Cancelling item... ' + element);
      window.clearTimeout(element);
    }
    removeAll(this.timeoutKeys, AudioManager$cancelAllAudio$lambda);
  };
  AudioManager.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'AudioManager',
    interfaces: []
  };
  function ExerciseDefinition() {
    this.notes = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    this.notationItems = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    this.tempo = 120.0;
  }
  ExerciseDefinition.prototype.getLength = function () {
    var beatSize = 1000.0 * 60.0 / this.tempo;
    var $receiver = this.notes;
    var destination = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$($receiver, 10));
    var tmp$;
    tmp$ = $receiver.iterator();
    while (tmp$.hasNext()) {
      var item = tmp$.next();
      destination.add_11rb$(item.duration);
    }
    var iterator_3 = destination.iterator();
    if (!iterator_3.hasNext()) {
      throw new Kotlin.kotlin.UnsupportedOperationException("Empty collection can't be reduced.");
    }
    var accumulator = iterator_3.next();
    while (iterator_3.hasNext()) {
      var acc = accumulator;
      accumulator = iterator_3.next() + acc;
    }
    return accumulator * beatSize;
  };
  ExerciseDefinition.prototype.prerollLength = function () {
    var beatSize = 1000.0 * 60.0 / this.tempo;
    return beatSize * 4;
  };
  ExerciseDefinition.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'ExerciseDefinition',
    interfaces: []
  };
  function ExerciseManager(am) {
    this.currentExercise = null;
    this.timeKeeper = new TimeKeeper();
    this.metronome = new Metronome();
    this.pitchTracker = new PitchTracker();
    this.bufferManager = new IncrementalBufferManager();
    this.comparisonEngine = new IncrementalComparisonEngine();
    this.audioManager = am;
    println('Init');
  }
  ExerciseManager.prototype.createSteppables = function () {
    this.timeKeeper = new TimeKeeper();
    this.metronome = new Metronome();
    this.pitchTracker = new PitchTracker();
    this.bufferManager = new IncrementalBufferManager();
    this.comparisonEngine = new IncrementalComparisonEngine();
  };
  function ExerciseManager$setup$lambda(this$ExerciseManager) {
    return function () {
      var tmp$;
      this$ExerciseManager.audioManager.cancelAllAudio();
      this$ExerciseManager.metronome.cancelAllUIUpdates();
      var samplesLength = this$ExerciseManager.pitchTracker.samples.size / 44100.0;
      println('Total samples recorded: ' + Kotlin.toString(this$ExerciseManager.pitchTracker.samples.size) + ' length: ' + Kotlin.toString(samplesLength));
      this$ExerciseManager.bufferManager.tempo = this$ExerciseManager.metronome.tempo;
      var notesFromSamplesBuffer = this$ExerciseManager.bufferManager.convertSamplesBufferToNotes_mtnj1d$(this$ExerciseManager.pitchTracker.samples);
      println('Notes: ');
      var tmp$_0;
      tmp$_0 = notesFromSamplesBuffer.iterator();
      while (tmp$_0.hasNext()) {
        var element = tmp$_0.next();
        println('Note: ' + Kotlin.toString(element.noteNumber) + ' for ' + Kotlin.toString(element.duration));
      }
      if ((tmp$ = this$ExerciseManager.currentExercise) != null) {
        var this$ExerciseManager_0 = this$ExerciseManager;
        println('Comparing...');
        var results = this$ExerciseManager_0.comparisonEngine.compareNoteArrays_l4hzig$(tmp$.notes, notesFromSamplesBuffer);
        println('Results ' + results);
        var tmp$_1;
        tmp$_1 = results.feedbackItems.iterator();
        while (tmp$_1.hasNext()) {
          var element_0 = tmp$_1.next();
          var beat = element_0.beat;
          println('Feedback item at ' + beat);
          addFeedbackItem(beat, element_0.feedbackItemType);
        }
      }
    };
  }
  ExerciseManager.prototype.setup = function () {
    println('Setup');
    clearFeedbackItems();
    this.metronome.audioManager = this.audioManager;
    this.timeKeeper.steppables.add_11rb$(this.metronome);
    this.timeKeeper.steppables.add_11rb$(this.pitchTracker);
    this.timeKeeper.analyzers.add_11rb$(this);
    this.timeKeeper.finishedActions.add_11rb$(ExerciseManager$setup$lambda(this));
    this.metronome.setup();
    this.pitchTracker.setup();
  };
  ExerciseManager.prototype.run = function () {
    this.metronome.start();
    this.pitchTracker.start();
    this.timeKeeper.start();
  };
  ExerciseManager.prototype.stop = function () {
    this.timeKeeper.stop();
    this.metronome.stop();
    this.pitchTracker.stop();
  };
  ExerciseManager.prototype.loadExercise = function () {
    var tmp$, tmp$_0;
    var exercise = generatedExercise;
    var $receiver = exercise.notationItems;
    var destination = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    var tmp$_1;
    tmp$_1 = $receiver.iterator();
    while (tmp$_1.hasNext()) {
      var element = tmp$_1.next();
      if (Kotlin.isType(element, Note)) {
        destination.add_11rb$(element);
      }
    }
    exercise.notes = toMutableList(Kotlin.isType(tmp$ = destination, List) ? tmp$ : Kotlin.throwCCE());
    this.currentExercise = exercise;
    if ((tmp$_0 = this.currentExercise) != null) {
      this.metronome.tempo = tmp$_0.tempo;
      this.bufferManager.tempo = tmp$_0.tempo;
      this.timeKeeper.runForTime = tmp$_0.getLength() + tmp$_0.prerollLength();
      this.pitchTracker.lengthOfPrerollToIgnore = tmp$_0.prerollLength();
      println('Loaded exercise of length ' + Kotlin.toString(this.timeKeeper.runForTime));
    }
  };
  ExerciseManager.prototype.loadSampleExercise = function () {
    var tmp$;
    var exercise = new ExerciseDefinition();
    exercise.tempo = 110.0;
    exercise.notationItems.add_11rb$(new Note(60, 1.0, 'c/4'));
    exercise.notationItems.add_11rb$(new Note(62, 1.0, 'd/4'));
    exercise.notationItems.add_11rb$(new Note(64, 1.0, 'e/4'));
    exercise.notationItems.add_11rb$(new Note(65, 1.0, 'f/4'));
    exercise.notationItems.add_11rb$(new Barline());
    exercise.notationItems.add_11rb$(new Note(67, 1.0, 'g/4'));
    exercise.notationItems.add_11rb$(new Note(69, 1.0, 'a/4'));
    exercise.notationItems.add_11rb$(new Note(71, 1.0, 'b/4'));
    exercise.notationItems.add_11rb$(new Note(72, 1.0, 'c/5'));
    var $receiver = exercise.notationItems;
    var destination = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    var tmp$_0;
    tmp$_0 = $receiver.iterator();
    while (tmp$_0.hasNext()) {
      var element = tmp$_0.next();
      if (Kotlin.isType(element, Note)) {
        destination.add_11rb$(element);
      }
    }
    exercise.notes = toMutableList(Kotlin.isType(tmp$ = destination, List) ? tmp$ : Kotlin.throwCCE());
    this.currentExercise = exercise;
  };
  ExerciseManager.prototype.analyze_14dthe$ = function (timestamp) {
    println('Analyzing at ' + Kotlin.toString(timestamp));
  };
  ExerciseManager.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'ExerciseManager',
    interfaces: [TimeKeeperAnalyzer]
  };
  function BufferManager() {
    BufferManager_instance = this;
    this.sampleRate = 44100.0;
    this.minDurationInBeats = 0.25;
  }
  BufferManager.prototype.convertSamplesBufferToNotes_av4ikl$ = function (samples, tempo) {
    var tmp$;
    var secondsPerBeat = 60.0 / tempo;
    var notes = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    var curNoteNumber = {v: -1};
    var destination = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$(samples, 10));
    var tmp$_0;
    tmp$_0 = samples.iterator();
    while (tmp$_0.hasNext()) {
      var item = tmp$_0.next();
      destination.add_11rb$(Note$Companion_getInstance().getNoteNumber_14dthe$(item));
    }
    var noteNumbers = destination;
    var pairs = zip(samples, noteNumbers);
    var groups = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    var curList = {v: Kotlin.kotlin.collections.ArrayList_init_ww73n8$()};
    var tmp$_1;
    tmp$_1 = pairs.iterator();
    while (tmp$_1.hasNext()) {
      var element = tmp$_1.next();
      if (element.second === curNoteNumber.v) {
        curList.v.add_11rb$(element);
      }
       else {
        if (curList.v.size > 0) {
          groups.add_11rb$(curList.v);
          curList.v = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
        }
      }
      curNoteNumber.v = element.second;
    }
    if (curList.v.size > 0) {
      groups.add_11rb$(curList.v);
    }
    var destination_0 = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    var tmp$_2;
    tmp$_2 = groups.iterator();
    while (tmp$_2.hasNext()) {
      var element_0 = tmp$_2.next();
      if (element_0.size > secondsPerBeat * this.minDurationInBeats * this.sampleRate) {
        destination_0.add_11rb$(element_0);
      }
    }
    var groupsOfAcceptableLength = destination_0;
    println('Converted into number groups: ' + Kotlin.toString(groupsOfAcceptableLength.size) + ' from original: ' + Kotlin.toString(groups.size));
    var destination_1 = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    var tmp$_3;
    tmp$_3 = groupsOfAcceptableLength.iterator();
    while (tmp$_3.hasNext()) {
      var element_1 = tmp$_3.next();
      var list = element_1;
      Kotlin.kotlin.collections.addAll_ipc267$(destination_1, list);
    }
    var flattened = destination_1;
    curNoteNumber.v = -1;
    var curLengthInSamples = 0;
    var avgFreq = 0.0;
    tmp$ = flattened.iterator();
    while (tmp$.hasNext()) {
      var pair = tmp$.next();
      var noteNumberFromSample = pair.second;
      var freqFromSample = pair.first;
      if (noteNumberFromSample !== curNoteNumber.v) {
        if (curLengthInSamples > 0) {
          var durationInBeats = curLengthInSamples / (secondsPerBeat * this.sampleRate);
          var noteNum = curNoteNumber.v;
          avgFreq = avgFreq / curLengthInSamples;
          var note = new Note(noteNum, durationInBeats);
          note.avgFreq = avgFreq;
          notes.add_11rb$(note);
        }
        avgFreq = 0.0;
        curLengthInSamples = -1;
      }
      avgFreq += freqFromSample;
      curNoteNumber.v = noteNumberFromSample;
      curLengthInSamples = curLengthInSamples + 1 | 0;
    }
    if (curLengthInSamples > 0) {
      var durationInBeats_0 = curLengthInSamples / (secondsPerBeat * this.sampleRate);
      var noteNum_0 = curNoteNumber.v;
      avgFreq = avgFreq / curLengthInSamples;
      var note_0 = new Note(noteNum_0, durationInBeats_0);
      note_0.avgFreq = avgFreq;
      notes.add_11rb$(note_0);
    }
    console.log('Turned samples into these notes: ' + Kotlin.toString(notes));
    return notes;
  };
  BufferManager.prototype.convertNotesToSamples_jisecs$ = function (notes, tempo) {
    var samples = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    var secondsPerBeat = 60.0 / tempo;
    var noteChangeIndexes = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    var tmp$;
    tmp$ = notes.iterator();
    while (tmp$.hasNext()) {
      var element = tmp$.next();
      var tmp$_0, tmp$_1, tmp$_2, tmp$_3;
      noteChangeIndexes.add_11rb$(samples.size);
      var numSamplesToCreate = element.duration * secondsPerBeat * this.sampleRate;
      var freq = element.getFrequency();
      tmp$_0 = until(0, numSamplesToCreate | 0);
      tmp$_1 = tmp$_0.first;
      tmp$_2 = tmp$_0.last;
      tmp$_3 = tmp$_0.step;
      for (var i = tmp$_1; i <= tmp$_2; i += tmp$_3) {
        samples.add_11rb$(freq);
      }
    }
    console.log('Note change indexes: ' + Kotlin.toString(noteChangeIndexes));
    return samples;
  };
  BufferManager.$metadata$ = {
    kind: Kotlin.Kind.OBJECT,
    simpleName: 'BufferManager',
    interfaces: []
  };
  var BufferManager_instance = null;
  function BufferManager_getInstance() {
    if (BufferManager_instance === null) {
      new BufferManager();
    }
    return BufferManager_instance;
  }
  function CompareEngine() {
    CompareEngine_instance = this;
    this.allowableFreqencyMargin = 10.0;
    this.allowableRhythmMargin = 0.25;
  }
  CompareEngine.prototype.compareNoteArrays_l4hzig$ = function (ideal, toTest) {
    var tmp$_0, tmp$_1, tmp$_2, tmp$_3, tmp$_4;
    var results = new CompareResults();
    var curBeatPosition = 0.0;
    tmp$_0 = withIndex(ideal).iterator();
    while (tmp$_0.hasNext()) {
      var tmp$ = tmp$_0.next();
      var index = tmp$.component1()
      , value = tmp$.component2();
      var indexOnToTest = -1;
      var toTestBeatPositionAtIndexToTest = 0.0;
      var toTestBeatPosition = 0.0;
      var diffFromIdealBeatPosition = DoubleCompanionObject.MAX_VALUE;
      tmp$_1 = get_indices(toTest);
      tmp$_2 = tmp$_1.first;
      tmp$_3 = tmp$_1.last;
      tmp$_4 = tmp$_1.step;
      for (var i = tmp$_2; i <= tmp$_3; i += tmp$_4) {
        var item = toTest.get_za3lpa$(i);
        var diff = Math.abs(curBeatPosition - toTestBeatPosition);
        if (diff < diffFromIdealBeatPosition) {
          indexOnToTest = i;
          toTestBeatPositionAtIndexToTest = toTestBeatPosition;
          diffFromIdealBeatPosition = diff;
        }
        toTestBeatPosition += item.duration;
      }
      println('Going to compare ideal index ' + index + ' to test index ' + indexOnToTest);
      var feedbackItem = new FeedbackItem(curBeatPosition, '');
      results.feedbackItems.add_11rb$(feedbackItem);
      if (indexOnToTest === -1) {
        continue;
      }
      results.attempted = results.attempted + 1 | 0;
      var isCorrect = true;
      var idealItem = value;
      var testItem = toTest.get_za3lpa$(indexOnToTest);
      println('Durations : ' + Kotlin.toString(idealItem.duration) + ' | ' + Kotlin.toString(testItem.duration));
      if (idealItem.duration - testItem.duration > this.allowableRhythmMargin) {
        println('Test subject too short');
        isCorrect = false;
      }
       else if (idealItem.duration - testItem.duration < -this.allowableRhythmMargin) {
        println('Test subject too long');
        isCorrect = false;
      }
       else {
        println('PERFECT');
      }
      println('Starting points : ' + Kotlin.toString(curBeatPosition) + ' | ' + Kotlin.toString(toTestBeatPositionAtIndexToTest));
      if (curBeatPosition - toTestBeatPositionAtIndexToTest > this.allowableRhythmMargin) {
        println('Test subject rushing');
        feedbackItem.feedbackItemType = feedbackItem.feedbackItemType + '>';
        isCorrect = false;
      }
       else if (curBeatPosition - toTestBeatPositionAtIndexToTest < -this.allowableRhythmMargin) {
        println('Test subject dragging');
        feedbackItem.feedbackItemType = feedbackItem.feedbackItemType + '<';
        isCorrect = false;
      }
       else {
        println('PERFECT');
      }
      println('Pitch : ' + Kotlin.toString(idealItem.getFrequency()) + ' | ' + Kotlin.toString(testItem.getFrequency()));
      println('Avg freq of test item: ' + Kotlin.toString(testItem.avgFreq));
      var avgFreq = testItem.avgFreq;
      if (avgFreq != null) {
        if (avgFreq - idealItem.getFrequency() > this.allowableFreqencyMargin) {
          println('Test subject sharp');
          feedbackItem.feedbackItemType = feedbackItem.feedbackItemType + '^';
          isCorrect = false;
        }
         else if (avgFreq - idealItem.getFrequency() < -this.allowableFreqencyMargin) {
          println('Test subject flat');
          feedbackItem.feedbackItemType = feedbackItem.feedbackItemType + '_';
          isCorrect = false;
        }
         else {
          println('PERFECT');
        }
      }
      curBeatPosition += value.duration;
      if (isCorrect)
        results.correct = results.correct + 1 | 0;
    }
    println('---- Results : ' + Kotlin.toString(results.correct) + '/' + Kotlin.toString(results.attempted));
    return results;
  };
  CompareEngine.$metadata$ = {
    kind: Kotlin.Kind.OBJECT,
    simpleName: 'CompareEngine',
    interfaces: []
  };
  var CompareEngine_instance = null;
  function CompareEngine_getInstance() {
    if (CompareEngine_instance === null) {
      new CompareEngine();
    }
    return CompareEngine_instance;
  }
  function FeedbackItem(beat, feedbackItemType) {
    this.beat = beat;
    this.feedbackItemType = feedbackItemType;
  }
  FeedbackItem.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'FeedbackItem',
    interfaces: []
  };
  FeedbackItem.prototype.component1 = function () {
    return this.beat;
  };
  FeedbackItem.prototype.component2 = function () {
    return this.feedbackItemType;
  };
  FeedbackItem.prototype.copy_t0es5s$ = function (beat, feedbackItemType) {
    return new FeedbackItem(beat === void 0 ? this.beat : beat, feedbackItemType === void 0 ? this.feedbackItemType : feedbackItemType);
  };
  FeedbackItem.prototype.toString = function () {
    return 'FeedbackItem(beat=' + Kotlin.toString(this.beat) + (', feedbackItemType=' + Kotlin.toString(this.feedbackItemType)) + ')';
  };
  FeedbackItem.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.beat) | 0;
    result = result * 31 + Kotlin.hashCode(this.feedbackItemType) | 0;
    return result;
  };
  FeedbackItem.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.beat, other.beat) && Kotlin.equals(this.feedbackItemType, other.feedbackItemType)))));
  };
  function CompareResults() {
    this.correct = 0;
    this.attempted = 0;
    this.feedbackItems = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
  }
  CompareResults.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'CompareResults',
    interfaces: []
  };
  function IncrementalBufferManager() {
    this.tempo = 0.0;
    this.sampleRate = 44100.0;
    this.minDurationInBeats = 0.25;
    this.notes = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    this.positionInSamples = 0;
  }
  IncrementalBufferManager.prototype.convertSamplesBufferToNotes_mtnj1d$ = function (samples) {
    var tmp$;
    var functionStartTimestamp = window.performance.now();
    var secondsPerBeat = 60.0 / this.tempo;
    var samplesSublist = samples.subList_vux9f0$(this.positionInSamples, samples.size - 1 | 0);
    var destination = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$(samplesSublist, 10));
    var tmp$_0;
    tmp$_0 = samplesSublist.iterator();
    while (tmp$_0.hasNext()) {
      var item = tmp$_0.next();
      destination.add_11rb$(Note$Companion_getInstance().getNoteNumber_14dthe$(item.freq));
    }
    var noteNumbers = destination;
    var collectedPairs = zip(samplesSublist, noteNumbers);
    var pairs = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    var tmp$_1;
    tmp$_1 = collectedPairs.iterator();
    while (tmp$_1.hasNext()) {
      var element = tmp$_1.next();
    }
    println('After mapping and zipping: ' + Kotlin.toString(window.performance.now() - functionStartTimestamp));
    this.positionInSamples = samples.size - 1 | 0;
    var groups = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    var curList = {v: Kotlin.kotlin.collections.ArrayList_init_ww73n8$()};
    var curNoteNumber = {v: -1};
    var tmp$_2;
    tmp$_2 = pairs.iterator();
    while (tmp$_2.hasNext()) {
      var element_0 = tmp$_2.next();
      if (element_0.second === curNoteNumber.v) {
        curList.v.add_11rb$(element_0);
      }
       else {
        if (curList.v.size > 0) {
          groups.add_11rb$(curList.v);
          curList.v = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
        }
      }
      curNoteNumber.v = element_0.second;
    }
    if (curList.v.size > 0) {
      groups.add_11rb$(curList.v);
    }
    println('After making pairs: ' + Kotlin.toString(window.performance.now() - functionStartTimestamp));
    var destination_0 = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    var tmp$_3;
    tmp$_3 = groups.iterator();
    while (tmp$_3.hasNext()) {
      var element_1 = tmp$_3.next();
      if (element_1.size > secondsPerBeat * this.minDurationInBeats * this.sampleRate) {
        destination_0.add_11rb$(element_1);
      }
    }
    var groupsOfAcceptableLength = destination_0;
    println('Converted into number groups: ' + Kotlin.toString(groupsOfAcceptableLength.size) + ' from original: ' + Kotlin.toString(groups.size));
    var destination_1 = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    var tmp$_4;
    tmp$_4 = groupsOfAcceptableLength.iterator();
    while (tmp$_4.hasNext()) {
      var element_2 = tmp$_4.next();
      var list = element_2;
      Kotlin.kotlin.collections.addAll_ipc267$(destination_1, list);
    }
    var flattened = destination_1;
    curNoteNumber.v = -1;
    var curLengthInSamples = 0;
    var avgFreq = 0.0;
    tmp$ = flattened.iterator();
    while (tmp$.hasNext()) {
      var pair = tmp$.next();
      var noteNumberFromSample = pair.second;
      var freqFromSample = pair.first;
      if (noteNumberFromSample !== curNoteNumber.v) {
        if (curLengthInSamples > 0) {
          var durationInBeats = curLengthInSamples / (secondsPerBeat * this.sampleRate);
          var noteNum = curNoteNumber.v;
          avgFreq = avgFreq / curLengthInSamples;
          var note = new Note(noteNum, durationInBeats);
          note.avgFreq = avgFreq;
          this.notes.add_11rb$(note);
        }
        avgFreq = 0.0;
        curLengthInSamples = -1;
      }
      avgFreq += freqFromSample;
      curNoteNumber.v = noteNumberFromSample;
      curLengthInSamples = curLengthInSamples + 1 | 0;
    }
    if (curLengthInSamples > 0) {
      var durationInBeats_0 = curLengthInSamples / (secondsPerBeat * this.sampleRate);
      var noteNum_0 = curNoteNumber.v;
      avgFreq = avgFreq / curLengthInSamples;
      var note_0 = new Note(noteNum_0, durationInBeats_0);
      note_0.avgFreq = avgFreq;
      this.notes.add_11rb$(note_0);
    }
    console.log('Turned samples into these notes: ' + Kotlin.toString(this.notes));
    var functionEndTimestamp = window.performance.now();
    println('Function total time: ' + Kotlin.toString(functionEndTimestamp - functionStartTimestamp));
    return this.notes;
  };
  IncrementalBufferManager.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'IncrementalBufferManager',
    interfaces: []
  };
  function IncrementalComparisonEngine() {
    this.allowableFreqencyMargin = 10.0;
    this.allowableRhythmMargin = 0.25;
    this.results = new CompareResults();
    this.curBeatPosition = 0.0;
    this.idealIndexPosition = 0;
    this.testPositionIndex = 0;
  }
  IncrementalComparisonEngine.prototype.compareNoteArrays_l4hzig$ = function (ideal, toTest) {
    var tmp$, tmp$_0, tmp$_1, tmp$_2, tmp$_3, tmp$_4, tmp$_5, tmp$_6, tmp$_7, tmp$_8;
    var functionStartTimestamp = window.performance.now();
    tmp$ = until(this.idealIndexPosition, ideal.size);
    tmp$_0 = tmp$.first;
    tmp$_1 = tmp$.last;
    tmp$_2 = tmp$.step;
    for (var index = tmp$_0; index <= tmp$_1; index += tmp$_2) {
      var value = ideal.get_za3lpa$(index);
      this.idealIndexPosition = index;
      var indexOnToTest = -1;
      var toTestBeatPositionAtIndexToTest = 0.0;
      var toTestBeatPosition = 0.0;
      var diffFromIdealBeatPosition = DoubleCompanionObject.MAX_VALUE;
      tmp$_3 = until(this.testPositionIndex, toTest.size);
      tmp$_4 = tmp$_3.first;
      tmp$_5 = tmp$_3.last;
      tmp$_6 = tmp$_3.step;
      for (var i = tmp$_4; i <= tmp$_5; i += tmp$_6) {
        var item = toTest.get_za3lpa$(i);
        var diff = Math.abs(this.curBeatPosition - toTestBeatPosition);
        if (diff < diffFromIdealBeatPosition) {
          indexOnToTest = i;
          toTestBeatPositionAtIndexToTest = toTestBeatPosition;
          diffFromIdealBeatPosition = diff;
        }
        toTestBeatPosition += item.duration;
      }
      println('Going to compare ideal index ' + index + ' to test index ' + indexOnToTest);
      var feedbackItem = new FeedbackItem(this.curBeatPosition, '');
      this.results.feedbackItems.add_11rb$(feedbackItem);
      if (indexOnToTest === -1) {
        continue;
      }
      this.testPositionIndex = indexOnToTest;
      tmp$_7 = this.results;
      tmp$_7.attempted = tmp$_7.attempted + 1 | 0;
      var isCorrect = true;
      var idealItem = value;
      var testItem = toTest.get_za3lpa$(indexOnToTest);
      println('Durations : ' + Kotlin.toString(idealItem.duration) + ' | ' + Kotlin.toString(testItem.duration));
      if (idealItem.duration - testItem.duration > this.allowableRhythmMargin) {
        println('Test subject too short');
        isCorrect = false;
      }
       else if (idealItem.duration - testItem.duration < -this.allowableRhythmMargin) {
        println('Test subject too long');
        isCorrect = false;
      }
       else {
        println('PERFECT');
      }
      println('Starting points : ' + Kotlin.toString(this.curBeatPosition) + ' | ' + Kotlin.toString(toTestBeatPositionAtIndexToTest));
      if (this.curBeatPosition - toTestBeatPositionAtIndexToTest > this.allowableRhythmMargin) {
        println('Test subject rushing');
        feedbackItem.feedbackItemType = feedbackItem.feedbackItemType + '>';
        isCorrect = false;
      }
       else if (this.curBeatPosition - toTestBeatPositionAtIndexToTest < -this.allowableRhythmMargin) {
        println('Test subject dragging');
        feedbackItem.feedbackItemType = feedbackItem.feedbackItemType + '<';
        isCorrect = false;
      }
       else {
        println('PERFECT');
      }
      println('Pitch : ' + Kotlin.toString(idealItem.getFrequency()) + ' | ' + Kotlin.toString(testItem.getFrequency()));
      println('Avg freq of test item: ' + Kotlin.toString(testItem.avgFreq));
      var avgFreq = testItem.avgFreq;
      if (avgFreq != null) {
        if (avgFreq - idealItem.getFrequency() > this.allowableFreqencyMargin) {
          println('Test subject sharp');
          feedbackItem.feedbackItemType = feedbackItem.feedbackItemType + '^';
          isCorrect = false;
        }
         else if (avgFreq - idealItem.getFrequency() < -this.allowableFreqencyMargin) {
          println('Test subject flat');
          feedbackItem.feedbackItemType = feedbackItem.feedbackItemType + '_';
          isCorrect = false;
        }
         else {
          println('PERFECT');
        }
      }
      this.curBeatPosition += value.duration;
      if (isCorrect) {
        tmp$_8 = this.results;
        tmp$_8.correct = tmp$_8.correct + 1 | 0;
      }
    }
    println('---- Results : ' + Kotlin.toString(this.results.correct) + '/' + Kotlin.toString(this.results.attempted));
    var functionEndTimestamp = window.performance.now();
    println('Function total time: ' + Kotlin.toString(functionEndTimestamp - functionStartTimestamp));
    return this.results;
  };
  IncrementalComparisonEngine.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'IncrementalComparisonEngine',
    interfaces: []
  };
  function Slice(freq) {
    this.frequency = freq;
    this.markers = null;
  }
  function Slice$MarkerType(name, ordinal) {
    Enum.call(this);
    this.name$ = name;
    this.ordinal$ = ordinal;
  }
  function Slice$MarkerType_initFields() {
    Slice$MarkerType_initFields = function () {
    };
    Slice$MarkerType$NoteChange_instance = new Slice$MarkerType('NoteChange', 0);
    Slice$MarkerType$BeatChange_instance = new Slice$MarkerType('BeatChange', 1);
  }
  var Slice$MarkerType$NoteChange_instance;
  function Slice$MarkerType$NoteChange_getInstance() {
    Slice$MarkerType_initFields();
    return Slice$MarkerType$NoteChange_instance;
  }
  var Slice$MarkerType$BeatChange_instance;
  function Slice$MarkerType$BeatChange_getInstance() {
    Slice$MarkerType_initFields();
    return Slice$MarkerType$BeatChange_instance;
  }
  Slice$MarkerType.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'MarkerType',
    interfaces: [Enum]
  };
  function Slice$MarkerType$values() {
    return [Slice$MarkerType$NoteChange_getInstance(), Slice$MarkerType$BeatChange_getInstance()];
  }
  Slice$MarkerType.values = Slice$MarkerType$values;
  function Slice$MarkerType$valueOf(name) {
    switch (name) {
      case 'NoteChange':
        return Slice$MarkerType$NoteChange_getInstance();
      case 'BeatChange':
        return Slice$MarkerType$BeatChange_getInstance();
      default:Kotlin.throwISE('No enum constant com.practicingmusician.models.Slice.MarkerType.' + name);
    }
  }
  Slice$MarkerType.valueOf_61zpoe$ = Slice$MarkerType$valueOf;
  Slice.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'Slice',
    interfaces: []
  };
  function NotationItem() {
  }
  NotationItem.$metadata$ = {
    kind: Kotlin.Kind.INTERFACE,
    simpleName: 'NotationItem',
    interfaces: []
  };
  function Barline() {
  }
  Barline.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'Barline',
    interfaces: [NotationItem]
  };
  function Note(value, dur, textVal) {
    Note$Companion_getInstance();
    if (textVal === void 0)
      textVal = 'none';
    this.noteNumber = value;
    this.duration = dur;
    this.textValue = textVal;
    this.avgFreq = null;
  }
  Note.prototype.getFrequency = function () {
    var A440_NoteNumber = 69.0;
    var equalTemperamentPitch = AppSettings_getInstance().pitch * Math.pow(2.0, (this.noteNumber - A440_NoteNumber) / 12.0);
    return equalTemperamentPitch;
  };
  function Note$Companion() {
    Note$Companion_instance = this;
  }
  Note$Companion.prototype.getNoteNumber_14dthe$ = function (frequency) {
    return this.closestNoteToFrequency_14dthe$(frequency);
  };
  Note$Companion.prototype.createAllNotes = function () {
    var tmp$, tmp$_0, tmp$_1, tmp$_2;
    ALL_NOTES = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    tmp$ = until(30, 90);
    tmp$_0 = tmp$.first;
    tmp$_1 = tmp$.last;
    tmp$_2 = tmp$.step;
    for (var i = tmp$_0; i <= tmp$_1; i += tmp$_2) {
      ALL_NOTES.add_11rb$(new Note(i, 1.0));
    }
  };
  Note$Companion.prototype.closestNoteToFrequency_14dthe$ = function (frequency) {
    var tmp$;
    var closestFrequency = DoubleCompanionObject.MAX_VALUE;
    var closestNoteValue = -1;
    tmp$ = ALL_NOTES.iterator();
    while (tmp$.hasNext()) {
      var note = tmp$.next();
      var diff = Math.abs(note.getFrequency() - frequency);
      if (diff < closestFrequency) {
        closestFrequency = diff;
        closestNoteValue = note.noteNumber;
      }
       else if (diff > closestFrequency) {
        break;
      }
    }
    return closestNoteValue;
  };
  Note$Companion.$metadata$ = {
    kind: Kotlin.Kind.OBJECT,
    simpleName: 'Companion',
    interfaces: []
  };
  var Note$Companion_instance = null;
  function Note$Companion_getInstance() {
    if (Note$Companion_instance === null) {
      new Note$Companion();
    }
    return Note$Companion_instance;
  }
  Note.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'Note',
    interfaces: [NotationItem]
  };
  var ALL_NOTES;
  function Metronome() {
    this.audioKey = 'metronomeSound';
    this.audioManager = this.audioManager;
    this.state_t08vao$_0 = TimeKeeper$TimeKeeperState$Stopped_getInstance();
    this.timeSignature = 4;
    this.prerollBeats = this.timeSignature;
    this.tempo = 120.0;
    this.currentBeat = 0;
    this.beatTimes = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    this.lastBeatOccuredAt = -1.0;
    this.timeoutKeys = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
  }
  Object.defineProperty(Metronome.prototype, 'state', {
    get: function () {
      return this.state_t08vao$_0;
    },
    set: function (state) {
      this.state_t08vao$_0 = state;
    }
  });
  Metronome.prototype.setup = function () {
    this.audioManager.loadAudioFile_puj7f4$('audio/Cowbell.wav', this.audioKey);
  };
  Metronome.prototype.start = function () {
    this.state = TimeKeeper$TimeKeeperState$Running_getInstance();
  };
  Metronome.prototype.stop = function () {
    this.state = TimeKeeper$TimeKeeperState$Stopped_getInstance();
  };
  Metronome.prototype.step_zgkg49$ = function (timestamp, timeKeeper) {
    var beatSize = 1000.0 * 60.0 / this.tempo;
    if (timeKeeper.runForTime - timestamp < beatSize / 2) {
      console.log('Less than beat size..');
      return;
    }
    if (this.lastBeatOccuredAt === -1.0) {
      this.lastBeatOccuredAt = timestamp - beatSize;
    }
    var nextBeatTime = this.lastBeatOccuredAt + beatSize;
    var absoluteBeatPosition = timestamp / beatSize;
    this.updateIndicatorUI_14dthe$(absoluteBeatPosition);
    if (timestamp >= nextBeatTime) {
      this.audioManager.playAudioNow_61zpoe$(this.audioKey);
      this.lastBeatOccuredAt = nextBeatTime;
      this.updateMetronomeUI_za3lpa$(this.currentBeat);
      this.currentBeat = this.currentBeat + 1 | 0;
    }
  };
  function Metronome$oldStep$lambda(closure$curBeatCopy, this$Metronome) {
    return function () {
      this$Metronome.updateMetronomeUI_za3lpa$(closure$curBeatCopy);
    };
  }
  Metronome.prototype.oldStep_zgkg49$ = function (timestamp, timeKeeper) {
    var beatSize = 1000.0 * 60.0 / this.tempo;
    if (this.lastBeatOccuredAt === -1.0) {
      println('First run');
      this.lastBeatOccuredAt = timestamp - beatSize;
    }
    var newTime = this.lastBeatOccuredAt + beatSize;
    var difference = newTime - timestamp;
    var absoluteBeatPosition = timestamp / beatSize;
    console.log('At beat : ' + Kotlin.toString(absoluteBeatPosition));
    this.updateIndicatorUI_14dthe$(absoluteBeatPosition);
    if (this.lastBeatOccuredAt > timestamp) {
      return;
    }
    this.audioManager.playAudio_bm4lxs$(this.audioKey, difference | 0);
    var curBeatCopy = this.currentBeat;
    var timeoutKey = window.setTimeout(Metronome$oldStep$lambda(curBeatCopy, this), difference | 0);
    this.timeoutKeys.add_11rb$(timeoutKey);
    println('Going to play at ' + Kotlin.toString(newTime | 0));
    this.lastBeatOccuredAt = newTime;
    this.beatTimes.add_11rb$(newTime);
    this.currentBeat = this.currentBeat + 1 | 0;
  };
  function Metronome$cancelAllUIUpdates$lambda(it) {
    return true;
  }
  Metronome.prototype.cancelAllUIUpdates = function () {
    var tmp$;
    tmp$ = reversed(this.timeoutKeys).iterator();
    while (tmp$.hasNext()) {
      var element = tmp$.next();
      println('Cancelling item... ' + element);
      window.clearTimeout(element);
    }
    removeAll(this.timeoutKeys, Metronome$cancelAllUIUpdates$lambda);
  };
  Metronome.prototype.updateIndicatorUI_14dthe$ = function (beat) {
    moveToPosition(beat - this.prerollBeats);
  };
  Metronome.prototype.updateMetronomeUI_za3lpa$ = function (beat) {
    highlightMetronomeItem(beat % this.timeSignature);
  };
  Metronome.prototype.getBeatOfTimestamp_14dthe$ = function (timestamp) {
    var tmp$, tmp$_0, tmp$_1, tmp$_2;
    var firstItem = -1.0;
    var secondItem = -1.0;
    var lastItemBefore;
    tmp$ = get_indices(this.beatTimes);
    tmp$_0 = tmp$.first;
    tmp$_1 = tmp$.last;
    tmp$_2 = tmp$.step;
    for (var index = tmp$_0; index <= tmp$_1; index += tmp$_2) {
      var beat = this.beatTimes.get_za3lpa$(index);
      if (beat > timestamp) {
        lastItemBefore = index - 1 | 0;
        if (lastItemBefore === -1) {
          return -1.0;
        }
        firstItem = this.beatTimes.get_za3lpa$(lastItemBefore);
        secondItem = beat;
        break;
      }
    }
    if (firstItem == null) {
      return -1.0;
    }
    var distanceBetweenBeats = secondItem - firstItem;
    var distanceFromStampToFirstBeat = timestamp - firstItem;
    var percentageThroughBeat = distanceFromStampToFirstBeat / distanceBetweenBeats;
    return percentageThroughBeat;
  };
  Metronome.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'Metronome',
    interfaces: [TimeKeeperSteppable]
  };
  function SampleCollection(freq, lengthInSamples) {
    this.freq = freq;
    this.lengthInSamples = lengthInSamples;
  }
  SampleCollection.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'SampleCollection',
    interfaces: []
  };
  SampleCollection.prototype.component1 = function () {
    return this.freq;
  };
  SampleCollection.prototype.component2 = function () {
    return this.lengthInSamples;
  };
  SampleCollection.prototype.copy_12fank$ = function (freq, lengthInSamples) {
    return new SampleCollection(freq === void 0 ? this.freq : freq, lengthInSamples === void 0 ? this.lengthInSamples : lengthInSamples);
  };
  SampleCollection.prototype.toString = function () {
    return 'SampleCollection(freq=' + Kotlin.toString(this.freq) + (', lengthInSamples=' + Kotlin.toString(this.lengthInSamples)) + ')';
  };
  SampleCollection.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.freq) | 0;
    result = result * 31 + Kotlin.hashCode(this.lengthInSamples) | 0;
    return result;
  };
  SampleCollection.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.freq, other.freq) && Kotlin.equals(this.lengthInSamples, other.lengthInSamples)))));
  };
  function PitchTracker() {
    this.sampleRate = 44100.0;
    this.lengthOfPrerollToIgnore = 0.0;
    this.samples = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    this.state_j0gsl6$_0 = TimeKeeper$TimeKeeperState$Stopped_getInstance();
  }
  PitchTracker.prototype.setup = function () {
  };
  PitchTracker.prototype.start = function () {
    this.state = TimeKeeper$TimeKeeperState$Running_getInstance();
  };
  PitchTracker.prototype.stop = function () {
    this.state = TimeKeeper$TimeKeeperState$Stopped_getInstance();
  };
  Object.defineProperty(PitchTracker.prototype, 'state', {
    get: function () {
      return this.state_j0gsl6$_0;
    },
    set: function (state) {
      this.state_j0gsl6$_0 = state;
    }
  });
  PitchTracker.prototype.step_zgkg49$ = function (timestamp, timeKeeper) {
    var correlatedFrequency = updatePitch(timestamp);
    println('Timestamp: ' + Kotlin.toString(timestamp));
    println('Pitch: ' + Kotlin.toString(correlatedFrequency));
    var lengthOfBuffer = buflen / 2.0 / getSampleRate();
    var timestampOfPitch = timestamp - lengthOfBuffer * 1000.0;
    println('Buffer started at timestamp: ' + Kotlin.toString(timestampOfPitch));
    var currentTimestampOfSamplesBuffer = this.samples.size / this.sampleRate * 1000.0;
    var timestampOffsetWithPreroll = timestamp - this.lengthOfPrerollToIgnore;
    var samplesToFill = (timestampOffsetWithPreroll - currentTimestampOfSamplesBuffer) * this.sampleRate / 1000.0;
    if (samplesToFill < 0) {
      println('Not filling yet...');
      return;
    }
    println('Filling ' + Kotlin.toString(samplesToFill));
    this.samples.add_11rb$(new SampleCollection(correlatedFrequency, samplesToFill | 0));
  };
  PitchTracker.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'PitchTracker',
    interfaces: [TimeKeeperSteppable]
  };
  function TimeKeeper() {
    this.finishedActions = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    this.state_k2u27h$_0 = TimeKeeper$TimeKeeperState$Stopped_getInstance();
    this.steppables = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    this.analyzers = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    this.timeOffSet = -1.0;
    this.runForTime = 4100.0;
  }
  function TimeKeeper$TimeKeeperState(name, ordinal) {
    Enum.call(this);
    this.name$ = name;
    this.ordinal$ = ordinal;
  }
  function TimeKeeper$TimeKeeperState_initFields() {
    TimeKeeper$TimeKeeperState_initFields = function () {
    };
    TimeKeeper$TimeKeeperState$Stopped_instance = new TimeKeeper$TimeKeeperState('Stopped', 0);
    TimeKeeper$TimeKeeperState$Running_instance = new TimeKeeper$TimeKeeperState('Running', 1);
  }
  var TimeKeeper$TimeKeeperState$Stopped_instance;
  function TimeKeeper$TimeKeeperState$Stopped_getInstance() {
    TimeKeeper$TimeKeeperState_initFields();
    return TimeKeeper$TimeKeeperState$Stopped_instance;
  }
  var TimeKeeper$TimeKeeperState$Running_instance;
  function TimeKeeper$TimeKeeperState$Running_getInstance() {
    TimeKeeper$TimeKeeperState_initFields();
    return TimeKeeper$TimeKeeperState$Running_instance;
  }
  TimeKeeper$TimeKeeperState.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'TimeKeeperState',
    interfaces: [Enum]
  };
  function TimeKeeper$TimeKeeperState$values() {
    return [TimeKeeper$TimeKeeperState$Stopped_getInstance(), TimeKeeper$TimeKeeperState$Running_getInstance()];
  }
  TimeKeeper$TimeKeeperState.values = TimeKeeper$TimeKeeperState$values;
  function TimeKeeper$TimeKeeperState$valueOf(name) {
    switch (name) {
      case 'Stopped':
        return TimeKeeper$TimeKeeperState$Stopped_getInstance();
      case 'Running':
        return TimeKeeper$TimeKeeperState$Running_getInstance();
      default:Kotlin.throwISE('No enum constant com.practicingmusician.steppable.TimeKeeper.TimeKeeperState.' + name);
    }
  }
  TimeKeeper$TimeKeeperState.valueOf_61zpoe$ = TimeKeeper$TimeKeeperState$valueOf;
  Object.defineProperty(TimeKeeper.prototype, 'state', {
    get: function () {
      return this.state_k2u27h$_0;
    },
    set: function (value) {
      this.state_k2u27h$_0 = value;
      if (value === TimeKeeper$TimeKeeperState$Stopped_getInstance()) {
        var tmp$;
        tmp$ = this.finishedActions.iterator();
        while (tmp$.hasNext()) {
          var element = tmp$.next();
          element();
        }
      }
    }
  });
  TimeKeeper.prototype.start = function () {
    this.state = TimeKeeper$TimeKeeperState$Running_getInstance();
    this.requestNextStep();
  };
  TimeKeeper.prototype.stop = function () {
    this.state = TimeKeeper$TimeKeeperState$Stopped_getInstance();
    this.timeOffSet = -1.0;
  };
  function TimeKeeper$requestNextStep$lambda(this$TimeKeeper) {
    return function (it) {
      this$TimeKeeper.step_14dthe$(it);
    };
  }
  TimeKeeper.prototype.requestNextStep = function () {
    window.requestAnimationFrame(TimeKeeper$requestNextStep$lambda(this));
  };
  TimeKeeper.prototype.step_14dthe$ = function (nonOffsetTimestamp) {
    if (this.timeOffSet === -1.0) {
      this.timeOffSet = nonOffsetTimestamp;
    }
    var timestamp = nonOffsetTimestamp - this.timeOffSet;
    println('Calling step at : ' + Kotlin.toString(timestamp) + (' (raw: ' + nonOffsetTimestamp + ')'));
    var tmp$;
    tmp$ = this.steppables.iterator();
    while (tmp$.hasNext()) {
      var element = tmp$.next();
      if (element.state === TimeKeeper$TimeKeeperState$Running_getInstance())
        element.step_zgkg49$(timestamp, this);
    }
    var tmp$_0;
    tmp$_0 = this.analyzers.iterator();
    while (tmp$_0.hasNext()) {
      var element_0 = tmp$_0.next();
      element_0.analyze_14dthe$(timestamp);
    }
    if (timestamp >= this.runForTime) {
      console.log('STOPPED ((((((((((((((((((((((((((((((())))))))))))))))))');
      this.state = TimeKeeper$TimeKeeperState$Stopped_getInstance();
    }
    if (this.state !== TimeKeeper$TimeKeeperState$Stopped_getInstance())
      this.requestNextStep();
  };
  TimeKeeper.prototype.currentTime = function () {
    return window.performance.now() - this.timeOffSet;
  };
  TimeKeeper.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'TimeKeeper',
    interfaces: []
  };
  function TimeKeeperSteppable() {
  }
  TimeKeeperSteppable.$metadata$ = {
    kind: Kotlin.Kind.INTERFACE,
    simpleName: 'TimeKeeperSteppable',
    interfaces: []
  };
  function TimeKeeperAnalyzer() {
  }
  TimeKeeperAnalyzer.$metadata$ = {
    kind: Kotlin.Kind.INTERFACE,
    simpleName: 'TimeKeeperAnalyzer',
    interfaces: []
  };
  function PitchTrackerTest() {
    PitchTrackerTest_instance = this;
  }
  PitchTrackerTest.prototype.runTest = function () {
    var tmp$;
    var tracker = new PitchTracker();
    tmp$ = step(new IntRange(24, 1024), 17).iterator();
    while (tmp$.hasNext())
      var i = tmp$.next();
    println('Samples: ' + Kotlin.toString(tracker.samples.size));
  };
  PitchTrackerTest.prototype.toggleTest = function () {
  };
  PitchTrackerTest.$metadata$ = {
    kind: Kotlin.Kind.OBJECT,
    simpleName: 'PitchTrackerTest',
    interfaces: []
  };
  var PitchTrackerTest_instance = null;
  function PitchTrackerTest_getInstance() {
    if (PitchTrackerTest_instance === null) {
      new PitchTrackerTest();
    }
    return PitchTrackerTest_instance;
  }
  function PitchTrackerTestClass() {
    this.tracker = new PitchTracker();
  }
  PitchTrackerTestClass.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'PitchTrackerTestClass',
    interfaces: []
  };
  function SliceTest() {
    SliceTest_instance = this;
    this.notes = listOf([new Note(69, 1.0), new Note(81, 1.0), new Note(69, 1.0), new Note(81, 1.0)]);
    this.tempo = 120.0;
    this.secondsPerBeat = 60.0 / this.tempo;
    this.sampleRate = 44100.0;
    this.bufferLengthInSamples = 1024;
  }
  SliceTest.prototype.testShouldBe_3xie8k$ = function (ideal, testValue) {
    if (ideal.attempted === testValue.attempted && ideal.correct === testValue.correct) {
      println('---- PASSED -----');
    }
     else {
      window.alert('Failed');
      println('----- ***** FAILED ****** -----');
    }
  };
  SliceTest.prototype.runTest = function () {
    Note$Companion_getInstance().createAllNotes();
    var exerciseSamples = TestBufferGenerator_getInstance().generateExactBufferFromNotes_jisecs$(this.notes, this.tempo);
    var exactCopyGenerated = BufferManager_getInstance().convertSamplesBufferToNotes_av4ikl$(exerciseSamples, this.tempo);
    var copyWithAvgData = TestBufferGenerator_getInstance().addAvgPitchToSamples_j94q56$(exactCopyGenerated);
    println('Comparing exact copies...');
    var copyWithVariedPitch = TestBufferGenerator_getInstance().addPitchVariationToSamples_d3e2cz$(exerciseSamples);
    var copyWithVariedPitchNotes = BufferManager_getInstance().convertSamplesBufferToNotes_av4ikl$(copyWithVariedPitch, this.tempo);
    println('Comparing with pitch variation...');
    var copyWithVariedRhythm = TestBufferGenerator_getInstance().addRhythmVariationToSamples_d3e2cz$(exerciseSamples);
    var copyWithVariedRhythmNotes = BufferManager_getInstance().convertSamplesBufferToNotes_av4ikl$(copyWithVariedRhythm, this.tempo);
    println('Comparing with rhythm variation...');
    var copyWithShortItems = TestBufferGenerator_getInstance().addShortItemsThatShouldBeRemoved_d3e2cz$(exerciseSamples);
    var copyWithShortItemsNotes = BufferManager_getInstance().convertSamplesBufferToNotes_av4ikl$(copyWithShortItems, this.tempo);
    println('Comparing with short values that should be removed...');
    var notesWithExtra = listOf([new Note(69, 1.0), new Note(81, 0.5), new Note(60, 0.5), new Note(69, 1.0), new Note(81, 1.0)]);
    var exerciseSamplesWithExtra = TestBufferGenerator_getInstance().generateExactBufferFromNotes_jisecs$(notesWithExtra, this.tempo);
    var exactCopyGeneratedWithExtra = BufferManager_getInstance().convertSamplesBufferToNotes_av4ikl$(exerciseSamplesWithExtra, this.tempo);
    var copyWithAvgDataWithExtra = TestBufferGenerator_getInstance().addAvgPitchToSamples_j94q56$(exactCopyGeneratedWithExtra);
    println('Comparing copies with extra note...');
    return 'Done';
  };
  SliceTest.prototype.convertCorrelatedBuffersToSamples = function () {
    var tmp$, tmp$_0, tmp$_1, tmp$_2;
    var $receiver = this.notes;
    var destination = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$($receiver, 10));
    var tmp$_3;
    tmp$_3 = $receiver.iterator();
    while (tmp$_3.hasNext()) {
      var item = tmp$_3.next();
      destination.add_11rb$(item.duration);
    }
    var iterator_3 = destination.iterator();
    if (!iterator_3.hasNext()) {
      throw new Kotlin.kotlin.UnsupportedOperationException("Empty collection can't be reduced.");
    }
    var accumulator = iterator_3.next();
    while (iterator_3.hasNext()) {
      accumulator = accumulator + iterator_3.next();
    }
    var lengthOfNotesInSeconds = accumulator * this.secondsPerBeat;
    var numCorrelatedBuffers = lengthOfNotesInSeconds * this.sampleRate / this.bufferLengthInSamples;
    console.log('Num correlated buffers: ' + Kotlin.toString(numCorrelatedBuffers));
    var correlatedBuffers = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    var samplesPerCorrelatedBuffer = 1024;
    tmp$ = until(0, numCorrelatedBuffers | 0);
    tmp$_0 = tmp$.first;
    tmp$_1 = tmp$.last;
    tmp$_2 = tmp$.step;
    for (var i = tmp$_0; i <= tmp$_1; i += tmp$_2) {
      correlatedBuffers.add_11rb$(440.0);
    }
    correlatedBuffers.set_wxm5ur$(1, 880.0);
    correlatedBuffers.set_wxm5ur$(2, 440.0);
    correlatedBuffers.set_wxm5ur$(3, 880.0);
    var samplesFromCorrelatedBuffers = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    var tmp$_4;
    tmp$_4 = correlatedBuffers.iterator();
    while (tmp$_4.hasNext()) {
      var element = tmp$_4.next();
      var tmp$_5, tmp$_6, tmp$_7, tmp$_8;
      tmp$_5 = until(0, samplesPerCorrelatedBuffer);
      tmp$_6 = tmp$_5.first;
      tmp$_7 = tmp$_5.last;
      tmp$_8 = tmp$_5.step;
      for (var i_0 = tmp$_6; i_0 <= tmp$_7; i_0 += tmp$_8) {
        samplesFromCorrelatedBuffers.add_11rb$(element);
      }
    }
    return samplesFromCorrelatedBuffers;
  };
  SliceTest.$metadata$ = {
    kind: Kotlin.Kind.OBJECT,
    simpleName: 'SliceTest',
    interfaces: []
  };
  var SliceTest_instance = null;
  function SliceTest_getInstance() {
    if (SliceTest_instance === null) {
      new SliceTest();
    }
    return SliceTest_instance;
  }
  function TestBufferGenerator() {
    TestBufferGenerator_instance = this;
  }
  TestBufferGenerator.prototype.generateExactBufferFromNotes_jisecs$ = function (notes, tempo) {
    return BufferManager_getInstance().convertNotesToSamples_jisecs$(notes, tempo);
  };
  TestBufferGenerator.prototype.addAvgPitchToSamples_j94q56$ = function (notes) {
    var destination = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$(notes, 10));
    var tmp$;
    tmp$ = notes.iterator();
    while (tmp$.hasNext()) {
      var item = tmp$.next();
      var tmp$_0 = destination.add_11rb$;
      item.avgFreq = item.getFrequency();
      tmp$_0.call(destination, item);
    }
    return destination;
  };
  TestBufferGenerator.prototype.addPitchVariationToSamples_d3e2cz$ = function (buffer) {
    var pitchVariation = 15.0;
    var destination = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$(buffer, 10));
    var tmp$;
    tmp$ = buffer.iterator();
    while (tmp$.hasNext()) {
      var item = tmp$.next();
      var tmp$_0 = destination.add_11rb$;
      var randomAddition = Math.random() * pitchVariation * 2;
      tmp$_0.call(destination, item + randomAddition / 2.0);
    }
    return destination;
  };
  TestBufferGenerator.prototype.addRhythmVariationToSamples_d3e2cz$ = function (buffer) {
    var newBuffer = toMutableList(buffer);
    for (var i = 0; i <= 3600; i++) {
      newBuffer.removeAt_za3lpa$(0);
    }
    for (var i_0 = 14000; i_0 <= 18000; i_0++) {
      newBuffer.add_11rb$(newBuffer.get_za3lpa$(400));
    }
    for (var i_1 = 13000; i_1 <= 15500; i_1++) {
      newBuffer.removeAt_za3lpa$(0);
    }
    return newBuffer;
  };
  TestBufferGenerator.prototype.addShortItemsThatShouldBeRemoved_d3e2cz$ = function (buffer) {
    var newBuffer = toMutableList(buffer);
    for (var i = 0; i <= 5; i++) {
      newBuffer.add_wxm5ur$(0, 2.0);
    }
    for (var i_0 = 0; i_0 <= 15; i_0++) {
      newBuffer.add_wxm5ur$(100, 2.0);
    }
    for (var i_1 = 0; i_1 <= 3; i_1++) {
      newBuffer.add_wxm5ur$(10000, 2.0);
    }
    return newBuffer;
  };
  TestBufferGenerator.$metadata$ = {
    kind: Kotlin.Kind.OBJECT,
    simpleName: 'TestBufferGenerator',
    interfaces: []
  };
  var TestBufferGenerator_instance = null;
  function TestBufferGenerator_getInstance() {
    if (TestBufferGenerator_instance === null) {
      new TestBufferGenerator();
    }
    return TestBufferGenerator_instance;
  }
  Object.defineProperty(_, 'app', {
    get: function () {
      return app;
    }
  });
  _.main_kand9s$ = main;
  _.runProgram = runProgram;
  var package$com = _.com || (_.com = {});
  var package$practicingmusician = package$com.practicingmusician || (package$com.practicingmusician = {});
  package$practicingmusician.App = App;
  Object.defineProperty(package$practicingmusician, 'AppSettings', {
    get: AppSettings_getInstance
  });
  var package$audio = package$practicingmusician.audio || (package$practicingmusician.audio = {});
  package$audio.AudioManager = AudioManager;
  var package$exercises = package$practicingmusician.exercises || (package$practicingmusician.exercises = {});
  package$exercises.ExerciseDefinition = ExerciseDefinition;
  package$exercises.ExerciseManager = ExerciseManager;
  var package$finals = package$practicingmusician.finals || (package$practicingmusician.finals = {});
  Object.defineProperty(package$finals, 'BufferManager', {
    get: BufferManager_getInstance
  });
  Object.defineProperty(package$finals, 'CompareEngine', {
    get: CompareEngine_getInstance
  });
  package$finals.FeedbackItem = FeedbackItem;
  package$finals.CompareResults = CompareResults;
  package$finals.IncrementalBufferManager = IncrementalBufferManager;
  package$finals.IncrementalComparisonEngine = IncrementalComparisonEngine;
  Object.defineProperty(Slice$MarkerType, 'NoteChange', {
    get: Slice$MarkerType$NoteChange_getInstance
  });
  Object.defineProperty(Slice$MarkerType, 'BeatChange', {
    get: Slice$MarkerType$BeatChange_getInstance
  });
  Slice.MarkerType = Slice$MarkerType;
  var package$models = package$practicingmusician.models || (package$practicingmusician.models = {});
  package$models.Slice = Slice;
  var package$notes = package$practicingmusician.notes || (package$practicingmusician.notes = {});
  package$notes.NotationItem = NotationItem;
  package$notes.Barline = Barline;
  Object.defineProperty(Note, 'Companion', {
    get: Note$Companion_getInstance
  });
  package$notes.Note = Note;
  Object.defineProperty(package$notes, 'ALL_NOTES', {
    get: function () {
      return ALL_NOTES;
    },
    set: function (value) {
      ALL_NOTES = value;
    }
  });
  var package$steppable = package$practicingmusician.steppable || (package$practicingmusician.steppable = {});
  package$steppable.Metronome = Metronome;
  package$steppable.SampleCollection = SampleCollection;
  package$steppable.PitchTracker = PitchTracker;
  Object.defineProperty(TimeKeeper$TimeKeeperState, 'Stopped', {
    get: TimeKeeper$TimeKeeperState$Stopped_getInstance
  });
  Object.defineProperty(TimeKeeper$TimeKeeperState, 'Running', {
    get: TimeKeeper$TimeKeeperState$Running_getInstance
  });
  TimeKeeper.TimeKeeperState = TimeKeeper$TimeKeeperState;
  package$steppable.TimeKeeper = TimeKeeper;
  package$steppable.TimeKeeperSteppable = TimeKeeperSteppable;
  package$steppable.TimeKeeperAnalyzer = TimeKeeperAnalyzer;
  var package$tests = package$practicingmusician.tests || (package$practicingmusician.tests = {});
  Object.defineProperty(package$tests, 'PitchTrackerTest', {
    get: PitchTrackerTest_getInstance
  });
  package$tests.PitchTrackerTestClass = PitchTrackerTestClass;
  Object.defineProperty(package$tests, 'SliceTest', {
    get: SliceTest_getInstance
  });
  Object.defineProperty(package$tests, 'TestBufferGenerator', {
    get: TestBufferGenerator_getInstance
  });
  app = new App();
  ALL_NOTES = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
  Kotlin.defineModule('PracticingMusician', _);
  main([]);
  return _;
}(typeof PracticingMusician === 'undefined' ? {} : PracticingMusician, kotlin);
