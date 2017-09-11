// Changes XML to JSON
(function(a,b){if(typeof define==="function"&&define.amd){define([],b);}else{if(typeof exports==="object"){module.exports=b();}else{a.X2JS=b();}}}(this,function(){return function(z){var t="1.2.0";z=z||{};i();u();function i(){if(z.escapeMode===undefined){z.escapeMode=true;}z.attributePrefix=z.attributePrefix||"_";z.arrayAccessForm=z.arrayAccessForm||"none";z.emptyNodeForm=z.emptyNodeForm||"text";if(z.enableToStringFunc===undefined){z.enableToStringFunc=true;}z.arrayAccessFormPaths=z.arrayAccessFormPaths||[];if(z.skipEmptyTextNodesForObj===undefined){z.skipEmptyTextNodesForObj=true;}if(z.stripWhitespaces===undefined){z.stripWhitespaces=true;}z.datetimeAccessFormPaths=z.datetimeAccessFormPaths||[];if(z.useDoubleQuotes===undefined){z.useDoubleQuotes=false;}z.xmlElementsFilter=z.xmlElementsFilter||[];z.jsonPropertiesFilter=z.jsonPropertiesFilter||[];if(z.keepCData===undefined){z.keepCData=false;}}var h={ELEMENT_NODE:1,TEXT_NODE:3,CDATA_SECTION_NODE:4,COMMENT_NODE:8,DOCUMENT_NODE:9};function u(){}function x(B){var C=B.localName;if(C==null){C=B.baseName;}if(C==null||C==""){C=B.nodeName;}return C;}function r(B){return B.prefix;}function s(B){if(typeof(B)=="string"){return B.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");}else{return B;}}function k(B){return B.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,"&");}function w(C,F,D,E){var B=0;for(;B<C.length;B++){var G=C[B];if(typeof G==="string"){if(G==E){break;}}else{if(G instanceof RegExp){if(G.test(E)){break;}}else{if(typeof G==="function"){if(G(F,D,E)){break;}}}}}return B!=C.length;}function n(D,B,C){switch(z.arrayAccessForm){case"property":if(!(D[B] instanceof Array)){D[B+"_asArray"]=[D[B]];}else{D[B+"_asArray"]=D[B];}break;}if(!(D[B] instanceof Array)&&z.arrayAccessFormPaths.length>0){if(w(z.arrayAccessFormPaths,D,B,C)){D[B]=[D[B]];}}}function a(G){var E=G.split(/[-T:+Z]/g);var F=new Date(E[0],E[1]-1,E[2]);var D=E[5].split(".");F.setHours(E[3],E[4],D[0]);if(D.length>1){F.setMilliseconds(D[1]);}if(E[6]&&E[7]){var C=E[6]*60+Number(E[7]);var B=/\d\d-\d\d:\d\d$/.test(G)?"-":"+";C=0+(B=="-"?-1*C:C);F.setMinutes(F.getMinutes()-C-F.getTimezoneOffset());}else{if(G.indexOf("Z",G.length-1)!==-1){F=new Date(Date.UTC(F.getFullYear(),F.getMonth(),F.getDate(),F.getHours(),F.getMinutes(),F.getSeconds(),F.getMilliseconds()));}}return F;}function q(D,B,C){if(z.datetimeAccessFormPaths.length>0){var E=C.split(".#")[0];if(w(z.datetimeAccessFormPaths,D,B,E)){return a(D);}else{return D;}}else{return D;}}function b(E,C,B,D){if(C==h.ELEMENT_NODE&&z.xmlElementsFilter.length>0){return w(z.xmlElementsFilter,E,B,D);}else{return true;}}function A(D,J){if(D.nodeType==h.DOCUMENT_NODE){var K=new Object;var B=D.childNodes;for(var L=0;L<B.length;L++){var C=B.item(L);if(C.nodeType==h.ELEMENT_NODE){var I=x(C);K[I]=A(C,I);}}return K;}else{if(D.nodeType==h.ELEMENT_NODE){var K=new Object;K.__cnt=0;var B=D.childNodes;for(var L=0;L<B.length;L++){var C=B.item(L);var I=x(C);if(C.nodeType!=h.COMMENT_NODE){var H=J+"."+I;if(b(K,C.nodeType,I,H)){K.__cnt++;if(K[I]==null){K[I]=A(C,H);n(K,I,H);}else{if(K[I]!=null){if(!(K[I] instanceof Array)){K[I]=[K[I]];n(K,I,H);}}(K[I])[K[I].length]=A(C,H);}}}}for(var E=0;E<D.attributes.length;E++){var F=D.attributes.item(E);K.__cnt++;K[z.attributePrefix+F.name]=F.value;}var G=r(D);if(G!=null&&G!=""){K.__cnt++;K.__prefix=G;}if(K["#text"]!=null){K.__text=K["#text"];if(K.__text instanceof Array){K.__text=K.__text.join("\n");}if(z.stripWhitespaces){K.__text=K.__text.trim();}delete K["#text"];if(z.arrayAccessForm=="property"){delete K["#text_asArray"];}K.__text=q(K.__text,I,J+"."+I);}if(K["#cdata-section"]!=null){K.__cdata=K["#cdata-section"];delete K["#cdata-section"];if(z.arrayAccessForm=="property"){delete K["#cdata-section_asArray"];}}if(K.__cnt==0&&z.emptyNodeForm=="text"){K="";}else{if(K.__cnt==1&&K.__text!=null){K=K.__text;}else{if(K.__cnt==1&&K.__cdata!=null&&!z.keepCData){K=K.__cdata;}else{if(K.__cnt>1&&K.__text!=null&&z.skipEmptyTextNodesForObj){if((z.stripWhitespaces&&K.__text=="")||(K.__text.trim()=="")){delete K.__text;}}}}}delete K.__cnt;if(z.enableToStringFunc&&(K.__text!=null||K.__cdata!=null)){K.toString=function(){return(this.__text!=null?this.__text:"")+(this.__cdata!=null?this.__cdata:"");};}return K;}else{if(D.nodeType==h.TEXT_NODE||D.nodeType==h.CDATA_SECTION_NODE){return D.nodeValue;}}}}function o(I,F,H,C){var E="<"+((I!=null&&I.__prefix!=null)?(I.__prefix+":"):"")+F;if(H!=null){for(var G=0;G<H.length;G++){var D=H[G];var B=I[D];if(z.escapeMode){B=s(B);}E+=" "+D.substr(z.attributePrefix.length)+"=";if(z.useDoubleQuotes){E+='"'+B+'"';}else{E+="'"+B+"'";}}}if(!C){E+=">";}else{E+="/>";}return E;}function j(C,B){return"</"+(C.__prefix!=null?(C.__prefix+":"):"")+B+">";}function v(C,B){return C.indexOf(B,C.length-B.length)!==-1;}function y(C,B){if((z.arrayAccessForm=="property"&&v(B.toString(),("_asArray")))||B.toString().indexOf(z.attributePrefix)==0||B.toString().indexOf("__")==0||(C[B] instanceof Function)){return true;}else{return false;}}function m(D){var C=0;if(D instanceof Object){for(var B in D){if(y(D,B)){continue;}C++;}}return C;}function l(D,B,C){return z.jsonPropertiesFilter.length==0||C==""||w(z.jsonPropertiesFilter,D,B,C);}function c(D){var C=[];if(D instanceof Object){for(var B in D){if(B.toString().indexOf("__")==-1&&B.toString().indexOf(z.attributePrefix)==0){C.push(B);}}}return C;}function g(C){var B="";if(C.__cdata!=null){B+="<![CDATA["+C.__cdata+"]]>";}if(C.__text!=null){if(z.escapeMode){B+=s(C.__text);}else{B+=C.__text;}}return B;}function d(C){var B="";if(C instanceof Object){B+=g(C);}else{if(C!=null){if(z.escapeMode){B+=s(C);}else{B+=C;}}}return B;}function p(C,B){if(C===""){return B;}else{return C+"."+B;}}function f(D,G,F,E){var B="";if(D.length==0){B+=o(D,G,F,true);}else{for(var C=0;C<D.length;C++){B+=o(D[C],G,c(D[C]),false);B+=e(D[C],p(E,G));B+=j(D[C],G);}}return B;}function e(I,H){var B="";var F=m(I);if(F>0){for(var E in I){if(y(I,E)||(H!=""&&!l(I,E,p(H,E)))){continue;}var D=I[E];var G=c(D);if(D==null||D==undefined){B+=o(D,E,G,true);}else{if(D instanceof Object){if(D instanceof Array){B+=f(D,E,G,H);}else{if(D instanceof Date){B+=o(D,E,G,false);B+=D.toISOString();B+=j(D,E);}else{var C=m(D);if(C>0||D.__text!=null||D.__cdata!=null){B+=o(D,E,G,false);B+=e(D,p(H,E));B+=j(D,E);}else{B+=o(D,E,G,true);}}}}else{B+=o(D,E,G,false);B+=d(D);B+=j(D,E);}}}}B+=d(I);return B;}this.parseXmlString=function(D){var F=window.ActiveXObject||"ActiveXObject" in window;if(D===undefined){return null;}var E;if(window.DOMParser){var G=new window.DOMParser();var B=null;if(!F){try{B=G.parseFromString("INVALID","text/xml").getElementsByTagName("parsererror")[0].namespaceURI;}catch(C){B=null;}}try{E=G.parseFromString(D,"text/xml");if(B!=null&&E.getElementsByTagNameNS(B,"parsererror").length>0){E=null;}}catch(C){E=null;}}else{if(D.indexOf("<?")==0){D=D.substr(D.indexOf("?>")+2);}E=new ActiveXObject("Microsoft.XMLDOM");E.async="false";E.loadXML(D);}return E;};this.asArray=function(B){if(B===undefined||B==null){return[];}else{if(B instanceof Array){return B;}else{return[B];}}};this.toXmlDateTime=function(B){if(B instanceof Date){return B.toISOString();}else{if(typeof(B)==="number"){return new Date(B).toISOString();}else{return null;}}};this.asDateTime=function(B){if(typeof(B)=="string"){return a(B);}else{return B;}};this.xml2json=function(B){return A(B);};this.xml_str2json=function(B){var C=this.parseXmlString(B);if(C!=null){return this.xml2json(C);}else{return null;}};this.json2xml_str=function(B){return e(B,"");};this.json2xml=function(C){var B=this.json2xml_str(C);return this.parseXmlString(B);};this.getVersion=function(){return t;};};}));


var jsMusicXMLConverter = function() {
    this.output = ""

    this.convertXMLToJSON = function(xml) {
      console.log("Converting XML to JSON")

      var noDashes = xml.replace(/-/g,'')

      console.log("No dashes:")
      console.log(noDashes)

      var jsonConverter = new X2JS()

      var jsonVersion = jsonConverter.xml_str2json(noDashes)

      console.log("Going to return:")
      console.log(jsonVersion)

      return jsonVersion
    }

    this.convertJSONFromTestInput = function(testName,infoAttributes) {
      var input = testOptions[testName]
      return this.convertJSON(input,infoAttributes)
    }

    this.convertJSON = function(input) {
      //temp for testing

      if (input == null || input.length == 0) {
        alert("Error: need input"); return
        //input = JSON.parse(testInput3)
      }

      console.log("Going to convert json object:")
      console.log(input)
      console.log(JSON.stringify(input))


      this.writeBoilerplate()

      //get the part out
      var part = input.scorepartwise.part

      var tempo = //infoAttributes.tempo
        function() {
          var firstBar = part.measure[0]
          if (firstBar.direction != undefined) {
            console.log("First bar:")
            var metronomeInfo = firstBar.direction.directiontype.metronome
            if (metronomeInfo != undefined) {
              return Number(metronomeInfo.perminute)
            }
          }
          return 120
        }()

      //grab the time signature
      var time_signature = function() {
        var firstBar = part.measure[0]
        var time = firstBar.attributes.time
        return time.beats + '/' + time.beattype
        return "4/4"
      }()

      var beats_in_firstBar = function() {
        var firstBar = part.measure[0]
        var divisions = firstBar.attributes.divisions
        if (firstBar.note instanceof Array != true)
          firstBar.note = [firstBar.note]
        var durationReduction = firstBar.note.reduce(function(acc, item) {
          console.log("item:")
          console.log(item);
          return acc + Number(item.duration)
        },0)
        console.log("Duration reduction: " + durationReduction)
        return durationReduction / divisions
      }()
      var countoff = function() {
        switch(time_signature) {
          case "4/4":
            return 8 - beats_in_firstBar
            break;
          case "3/4":
            return 6 - beats_in_firstBar
          default:
            break;
        }
        return 4
      }()
      console.log("Countoff: " + countoff)



      var notes = this.getNotesFromPart(part)

      var generatedKotlinInfo = {
        tempo: tempo,
        count_off: countoff,
        time_signature: function(fullTs) {
          return fullTs.split('/')[0]
        }(time_signature),
        notes: notes
      }

      this.writeKotlinFunction(JSON.stringify(generatedKotlinInfo, null, 4))

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
      var systems = this.getSystemsForPart(time_signature,part)

      var generatedEasyScoreInfo = {
        title: title,
        author: author,
        time_signature: time_signature,
        tempo: tempo,
        copyrightInfo: copyrightInfo,
        systems: systems
      }

      return {
        kotlinInfo: generatedKotlinInfo,
        easyScoreInfo: generatedEasyScoreInfo,
      }

      //this.writeEasyScoreFunction(JSON.stringify(generatedEasyScoreInfo, null, 4))

      //return this.output
    }

    this.getNotesFromPart = function(part){
      var toRet = []

      var divisions = 1

      var measures = part.measure
      measures.forEach(function(measure) {

        if (measure.attributes != undefined && measure.attributes.divisions != undefined)
          divisions = Number(measure.attributes.divisions)

        var notes = measure.note

        if (notes.forEach == undefined) {
          notes = [notes]
        }

        notes.forEach(function(note) {
          //get note number from pitch info
          var noteNumbers = { rest: -1, 'C4': 60, 'D4': 62, 'E4': 64, 'F4': 65, 'G4': 67, 'A4': 69, 'B4': 71, 'C5': 72,
                                         'C#4': 61, 'D#4': 63, 'F#4': 66, 'G#4': 68, 'A#4': 70, 'C#5': 73,
                                        'D5': 74, 'E5': 76, 'F5': 77, 'G5': 79, 'A5': 81, 'B5': 83, 'C6': 84,
           }



          var key = function() {
            if (note.rest != undefined) {
              return "rest"
            }

            if (note.unpitched != undefined) {
              return note.unpitched.displaystep + "" + note.unpitched.displayoctave
            }

            var step = note.pitch.step

            step += function() {
              if (note.accidental != undefined) {
              switch(note.accidental) {
                case "sharp":
                  return "#"
                case "flat":
                  return 'b'
                default:
                  return ''
              }
              }
              return ''
            }()



            return  step + "" + note.pitch.octave
          }()

          toRet.push({
            noteNumber: noteNumbers[key],
            duration: (Number(note.duration) / divisions)
          })
        })
      })

      return toRet
    }

    this.getSystemsForPart = function(time_signature,part) {
      var toRet = []
      var measures = part.measure

      var createSystemObject = this.createSystemObject

      var curSystem = null

      var measureTs = 0

      var divisions = 1


      var noteId = 0

      measures.forEach(function(measure) {
        //get the print attributes
        var printAttributes = measure.print
        console.log("Print attributes:")
        console.log(printAttributes)

        if (measure.attributes != undefined && measure.attributes.divisions != undefined)
          divisions = Number(measure.attributes.divisions)

        if (printAttributes != undefined) {
          if (curSystem != null) {
            //push it
            toRet.push(curSystem)
            curSystem = null
          }

          if (curSystem == null) {
            //create a new system object
            curSystem = createSystemObject()
          }
        }

        var bar = {
          groups: []
        }

        if (toRet.length == 0 && curSystem.bars.length == 0) {
          //try to get the extra attributes
          var ts = measure.attributes.time.beats + "/" + measure.attributes.time.beattype

          measureTs = measure.attributes.time.beats

          var clef = function() {
            switch(measure.attributes.clef.sign) {
              case "G":
                return "treble"
              case "percussion":
                return "percussion"
              default:
                return "treble"
            }

          }()

          var keysig = function() {
            if (measure.attributes.key.fifths == "0") {
              return "C"
            }
          }()

          bar.extra_attributes = {
            time_signature: ts,
            clef: clef,
            key_signature: keysig
          }
        }

        var group = {
          notes : []
        }

        //add the groups
        var notes = measure.note

        if (notes.forEach == undefined) {
          notes = [notes]
        }

        var durationMap = {
          0.5: '8',
          1: 'q',
          2: 'h',
          4: 'w'
        }

        notes.forEach(function(note) {
          if (note.beam != undefined) {
            if (note.beam.__text == 'begin') {
              //push the old and make a new
              if (group.notes.length > 0)
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

            if (note.rest != undefined) {
              if (note.duration / divisions == 4.0) {
                return "D5"
              }
              //console.warn("Rest duration: " + note.duration)
              return "B4"
            }

            if (note.unpitched != undefined) {
              return note.unpitched.displaystep + "" + note.unpitched.displayoctave
            }


            var step = note.pitch.step

            step += function() {
              if (note.accidental != undefined) {
              var accidental = note.accidental

              if (accidental.__text != undefined) {
                accidental = accidental.__text
              }

              switch(accidental) {
                case "sharp":
                  return "#"
                case "flat":
                  return 'b'
                default:
                  return ''
              }
              }
              return ''
            }()

            return  step + "" + note.pitch.octave
          }()

          var restVal = note.rest != undefined ? "/r" : ""

          var noteText = key + "/" + durationMap[note.duration / divisions] + restVal

          var attrs = []

          if (note.lyric != undefined) {
            attrs.push(
            {
              key: "textAnnotation",
              value: note.lyric.text
            })
          }

          if (note.notations != undefined) {
            if (note.notations.technical != undefined) {
              if (note.notations.technical.downbow != undefined) {
                attrs.push(
                {
                  key: "bowing",
                  value: "down"
                }
                )
              }
              if (note.notations.technical.upbow != undefined) {
                attrs.push(
                {
                  key: "bowing",
                  value: "up"
                }
                )
              }
            }
          }

          var noteObj = {
            note: noteText,
            id: 'note' + noteId,
            attributes: attrs
          }

          noteId++

          group.notes.push(noteObj)

          //should we end it and push it?

          if (note.beam != undefined) {
            if (note.beam.__text == 'end') {
              //set the stem direction
              group.beam = true
              group.stem_direction = note.stem

              //push the old and make a new
              if (group.notes.length > 0)
                bar.groups.push(group)
              group = null
            }
          }

        })

        console.log("Pushing group:")
        console.log(group)

        if (group != null)
          bar.groups.push(group)


        //get the full duration of the bar and put an alternate time signature in if needed
        var calculatedDuration = notes.reduce(function(total, item) {
          return total + Number(item.duration) / divisions
        },0)

        if (calculatedDuration != measureTs) {
          if (bar.extra_attributes == undefined)
            bar.extra_attributes = {}
          bar.extra_attributes.alternate_timeSignature = calculatedDuration + '/4'
        }

        console.log("Bar duration: " + calculatedDuration)


        curSystem.bars.push(bar)
      })

      if (curSystem != null) toRet.push(curSystem)

      return toRet
    }

    this.createSystemObject = function() {
      return {
        bars: []
      }
    }

    this.writeEasyScoreFunction = function(content) {
      this.output += "function generateExerciseEasyScoreCode() {\n"
      this.output += "return "
      this.output += content
      this.output += "}\n\n"
      this.output += "window.generateExerciseEasyScoreCode = generateExerciseEasyScoreCode\n"
    }

    this.writeKotlinFunction = function(content) {
      this.output += "function generateExerciseForKotlin() {\n"
      this.output += "return "
      this.output += content
      this.output += "}\n\n"
      this.output += "window.generateExerciseForKotlin = generateExerciseForKotlin\n"
    }

    this.writeBoilerplate = function() {
      this.output += "window.durations = {q: 1.0,h: 2.0,w: 4.0 }\n\n\n"
    }
  }



var testInput = '{"scorepartwise":{"work":{"worktitle":"Mary Had A Little Lamb"},"identification":{"creator":{"_type":"composer","__text":"Traditional"},"encoding":{"software":"MuseScore 2.0.3","encodingdate":"20170709","supports":[{"_element":"accidental","_type":"yes"},{"_element":"beam","_type":"yes"},{"_element":"print","_attribute":"newpage","_type":"yes","_value":"yes"},{"_element":"print","_attribute":"newsystem","_type":"yes","_value":"yes"},{"_element":"stem","_type":"yes"}]}},"defaults":{"scaling":{"millimeters":"7.05556","tenths":"40"},"pagelayout":{"pageheight":"1584","pagewidth":"1224","pagemargins":[{"leftmargin":"56.6929","rightmargin":"56.6929","topmargin":"56.6929","bottommargin":"113.386","_type":"even"},{"leftmargin":"56.6929","rightmargin":"56.6929","topmargin":"56.6929","bottommargin":"113.386","_type":"odd"}]},"wordfont":{"_fontfamily":"FreeSerif","_fontsize":"10"},"lyricfont":{"_fontfamily":"FreeSerif","_fontsize":"11"}},"credit":[{"creditwords":{"_defaultx":"612","_defaulty":"1527.31","_justify":"center","_valign":"top","_fontsize":"24","__text":"Mary Had A Little Lamb"},"_page":"1"},{"creditwords":{"_defaultx":"1167.31","_defaulty":"1427.31","_justify":"right","_valign":"bottom","_fontsize":"12","__text":"Traditional"},"_page":"1"}],"partlist":{"scorepart":{"partname":"Piano","partabbreviation":"Pno.","scoreinstrument":{"instrumentname":"Piano","_id":"P1I1"},"mididevice":{"_id":"P1I1","_port":"1"},"midiinstrument":{"midichannel":"1","midiprogram":"1","volume":"78.7402","pan":"0","_id":"P1I1"},"_id":"P1"}},"part":{"measure":[{"print":{"systemlayout":{"systemmargins":{"leftmargin":"0.00","rightmargin":"0.00"},"topsystemdistance":"170.00"}},"attributes":{"divisions":"1","key":{"fifths":"0"},"time":{"beats":"4","beattype":"4"},"clef":{"sign":"G","line":"2"}},"note":[{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"75.17","_defaulty":"40.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"105.15","_defaulty":"45.00"},{"pitch":{"step":"C","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"135.13","_defaulty":"50.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"165.11","_defaulty":"45.00"}],"_number":"1","_width":"196.69"},{"note":[{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"40.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"43.49","_defaulty":"40.00"},{"pitch":{"step":"E","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"74.62","_defaulty":"40.00"}],"_number":"2","_width":"126.97"},{"note":[{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"45.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"43.49","_defaulty":"45.00"},{"pitch":{"step":"D","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"74.62","_defaulty":"45.00"}],"_number":"3","_width":"126.97"},{"note":[{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"40.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"43.49","_defaulty":"30.00"},{"pitch":{"step":"G","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"74.62","_defaulty":"30.00"}],"_number":"4","_width":"126.97"},{"note":[{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"40.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"44.08","_defaulty":"45.00"},{"pitch":{"step":"C","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"76.16","_defaulty":"50.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"108.24","_defaulty":"45.00"}],"_number":"5","_width":"141.92"},{"note":[{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"40.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"44.08","_defaulty":"40.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"76.16","_defaulty":"40.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"108.24","_defaulty":"40.00"}],"_number":"6","_width":"141.92"},{"note":[{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"45.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"44.08","_defaulty":"45.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"76.16","_defaulty":"40.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"108.24","_defaulty":"45.00"}],"_number":"7","_width":"141.92"},{"note":{"pitch":{"step":"C","octave":"4"},"duration":"4","voice":"1","type":"whole","_defaultx":"12.00","_defaulty":"50.00"},"barline":{"barstyle":"lightheavy","_location":"right"},"_number":"8","_width":"107.24"}],"_id":"P1"}}}'
var testInput2 = '{"scorepartwise":{"work":{"worktitle":"A Tisket A Tasket, C major, treble clef"},"identification":{"encoding":{"software":"MuseScore 2.0.3","encodingdate":"20170708","supports":[{"_element":"accidental","_type":"yes"},{"_element":"beam","_type":"yes"},{"_element":"print","_attribute":"newpage","_type":"yes","_value":"yes"},{"_element":"print","_attribute":"newsystem","_type":"yes","_value":"yes"},{"_element":"stem","_type":"yes"}]}},"defaults":{"scaling":{"millimeters":"7.05556","tenths":"40"},"pagelayout":{"pageheight":"1584","pagewidth":"1224","pagemargins":[{"leftmargin":"56.6929","rightmargin":"56.6929","topmargin":"56.6929","bottommargin":"113.386","_type":"even"},{"leftmargin":"56.6929","rightmargin":"56.6929","topmargin":"56.6929","bottommargin":"113.386","_type":"odd"}]},"wordfont":{"_fontfamily":"FreeSerif","_fontsize":"10"},"lyricfont":{"_fontfamily":"FreeSerif","_fontsize":"11"}},"credit":{"creditwords":{"_defaultx":"612","_defaulty":"1527.31","_justify":"center","_valign":"top","_fontsize":"24","__text":"A Tisket A Tasket, C major, treble clef"},"_page":"1"},"partlist":{"scorepart":{"partname":"Piano","partabbreviation":"Pno.","scoreinstrument":{"instrumentname":"Piano","_id":"P1I1"},"mididevice":{"_id":"P1I1","_port":"1"},"midiinstrument":{"midichannel":"1","midiprogram":"1","volume":"78.7402","pan":"0","_id":"P1I1"},"_id":"P1"}},"part":{"measure":[{"print":{"systemlayout":{"systemmargins":{"leftmargin":"0.00","rightmargin":"0.00"},"topsystemdistance":"170.00"}},"attributes":{"divisions":"1","key":{"fifths":"0"},"time":{"beats":"4","beattype":"4"},"clef":{"sign":"G","line":"2"}},"note":{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"75.17","_defaulty":"30.00"},"_number":"0","_implicit":"yes","_width":"106.91"},{"note":[{"pitch":{"step":"G","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"12.00","_defaulty":"30.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"52.70","_defaulty":"40.00"},{"pitch":{"step":"A","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"77.91","_defaulty":"25.00"}],"_number":"1","_width":"104.72"},{"note":[{"pitch":{"step":"G","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"12.00","_defaulty":"30.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"52.70","_defaulty":"40.00"},{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"77.91","_defaulty":"35.00"}],"_number":"2","_width":"104.72"},{"note":[{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"30.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"38.61","_defaulty":"30.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"65.21","_defaulty":"40.00"},{"pitch":{"step":"A","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"91.82","_defaulty":"25.00"}],"_number":"3","_width":"120.03"},{"note":[{"pitch":{"step":"G","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"12.00","_defaulty":"30.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"52.70","_defaulty":"40.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"77.91","_defaulty":"40.00"}],"_number":"4","_width":"104.72"},{"note":[{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"35.00"},{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"38.61","_defaulty":"35.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"65.21","_defaulty":"45.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"91.82","_defaulty":"45.00"}],"_number":"5","_width":"120.03"},{"note":[{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"35.00"},{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"38.61","_defaulty":"35.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"65.21","_defaulty":"45.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"91.82","_defaulty":"45.00"}],"_number":"6","_width":"120.03"},{"note":[{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"30.00"},{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"38.61","_defaulty":"35.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"65.21","_defaulty":"40.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"91.82","_defaulty":"45.00"}],"_number":"7","_width":"120.03"},{"note":[{"pitch":{"step":"E","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"12.00","_defaulty":"40.00"},{"pitch":{"step":"C","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"52.70","_defaulty":"50.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"77.91","_defaulty":"30.00"}],"_number":"8","_width":"104.72"},{"note":[{"pitch":{"step":"G","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"12.00","_defaulty":"30.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"52.70","_defaulty":"40.00"},{"pitch":{"step":"A","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"77.91","_defaulty":"25.00"}],"_number":"9","_width":"104.72"},{"print":{"systemlayout":{"systemmargins":{"leftmargin":"0.00","rightmargin":"0.00"},"systemdistance":"150.00"},"_newsystem":"yes"},"note":[{"pitch":{"step":"G","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"49.07","_defaulty":"30.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"104.82","_defaulty":"40.00"},{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"139.44","_defaulty":"35.00"}],"_number":"10","_width":"175.65"},{"note":[{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"30.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"49.08","_defaulty":"30.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"86.16","_defaulty":"40.00"},{"pitch":{"step":"A","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"123.24","_defaulty":"25.00"}],"_number":"11","_width":"161.92"},{"note":[{"pitch":{"step":"G","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"12.00","_defaulty":"30.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"71.32","_defaulty":"40.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"108.17","_defaulty":"40.00"}],"_number":"12","_width":"146.61"},{"note":[{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"35.00"},{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"49.08","_defaulty":"35.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"86.16","_defaulty":"45.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"123.24","_defaulty":"45.00"}],"_number":"13","_width":"161.92"},{"note":[{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"35.00"},{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"49.08","_defaulty":"35.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"86.16","_defaulty":"45.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"123.24","_defaulty":"45.00"}],"_number":"14","_width":"161.92"},{"note":[{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"30.00"},{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"49.08","_defaulty":"35.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"86.16","_defaulty":"40.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"123.24","_defaulty":"45.00"}],"_number":"15","_width":"161.92"},{"note":[{"pitch":{"step":"E","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"12.00","_defaulty":"40.00"},{"pitch":{"step":"C","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"70.85","_defaulty":"50.00"}],"barline":{"barstyle":"lightheavy","_location":"right"},"_number":"16","_width":"140.67"}],"_id":"P1"}}}'

// in 3/4
var testInput3 = '{"scorepartwise":{"work":{"worktitle":"Good Morning To You"},"identification":{"creator":{"_type":"composer","__text":"Ernst Richter"},"encoding":{"software":"MuseScore 2.0.3","encodingdate":"20170709","supports":[{"_element":"accidental","_type":"yes"},{"_element":"beam","_type":"yes"},{"_element":"print","_attribute":"newpage","_type":"yes","_value":"yes"},{"_element":"print","_attribute":"newsystem","_type":"yes","_value":"yes"},{"_element":"stem","_type":"yes"}]}},"defaults":{"scaling":{"millimeters":"7.05556","tenths":"40"},"pagelayout":{"pageheight":"1683.36","pagewidth":"1190.88","pagemargins":[{"leftmargin":"56.6929","rightmargin":"56.6929","topmargin":"56.6929","bottommargin":"113.386","_type":"even"},{"leftmargin":"56.6929","rightmargin":"56.6929","topmargin":"56.6929","bottommargin":"113.386","_type":"odd"}]},"wordfont":{"_fontfamily":"FreeSerif","_fontsize":"10"},"lyricfont":{"_fontfamily":"FreeSerif","_fontsize":"11"}},"credit":[{"creditwords":{"_defaultx":"595.44","_defaulty":"1626.67","_justify":"center","_valign":"top","_fontsize":"24","__text":"Good Morning To You"},"_page":"1"},{"creditwords":{"_defaultx":"1134.19","_defaulty":"1526.67","_justify":"right","_valign":"bottom","_fontsize":"12","__text":"Ernst Richter"},"_page":"1"}],"partlist":{"scorepart":{"partname":"Piano","partabbreviation":"Pno.","scoreinstrument":{"instrumentname":"Piano","_id":"P1I1"},"mididevice":{"_id":"P1I1","_port":"1"},"midiinstrument":{"midichannel":"1","midiprogram":"1","volume":"78.7402","pan":"0","_id":"P1I1"},"_id":"P1"}},"part":{"measure":[{"print":{"systemlayout":{"systemmargins":{"leftmargin":"0.00","rightmargin":"0.00"},"topsystemdistance":"170.00"}},"attributes":{"divisions":"1","key":{"fifths":"0"},"time":{"beats":"3","beattype":"4"},"clef":{"sign":"G","line":"2"}},"note":{"pitch":{"step":"C","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"75.17","_defaulty":"50.00"},"_number":"0","_implicit":"yes","_width":"108.02"},{"note":[{"pitch":{"step":"C","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"50.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"41.05","_defaulty":"40.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"70.09","_defaulty":"30.00"}],"_number":"1","_width":"100.74"},{"note":[{"pitch":{"step":"C","octave":"5"},"duration":"2","voice":"1","type":"half","stem":"down","_defaultx":"12.00","_defaulty":"15.00"},{"pitch":{"step":"C","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"56.34","_defaulty":"50.00"}],"_number":"2","_width":"85.43"},{"note":[{"pitch":{"step":"C","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"50.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"41.05","_defaulty":"40.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"70.09","_defaulty":"30.00"}],"_number":"3","_width":"100.74"},{"note":[{"pitch":{"step":"C","octave":"5"},"duration":"2","voice":"1","type":"half","stem":"down","_defaultx":"12.00","_defaulty":"15.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"56.34","_defaulty":"30.00"}],"_number":"4","_width":"85.43"},{"note":[{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"30.00"},{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"41.05","_defaulty":"35.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"70.09","_defaulty":"45.00"}],"_number":"5","_width":"100.74"},{"note":[{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"40.00"},{"pitch":{"step":"C","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"41.05","_defaulty":"50.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"70.09","_defaulty":"30.00"}],"_number":"6","_width":"100.74"},{"note":[{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"30.00"},{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"41.05","_defaulty":"35.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"70.09","_defaulty":"45.00"}],"_number":"7","_width":"100.74"},{"note":[{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"40.00"},{"pitch":{"step":"C","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"43.71","_defaulty":"50.00"},{"pitch":{"step":"C","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"75.43","_defaulty":"50.00"}],"_number":"8","_width":"108.74"},{"note":[{"pitch":{"step":"C","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"50.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"41.05","_defaulty":"40.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"70.09","_defaulty":"30.00"}],"_number":"9","_width":"100.74"},{"note":[{"pitch":{"step":"C","octave":"5"},"duration":"2","voice":"1","type":"half","stem":"down","_defaultx":"12.00","_defaulty":"15.00"},{"pitch":{"step":"A","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"56.34","_defaulty":"25.00"}],"_number":"10","_width":"85.43"},{"print":{"systemlayout":{"systemmargins":{"leftmargin":"0.00","rightmargin":"0.00"},"systemdistance":"150.00"},"_newsystem":"yes"},"note":[{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"49.08","_defaulty":"30.00"},{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"250.80","_defaulty":"35.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"452.52","_defaulty":"45.00"}],"_number":"11","_width":"655.85"},{"note":{"pitch":{"step":"C","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"12.00","_defaulty":"50.00"},"barline":{"barstyle":"lightheavy","_location":"right"},"_number":"12","_width":"421.64"}],"_id":"P1"}}}'

//perc clef with rests
var testInput4 = '{"scorepartwise":{"work":{"worktitle":"Hold Your Horses"},"identification":{"creator":{"_type":"composer","__text":"Jake Douglass"},"encoding":{"software":"MuseScore 2.1.0","encodingdate":"20170725","supports":[{"_element":"accidental","_type":"yes"},{"_element":"beam","_type":"yes"},{"_element":"print","_attribute":"newpage","_type":"yes","_value":"yes"},{"_element":"print","_attribute":"newsystem","_type":"yes","_value":"yes"},{"_element":"stem","_type":"yes"}]}},"defaults":{"scaling":{"millimeters":"7.05556","tenths":"40"},"pagelayout":{"pageheight":"1683.36","pagewidth":"1190.88","pagemargins":[{"leftmargin":"56.6929","rightmargin":"56.6929","topmargin":"56.6929","bottommargin":"113.386","_type":"even"},{"leftmargin":"56.6929","rightmargin":"56.6929","topmargin":"56.6929","bottommargin":"113.386","_type":"odd"}]},"wordfont":{"_fontfamily":"FreeSerif","_fontsize":"10"},"lyricfont":{"_fontfamily":"FreeSerif","_fontsize":"11"}},"credit":[{"creditwords":{"_defaultx":"1134.19","_defaulty":"1476.67","_justify":"right","_valign":"bottom","_fontsize":"12","__text":"Jake Douglass"},"_page":"1"},{"creditwords":{"_defaultx":"595.44","_defaulty":"1626.67","_justify":"center","_valign":"top","_fontsize":"24","__text":"Rest Assured"},"_page":"1"}],"partlist":{"scorepart":{"partname":"Drumset","partabbreviation":"Drs.","scoreinstrument":[{"instrumentname":"Acoustic Bass Drum","_id":"P1I36"},{"instrumentname":"Bass Drum 1","_id":"P1I37"},{"instrumentname":"Side Stick","_id":"P1I38"},{"instrumentname":"Acoustic Snare","_id":"P1I39"},{"instrumentname":"Electric Snare","_id":"P1I41"},{"instrumentname":"Low Floor Tom","_id":"P1I42"},{"instrumentname":"Closed HiHat","_id":"P1I43"},{"instrumentname":"High Floor Tom","_id":"P1I44"},{"instrumentname":"Pedal HiHat","_id":"P1I45"},{"instrumentname":"Low Tom","_id":"P1I46"},{"instrumentname":"Open HiHat","_id":"P1I47"},{"instrumentname":"LowMid Tom","_id":"P1I48"},{"instrumentname":"HiMid Tom","_id":"P1I49"},{"instrumentname":"Crash Cymbal 1","_id":"P1I50"},{"instrumentname":"High Tom","_id":"P1I51"},{"instrumentname":"Ride Cymbal 1","_id":"P1I52"},{"instrumentname":"Chinese Cymbal","_id":"P1I53"},{"instrumentname":"Ride Bell","_id":"P1I54"},{"instrumentname":"Tambourine","_id":"P1I55"},{"instrumentname":"Splash Cymbal","_id":"P1I56"},{"instrumentname":"Cowbell","_id":"P1I57"},{"instrumentname":"Crash Cymbal 2","_id":"P1I58"},{"instrumentname":"Ride Cymbal 2","_id":"P1I60"},{"instrumentname":"Open Hi Conga","_id":"P1I64"},{"instrumentname":"Low Conga","_id":"P1I65"}],"mididevice":{"_port":"1"},"midiinstrument":[{"midichannel":"10","midiprogram":"1","midiunpitched":"36","volume":"78.7402","pan":"0","_id":"P1I36"},{"midichannel":"10","midiprogram":"1","midiunpitched":"37","volume":"78.7402","pan":"0","_id":"P1I37"},{"midichannel":"10","midiprogram":"1","midiunpitched":"38","volume":"78.7402","pan":"0","_id":"P1I38"},{"midichannel":"10","midiprogram":"1","midiunpitched":"39","volume":"78.7402","pan":"0","_id":"P1I39"},{"midichannel":"10","midiprogram":"1","midiunpitched":"41","volume":"78.7402","pan":"0","_id":"P1I41"},{"midichannel":"10","midiprogram":"1","midiunpitched":"42","volume":"78.7402","pan":"0","_id":"P1I42"},{"midichannel":"10","midiprogram":"1","midiunpitched":"43","volume":"78.7402","pan":"0","_id":"P1I43"},{"midichannel":"10","midiprogram":"1","midiunpitched":"44","volume":"78.7402","pan":"0","_id":"P1I44"},{"midichannel":"10","midiprogram":"1","midiunpitched":"45","volume":"78.7402","pan":"0","_id":"P1I45"},{"midichannel":"10","midiprogram":"1","midiunpitched":"46","volume":"78.7402","pan":"0","_id":"P1I46"},{"midichannel":"10","midiprogram":"1","midiunpitched":"47","volume":"78.7402","pan":"0","_id":"P1I47"},{"midichannel":"10","midiprogram":"1","midiunpitched":"48","volume":"78.7402","pan":"0","_id":"P1I48"},{"midichannel":"10","midiprogram":"1","midiunpitched":"49","volume":"78.7402","pan":"0","_id":"P1I49"},{"midichannel":"10","midiprogram":"1","midiunpitched":"50","volume":"78.7402","pan":"0","_id":"P1I50"},{"midichannel":"10","midiprogram":"1","midiunpitched":"51","volume":"78.7402","pan":"0","_id":"P1I51"},{"midichannel":"10","midiprogram":"1","midiunpitched":"52","volume":"78.7402","pan":"0","_id":"P1I52"},{"midichannel":"10","midiprogram":"1","midiunpitched":"53","volume":"78.7402","pan":"0","_id":"P1I53"},{"midichannel":"10","midiprogram":"1","midiunpitched":"54","volume":"78.7402","pan":"0","_id":"P1I54"},{"midichannel":"10","midiprogram":"1","midiunpitched":"55","volume":"78.7402","pan":"0","_id":"P1I55"},{"midichannel":"10","midiprogram":"1","midiunpitched":"56","volume":"78.7402","pan":"0","_id":"P1I56"},{"midichannel":"10","midiprogram":"1","midiunpitched":"57","volume":"78.7402","pan":"0","_id":"P1I57"},{"midichannel":"10","midiprogram":"1","midiunpitched":"58","volume":"78.7402","pan":"0","_id":"P1I58"},{"midichannel":"10","midiprogram":"1","midiunpitched":"60","volume":"78.7402","pan":"0","_id":"P1I60"},{"midichannel":"10","midiprogram":"1","midiunpitched":"64","volume":"78.7402","pan":"0","_id":"P1I64"},{"midichannel":"10","midiprogram":"1","midiunpitched":"65","volume":"78.7402","pan":"0","_id":"P1I65"}],"_id":"P1"}},"part":{"measure":[{"print":{"systemlayout":{"systemmargins":{"leftmargin":"0.00","rightmargin":"0.00"},"topsystemdistance":"220.00"}},"attributes":{"divisions":"1","key":{"fifths":"0"},"time":{"beats":"4","beattype":"4"},"clef":{"sign":"percussion","line":"2"}},"note":[{"unpitched":{"displaystep":"B","displayoctave":"4"},"duration":"1","instrument":{"_id":"P1I64"},"voice":"1","type":"quarter","stem":"down","notehead":"x","_defaultx":"76.67","_defaulty":"20.00"},{"unpitched":{"displaystep":"B","displayoctave":"4"},"duration":"1","instrument":{"_id":"P1I64"},"voice":"1","type":"quarter","stem":"down","notehead":"x","_defaultx":"135.80","_defaulty":"20.00"},{"unpitched":{"displaystep":"B","displayoctave":"4"},"duration":"1","instrument":{"_id":"P1I64"},"voice":"1","type":"quarter","stem":"down","notehead":"x","_defaultx":"194.93","_defaulty":"20.00"},{"unpitched":{"displaystep":"B","displayoctave":"4"},"duration":"1","instrument":{"_id":"P1I64"},"voice":"1","type":"quarter","stem":"down","notehead":"x","_defaultx":"254.06","_defaulty":"20.00"}],"_number":"1","_width":"314.79"},{"note":[{"rest":"","duration":"1","voice":"1","type":"quarter"},{"rest":"","duration":"1","voice":"1","type":"quarter"},{"rest":"","duration":"1","voice":"1","type":"quarter"},{"rest":"","duration":"1","voice":"1","type":"quarter"}],"_number":"2","_width":"247.59"},{"note":[{"unpitched":{"displaystep":"B","displayoctave":"4"},"duration":"1","instrument":{"_id":"P1I64"},"voice":"1","type":"quarter","stem":"down","notehead":"x","_defaultx":"12.00","_defaulty":"20.00"},{"unpitched":{"displaystep":"B","displayoctave":"4"},"duration":"1","instrument":{"_id":"P1I64"},"voice":"1","type":"quarter","stem":"down","notehead":"x","_defaultx":"73.23","_defaulty":"20.00"},{"unpitched":{"displaystep":"B","displayoctave":"4"},"duration":"1","instrument":{"_id":"P1I64"},"voice":"1","type":"quarter","stem":"down","notehead":"x","_defaultx":"134.46","_defaulty":"20.00"},{"unpitched":{"displaystep":"B","displayoctave":"4"},"duration":"1","instrument":{"_id":"P1I64"},"voice":"1","type":"quarter","stem":"down","notehead":"x","_defaultx":"195.69","_defaulty":"20.00"}],"_number":"3","_width":"258.52"},{"note":[{"rest":"","duration":"1","voice":"1","type":"quarter"},{"rest":"","duration":"1","voice":"1","type":"quarter"},{"rest":"","duration":"1","voice":"1","type":"quarter"},{"rest":"","duration":"1","voice":"1","type":"quarter"}],"barline":{"barstyle":"lightheavy","_location":"right"},"_number":"4","_width":"256.59"}],"_id":"P1"}}}'

//8th note scale
var testInput5 = '{"scorepartwise":{"work":{"worktitle":"8th note exercise"},"identification":{"creator":{"_type":"composer","__text":"Jn"},"rights":"JN COPY","encoding":{"software":"MuseScore 2.1.0","encodingdate":"20170815","supports":[{"_element":"accidental","_type":"yes"},{"_element":"beam","_type":"yes"},{"_element":"print","_attribute":"newpage","_type":"yes","_value":"yes"},{"_element":"print","_attribute":"newsystem","_type":"yes","_value":"yes"},{"_element":"stem","_type":"yes"}]}},"defaults":{"scaling":{"millimeters":"7.05556","tenths":"40"},"pagelayout":{"pageheight":"1584","pagewidth":"1224","pagemargins":[{"leftmargin":"56.6929","rightmargin":"56.6929","topmargin":"56.6929","bottommargin":"113.386","_type":"even"},{"leftmargin":"56.6929","rightmargin":"56.6929","topmargin":"56.6929","bottommargin":"113.386","_type":"odd"}]},"wordfont":{"_fontfamily":"FreeSerif","_fontsize":"10"},"lyricfont":{"_fontfamily":"FreeSerif","_fontsize":"11"}},"credit":[{"creditwords":{"_defaultx":"612","_defaulty":"1527.31","_justify":"center","_valign":"top","_fontsize":"24","__text":"Title"},"_page":"1"},{"creditwords":{"_defaultx":"1167.31","_defaulty":"1427.31","_justify":"right","_valign":"bottom","_fontsize":"12","__text":"Composer"},"_page":"1"},{"creditwords":{"_defaultx":"612","_defaulty":"113.386","_justify":"center","_valign":"bottom","_fontsize":"8","__text":"JN COPY"},"_page":"1"}],"partlist":{"scorepart":{"partname":"Piano","partabbreviation":"Pno.","scoreinstrument":{"instrumentname":"Piano","_id":"P1I1"},"mididevice":{"_id":"P1I1","_port":"1"},"midiinstrument":{"midichannel":"1","midiprogram":"1","volume":"78.7402","pan":"0","_id":"P1I1"},"_id":"P1"}},"part":{"measure":[{"print":{"systemlayout":{"systemmargins":{"leftmargin":"0.00","rightmargin":"0.00"},"topsystemdistance":"170.00"}},"attributes":{"divisions":"2","key":{"fifths":"0"},"time":{"beats":"4","beattype":"4"},"clef":{"sign":"G","line":"2"}},"note":[{"pitch":{"step":"C","octave":"4"},"duration":"1","voice":"1","type":"eighth","stem":"up","beam":{"_number":"1","__text":"begin"},"_defaultx":"75.17","_defaulty":"50.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"eighth","stem":"up","beam":{"_number":"1","__text":"continue"},"_defaultx":"114.64","_defaulty":"45.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"eighth","stem":"up","beam":{"_number":"1","__text":"continue"},"_defaultx":"154.10","_defaulty":"40.00"},{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"eighth","stem":"up","beam":{"_number":"1","__text":"end"},"_defaultx":"193.56","_defaulty":"35.00"},{"pitch":{"step":"G","octave":"4"},"duration":"2","voice":"1","type":"quarter","stem":"up","_defaultx":"233.02","_defaulty":"30.00"},{"pitch":{"step":"C","octave":"4"},"duration":"2","voice":"1","type":"quarter","stem":"up","_defaultx":"296.16","_defaulty":"50.00"}],"_number":"1","_width":"360.90"},{"note":[{"pitch":{"step":"G","octave":"4"},"duration":"2","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"30.00"},{"pitch":{"step":"C","octave":"5"},"duration":"2","voice":"1","type":"quarter","stem":"down","_defaultx":"77.14","_defaulty":"15.00"},{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"eighth","stem":"up","beam":{"_number":"1","__text":"begin"},"_defaultx":"142.29","_defaulty":"35.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"eighth","stem":"up","beam":{"_number":"1","__text":"end"},"_defaultx":"183.00","_defaulty":"40.00"},{"pitch":{"step":"C","octave":"4"},"duration":"2","voice":"1","type":"quarter","stem":"up","_defaultx":"223.71","_defaulty":"50.00"}],"_number":"2","_width":"290.46"},{"note":{"rest":"","duration":"8","voice":"1"},"_number":"3","_width":"229.63"},{"note":{"rest":"","duration":"8","voice":"1"},"_number":"4","_width":"229.63"},{"print":{"systemlayout":{"systemmargins":{"leftmargin":"0.00","rightmargin":"0.00"},"systemdistance":"121.99"},"_newsystem":"yes"},"note":{"rest":"","duration":"8","voice":"1"},"_number":"5","_width":"299.16"},{"note":{"rest":"","duration":"8","voice":"1"},"_number":"6","_width":"270.48"},{"note":{"rest":"","duration":"8","voice":"1"},"_number":"7","_width":"270.48"},{"note":{"rest":"","duration":"8","voice":"1"},"_number":"8","_width":"270.48"},{"print":{"systemlayout":{"systemmargins":{"leftmargin":"0.00","rightmargin":"0.00"},"systemdistance":"121.99"},"_newsystem":"yes"},"note":{"rest":"","duration":"8","voice":"1"},"_number":"9","_width":"299.16"},{"note":{"rest":"","duration":"8","voice":"1"},"_number":"10","_width":"270.48"},{"note":{"rest":"","duration":"8","voice":"1"},"_number":"11","_width":"270.48"},{"note":{"rest":"","duration":"8","voice":"1"},"_number":"12","_width":"270.48"},{"print":{"systemlayout":{"systemmargins":{"leftmargin":"0.00","rightmargin":"0.00"},"systemdistance":"121.99"},"_newsystem":"yes"},"note":{"rest":"","duration":"8","voice":"1"},"_number":"13","_width":"299.16"},{"note":{"rest":"","duration":"8","voice":"1"},"_number":"14","_width":"270.48"},{"note":{"rest":"","duration":"8","voice":"1"},"_number":"15","_width":"270.48"},{"note":{"rest":"","duration":"8","voice":"1"},"_number":"16","_width":"270.48"},{"print":{"systemlayout":{"systemmargins":{"leftmargin":"0.00","rightmargin":"0.00"},"systemdistance":"121.99"},"_newsystem":"yes"},"note":{"rest":"","duration":"8","voice":"1"},"_number":"17","_width":"299.16"},{"note":{"rest":"","duration":"8","voice":"1"},"_number":"18","_width":"270.48"},{"note":{"rest":"","duration":"8","voice":"1"},"_number":"19","_width":"270.48"},{"note":{"rest":"","duration":"8","voice":"1"},"_number":"20","_width":"270.48"},{"print":{"systemlayout":{"systemmargins":{"leftmargin":"0.00","rightmargin":"0.00"},"systemdistance":"121.99"},"_newsystem":"yes"},"note":{"rest":"","duration":"8","voice":"1"},"_number":"21","_width":"299.16"},{"note":{"rest":"","duration":"8","voice":"1"},"_number":"22","_width":"270.48"},{"note":{"rest":"","duration":"8","voice":"1"},"_number":"23","_width":"270.48"},{"note":{"rest":"","duration":"8","voice":"1"},"_number":"24","_width":"270.48"},{"print":{"systemlayout":{"systemmargins":{"leftmargin":"0.00","rightmargin":"0.00"},"systemdistance":"121.99"},"_newsystem":"yes"},"note":{"rest":"","duration":"8","voice":"1"},"_number":"25","_width":"299.16"},{"note":{"rest":"","duration":"8","voice":"1"},"_number":"26","_width":"270.48"},{"note":{"rest":"","duration":"8","voice":"1"},"_number":"27","_width":"270.48"},{"note":{"rest":"","duration":"8","voice":"1"},"_number":"28","_width":"270.48"},{"print":{"systemlayout":{"systemmargins":{"leftmargin":"0.00","rightmargin":"0.00"},"systemdistance":"121.99"},"_newsystem":"yes"},"note":{"rest":"","duration":"8","voice":"1"},"_number":"29","_width":"296.91"},{"note":{"rest":"","duration":"8","voice":"1"},"_number":"30","_width":"268.23"},{"note":{"rest":"","duration":"8","voice":"1"},"_number":"31","_width":"268.23"},{"note":{"rest":"","duration":"8","voice":"1"},"barline":{"barstyle":"lightheavy","_location":"right"},"_number":"32","_width":"277.23"}],"_id":"P1"}}}'

//bowing
var testInput6 = '{"scorepartwise":{"work":{"worktitle":"Twinkle Twinkle Little Star, C major, treble clef"},"identification":{"encoding":{"software":"MuseScore 2.1.0","encodingdate":"20170822","supports":[{"_element":"accidental","_type":"yes"},{"_element":"beam","_type":"yes"},{"_element":"print","_attribute":"newpage","_type":"yes","_value":"yes"},{"_element":"print","_attribute":"newsystem","_type":"yes","_value":"yes"},{"_element":"stem","_type":"yes"}]}},"defaults":{"scaling":{"millimeters":"7.05556","tenths":"40"},"pagelayout":{"pageheight":"1584","pagewidth":"1224","pagemargins":[{"leftmargin":"56.6929","rightmargin":"56.6929","topmargin":"56.6929","bottommargin":"113.386","_type":"even"},{"leftmargin":"56.6929","rightmargin":"56.6929","topmargin":"56.6929","bottommargin":"113.386","_type":"odd"}]},"wordfont":{"_fontfamily":"FreeSerif","_fontsize":"10"},"lyricfont":{"_fontfamily":"FreeSerif","_fontsize":"11"}},"credit":[{"creditwords":{"_defaultx":"1167.31","_defaulty":"1377.31","_justify":"right","_valign":"bottom","_fontsize":"12","__text":"English Lullaby"},"_page":"1"},{"creditwords":{"_defaultx":"612","_defaulty":"1527.31","_justify":"center","_valign":"top","_fontsize":"24","__text":"Twinkle Twinkle Little Star"},"_page":"1"}],"partlist":{"scorepart":{"partname":"Piano","partabbreviation":"Pno.","scoreinstrument":{"instrumentname":"Piano","_id":"P1I1"},"mididevice":{"_id":"P1I1","_port":"1"},"midiinstrument":{"midichannel":"1","midiprogram":"1","volume":"78.7402","pan":"0","_id":"P1I1"},"_id":"P1"}},"part":{"measure":[{"print":{"systemlayout":{"systemmargins":{"leftmargin":"0.00","rightmargin":"0.00"},"topsystemdistance":"220.00"}},"attributes":{"divisions":"1","key":{"fifths":"0"},"time":{"beats":"4","beattype":"4"},"clef":{"sign":"G","line":"2"}},"note":[{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","notations":{"technical":{"downbow":""}},"_defaultx":"75.17","_defaulty":"45.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","notations":{"technical":{"upbow":""}},"_defaultx":"100.35","_defaulty":"45.00"},{"pitch":{"step":"A","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"125.52","_defaulty":"25.00"},{"pitch":{"step":"A","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"150.69","_defaulty":"25.00"}],"_number":"1","_width":"177.46"},{"note":[{"pitch":{"step":"B","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"20.00"},{"pitch":{"step":"B","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"38.15","_defaulty":"20.00"},{"pitch":{"step":"A","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"63.94","_defaulty":"25.00"}],"_number":"2","_width":"107.74"},{"note":[{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"30.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"43.13","_defaulty":"30.00"},{"pitch":{"step":"F","alter":"1","octave":"4"},"duration":"1","voice":"1","type":"quarter","accidental":"sharp","stem":"up","_defaultx":"74.25","_defaulty":"35.00"},{"pitch":{"step":"F","alter":"1","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"105.38","_defaulty":"35.00"}],"_number":"3","_width":"138.10"},{"note":[{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"40.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"38.15","_defaulty":"40.00"},{"pitch":{"step":"D","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"63.94","_defaulty":"45.00"}],"_number":"4","_width":"107.74"},{"note":[{"pitch":{"step":"A","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"25.00"},{"pitch":{"step":"A","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"39.27","_defaulty":"25.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"66.54","_defaulty":"30.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"93.81","_defaulty":"30.00"}],"_number":"5","_width":"122.69"},{"note":[{"pitch":{"step":"F","alter":"1","octave":"4"},"duration":"1","voice":"1","type":"quarter","accidental":"sharp","stem":"up","_defaultx":"18.42","_defaulty":"35.00"},{"pitch":{"step":"F","alter":"1","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"42.23","_defaulty":"35.00"},{"pitch":{"step":"E","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"65.69","_defaulty":"40.00"}],"_number":"6","_width":"105.76"},{"note":[{"pitch":{"step":"A","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"25.00"},{"pitch":{"step":"A","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"39.27","_defaulty":"25.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"66.54","_defaulty":"30.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"93.81","_defaulty":"30.00"}],"_number":"7","_width":"122.69"},{"note":[{"pitch":{"step":"F","alter":"1","octave":"4"},"duration":"1","voice":"1","type":"quarter","accidental":"sharp","stem":"up","_defaultx":"18.42","_defaulty":"35.00"},{"pitch":{"step":"F","alter":"1","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"42.23","_defaulty":"35.00"},{"pitch":{"step":"E","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"65.69","_defaulty":"40.00"}],"_number":"8","_width":"105.76"},{"note":[{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"45.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"39.27","_defaulty":"45.00"},{"pitch":{"step":"A","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"66.54","_defaulty":"25.00"},{"pitch":{"step":"A","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"93.81","_defaulty":"25.00"}],"_number":"9","_width":"122.69"},{"print":{"systemlayout":{"systemmargins":{"leftmargin":"0.00","rightmargin":"0.00"},"systemdistance":"150.00"},"_newsystem":"yes"},"note":[{"pitch":{"step":"B","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"49.08","_defaulty":"20.00"},{"pitch":{"step":"B","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"343.50","_defaulty":"20.00"},{"pitch":{"step":"A","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"637.57","_defaulty":"25.00"}],"_number":"10","_width":"1110.61"},{"print":{"systemlayout":{"systemmargins":{"leftmargin":"0.00","rightmargin":"665.67"},"systemdistance":"150.00"},"_newsystem":"yes"},"note":[{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"49.08","_defaulty":"30.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"98.28","_defaulty":"30.00"},{"pitch":{"step":"F","alter":"1","octave":"4"},"duration":"1","voice":"1","type":"quarter","accidental":"sharp","stem":"up","_defaultx":"147.48","_defaulty":"35.00"},{"pitch":{"step":"F","alter":"1","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"196.69","_defaulty":"35.00"}],"_number":"11","_width":"247.49"},{"note":[{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"40.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"60.57","_defaulty":"40.00"},{"pitch":{"step":"D","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"108.78","_defaulty":"45.00"}],"barline":{"barstyle":"lightheavy","_location":"right"},"_number":"12","_width":"197.45"}],"_id":"P1"}}}'

//lyric/drumming notation
var testInput7 = '{"scorepartwise":{"work":{"worktitle":"Twinkle Twinkle Little Star, C major, treble clef"},"identification":{"encoding":{"software":"MuseScore 2.1.0","encodingdate":"20170823","supports":[{"_element":"accidental","_type":"yes"},{"_element":"beam","_type":"yes"},{"_element":"print","_attribute":"newpage","_type":"yes","_value":"yes"},{"_element":"print","_attribute":"newsystem","_type":"yes","_value":"yes"},{"_element":"stem","_type":"yes"}]}},"defaults":{"scaling":{"millimeters":"7.05556","tenths":"40"},"pagelayout":{"pageheight":"1584","pagewidth":"1224","pagemargins":[{"leftmargin":"56.6929","rightmargin":"56.6929","topmargin":"56.6929","bottommargin":"113.386","_type":"even"},{"leftmargin":"56.6929","rightmargin":"56.6929","topmargin":"56.6929","bottommargin":"113.386","_type":"odd"}]},"wordfont":{"_fontfamily":"FreeSerif","_fontsize":"10"},"lyricfont":{"_fontfamily":"FreeSerif","_fontsize":"11"}},"credit":[{"creditwords":{"_defaultx":"1167.31","_defaulty":"1402.31","_justify":"right","_valign":"bottom","_fontsize":"12","__text":"English Lullaby"},"_page":"1"},{"creditwords":{"_defaultx":"612","_defaulty":"1527.31","_justify":"center","_valign":"top","_fontsize":"24","__text":"Twinkle Twinkle Little Star"},"_page":"1"}],"partlist":{"scorepart":{"partname":"Piano","partabbreviation":"Pno.","scoreinstrument":{"instrumentname":"Piano","_id":"P1I1"},"mididevice":{"_id":"P1I1","_port":"1"},"midiinstrument":{"midichannel":"1","midiprogram":"1","volume":"78.7402","pan":"0","_id":"P1I1"},"_id":"P1"}},"part":{"measure":[{"print":{"systemlayout":{"systemmargins":{"leftmargin":"0.00","rightmargin":"0.00"},"topsystemdistance":"195.00"}},"attributes":{"divisions":"1","key":{"fifths":"0"},"time":{"beats":"4","beattype":"4"},"clef":{"sign":"G","line":"2"}},"note":[{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","lyric":{"syllabic":"single","text":"R","_number":"1"},"_defaultx":"75.92","_defaulty":"45.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","lyric":{"syllabic":"single","text":"L","_number":"1"},"_defaultx":"101.25","_defaulty":"45.00"},{"pitch":{"step":"A","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"126.58","_defaulty":"25.00"},{"pitch":{"step":"A","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"151.91","_defaulty":"25.00"}],"_number":"1","_width":"178.85"},{"note":[{"pitch":{"step":"B","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","lyric":{"syllabic":"single","text":"L","_number":"1"},"_defaultx":"12.14","_defaulty":"20.00"},{"pitch":{"step":"B","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","lyric":{"syllabic":"single","text":"R","_number":"1"},"_defaultx":"38.60","_defaulty":"20.00"},{"pitch":{"step":"A","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","lyric":{"syllabic":"single","text":"L","_number":"1"},"_defaultx":"64.69","_defaulty":"25.00"}],"_number":"2","_width":"108.99"},{"note":[{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"30.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"43.01","_defaulty":"30.00"},{"pitch":{"step":"F","alter":"1","octave":"4"},"duration":"1","voice":"1","type":"quarter","accidental":"sharp","stem":"up","_defaultx":"74.10","_defaulty":"35.00"},{"pitch":{"step":"F","alter":"1","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"105.11","_defaulty":"35.00"}],"_number":"3","_width":"137.72"},{"note":[{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"40.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"38.05","_defaulty":"40.00"},{"pitch":{"step":"D","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"63.73","_defaulty":"45.00"}],"_number":"4","_width":"107.36"},{"note":[{"pitch":{"step":"A","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"25.00"},{"pitch":{"step":"A","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"39.18","_defaulty":"25.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"66.35","_defaulty":"30.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"93.53","_defaulty":"30.00"}],"_number":"5","_width":"122.31"},{"note":[{"pitch":{"step":"F","alter":"1","octave":"4"},"duration":"1","voice":"1","type":"quarter","accidental":"sharp","stem":"up","_defaultx":"18.42","_defaulty":"35.00"},{"pitch":{"step":"F","alter":"1","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"42.13","_defaulty":"35.00"},{"pitch":{"step":"E","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"65.48","_defaulty":"40.00"}],"_number":"6","_width":"105.38"},{"note":[{"pitch":{"step":"A","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"25.00"},{"pitch":{"step":"A","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"39.18","_defaulty":"25.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"66.35","_defaulty":"30.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"93.53","_defaulty":"30.00"}],"_number":"7","_width":"122.31"},{"note":[{"pitch":{"step":"F","alter":"1","octave":"4"},"duration":"1","voice":"1","type":"quarter","accidental":"sharp","stem":"up","_defaultx":"18.42","_defaulty":"35.00"},{"pitch":{"step":"F","alter":"1","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"42.13","_defaulty":"35.00"},{"pitch":{"step":"E","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"65.48","_defaulty":"40.00"}],"_number":"8","_width":"105.38"},{"note":[{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"45.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"39.18","_defaulty":"45.00"},{"pitch":{"step":"A","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"66.35","_defaulty":"25.00"},{"pitch":{"step":"A","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"93.53","_defaulty":"25.00"}],"_number":"9","_width":"122.31"},{"print":{"systemlayout":{"systemmargins":{"leftmargin":"0.00","rightmargin":"0.00"},"systemdistance":"150.00"},"_newsystem":"yes"},"note":[{"pitch":{"step":"B","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"49.07","_defaulty":"20.00"},{"pitch":{"step":"B","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"343.50","_defaulty":"20.00"},{"pitch":{"step":"A","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"637.57","_defaulty":"25.00"}],"_number":"10","_width":"1110.61"},{"print":{"systemlayout":{"systemmargins":{"leftmargin":"0.00","rightmargin":"665.67"},"systemdistance":"150.00"},"_newsystem":"yes"},"note":[{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"49.07","_defaulty":"30.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"98.28","_defaulty":"30.00"},{"pitch":{"step":"F","alter":"1","octave":"4"},"duration":"1","voice":"1","type":"quarter","accidental":"sharp","stem":"up","_defaultx":"147.48","_defaulty":"35.00"},{"pitch":{"step":"F","alter":"1","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"196.69","_defaulty":"35.00"}],"_number":"11","_width":"247.49"},{"note":[{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"40.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"60.57","_defaulty":"40.00"},{"pitch":{"step":"D","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"108.78","_defaulty":"45.00"}],"barline":{"barstyle":"lightheavy","_location":"right"},"_number":"12","_width":"197.45"}],"_id":"P1"}}}'


window.testOptions = {
  'Mary Had a Little Lamb' : testInput,
  'Tisket, Tasket' : testInput2,
  '3/4': testInput3,
  'Percussion Clef': testInput4,
  '8th notes': testInput5,
  'bowing': testInput6,
  'lyric/drumming': testInput7,
}
