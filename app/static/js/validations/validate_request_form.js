import {celularValidation, tipoValidation, regionComunaValidation, lengthValidation, 
        emailValidation} from './inputs_validators.js'; 

const formValidationReq = () => {
    let region_comuna = regionComunaValidation(document.getElementById("region-comuna-container"))
    let tipo_input = tipoValidation(document.getElementById("tipo"))
    let descripcion_input = lengthValidation(document.getElementById("descripcion"), "descripcion")
    let cantidad_input = lengthValidation(document.getElementById("cantidad"), "cantidad")
    let nombre_input = lengthValidation(document.getElementById("nombre"), "nombre")
    let email_input = emailValidation(document.getElementById("email"))
    let celular_input = celularValidation(document.getElementById("celular"))

    let val_elements = [region_comuna, tipo_input, descripcion_input, cantidad_input, nombre_input,
                        email_input, celular_input]
    let input_codes = ["Región o Comuna", "tipo", "Descripción", "Cantidad", "Nombre", "Email", "Celular"]
    let invalid = []

    for(let i=0; i<val_elements.length; i++) {
        let bool_element = val_elements[i]
        if (!bool_element) {
            invalid.push(input_codes[i])
        }        
    } 

    if(invalid.length == 0) {
        return true
    }

    let error_list = document.getElementById("error-list")
    error_list.textContent = ""
    for(let i = 0; i<invalid.length;i++) {
        let new_error = document.createElement("li")
        new_error.innerText=invalid[i]
        error_list.append(new_error)
    }

    return false
}

export{formValidationReq}