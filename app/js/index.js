/* GLOBALS */
var canvasName = "notationCanvas";
var indicatorCanvasName = "indicatorCanvas";
var feedbackCanvasName = "feedbackCanvas";

//global variables for the different canvases
var canvas = document.getElementById(canvasName);
var indicatorCanvas = document.getElementById(indicatorCanvasName);
var feedbackCanvas = document.getElementById(feedbackCanvasName);

//references to the HTML metronome indicators
var metronomeItems = document.getElementById("metronomeItems").getElementsByClassName("metronomeItem");

/* END GLOBALS */


var listenerApp = new PracticingMusician.com.practicingmusician.ListenerApp()

//Resizing code
var resizeTimeoutID;
window.onresize = function() {
    clearTimeout(resizeTimeoutID);
    resizeTimeoutID = setTimeout(listenerApp.doResizeActions, 500);
}


function networkRequest(url, dataObject) {
    var objectData = JSON.parse(dataObject)
    console.log("Object data:")
    console.log(objectData)
    $.ajax({
        url:url,
        type: "POST",
        data: objectData,
        success: function(result) {
            alert(result)
        },
        failure: function(result) {
            alert(result)
        }
    })
}

networkRequest("https://google.com",{data: "test"})