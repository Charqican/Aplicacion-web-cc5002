import data from "../assets/region_comuna.json" assert {type: 'json'};
const datos = data

const calleNumeroValidation= (input) => {
    if(!input.value) return false
    const regex = /[\w\.\s]{2,50}\d{0,10}/
    return regex.test(input.value)
}

const fechaValidation = (input) => {

    let fecha_input = input.value
    const regex = /\d{4}\-\d{2}\-\d{2}/

    if (!regex.test(fecha_input)) return false

    const date = new Date();
    let fecha_actual = date.toLocaleDateString();
    fecha_actual = fecha_actual.split('/') // dd/mm/yyyy formato de Chile
    fecha_input = fecha_input.split('-') // yyyy/mm/dd formato del html
 
    if (fecha_actual[1].length ==1) fecha_actual[1] = "0"+fecha_actual[1]
    if (fecha_actual[0].length ==1) fecha_actual[0] = "0"+fecha_actual[0]

    let fecha_actual_string = fecha_actual[2] + fecha_actual[1] +fecha_actual[0]
    let fecha_input_string = fecha_input[0] + fecha_input[1] + fecha_input[2]

    return (fecha_actual_string<=fecha_input_string)
}

//based on Axuiliar 3
const fotosValidation = (files) => {
//    let inputs = input.querySelectorAll("input")
//    let files= [] 
//    for(const input of inputs) {
//        if (input.type == "file" && input.files.length != 0) files.push(input)
//    }
//
//    if (!(1<=files.length && files.length <= 3)) return false
//    for (const file of files) {
//        // file.type should be "image/<foo>" or "application/pdf"
//        let valid_type = true
//        let fileFamily = (file.files[0]).type.split("/")[0];
//        valid_type &&= fileFamily == "image" || file.type == "application/pdf";
//        if (!valid_type) return false
//      }
//    return true
    if (!files) return false;
  
    // number of files validation
    let lengthValid = 1 <= files.length && files.length <= 3;
  
    // file type validation
    let typeValid = true;
  
    for (const file of files) {
      // file.type should be "image/<foo>" or "application/pdf"
      let fileFamily = file.type.split("/")[0];
      typeValid &&= fileFamily == "image" || file.type == "application/pdf";
    }
  
    // return logic AND of validations.
    return lengthValid && typeValid;
}

const emailValidation = (input) => {
    const regex = /[\w\-\._]+@[\w\-\._]+\.[\w\-\._]+/
    return regex.test(input.value)
}

const celularValidation = (input) => {
    const regex = /\+?[\d\s]{1,4}?[\d\s]{6,14}/
    return regex.test(input.value)
}

const tipoValidation = (input) => {
    let selected_option = input.value
    if(selected_option == "Fruta" || selected_option == "Verdura" || selected_option == "Otro") return true
    else return false
}

const lengthValidation = (input, type) => {

    if(type == "cantidad") {
        const regex = /[\d]{1,9}/
        return regex.test(input.value)
    }

    else if (type == "nombre") {
        const regex = /[\w]{3,80}/
        return regex.test(input.value)
    }

    else if (type == "descripcion") {
        const regex = /[\w\W]{0,250}/
        return regex.test(input.value)
    } else return false
}

const regionComunaValidation = (input) => {
    let selections = input.children
    let region_obj = selections[1].options[selections[1].selectedIndex]
    let comuna_obj = selections[3].options[selections[3].selectedIndex]

    if(region_obj.value == 0 || comuna_obj.value == 0){
        return false
    } 
    
    let comunas = data.regiones[region_obj.value-1].comunas
    for(let i=0;i<comunas.length;i++) {

        if (comunas[i].nombre == comuna_obj.innerText) return true 
    }
    return false
}

export{regionComunaValidation, lengthValidation, tipoValidation, celularValidation,
        emailValidation, fotosValidation, fechaValidation, calleNumeroValidation}