/*const { response } = require("express");

document.addEventListener("DOMContentLoaded", cargarpagina);

function cargarpagina(){
    fetch("/api/noticias")
        .then((response) => response.json())
        .then((data) => { 
            mostrarNoticias(data);
        })
        .catch((error) => {
            console.error("Error al cargar las noticias:", error);
        });
}

function mostrarNoticias(data){

    const tbNoticias = document.getElementById("body-noticias");
    tbNoticias.innerHTML="";
            data.forEach(noticia => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${noticia.imagen}</td>
                    <td>
                    ${noticia.titulo}<br>
                    ${noticia.resumen}
                    ${noticia.fecha}
                    </td>
                `;
                tbNoticias.appendChild(fila);
            });
}

function mostrarNoticiasFlitradas(texto){

    fetch(`/api/noticia/${texto}`)
        .then(response => response.json())
        .then(data => {
            const tbNoticias = document.getElementById("tbody-noticias");
            tbNoticias.innerHTML="";
            data.forEach(noticia => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${noticia.imagen}</td>
                    <td>
                    ${noticia.titulo}<br>
                    ${noticia.resumen}
                    ${noticia.fecha}
                    </td>
                `;
                tbNoticias.appendChild(fila);
            });
        })

}
*/

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const texto = params.get("query");

  if (texto) {
    document.getElementById("texto-buscado").textContent = `Buscaste: "${texto}"`;
    cargarNoticias(texto);
  } else {
    alert("No se proporcionó texto de búsqueda.");
  }
});

function cargarNoticias(texto) {
  fetch(`/api/noticias/filtradas/${encodeURIComponent(texto)}`)
    .then(response => response.json())
    .then(data => mostrarNoticias(data))
    .catch(error => console.error("Error al buscar noticias:", error));
}

function mostrarNoticias(noticias) {
  const contenedor = document.getElementById("resultado-noticias");
  contenedor.innerHTML = "";

  if (noticias.length === 0) {
    contenedor.innerHTML = "<p>No se encontraron resultados.</p>";
    return;
  }

  noticias.forEach(noticia => {
    const card = document.createElement("div");
    card.className = "card my-3 p-3";
    card.innerHTML = `
      <h4>${noticia.titulo}</h4>
      <p><strong>Resumen:</strong> ${noticia.resumen}</p>
      <p><strong>Fecha:</strong> ${new Date(noticia.fecha_publicacion).toLocaleDateString()}</p>
    `;
    contenedor.appendChild(card);
  });
}

