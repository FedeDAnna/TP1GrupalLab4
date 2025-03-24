const { response } = require("express");

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
        })

}