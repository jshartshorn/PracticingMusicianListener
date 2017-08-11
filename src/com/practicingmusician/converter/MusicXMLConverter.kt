package com.practicingmusician.converter

import com.practicingmusician.GeneratedExercise
import com.practicingmusician.SimpleJSNoteObject

/**
 * Created by jn on 8/11/17.
 */

class GeneratedExerciseInfo {
    var tempo : Double = 120.0
    val time_signature : Int = 4
    val count_off : Double = 8.0
    var notes = mutableListOf<SimpleJSNoteObject>().toTypedArray()
}

class MusicXMLConverter {

  var documentInfo = mutableMapOf<String,String>()

  var output = ""

  @JsName("convertJSON")
  fun convertJSON(input : dynamic) : String {
    console.log("Going to convert json object:")
    console.log(input)

    writeBoilerplate()

    //get the score info
    val title = input.scorepartwise.work.worktitle
    console.log("title: $title")

    //get the part out
    val part = input.scorepartwise.part
    convertPart(part)

    val generatedKotlinInfo = GeneratedExerciseInfo()

    generatedKotlinInfo.notes = getNotesFromPart(part).toTypedArray()

    writeKotlinFunction(JSON.stringify(generatedKotlinInfo))

    return output
  }

  fun getNotesFromPart(part : dynamic) : List<SimpleJSNoteObject>{
    val toRet = mutableListOf<SimpleJSNoteObject>()

    val measures = part.measure as Array<dynamic>
    measures.forEach {
      val notes = it.note as Array<dynamic>
      notes.forEach {
        val note = SimpleJSNoteObject(60,1.0)
        toRet.add(note)
      }
    }

    return toRet
  }

  fun convertPart(part : dynamic) {
    //do each measure
  }

  fun writeKotlinFunction(content : String) {
    output += "function generateExerciseForKotlin() {\n"
    output += "return "
    output += content
    output += "}\n\n"
  }

  fun writeBoilerplate() {
    output += "var noteNumbers = { C4: 60, D4: 62, E4: 64, F4: 65, G4: 67, A4: 69, B4: 71, C5: 72 }\n\n var durations = {q: 1.0,h: 2.0,w: 4.0 }\n\n\n"
  }

}
