var LOG_PRIORITY = 10

//logger
function pm_log(message, priority) {
    if (priority == undefined)
        priority = 0
    if (priority >= LOG_PRIORITY)
        console.log(message)
}