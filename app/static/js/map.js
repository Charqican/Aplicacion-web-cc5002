let map = L.map('map').setView([-33.45,-70.66], 4);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const crearHTML = (data) => {

    let html = ``;
    if (data["type"] == "pedido") {
        html = 
        `
        <h3>Comuna: ${data["comuna"]}</h3>
        <hr>
        <ul>
            <li> Id del pedido: ${data["id"]}</li>
            <li> Tipo de pedido: ${data["tipo"]}</li>
            <li> Cantidad: ${data["cantidad"]}</li>
            <li> email del solicitante: ${data["email"]}</li>
        </ul>`;
    } else {
        html = 
        `
        <h3>Comuna: ${data["comuna"]}</h3>
        <hr>
        <ul>
            <li> Id de la donación: ${data["id"]}</li>
            <li> Calle del donante: ${data["calle_numero"]}</li>
            <li> Tipo de donación: ${data["tipo"]}</li>
            <li> Cantidad: ${data["cantidad"]}</li>
            <li> Fecha de dispoibilidad : ${data["fecha_disponibilidad"]}</li>
            <li> email del solicitante: ${data["email"]}</li>
        </ul>`;
    }

    return html;
}

const crearHTMLAcutializable = (i, n) => {
    const array = info_array[i];
    const data = array[n]
    let cantidad_pedido= 0;
    let cantidad_donacion= 0;
    for (let info of array) {
        if (info["type"] == "pedido") cantidad_pedido++;
        else cantidad_donacion++;
    }
    let base_html =
    `
    <h2>Hay un total de ${cantidad_donacion} donacion/es y ${cantidad_pedido} pedido/s en esta comuna</h2>`
    const html = crearHTML(data);
    const button_html = 
    `
    <button id="marker${i}">Siguiente</button>
    `
    base_html+=html;
    base_html+=button_html;

    return base_html;
}

const crearMarkerActualizable = (i, n) => {

    const data_array = info_array[i];
    const data_len = data_array.length;
    const data = data_array[n];
    const html = crearHTMLAcutializable(i, n)
    
    let marker = L.marker([data["latitud"], data["longitud"]]).addTo(map);
    const popup = L.popup().setContent(html);
    marker.bindPopup(popup);


    let marker_metadata = [marker, popup, 0, data_len];
    marker_array.push(marker_metadata);

}

const putInfoIntoArray = (info_array, data) => {

    let i=0;
    if (info_array.length == 0) {
        info_array.push(data);
        return;
    }

    for (let elemento of info_array) {

        const data_lat = data["latitud"];
        const data_lon = data["longitud"];

        if (Array.isArray(elemento)) {

            const elem_lat = (elemento[0])["latitud"];
            const elem_lon = (elemento[0])["longitud"];

            if ( elem_lat == data_lat && elem_lon == data_lon){
                elemento.push(data);
                return;
            }
        } else {

            const elem_lat = elemento["latitud"];
            const elem_lon = elemento["longitud"];

            if (elem_lat == data_lat && elem_lon == data_lon){
                let new_array = [elemento, data];
                info_array[i] = new_array;
                return;
            }
        }
        i++;
    }
    // si no ha econtrado a ningun elemento con la misma latitud y longitud, entonces al final
    info_array.push(data);
}

let marker_array = [];
let info_array = [];

fetch("http://127.0.0.1:5000/get-map-data")
    .then((response => response.json()))
    .then( (parsedata) => {
        for (let data of parsedata) putInfoIntoArray(info_array, data);

        for (let i = 0; i< info_array.length; i++) {

            if (Array.isArray(info_array[i])) {
                crearMarkerActualizable(i, 0);
            } else {
                const html = crearHTML(info_array[i])
                let marker = L.marker([info_array[i]["latitud"], info_array[i]["longitud"]]).addTo(map);
                marker.bindPopup(html);
                marker_array.push(marker);

            }   
        }

        const content = `
        <h3>Título del popup</h3>
        <p>Contenido del popup</p>
        <button id="miBoton">Mi Botón</button>
        `;

        const marker = L.marker([51.5, -0.09]).addTo(map);
        const popup = L.popup().setContent(content);
  
        marker.bindPopup(popup);
    })


//const content = `
//    <h3>Título del popup</h3>
//    <p>Contenido del popup</p>
//    <button id="miBoton">Mi Botón</button>
//  `;
//
//const marker = L.marker([51.5, -0.09]).addTo(map);
//const popup = L.popup().setContent(content);
//  
//marker.bindPopup(popup).openPopup();
  
// Obtener una referencia al botón dentro del popup
const map_container = document.getElementById("map")

map_container.addEventListener("click", function(event) {
    if (event.target.nodeName == "BUTTON") {
        if (event.target.id.includes("marker")) {

            const marker_id = event.target.id;
            const marker_number = marker_id.slice(6, marker_id.length);
            const marker = marker_array[marker_number];
            marker[2] = (marker[2]+1)%marker[3];
            const html = crearHTMLAcutializable(marker_number, marker[2]);
            marker[0].getPopup().setContent(html);
        }
    }
})