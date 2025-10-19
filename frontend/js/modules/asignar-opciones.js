// Asignar Opciones a Role - Tablas: ROLE, OPCION, ROLE_OPCION, MENU

document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.rol !== 1 && user.rol !== '1') {
        document.body.innerHTML = '<h2>Acceso restringido: solo el administrador puede asignar permisos.</h2>';
        return;
    }
    cargarRoles();
    const selectRole = document.getElementById('selectRole');
    if (selectRole) {
        selectRole.addEventListener('change', cargarPermisosDeRol);
    } else {
        mostrarErrorVista('No se encontró el selector de roles en el HTML.');
    }
});

function mostrarErrorVista(msg) {
    let cont = document.getElementById('opcionesContainer');
    if (cont) {
        cont.innerHTML = `<div style='color:red;text-align:center;margin:2rem;'>${msg}</div>`;
    } else {
        document.body.innerHTML += `<div style='color:red;text-align:center;margin:2rem;'>${msg}</div>`;
    }
}



async function cargarRoles() {
    try {
        const response = await fetch(`${API_BASE_URL}/roles`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        if (!response.ok) {
            mostrarErrorVista('No se pudo obtener la lista de roles.');
            return;
        }
        const roles = await response.json();
        const select = document.getElementById('selectRole');
        if (!select) {
            mostrarErrorVista('No se encontró el selector de roles en el HTML.');
            return;
        }
        select.innerHTML = '<option value="">Selecciona un rol</option>';
        if (!roles.length) {
            mostrarErrorVista('No hay roles registrados en el sistema.');
            return;
        }
        roles.forEach(role => {
            select.innerHTML += `<option value="${role.IdRole}">${role.Nombre}</option>`;
        });
    } catch (error) {
        mostrarErrorVista('Error cargando roles: ' + error.message);
    }
}

async function cargarPermisosDeRol() {
    const idRole = document.getElementById('selectRole').value;
    if (!idRole) {
        mostrarErrorVista('Selecciona un rol para ver las opciones.');
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/role-opciones/${idRole}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        if (!response.ok) {
            mostrarErrorVista('No se pudieron obtener las opciones para el rol seleccionado.');
            return;
        }
        const opciones = await response.json();
        if (!opciones.length) {
            mostrarErrorVista('No hay opciones configuradas para este rol.');
            return;
        }
        renderPermisosOpciones(opciones, idRole);
    } catch (error) {
        mostrarErrorVista('Error cargando opciones del rol: ' + error.message);
    }
}

function renderPermisosOpciones(opciones, idRole) {
    const tbody = document.getElementById('permisos-table-body');
    tbody.innerHTML = '';
    opciones.forEach(op => {
        tbody.innerHTML += `
            <tr>
                <td>${op.NombreOpcion}</td>
                <td><input type="checkbox" ${op.Alta ? 'checked' : ''} onchange="actualizarPermiso(${idRole},${op.IdOpcion},'Alta',this.checked)"></td>
                <td><input type="checkbox" ${op.Baja ? 'checked' : ''} onchange="actualizarPermiso(${idRole},${op.IdOpcion},'Baja',this.checked)"></td>
                <td><input type="checkbox" ${op.Cambio ? 'checked' : ''} onchange="actualizarPermiso(${idRole},${op.IdOpcion},'Cambio',this.checked)"></td>
                <td><input type="checkbox" ${op.Imprimir ? 'checked' : ''} onchange="actualizarPermiso(${idRole},${op.IdOpcion},'Imprimir',this.checked)"></td>
                <td><input type="checkbox" ${op.Exportar ? 'checked' : ''} onchange="actualizarPermiso(${idRole},${op.IdOpcion},'Exportar',this.checked)"></td>
            </tr>
        `;
    });
}

async function actualizarPermiso(idRole, idOpcion, permiso, valor) {
    // Obtener el resto de permisos actuales para la opción
    const fila = Array.from(document.querySelectorAll(`#permisos-table-body tr`)).find(tr =>
        tr.children[2].textContent == document.querySelector(`#permisos-table-body tr td input[onchange*='${idOpcion}']`).parentElement.parentElement.children[2].textContent
    );
    const checkboxes = fila.querySelectorAll('input[type=checkbox]');
    const permisos = ['Alta','Baja','Cambio','Imprimir','Exportar'];
    const body = { IdRole: idRole, IdOpcion: idOpcion };
    permisos.forEach((p, idx) => {
        body[p] = (p === permiso) ? valor : checkboxes[idx].checked;
    });
    try {
        await fetch('/api/role-opciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(body)
        });
    } catch (error) {
        alert('Error actualizando permiso');
    }
}

