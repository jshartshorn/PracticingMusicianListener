var jsMusicXMLConverter = function() {
    this.output = ""

    this.convertJSON = function(input) {
      console.log("Going to convert json object:")
      console.log(input)

      this.writeBoilerplate()

      //get the score info
      var title = input.scorepartwise.work.worktitle

      //get the part out
      var part = input.scorepartwise.part

      var notes = this.getNotesFromPart(part)

      var generatedKotlinInfo = {
        tempo: 120,
        count_off: 8,
        time_signature: 4,
        notes: notes
      }

      this.writeKotlinFunction(JSON.stringify(generatedKotlinInfo))

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
            duration: note.duration
          })
        })
      })

      return toRet
    }



    this.writeKotlinFunction = function(content) {
      this.output += "function generateExerciseForKotlin() {\n"
      this.output += "return "
      this.output += content
      this.output += "}\n\n"
    }

    this.writeBoilerplate = function() {
      this.output += "var noteNumbers = { C4: 60, D4: 62, E4: 64, F4: 65, G4: 67, A4: 69, B4: 71, C5: 72 }\n\n var durations = {q: 1.0,h: 2.0,w: 4.0 }\n\n\n"
    }
  }
