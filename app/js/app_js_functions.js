var canvasName = "notationCanvas";
var indicatorCanvasName = "indicatorCanvas";
var feedbackCanvasName = "feedbackCanvas"


function moveToPosition(beat) {
    indicatorCanvas.getContext("2d").clearRect(0, 0, indicatorCanvas.width, indicatorCanvas.height);
    EasyScoreUtil.drawIndicatorLine(indicatorCanvas, EasyScoreUtil.getPositionForBeat(beat))
}

function highlightMetronomeItem(itemNumber) {
    for (index in metronomeItems) {
        var item = metronomeItems[index]
        item.className = "metronomeItem"

        if (itemNumber == index)
            item.className += " highlighted"
    }
}

function clearFeedbackItems() {
    console.log("Clearing")
    feedbackCanvas.getContext("2d").clearRect(0,0,feedbackCanvas.width,feedbackCanvas.height)
}

function addFeedbackItem(beat,item) {
    var positionX = EasyScoreUtil.getPositionForBeat(beat)
    var positionY = EasyScoreUtil.getFeedbackYPosition()
    EasyScoreUtil.drawFeedbackAtPosition(feedbackCanvas,item,positionX,positionY)
}