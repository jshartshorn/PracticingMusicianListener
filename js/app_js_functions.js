var canvasName = "notationCanvas";
var indicatorCanvasName = "indicatorCanvas";
var feedbackCanvasName = "feedbackCanvas"


function moveToPosition(beat) {
    indicatorCanvas.getContext("2d").clearRect(0, 0, indicatorCanvas.width, indicatorCanvas.height);
    VexFlowUtil.drawIndicatorLine(indicatorCanvas, stave, VexFlowUtil.getPositionForBeat(voice.tickables, beat))
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
    var positionX = VexFlowUtil.getPositionForBeat(voice.tickables, beat)
    var positionY = VexFlowUtil.getFeedbackYPosition(stave)
    VexFlowUtil.drawFeedbackAtPosition(feedbackCanvas,item,positionX,positionY)
}