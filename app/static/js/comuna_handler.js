import data from "./assets/region_comuna.json" assert {type: 'json'};
const datos = data
let selection_comuna = document.getElementById("comuna");
const selection_region = document.getElementById("region");

const actualizeComuna = (selected_region_index) => {    
    const index = selected_region_index
    const len = datos.regiones[index].comunas.length
    let selection_comuna = document.getElementById("comuna")
    for(let i = 0; i<len; i++) {
        let new_option = document.createElement("option")
        new_option.value = datos.regiones[index].comunas[i].id
        new_option.innerText = datos.regiones[index].comunas[i].nombre
        selection_comuna.appendChild(new_option)
    }
}

const regionOptions = () => {
    const index = datos.regiones.length
    for(let i = 0; i<index; i++) {
        let new_option = document.createElement("option")
        const region_names = datos.regiones[i].nombre
        new_option.value = i+1
        new_option.innerText = region_names
        selection_region.appendChild(new_option)
    }
}

const selectionfunc = () => {
    // clean comuna options
    while ( selection_comuna.length > 1) {
        selection_comuna.remove(1);
    } 
    // actualize comuna selection box
    if (selection_region.selectedIndex != 0) {
        actualizeComuna(selection_region.selectedIndex-1)
    } 
}

regionOptions()

selection_region.addEventListener("change", selectionfunc);