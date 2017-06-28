/*
 * These functions should be better structured -- they may rely on certain global vars, etc
 *
 * Most-likely called by Kotlin external functions
 */

var canvasName = "notationCanvas";
var indicatorCanvasName = "indicatorCanvas";
var feedbackCanvasName = "feedbackCanvas"

//move the indicator to a certain beat position
function moveToPosition(beat) {
    //clear the previous indicator first
    indicatorCanvas.getContext("2d").clearRect(0, 0, indicatorCanvas.width, indicatorCanvas.height);
    scoreUtil.drawIndicatorLine(indicatorCanvas, beat)
}

//highlight a certain item in the HTML metronome indicators
function highlightMetronomeItem(itemNumber) {
    for (index in metronomeItems) {
        var item = metronomeItems[index]
        item.className = "metronomeItem"

        if (itemNumber == index)
            item.className += " highlighted"
    }
}

//clear existing feedback items from the screen
function clearFeedbackItems() {
    pm_log("Clearing")
    feedbackCanvas.getContext("2d").clearRect(0,0,feedbackCanvas.width,feedbackCanvas.height)

    var items = document.getElementsByClassName('feedbackItem');
    while(items[0]) {
        items[0].parentNode.removeChild(items[0])
    }
}

//add a feedback item to a certain beat
function addFeedbackItem(beat,items) {
    var positionForBeat = scoreUtil.getPositionForBeat(beat)
    var positionY = scoreUtil.getFeedbackYPosition(positionForBeat.y)
    //EasyScoreUtil.drawFeedbackAtPosition(feedbackCanvas,items,positionForBeat.x,positionY)
    scoreUtil.createFeedbackHTMLElement(items.toArray(),positionForBeat.x,positionY)
}