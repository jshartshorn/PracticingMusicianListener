function networkRequest(e,i){console.log("Object data:"),console.log(i),$.ajax({url:e,type:"POST",contentType:"application/json",data:JSON.stringify(i),dataType:"json",success:function(e){console.log("Network request success:"),console.log(e)},failure:function(e){console.log("Network request failure:"),console.log(e)}})}var listenerApp=new PracticingMusician.com.practicingmusician.ListenerApp,resizeTimeoutID;window.onresize=function(){clearTimeout(resizeTimeoutID),resizeTimeoutID=setTimeout(function(){listenerApp.doResizeActions()},500)},$(document).ready(function(){}),void 0==window.displayFlashMessages&&(window.displayFlashMessages=function(e){e.forEach(function(e){alert(e.message)})}),void 0==window.displaySiteDialog&&(window.displaySiteDialog=function(e){alert("Image: "+e.imageType+"\nTitle: "+e.title+"\nMessage: "+e.message)});