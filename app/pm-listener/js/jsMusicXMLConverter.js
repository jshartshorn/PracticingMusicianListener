var jsMusicXMLConverter = function() {
    this.output = ""

    this.convertJSON = function(input, infoAttributes) {
      //temp for testing

      if (input == null || input.length == 0)
        input = JSON.parse(testInput3)

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

      var measures = part.measure
      measures.forEach(function(measure) {

        var notes = measure.note

        if (notes.forEach == undefined) {
          notes = [notes]
        }

        notes.forEach(function(note) {
          //get note number from pitch info
          var noteNumbers = { C4: 60, D4: 62, E4: 64, F4: 65, G4: 67, A4: 69, B4: 71, C5: 72 }

          var key = note.pitch.step + "" + note.pitch.octave

          toRet.push({
            noteNumber: noteNumbers[key],
            duration: Number(note.duration)
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

      measures.forEach(function(measure) {
        //get the print attributes
        var printAttributes = measure.print
        console.log("Print attributes:")
        console.log(printAttributes)

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
          1: 'q',
          2: 'h',
          4: 'w'
        }

        notes.forEach(function(note) {
          var key = note.pitch.step + "" + note.pitch.octave
          group.notes.push(key + "/" + durationMap[note.duration])
        })

        //get the full duration of the bar and put an alternate time signature in if needed
        var calculatedDuration = notes.reduce(function(total, item) {
          return total + Number(item.duration)
        },0)

        if (calculatedDuration != measureTs) {
          if (bar.extra_attributes == undefined)
            bar.extra_attributes = {}
          bar.extra_attributes.alternate_timeSignature = calculatedDuration + '/4'
        }

        console.log("Bar duration: " + calculatedDuration)

        bar.groups.push(group)

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
    }

    this.writeKotlinFunction = function(content) {
      this.output += "function generateExerciseForKotlin() {\n"
      this.output += "return "
      this.output += content
      this.output += "}\n\n"
    }

    this.writeBoilerplate = function() {
      this.output += "var noteNumbers = { C4: 60, D4: 62, E4: 64, F4: 65, G4: 67, A4: 69, B4: 71, C5: 72 }\n\nvar durations = {q: 1.0,h: 2.0,w: 4.0 }\n\n\n"
    }
  }


var testInput = '{"scorepartwise":{"work":{"worktitle":"Mary Had A Little Lamb"},"identification":{"creator":{"_type":"composer","__text":"Traditional"},"encoding":{"software":"MuseScore 2.0.3","encodingdate":"20170709","supports":[{"_element":"accidental","_type":"yes"},{"_element":"beam","_type":"yes"},{"_element":"print","_attribute":"newpage","_type":"yes","_value":"yes"},{"_element":"print","_attribute":"newsystem","_type":"yes","_value":"yes"},{"_element":"stem","_type":"yes"}]}},"defaults":{"scaling":{"millimeters":"7.05556","tenths":"40"},"pagelayout":{"pageheight":"1584","pagewidth":"1224","pagemargins":[{"leftmargin":"56.6929","rightmargin":"56.6929","topmargin":"56.6929","bottommargin":"113.386","_type":"even"},{"leftmargin":"56.6929","rightmargin":"56.6929","topmargin":"56.6929","bottommargin":"113.386","_type":"odd"}]},"wordfont":{"_fontfamily":"FreeSerif","_fontsize":"10"},"lyricfont":{"_fontfamily":"FreeSerif","_fontsize":"11"}},"credit":[{"creditwords":{"_defaultx":"612","_defaulty":"1527.31","_justify":"center","_valign":"top","_fontsize":"24","__text":"Mary Had A Little Lamb"},"_page":"1"},{"creditwords":{"_defaultx":"1167.31","_defaulty":"1427.31","_justify":"right","_valign":"bottom","_fontsize":"12","__text":"Traditional"},"_page":"1"}],"partlist":{"scorepart":{"partname":"Piano","partabbreviation":"Pno.","scoreinstrument":{"instrumentname":"Piano","_id":"P1I1"},"mididevice":{"_id":"P1I1","_port":"1"},"midiinstrument":{"midichannel":"1","midiprogram":"1","volume":"78.7402","pan":"0","_id":"P1I1"},"_id":"P1"}},"part":{"measure":[{"print":{"systemlayout":{"systemmargins":{"leftmargin":"0.00","rightmargin":"0.00"},"topsystemdistance":"170.00"}},"attributes":{"divisions":"1","key":{"fifths":"0"},"time":{"beats":"4","beattype":"4"},"clef":{"sign":"G","line":"2"}},"note":[{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"75.17","_defaulty":"40.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"105.15","_defaulty":"45.00"},{"pitch":{"step":"C","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"135.13","_defaulty":"50.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"165.11","_defaulty":"45.00"}],"_number":"1","_width":"196.69"},{"note":[{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"40.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"43.49","_defaulty":"40.00"},{"pitch":{"step":"E","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"74.62","_defaulty":"40.00"}],"_number":"2","_width":"126.97"},{"note":[{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"45.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"43.49","_defaulty":"45.00"},{"pitch":{"step":"D","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"74.62","_defaulty":"45.00"}],"_number":"3","_width":"126.97"},{"note":[{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"40.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"43.49","_defaulty":"30.00"},{"pitch":{"step":"G","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"74.62","_defaulty":"30.00"}],"_number":"4","_width":"126.97"},{"note":[{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"40.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"44.08","_defaulty":"45.00"},{"pitch":{"step":"C","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"76.16","_defaulty":"50.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"108.24","_defaulty":"45.00"}],"_number":"5","_width":"141.92"},{"note":[{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"40.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"44.08","_defaulty":"40.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"76.16","_defaulty":"40.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"108.24","_defaulty":"40.00"}],"_number":"6","_width":"141.92"},{"note":[{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"45.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"44.08","_defaulty":"45.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"76.16","_defaulty":"40.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"108.24","_defaulty":"45.00"}],"_number":"7","_width":"141.92"},{"note":{"pitch":{"step":"C","octave":"4"},"duration":"4","voice":"1","type":"whole","_defaultx":"12.00","_defaulty":"50.00"},"barline":{"barstyle":"lightheavy","_location":"right"},"_number":"8","_width":"107.24"}],"_id":"P1"}}}'
var testInput2 = '{"scorepartwise":{"work":{"worktitle":"A Tisket A Tasket, C major, treble clef"},"identification":{"encoding":{"software":"MuseScore 2.0.3","encodingdate":"20170708","supports":[{"_element":"accidental","_type":"yes"},{"_element":"beam","_type":"yes"},{"_element":"print","_attribute":"newpage","_type":"yes","_value":"yes"},{"_element":"print","_attribute":"newsystem","_type":"yes","_value":"yes"},{"_element":"stem","_type":"yes"}]}},"defaults":{"scaling":{"millimeters":"7.05556","tenths":"40"},"pagelayout":{"pageheight":"1584","pagewidth":"1224","pagemargins":[{"leftmargin":"56.6929","rightmargin":"56.6929","topmargin":"56.6929","bottommargin":"113.386","_type":"even"},{"leftmargin":"56.6929","rightmargin":"56.6929","topmargin":"56.6929","bottommargin":"113.386","_type":"odd"}]},"wordfont":{"_fontfamily":"FreeSerif","_fontsize":"10"},"lyricfont":{"_fontfamily":"FreeSerif","_fontsize":"11"}},"credit":{"creditwords":{"_defaultx":"612","_defaulty":"1527.31","_justify":"center","_valign":"top","_fontsize":"24","__text":"A Tisket A Tasket, C major, treble clef"},"_page":"1"},"partlist":{"scorepart":{"partname":"Piano","partabbreviation":"Pno.","scoreinstrument":{"instrumentname":"Piano","_id":"P1I1"},"mididevice":{"_id":"P1I1","_port":"1"},"midiinstrument":{"midichannel":"1","midiprogram":"1","volume":"78.7402","pan":"0","_id":"P1I1"},"_id":"P1"}},"part":{"measure":[{"print":{"systemlayout":{"systemmargins":{"leftmargin":"0.00","rightmargin":"0.00"},"topsystemdistance":"170.00"}},"attributes":{"divisions":"1","key":{"fifths":"0"},"time":{"beats":"4","beattype":"4"},"clef":{"sign":"G","line":"2"}},"note":{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"75.17","_defaulty":"30.00"},"_number":"0","_implicit":"yes","_width":"106.91"},{"note":[{"pitch":{"step":"G","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"12.00","_defaulty":"30.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"52.70","_defaulty":"40.00"},{"pitch":{"step":"A","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"77.91","_defaulty":"25.00"}],"_number":"1","_width":"104.72"},{"note":[{"pitch":{"step":"G","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"12.00","_defaulty":"30.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"52.70","_defaulty":"40.00"},{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"77.91","_defaulty":"35.00"}],"_number":"2","_width":"104.72"},{"note":[{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"30.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"38.61","_defaulty":"30.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"65.21","_defaulty":"40.00"},{"pitch":{"step":"A","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"91.82","_defaulty":"25.00"}],"_number":"3","_width":"120.03"},{"note":[{"pitch":{"step":"G","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"12.00","_defaulty":"30.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"52.70","_defaulty":"40.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"77.91","_defaulty":"40.00"}],"_number":"4","_width":"104.72"},{"note":[{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"35.00"},{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"38.61","_defaulty":"35.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"65.21","_defaulty":"45.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"91.82","_defaulty":"45.00"}],"_number":"5","_width":"120.03"},{"note":[{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"35.00"},{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"38.61","_defaulty":"35.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"65.21","_defaulty":"45.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"91.82","_defaulty":"45.00"}],"_number":"6","_width":"120.03"},{"note":[{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"30.00"},{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"38.61","_defaulty":"35.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"65.21","_defaulty":"40.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"91.82","_defaulty":"45.00"}],"_number":"7","_width":"120.03"},{"note":[{"pitch":{"step":"E","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"12.00","_defaulty":"40.00"},{"pitch":{"step":"C","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"52.70","_defaulty":"50.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"77.91","_defaulty":"30.00"}],"_number":"8","_width":"104.72"},{"note":[{"pitch":{"step":"G","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"12.00","_defaulty":"30.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"52.70","_defaulty":"40.00"},{"pitch":{"step":"A","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"77.91","_defaulty":"25.00"}],"_number":"9","_width":"104.72"},{"print":{"systemlayout":{"systemmargins":{"leftmargin":"0.00","rightmargin":"0.00"},"systemdistance":"150.00"},"_newsystem":"yes"},"note":[{"pitch":{"step":"G","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"49.07","_defaulty":"30.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"104.82","_defaulty":"40.00"},{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"139.44","_defaulty":"35.00"}],"_number":"10","_width":"175.65"},{"note":[{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"30.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"49.08","_defaulty":"30.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"86.16","_defaulty":"40.00"},{"pitch":{"step":"A","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"123.24","_defaulty":"25.00"}],"_number":"11","_width":"161.92"},{"note":[{"pitch":{"step":"G","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"12.00","_defaulty":"30.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"71.32","_defaulty":"40.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"108.17","_defaulty":"40.00"}],"_number":"12","_width":"146.61"},{"note":[{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"35.00"},{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"49.08","_defaulty":"35.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"86.16","_defaulty":"45.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"123.24","_defaulty":"45.00"}],"_number":"13","_width":"161.92"},{"note":[{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"35.00"},{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"49.08","_defaulty":"35.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"86.16","_defaulty":"45.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"123.24","_defaulty":"45.00"}],"_number":"14","_width":"161.92"},{"note":[{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"30.00"},{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"49.08","_defaulty":"35.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"86.16","_defaulty":"40.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"123.24","_defaulty":"45.00"}],"_number":"15","_width":"161.92"},{"note":[{"pitch":{"step":"E","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"12.00","_defaulty":"40.00"},{"pitch":{"step":"C","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"70.85","_defaulty":"50.00"}],"barline":{"barstyle":"lightheavy","_location":"right"},"_number":"16","_width":"140.67"}],"_id":"P1"}}}'
var testInput3 = '{"scorepartwise":{"work":{"worktitle":"Good Morning To You"},"identification":{"creator":{"_type":"composer","__text":"Ernst Richter"},"encoding":{"software":"MuseScore 2.0.3","encodingdate":"20170709","supports":[{"_element":"accidental","_type":"yes"},{"_element":"beam","_type":"yes"},{"_element":"print","_attribute":"newpage","_type":"yes","_value":"yes"},{"_element":"print","_attribute":"newsystem","_type":"yes","_value":"yes"},{"_element":"stem","_type":"yes"}]}},"defaults":{"scaling":{"millimeters":"7.05556","tenths":"40"},"pagelayout":{"pageheight":"1683.36","pagewidth":"1190.88","pagemargins":[{"leftmargin":"56.6929","rightmargin":"56.6929","topmargin":"56.6929","bottommargin":"113.386","_type":"even"},{"leftmargin":"56.6929","rightmargin":"56.6929","topmargin":"56.6929","bottommargin":"113.386","_type":"odd"}]},"wordfont":{"_fontfamily":"FreeSerif","_fontsize":"10"},"lyricfont":{"_fontfamily":"FreeSerif","_fontsize":"11"}},"credit":[{"creditwords":{"_defaultx":"595.44","_defaulty":"1626.67","_justify":"center","_valign":"top","_fontsize":"24","__text":"Good Morning To You"},"_page":"1"},{"creditwords":{"_defaultx":"1134.19","_defaulty":"1526.67","_justify":"right","_valign":"bottom","_fontsize":"12","__text":"Ernst Richter"},"_page":"1"}],"partlist":{"scorepart":{"partname":"Piano","partabbreviation":"Pno.","scoreinstrument":{"instrumentname":"Piano","_id":"P1I1"},"mididevice":{"_id":"P1I1","_port":"1"},"midiinstrument":{"midichannel":"1","midiprogram":"1","volume":"78.7402","pan":"0","_id":"P1I1"},"_id":"P1"}},"part":{"measure":[{"print":{"systemlayout":{"systemmargins":{"leftmargin":"0.00","rightmargin":"0.00"},"topsystemdistance":"170.00"}},"attributes":{"divisions":"1","key":{"fifths":"0"},"time":{"beats":"3","beattype":"4"},"clef":{"sign":"G","line":"2"}},"note":{"pitch":{"step":"C","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"75.17","_defaulty":"50.00"},"_number":"0","_implicit":"yes","_width":"108.02"},{"note":[{"pitch":{"step":"C","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"50.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"41.05","_defaulty":"40.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"70.09","_defaulty":"30.00"}],"_number":"1","_width":"100.74"},{"note":[{"pitch":{"step":"C","octave":"5"},"duration":"2","voice":"1","type":"half","stem":"down","_defaultx":"12.00","_defaulty":"15.00"},{"pitch":{"step":"C","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"56.34","_defaulty":"50.00"}],"_number":"2","_width":"85.43"},{"note":[{"pitch":{"step":"C","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"50.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"41.05","_defaulty":"40.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"70.09","_defaulty":"30.00"}],"_number":"3","_width":"100.74"},{"note":[{"pitch":{"step":"C","octave":"5"},"duration":"2","voice":"1","type":"half","stem":"down","_defaultx":"12.00","_defaulty":"15.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"56.34","_defaulty":"30.00"}],"_number":"4","_width":"85.43"},{"note":[{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"30.00"},{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"41.05","_defaulty":"35.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"70.09","_defaulty":"45.00"}],"_number":"5","_width":"100.74"},{"note":[{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"40.00"},{"pitch":{"step":"C","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"41.05","_defaulty":"50.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"70.09","_defaulty":"30.00"}],"_number":"6","_width":"100.74"},{"note":[{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"30.00"},{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"41.05","_defaulty":"35.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"70.09","_defaulty":"45.00"}],"_number":"7","_width":"100.74"},{"note":[{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"40.00"},{"pitch":{"step":"C","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"43.71","_defaulty":"50.00"},{"pitch":{"step":"C","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"75.43","_defaulty":"50.00"}],"_number":"8","_width":"108.74"},{"note":[{"pitch":{"step":"C","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"12.00","_defaulty":"50.00"},{"pitch":{"step":"E","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"41.05","_defaulty":"40.00"},{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"70.09","_defaulty":"30.00"}],"_number":"9","_width":"100.74"},{"note":[{"pitch":{"step":"C","octave":"5"},"duration":"2","voice":"1","type":"half","stem":"down","_defaultx":"12.00","_defaulty":"15.00"},{"pitch":{"step":"A","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"56.34","_defaulty":"25.00"}],"_number":"10","_width":"85.43"},{"print":{"systemlayout":{"systemmargins":{"leftmargin":"0.00","rightmargin":"0.00"},"systemdistance":"150.00"},"_newsystem":"yes"},"note":[{"pitch":{"step":"G","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"49.08","_defaulty":"30.00"},{"pitch":{"step":"F","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"250.80","_defaulty":"35.00"},{"pitch":{"step":"D","octave":"4"},"duration":"1","voice":"1","type":"quarter","stem":"up","_defaultx":"452.52","_defaulty":"45.00"}],"_number":"11","_width":"655.85"},{"note":{"pitch":{"step":"C","octave":"4"},"duration":"2","voice":"1","type":"half","stem":"up","_defaultx":"12.00","_defaulty":"50.00"},"barline":{"barstyle":"lightheavy","_location":"right"},"_number":"12","_width":"421.64"}],"_id":"P1"}}}'
