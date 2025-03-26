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

                let fechaFormat = noticia.fecha_publicacion.split("T")[0];
                let arrayFecha = fechaFormat.split("-");
                let formatArg = `${arrayFecha[2]}-${arrayFecha[1]}-${arrayFecha[0]}`;

                fila.innerHTML = `
                    <td><img class="imagenes" src="../${noticia.imagen}" alt="Texto img"></td>
                    <td style="padding:10px; ">
                    <span class="titulo-noticia">${noticia.titulo}</span><br>
                    ${noticia.resumen}<br>
                    <span class="fechas">Fecha de Publicación: ${formatArg}</span>
                    </td>
                `;
                tbNoticias.appendChild(fila);
            });
            
}

function mostrarNoticiasFlitradas(){
  
  var texto = document.getElementById("busquedaInput").value;
  
    fetch(`/api/noticias/filtradas/${texto}`)
        .then(response => response.json())
        .then(data => {
          
            mostrarNoticias(data);
            }); 
        

}


