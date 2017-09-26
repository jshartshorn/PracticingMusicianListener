
var listenerApp = new PracticingMusician.com.practicingmusician.ListenerApp()

//Resizing code
var resizeTimeoutID;
window.onresize = function() {
    clearTimeout(resizeTimeoutID);
    resizeTimeoutID = setTimeout(
        function() {
            listenerApp.doResizeActions()
        }
    , 500);
}

function loadXml(url,callback) {
  console.log("Loading XML from url: " + url)
  $.ajax({
    type: "GET",
    url: url,
    dataType: "text",
    success: function(result) {
      console.log("Success!")
      //console.log(result)
      callback(result)
    },
    failure: function(result) {
      console.log("Failure..")
      console.log(result)
    }
   });
}

function networkRequest(url, dataObject) {
    console.log("Object data:")
    console.log(dataObject)

    if (window.form_authenticity_token != undefined) {
      dataObject.form_authenticity_token = window.form_authenticity_token
    }

    $.ajax({
        url:url,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(dataObject),
        dataType: 'json',
        success: function(result) {
            console.log("Network request success:")
            console.log(result)
        },
        failure: function(result) {
            console.log("Network request failure:")
            console.log(result)
        }
    })
}

$(document).ready(function(){
    //networkRequest("https://google.com",{data: "test"})
})

if (window.displayFlashMessages == undefined) {
  window.displayFlashMessages = function(msg) {
    msg.forEach(function(it) {
          alert(it.message)
    })
  }
}
