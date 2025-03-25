const params = new URLSearchParams(window.location.search);
const id = params.get("id");

document.addEventListener("DOMContentLoaded", async () => {
  // traerNoticia();
  let empresa = await traerNoticia();
  console.log(empresa);

  cargarEmpresa(empresa);
  // console.log(await traerNoticia());
});

async function traerNoticia() {
  if (!id) {
    console.error("No se proporcionó un ID de noticia.");
    return null;
  }

  try {
    const response = await fetch(`/api/noticia/${id}`);
    const noticia = await response.json();

    if (noticia.message) {
      document.getElementById(
        "noticia-container"
      ).innerHTML = `<p>No se encontró la noticia.</p>`;
      return null;
    }

    cargarNoticia(noticia);
    return noticia.empresa;
  } catch (error) {
    console.error("Error al cargar la noticia:", error);
    return null;
  }
}

function cargarNoticia(noticia) {
  // Cargamos datos de header
  // let tituloImg = document.getElementById("tituloImg");
  let tituloNoticia = document.getElementById("tituloNoticia");
  let tituloPag = document.getElementById("tituloPag");
  let imgNoticia = document.getElementById("noticiaImg");
  let fecha = document.getElementById("fechaNoticia");
  let resumen = document.getElementById("resumenNoticia");
  let infoNoticia = document.getElementById("txtNoticia");

  let fechaFormat = noticia.fecha_publicacion.split("T")[0];
  let arrayFecha = fechaFormat.split("-");
  let formatArg = `${arrayFecha[2]}-${arrayFecha[1]}-${arrayFecha[0]}` 

  tituloPag.textContent = `${noticia.titulo}`;
  tituloNoticia.textContent = `${noticia.titulo}`;
  imgNoticia.innerHTML = `
  <p id="tituloImg">${noticia.titulo}</p>
  // <img src="https://placehold.co/1000x400" alt="Texto img">`;
  imgNoticia.innerHTML = `<img src="${noticia.imagen}" alt="Descripción de la img">`; // ${noticia.alt}
  fecha.textContent = `Fecha Publicación: ${formatArg}`;
  resumen.textContent = `${noticia.resumen}`;
  infoNoticia.innerHTML = `${noticia.contenido_html}`;
}

function cargarEmpresa(empresa) {
  let nombreEmpresa = document.getElementById("nombreEmpresa");
  let numTelefono = document.getElementById("numTelefono");
  let horario = document.getElementById("horario");
  let empresaFooter = document.getElementById("empresaFooter");

  nombreEmpresa.innerHTML = `<a href=home.html?id=${empresa.id}>${empresa.denominacion}</a>`;
  numTelefono.textContent = `${empresa.telefono}`;
  horario.textContent = `Horario: ${empresa.horario_atencion}`;
  empresaFooter.textContent = `${empresa.denominacion} © 2025 Privacy Policy`;
}
