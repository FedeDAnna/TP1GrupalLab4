document.addEventListener("DOMContentLoaded", cargarpagina);

let listaEmpresas = [];

function cargarpagina(){
    fetch("/api/empresas")
        .then((response) => response.json())
        .then((data) => { 
            listaEmpresas = data;
            mostrarEmpresas();
        })
        .catch((error) => {
            console.error("Error al cargar las empresas:", error);
        });
}

function mostrarEmpresas(){

    const tbEmpresa = document.getElementById("empresas-body");
    tbEmpresa.innerHTML="";
        listaEmpresas.forEach(empresa => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${empresa.denominacion}</td>
                    <td><a href="home.html?id=${empresa.id}">Ver Empresa</a></td>
                    <td>
                    <button type="button" class="btn btn-primary" onclick="eliminarEmpresa(${empresa.id})"> Eliminar </button>
                    <button onclick="modificarEmpresa(this)" type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalActualizar" data-empresa='${JSON.stringify(empresa)}'> Actualizar </button>
                    </td>
                `;
                tbEmpresa.appendChild(fila);
            });
}

function buscar() {
    const texto = document.getElementById("busquedaInput").value.trim();
    if (texto !== "") {
    window.location.href = `buscador.html?query=${encodeURIComponent(texto)}`;
    } else {
    alert("Por favor ingresá un término de búsqueda.");
    }
}
function eliminarEmpresa(id){
    if (confirm(`¿Estás seguro de que deseas eliminar la empresa de id = ${id}?`)) {
        fetch(`/api/empresas/${id}`, {
        method: "DELETE",
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("No se pudo eliminar la empresa.");
            }
            return response.json();
        })
        .then((data) => {
            alert(data.message);
            cargarpagina();
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Hubo un problema al intentar eliminar la empresa.");
        });
    }
}

function modificarEmpresa(boton){
    let empresa = JSON.parse(boton.getAttribute("data-empresa"));
    
    const modalBody = document.querySelector("#modalActualizar .modal-body");
    modalBody.innerHTML = `
      <form id="empresaForm">
          <label for="denominacion">Denominación:</label>
          <input type="text" id="denominacion" name="denominacion" value="${empresa.denominacion}" required>

          <label for="telefono">Teléfono:</label>
          <input type="text" id="telefono" name="telefono" value="${empresa.telefono}" required>

          <label for="horarioAtencion">Horario de Atención:</label>
          <input type="text" id="horarioAtencion" name="horarioAtencion" value="${empresa.horario_atencion}" required>

          <label for="quienesSomos">Quienes Somos:</label>
          <textarea id="quienesSomos" name="quienesSomos" rows="3" required>${empresa.quienes_somos}</textarea>

          <label for="latitud">Latitud:</label>
          <input type="number" id="latitud" name="latitud" value="${empresa.latitud}" required/>

          <label for="longitud">Longitud:</label>
          <input type="number" id="longitud" name="longitud" value="${empresa.longitud}" required>

          <label for="domicilio">Domicilio:</label>
          <input type="text" id="domicilio" name="domicilio" value="${empresa.domicilio}" required>

          <label for="correo">Correo:</label>
          <input type="email" id="correo" name="correo" value="${empresa.email}" required>

          <label>Noticias</label>
          <button type="button" class="btn btn-primary" onclick="agregarNoticia(this)" data-toggle="modal" data-target="#modificarNoticia" data-empresa='${JSON.stringify(empresa)}'> Añadir Noticia </button>

          <table id="noticiasEmpresaTabla" border="1" style="margin-top: 20px; width: 100%;">
                <thead>
                    <tr>
                        <th>Titulo</th>
                        <th>Acciones</th>                 
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>

          <button type="submit" class="btn btn-primary">Listo</button>
      </form>
    `;
    
    const tablaNoticias = document.getElementById("noticiasEmpresaTabla");
    const tbody = tablaNoticias.querySelector("tbody");
    
    tbody.innerHTML = "";
    
    empresa.noticias.forEach(noticia => {
        if(noticia.borrado === 0){
            const fila = document.createElement("tr");
    
            fila.innerHTML = `
                <td>${noticia.titulo}</td>
                <td>
                    <button type="button" class="btn btn-primary" onclick="Hola()">Acceder</button>
                    <button onclick="modificarNoticia(this)" type="button" class="btn btn-secondary" data-toggle="modal" data-target="#modificarNoticia" data-noticia='${JSON.stringify(noticia)}' data-empresa='${JSON.stringify(empresa)}'> Modificar </button>
                    <button type="button" class="btn btn-danger" onclick="EliminarNoticia(${noticia.id},this)">Eliminar</button>
                </td>
            `;
        
            tbody.appendChild(fila);    
        }
        
    });

    const form = document.getElementById("empresaForm");

    form.onsubmit = function (e) {
        e.preventDefault();

        const empresaActualizada = {
            id: empresa.id,
            denominacion: document.getElementById("denominacion").value,
            telefono: document.getElementById("telefono").value,
            horario_atencion: document.getElementById("horarioAtencion").value,
            quienes_somos: document.getElementById("quienesSomos").value.trim(),
            latitud: parseFloat(document.getElementById("latitud").value),
            longitud: parseFloat(document.getElementById("longitud").value),
            domicilio: document.getElementById("domicilio").value,
            email: document.getElementById("correo").value
        };
        //console.log("Empresa recibida:", empresaActualizada);
        fetch(`/api/empresas/${empresa.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(empresaActualizada)
        })
        .then(response => {
            if (!response.ok) throw new Error("No se pudo actualizar la empresa");
            return response.json();
        })
        .then(data => {
            alert("Empresa actualizada correctamente");
            cargarpagina();
            $('#modalActualizar').modal('hide');
        })
        .catch(error => {
            console.error("Error al actualizar empresa:", error);
            alert("Hubo un error al actualizar la empresa");
        });
    }
    
}

function Hola(){
    console.log("HOLA");
}

function EliminarNoticia(id,boton){
    if (confirm(`¿Estás seguro de que deseas eliminar la noticia?`)) {
        fetch(`/api/noticias/${id}`, {
        method: "DELETE",
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("No se pudo eliminar la noticia.");
            }
            return response.json();
        })
        .then((data) => {
            alert(data.message);
            boton.closest("tr").remove(); // Elimina la fila de la tabla
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Hubo un problema al intentar eliminar la noticia.");
        });
    }
}


function modificarNoticia(boton){
    let noticia = JSON.parse(boton.getAttribute("data-noticia"));
    const empresa = JSON.parse(boton.getAttribute("data-empresa"));
    const fechaFormateada = new Date(noticia.fecha_publicacion).toISOString().split('T')[0];
    //console.log(noticia);
    
    const modalBody = document.querySelector("#modificarNoticia .modal-body");
    modalBody.innerHTML = `
      <form id="noticiaForm">
          <label for="titulo">Titulo:</label>
          <input type="text" id="titulo" name="titulo" value="${noticia.titulo}" required>

          <label for="resumen">Resumen:</label>
          <input type="text" id="resumen" name="resumen" value="${noticia.resumen}" required>

          <label for="imagen">Imagen:</label>
          <input type="text" id="imagen" name="imagen" value="${noticia.imagen}" required>

          <label for="contenidohtml">Contenido HTML:</label>
          <textarea id="contenidohtml" name="contenidohtml" rows="3" required>${noticia.contenido_html}</textarea>
    
          <label for="publicada">¿Publicada?</label>
          <select id="publicada" name="publicada" class="form-control" required>
            <option value="Y" ${noticia.publicada === 'Y' ? 'selected' : ''}>Sí</option>
            <option value="N" ${noticia.publicada === 'N' ? 'selected' : ''}>No</option>
          </select>

          <label for="fechaPublicacion">Fecha de publicación:</label>
          <input type="date" id="fechaPublicacion" name="fechaPublicacion" value="${fechaFormateada}" required>

          <button type="submit" class="btn btn-primary">Listo</button>
      </form>
    `;
    
    const form = document.getElementById("noticiaForm");

    form.onsubmit = function (e) {
        e.preventDefault();

        const noticiaActualizada = {
            id: noticia.id,
            titulo: document.getElementById("titulo").value,
            resumen: document.getElementById("resumen").value,
            imagen: document.getElementById("imagen").value,
            contenidohtml: document.getElementById("contenidohtml").value,
            publicada: document.getElementById("publicada").value,
            fecha_publicacion: document.getElementById("fechaPublicacion").value
        };

        console.log("Noticia recibida:", noticiaActualizada);
        
        fetch(`/api/noticias`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(noticiaActualizada)
        })
        .then(response => {
            if (!response.ok) throw new Error("No se pudo actualizar la noticia");
            return response.json();
        })
        .then(data => {
            alert("Noticia actualizada correctamenteE");
            $('#modificarNoticia').modal('hide');
            recargarTablaNoticias(empresa);
        })
        .catch(error => {
            console.error("Error al actualizar noticia:", error);
            alert("Hubo un error al actualizar la noticia");
        });
    }
}

function recargarTablaNoticias(empresa){
    const tablaNoticias = document.getElementById("noticiasEmpresaTabla");
    const tbody = tablaNoticias.querySelector("tbody");
    tbody.innerHTML = "";

            fetch(`/api/noticias/noticiasXempresaId/${empresa.id}`)
                .then((response) => response.json())
                .then((noticias) => {
                    noticias.filter(n => n.borrado === 0).forEach(noticia => {
                        
                        const fila = document.createElement("tr");
            
                        fila.innerHTML = `
                            <td>${noticia.titulo}</td>
                            <td>
                                <button type="button" class="btn btn-primary" onclick="Hola()">Acceder</button>
                                <button onclick="modificarNoticia(this)" type="button" class="btn btn-secondary" data-toggle="modal" data-target="#modificarNoticia" data-noticia='${JSON.stringify(noticia)}'> Modificar </button>
                                <button type="button" class="btn btn-danger" onclick="EliminarNoticia(${noticia.id},this)">Eliminar</button>
                            </td>
                        `;
                    
                        tbody.appendChild(fila);       
                    });
                })
                .catch(error => {
                    console.error("Error al actualizar la tabla Noticias:", error);
                    alert("Error al actualizar la tabla Noticias");
                });
}

function agregarNoticia(boton){
    let empresa = JSON.parse(boton.getAttribute("data-empresa"));
    const modalBody = document.querySelector("#modificarNoticia .modal-body");
    modalBody.innerHTML = `
      <form id="agregarNoticiaForm">
          <label for="titulo">Titulo:</label>
          <input type="text" id="titulo" name="titulo" required>

          <label for="resumen">Resumen:</label>
          <input type="text" id="resumen" name="resumen" required>

          <label for="imagen">Imagen:</label>
          <input type="text" id="imagen" name="imagen" required>

          <label for="contenidohtml">Contenido HTML:</label>
          <textarea id="contenidohtml" name="contenidohtml" rows="3" required></textarea>
    
          <label for="publicada">¿Publicada?</label>
          <select id="publicada" name="publicada" class="form-control" required>
            <option value="Y" >Sí</option>
            <option value="N" >No</option>
          </select>

          <label for="fechaPublicacion">Fecha de publicación:</label>
          <input type="date" id="fechaPublicacion" name="fechaPublicacion" required>

          <button type="submit" class="btn btn-primary">Listo</button>
      </form>
    `;
    
    const form = document.getElementById("agregarNoticiaForm");

    form.onsubmit = function (e) {
        e.preventDefault();

        const nuevaNoticia = {
            titulo: document.getElementById("titulo").value,
            resumen: document.getElementById("resumen").value,
            imagen: document.getElementById("imagen").value,
            contenido_html: document.getElementById("contenidohtml").value,
            publicada: document.getElementById("publicada").value,
            fecha_publicacion: document.getElementById("fechaPublicacion").value,
            idEmpresa: empresa.id
        };

        console.log("Noticia recibida:", nuevaNoticia);
        
        fetch(`/api/noticias`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevaNoticia)
        })
        .then(response => {
            if (!response.ok) throw new Error("No se pudo crear la noticia");
            return response.json();
        })
        .then(data => {
            alert("Noticia creada correctamente");
            $('#modificarNoticia').modal('hide');

            const tbody = document.querySelector("#noticiasEmpresaTabla tbody");
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${nuevaNoticia.titulo}</td>
                <td>
                    <button type="button" class="btn btn-primary" onclick="Hola()">Acceder</button>
                    <button onclick="modificarNoticia(this)" type="button" class="btn btn-secondary" data-toggle="modal" data-target="#modificarNoticia" data-noticia='${JSON.stringify(data.noticia)}'>Modificar</button>
                    <button type="button" class="btn btn-danger" onclick="EliminarNoticia(${data.noticia.id}, this)">Eliminar</button>
                </td>
            `;

            tbody.appendChild(fila);

        })
        .catch(error => {
            console.error("Error al agregar noticia:", error);
            alert("Hubo un error al agregar la noticiaa");
        });
    }
}












































function restablecer(){
    fetch(`/api/empresas/restablecer`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) throw new Error("No se pudo restablecer");
        return response.json();
    })
    .then(data => {
        alert("restablecido correcto");
        cargarpagina();
    })
    .catch(error => {
        console.error("Error al restablecer:", error);
        alert("Hubo un error al restablecer");
    });
}