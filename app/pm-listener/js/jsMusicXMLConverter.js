var jsMusicXMLConverter = function() {
    this.output = ""

    this.convertJSON = function(input, infoAttributes) {
      //temp for testing

      if (input == null || input.length == 0)
        input = JSON.parse(testInput5)

      console.log("Going to convert json object:")
      console.log(input)
      console.log(JSON.stringify(input))


      this.writeBoilerplate()

      //get the part out
      var part = input.scorepartwise.part

      var notes = this.getNotesFromPart(part)

      var generatedKotlinInfo = {
        tempo: infoAttributes.tempo,
        count_off: infoAttributes.countoff,
        time_signature: function(fullTs) {
          return fullTs.split('/')[0]
        }(infoAttributes.time_signature),
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
      var time_signature = infoAttributes.time_signature
      var tempo = infoAttributes.tempo
      var copyrightInfo = infoAttributes.copyright

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

      this.writeEasyScoreFunction(JSON.stringify(generatedEasyScoreInfo, null, 4))

      return this.output
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

          group.notes.push(key + "/" + durationMap[note.duration / divisions] + restVal)

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
