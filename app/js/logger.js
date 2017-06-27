var LOG_PRIORITY = 10

//logger
function pm_log(message, priority) {
    if (priority >= LOG_PRIORITY) {
        console.log(message)
    }
}