import com.practicingmusician.*
import kotlin.browser.window

/**
 * Created by jn on 6/5/17.
 */

val app = App()

fun main(args: Array<String>) {
    window.onload = {
        runProgram()
    }
}

fun runProgram() {
    println("Running...")
    app.setup()
}