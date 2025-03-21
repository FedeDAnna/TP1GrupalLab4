const params = new URLSearchParams(window.location.search);
const id = params.get("id");

document.addEventListener("DOMContentLoaded", traerEmpresa);

function traerEmpresa() {
    

    if (!id) {
        console.error("No se proporcionó un ID de empresa.");
        return;
    }

    fetch(`/api/empresas/${id}`)
        .then(response => response.json())
        .then(empresa => {
            console.log("Datos de empresa recibidos:", empresa);

            if (!empresa.latitud || !empresa.longitud) {
                console.error("La empresa no tiene coordenadas válidas.");
                return;
            }

            cargarHeader(empresa);
            cargarBody(empresa);
            cargarFooter(empresa);

        })
        .catch(error => console.error("Error al cargar la empresa:", error));
}

function cargarHeader(empresa) {
    let header = document.getElementsByTagName("header")[0];
    let denominacionDiv = header.querySelector("#denominacion");
    let telefonoDiv = header.querySelector("#telefono");
    let horario = header.querySelector("#horario");

    if (denominacionDiv) denominacionDiv.textContent = empresa.denominacion || "Denominación no disponible";
    if (telefonoDiv) telefonoDiv.textContent = empresa.telefono || "Teléfono no disponible";
    if (horario) horario.textContent = empresa.horario_atencion || "Horario no disponible";
}

function cargarBody(empresa) {
    let quienesSomosDiv = document.getElementById("quienesSomos");
    quienesSomosDiv.innerHTML = `<p>${empresa.quienes_somos || "Información no disponible"}</p>`;
    init(empresa);
}

function cargarFooter(empresa) {
    let footer = document.getElementById("footer");
    if (!footer) return console.warn("No se encontró el <footer>");

    footer.innerHTML = `${empresa.denominacion || "Empresa"} 2025 Privacy Policy`;
}

async function init(empresa) {
    const { Map3DElement, MapMode, Marker3DElement } = await google.maps.importLibrary("maps3d");
    console.log(parseFloat(empresa.latitud) +" - "+  parseFloat(empresa.longitud));
    const map = new Map3DElement({
      center: { lat: parseFloat(empresa.latitud), lng: parseFloat(empresa.longitud), altitude: 0 },
      heading: 110,
      tilt: 67.5,
      range: 1000,
      mode: MapMode.HYBRID
    });
    const marker = new Marker3DElement({
      position: { lat: parseFloat(empresa.latitud), lng: parseFloat(empresa.longitud) } 
    });
    map.append(marker);
    document.getElementById("mapa2").append(map);
  }