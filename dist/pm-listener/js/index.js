function networkRequest(e,t){var i=JSON.parse(t);console.log("Object data:"),console.log(i),$.ajax({url:e,type:"POST",data:i,success:function(e){alert(e)},failure:function(e){alert(e)}})}var listenerApp=new PracticingMusician.com.practicingmusician.ListenerApp,resizeTimeoutID;window.onresize=function(){clearTimeout(resizeTimeoutID),resizeTimeoutID=setTimeout(function(){listenerApp.doResizeActions()},500)},networkRequest("https://google.com",{data:"test"});