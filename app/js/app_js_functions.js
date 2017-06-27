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
    EasyScoreUtil.drawIndicatorLine(indicatorCanvas, beat)
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
    console.log("Clearing")
    feedbackCanvas.getContext("2d").clearRect(0,0,feedbackCanvas.width,feedbackCanvas.height)

    var items = document.getElementsByClassName('feedbackItem');
    while(items[0]) {
        items[0].parentNode.removeChild(items[0])
    }
}

//add a feedback item to a certain beat
function addFeedbackItem(beat,item) {
    var positionForBeat = EasyScoreUtil.getPositionForBeat(beat)
    var positionY = EasyScoreUtil.getFeedbackYPosition(positionForBeat.y)
    EasyScoreUtil.drawFeedbackAtPosition(feedbackCanvas,item,positionForBeat.x,positionY)
    EasyScoreUtil.createFeedbackHTMLElement(item,positionForBeat.x,positionY)
}