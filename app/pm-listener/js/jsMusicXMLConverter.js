// Changes XML to JSON
(function(a,b){if(typeof define==="function"&&define.amd){define([],b)}else{if(typeof exports==="object"){module.exports=b()}else{a.X2JS=b()}}}(this,function(){return function(z){var t="1.2.0";z=z||{};i();u();function i(){if(z.escapeMode===undefined){z.escapeMode=true}z.attributePrefix=z.attributePrefix||"_";z.arrayAccessForm=z.arrayAccessForm||"none";z.emptyNodeForm=z.emptyNodeForm||"text";if(z.enableToStringFunc===undefined){z.enableToStringFunc=true}z.arrayAccessFormPaths=z.arrayAccessFormPaths||[];if(z.skipEmptyTextNodesForObj===undefined){z.skipEmptyTextNodesForObj=true}if(z.stripWhitespaces===undefined){z.stripWhitespaces=true}z.datetimeAccessFormPaths=z.datetimeAccessFormPaths||[];if(z.useDoubleQuotes===undefined){z.useDoubleQuotes=false}z.xmlElementsFilter=z.xmlElementsFilter||[];z.jsonPropertiesFilter=z.jsonPropertiesFilter||[];if(z.keepCData===undefined){z.keepCData=false}}var h={ELEMENT_NODE:1,TEXT_NODE:3,CDATA_SECTION_NODE:4,COMMENT_NODE:8,DOCUMENT_NODE:9};function u(){}function x(B){var C=B.localName;if(C==null){C=B.baseName}if(C==null||C==""){C=B.nodeName}return C}function r(B){return B.prefix}function s(B){if(typeof(B)=="string"){return B.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}else{return B}}function k(B){return B.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,"\"").replace(/&apos;/g,"'").replace(/&amp;/g,"&")}function w(C,F,D,E){var B=0;for(;B<C.length;B++){var G=C[B];if(typeof G==="string"){if(G==E){break}}else{if(G instanceof RegExp){if(G.test(E)){break}}else{if(typeof G==="function"){if(G(F,D,E)){break}}}}}return B!=C.length}function n(D,B,C){switch(z.arrayAccessForm){case"property":if(!(D[B] instanceof Array)){D[B+"_asArray"]=[D[B]]}else{D[B+"_asArray"]=D[B]}break}if(!(D[B] instanceof Array)&&z.arrayAccessFormPaths.length>0){if(w(z.arrayAccessFormPaths,D,B,C)){D[B]=[D[B]]}}}function a(G){var E=G.split(/[-T:+Z]/g);var F=new Date(E[0],E[1]-1,E[2]);var D=E[5].split(".");F.setHours(E[3],E[4],D[0]);if(D.length>1){F.setMilliseconds(D[1])}if(E[6]&&E[7]){var C=E[6]*60+Number(E[7]);var B=/\d\d-\d\d:\d\d$/.test(G)?"-":"+";C=0+(B=="-"?-1*C:C);F.setMinutes(F.getMinutes()-C-F.getTimezoneOffset())}else{if(G.indexOf("Z",G.length-1)!==-1){F=new Date(Date.UTC(F.getFullYear(),F.getMonth(),F.getDate(),F.getHours(),F.getMinutes(),F.getSeconds(),F.getMilliseconds()))}}return F}function q(D,B,C){if(z.datetimeAccessFormPaths.length>0){var E=C.split(".#")[0];if(w(z.datetimeAccessFormPaths,D,B,E)){return a(D)}else{return D}}else{return D}}function b(E,C,B,D){if(C==h.ELEMENT_NODE&&z.xmlElementsFilter.length>0){return w(z.xmlElementsFilter,E,B,D)}else{return true}}function A(D,J){if(D.nodeType==h.DOCUMENT_NODE){var K=new Object;var B=D.childNodes;for(var L=0;L<B.length;L++){var C=B.item(L);if(C.nodeType==h.ELEMENT_NODE){var I=x(C);K[I]=A(C,I)}}return K}else{if(D.nodeType==h.ELEMENT_NODE){var K=new Object;K.__cnt=0;var B=D.childNodes;for(var L=0;L<B.length;L++){var C=B.item(L);var I=x(C);if(C.nodeType!=h.COMMENT_NODE){var H=J+"."+I;if(b(K,C.nodeType,I,H)){K.__cnt++;if(K[I]==null){K[I]=A(C,H);n(K,I,H)}else{if(K[I]!=null){if(!(K[I] instanceof Array)){K[I]=[K[I]];n(K,I,H)}}(K[I])[K[I].length]=A(C,H)}}}}for(var E=0;E<D.attributes.length;E++){var F=D.attributes.item(E);K.__cnt++;K[z.attributePrefix+F.name]=F.value}var G=r(D);if(G!=null&&G!=""){K.__cnt++;K.__prefix=G}if(K["#text"]!=null){K.__text=K["#text"];if(K.__text instanceof Array){K.__text=K.__text.join("\n")}if(z.stripWhitespaces){K.__text=K.__text.trim()}delete K["#text"];if(z.arrayAccessForm=="property"){delete K["#text_asArray"]}K.__text=q(K.__text,I,J+"."+I)}if(K["#cdata-section"]!=null){K.__cdata=K["#cdata-section"];delete K["#cdata-section"];if(z.arrayAccessForm=="property"){delete K["#cdata-section_asArray"]}}if(K.__cnt==0&&z.emptyNodeForm=="text"){K=""}else{if(K.__cnt==1&&K.__text!=null){K=K.__text}else{if(K.__cnt==1&&K.__cdata!=null&&!z.keepCData){K=K.__cdata}else{if(K.__cnt>1&&K.__text!=null&&z.skipEmptyTextNodesForObj){if((z.stripWhitespaces&&K.__text=="")||(K.__text.trim()=="")){delete K.__text}}}}}delete K.__cnt;if(z.enableToStringFunc&&(K.__text!=null||K.__cdata!=null)){K.toString=function(){return(this.__text!=null?this.__text:"")+(this.__cdata!=null?this.__cdata:"")}}return K}else{if(D.nodeType==h.TEXT_NODE||D.nodeType==h.CDATA_SECTION_NODE){return D.nodeValue}}}}function o(I,F,H,C){var E="<"+((I!=null&&I.__prefix!=null)?(I.__prefix+":"):"")+F;if(H!=null){for(var G=0;G<H.length;G++){var D=H[G];var B=I[D];if(z.escapeMode){B=s(B)}E+=" "+D.substr(z.attributePrefix.length)+"=";if(z.useDoubleQuotes){E+="\""+B+"\""}else{E+="'"+B+"'"}}}if(!C){E+=">"}else{E+="/>"}return E}function j(C,B){return"</"+(C.__prefix!=null?(C.__prefix+":"):"")+B+">"}function v(C,B){return C.indexOf(B,C.length-B.length)!==-1}function y(C,B){if((z.arrayAccessForm=="property"&&v(B.toString(),("_asArray")))||B.toString().indexOf(z.attributePrefix)==0||B.toString().indexOf("__")==0||(C[B] instanceof Function)){return true}else{return false}}function m(D){var C=0;if(D instanceof Object){for(var B in D){if(y(D,B)){continue}C++}}return C}function l(D,B,C){return z.jsonPropertiesFilter.length==0||C==""||w(z.jsonPropertiesFilter,D,B,C)}function c(D){var C=[];if(D instanceof Object){for(var B in D){if(B.toString().indexOf("__")==-1&&B.toString().indexOf(z.attributePrefix)==0){C.push(B)}}}return C}function g(C){var B="";if(C.__cdata!=null){B+="<![CDATA["+C.__cdata+"]]>"}if(C.__text!=null){if(z.escapeMode){B+=s(C.__text)}else{B+=C.__text}}return B}function d(C){var B="";if(C instanceof Object){B+=g(C)}else{if(C!=null){if(z.escapeMode){B+=s(C)}else{B+=C}}}return B}function p(C,B){if(C===""){return B}else{return C+"."+B}}function f(D,G,F,E){var B="";if(D.length==0){B+=o(D,G,F,true)}else{for(var C=0;C<D.length;C++){B+=o(D[C],G,c(D[C]),false);B+=e(D[C],p(E,G));B+=j(D[C],G)}}return B}function e(I,H){var B="";var F=m(I);if(F>0){for(var E in I){if(y(I,E)||(H!=""&&!l(I,E,p(H,E)))){continue}var D=I[E];var G=c(D);if(D==null||D==undefined){B+=o(D,E,G,true)}else{if(D instanceof Object){if(D instanceof Array){B+=f(D,E,G,H)}else{if(D instanceof Date){B+=o(D,E,G,false);B+=D.toISOString();B+=j(D,E)}else{var C=m(D);if(C>0||D.__text!=null||D.__cdata!=null){B+=o(D,E,G,false);B+=e(D,p(H,E));B+=j(D,E)}else{B+=o(D,E,G,true)}}}}else{B+=o(D,E,G,false);B+=d(D);B+=j(D,E)}}}}B+=d(I);return B}this.parseXmlString=function(D){var F=window.ActiveXObject||"ActiveXObject" in window;if(D===undefined){return null}var E;if(window.DOMParser){var G=new window.DOMParser();var B=null;if(!F){try{B=G.parseFromString("INVALID","text/xml").getElementsByTagName("parsererror")[0].namespaceURI}catch(C){B=null}}try{E=G.parseFromString(D,"text/xml");if(B!=null&&E.getElementsByTagNameNS(B,"parsererror").length>0){E=null}}catch(C){E=null}}else{if(D.indexOf("<?")==0){D=D.substr(D.indexOf("?>")+2)}E=new ActiveXObject("Microsoft.XMLDOM");E.async="false";E.loadXML(D)}return E};this.asArray=function(B){if(B===undefined||B==null){return[]}else{if(B instanceof Array){return B}else{return[B]}}};this.toXmlDateTime=function(B){if(B instanceof Date){return B.toISOString()}else{if(typeof(B)==="number"){return new Date(B).toISOString()}else{return null}}};this.asDateTime=function(B){if(typeof(B)=="string"){return a(B)}else{return B}};this.xml2json=function(B){return A(B)};this.xml_str2json=function(B){var C=this.parseXmlString(B);if(C!=null){return this.xml2json(C)}else{return null}};this.json2xml_str=function(B){return e(B,"")};this.json2xml=function(C){var B=this.json2xml_str(C);return this.parseXmlString(B)};this.getVersion=function(){return t}}}))

//MIDI Note numbers
function generateMidiNoteNumbers() {
	var noteLetters = [
		{letter:"C",basePitch:24},
		{letter:"D",basePitch:26},
		{letter:"E",basePitch:28},
		{letter:"F",basePitch:29},
		{letter:"G",basePitch:31},
		{letter:"A",basePitch:33},
		{letter:"B",basePitch:35},
	]
	var octavesToGenerate = [1, 2, 3, 4, 5, 6, 7]

	var finalSet = {
		rest: -1
	}

	octavesToGenerate.forEach(function(octave) {
		noteLetters.forEach(function(letterAndBasePitch) {
			//do the regular
			var key = letterAndBasePitch.letter + octave
			var pitch = letterAndBasePitch.basePitch + (octave * 12)

			finalSet[key] = pitch

			var sharpKey = letterAndBasePitch.letter + "#" + octave
			finalSet[sharpKey] = pitch + 1

			var flatKey = letterAndBasePitch.letter + "b" + octave

			finalSet[flatKey] = pitch - 1
		})
	})

	return finalSet
}

var jsMusicXMLConverter = function() {
	this.output = ""

	this.convertXMLToJSON = function(xml) {
		console.log("Converting XML to JSON")

		//xml.replace(/-/g,'')
		var noDashes = xml.replace(/<(.*?)>/g, function(match) {
			return match.replace(/-/g, "")
		})

		//console.log("No dashes:")
		//console.log(noDashes)

		var jsonConverter = new X2JS()

		var jsonVersion = jsonConverter.xml_str2json(noDashes)

		//console.log("Going to return:")
		//console.log(jsonVersion)

		return jsonVersion
	}

	this.extractTempo = function (part) {
	  console.log("Part: ")
	  console.log(part)

		var firstBar = part.measure[0]
		var directionBpm = 120

		if (firstBar.direction != undefined) {
			console.log("First bar:")

			if (!(firstBar.direction instanceof Array)) {
				firstBar.direction = [firstBar.direction]
			}

			firstBar.direction.forEach(function(dir) {
				var metronomeInfo = dir.directiontype.metronome
				if (metronomeInfo != undefined) {
					directionBpm = Number(metronomeInfo.perminute)
				}
			})
		}
		return directionBpm
	}

	this.convertJSON = function(input) {
		//temp for testing

		if (input == null || input.length == 0) {
			alert("Error: need input")
			return
		}

		//console.log("Going to convert json object:")
		//console.log(input)
		//console.log(JSON.stringify(input))

		//get the part out
		var part = input.scorepartwise.part

    if (!Array.isArray(part.measure)) {
      part.measure = [part.measure]
    }

		var tempo = this.extractTempo(part)

		var transposition = function() {
			var firstBar = part.measure[0]
			var attributes = firstBar.attributes
			if (attributes == null) return 0
			var transposition = attributes.transpose
			if (transposition == null) return 0
			return Number(transposition.chromatic)
		}()

		//grab the time signature
		var time_signature = function() {
			var firstBar = part.measure[0]
			var time = firstBar.attributes.time
			return time.beats + "/" + time.beattype
		}()

		//get the comparison flags
		var isPercussionClef = function() {
			var firstBar = part.measure[0]
			switch (firstBar.attributes.clef.sign) {
			case "percussion":
				return true
			default:
				return false
			}
		}()

		var comparisonFlags = {
			testPitch: true,
			testRhythm: true,
			testDuration: true,
		}

		if (isPercussionClef) {
			comparisonFlags.testPitch = false
			comparisonFlags.testDuration = false
		}

		var beats_in_firstBar = function() {
			var firstBar = part.measure[0]
			var divisions = firstBar.attributes.divisions
			if (firstBar.note instanceof Array != true)
				firstBar.note = [firstBar.note]
			var durationReduction = firstBar.note.reduce(function(acc, item) {
				//console.log("item:")
				//console.log(item);
				return acc + Number(item.duration)
			}, 0)
			//console.log("Duration reduction: " + durationReduction)
			return durationReduction / divisions
		}()

		var countoff = function() {
			switch (time_signature) {
			case "4/4":
				return 8 - beats_in_firstBar
			case "3/4":
				return 6 - beats_in_firstBar
			default:
				return 4
			}
		}()

		console.log("Countoff: " + countoff)

		//get the score info
		var title = input.scorepartwise.work.worktitle
		var author = function() {
			if (input.scorepartwise.identification.creator != undefined)
				return input.scorepartwise.identification.creator.__text

			return ""
		}()

		var copyrightInfo = function() {
			if (input.scorepartwise.identification.rights != undefined) {
				return input.scorepartwise.identification.rights
			}
			return ""
		}()

		console.log("Tempo: ")
		console.log(tempo)
		console.log("Copyright:")
		console.log(copyrightInfo)

		//alternately, should be able to get copyright from
		//val copyrightInfo = input.scorepartwise.identification.rights

		//generated
		var systemsAndNotes = this.getSystemsForPart(time_signature, part)
		var systems = systemsAndNotes.systems
		var notes = systemsAndNotes.notes

		//apply the transposition if needed
		if (transposition != 0) {
			console.log("Original notes:")
			console.log(notes)
			notes = notes.map(function(item) {
				return {
					noteNumber: item.noteNumber + transposition,
					duration: item.duration,
					id: item.id
				}
			})
			console.log("Transposed:")
			console.log(notes)
		}

		var generatedEasyScoreInfo = {
			title: title,
			author: author,
			time_signature: time_signature,
			count_off: countoff,
			tempo: tempo,
			comparisonFlags: comparisonFlags,
			copyrightInfo: copyrightInfo,
			systems: systems,
			notes: notes
		}

		return {
			easyScoreInfo: generatedEasyScoreInfo,
		}
	}

	this.getMidiInfoFromNoteObject = function(note, divisions) {

		var noteNumbers = generateMidiNoteNumbers()

		var key = function() {
			if (note.rest != undefined) {
				return "rest"
			}

			if (note.unpitched != undefined) {
				return note.unpitched.displaystep + "" + note.unpitched.displayoctave
			}

			var step = note.pitch.step

			step += function() {
				if (note.pitch != undefined && note.pitch.alter != undefined) {
					switch (Number(note.pitch.alter)) {
					case 1:
						return "#"
					case -1:
						return "b"
					default:
						return ""
					}
				}
				return ""
			}()

			return step + "" + note.pitch.octave
		}()

		return {
			noteNumber: noteNumbers[key],
			duration: (Number(note.duration) / divisions)
		}
	}

	this.getSystemsForPart = function(time_signature, part) {
		var toRetSystems = []

		var measures = part.measure

		var createSystemObject = this.createSystemObject

		var curSystem = null

		var measureTs = 0

		var divisions = 1

		var noteId = 0

		var getMidiInfoFromNoteObject = this.getMidiInfoFromNoteObject

		var clef = "treble"

		measures.forEach(function(measure) {
			//get the print attributes
			var printAttributes = measure.print
			//console.log("Print attributes:")
			//console.log(printAttributes)

			if (measure.attributes != undefined && measure.attributes.divisions != undefined)
				divisions = Number(measure.attributes.divisions)

			if (printAttributes != undefined) {
				if (curSystem != null) {
					//push it
					toRetSystems.push(curSystem)
					curSystem = null
				}

				if (curSystem == null) {
					//create a new system object
					curSystem = createSystemObject()
				}
			}

			var bar = {
				voices: {},
				extra_attributes: {},
			}

			if (toRetSystems.length == 0 && curSystem.bars.length == 0) {
				//try to get the extra attributes
				var ts = measure.attributes.time.beats + "/" + measure.attributes.time.beattype

				measureTs = measure.attributes.time.beats

				clef = function() {
					switch (measure.attributes.clef.sign) {
					case "G":
						return "treble"
					case "C":
						//TODO: tenor clef
						return "alto"
					case "F":
						return "bass"
					case "percussion":
						return "percussion"
					default:
						return "treble"
					}

				}()

				var keysig = function() {
					switch (measure.attributes.key.fifths) {
					case "0":
						return "C"
					case "-1":
						return "F"
					case "-2":
						return "Bb"
					case "-3":
						return "Eb"
					case "-4":
						return "Ab"
					case "-5":
						return "Db"
					case "-6":
						return "Gb"
					case "1":
						return "G"
					case "2":
						return "D"
					case "3":
						return "A"
					case "4":
						return "E"
					case "5":
						return "B"
					case "6":
						return "F#"
					case "7":
						return "C#"
					}
				}()

				bar.extra_attributes = {
					time_signature: ts,
					clef: clef,
					key_signature: keysig,
				}
			}

			var repeatInfo = function() {
				var barlines = measure.barline
				if (barlines == undefined) return []

				var toRet = []

				if (!(barlines instanceof Array)) {
					barlines = [barlines]
				}

				barlines.forEach(function(barline) {
					var repeatType = ""

					if (barline.repeat == undefined) return

					switch (barline.repeat._direction) {
					case "forward":
						repeatType = "begin"
						break
					case "backward":
					default:
						repeatType = "end"
					}

					toRet.push({
						repeatType: repeatType
					})

				})

				return toRet
			}()

			bar.extra_attributes.barlines = repeatInfo

      var allNotes = measure.note

			if (allNotes.forEach == undefined) {
				allNotes = [allNotes]
			}

			//split them up into different voices
			var voices = allNotes.reduce(function(acc,note){
        var voiceNumber = note.voice
        if (acc[voiceNumber] == undefined) {
          acc[voiceNumber] = {notes:[]}
        }
        acc[voiceNumber].notes.push(note)
        return acc
			},{})

      console.log("Voices:")
      console.log(voices)

      Object.keys(voices).forEach(function(voiceKey) {

        bar.voices[voiceKey] = {
         groups: []
        }

        console.log("Key: " + voiceKey)

        var notes = voices[voiceKey].notes

        var group = {
          notes: []
        }

        var durationMap = {
          0.5: "8",
          1: "q",
          2: "h",
          4: "w"
        }

        notes.forEach(function(note) {
          if (note._printobject != undefined) {
            if (note._printobject == "no") {
              return
            }
          }
          if (note.beam != undefined) {
            if (note.beam.__text == "begin") {
              //push the old and make a new
              if (group != null && group.notes.length > 0)
                bar.groups.push(group)
              group = null
            }
          }

          if (group == null) {
            group = {
              notes: []
            }
          }

          var key = function() {

            var notePitch = null
            var noteOctave = null

            if (note.rest != undefined) {
              if (note.duration / divisions == 4.0) {
                if (clef == "treble" || clef == "percussion") {
                  notePitch = "D"
                  noteOctave = "5"
                  //return "D5"
                } else if (clef == "alto") {
                  notePitch = "E"
                  noteOctave = "4"
                  //return "E4"
                } else if (clef == "bass") {
                  notePitch = "F"
                  noteOctave = "3"
                  //return "F3"
                }
              } else {
                //console.warn("Rest duration: " + note.duration)
                if (clef == "treble" || clef == "percussion") {
                  notePitch = "B"
                  noteOctave = "4"
                  //return "B4"
                } else if (clef == "alto") {
                  notePitch = "C"
                  noteOctave = "4"
                  //return "C4"
                } else if (clef == "bass") {
                  notePitch = "D"
                  noteOctave = "3"
                  //return "D3"
                }
              }

            }

            if (note.unpitched != undefined) {
              notePitch = note.unpitched.displaystep
              noteOctave = note.unpitched.displayoctave
              //return note.unpitched.displaystep + "" + note.unpitched.displayoctave
            }

            var step = ""
            var accidental = ""

            if (note.pitch != undefined) {

              var step = note.pitch.step

              var accidental = function() {
                if (note.accidental != undefined) {
                  var accidental = note.accidental

                  if (accidental.__text != undefined) {
                    accidental = accidental.__text
                  }

                  switch (accidental) {
                  case "sharp":
                    return "#"
                  case "flat":
                    return "b"
                  case "natural":
                    return "n"
                  default:
                    return ""
                  }
                }
                return ""
              }()
            }


            if (notePitch == null || noteOctave == null) {
              notePitch = step
              noteOctave = note.pitch.octave
            }

            return {
              easyScoreInfo: notePitch + accidental + noteOctave,
              pitch: notePitch,
              octave: noteOctave,
              accidental: accidental,
              rest: note.rest != undefined ? true : false,
              duration: durationMap[note.duration / divisions]
            }

          }()

          var restVal = key.rest ? "/r" : ""

          var noteText = key.easyScoreInfo + "/" + durationMap[key.duration] + restVal

          key.note = noteText

          var attrs = []

          if (note.lyric != undefined) {
            attrs.push({
              key: "textAnnotation",
              value: note.lyric.text
            })
          }

          if (note.stem != undefined) {
            attrs.push({
              key: "stem",
              value: note.stem
            })
          }

          if (note.notehead != undefined) {
            key.notehead = note.notehead
//            attrs.push({
//              key: "notehead",
//              value: note.notehead
//            })
          }

          if (note.notations != undefined) {
            if (note.notations.technical != undefined) {
              if (note.notations.technical.downbow != undefined) {
                attrs.push({
                  key: "bowing",
                  value: "down"
                })
              }
              if (note.notations.technical.upbow != undefined) {
                attrs.push({
                  key: "bowing",
                  value: "up"
                })
              }
            }
          }

          key.attributes = attrs

          var fullNoteId = "note" + noteId
          key.id = fullNoteId

          var midiData = getMidiInfoFromNoteObject(note, divisions)
          midiData.noteId = fullNoteId
          key.midiData = midiData

          key.divisions = divisions
          key.voice = voiceKey


          noteId++

          group.notes.push(key)

          //should we end it and push it?

          if (note.beam != undefined) {
            if (note.beam.__text == "end") {
              //set the stem direction
              group.beam = true
              group.stem_direction = note.stem

              //push the old and make a new
              if (group.notes.length > 0) {
                console.log("Pushing group")
                bar.voices[voiceKey].groups.push(group)
              }
              group = null
            }
          }

        })

        //console.log("Pushing group:")
        //console.log(group)

        if (group != null && group.notes.length > 0) {
          console.log("Pushing group")
          bar.voices[voiceKey].groups.push(group)
        }

      })

			//get the full duration of the bar and put an alternate time signature in if needed
			var calculatedDuration = allNotes.filter(function(note) {
			   return (note.voice == "1")
			}).reduce(function(total, item) {
				return total + Number(item.duration) / divisions
			}, 0)

			if (calculatedDuration != measureTs) {
				if (bar.extra_attributes == undefined)
					bar.extra_attributes = {}
				bar.extra_attributes.alternate_timeSignature = calculatedDuration + "/4"
			}

			//console.log("Bar duration: " + calculatedDuration)

			curSystem.bars.push(bar)
		})

		if (curSystem != null) toRetSystems.push(curSystem)

		console.log("Going to map notes from:")
		console.log(toRetSystems)

		//build an array of the notes


		var toRetNotes = this.extractNotesFromSystems(toRetSystems)

		console.log("Total notes:")
		console.log(toRetNotes.length)

		return {
			systems: toRetSystems,
			notes: toRetNotes
		}
	}

	this.extractNotesFromSystems = function(systems) {
		var toRetNotes = []
		var repeats = []

		systems.forEach(function(system) {
			system.bars.forEach(function(bar) {

				if (bar.extra_attributes.barlines != undefined) {
					var barlines = bar.extra_attributes.barlines
					barlines.forEach(function(barline) {
						if (barline.repeatType != undefined) {
							if (barline.repeatType == "begin") {
								repeats.push({
									open: toRetNotes.length,
									close: null
								})
							}
						}
					})
				}

        Object.keys(bar.voices).forEach(function(voiceKey) {
            var voice = bar.voices[voiceKey]
            var groups = voice.groups

            groups.forEach(function(group) {

              group.notes.forEach(function(note) {
                toRetNotes.push(note.midiData)
              })

            })
        })



				if (bar.extra_attributes.barlines != undefined) {
					barlines.forEach(function(barline) {
						if (barline.repeatType != undefined) {
							if (barline.repeatType == "end") {
								repeats[repeats.length - 1].close = toRetNotes.length //the last note

								//copy the subset of the array
								var repeatedSection = repeats[repeats.length - 1]
								var slice = toRetNotes.slice(repeatedSection.open, repeatedSection.close)

								toRetNotes.push.apply(toRetNotes, slice)
							}
						}
					})
				}
			})
		})

    console.log("Extracted notes: ")
    console.log(toRetNotes)

		return toRetNotes
	}

	this.createSystemObject = function() {
		return {
			bars: []
		}
	}
}
