//common functions between request & donation
let error_container = document.getElementById("error-container")
let main_container = document.getElementById("main-container")
let confirmation_container = document.getElementById("confirmation-container")
let send_container = document.getElementById("send-container")

const confirmationHandler = () => {
    confirmation_container.hidden= true
    send_container.hidden= false
}

const errorGoToFormularyHandler = () => {
    main_container.hidden = false
    error_container.hidden = true
}

const confirmationGoToFormularyHandler = () => {
    main_container.hidden = false
    confirmation_container.hidden = true
}

export{ confirmationHandler, errorGoToFormularyHandler, confirmationGoToFormularyHandler}
