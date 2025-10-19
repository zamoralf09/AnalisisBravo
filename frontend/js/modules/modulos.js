// Gestión de Módulos - Tabla: MODULO
document.addEventListener('DOMContentLoaded', function() {
    cargarPermisosUsuarioModulos().then(permisos => {
        window.PERMISOS_MODULOS = permisos;
        renderBotonesPorPermisoModulos(permisos);
        loadModulos();
    });
// Cargar permisos del usuario para la opción Módulos
async function cargarPermisosUsuarioModulos() {
    try {
        const response = await fetch('/api/permisos-usuario', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const permisos = await response.json();
        return permisos.find(p => p.NombreOpcion === 'Módulos') || {};
    } catch (e) {
        return {};
    }
}

// Mostrar/ocultar botones según permisos
function renderBotonesPorPermisoModulos(permisos) {
    const btnAdd = document.querySelector('.btn-add');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const esAdmin = user.IdRole == 1 || user.rol == 1 || user.IdRole === '1' || user.rol === '1';
    if (btnAdd) btnAdd.style.display = (permisos.Alta || esAdmin) ? '' : 'none';
}
});

// Exportar getModulos para otros módulos
window.getModulos = getModulos;

async function loadModulos() {
    try {
        const modulos = await getModulos();
        renderModulos(modulos);
    } catch (error) {
        console.error('Error cargando módulos:', error);
        showError('Error al cargar los módulos');
    }
}

async function getModulos() {
    try {
        const response = await fetch('/api/modulos', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        const contentType = response.headers.get('content-type');
        if (!response.ok || !contentType || !contentType.includes('application/json')) {
            throw new Error('No autorizado o endpoint no disponible. ¿Sesión iniciada?');
        }
        const data = await response.json();
        return data.map(m => ({
            id: m.IdModulo,
            nombre: m.Nombre,
            orden: m.OrdenMenu
        }));
    } catch (error) {
        console.error('Error obteniendo módulos:', error);
        showError('No se pudo obtener la lista de módulos. ¿Sesión iniciada?');
        return [];
    }
}

function renderModulos(modulos) {
    const tbody = document.getElementById('modulos-table-body');
    tbody.innerHTML = '';
    const permisos = window.PERMISOS_MODULOS || {};
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const esAdmin = user.IdRole == 1 || user.rol == 1 || user.IdRole === '1' || user.rol === '1';
    modulos.forEach(modulo => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${modulo.id}</td>
            <td>${modulo.nombre}</td>
            <td>${modulo.orden}</td>
            <td>
                <div class="table-actions">
                    ${(permisos.Cambio || esAdmin) ? `<button class=\"btn-action btn-edit\" onclick=\"openModuloModal(${modulo.id})\">Editar</button>` : ''}
                    ${(permisos.Baja || esAdmin) ? `<button class=\"btn-action btn-delete\" onclick=\"deleteModulo(${modulo.id})\">Eliminar</button>` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function getModuloById(id) {
    const modulos = await getModulos();
    return modulos.find(m => m.id == id);
}

async function saveModulo() {
    const formData = {
        id: document.getElementById('moduloId').value,
        nombre: document.getElementById('moduloNombre').value,
        orden: document.getElementById('moduloOrden').value
    };
    try {
        if (formData.id) {
            await updateModulo(formData);
        } else {
            await createModulo(formData);
        }
        closeModuloModal();
        loadModulos();
        showSuccess('Módulo guardado correctamente');
    } catch (error) {
        console.error('Error guardando módulo:', error);
        showError('Error al guardar el módulo');
    }
}

async function createModulo(data) {
    const response = await fetch('/api/modulos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ Nombre: data.nombre, OrdenMenu: data.orden })
    });
    if (!response.ok) throw new Error('Error al crear módulo');
    return response.json();
}

async function updateModulo(data) {
    const response = await fetch(`/api/modulos/${data.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ Nombre: data.nombre, OrdenMenu: data.orden })
    });
    if (!response.ok) throw new Error('Error al actualizar módulo');
    return response.json();
}

async function deleteModulo(moduloId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este módulo?')) return;
    try {
        const response = await fetch(`/api/modulos/${moduloId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        if (!response.ok) throw new Error('Error al eliminar módulo');
        loadModulos();
        showSuccess('Módulo eliminado correctamente');
    } catch (error) {
        console.error('Error eliminando módulo:', error);
        showError('Error al eliminar el módulo');
    }
}

function openModuloModal(moduloId = null) {
    const modal = document.getElementById('moduloModal');
    const title = document.getElementById('modalModuloTitle');
    if (moduloId) {
        title.textContent = 'Editar Módulo';
        loadModuloData(moduloId);
    } else {
        title.textContent = 'Nuevo Módulo';
        document.getElementById('moduloForm').reset();
        document.getElementById('moduloId').value = '';
    }
    modal.style.display = 'block';
}

function closeModuloModal() {
    document.getElementById('moduloModal').style.display = 'none';
}

async function loadModuloData(moduloId) {
    try {
        const modulo = await getModuloById(moduloId);
        document.getElementById('moduloId').value = modulo.id;
        document.getElementById('moduloNombre').value = modulo.nombre;
        document.getElementById('moduloOrden').value = modulo.orden;
    } catch (error) {
        console.error('Error cargando datos del módulo:', error);
        showError('Error al cargar los datos del módulo');
    }
}

// Cerrar modal al hacer clic fuera del contenido
window.onclick = function(event) {
    const modal = document.getElementById('moduloModal');
    if (event.target === modal) {
        closeModuloModal();
    }
};