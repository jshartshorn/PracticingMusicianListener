function concat(e,t){return e.concat(t)}VF=Vex.Flow;var indicatorCanvasName="indicatorCanvas",feedbackCanvasName="feedbackCanvas",EasyScoreUtil=function(){this.containerElementName="",this.scorePositionInitialX=60,this.scorePositionInitialY=20,this.scorePositionX=0,this.scorePositionY=0,this.scorePositionCurrentLine=0,this.measureCounter=0,this.exercise=null,this.generatedExercise=null,this.vf=null,this.registry=null,this.score=null,this.voice=null,this.beam=null,this.contentScaleFactor=1,this.useScaling=!0,this.assumedCanvasWidth=1024,this.barHeight=160,this.firstBarAddition=40,this.scoreWidth=0,this.noteIDNumber=0,this.systems=Array(),this.setupOnElement=function(e){var t=document.getElementById(e).offsetWidth;this.useScaling&&(this.contentScaleFactor=t/this.assumedCanvasWidth,t=this.assumedCanvasWidth);var i=t-2*this.scorePositionInitialX;pm_log("Avail width: "+i);var n=this.exercise.systems.length,s=i;this.scoreWidth=s,this.scorePositionInitialX=t/2-s/2,pm_log("Total width will be "+s,10),pm_log("Total height will be "+n*this.barHeight);var a=document.getElementById(indicatorCanvasName);pm_log("Setting up indicator canvas",10),pm_log(a,10),a.width=t*this.contentScaleFactor,a.height=n*this.barHeight*this.contentScaleFactor,this.vf=new Vex.Flow.Factory({renderer:{selector:e,width:t*this.contentScaleFactor,height:n*this.barHeight*this.contentScaleFactor}}),this.vf.context.scale(this.contentScaleFactor,this.contentScaleFactor),this.registry=new VF.Registry,VF.Registry.enableDefaultRegistry(this.registry),this.score=this.vf.EasyScore({throwOnError:!0}),this.voice=this.score.voice.bind(this.score),this.notes=this.score.notes.bind(this.score),this.beam=this.score.beam.bind(this.score)},this.buildTitleElements=function(e){var t=document.getElementById("titleContainer");null!=t&&t.parentNode.removeChild(t);var i=document.createElement("div");i.id="titleContainer";var n=document.createElement("span");n.id="mainTitle",n.innerHTML=this.exercise.title,i.appendChild(n);var s=document.createElement("span");s.id="exerciseAuthor",s.innerHTML="By: "+this.exercise.author,i.appendChild(s);var a=document.getElementById(e);a.insertBefore(i,a.childNodes[0]);var r=document.getElementById("copyrightContainer");null!=r&&r.parentNode.removeChild(r),(r=document.createElement("div")).id="copyrightContainer",r.innerHTML=this.exercise.copyrightInfo,a.appendChild(r)},this.setupMetronome=function(e){for(var t=document.getElementById(e);t.firstChild;)t.removeChild(t.firstChild);console.log("Making metronome for "+this.exercise.time_signature);var i=1;switch(this.exercise.time_signature){case"4/4":i=4;break;case"3/4":i=3;break;case"6/8":i=6}var n=document.getElementById(e);n.style.display="flex",n.style.flexDirection="row",n.style.justifyContent="space-around",n.style.alignItems="center";var s=document.createElement("div");s.id="metronomeItems",document.getElementById(e).appendChild(s);for(var a=0;a<i;a++){var r=document.createElement("span");r.className="metronomeItem",0==a&&(r.className+=" highlighted"),document.getElementById("metronomeItems").appendChild(r)}var o=document.createElement("span");o.id="tempoMarking",o.innerHTML=this.exercise.tempo+"<br/> bpm",n.appendChild(o)},this.makeSystem=function(e){void 0==e&&(e={});var t=this.scoreWidth/e.barsInSystem;0==e.positionInLine&&(t+=this.firstBarAddition,e.pickup_bar,this.scorePositionX=this.scorePositionInitialX,0==this.scorePositionY?this.scorePositionY=this.scorePositionInitialY:this.scorePositionY+=this.barHeight);var i=this.vf.System({x:this.scorePositionX,y:this.scorePositionY,width:t,spaceBetweenStaves:10});return this.measureCounter+=1,this.scorePositionX+=t,i},this.id=function(e){return this.registry.getElementById(e)},this.notateExercise=function(){this.score.set({time:this.exercise.time_signature});var e=this.exercise.systems.reduce(function(e,t){return e+t.bars.length},0),t=0;for(lineIndex in this.exercise.systems){var i=this.exercise.systems[lineIndex];for(barIndex in i.bars){var n=i.bars[barIndex],s=this.exercise.time_signature;void 0!=n.extra_attributes&&void 0!=n.extra_attributes.alternate_timeSignature&&(s=n.extra_attributes.alternate_timeSignature);var a={barsInSystem:i.bars.length,positionInLine:barIndex};void 0!=n.extra_attributes&&void 0!=n.extra_attributes.pickup_bar&&1==n.extra_attributes.pickup_bar&&(a.pickup_bar=!0);var r=this.makeSystem(a);this.systems.push(r);var o=Array();for(groupIndex in n.groups){var c=n.groups[groupIndex],h="",d=c.notes;for(var l in d){var m=d[l];l>0&&(h+=","),h+=m,h+='[id="note'+this.noteIDNumber+'"]',this.noteIDNumber++}var u={};void 0!=c.stem_direction&&(u.stem=c.stem_direction);var v=this.notes(h,u);!0===c.beam&&(v=this.beam(v)),o.push(v)}var g=r.addStave({voices:[this.voice(o.reduce(concat),{time:s})]});if(void 0!=n.extra_attributes)for(attr in n.extra_attributes){var p=n.extra_attributes[attr];switch(attr){case"time_signature":g.addTimeSignature(p);break;case"clef":g.addClef(p);break;case"key_signature":g.addKeySignature(p);break;default:pm_log("Unknown attribute:"+attr,10)}}t==e-1&&g.setEndBarType(VF.Barline.type.END),t+=1}}this.vf.draw(),VF.Registry.disableDefaultRegistry()},this.getElementsForBeat=function(e){var t=0,i=null,n=null,s=0,a=0,r=null;for(index in this.generatedExercise.notes){var o=this.generatedExercise.notes[index].duration;if(t<=e)i=index,n=index,s=t,lastNoteBeatPosition=t;else if(null==i&&(i=index,s=t),n=index,a=t,t>=e)break;t+=o}return((r=(e-s)/(a-s))<0||isNaN(r))&&(r=0),{currentItemIndex:i,nextItemIndex:n,percent:r}},this.getPositionForBeat=function(e){var t=this.getElementsForBeat(e),i=this.id("note"+t.currentItemIndex),n=this.id("note"+t.nextItemIndex),s=i.stave.getYForLine(0),a=this.middlePositionOfItem(i),r=this.middlePositionOfItem(n)-this.middlePositionOfItem(i);return i.stave.getBoundingBox().y!=n.stave.getBoundingBox().y&&(r=i.stave.end_x-this.middlePositionOfItem(i)),{x:a+r*t.percent,y:s}},this.middlePositionOfItem=function(e){return e.getAbsoluteX()+e.getBoundingBox().w/2},this.getBasicStave=function(){return this.systems[0].parts[0].stave},this.getStaveForBeat=function(e){var t=this.getElementsForBeat(e);return this.id("note"+t.currentItemIndex).stave},this.drawIndicatorLine=function(e,t){var i=this.getPositionForBeat(t),n=20*this.contentScaleFactor,s=this.getBasicStave(),a=s.getYForLine(4)-s.getYForLine(0),r=i.y-n,o=i.y+a+n;if(e.getContext){var c=e.getContext("2d");c.strokeStyle="#4990E2",c.lineWidth=3,c.beginPath(),c.moveTo(i.x*this.contentScaleFactor,o*this.contentScaleFactor),c.lineTo(i.x*this.contentScaleFactor,r*this.contentScaleFactor),c.closePath(),c.stroke()}},this.getFeedbackYPosition=function(e){return this.getBasicStave().height+e+20},this.drawFeedbackAtPosition=function(e,t,i,n){var s=e.getContext("2d");s.font="16px Arial",s.textAlign="center",s.textBaseline="top",s.fillText(t,i*this.contentScaleFactor,n*this.contentScaleFactor)},this.createFeedbackHTMLElement=function(e,t,i){var n=16*this.contentScaleFactor,s=document.createElement("div");s.className="feedbackItem off_note";var a=e.map(function(e){var t=document.createElement("span");t.className="feedbackItemElement";var i=document.createElement("span");i.className="feedbackKey",i.innerHTML=e.name;var n=document.createElement("span");return n.className="feedbackValue",n.innerHTML=e.value,t.appendChild(i),t.appendChild(n),t}),r=document.createElement("div");r.className="feedbackItemContainer",a.forEach(function(e){r.appendChild(e)}),s.appendChild(r),s.style.position="absolute",s.style.top=i*this.contentScaleFactor+"px",s.style.left=""+t*this.contentScaleFactor-n/2+"px",document.getElementById(this.containerElementName).appendChild(s)}};