if (typeof kotlin === 'undefined') {
  throw new Error("Error loading module 'PracticingMusician'. Its dependency 'kotlin' was not found. Please, check whether 'kotlin' is loaded prior to 'PracticingMusician'.");
}
var PracticingMusician = function (_, Kotlin) {
  'use strict';
  var toList = Kotlin.kotlin.collections.toList_us0mfu$;
  var toList_0 = Kotlin.kotlin.collections.toList_7wnvza$;
  var until = Kotlin.kotlin.ranges.until_dqglrj$;
  var removeAll = Kotlin.kotlin.collections.removeAll_qafx1e$;
  var Enum = Kotlin.kotlin.Enum;
  var DoubleCompanionObject = Kotlin.kotlin.js.internal.DoubleCompanionObject;
  var reversed = Kotlin.kotlin.collections.reversed_7wnvza$;
  var toMutableList = Kotlin.kotlin.collections.toMutableList_4c7yge$;
  var split = Kotlin.kotlin.text.split_o64adg$;
  var first = Kotlin.kotlin.collections.first_2p1efm$;
  var toInt = Kotlin.kotlin.text.toInt_pdl1vz$;
  var average = Kotlin.kotlin.collections.average_l63kqw$;
  var zip = Kotlin.kotlin.collections.zip_45mdf7$;
  var IntCompanionObject = Kotlin.kotlin.js.internal.IntCompanionObject;
  var Pair = Kotlin.kotlin.Pair;
  var last = Kotlin.kotlin.collections.last_2p1efm$;
  var to = Kotlin.kotlin.to_ujzrz7$;
  var mapOf = Kotlin.kotlin.collections.mapOf_qfcya0$;
  var println = Kotlin.kotlin.io.println_s8jyv4$;
  var IntRange = Kotlin.kotlin.ranges.IntRange;
  var step = Kotlin.kotlin.ranges.step_xsgg7u$;
  var listOf = Kotlin.kotlin.collections.listOf_i5x0yv$;
  TunerModes.prototype = Object.create(Enum.prototype);
  TunerModes.prototype.constructor = TunerModes;
  FeedbackType.prototype = Object.create(Enum.prototype);
  FeedbackType.prototype.constructor = FeedbackType;
  TimeKeeper$TimeKeeperState.prototype = Object.create(Enum.prototype);
  TimeKeeper$TimeKeeperState.prototype.constructor = TimeKeeper$TimeKeeperState;
  function ListenerApp() {
    this.scoreUtil = this.scoreUtil;
    this.exercise = this.exercise;
    this.parameters = this.parameters;
    this.audioManager = this.audioManager;
    this.exerciseManager = this.exerciseManager;
    this.tuner = this.tuner;
    this.currentFeedbackItems = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
  }
  ListenerApp.prototype.setTempoForTests_14dthe$ = function (t) {
    UserSettings_getInstance().setTempo_8555vt$(t, true);
  };
  ListenerApp.prototype.getTempo = function () {
    return UserSettings_getInstance().tempo;
  };
  ListenerApp.prototype.getMetronomeAudio = function () {
    return UserSettings_getInstance().metronomeAudioOn;
  };
  ListenerApp.prototype.runTuner = function (parameters) {
    console.log('Running with parameters:');
    console.log(parameters);
    Note$Companion_getInstance().createAllNotes();
    audioAnalyzer.setupMedia();
    this.tuner = new PMTuner(parameters);
    this.tuner.audioAnalyzer = audioAnalyzer;
    this.tuner.run();
  };
  function ListenerApp$runApp$lambda(this$ListenerApp, closure$parameters) {
    return function (callbackData) {
      console.log('Callback:');
      var converter = new jsMusicXMLConverter();
      var json = converter.convertXMLToJSON(callbackData);
      console.log('JSON:');
      var jsCode = converter.convertJSON(json);
      this$ListenerApp.exercise = jsCode.easyScoreInfo;
      this$ListenerApp.finishRunApp_pjzheq$(closure$parameters);
    };
  }
  ListenerApp.prototype.runApp = function (parameters) {
    this.parameters = parameters;
    loadXml(parameters.xmlUrl, ListenerApp$runApp$lambda(this, parameters));
  };
  ListenerApp.prototype.finishRunApp_pjzheq$ = function (parameters) {
    this.audioManager = new AudioManager();
    this.exerciseManager = new ExerciseManager(this.audioManager);
    this.scoreUtil = new EasyScoreUtil();
    Note$Companion_getInstance().createAllNotes();
    audioAnalyzer.setupMedia();
    var prefs = new AppPreferences(parameters.metronomeSound, parameters.bpm, parameters.transposition, parameters.pitch);
    UserSettings_getInstance().setTempo_8555vt$(this.exercise.tempo, true);
    this.alterPreferences(prefs);
    this.exerciseManager.loadExercise();
    this.makeDomElements();
  };
  ListenerApp.prototype.alterPreferences = function (preferences) {
    var tmp$, tmp$_0, tmp$_1, tmp$_2;
    console.log('Altering preferences...');
    console.log(preferences);
    this.exerciseManager.stop();
    if ((tmp$ = preferences.metronomeSound) != null) {
      UserSettings_getInstance().metronomeAudioOn = tmp$;
    }
    if ((tmp$_0 = preferences.bpm) != null) {
      console.log('Setting bpm to ' + tmp$_0);
      UserSettings_getInstance().setTempo_8555vt$(tmp$_0, tmp$_0 === listenerApp.exercise.tempo);
      if (this.scoreUtil.exercise != null) {
        this.scoreUtil.setupMetronome(this.parameters.metronomeContainerName);
      }
    }
    if ((tmp$_1 = preferences.pitch) != null) {
      UserSettings_getInstance().pitch = tmp$_1;
    }
    if ((tmp$_2 = preferences.transposition) != null) {
      UserSettings_getInstance().transposition = tmp$_2;
      var tmp$_3 = this.exercise;
      var $receiver = toList(this.exercise.notes);
      var destination = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$($receiver, 10));
      var tmp$_4;
      tmp$_4 = $receiver.iterator();
      while (tmp$_4.hasNext()) {
        var item = tmp$_4.next();
        var tmp$_5 = destination.add_11rb$;
        var transform$result;
        transform$break: do {
          if (UserSettings_getInstance().transposition !== 0) {
            var newNote = new SimpleJSNoteObject(item.noteNumber + UserSettings_getInstance().transposition | 0, item.duration, item.id);
            transform$result = newNote;
            break transform$break;
          }
          transform$result = item;
        }
         while (false);
        tmp$_5.call(destination, transform$result);
      }
      tmp$_3.notes = Kotlin.kotlin.collections.copyToArray(destination);
    }
  };
  ListenerApp.prototype.makeDomElements = function () {
    var tmp$, tmp$_0, tmp$_1, tmp$_2, tmp$_3, tmp$_4;
    pm_log('Making window w/ container: ' + this.parameters.notationContainerName, 10);
    var container = Kotlin.isType(tmp$ = document.getElementById(this.parameters.notationContainerName), HTMLElement) ? tmp$ : Kotlin.throwCCE();
    container.className = container.className + 'notationBodyContainer';
    var indicatorCanvasName = 'indicatorCanvas';
    var indicatorCanvasObj = Kotlin.isType(tmp$_0 = document.createElement('canvas'), HTMLElement) ? tmp$_0 : Kotlin.throwCCE();
    indicatorCanvasObj.style.position = 'absolute';
    indicatorCanvasObj.id = indicatorCanvasName;
    (tmp$_1 = document.getElementById(this.parameters.notationContainerName)) != null ? tmp$_1.appendChild(indicatorCanvasObj) : null;
    pm_log('Made indicator canvas on notation body: ', 10);
    pm_log(Kotlin.isType(tmp$_2 = document.getElementById(this.parameters.notationContainerName), HTMLElement) ? tmp$_2 : Kotlin.throwCCE());
    var feedbackCanvasName = 'feedbackCanvas';
    var feedbackCanvasObj = Kotlin.isType(tmp$_3 = document.createElement('canvas'), HTMLElement) ? tmp$_3 : Kotlin.throwCCE();
    feedbackCanvasObj.style.position = 'absolute';
    feedbackCanvasObj.id = feedbackCanvasName;
    (tmp$_4 = document.getElementById(this.parameters.notationContainerName)) != null ? tmp$_4.appendChild(feedbackCanvasObj) : null;
    this.makeScore_puj7f4$(this.parameters.notationContainerName, this.parameters.controlsContainerName);
  };
  ListenerApp.prototype.makeScore_puj7f4$ = function (containerElementName, controlsElementName) {
    this.scoreUtil = new EasyScoreUtil();
    this.scoreUtil.containerElementName = this.parameters.notationContainerName;
    this.scoreUtil.exercise = this.exercise;
    pm_log('Setting up score on ' + containerElementName);
    this.scoreUtil.setupOnElement(containerElementName);
    this.scoreUtil.setupControls(controlsElementName);
    this.scoreUtil.setupMetronome(this.parameters.metronomeContainerName);
    this.scoreUtil.buildTitleElements(containerElementName);
    this.scoreUtil.notateExercise();
  };
  ListenerApp.prototype.toggleState = function () {
    var tmp$;
    tmp$ = this.exerciseManager.timeKeeper.state;
    if (Kotlin.equals(tmp$, TimeKeeper$TimeKeeperState$Stopped_getInstance())) {
      if (!audioAnalyzer.isFunctional || !audioAnalyzer.hasMicrophoneAccess) {
        displayFlashMessages([new FlashMessage('danger', 'Audio not working.  Please make sure you are using either Chrome or Firefox and have enabled microphone access.')]);
        return;
      }
      this.exerciseManager.createSteppables();
      this.exerciseManager.setup();
      this.exerciseManager.loadExercise();
      this.exerciseManager.run();
    }
     else if (Kotlin.equals(tmp$, TimeKeeper$TimeKeeperState$Running_getInstance()))
      this.exerciseManager.stop();
    else
      Kotlin.equals(tmp$, TimeKeeper$TimeKeeperState$Completed_getInstance());
  };
  ListenerApp.prototype.doResizeActions = function () {
    var tmp$;
    pm_log('Resized window w/ container: ' + this.parameters.notationContainerName, 10);
    var oldSVG = document.getElementsByTagName('svg')[0];
    (tmp$ = oldSVG != null ? oldSVG.parentNode : null) != null ? tmp$.removeChild(oldSVG) : null;
    listenerApp.makeScore_puj7f4$(this.parameters.notationContainerName, this.parameters.controlsContainerName);
    var copyOfFeedbackItems = toList_0(listenerApp.currentFeedbackItems);
    listenerApp.clearFeedbackItems();
    var tmp$_0;
    tmp$_0 = copyOfFeedbackItems.iterator();
    while (tmp$_0.hasNext()) {
      var element = tmp$_0.next();
      listenerApp.addFeedbackItem_775p9r$(element);
    }
  };
  ListenerApp.prototype.moveToPosition_14dthe$ = function (beat) {
    var tmp$;
    var indicatorCanvas = Kotlin.isType(tmp$ = document.getElementById('indicatorCanvas'), HTMLCanvasElement) ? tmp$ : null;
    (indicatorCanvas != null ? indicatorCanvas.getContext('2d') : null).clearRect(0, 0, indicatorCanvas != null ? indicatorCanvas.width : null, indicatorCanvas != null ? indicatorCanvas.height : null);
    this.scoreUtil.showPageNumber(this.scoreUtil.getPageForBeat(beat));
    this.scoreUtil.drawIndicatorLine(indicatorCanvas, beat);
  };
  ListenerApp.prototype.highlightMetronomeItem_za3lpa$ = function (itemNumber) {
    var tmp$, tmp$_0, tmp$_1, tmp$_2, tmp$_3;
    var metronomeItems = document.getElementsByClassName('metronomeItem');
    tmp$ = until(0, metronomeItems.length);
    tmp$_0 = tmp$.first;
    tmp$_1 = tmp$.last;
    tmp$_2 = tmp$.step;
    for (var index = tmp$_0; index <= tmp$_1; index += tmp$_2) {
      var item = Kotlin.isType(tmp$_3 = metronomeItems[index], HTMLElement) ? tmp$_3 : Kotlin.throwCCE();
      item.className = 'metronomeItem';
      if (itemNumber === index)
        item.className = item.className + ' highlighted';
    }
  };
  function ListenerApp$clearFeedbackItems$lambda(it) {
    return true;
  }
  ListenerApp.prototype.clearFeedbackItems = function () {
    var tmp$;
    removeAll(this.currentFeedbackItems, ListenerApp$clearFeedbackItems$lambda);
    pm_log('Clearing');
    var items = document.getElementsByClassName('feedbackItem');
    while (items.length > 0) {
      var it = Kotlin.isType(tmp$ = items[0], HTMLElement) ? tmp$ : Kotlin.throwCCE();
      var tmp$_0;
      (tmp$_0 = it.parentNode) != null ? tmp$_0.removeChild(it) : null;
    }
  };
  ListenerApp.prototype.addFeedbackItem_775p9r$ = function (feedbackItem) {
    if (this.currentFeedbackItems.indexOf_11rb$(feedbackItem) === -1) {
      this.currentFeedbackItems.add_11rb$(feedbackItem);
    }
    var tmp$ = this.scoreUtil;
    var tmp$_0 = feedbackItem.type;
    var $receiver = feedbackItem.feedbackItemType;
    tmp$.createFeedbackHTMLElement(tmp$_0, Kotlin.kotlin.collections.copyToArray($receiver), feedbackItem.beat);
  };
  ListenerApp.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'ListenerApp',
    interfaces: []
  };
  function DialogParams(imageType, title, message) {
    this.imageType = imageType;
    this.title = title;
    this.message = message;
  }
  DialogParams.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'DialogParams',
    interfaces: []
  };
  DialogParams.prototype.component1 = function () {
    return this.imageType;
  };
  DialogParams.prototype.component2 = function () {
    return this.title;
  };
  DialogParams.prototype.component3 = function () {
    return this.message;
  };
  DialogParams.prototype.copy_6hosri$ = function (imageType, title, message) {
    return new DialogParams(imageType === void 0 ? this.imageType : imageType, title === void 0 ? this.title : title, message === void 0 ? this.message : message);
  };
  DialogParams.prototype.toString = function () {
    return 'DialogParams(imageType=' + Kotlin.toString(this.imageType) + (', title=' + Kotlin.toString(this.title)) + (', message=' + Kotlin.toString(this.message)) + ')';
  };
  DialogParams.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.imageType) | 0;
    result = result * 31 + Kotlin.hashCode(this.title) | 0;
    result = result * 31 + Kotlin.hashCode(this.message) | 0;
    return result;
  };
  DialogParams.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.imageType, other.imageType) && Kotlin.equals(this.title, other.title) && Kotlin.equals(this.message, other.message)))));
  };
  function FlashMessage(type, message) {
    this.type = type;
    this.message = message;
  }
  FlashMessage.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'FlashMessage',
    interfaces: []
  };
  FlashMessage.prototype.component1 = function () {
    return this.type;
  };
  FlashMessage.prototype.component2 = function () {
    return this.message;
  };
  FlashMessage.prototype.copy_puj7f4$ = function (type, message) {
    return new FlashMessage(type === void 0 ? this.type : type, message === void 0 ? this.message : message);
  };
  FlashMessage.prototype.toString = function () {
    return 'FlashMessage(type=' + Kotlin.toString(this.type) + (', message=' + Kotlin.toString(this.message)) + ')';
  };
  FlashMessage.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.type) | 0;
    result = result * 31 + Kotlin.hashCode(this.message) | 0;
    return result;
  };
  FlashMessage.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.type, other.type) && Kotlin.equals(this.message, other.message)))));
  };
  function ConverterOutput(easyScoreInfo) {
    this.easyScoreInfo = easyScoreInfo;
  }
  ConverterOutput.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'ConverterOutput',
    interfaces: []
  };
  ConverterOutput.prototype.component1 = function () {
    return this.easyScoreInfo;
  };
  ConverterOutput.prototype.copy_izl8xn$ = function (easyScoreInfo) {
    return new ConverterOutput(easyScoreInfo === void 0 ? this.easyScoreInfo : easyScoreInfo);
  };
  ConverterOutput.prototype.toString = function () {
    return 'ConverterOutput(easyScoreInfo=' + Kotlin.toString(this.easyScoreInfo) + ')';
  };
  ConverterOutput.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.easyScoreInfo) | 0;
    return result;
  };
  ConverterOutput.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && Kotlin.equals(this.easyScoreInfo, other.easyScoreInfo))));
  };
  function ComparisonFlags(testPitch, testRhythm, testDuration) {
    this.testPitch = testPitch;
    this.testRhythm = testRhythm;
    this.testDuration = testDuration;
  }
  ComparisonFlags.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'ComparisonFlags',
    interfaces: []
  };
  ComparisonFlags.prototype.component1 = function () {
    return this.testPitch;
  };
  ComparisonFlags.prototype.component2 = function () {
    return this.testRhythm;
  };
  ComparisonFlags.prototype.component3 = function () {
    return this.testDuration;
  };
  ComparisonFlags.prototype.copy_ws0pad$ = function (testPitch, testRhythm, testDuration) {
    return new ComparisonFlags(testPitch === void 0 ? this.testPitch : testPitch, testRhythm === void 0 ? this.testRhythm : testRhythm, testDuration === void 0 ? this.testDuration : testDuration);
  };
  ComparisonFlags.prototype.toString = function () {
    return 'ComparisonFlags(testPitch=' + Kotlin.toString(this.testPitch) + (', testRhythm=' + Kotlin.toString(this.testRhythm)) + (', testDuration=' + Kotlin.toString(this.testDuration)) + ')';
  };
  ComparisonFlags.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.testPitch) | 0;
    result = result * 31 + Kotlin.hashCode(this.testRhythm) | 0;
    result = result * 31 + Kotlin.hashCode(this.testDuration) | 0;
    return result;
  };
  ComparisonFlags.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.testPitch, other.testPitch) && Kotlin.equals(this.testRhythm, other.testRhythm) && Kotlin.equals(this.testDuration, other.testDuration)))));
  };
  function AppPreferences(metronomeSound, bpm, transposition, pitch) {
    this.metronomeSound = metronomeSound;
    this.bpm = bpm;
    this.transposition = transposition;
    this.pitch = pitch;
  }
  AppPreferences.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'AppPreferences',
    interfaces: []
  };
  AppPreferences.prototype.component1 = function () {
    return this.metronomeSound;
  };
  AppPreferences.prototype.component2 = function () {
    return this.bpm;
  };
  AppPreferences.prototype.component3 = function () {
    return this.transposition;
  };
  AppPreferences.prototype.component4 = function () {
    return this.pitch;
  };
  AppPreferences.prototype.copy_ho9xxj$ = function (metronomeSound, bpm, transposition, pitch) {
    return new AppPreferences(metronomeSound === void 0 ? this.metronomeSound : metronomeSound, bpm === void 0 ? this.bpm : bpm, transposition === void 0 ? this.transposition : transposition, pitch === void 0 ? this.pitch : pitch);
  };
  AppPreferences.prototype.toString = function () {
    return 'AppPreferences(metronomeSound=' + Kotlin.toString(this.metronomeSound) + (', bpm=' + Kotlin.toString(this.bpm)) + (', transposition=' + Kotlin.toString(this.transposition)) + (', pitch=' + Kotlin.toString(this.pitch)) + ')';
  };
  AppPreferences.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.metronomeSound) | 0;
    result = result * 31 + Kotlin.hashCode(this.bpm) | 0;
    result = result * 31 + Kotlin.hashCode(this.transposition) | 0;
    result = result * 31 + Kotlin.hashCode(this.pitch) | 0;
    return result;
  };
  AppPreferences.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.metronomeSound, other.metronomeSound) && Kotlin.equals(this.bpm, other.bpm) && Kotlin.equals(this.transposition, other.transposition) && Kotlin.equals(this.pitch, other.pitch)))));
  };
  function AppSetupParameters() {
  }
  AppSetupParameters.$metadata$ = {
    kind: Kotlin.Kind.INTERFACE,
    simpleName: 'AppSetupParameters',
    interfaces: []
  };
  function AudioAnalyzer() {
  }
  AudioAnalyzer.$metadata$ = {
    kind: Kotlin.Kind.INTERFACE,
    simpleName: 'AudioAnalyzer',
    interfaces: []
  };
  function EasyScoreCode() {
  }
  EasyScoreCode.$metadata$ = {
    kind: Kotlin.Kind.INTERFACE,
    simpleName: 'EasyScoreCode',
    interfaces: []
  };
  function SimpleJSNoteObject(noteNumber, duration, id) {
    if (id === void 0)
      id = '';
    this.noteNumber = noteNumber;
    this.duration = duration;
    this.id = id;
  }
  SimpleJSNoteObject.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'SimpleJSNoteObject',
    interfaces: []
  };
  SimpleJSNoteObject.prototype.component1 = function () {
    return this.noteNumber;
  };
  SimpleJSNoteObject.prototype.component2 = function () {
    return this.duration;
  };
  SimpleJSNoteObject.prototype.component3 = function () {
    return this.id;
  };
  SimpleJSNoteObject.prototype.copy_oyjwvu$ = function (noteNumber, duration, id) {
    return new SimpleJSNoteObject(noteNumber === void 0 ? this.noteNumber : noteNumber, duration === void 0 ? this.duration : duration, id === void 0 ? this.id : id);
  };
  SimpleJSNoteObject.prototype.toString = function () {
    return 'SimpleJSNoteObject(noteNumber=' + Kotlin.toString(this.noteNumber) + (', duration=' + Kotlin.toString(this.duration)) + (', id=' + Kotlin.toString(this.id)) + ')';
  };
  SimpleJSNoteObject.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.noteNumber) | 0;
    result = result * 31 + Kotlin.hashCode(this.duration) | 0;
    result = result * 31 + Kotlin.hashCode(this.id) | 0;
    return result;
  };
  SimpleJSNoteObject.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.noteNumber, other.noteNumber) && Kotlin.equals(this.duration, other.duration) && Kotlin.equals(this.id, other.id)))));
  };
  function BeatPosition(x, y, page) {
    this.x = x;
    this.y = y;
    this.page = page;
  }
  BeatPosition.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'BeatPosition',
    interfaces: []
  };
  BeatPosition.prototype.component1 = function () {
    return this.x;
  };
  BeatPosition.prototype.component2 = function () {
    return this.y;
  };
  BeatPosition.prototype.component3 = function () {
    return this.page;
  };
  BeatPosition.prototype.copy_syxxoe$ = function (x, y, page) {
    return new BeatPosition(x === void 0 ? this.x : x, y === void 0 ? this.y : y, page === void 0 ? this.page : page);
  };
  BeatPosition.prototype.toString = function () {
    return 'BeatPosition(x=' + Kotlin.toString(this.x) + (', y=' + Kotlin.toString(this.y)) + (', page=' + Kotlin.toString(this.page)) + ')';
  };
  BeatPosition.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.x) | 0;
    result = result * 31 + Kotlin.hashCode(this.y) | 0;
    result = result * 31 + Kotlin.hashCode(this.page) | 0;
    return result;
  };
  BeatPosition.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.x, other.x) && Kotlin.equals(this.y, other.y) && Kotlin.equals(this.page, other.page)))));
  };
  function TunerModes(name, ordinal) {
    Enum.call(this);
    this.name$ = name;
    this.ordinal$ = ordinal;
  }
  function TunerModes_initFields() {
    TunerModes_initFields = function () {
    };
    TunerModes$TUNER_instance = new TunerModes('TUNER', 0);
    TunerModes$STOPWATCH_instance = new TunerModes('STOPWATCH', 1);
  }
  var TunerModes$TUNER_instance;
  function TunerModes$TUNER_getInstance() {
    TunerModes_initFields();
    return TunerModes$TUNER_instance;
  }
  var TunerModes$STOPWATCH_instance;
  function TunerModes$STOPWATCH_getInstance() {
    TunerModes_initFields();
    return TunerModes$STOPWATCH_instance;
  }
  TunerModes.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'TunerModes',
    interfaces: [Enum]
  };
  function TunerModes$values() {
    return [TunerModes$TUNER_getInstance(), TunerModes$STOPWATCH_getInstance()];
  }
  TunerModes.values = TunerModes$values;
  function TunerModes$valueOf(name) {
    switch (name) {
      case 'TUNER':
        return TunerModes$TUNER_getInstance();
      case 'STOPWATCH':
        return TunerModes$STOPWATCH_getInstance();
      default:Kotlin.throwISE('No enum constant com.practicingmusician.TunerModes.' + name);
    }
  }
  TunerModes.valueOf_61zpoe$ = TunerModes$valueOf;
  function TunerParameters(mode, acceptableCentsRange, msToIgnore, noteNameItem, diffItem, stopwatchTimerItem) {
    this.mode = mode;
    this.acceptableCentsRange = acceptableCentsRange;
    this.msToIgnore = msToIgnore;
    this.noteNameItem = noteNameItem;
    this.diffItem = diffItem;
    this.stopwatchTimerItem = stopwatchTimerItem;
  }
  TunerParameters.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'TunerParameters',
    interfaces: []
  };
  TunerParameters.prototype.component1 = function () {
    return this.mode;
  };
  TunerParameters.prototype.component2 = function () {
    return this.acceptableCentsRange;
  };
  TunerParameters.prototype.component3 = function () {
    return this.msToIgnore;
  };
  TunerParameters.prototype.component4 = function () {
    return this.noteNameItem;
  };
  TunerParameters.prototype.component5 = function () {
    return this.diffItem;
  };
  TunerParameters.prototype.component6 = function () {
    return this.stopwatchTimerItem;
  };
  TunerParameters.prototype.copy_944rws$ = function (mode, acceptableCentsRange, msToIgnore, noteNameItem, diffItem, stopwatchTimerItem) {
    return new TunerParameters(mode === void 0 ? this.mode : mode, acceptableCentsRange === void 0 ? this.acceptableCentsRange : acceptableCentsRange, msToIgnore === void 0 ? this.msToIgnore : msToIgnore, noteNameItem === void 0 ? this.noteNameItem : noteNameItem, diffItem === void 0 ? this.diffItem : diffItem, stopwatchTimerItem === void 0 ? this.stopwatchTimerItem : stopwatchTimerItem);
  };
  TunerParameters.prototype.toString = function () {
    return 'TunerParameters(mode=' + Kotlin.toString(this.mode) + (', acceptableCentsRange=' + Kotlin.toString(this.acceptableCentsRange)) + (', msToIgnore=' + Kotlin.toString(this.msToIgnore)) + (', noteNameItem=' + Kotlin.toString(this.noteNameItem)) + (', diffItem=' + Kotlin.toString(this.diffItem)) + (', stopwatchTimerItem=' + Kotlin.toString(this.stopwatchTimerItem)) + ')';
  };
  TunerParameters.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.mode) | 0;
    result = result * 31 + Kotlin.hashCode(this.acceptableCentsRange) | 0;
    result = result * 31 + Kotlin.hashCode(this.msToIgnore) | 0;
    result = result * 31 + Kotlin.hashCode(this.noteNameItem) | 0;
    result = result * 31 + Kotlin.hashCode(this.diffItem) | 0;
    result = result * 31 + Kotlin.hashCode(this.stopwatchTimerItem) | 0;
    return result;
  };
  TunerParameters.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.mode, other.mode) && Kotlin.equals(this.acceptableCentsRange, other.acceptableCentsRange) && Kotlin.equals(this.msToIgnore, other.msToIgnore) && Kotlin.equals(this.noteNameItem, other.noteNameItem) && Kotlin.equals(this.diffItem, other.diffItem) && Kotlin.equals(this.stopwatchTimerItem, other.stopwatchTimerItem)))));
  };
  function PMTuner(parameters) {
    this.parameters = parameters;
    this.state_pxjm2z$_0 = TimeKeeper$TimeKeeperState$Stopped_getInstance();
    this.audioAnalyzer = this.audioAnalyzer;
    this.timekeeper = new TimeKeeper();
    this.longTermNote_pxjm2z$_0 = null;
    this.longTermStartTime = 0.0;
    this.currentNote_pxjm2z$_0 = null;
    this.currentDiff = 0.0;
    this.timerStartTime = 0.0;
    this.timekeeper.steppables.add_11rb$(this);
  }
  Object.defineProperty(PMTuner.prototype, 'state', {
    get: function () {
      return this.state_pxjm2z$_0;
    },
    set: function (state) {
      this.state_pxjm2z$_0 = state;
    }
  });
  Object.defineProperty(PMTuner.prototype, 'longTermNote', {
    get: function () {
      return this.longTermNote_pxjm2z$_0;
    },
    set: function (value) {
      this.longTermStartTime = window.performance.now();
      this.longTermNote_pxjm2z$_0 = value;
    }
  });
  Object.defineProperty(PMTuner.prototype, 'currentNote', {
    get: function () {
      return this.currentNote_pxjm2z$_0;
    },
    set: function (value) {
      var tmp$, tmp$_0, tmp$_1, tmp$_2, tmp$_3, tmp$_4, tmp$_5;
      if (((tmp$_0 = (tmp$ = this.currentNote_pxjm2z$_0) != null ? tmp$.note : null) != null ? tmp$_0.noteNumber : null) !== ((tmp$_1 = value != null ? value.note : null) != null ? tmp$_1.noteNumber : null)) {
        this.timerStartTime = window.performance.now();
      }
       else {
        if (window.performance.now() - this.timerStartTime >= this.parameters.msToIgnore) {
          if (((tmp$_3 = (tmp$_2 = this.currentNote_pxjm2z$_0) != null ? tmp$_2.note : null) != null ? tmp$_3.noteNumber : null) !== ((tmp$_5 = (tmp$_4 = this.longTermNote) != null ? tmp$_4.note : null) != null ? tmp$_5.noteNumber : null)) {
            this.longTermNote = this.currentNote_pxjm2z$_0;
          }
        }
      }
      this.currentNote_pxjm2z$_0 = value;
    }
  });
  PMTuner.prototype.setup = function () {
  };
  PMTuner.prototype.start = function () {
    this.state = TimeKeeper$TimeKeeperState$Running_getInstance();
  };
  PMTuner.prototype.stop = function () {
    this.state = TimeKeeper$TimeKeeperState$Stopped_getInstance();
  };
  PMTuner.prototype.step_zgkg49$ = function (timestamp, timeKeeper) {
    var tmp$, tmp$_0, tmp$_1, tmp$_2;
    var correlatedFrequency = this.audioAnalyzer.updatePitch(timestamp);
    if (Kotlin.equals(correlatedFrequency, undefined)) {
      this.currentNote = null;
      return;
    }
    var noteWithDiff = Note$Companion_getInstance().closestNoteWithDiff_14dthe$(correlatedFrequency);
    this.currentDiff = noteWithDiff.differenceInFreq;
    this.currentNote = noteWithDiff;
    var timeOnCurrentLongNote = (window.performance.now() - this.longTermStartTime) / 1000.0;
    var longTermNoteName = (tmp$_0 = (tmp$ = this.longTermNote) != null ? tmp$.note : null) != null ? tmp$_0.noteName() : null;
    if (longTermNoteName != null) {
      var tmp$_3;
      (tmp$_3 = document.getElementById(this.parameters.noteNameItem)) != null ? (tmp$_3.innerHTML = longTermNoteName) : null;
    }
    if (Kotlin.equals(this.parameters.mode, TunerModes$STOPWATCH_getInstance().name)) {
      (tmp$_1 = document.getElementById(this.parameters.stopwatchTimerItem)) != null ? (tmp$_1.innerHTML = timeOnCurrentLongNote.toString()) : null;
    }
    tmp$_2 = TunerModes$valueOf(this.parameters.mode);
    if (Kotlin.equals(tmp$_2, TunerModes$STOPWATCH_getInstance()))
      this.calculateStopwatchMedals_14dthe$(timeOnCurrentLongNote);
    else if (Kotlin.equals(tmp$_2, TunerModes$TUNER_getInstance()))
      this.calculateTunerMedals_14dthe$(timeOnCurrentLongNote);
  };
  PMTuner.prototype.calculateTunerMedals_14dthe$ = function (timeOnCurrentLongNote) {
  };
  PMTuner.prototype.calculateStopwatchMedals_14dthe$ = function (timeOnCurrentLongNote) {
    if (timeOnCurrentLongNote > 7) {
      console.log('Gold');
      return;
    }
    if (timeOnCurrentLongNote > 5) {
      console.log('Silver');
      return;
    }
    if (timeOnCurrentLongNote > 3) {
      console.log('Bronze');
      return;
    }
  };
  PMTuner.prototype.run = function () {
    this.start();
    this.timekeeper.runForTime = DoubleCompanionObject.MAX_VALUE;
    this.timekeeper.start();
  };
  PMTuner.prototype.setInitialOffset_14dthe$ = function (offset) {
  };
  PMTuner.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'PMTuner',
    interfaces: [TimeKeeperSteppable]
  };
  function UserSettings() {
    UserSettings_instance = this;
    this.transposition = 0;
    this.tempo_fgazsk$_0 = -1.0;
    this.isDefaultTempo_fgazsk$_0 = true;
    this.metronomeAudioOn = true;
    this.pitch = 440.0;
  }
  Object.defineProperty(UserSettings.prototype, 'tempo', {
    get: function () {
      return this.tempo_fgazsk$_0;
    },
    set: function (tempo) {
      this.tempo_fgazsk$_0 = tempo;
    }
  });
  Object.defineProperty(UserSettings.prototype, 'isDefaultTempo', {
    get: function () {
      return this.isDefaultTempo_fgazsk$_0;
    },
    set: function (isDefaultTempo) {
      this.isDefaultTempo_fgazsk$_0 = isDefaultTempo;
    }
  });
  UserSettings.prototype.setTempo_8555vt$ = function (bpm, isDefault) {
    this.tempo = bpm;
    this.isDefaultTempo = isDefault;
  };
  UserSettings.$metadata$ = {
    kind: Kotlin.Kind.OBJECT,
    simpleName: 'UserSettings',
    interfaces: []
  };
  var UserSettings_instance = null;
  function UserSettings_getInstance() {
    if (UserSettings_instance === null) {
      new UserSettings();
    }
    return UserSettings_instance;
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
    pm_log('**** (( Playing...', 6);
    var audio = this.loadedAudio.get_11rb$(key);
    audio != null ? (audio.currentTime = 0) : null;
    audio != null ? audio.play() : null;
  };
  function AudioManager$playAudio$lambda(closure$atTime, closure$audio) {
    return function () {
      pm_log('(( Playing...' + Kotlin.toString(closure$atTime), 6);
      closure$audio != null ? (closure$audio.currentTime = 0) : null;
      return closure$audio != null ? closure$audio.play() : null;
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
      pm_log('Cancelling item... ' + element);
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
    this.prerollLengthInBeats = 4.0;
  }
  ExerciseDefinition.prototype.getLength = function () {
    var beatSize = 1000.0 * 60.0 / listenerApp.getTempo();
    var $receiver = this.notes;
    var destination = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$($receiver, 10));
    var tmp$;
    tmp$ = $receiver.iterator();
    while (tmp$.hasNext()) {
      var item = tmp$.next();
      destination.add_11rb$(item.duration);
    }
    var iterator = destination.iterator();
    if (!iterator.hasNext()) {
      throw new Kotlin.kotlin.UnsupportedOperationException("Empty collection can't be reduced.");
    }
    var accumulator = iterator.next();
    while (iterator.hasNext()) {
      var acc = accumulator;
      accumulator = iterator.next() + acc;
    }
    return accumulator * beatSize;
  };
  ExerciseDefinition.prototype.prerollLength = function () {
    var beatSize = 1000.0 * 60.0 / listenerApp.getTempo();
    return beatSize * this.prerollLengthInBeats;
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
    pm_log('Init');
    this.lastAnalysisTimestamp = DoubleCompanionObject.MIN_VALUE;
  }
  ExerciseManager.prototype.createSteppables = function () {
    this.timeKeeper = new TimeKeeper();
    this.metronome = new Metronome();
    this.pitchTracker = new PitchTracker();
    this.bufferManager = new IncrementalBufferManager();
    this.comparisonEngine = new IncrementalComparisonEngine();
    this.lastAnalysisTimestamp = DoubleCompanionObject.MIN_VALUE;
  };
  function ExerciseManager$setup$lambda$lambda$lambda(closure$results) {
    return function () {
      var percentage = closure$results.correct / closure$results.attempted;
      if (percentage > 0.85) {
        return 'medal-gold-icon';
      }
      if (percentage > 0.7) {
        return 'medal-silver-icon';
      }
      if (percentage > 0.55) {
        return 'medal-bronze-icon';
      }
      return '';
    };
  }
  function ExerciseManager$setup$lambda(this$ExerciseManager) {
    return function (it) {
      var tmp$;
      listenerApp.scoreUtil.changePlayButton('stopped');
      this$ExerciseManager.audioManager.cancelAllAudio();
      this$ExerciseManager.metronome.cancelAllUIUpdates();
      var samplesLength = this$ExerciseManager.pitchTracker.samples.size / 44100.0;
      pm_log('Total samples recorded: ' + Kotlin.toString(this$ExerciseManager.pitchTracker.samples.size) + ' length: ' + Kotlin.toString(samplesLength));
      var notesFromSamplesBuffer = this$ExerciseManager.bufferManager.convertSamplesBufferToNotes_mtnj1d$(this$ExerciseManager.pitchTracker.samples);
      pm_log('Notes: ');
      var tmp$_0;
      tmp$_0 = notesFromSamplesBuffer.iterator();
      while (tmp$_0.hasNext()) {
        var element = tmp$_0.next();
        pm_log('Note: ' + Kotlin.toString(element.note.noteNumber) + ' for ' + Kotlin.toString(element.note.duration) + ' at ' + Kotlin.toString(element.positionInBeats));
      }
      if ((tmp$ = this$ExerciseManager.currentExercise) != null) {
        var this$ExerciseManager_0 = this$ExerciseManager;
        pm_log('Comparing...');
        var results = this$ExerciseManager_0.comparisonEngine.compareNoteArrays_2k3oz0$(listenerApp.exercise.comparisonFlags, tmp$.notes, notesFromSamplesBuffer);
        listenerApp.clearFeedbackItems();
        var tmp$_1;
        tmp$_1 = results.feedbackItems.iterator();
        while (tmp$_1.hasNext()) {
          var element_0 = tmp$_1.next();
          listenerApp.addFeedbackItem_775p9r$(element_0);
        }
        var iconType = ExerciseManager$setup$lambda$lambda$lambda(results)();
        listenerApp.parameters.displaySiteDialog(new DialogParams(iconType, 'Results', 'Overall accuracy: ' + Kotlin.toString(results.correct) + '/' + Kotlin.toString(results.attempted)));
        listenerApp.scoreUtil.displayMedal(iconType);
        if (UserSettings_getInstance().isDefaultTempo) {
          ListenerNetworkManager_getInstance().buildAndSendRequest_fhpv3e$(results);
        }
      }
    };
  }
  ExerciseManager.prototype.setup = function () {
    pm_log('Setup');
    listenerApp.clearFeedbackItems();
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
    listenerApp.scoreUtil.changePlayButton('playing');
  };
  ExerciseManager.prototype.stop = function () {
    this.timeKeeper.stop();
    this.metronome.stop();
    this.pitchTracker.stop();
    listenerApp.scoreUtil.changePlayButton('stopped');
  };
  ExerciseManager.prototype.loadExercise = function () {
    var tmp$;
    pm_log('Loading exericse:');
    var exercise = listenerApp.exercise;
    var exerciseDefinition = new ExerciseDefinition();
    exerciseDefinition.prerollLengthInBeats = exercise.count_off;
    var jsNotes = exercise.notes;
    var destination = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(jsNotes.length);
    var tmp$_0;
    for (tmp$_0 = 0; tmp$_0 !== jsNotes.length; ++tmp$_0) {
      var item = jsNotes[tmp$_0];
      destination.add_11rb$(new Note(item.noteNumber, item.duration));
    }
    exerciseDefinition.notes = toMutableList(destination);
    pm_log('Loaded ' + Kotlin.toString(exerciseDefinition.notes.size) + ' notes');
    pm_log(exerciseDefinition.notes);
    this.currentExercise = exerciseDefinition;
    if ((tmp$ = this.currentExercise) != null) {
      console.log('Testing time sig:');
      console.log(exercise);
      this.metronome.timeSignature = toInt(first(split(exercise.time_signature, [47])));
      this.metronome.prerollBeats = exercise.count_off;
      this.timeKeeper.runForTime = tmp$.getLength() + tmp$.prerollLength() + this.pitchTracker.latencyTime;
      this.pitchTracker.lengthOfPrerollToIgnore = tmp$.prerollLength();
      pm_log('Loaded exercise of length ' + Kotlin.toString(this.timeKeeper.runForTime));
    }
  };
  ExerciseManager.prototype.analyze_14dthe$ = function (timestamp) {
    var tmp$;
    if (timestamp - this.lastAnalysisTimestamp > 200) {
      this.lastAnalysisTimestamp = timestamp;
    }
     else {
      return;
    }
    if ((tmp$ = this.currentExercise) != null) {
      pm_log('Samples length: ' + Kotlin.toString(this.pitchTracker.samples.size));
      var notesFromSamplesBuffer = this.bufferManager.convertSamplesBufferToNotes_mtnj1d$(this.pitchTracker.samples);
      var results = this.comparisonEngine.compareNoteArrays_2k3oz0$(listenerApp.exercise.comparisonFlags, tmp$.notes, notesFromSamplesBuffer, true);
      listenerApp.clearFeedbackItems();
      var tmp$_0;
      tmp$_0 = results.feedbackItems.iterator();
      while (tmp$_0.hasNext()) {
        var element = tmp$_0.next();
        listenerApp.addFeedbackItem_775p9r$(element);
      }
    }
  };
  ExerciseManager.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'ExerciseManager',
    interfaces: [TimeKeeperAnalyzer]
  };
  function FeedbackMetric(name, value) {
    this.name = name;
    this.value = value;
  }
  FeedbackMetric.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'FeedbackMetric',
    interfaces: []
  };
  FeedbackMetric.prototype.component1 = function () {
    return this.name;
  };
  FeedbackMetric.prototype.component2 = function () {
    return this.value;
  };
  FeedbackMetric.prototype.copy_puj7f4$ = function (name, value) {
    return new FeedbackMetric(name === void 0 ? this.name : name, value === void 0 ? this.value : value);
  };
  FeedbackMetric.prototype.toString = function () {
    return 'FeedbackMetric(name=' + Kotlin.toString(this.name) + (', value=' + Kotlin.toString(this.value)) + ')';
  };
  FeedbackMetric.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.name) | 0;
    result = result * 31 + Kotlin.hashCode(this.value) | 0;
    return result;
  };
  FeedbackMetric.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.name, other.name) && Kotlin.equals(this.value, other.value)))));
  };
  function FeedbackType(name, ordinal) {
    Enum.call(this);
    this.name$ = name;
    this.ordinal$ = ordinal;
  }
  function FeedbackType_initFields() {
    FeedbackType_initFields = function () {
    };
    FeedbackType$Correct_instance = new FeedbackType('Correct', 0);
    FeedbackType$Incorrect_instance = new FeedbackType('Incorrect', 1);
    FeedbackType$Missed_instance = new FeedbackType('Missed', 2);
  }
  var FeedbackType$Correct_instance;
  function FeedbackType$Correct_getInstance() {
    FeedbackType_initFields();
    return FeedbackType$Correct_instance;
  }
  var FeedbackType$Incorrect_instance;
  function FeedbackType$Incorrect_getInstance() {
    FeedbackType_initFields();
    return FeedbackType$Incorrect_instance;
  }
  var FeedbackType$Missed_instance;
  function FeedbackType$Missed_getInstance() {
    FeedbackType_initFields();
    return FeedbackType$Missed_instance;
  }
  FeedbackType.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'FeedbackType',
    interfaces: [Enum]
  };
  function FeedbackType$values() {
    return [FeedbackType$Correct_getInstance(), FeedbackType$Incorrect_getInstance(), FeedbackType$Missed_getInstance()];
  }
  FeedbackType.values = FeedbackType$values;
  function FeedbackType$valueOf(name) {
    switch (name) {
      case 'Correct':
        return FeedbackType$Correct_getInstance();
      case 'Incorrect':
        return FeedbackType$Incorrect_getInstance();
      case 'Missed':
        return FeedbackType$Missed_getInstance();
      default:Kotlin.throwISE('No enum constant com.practicingmusician.finals.FeedbackType.' + name);
    }
  }
  FeedbackType.valueOf_61zpoe$ = FeedbackType$valueOf;
  function FeedbackItem(type, beat, feedbackItemType) {
    this.type = type;
    this.beat = beat;
    this.feedbackItemType = feedbackItemType;
  }
  FeedbackItem.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'FeedbackItem',
    interfaces: []
  };
  FeedbackItem.prototype.component1 = function () {
    return this.type;
  };
  FeedbackItem.prototype.component2 = function () {
    return this.beat;
  };
  FeedbackItem.prototype.component3 = function () {
    return this.feedbackItemType;
  };
  FeedbackItem.prototype.copy_4nfbc1$ = function (type, beat, feedbackItemType) {
    return new FeedbackItem(type === void 0 ? this.type : type, beat === void 0 ? this.beat : beat, feedbackItemType === void 0 ? this.feedbackItemType : feedbackItemType);
  };
  FeedbackItem.prototype.toString = function () {
    return 'FeedbackItem(type=' + Kotlin.toString(this.type) + (', beat=' + Kotlin.toString(this.beat)) + (', feedbackItemType=' + Kotlin.toString(this.feedbackItemType)) + ')';
  };
  FeedbackItem.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.type) | 0;
    result = result * 31 + Kotlin.hashCode(this.beat) | 0;
    result = result * 31 + Kotlin.hashCode(this.feedbackItemType) | 0;
    return result;
  };
  FeedbackItem.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.type, other.type) && Kotlin.equals(this.beat, other.beat) && Kotlin.equals(this.feedbackItemType, other.feedbackItemType)))));
  };
  function throwSafeIncorrectSwitch($receiver) {
    if ($receiver.type !== FeedbackType$Missed_getInstance()) {
      $receiver.type = FeedbackType$Incorrect_getInstance();
    }
  }
  function CompareResults(c, a) {
    if (c === void 0)
      c = 0;
    if (a === void 0)
      a = 0;
    this.c = c;
    this.a = a;
    this.correct = this.c;
    this.attempted = this.a;
    this.feedbackItems = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    this.finalResults = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
  }
  CompareResults.prototype.generateResultForDatabase = function () {
    var $receiver = this.finalResults;
    var destination = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$($receiver, 10));
    var tmp$;
    tmp$ = $receiver.iterator();
    while (tmp$.hasNext()) {
      var item = tmp$.next();
      destination.add_11rb$(item.idealPitch - item.actualPitch);
    }
    var pitch = average(destination);
    var $receiver_0 = this.finalResults;
    var destination_0 = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$($receiver_0, 10));
    var tmp$_0;
    tmp$_0 = $receiver_0.iterator();
    while (tmp$_0.hasNext()) {
      var item_0 = tmp$_0.next();
      destination_0.add_11rb$(item_0.idealBeat - item_0.actualBeat);
    }
    var rhythm = average(destination_0);
    var $receiver_1 = this.finalResults;
    var destination_1 = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$($receiver_1, 10));
    var tmp$_1;
    tmp$_1 = $receiver_1.iterator();
    while (tmp$_1.hasNext()) {
      var item_1 = tmp$_1.next();
      destination_1.add_11rb$(item_1.idealDuration - item_1.actualDuration);
    }
    var duration = average(destination_1);
    var tmp$_2 = void 0;
    var tmp$_3 = void 0;
    var tmp$_4 = this.correct;
    var tmp$_5 = this.attempted;
    var $receiver_2 = this.finalResults;
    return new ResultsForDatabase(tmp$_2, tmp$_3, tmp$_4, tmp$_5, pitch, rhythm, duration, Kotlin.kotlin.collections.copyToArray($receiver_2));
  };
  CompareResults.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'CompareResults',
    interfaces: []
  };
  function ResultsForDatabase(userID, exerciseID, correct, attempted, exerciseAveragePitch, exerciseAverageRhythm, exerciseAverageDuration, notePerformances) {
    if (userID === void 0)
      userID = -1;
    if (exerciseID === void 0)
      exerciseID = -1;
    this.userID = userID;
    this.exerciseID = exerciseID;
    this.correct = correct;
    this.attempted = attempted;
    this.exerciseAveragePitch = exerciseAveragePitch;
    this.exerciseAverageRhythm = exerciseAverageRhythm;
    this.exerciseAverageDuration = exerciseAverageDuration;
    this.notePerformances = notePerformances;
  }
  ResultsForDatabase.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'ResultsForDatabase',
    interfaces: []
  };
  ResultsForDatabase.prototype.component1 = function () {
    return this.userID;
  };
  ResultsForDatabase.prototype.component2 = function () {
    return this.exerciseID;
  };
  ResultsForDatabase.prototype.component3 = function () {
    return this.correct;
  };
  ResultsForDatabase.prototype.component4 = function () {
    return this.attempted;
  };
  ResultsForDatabase.prototype.component5 = function () {
    return this.exerciseAveragePitch;
  };
  ResultsForDatabase.prototype.component6 = function () {
    return this.exerciseAverageRhythm;
  };
  ResultsForDatabase.prototype.component7 = function () {
    return this.exerciseAverageDuration;
  };
  ResultsForDatabase.prototype.component8 = function () {
    return this.notePerformances;
  };
  ResultsForDatabase.prototype.copy_sixtfu$ = function (userID, exerciseID, correct, attempted, exerciseAveragePitch, exerciseAverageRhythm, exerciseAverageDuration, notePerformances) {
    return new ResultsForDatabase(userID === void 0 ? this.userID : userID, exerciseID === void 0 ? this.exerciseID : exerciseID, correct === void 0 ? this.correct : correct, attempted === void 0 ? this.attempted : attempted, exerciseAveragePitch === void 0 ? this.exerciseAveragePitch : exerciseAveragePitch, exerciseAverageRhythm === void 0 ? this.exerciseAverageRhythm : exerciseAverageRhythm, exerciseAverageDuration === void 0 ? this.exerciseAverageDuration : exerciseAverageDuration, notePerformances === void 0 ? this.notePerformances : notePerformances);
  };
  ResultsForDatabase.prototype.toString = function () {
    return 'ResultsForDatabase(userID=' + Kotlin.toString(this.userID) + (', exerciseID=' + Kotlin.toString(this.exerciseID)) + (', correct=' + Kotlin.toString(this.correct)) + (', attempted=' + Kotlin.toString(this.attempted)) + (', exerciseAveragePitch=' + Kotlin.toString(this.exerciseAveragePitch)) + (', exerciseAverageRhythm=' + Kotlin.toString(this.exerciseAverageRhythm)) + (', exerciseAverageDuration=' + Kotlin.toString(this.exerciseAverageDuration)) + (', notePerformances=' + Kotlin.toString(this.notePerformances)) + ')';
  };
  ResultsForDatabase.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.userID) | 0;
    result = result * 31 + Kotlin.hashCode(this.exerciseID) | 0;
    result = result * 31 + Kotlin.hashCode(this.correct) | 0;
    result = result * 31 + Kotlin.hashCode(this.attempted) | 0;
    result = result * 31 + Kotlin.hashCode(this.exerciseAveragePitch) | 0;
    result = result * 31 + Kotlin.hashCode(this.exerciseAverageRhythm) | 0;
    result = result * 31 + Kotlin.hashCode(this.exerciseAverageDuration) | 0;
    result = result * 31 + Kotlin.hashCode(this.notePerformances) | 0;
    return result;
  };
  ResultsForDatabase.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.userID, other.userID) && Kotlin.equals(this.exerciseID, other.exerciseID) && Kotlin.equals(this.correct, other.correct) && Kotlin.equals(this.attempted, other.attempted) && Kotlin.equals(this.exerciseAveragePitch, other.exerciseAveragePitch) && Kotlin.equals(this.exerciseAverageRhythm, other.exerciseAverageRhythm) && Kotlin.equals(this.exerciseAverageDuration, other.exerciseAverageDuration) && Kotlin.equals(this.notePerformances, other.notePerformances)))));
  };
  function IndividualNotePerformanceInfo(idealBeat, actualBeat, idealPitch, actualPitch, idealDuration, actualDuration) {
    this.idealBeat = idealBeat;
    this.actualBeat = actualBeat;
    this.idealPitch = idealPitch;
    this.actualPitch = actualPitch;
    this.idealDuration = idealDuration;
    this.actualDuration = actualDuration;
  }
  IndividualNotePerformanceInfo.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'IndividualNotePerformanceInfo',
    interfaces: []
  };
  IndividualNotePerformanceInfo.prototype.component1 = function () {
    return this.idealBeat;
  };
  IndividualNotePerformanceInfo.prototype.component2 = function () {
    return this.actualBeat;
  };
  IndividualNotePerformanceInfo.prototype.component3 = function () {
    return this.idealPitch;
  };
  IndividualNotePerformanceInfo.prototype.component4 = function () {
    return this.actualPitch;
  };
  IndividualNotePerformanceInfo.prototype.component5 = function () {
    return this.idealDuration;
  };
  IndividualNotePerformanceInfo.prototype.component6 = function () {
    return this.actualDuration;
  };
  IndividualNotePerformanceInfo.prototype.copy_15yvbs$ = function (idealBeat, actualBeat, idealPitch, actualPitch, idealDuration, actualDuration) {
    return new IndividualNotePerformanceInfo(idealBeat === void 0 ? this.idealBeat : idealBeat, actualBeat === void 0 ? this.actualBeat : actualBeat, idealPitch === void 0 ? this.idealPitch : idealPitch, actualPitch === void 0 ? this.actualPitch : actualPitch, idealDuration === void 0 ? this.idealDuration : idealDuration, actualDuration === void 0 ? this.actualDuration : actualDuration);
  };
  IndividualNotePerformanceInfo.prototype.toString = function () {
    return 'IndividualNotePerformanceInfo(idealBeat=' + Kotlin.toString(this.idealBeat) + (', actualBeat=' + Kotlin.toString(this.actualBeat)) + (', idealPitch=' + Kotlin.toString(this.idealPitch)) + (', actualPitch=' + Kotlin.toString(this.actualPitch)) + (', idealDuration=' + Kotlin.toString(this.idealDuration)) + (', actualDuration=' + Kotlin.toString(this.actualDuration)) + ')';
  };
  IndividualNotePerformanceInfo.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.idealBeat) | 0;
    result = result * 31 + Kotlin.hashCode(this.actualBeat) | 0;
    result = result * 31 + Kotlin.hashCode(this.idealPitch) | 0;
    result = result * 31 + Kotlin.hashCode(this.actualPitch) | 0;
    result = result * 31 + Kotlin.hashCode(this.idealDuration) | 0;
    result = result * 31 + Kotlin.hashCode(this.actualDuration) | 0;
    return result;
  };
  IndividualNotePerformanceInfo.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.idealBeat, other.idealBeat) && Kotlin.equals(this.actualBeat, other.actualBeat) && Kotlin.equals(this.idealPitch, other.idealPitch) && Kotlin.equals(this.actualPitch, other.actualPitch) && Kotlin.equals(this.idealDuration, other.idealDuration) && Kotlin.equals(this.actualDuration, other.actualDuration)))));
  };
  function NotePlacement(note, positionInBeats) {
    this.note = note;
    this.positionInBeats = positionInBeats;
  }
  NotePlacement.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'NotePlacement',
    interfaces: []
  };
  NotePlacement.prototype.component1 = function () {
    return this.note;
  };
  NotePlacement.prototype.component2 = function () {
    return this.positionInBeats;
  };
  NotePlacement.prototype.copy_uilc1j$ = function (note, positionInBeats) {
    return new NotePlacement(note === void 0 ? this.note : note, positionInBeats === void 0 ? this.positionInBeats : positionInBeats);
  };
  NotePlacement.prototype.toString = function () {
    return 'NotePlacement(note=' + Kotlin.toString(this.note) + (', positionInBeats=' + Kotlin.toString(this.positionInBeats)) + ')';
  };
  NotePlacement.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.note) | 0;
    result = result * 31 + Kotlin.hashCode(this.positionInBeats) | 0;
    return result;
  };
  NotePlacement.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.note, other.note) && Kotlin.equals(this.positionInBeats, other.positionInBeats)))));
  };
  function IncrementalBufferManager() {
    this.sampleRate = 44100.0;
    this.minDurationInBeats = 0.0;
  }
  IncrementalBufferManager.prototype.convertSamplesBufferToNotes_mtnj1d$ = function (samples) {
    this.minDurationInBeats = listenerApp.parameters.minDurationInBeats;
    var positionInSamples = 0;
    var notes = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    if (samples.size === 0) {
      return Kotlin.kotlin.collections.emptyList_287e2$();
    }
    var functionStartTimestamp = window.performance.now();
    var secondsPerBeat = 60.0 / listenerApp.getTempo();
    var samplesSublist = samples.subList_vux9f0$(positionInSamples, samples.size);
    pm_log('Converting how many samples: ' + Kotlin.toString(samplesSublist.size));
    var destination = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$(samplesSublist, 10));
    var tmp$;
    tmp$ = samplesSublist.iterator();
    while (tmp$.hasNext()) {
      var item = tmp$.next();
      destination.add_11rb$(item.lengthInSamples);
    }
    var iterator = destination.iterator();
    if (!iterator.hasNext()) {
      throw new Kotlin.kotlin.UnsupportedOperationException("Empty collection can't be reduced.");
    }
    var accumulator = iterator.next();
    while (iterator.hasNext()) {
      accumulator = accumulator + iterator.next() | 0;
    }
    var lengthOfSamplesInBeats = accumulator / this.sampleRate / secondsPerBeat;
    pm_log('Total length of samples in beats: ' + lengthOfSamplesInBeats);
    var destination_0 = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$(samplesSublist, 10));
    var tmp$_0;
    tmp$_0 = samplesSublist.iterator();
    while (tmp$_0.hasNext()) {
      var item_0 = tmp$_0.next();
      destination_0.add_11rb$(Note$Companion_getInstance().getNoteNumber_14dthe$(item_0.freq));
    }
    var noteNumbers = destination_0;
    var collectedPairs = zip(samplesSublist, noteNumbers);
    pm_log('After mapping and zipping: ' + Kotlin.toString(window.performance.now() - functionStartTimestamp));
    var groups = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    var curList = {v: Kotlin.kotlin.collections.ArrayList_init_ww73n8$()};
    var curNoteNumber = {v: IntCompanionObject.MIN_VALUE};
    var tmp$_1;
    tmp$_1 = collectedPairs.iterator();
    while (tmp$_1.hasNext()) {
      var element = tmp$_1.next();
      if (curNoteNumber.v !== element.second) {
        groups.add_11rb$(curList.v);
        curList.v = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
      }
      curList.v.add_11rb$(element);
      curNoteNumber.v = element.second;
    }
    groups.add_11rb$(curList.v);
    pm_log('After making pairs: ' + Kotlin.toString(window.performance.now() - functionStartTimestamp));
    var destination_1 = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$(collectedPairs, 10));
    var tmp$_2;
    tmp$_2 = collectedPairs.iterator();
    while (tmp$_2.hasNext()) {
      var item_1 = tmp$_2.next();
      destination_1.add_11rb$(item_1.first.lengthInSamples);
    }
    var iterator_0 = destination_1.iterator();
    if (!iterator_0.hasNext()) {
      throw new Kotlin.kotlin.UnsupportedOperationException("Empty collection can't be reduced.");
    }
    var accumulator_0 = iterator_0.next();
    while (iterator_0.hasNext()) {
      accumulator_0 = accumulator_0 + iterator_0.next() | 0;
    }
    var lengthOfCollectedPairsInBeats = accumulator_0 / this.sampleRate / secondsPerBeat;
    pm_log('Total length of collected pairs in beats: ' + lengthOfCollectedPairsInBeats);
    var destination_2 = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    var tmp$_3;
    tmp$_3 = groups.iterator();
    while (tmp$_3.hasNext()) {
      var element_0 = tmp$_3.next();
      var list = element_0;
      Kotlin.kotlin.collections.addAll_ipc267$(destination_2, list);
    }
    var destination_3 = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$(destination_2, 10));
    var tmp$_4;
    tmp$_4 = destination_2.iterator();
    while (tmp$_4.hasNext()) {
      var item_2 = tmp$_4.next();
      destination_3.add_11rb$(item_2.first.lengthInSamples);
    }
    var iterator_1 = destination_3.iterator();
    if (!iterator_1.hasNext()) {
      throw new Kotlin.kotlin.UnsupportedOperationException("Empty collection can't be reduced.");
    }
    var accumulator_1 = iterator_1.next();
    while (iterator_1.hasNext()) {
      accumulator_1 = accumulator_1 + iterator_1.next() | 0;
    }
    var lengthOfGroupsInBeats = accumulator_1 / this.sampleRate / secondsPerBeat;
    pm_log('Total length of groups: ' + lengthOfGroupsInBeats);
    var BOGUS_NOTE_NUMBER = -100;
    var destination_4 = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    var tmp$_5;
    tmp$_5 = groups.iterator();
    while (tmp$_5.hasNext()) {
      var element_1 = tmp$_5.next();
      if (element_1.size !== 0) {
        destination_4.add_11rb$(element_1);
      }
    }
    var destination_5 = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$(destination_4, 10));
    var tmp$_6;
    tmp$_6 = destination_4.iterator();
    while (tmp$_6.hasNext()) {
      var item_3 = tmp$_6.next();
      var tmp$_7 = destination_5.add_11rb$;
      var transform$result;
      var destination_6 = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$(item_3, 10));
      var tmp$_8;
      tmp$_8 = item_3.iterator();
      while (tmp$_8.hasNext()) {
        var item_4 = tmp$_8.next();
        destination_6.add_11rb$(item_4.first.lengthInSamples);
      }
      var iterator_2 = destination_6.iterator();
      if (!iterator_2.hasNext()) {
        throw new Kotlin.kotlin.UnsupportedOperationException("Empty collection can't be reduced.");
      }
      var accumulator_2 = iterator_2.next();
      while (iterator_2.hasNext()) {
        accumulator_2 = accumulator_2 + iterator_2.next() | 0;
      }
      var lengthOfGroupsInSamples = accumulator_2;
      if (lengthOfGroupsInSamples < secondsPerBeat * this.minDurationInBeats * this.sampleRate) {
        var destination_7 = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$(item_3, 10));
        var tmp$_9;
        tmp$_9 = item_3.iterator();
        while (tmp$_9.hasNext()) {
          var item_5 = tmp$_9.next();
          destination_7.add_11rb$(new Pair(item_5.first, BOGUS_NOTE_NUMBER));
        }
        transform$result = destination_7;
      }
       else {
        transform$result = item_3;
      }
      tmp$_7.call(destination_5, transform$result);
    }
    var groupsOfAcceptableLength = destination_5;
    pm_log('Converted into number groups: ' + Kotlin.toString(groupsOfAcceptableLength.size) + ' from original: ' + Kotlin.toString(groups.size), 0);
    var destination_8 = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    var tmp$_10;
    tmp$_10 = groupsOfAcceptableLength.iterator();
    while (tmp$_10.hasNext()) {
      var element_2 = tmp$_10.next();
      var list_0 = element_2;
      Kotlin.kotlin.collections.addAll_ipc267$(destination_8, list_0);
    }
    var flattened = destination_8;
    var destination_9 = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$(flattened, 10));
    var tmp$_11;
    tmp$_11 = flattened.iterator();
    while (tmp$_11.hasNext()) {
      var item_6 = tmp$_11.next();
      destination_9.add_11rb$(item_6.first.lengthInSamples);
    }
    var iterator_3 = destination_9.iterator();
    if (!iterator_3.hasNext()) {
      throw new Kotlin.kotlin.UnsupportedOperationException("Empty collection can't be reduced.");
    }
    var accumulator_3 = iterator_3.next();
    while (iterator_3.hasNext()) {
      accumulator_3 = accumulator_3 + iterator_3.next() | 0;
    }
    var lengthOfAcceptableGroupsInBeats = accumulator_3 / this.sampleRate / secondsPerBeat;
    pm_log('Total length of acceptable groups pairs in beats: ' + lengthOfAcceptableGroupsInBeats);
    curNoteNumber.v = -1;
    var curLengthInSamples = {v: 0};
    var avgFreq = {v: 0.0};
    var noteList = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    var tmp$_12;
    tmp$_12 = flattened.iterator();
    while (tmp$_12.hasNext()) {
      var element_3 = tmp$_12.next();
      if (curNoteNumber.v !== element_3.second) {
        var note = new Note(curNoteNumber.v, curLengthInSamples.v / (secondsPerBeat * this.sampleRate));
        avgFreq.v = avgFreq.v / curLengthInSamples.v;
        note.avgFreq = avgFreq.v;
        noteList.add_11rb$(note);
        curLengthInSamples.v = 0;
        avgFreq.v = 0.0;
      }
      curLengthInSamples.v = curLengthInSamples.v + element_3.first.lengthInSamples | 0;
      avgFreq.v += element_3.first.freq * element_3.first.lengthInSamples;
      curNoteNumber.v = element_3.second;
    }
    var lastNote = new Note(curNoteNumber.v, curLengthInSamples.v / (secondsPerBeat * this.sampleRate));
    avgFreq.v = avgFreq.v / curLengthInSamples.v;
    lastNote.avgFreq = avgFreq.v;
    noteList.add_11rb$(lastNote);
    var destination_10 = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    var tmp$_13;
    tmp$_13 = noteList.iterator();
    while (tmp$_13.hasNext()) {
      var element_4 = tmp$_13.next();
      if (element_4.duration !== 0.0) {
        destination_10.add_11rb$(element_4);
      }
    }
    notes.addAll_brywnq$(destination_10);
    pm_log('Notes after combining process: (from original: ' + Kotlin.toString(flattened.size), 0);
    pm_log('Turned samples into these notes (before purging): ', 0);
    var tmp$_14;
    tmp$_14 = noteList.iterator();
    while (tmp$_14.hasNext()) {
      var element_5 = tmp$_14.next();
      pm_log('Note: ' + Kotlin.toString(element_5.noteNumber) + ' for ' + Kotlin.toString(element_5.duration), 0);
    }
    var notesToRemove = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    var destination_11 = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$(notes, 10));
    var tmp$_15, tmp$_0_0;
    var index = 0;
    tmp$_15 = notes.iterator();
    while (tmp$_15.hasNext()) {
      var item_7 = tmp$_15.next();
      var tmp$_16 = destination_11.add_11rb$;
      var index_0 = (tmp$_0_0 = index, index = tmp$_0_0 + 1 | 0, tmp$_0_0);
      var transform$result_0;
      transform$break: do {
        if (item_7.noteNumber === BOGUS_NOTE_NUMBER) {
          if (index_0 === 0)
            break transform$break;
          var previousItem = notes.get_za3lpa$(index_0 - 1 | 0);
          previousItem.duration = previousItem.duration + item_7.duration;
          notesToRemove.add_11rb$(item_7);
        }
      }
       while (false);
      tmp$_16.call(destination_11, transform$result_0);
    }
    pm_log('Removing ' + Kotlin.toString(notesToRemove.size), 0);
    notes.removeAll_brywnq$(notesToRemove);
    var pos = {v: 0.0};
    var destination_12 = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$(notes, 10));
    var tmp$_17;
    tmp$_17 = notes.iterator();
    while (tmp$_17.hasNext()) {
      var item_8 = tmp$_17.next();
      var tmp$_18 = destination_12.add_11rb$;
      var np = new NotePlacement(item_8, pos.v);
      pos.v += item_8.duration;
      tmp$_18.call(destination_12, np);
    }
    var destination_13 = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    var tmp$_19;
    tmp$_19 = destination_12.iterator();
    while (tmp$_19.hasNext()) {
      var element_6 = tmp$_19.next();
      if (element_6.note.noteNumber !== BOGUS_NOTE_NUMBER) {
        destination_13.add_11rb$(element_6);
      }
    }
    var notePlacements = destination_13;
    pm_log('Turned samples into these notes (after purging): ', 0);
    var tmp$_20;
    tmp$_20 = notePlacements.iterator();
    while (tmp$_20.hasNext()) {
      var element_7 = tmp$_20.next();
      pm_log('Note: ' + Kotlin.toString(element_7.note.noteNumber) + ' for ' + Kotlin.toString(element_7.note.duration) + ' at ' + Kotlin.toString(element_7.positionInBeats * 100.0 / 100.0), 0);
    }
    pm_log('Difference after bogus purge: ' + Kotlin.toString(noteList.size - notePlacements.size | 0), 0);
    var destination_14 = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$(notes, 10));
    var tmp$_21;
    tmp$_21 = notes.iterator();
    while (tmp$_21.hasNext()) {
      var item_9 = tmp$_21.next();
      destination_14.add_11rb$(item_9.duration);
    }
    var iterator_4 = destination_14.iterator();
    if (!iterator_4.hasNext()) {
      throw new Kotlin.kotlin.UnsupportedOperationException("Empty collection can't be reduced.");
    }
    var accumulator_4 = iterator_4.next();
    while (iterator_4.hasNext()) {
      accumulator_4 = accumulator_4 + iterator_4.next();
    }
    var lengthOfNotesInBeats = accumulator_4;
    pm_log('Length of notes in beats: ' + lengthOfNotesInBeats);
    var functionEndTimestamp = window.performance.now();
    pm_log('Function total time: ' + Kotlin.toString(functionEndTimestamp - functionStartTimestamp));
    return notePlacements;
  };
  IncrementalBufferManager.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'IncrementalBufferManager',
    interfaces: []
  };
  function IncrementalComparisonEngine() {
    this.largestDurationRatioDifference = 0.0;
    this.largestBeatDifference = 0.0;
  }
  IncrementalComparisonEngine.prototype.compareNoteArrays_2k3oz0$ = function (comparisonFlags, ideal, toTest, isCurrentlyRunning, testBeginningBeat, testEndingBeat) {
    if (isCurrentlyRunning === void 0)
      isCurrentlyRunning = false;
    if (testBeginningBeat === void 0)
      testBeginningBeat = 0.0;
    if (testEndingBeat === void 0)
      testEndingBeat = DoubleCompanionObject.MAX_VALUE;
    var tmp$, tmp$_0, tmp$_1, tmp$_2, tmp$_3, tmp$_4, tmp$_5, tmp$_6, tmp$_7, tmp$_8, tmp$_9;
    this.largestDurationRatioDifference = listenerApp.parameters.largestDurationRatioDifference;
    this.largestBeatDifference = listenerApp.parameters.largestBeatDifference;
    var results = new CompareResults();
    var curBeatPosition = 0.0;
    var lastTestedIndexInTest = -1;
    var doNotTestBeyond = 0.0;
    if (toTest.size > 1) {
      doNotTestBeyond = toTest.get_za3lpa$(toTest.size - 2 | 0).positionInBeats;
    }
    var tmp$_10 = !isCurrentlyRunning;
    if (tmp$_10) {
      tmp$_10 = toTest.size > 0;
    }
    if (tmp$_10) {
      doNotTestBeyond = last(toTest).positionInBeats + last(toTest).note.duration;
    }
    if (testEndingBeat < doNotTestBeyond) {
      doNotTestBeyond = testEndingBeat;
    }
    var functionStartTimestamp = window.performance.now();
    tmp$ = until(0, ideal.size);
    tmp$_0 = tmp$.first;
    tmp$_1 = tmp$.last;
    tmp$_2 = tmp$.step;
    for (var index = tmp$_0; index <= tmp$_1; index += tmp$_2) {
      var idealValue = ideal.get_za3lpa$(index);
      var indexOnToTest = -1;
      var toTestBeatPositionAtIndexToTest = 0.0;
      var toTestBeatPosition;
      var diffFromIdealBeatPosition = DoubleCompanionObject.MAX_VALUE;
      tmp$_3 = until(0, toTest.size);
      tmp$_4 = tmp$_3.first;
      tmp$_5 = tmp$_3.last;
      tmp$_6 = tmp$_3.step;
      for (var i = tmp$_4; i <= tmp$_5; i += tmp$_6) {
        var item = toTest.get_za3lpa$(i);
        toTestBeatPosition = item.positionInBeats;
        var diff = Math.abs(curBeatPosition - toTestBeatPosition);
        if (diff < diffFromIdealBeatPosition) {
          indexOnToTest = i;
          toTestBeatPositionAtIndexToTest = toTestBeatPosition;
          diffFromIdealBeatPosition = diff;
        }
      }
      if (curBeatPosition >= doNotTestBeyond) {
        pm_log('Too far (' + curBeatPosition + ' vs ' + doNotTestBeyond + ')', 0);
        break;
      }
      if (indexOnToTest <= lastTestedIndexInTest) {
        pm_log('Already tested here...... ' + indexOnToTest + ' <= ' + lastTestedIndexInTest);
      }
      lastTestedIndexInTest = indexOnToTest;
      pm_log('Going to compare ideal index ' + index + ' to test index ' + indexOnToTest);
      var feedbackItemTypes = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
      var feedbackItem = new FeedbackItem(FeedbackType$Correct_getInstance(), curBeatPosition, feedbackItemTypes);
      results.feedbackItems.add_11rb$(feedbackItem);
      if (indexOnToTest === -1) {
        pm_log('No index found to test', 10);
        continue;
      }
      results.attempted = results.attempted + 1 | 0;
      var idealItem = idealValue;
      var testItem = toTest.get_za3lpa$(indexOnToTest);
      pm_log('Durations : ' + Kotlin.toString(idealItem.duration) + ' | ' + Kotlin.toString(testItem.note.duration), 0);
      if (comparisonFlags.testDuration) {
        var durationDifferenceRatio = testItem.note.duration / idealItem.duration;
        var durationDifferenceRatioRounded = Math.round(durationDifferenceRatio * 100.0) / 100.0;
        if (durationDifferenceRatio < listenerApp.parameters.allowableDurationRatio) {
          pm_log('Test subject too short by ' + Kotlin.toString(durationDifferenceRatioRounded), 0);
          feedbackItemTypes.add_11rb$(new FeedbackMetric('duration', '' + Kotlin.toString(durationDifferenceRatioRounded)));
          throwSafeIncorrectSwitch(feedbackItem);
        }
         else if (durationDifferenceRatio > 1.0 / listenerApp.parameters.allowableDurationRatio) {
          pm_log('Test subject too long by ' + Kotlin.toString(durationDifferenceRatioRounded), 0);
          feedbackItemTypes.add_11rb$(new FeedbackMetric('duration', '' + Kotlin.toString(Math.abs(durationDifferenceRatioRounded))));
          throwSafeIncorrectSwitch(feedbackItem);
        }
         else {
          pm_log('PERFECT DURATION', 0);
        }
        if (durationDifferenceRatio < this.largestDurationRatioDifference || durationDifferenceRatio > 1.0 / this.largestDurationRatioDifference) {
          feedbackItem.type = FeedbackType$Missed_getInstance();
        }
      }
      pm_log('Starting points : ' + Kotlin.toString(curBeatPosition) + ' | ' + Kotlin.toString(toTestBeatPositionAtIndexToTest), 10);
      var distanceAway = -(curBeatPosition - toTestBeatPositionAtIndexToTest);
      var distanceAwayRounded = Math.round(distanceAway * 100.0) / 100.0;
      if (comparisonFlags.testRhythm) {
        if (distanceAway > listenerApp.parameters.allowableRhythmMargin) {
          pm_log('Test subject rushing');
          feedbackItemTypes.add_11rb$(new FeedbackMetric('speed', '+' + Kotlin.toString(distanceAwayRounded)));
          throwSafeIncorrectSwitch(feedbackItem);
        }
         else if (distanceAway < -listenerApp.parameters.allowableRhythmMargin) {
          pm_log('Test subject dragging');
          feedbackItemTypes.add_11rb$(new FeedbackMetric('speed', '' + Kotlin.toString(distanceAwayRounded)));
          throwSafeIncorrectSwitch(feedbackItem);
        }
         else {
          pm_log('PERFECT');
        }
        if (Math.abs(distanceAway) > this.largestBeatDifference) {
          feedbackItem.type = FeedbackType$Missed_getInstance();
        }
      }
      pm_log('Notes : ' + Kotlin.toString(idealItem.noteNumber) + ' | ' + Kotlin.toString(testItem.note.noteNumber));
      if (testItem.note.noteNumber === (idealItem.noteNumber + 12 | 0) || testItem.note.noteNumber === (idealItem.noteNumber - 12 | 0)) {
        var n = new Note(idealItem.noteNumber, testItem.note.duration);
        if (testItem.note.noteNumber < idealItem.noteNumber) {
          n.avgFreq = (tmp$_7 = testItem.note.avgFreq) != null ? tmp$_7 * 2 : null;
        }
         else {
          n.avgFreq = (tmp$_8 = testItem.note.avgFreq) != null ? tmp$_8 / 2 : null;
        }
        testItem = new NotePlacement(n, testItem.positionInBeats);
      }
      pm_log('Pitch : ' + Kotlin.toString(idealItem.getFrequency()) + ' | ' + Kotlin.toString(testItem.note.getFrequency()), 0);
      pm_log('Avg freq of test item: ' + Kotlin.toString(testItem.note.avgFreq));
      var avgFreqOfTestItem = testItem.note.avgFreq;
      if (avgFreqOfTestItem == null) {
        feedbackItem.type = FeedbackType$Missed_getInstance();
      }
      if (testItem.note.noteNumber === -1 && idealItem.noteNumber !== -1 || (testItem.note.noteNumber !== -1 && idealItem.noteNumber === -1)) {
        console.log('MISMATCHED!');
        if (idealItem.noteNumber !== -1) {
          feedbackItemTypes.add_11rb$(new FeedbackMetric('pitch', 'Not played'));
        }
         else {
          feedbackItemTypes.add_11rb$(new FeedbackMetric('duration', 'rest'));
        }
        throwSafeIncorrectSwitch(feedbackItem);
        feedbackItem.type = FeedbackType$Missed_getInstance();
      }
      if (avgFreqOfTestItem != null && avgFreqOfTestItem !== -1.0 && comparisonFlags.testPitch) {
        if (idealItem.noteNumber !== testItem.note.noteNumber) {
          pm_log('WRONG NOTE *&*&*&*&*&*&*&*');
          feedbackItem.type = FeedbackType$Missed_getInstance();
        }
        var idealItemFrequency = idealItem.getFrequency();
        var noteAboveFrequency = Note$Companion_getInstance().getFrequencyForNoteNumber_za3lpa$(idealItem.noteNumber + 1 | 0);
        var noteBelowFrequency = Note$Companion_getInstance().getFrequencyForNoteNumber_za3lpa$(idealItem.noteNumber - 1 | 0);
        if (avgFreqOfTestItem - idealItemFrequency > 0) {
          var distanceInHz = noteAboveFrequency - idealItemFrequency;
          var distanceInCents = (avgFreqOfTestItem - idealItemFrequency) / distanceInHz * 100.0;
          pm_log('Sharp by ' + distanceInHz + ' (' + distanceInCents + ' cents)');
          if (distanceInCents > listenerApp.parameters.allowableCentsMargin) {
            pm_log('Test subject sharp');
            feedbackItemTypes.add_11rb$(new FeedbackMetric('pitch', '+' + Kotlin.toString(distanceInHz | 0)));
            throwSafeIncorrectSwitch(feedbackItem);
          }
        }
         else if (avgFreqOfTestItem - idealItemFrequency < 0) {
          var distanceInHz_0 = idealItemFrequency - noteBelowFrequency;
          var distanceInCents_0 = (idealItemFrequency - avgFreqOfTestItem) / distanceInHz_0 * 100.0;
          pm_log('Flat by ' + distanceInHz_0 + ' (' + distanceInCents_0 + ' cents)');
          if (distanceInCents_0 > listenerApp.parameters.allowableCentsMargin) {
            pm_log('Test subject flat');
            feedbackItemTypes.add_11rb$(new FeedbackMetric('pitch', '-' + Kotlin.toString(distanceInHz_0 | 0)));
            throwSafeIncorrectSwitch(feedbackItem);
          }
        }
         else {
          pm_log('PERFECT');
        }
      }
      if (feedbackItem.type === FeedbackType$Correct_getInstance()) {
        results.correct = results.correct + 1 | 0;
      }
      curBeatPosition += idealValue.duration;
      var notePerformance = new IndividualNotePerformanceInfo(curBeatPosition, toTestBeatPositionAtIndexToTest, idealItem.getFrequency(), (tmp$_9 = testItem.note.avgFreq) != null ? tmp$_9 : -1.0, idealItem.duration, testItem.note.duration);
      results.finalResults.add_11rb$(notePerformance);
    }
    var functionEndTimestamp = window.performance.now();
    pm_log('Function total time: ' + Kotlin.toString(functionEndTimestamp - functionStartTimestamp));
    return results;
  };
  IncrementalComparisonEngine.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'IncrementalComparisonEngine',
    interfaces: []
  };
  function ListenerNetworkManager() {
    ListenerNetworkManager_instance = this;
    this.mapTest = mapOf([to('test', 1), to('test2', 4)]);
  }
  ListenerNetworkManager.prototype.makePostRequest_l6nar7$ = function (urlString, data) {
    networkRequest(urlString, data);
  };
  ListenerNetworkManager.prototype.buildAndSendRequest_fhpv3e$ = function (results) {
    var dbResults = results.generateResultForDatabase();
    dbResults.userID = listenerApp.parameters.userID;
    dbResults.exerciseID = listenerApp.parameters.exerciseID;
    var performanceWrapper = new PerformanceWrapper(dbResults);
    ListenerNetworkManager_getInstance().makePostRequest_l6nar7$(listenerApp.parameters.databaseEndpoint, performanceWrapper);
  };
  ListenerNetworkManager.$metadata$ = {
    kind: Kotlin.Kind.OBJECT,
    simpleName: 'ListenerNetworkManager',
    interfaces: []
  };
  var ListenerNetworkManager_instance = null;
  function ListenerNetworkManager_getInstance() {
    if (ListenerNetworkManager_instance === null) {
      new ListenerNetworkManager();
    }
    return ListenerNetworkManager_instance;
  }
  function PerformanceWrapper(performance) {
    this.performance = performance;
  }
  PerformanceWrapper.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'PerformanceWrapper',
    interfaces: []
  };
  PerformanceWrapper.prototype.component1 = function () {
    return this.performance;
  };
  PerformanceWrapper.prototype.copy_w32kyh$ = function (performance) {
    return new PerformanceWrapper(performance === void 0 ? this.performance : performance);
  };
  PerformanceWrapper.prototype.toString = function () {
    return 'PerformanceWrapper(performance=' + Kotlin.toString(this.performance) + ')';
  };
  PerformanceWrapper.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.performance) | 0;
    return result;
  };
  PerformanceWrapper.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && Kotlin.equals(this.performance, other.performance))));
  };
  function EasyScoreUtil_Kotlin() {
    this.scorePositionInitialX = 60;
    this.scorePositionInitialY = 20;
    this.scorePositionX = 0;
    this.scorePositionY = 0;
    this.positionInLine = 0;
    this.scorePositionCurrentLine = 0;
    this.measureCounter = 0;
    this.exercise = null;
    this.vf = null;
    this.registry = null;
    this.score = null;
    this.voice = null;
    this.beam = null;
    this.contentScaleFactor = 1.0;
    this.useScaling = true;
    this.assumedCanvasWidth = 1024;
    this.barWidth = 200;
    this.barHeight = 160;
    this.firstBarAddition = 40;
    this.barsPerLine = 4;
    this.noteIDNumber = 0;
    this.systems = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
  }
  EasyScoreUtil_Kotlin.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'EasyScoreUtil_Kotlin',
    interfaces: []
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
    return Note$Companion_getInstance().getFrequencyForNoteNumber_za3lpa$(this.noteNumber);
  };
  function Note$noteName$lambda(value) {
    if (value < 0) {
      return (value + 12 | 0) % 12;
    }
     else {
      return value % 12;
    }
  }
  Note.prototype.noteName = function () {
    if (this.noteNumber === -1) {
      return 'NaN';
    }
    var baseNote = Note$noteName$lambda(this.noteNumber);
    if (baseNote >= Note$Companion_getInstance().noteNames.length) {
      console.warn('Invalid note');
      return 'NaN';
    }
    return Note$Companion_getInstance().noteNames[baseNote];
  };
  function Note$Companion() {
    Note$Companion_instance = this;
    this.noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  }
  Note$Companion.prototype.getNoteNumber_14dthe$ = function (frequency) {
    if (frequency === -1.0)
      return -1;
    return this.closestNoteToFrequency_14dthe$(frequency);
  };
  Note$Companion.prototype.getFrequencyForNoteNumber_za3lpa$ = function (noteNumber) {
    if (noteNumber === -1) {
      return -1.0;
    }
    var A440_NoteNumber = 69.0;
    var equalTemperamentPitch = UserSettings_getInstance().pitch * Math.pow(2.0, (noteNumber - A440_NoteNumber) / 12.0);
    return equalTemperamentPitch;
  };
  Note$Companion.prototype.createAllNotes = function () {
    var tmp$, tmp$_0, tmp$_1, tmp$_2;
    ALL_NOTES = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    tmp$ = until(30, 110);
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
    if (closestNoteValue === 30) {
      console.log('RETURNING 30 for ' + Kotlin.toString(frequency));
    }
    return closestNoteValue;
  };
  function Note$Companion$NoteWithDiff(note, differenceInFreq, differenceInCents) {
    this.note = note;
    this.differenceInFreq = differenceInFreq;
    this.differenceInCents = differenceInCents;
  }
  Note$Companion$NoteWithDiff.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'NoteWithDiff',
    interfaces: []
  };
  Note$Companion$NoteWithDiff.prototype.component1 = function () {
    return this.note;
  };
  Note$Companion$NoteWithDiff.prototype.component2 = function () {
    return this.differenceInFreq;
  };
  Note$Companion$NoteWithDiff.prototype.component3 = function () {
    return this.differenceInCents;
  };
  Note$Companion$NoteWithDiff.prototype.copy_g3epcr$ = function (note, differenceInFreq, differenceInCents) {
    return new Note$Companion$NoteWithDiff(note === void 0 ? this.note : note, differenceInFreq === void 0 ? this.differenceInFreq : differenceInFreq, differenceInCents === void 0 ? this.differenceInCents : differenceInCents);
  };
  Note$Companion$NoteWithDiff.prototype.toString = function () {
    return 'NoteWithDiff(note=' + Kotlin.toString(this.note) + (', differenceInFreq=' + Kotlin.toString(this.differenceInFreq)) + (', differenceInCents=' + Kotlin.toString(this.differenceInCents)) + ')';
  };
  Note$Companion$NoteWithDiff.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.note) | 0;
    result = result * 31 + Kotlin.hashCode(this.differenceInFreq) | 0;
    result = result * 31 + Kotlin.hashCode(this.differenceInCents) | 0;
    return result;
  };
  Note$Companion$NoteWithDiff.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.note, other.note) && Kotlin.equals(this.differenceInFreq, other.differenceInFreq) && Kotlin.equals(this.differenceInCents, other.differenceInCents)))));
  };
  Note$Companion.prototype.closestNoteWithDiff_14dthe$ = function (frequency) {
    var tmp$;
    var closestFrequency = DoubleCompanionObject.MAX_VALUE;
    var closestNote = new Note(-1, 0.0);
    var distanceInCents = 0.0;
    if (frequency < ALL_NOTES.get_za3lpa$(0).getFrequency() * 0.67 || frequency > last(ALL_NOTES).getFrequency() * 1.3) {
      return new Note$Companion$NoteWithDiff(closestNote, closestFrequency, distanceInCents);
    }
    tmp$ = ALL_NOTES.iterator();
    while (tmp$.hasNext()) {
      var note = tmp$.next();
      var diff = Math.abs(note.getFrequency() - frequency);
      if (diff < closestFrequency) {
        closestFrequency = diff;
        closestNote = note;
      }
       else if (diff > closestFrequency) {
        break;
      }
    }
    var idealItemFrequency = closestNote.getFrequency();
    var noteAboveFrequency = Note$Companion_getInstance().getFrequencyForNoteNumber_za3lpa$(closestNote.noteNumber + 1 | 0);
    var noteBelowFrequency = Note$Companion_getInstance().getFrequencyForNoteNumber_za3lpa$(closestNote.noteNumber - 1 | 0);
    if (frequency - idealItemFrequency > 0) {
      var distanceInHz = noteAboveFrequency - idealItemFrequency;
      distanceInCents = (frequency - idealItemFrequency) / distanceInHz * 100.0;
    }
     else if (frequency - idealItemFrequency < 0) {
      var distanceInHz_0 = idealItemFrequency - noteBelowFrequency;
      distanceInCents = (idealItemFrequency - frequency) / distanceInHz_0 * 100.0;
    }
    return new Note$Companion$NoteWithDiff(closestNote, closestFrequency, distanceInCents);
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
    interfaces: []
  };
  var ALL_NOTES;
  function Metronome() {
    this.downbeatAudioKey = 'downbeatSound';
    this.beatAudioKey = 'beatSound';
    this.audioManager = this.audioManager;
    this.state_t08vao$_0 = TimeKeeper$TimeKeeperState$Stopped_getInstance();
    this.timeSignature = 4;
    this.prerollBeats = 4.0;
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
    this.audioManager.loadAudioFile_puj7f4$(listenerApp.parameters.url + listenerApp.parameters.audioAssetPath + 'Cowbell.wav', this.downbeatAudioKey);
    this.audioManager.loadAudioFile_puj7f4$(listenerApp.parameters.url + listenerApp.parameters.audioAssetPath + 'Woodblock.wav', this.beatAudioKey);
  };
  Metronome.prototype.start = function () {
    this.state = TimeKeeper$TimeKeeperState$Running_getInstance();
  };
  Metronome.prototype.stop = function () {
    this.state = TimeKeeper$TimeKeeperState$Stopped_getInstance();
  };
  Metronome.prototype.setInitialOffset_14dthe$ = function (offset) {
    var beatSize = 1000.0 * 60.0 / listenerApp.getTempo();
    this.lastBeatOccuredAt = offset - beatSize;
  };
  Metronome.prototype.step_zgkg49$ = function (timestamp, timeKeeper) {
    var beatSize = 1000.0 * 60.0 / listenerApp.getTempo();
    if (timeKeeper.runForTime - timestamp < beatSize / 2) {
      pm_log('Less than beat size..');
      return;
    }
    if (this.lastBeatOccuredAt === -1.0) {
      this.lastBeatOccuredAt = timestamp - beatSize;
    }
    var nextBeatTime = this.lastBeatOccuredAt + beatSize;
    var absoluteBeatPosition = timestamp / beatSize;
    this.updateIndicatorUI_14dthe$(absoluteBeatPosition);
    if (timestamp >= nextBeatTime) {
      if (UserSettings_getInstance().metronomeAudioOn) {
        if (this.currentBeat % this.timeSignature === 0) {
          this.audioManager.playAudioNow_61zpoe$(this.downbeatAudioKey);
        }
         else {
          this.audioManager.playAudioNow_61zpoe$(this.beatAudioKey);
        }
      }
      this.lastBeatOccuredAt = nextBeatTime;
      this.updateMetronomeUI_za3lpa$(this.currentBeat);
      this.currentBeat = this.currentBeat + 1 | 0;
    }
  };
  function Metronome$cancelAllUIUpdates$lambda(it) {
    return true;
  }
  Metronome.prototype.cancelAllUIUpdates = function () {
    var tmp$;
    tmp$ = reversed(this.timeoutKeys).iterator();
    while (tmp$.hasNext()) {
      var element = tmp$.next();
      pm_log('Cancelling item... ' + element);
      window.clearTimeout(element);
    }
    removeAll(this.timeoutKeys, Metronome$cancelAllUIUpdates$lambda);
  };
  Metronome.prototype.updateIndicatorUI_14dthe$ = function (beat) {
    listenerApp.moveToPosition_14dthe$(beat - this.prerollBeats);
  };
  Metronome.prototype.updateMetronomeUI_za3lpa$ = function (beat) {
    listenerApp.highlightMetronomeItem_za3lpa$(beat % this.timeSignature);
  };
  Metronome.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'Metronome',
    interfaces: [TimeKeeperSteppable]
  };
  var buflen;
  function SampleCollection(freq, lengthInSamples, timestampInSamples) {
    this.freq = freq;
    this.lengthInSamples = lengthInSamples;
    this.timestampInSamples = timestampInSamples;
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
  SampleCollection.prototype.component3 = function () {
    return this.timestampInSamples;
  };
  SampleCollection.prototype.copy_mqu1mq$ = function (freq, lengthInSamples, timestampInSamples) {
    return new SampleCollection(freq === void 0 ? this.freq : freq, lengthInSamples === void 0 ? this.lengthInSamples : lengthInSamples, timestampInSamples === void 0 ? this.timestampInSamples : timestampInSamples);
  };
  SampleCollection.prototype.toString = function () {
    return 'SampleCollection(freq=' + Kotlin.toString(this.freq) + (', lengthInSamples=' + Kotlin.toString(this.lengthInSamples)) + (', timestampInSamples=' + Kotlin.toString(this.timestampInSamples)) + ')';
  };
  SampleCollection.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.freq) | 0;
    result = result * 31 + Kotlin.hashCode(this.lengthInSamples) | 0;
    result = result * 31 + Kotlin.hashCode(this.timestampInSamples) | 0;
    return result;
  };
  SampleCollection.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.freq, other.freq) && Kotlin.equals(this.lengthInSamples, other.lengthInSamples) && Kotlin.equals(this.timestampInSamples, other.timestampInSamples)))));
  };
  function PitchTracker() {
    this.sampleRate = 44100.0;
    this.lengthOfPrerollToIgnore = 0.0;
    this.latencyTime = 180;
    this.samples = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    this.samplesRecorded = 0;
    this.state_j0gsl6$_0 = TimeKeeper$TimeKeeperState$Stopped_getInstance();
  }
  PitchTracker.prototype.setup = function () {
  };
  PitchTracker.prototype.setInitialOffset_14dthe$ = function (offset) {
  };
  PitchTracker.prototype.start = function () {
    this.samplesRecorded = 0;
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
    var correlatedFrequency = audioAnalyzer.updatePitch(timestamp);
    pm_log('Timestamp: ' + Kotlin.toString(timestamp));
    pm_log('Pitch: ' + Kotlin.toString(correlatedFrequency));
    var lengthOfBuffer = buflen / 2.0;
    this.stepWithFrequency_88ee24$(timestamp, correlatedFrequency, lengthOfBuffer, this.latencyTime);
  };
  PitchTracker.prototype.stepWithFrequency_88ee24$ = function (timestamp, correlatedFrequency, lengthOfBufferInSamples, latencyTime) {
    var timestampOfPitch = timestamp - lengthOfBufferInSamples / this.sampleRate * 1000.0 - latencyTime;
    var timestampAccountingForPreroll = timestampOfPitch - this.lengthOfPrerollToIgnore;
    pm_log('Timestamp accounting for preroll ' + timestampAccountingForPreroll);
    var samplesToFill = lengthOfBufferInSamples - this.samplesRecorded + timestampAccountingForPreroll * 44.1;
    if (samplesToFill < 0) {
      pm_log('Not filling yet...');
      return;
    }
    pm_log('Filling ' + Kotlin.toString(samplesToFill) + (' with ' + correlatedFrequency));
    this.samples.add_11rb$(new SampleCollection(correlatedFrequency, samplesToFill | 0, this.samplesRecorded));
    this.samplesRecorded = this.samplesRecorded + (samplesToFill | 0) | 0;
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
    TimeKeeper$TimeKeeperState$Completed_instance = new TimeKeeper$TimeKeeperState('Completed', 2);
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
  var TimeKeeper$TimeKeeperState$Completed_instance;
  function TimeKeeper$TimeKeeperState$Completed_getInstance() {
    TimeKeeper$TimeKeeperState_initFields();
    return TimeKeeper$TimeKeeperState$Completed_instance;
  }
  TimeKeeper$TimeKeeperState.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'TimeKeeperState',
    interfaces: [Enum]
  };
  function TimeKeeper$TimeKeeperState$values() {
    return [TimeKeeper$TimeKeeperState$Stopped_getInstance(), TimeKeeper$TimeKeeperState$Running_getInstance(), TimeKeeper$TimeKeeperState$Completed_getInstance()];
  }
  TimeKeeper$TimeKeeperState.values = TimeKeeper$TimeKeeperState$values;
  function TimeKeeper$TimeKeeperState$valueOf(name) {
    switch (name) {
      case 'Stopped':
        return TimeKeeper$TimeKeeperState$Stopped_getInstance();
      case 'Running':
        return TimeKeeper$TimeKeeperState$Running_getInstance();
      case 'Completed':
        return TimeKeeper$TimeKeeperState$Completed_getInstance();
      default:Kotlin.throwISE('No enum constant com.practicingmusician.steppable.TimeKeeper.TimeKeeperState.' + name);
    }
  }
  TimeKeeper$TimeKeeperState.valueOf_61zpoe$ = TimeKeeper$TimeKeeperState$valueOf;
  Object.defineProperty(TimeKeeper.prototype, 'state', {
    get: function () {
      return this.state_k2u27h$_0;
    },
    set: function (value) {
      if (value === TimeKeeper$TimeKeeperState$Completed_getInstance()) {
        pm_log('Completed', 10);
        this.state_k2u27h$_0 = TimeKeeper$TimeKeeperState$Stopped_getInstance();
        var tmp$;
        tmp$ = this.finishedActions.iterator();
        while (tmp$.hasNext()) {
          var element = tmp$.next();
          element(true);
        }
      }
       else {
        this.state_k2u27h$_0 = value;
      }
    }
  });
  TimeKeeper.prototype.start = function () {
    this.state = TimeKeeper$TimeKeeperState$Running_getInstance();
    var tmp$;
    tmp$ = this.steppables.iterator();
    while (tmp$.hasNext()) {
      var element = tmp$.next();
      element.setInitialOffset_14dthe$(0.0);
    }
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
    pm_log('Calling step at : ' + Kotlin.toString(timestamp) + (' (raw: ' + nonOffsetTimestamp + ')'));
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
      pm_log('STOPPED ((((((((((((((((((((((((((((((())))))))))))))))))', 9);
      this.state = TimeKeeper$TimeKeeperState$Completed_getInstance();
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
  function BigTest() {
    BigTest_instance = this;
    this.tempo = 120.0;
  }
  function BigTest$loadContent$lambda(this$BigTest) {
    return function (callbackData) {
      console.log('Callback:');
      var converter = new jsMusicXMLConverter();
      var json = converter.convertXMLToJSON(callbackData);
      console.log('JSON:');
      var jsCode = converter.convertJSON(json);
      var exercise = jsCode.easyScoreInfo;
      this$BigTest.runTestOnExercise_izl8xn$(exercise);
    };
  }
  BigTest.prototype.loadContent_61zpoe$ = function (xmlUrl) {
    loadXml('pm-listener/' + xmlUrl, BigTest$loadContent$lambda(this));
  };
  BigTest.prototype.runTestOnExercise_izl8xn$ = function (exercise) {
    console.log('Running tests...');
    var incrementalComparison = new IncrementalComparisonEngine();
    var incrementalBufferManager = new IncrementalBufferManager();
    var originalNoteObjects = TestBufferGenerator_getInstance().simpleNotesToNote_hhlze$(exercise.notes);
    var alteredNotes = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    var tmp$;
    tmp$ = originalNoteObjects.iterator();
    while (tmp$.hasNext()) {
      var element = tmp$.next();
      if (element.noteNumber !== -1) {
        var factor = 0.76;
        alteredNotes.add_11rb$(new Note(element.noteNumber, element.duration * factor, ''));
        alteredNotes.add_11rb$(new Note(-1, element.duration * (1.0 - factor), ''));
      }
       else {
        alteredNotes.add_11rb$(element);
      }
    }
    var exerciseSamplesCollection = TestBufferGenerator_getInstance().generateExactBufferCollectionFromNotes_jisecs$(alteredNotes, this.tempo);
    var exactCopyGenerated = incrementalBufferManager.convertSamplesBufferToNotes_mtnj1d$(exerciseSamplesCollection);
    var copyWithAvgData = TestBufferGenerator_getInstance().addAvgPitchToSamples_j4do5z$(exactCopyGenerated);
    var expectedResults = new CompareResults();
    expectedResults.correct = originalNoteObjects.size;
    expectedResults.attempted = originalNoteObjects.size;
    var comparisonFlags = new ComparisonFlags(false, true, true);
    println('Comparing exact copy...');
    SliceTest_getInstance().testShouldBe_3xie8k$(expectedResults, incrementalComparison.compareNoteArrays_2k3oz0$(comparisonFlags, originalNoteObjects, copyWithAvgData));
    var originalNotesShifted = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    originalNotesShifted.add_11rb$(new Note(-1, 1.0, ''));
    originalNotesShifted.addAll_brywnq$(alteredNotes);
    var shiftedSamplesCollection = TestBufferGenerator_getInstance().generateExactBufferCollectionFromNotes_jisecs$(originalNotesShifted, this.tempo);
    var shiftedSamplesBackToNotes = incrementalBufferManager.convertSamplesBufferToNotes_mtnj1d$(shiftedSamplesCollection);
    var shiftedWithAvgData = TestBufferGenerator_getInstance().addAvgPitchToSamples_j4do5z$(shiftedSamplesBackToNotes);
    var expectedResults2 = new CompareResults();
    expectedResults2.correct = 8;
    expectedResults2.attempted = 32;
    console.log('Comparing shifted version');
    SliceTest_getInstance().testShouldBe_3xie8k$(expectedResults2, incrementalComparison.compareNoteArrays_2k3oz0$(comparisonFlags, originalNoteObjects, shiftedWithAvgData));
  };
  BigTest.prototype.runTest = function (parameters) {
    listenerApp = new ListenerApp();
    listenerApp.parameters = new MockParameters();
    listenerApp.setTempoForTests_14dthe$(this.tempo);
    Note$Companion_getInstance().createAllNotes();
    this.loadContent_61zpoe$(parameters.xmlUrl);
  };
  BigTest.$metadata$ = {
    kind: Kotlin.Kind.OBJECT,
    simpleName: 'BigTest',
    interfaces: []
  };
  var BigTest_instance = null;
  function BigTest_getInstance() {
    if (BigTest_instance === null) {
      new BigTest();
    }
    return BigTest_instance;
  }
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
  function MockParameters() {
    this.notationContainerName_7mvjxd$_0 = 'notationBody';
    this.metronomeContainerName_7mvjxd$_0 = 'metronomeContainer';
    this.controlsContainerName_7mvjxd$_0 = 'controlsContainer';
    this.userID_7mvjxd$_0 = 1;
    this.exerciseID_7mvjxd$_0 = 2;
    this.databaseEndpoint_7mvjxd$_0 = '';
    this.url_7mvjxd$_0 = '';
    this.xmlUrl_7mvjxd$_0 = 'xmlFile.xml';
    this.audioAssetPath_7mvjxd$_0 = '';
    this.allowableCentsMargin_7mvjxd$_0 = 40;
    this.allowableRhythmMargin_7mvjxd$_0 = 0.25;
    this.allowableDurationRatio_7mvjxd$_0 = 0.5;
    this.minDurationInBeats_7mvjxd$_0 = 0.24;
    this.largestDurationRatioDifference_7mvjxd$_0 = 0.5;
    this.largestBeatDifference_7mvjxd$_0 = 1.0;
    this.bpm_7mvjxd$_0 = 120;
    this.metronomeSound_7mvjxd$_0 = true;
    this.pitch_7mvjxd$_0 = 440.0;
    this.transposition_7mvjxd$_0 = 0;
    this.displaySiteDialog_7mvjxd$_0 = MockParameters$displaySiteDialog$lambda;
  }
  Object.defineProperty(MockParameters.prototype, 'notationContainerName', {
    get: function () {
      return this.notationContainerName_7mvjxd$_0;
    }
  });
  Object.defineProperty(MockParameters.prototype, 'metronomeContainerName', {
    get: function () {
      return this.metronomeContainerName_7mvjxd$_0;
    }
  });
  Object.defineProperty(MockParameters.prototype, 'controlsContainerName', {
    get: function () {
      return this.controlsContainerName_7mvjxd$_0;
    }
  });
  Object.defineProperty(MockParameters.prototype, 'userID', {
    get: function () {
      return this.userID_7mvjxd$_0;
    }
  });
  Object.defineProperty(MockParameters.prototype, 'exerciseID', {
    get: function () {
      return this.exerciseID_7mvjxd$_0;
    }
  });
  Object.defineProperty(MockParameters.prototype, 'databaseEndpoint', {
    get: function () {
      return this.databaseEndpoint_7mvjxd$_0;
    }
  });
  Object.defineProperty(MockParameters.prototype, 'url', {
    get: function () {
      return this.url_7mvjxd$_0;
    }
  });
  Object.defineProperty(MockParameters.prototype, 'xmlUrl', {
    get: function () {
      return this.xmlUrl_7mvjxd$_0;
    }
  });
  Object.defineProperty(MockParameters.prototype, 'audioAssetPath', {
    get: function () {
      return this.audioAssetPath_7mvjxd$_0;
    }
  });
  Object.defineProperty(MockParameters.prototype, 'allowableCentsMargin', {
    get: function () {
      return this.allowableCentsMargin_7mvjxd$_0;
    }
  });
  Object.defineProperty(MockParameters.prototype, 'allowableRhythmMargin', {
    get: function () {
      return this.allowableRhythmMargin_7mvjxd$_0;
    }
  });
  Object.defineProperty(MockParameters.prototype, 'allowableDurationRatio', {
    get: function () {
      return this.allowableDurationRatio_7mvjxd$_0;
    }
  });
  Object.defineProperty(MockParameters.prototype, 'minDurationInBeats', {
    get: function () {
      return this.minDurationInBeats_7mvjxd$_0;
    }
  });
  Object.defineProperty(MockParameters.prototype, 'largestDurationRatioDifference', {
    get: function () {
      return this.largestDurationRatioDifference_7mvjxd$_0;
    }
  });
  Object.defineProperty(MockParameters.prototype, 'largestBeatDifference', {
    get: function () {
      return this.largestBeatDifference_7mvjxd$_0;
    }
  });
  Object.defineProperty(MockParameters.prototype, 'bpm', {
    get: function () {
      return this.bpm_7mvjxd$_0;
    }
  });
  Object.defineProperty(MockParameters.prototype, 'metronomeSound', {
    get: function () {
      return this.metronomeSound_7mvjxd$_0;
    }
  });
  Object.defineProperty(MockParameters.prototype, 'pitch', {
    get: function () {
      return this.pitch_7mvjxd$_0;
    }
  });
  Object.defineProperty(MockParameters.prototype, 'transposition', {
    get: function () {
      return this.transposition_7mvjxd$_0;
    }
  });
  Object.defineProperty(MockParameters.prototype, 'displaySiteDialog', {
    get: function () {
      return this.displaySiteDialog_7mvjxd$_0;
    }
  });
  function MockParameters$displaySiteDialog$lambda(params) {
    console.log('Dialog');
    console.log(params);
  }
  MockParameters.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'MockParameters',
    interfaces: [AppSetupParameters]
  };
  function SliceTest() {
    SliceTest_instance = this;
    this.notes = listOf([new Note(69, 0.5), new Note(81, 1.0), new Note(69, 1.0), new Note(81, 1.0)]);
    this.tempo = 120.0;
    this.secondsPerBeat = 60.0 / this.tempo;
    this.sampleRate = 44100.0;
    this.bufferLengthInSamples = 1024;
    this.comparisonFlags = new ComparisonFlags(true, true, true);
  }
  SliceTest.prototype.testShouldBe_3xie8k$ = function (ideal, testValue) {
    println('Results ' + Kotlin.toString(testValue.correct) + ' / ' + Kotlin.toString(testValue.attempted));
    if (ideal.attempted === testValue.attempted && ideal.correct === testValue.correct) {
      println('---- PASSED -----');
    }
     else {
      window.alert('Failed');
      println('----- ***** FAILED ****** -----');
    }
  };
  SliceTest.prototype.pitchTrackerTest = function () {
    var tmp$;
    println('***** Pitch tracker test');
    var pt = new PitchTracker();
    var exerciseSamplesCollection = TestBufferGenerator_getInstance().generateExactBufferCollectionFromNotes_jisecs$(this.notes, this.tempo);
    var latencyTime = 0;
    var timestamp;
    pt.lengthOfPrerollToIgnore = this.secondsPerBeat * 4 * 1000.0;
    println('Sending preroll');
    pt.stepWithFrequency_88ee24$(pt.lengthOfPrerollToIgnore, 1.0, pt.lengthOfPrerollToIgnore * 44.1, latencyTime);
    timestamp = pt.lengthOfPrerollToIgnore;
    println('------');
    tmp$ = exerciseSamplesCollection.iterator();
    while (tmp$.hasNext()) {
      var item = tmp$.next();
      timestamp += item.lengthInSamples / 44100.0 * 1000.0;
      println('sending ' + Kotlin.toString(item.lengthInSamples) + (' at ' + timestamp));
      pt.stepWithFrequency_88ee24$(timestamp, item.freq, item.lengthInSamples, latencyTime);
      println('--------');
    }
    var destination = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$(exerciseSamplesCollection, 10));
    var tmp$_0;
    tmp$_0 = exerciseSamplesCollection.iterator();
    while (tmp$_0.hasNext()) {
      var item_0 = tmp$_0.next();
      destination.add_11rb$(item_0.lengthInSamples);
    }
    var iterator = destination.iterator();
    if (!iterator.hasNext()) {
      throw new Kotlin.kotlin.UnsupportedOperationException("Empty collection can't be reduced.");
    }
    var accumulator = iterator.next();
    while (iterator.hasNext()) {
      accumulator = accumulator + iterator.next() | 0;
    }
    var originalSampleLength = accumulator;
    var $receiver = pt.samples;
    var destination_0 = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$($receiver, 10));
    var tmp$_1;
    tmp$_1 = $receiver.iterator();
    while (tmp$_1.hasNext()) {
      var item_1 = tmp$_1.next();
      destination_0.add_11rb$(item_1.lengthInSamples);
    }
    var iterator_0 = destination_0.iterator();
    if (!iterator_0.hasNext()) {
      throw new Kotlin.kotlin.UnsupportedOperationException("Empty collection can't be reduced.");
    }
    var accumulator_0 = iterator_0.next();
    while (iterator_0.hasNext()) {
      accumulator_0 = accumulator_0 + iterator_0.next() | 0;
    }
    var pitchTrackerSamplesLength = accumulator_0;
    println('Sample lengths :  ' + originalSampleLength + ' | ' + pitchTrackerSamplesLength);
    var exerciseSamplesCollectionFromPitchTracker = pt.samples;
    var incrementalBufferManager = new IncrementalBufferManager();
    var exactCopyGenerated = incrementalBufferManager.convertSamplesBufferToNotes_mtnj1d$(exerciseSamplesCollectionFromPitchTracker);
    var copyWithAvgData = TestBufferGenerator_getInstance().addAvgPitchToSamples_j4do5z$(exactCopyGenerated);
    println('Comparing exact copies (incremental)...');
    var expectedResults = new CompareResults();
    expectedResults.correct = 4;
    expectedResults.attempted = 4;
    var incrementalComparison = new IncrementalComparisonEngine();
    this.testShouldBe_3xie8k$(expectedResults, incrementalComparison.compareNoteArrays_2k3oz0$(this.comparisonFlags, this.notes, copyWithAvgData));
  };
  SliceTest.prototype.trueIncrementalBufferAndComparisonTest = function () {
  };
  SliceTest.prototype.trueIncrementalBufferTest = function () {
    var incrementalBufferManager = new IncrementalBufferManager();
    var exerciseSamplesCollection = TestBufferGenerator_getInstance().generateExactBufferCollectionWithSize1FromNotes_jisecs$(this.notes, this.tempo);
    console.log('Starting with ' + Kotlin.toString(exerciseSamplesCollection.size));
    var runningListOfSampleCollections = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    var curSampleIndex = 0;
    var sampleSliceSize = 700;
    while (true) {
      var endIndex = curSampleIndex + sampleSliceSize | 0;
      if (endIndex >= exerciseSamplesCollection.size) {
        endIndex = exerciseSamplesCollection.size;
      }
      var sliceOfSamples = exerciseSamplesCollection.subList_vux9f0$(curSampleIndex, endIndex);
      runningListOfSampleCollections.addAll_brywnq$(sliceOfSamples);
      var notes = incrementalBufferManager.convertSamplesBufferToNotes_mtnj1d$(runningListOfSampleCollections);
      curSampleIndex = curSampleIndex + sampleSliceSize | 0;
      if (endIndex === exerciseSamplesCollection.size) {
        break;
      }
      console.log('Notes after slicing:');
      console.log(notes);
    }
  };
  SliceTest.prototype.trueIncrementalComparisonTest = function () {
    var tmp$;
    println('****** Beginning true incremental test');
    var incrementalBufferManager = new IncrementalBufferManager();
    var exerciseSamplesCollection = TestBufferGenerator_getInstance().generateExactBufferCollectionFromNotes_jisecs$(this.notes, this.tempo);
    var exactCopyGenerated = incrementalBufferManager.convertSamplesBufferToNotes_mtnj1d$(exerciseSamplesCollection);
    var copyWithAvgData = TestBufferGenerator_getInstance().addAvgPitchToSamples_j4do5z$(exactCopyGenerated);
    println('Comparing exact copies (incremental)...');
    var incrementalComparison = new IncrementalComparisonEngine();
    tmp$ = copyWithAvgData.size;
    for (var index = 0; index <= tmp$; index++) {
      var sublist = copyWithAvgData.subList_vux9f0$(0, index);
      console.log('Sublist:' + Kotlin.toString(sublist.size));
      console.log(sublist);
      this.testShouldBe_3xie8k$.call(this, new CompareResults(sublist.size, sublist.size), incrementalComparison.compareNoteArrays_2k3oz0$(this.comparisonFlags, this.notes, sublist));
    }
  };
  SliceTest.prototype.exactIncrementalTestInBulk = function () {
    println('****** Beginning incremental bulk test');
    var incrementalBufferManager = new IncrementalBufferManager();
    var exerciseSamplesCollection = TestBufferGenerator_getInstance().generateExactBufferCollectionFromNotes_jisecs$(this.notes, this.tempo);
    var exactCopyGenerated = incrementalBufferManager.convertSamplesBufferToNotes_mtnj1d$(exerciseSamplesCollection);
    var copyWithAvgData = TestBufferGenerator_getInstance().addAvgPitchToSamples_j4do5z$(exactCopyGenerated);
    println('Comparing exact copies (incremental)...');
    var expectedResults = new CompareResults();
    expectedResults.correct = 4;
    expectedResults.attempted = 4;
    var incrementalComparison = new IncrementalComparisonEngine();
    this.testShouldBe_3xie8k$(expectedResults, incrementalComparison.compareNoteArrays_2k3oz0$(this.comparisonFlags, this.notes, copyWithAvgData));
  };
  SliceTest.prototype.sharpTest = function () {
    println('****** Beginning sharp test');
    var incrementalComparison = new IncrementalComparisonEngine();
    var incrementalBufferManager = new IncrementalBufferManager();
    var exerciseSamplesCollection = TestBufferGenerator_getInstance().generateExactBufferCollectionFromNotes_jisecs$(this.notes, this.tempo);
    var exactCopyGenerated = incrementalBufferManager.convertSamplesBufferToNotes_mtnj1d$(exerciseSamplesCollection);
    var sharpNoteOriginalFrequency = exactCopyGenerated.get_za3lpa$(1).note.getFrequency();
    var nextNoteUpFrequency = Note$Companion_getInstance().getFrequencyForNoteNumber_za3lpa$(exactCopyGenerated.get_za3lpa$(1).note.noteNumber + 1 | 0);
    var distanceInHz = nextNoteUpFrequency - sharpNoteOriginalFrequency;
    var distanceToMoveInHz = distanceInHz * ((listenerApp.parameters.allowableCentsMargin + 1 | 0) / 100.0);
    println('Original freq: ' + Kotlin.toString(sharpNoteOriginalFrequency));
    println('Next note up ' + nextNoteUpFrequency + ' distance ' + distanceInHz + ' to move ' + distanceToMoveInHz);
    exactCopyGenerated.get_za3lpa$(3).note.avgFreq = sharpNoteOriginalFrequency + distanceToMoveInHz;
    var copyWithAvgData = TestBufferGenerator_getInstance().addAvgPitchToSamples_j4do5z$(exactCopyGenerated);
    println('Comparing sharp copy...');
    var expectedResults = new CompareResults();
    expectedResults.correct = 3;
    expectedResults.attempted = 4;
    this.testShouldBe_3xie8k$(expectedResults, incrementalComparison.compareNoteArrays_2k3oz0$(this.comparisonFlags, this.notes, copyWithAvgData));
  };
  SliceTest.prototype.flatTest = function () {
    println('****** Beginning flat test');
    var incrementalComparison = new IncrementalComparisonEngine();
    var incrementalBufferManager = new IncrementalBufferManager();
    var exerciseSamplesCollection = TestBufferGenerator_getInstance().generateExactBufferCollectionFromNotes_jisecs$(this.notes, this.tempo);
    var exactCopyGenerated = incrementalBufferManager.convertSamplesBufferToNotes_mtnj1d$(exerciseSamplesCollection);
    var flatNoteOriginalFrequency = exactCopyGenerated.get_za3lpa$(1).note.getFrequency();
    var nextNoteDownFrequency = Note$Companion_getInstance().getFrequencyForNoteNumber_za3lpa$(exactCopyGenerated.get_za3lpa$(1).note.noteNumber - 1 | 0);
    var distanceInHz = flatNoteOriginalFrequency - nextNoteDownFrequency;
    var distanceToMoveInHz = distanceInHz * ((listenerApp.parameters.allowableCentsMargin + 1 | 0) / 100.0);
    println('Original freq: ' + Kotlin.toString(flatNoteOriginalFrequency));
    println('Next note up ' + nextNoteDownFrequency + ' distance ' + distanceInHz + ' to move ' + distanceToMoveInHz);
    exactCopyGenerated.get_za3lpa$(3).note.avgFreq = flatNoteOriginalFrequency - distanceToMoveInHz;
    var copyWithAvgData = TestBufferGenerator_getInstance().addAvgPitchToSamples_j4do5z$(exactCopyGenerated);
    println('Comparing flat copy...');
    var expectedResults = new CompareResults();
    expectedResults.correct = 3;
    expectedResults.attempted = 4;
    this.testShouldBe_3xie8k$(expectedResults, incrementalComparison.compareNoteArrays_2k3oz0$(this.comparisonFlags, this.notes, copyWithAvgData));
  };
  SliceTest.prototype.rushedTest = function () {
    println('****** Beginning rushed test');
    var incrementalComparison = new IncrementalComparisonEngine();
    var incrementalBufferManager = new IncrementalBufferManager();
    var rushedNotes = listOf([new Note(69, 0.5), new Note(81, 1.0 - listenerApp.parameters.allowableRhythmMargin - 0.01), new Note(69, 1.0), new Note(81, 1.0)]);
    var exerciseSamplesCollection = TestBufferGenerator_getInstance().generateExactBufferCollectionFromNotes_jisecs$(rushedNotes, this.tempo);
    var exactCopyGenerated = incrementalBufferManager.convertSamplesBufferToNotes_mtnj1d$(exerciseSamplesCollection);
    var copyWithAvgData = TestBufferGenerator_getInstance().addAvgPitchToSamples_j4do5z$(exactCopyGenerated);
    var expectedResults = new CompareResults();
    expectedResults.correct = 2;
    expectedResults.attempted = 4;
    println('Comparing rushed...');
    this.testShouldBe_3xie8k$(expectedResults, incrementalComparison.compareNoteArrays_2k3oz0$(this.comparisonFlags, this.notes, copyWithAvgData));
  };
  SliceTest.prototype.shortNotesTest = function () {
    println('****** Beginning short notes test');
    var incrementalComparison = new IncrementalComparisonEngine();
    var incrementalBufferManager = new IncrementalBufferManager();
    var notesWithShortNotes = listOf([new Note(69, 0.31), new Note(35, 0.05), new Note(69, 0.14), new Note(81, 0.78), new Note(34, 0.11), new Note(35, 0.11), new Note(69, 1.0), new Note(81, 1.0)]);
    var exerciseSamplesCollection = TestBufferGenerator_getInstance().generateExactBufferCollectionFromNotes_jisecs$(notesWithShortNotes, this.tempo);
    var exactCopyGenerated = incrementalBufferManager.convertSamplesBufferToNotes_mtnj1d$(exerciseSamplesCollection);
    var copyWithAvgData = TestBufferGenerator_getInstance().addAvgPitchToSamples_j4do5z$(exactCopyGenerated);
    var expectedResults = new CompareResults();
    expectedResults.correct = 4;
    expectedResults.attempted = 4;
    println('Comparing short notes...');
    this.testShouldBe_3xie8k$(expectedResults, incrementalComparison.compareNoteArrays_2k3oz0$(this.comparisonFlags, this.notes, copyWithAvgData));
  };
  SliceTest.prototype.runTest = function () {
    listenerApp = new ListenerApp();
    listenerApp.parameters = new MockParameters();
    listenerApp.setTempoForTests_14dthe$(this.tempo);
    Note$Companion_getInstance().createAllNotes();
    this.exactIncrementalTestInBulk();
    this.rushedTest();
    this.shortNotesTest();
    this.pitchTrackerTest();
    this.trueIncrementalComparisonTest();
    this.sharpTest();
    this.flatTest();
    return 'Done';
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
  TestBufferGenerator.prototype.generateExactBufferCollectionWithSize1FromNotes_jisecs$ = function (notes, tempo) {
    var secondsPerBeat = 60.0 / tempo;
    var samples = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    var noteChangeIndexes = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
    var tmp$;
    tmp$ = notes.iterator();
    while (tmp$.hasNext()) {
      var element = tmp$.next();
      var tmp$_0, tmp$_1, tmp$_2, tmp$_3;
      noteChangeIndexes.add_11rb$(samples.size);
      var numSamplesToCreate = element.duration * secondsPerBeat * 44100.0;
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
    var destination = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$(samples, 10));
    var tmp$_4, tmp$_0_0;
    var index = 0;
    tmp$_4 = samples.iterator();
    while (tmp$_4.hasNext()) {
      var item = tmp$_4.next();
      var tmp$_5 = destination.add_11rb$;
      var collection = new SampleCollection(item, 1, (tmp$_0_0 = index, index = tmp$_0_0 + 1 | 0, tmp$_0_0));
      tmp$_5.call(destination, collection);
    }
    var collections = destination;
    return collections;
  };
  TestBufferGenerator.prototype.simpleNotesToNote_hhlze$ = function (notes) {
    var destination = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(notes.length);
    var tmp$;
    for (tmp$ = 0; tmp$ !== notes.length; ++tmp$) {
      var item = notes[tmp$];
      destination.add_11rb$(new Note(item.noteNumber, item.duration, ''));
    }
    return destination;
  };
  TestBufferGenerator.prototype.generateExactBufferCollectionFromNotes_jisecs$ = function (notes, tempo) {
    var secondsPerBeat = 60.0 / tempo;
    var destination = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$(notes, 10));
    var tmp$;
    tmp$ = notes.iterator();
    while (tmp$.hasNext()) {
      var item = tmp$.next();
      var tmp$_0 = destination.add_11rb$;
      var collection = new SampleCollection(item.getFrequency(), item.duration * secondsPerBeat * 44100.0 | 0, -1);
      tmp$_0.call(destination, collection);
    }
    var notesMap = destination;
    return notesMap;
  };
  TestBufferGenerator.prototype.addAvgPitchToSamples_j4do5z$ = function (notes) {
    var destination = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$(notes, 10));
    var tmp$;
    tmp$ = notes.iterator();
    while (tmp$.hasNext()) {
      var item = tmp$.next();
      var tmp$_0 = destination.add_11rb$;
      if (item.note.avgFreq == null) {
        item.note.avgFreq = item.note.getFrequency();
      }
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
  function main(args) {
  }
  var package$com = _.com || (_.com = {});
  var package$practicingmusician = package$com.practicingmusician || (package$com.practicingmusician = {});
  package$practicingmusician.ListenerApp = ListenerApp;
  package$practicingmusician.DialogParams = DialogParams;
  package$practicingmusician.FlashMessage = FlashMessage;
  package$practicingmusician.ConverterOutput = ConverterOutput;
  package$practicingmusician.ComparisonFlags = ComparisonFlags;
  package$practicingmusician.AppPreferences = AppPreferences;
  package$practicingmusician.AppSetupParameters = AppSetupParameters;
  package$practicingmusician.AudioAnalyzer = AudioAnalyzer;
  package$practicingmusician.EasyScoreCode = EasyScoreCode;
  package$practicingmusician.SimpleJSNoteObject = SimpleJSNoteObject;
  package$practicingmusician.BeatPosition = BeatPosition;
  Object.defineProperty(TunerModes, 'TUNER', {
    get: TunerModes$TUNER_getInstance
  });
  Object.defineProperty(TunerModes, 'STOPWATCH', {
    get: TunerModes$STOPWATCH_getInstance
  });
  package$practicingmusician.TunerModes = TunerModes;
  package$practicingmusician.TunerParameters = TunerParameters;
  package$practicingmusician.PMTuner = PMTuner;
  Object.defineProperty(package$practicingmusician, 'UserSettings', {
    get: UserSettings_getInstance
  });
  var package$audio = package$practicingmusician.audio || (package$practicingmusician.audio = {});
  package$audio.AudioManager = AudioManager;
  var package$exercises = package$practicingmusician.exercises || (package$practicingmusician.exercises = {});
  package$exercises.ExerciseDefinition = ExerciseDefinition;
  package$exercises.ExerciseManager = ExerciseManager;
  var package$finals = package$practicingmusician.finals || (package$practicingmusician.finals = {});
  package$finals.FeedbackMetric = FeedbackMetric;
  Object.defineProperty(FeedbackType, 'Correct', {
    get: FeedbackType$Correct_getInstance
  });
  Object.defineProperty(FeedbackType, 'Incorrect', {
    get: FeedbackType$Incorrect_getInstance
  });
  Object.defineProperty(FeedbackType, 'Missed', {
    get: FeedbackType$Missed_getInstance
  });
  package$finals.FeedbackType = FeedbackType;
  package$finals.FeedbackItem = FeedbackItem;
  package$finals.throwSafeIncorrectSwitch_a2klfm$ = throwSafeIncorrectSwitch;
  package$finals.CompareResults = CompareResults;
  package$finals.ResultsForDatabase = ResultsForDatabase;
  package$finals.IndividualNotePerformanceInfo = IndividualNotePerformanceInfo;
  package$finals.NotePlacement = NotePlacement;
  package$finals.IncrementalBufferManager = IncrementalBufferManager;
  package$finals.IncrementalComparisonEngine = IncrementalComparisonEngine;
  var package$network = package$practicingmusician.network || (package$practicingmusician.network = {});
  Object.defineProperty(package$network, 'ListenerNetworkManager', {
    get: ListenerNetworkManager_getInstance
  });
  package$network.PerformanceWrapper = PerformanceWrapper;
  var package$notes = package$practicingmusician.notes || (package$practicingmusician.notes = {});
  package$notes.EasyScoreUtil_Kotlin = EasyScoreUtil_Kotlin;
  Note$Companion.prototype.NoteWithDiff = Note$Companion$NoteWithDiff;
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
  Object.defineProperty(package$steppable, 'buflen', {
    get: function () {
      return buflen;
    },
    set: function (value) {
      buflen = value;
    }
  });
  package$steppable.SampleCollection = SampleCollection;
  package$steppable.PitchTracker = PitchTracker;
  Object.defineProperty(TimeKeeper$TimeKeeperState, 'Stopped', {
    get: TimeKeeper$TimeKeeperState$Stopped_getInstance
  });
  Object.defineProperty(TimeKeeper$TimeKeeperState, 'Running', {
    get: TimeKeeper$TimeKeeperState$Running_getInstance
  });
  Object.defineProperty(TimeKeeper$TimeKeeperState, 'Completed', {
    get: TimeKeeper$TimeKeeperState$Completed_getInstance
  });
  TimeKeeper.TimeKeeperState = TimeKeeper$TimeKeeperState;
  package$steppable.TimeKeeper = TimeKeeper;
  package$steppable.TimeKeeperSteppable = TimeKeeperSteppable;
  package$steppable.TimeKeeperAnalyzer = TimeKeeperAnalyzer;
  var package$tests = package$practicingmusician.tests || (package$practicingmusician.tests = {});
  Object.defineProperty(package$tests, 'BigTest', {
    get: BigTest_getInstance
  });
  Object.defineProperty(package$tests, 'PitchTrackerTest', {
    get: PitchTrackerTest_getInstance
  });
  package$tests.PitchTrackerTestClass = PitchTrackerTestClass;
  package$tests.MockParameters = MockParameters;
  Object.defineProperty(package$tests, 'SliceTest', {
    get: SliceTest_getInstance
  });
  Object.defineProperty(package$tests, 'TestBufferGenerator', {
    get: TestBufferGenerator_getInstance
  });
  _.main_kand9s$ = main;
  ALL_NOTES = Kotlin.kotlin.collections.ArrayList_init_ww73n8$();
  buflen = 1024;
  main([]);
  Kotlin.defineModule('PracticingMusician', _);
  return _;
}(typeof PracticingMusician === 'undefined' ? {} : PracticingMusician, kotlin);
