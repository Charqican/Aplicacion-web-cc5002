// this is the file in agregar-donacion.html
import {formValidationDono} from './validations/validate_donate_form.js';
import {confirmationHandler, errorGoToFormularyHandler, confirmationGoToFormularyHandler} from './event_handler.js'

//buttons
let submit_button = document.getElementById("submit-button")
let error_button = document.getElementById("error-button")
let go_back_button = document.getElementById("go-back-button")
let confirmation_button = document.getElementById("confirmation-button")

//containers 
let error_container = document.getElementById("error-container")
let main_container = document.getElementById("main-container")
let confirmation_container = document.getElementById("confirmation-container")
let send_container = document.getElementById("send-container")

const submitHandler = () => {
    let validation = formValidationDono();
    main_container.hidden= true
    // if validation is complete, show confirmation container
    if(validation) {
        confirmation_container.hidden = false
    } else {
        error_container.hidden = false
    }   
}

submit_button.addEventListener("click", submitHandler)
error_button.addEventListener("click", errorGoToFormularyHandler)
go_back_button.addEventListener("click", confirmationGoToFormularyHandler)
confirmation_button.addEventListener("click", confirmationHandler)