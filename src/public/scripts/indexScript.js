document.addEventListener("DOMContentLoaded", cargarpagina);

function cargarpagina(){
    fetch("/api/empresas")
        .then((response) => response.json())
        .then((data) => { 
            mostrarEmpresas(data);
        })
        .catch((error) => {
            console.error("Error al cargar las empresas:", error);
        });
}

function mostrarEmpresas(data){

    const tbEmpresa = document.getElementById("empresas-body");
    tbEmpresa.innerHTML="";
            data.forEach(empresa => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${empresa.denominacion}</td>
                    <td><a href="home.html?id=${empresa.id}">Ver Empresa</a></td>
                    <td>
                    <button type="button" class="btn btn-primary" onclick="eliminarEmpresa(${empresa.id})"> Eliminar </button>
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalActualizar" data-id="${empresa.id}"> Actualizar </button>
                    </td>
                `;
                tbEmpresa.appendChild(fila);
            });
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

