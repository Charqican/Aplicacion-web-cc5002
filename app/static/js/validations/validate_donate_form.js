import {calleNumeroValidation, fechaValidation, lengthValidation,
        fotosValidation, emailValidation,
        celularValidation, tipoValidation, regionComunaValidation} from "./inputs_validators.js";

const formValidationDono = () => {
    let region_comuna = regionComunaValidation(document.getElementById("region-comuna-container"))
    let calle_numero_input = calleNumeroValidation(document.getElementById("calle-numero"))
    let cantidad_input = lengthValidation(document.getElementById("cantidad"), "cantidad")
    let fecha_input = fechaValidation(document.getElementById("fecha-disponibilidad"))
    let fotos_input = fotosValidation(document.getElementById("foto"))
    let nombre_input = lengthValidation(document.getElementById("nombre"), "nombre")
    let email_input = emailValidation(document.getElementById('email'))
    let celular_input = celularValidation(document.getElementById('celular'))
    let tipo_input = tipoValidation(document.getElementById('tipo'))
    let val_elements = [region_comuna, fotos_input, calle_numero_input, cantidad_input, fecha_input,
        nombre_input, email_input, celular_input, tipo_input]
    
    let input_codes = ["Región o comuna", "Fotos adjunta", "Calle", "Cantidad", "Fecha disponibilidad",
        "Nombre", "Email", "Celular", "tipo" ]
    let invalid = []
    //iterate over the array with boolean values 
    for(let i=0; i<val_elements.length; i++) {
        let bool_element = val_elements[i]
        if (!bool_element) {
            invalid.push(input_codes[i])
        }        
    } 
    // now we have every 
    if(invalid.length == 0) {
        return true
    }

    // put every error in a unordered list
    let error_list = document.getElementById("error-list")
    error_list.textContent = ""
    for(let i= 0; i<invalid.length;i++) {
        let new_error = document.createElement("li")
        new_error.innerText = invalid[i]
        error_list.append(new_error)
    }
    return false
}

export{formValidationDono}
