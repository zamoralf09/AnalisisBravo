// Gestión de Estatus de Usuario - Tabla: STATUS_USUARIO
document.addEventListener('DOMContentLoaded', function() {
    cargarPermisosUsuarioStatus().then(permisos => {
        window.PERMISOS_STATUS_USUARIO = permisos;
        renderBotonesPorPermisoStatus(permisos);
        loadStatusUsuario();
        setupEventListeners();
    });
// Cargar permisos del usuario para la opción Status Usuario
async function cargarPermisosUsuarioStatus() {
    try {
        const response = await fetch('/api/permisos-usuario', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const permisos = await response.json();
        // Buscar permisos para la opción Status Usuario
        return permisos.find(p => p.NombreOpcion === 'Status Usuario') || {};
    } catch (e) {
        return {};
    }
}

// Mostrar/ocultar botones según permisos
function renderBotonesPorPermisoStatus(permisos) {
    // Mostrar siempre si es admin
    const btnAdd = document.querySelector('.btn-add');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const esAdmin = user.IdRole == 1 || user.rol == 1 || user.IdRole === '1' || user.rol === '1';
    if (btnAdd) btnAdd.style.display = (permisos.Alta || esAdmin) ? '' : 'none';
}
});

function setupEventListeners() {
    document.getElementById('searchStatusUsuario').addEventListener('input', filterStatusUsuario);
}

async function loadStatusUsuario() {
    try {
        const token = localStorage.getItem('token');
        console.log('Token JWT:', token);
        const statusUsuarios = await API.getStatusUsuario();
        console.log('Respuesta de API.getStatusUsuario:', statusUsuarios);
        renderStatusUsuario(statusUsuarios);
    } catch (error) {
        console.error('Error cargando estatus de usuario:', error);
        API.showError('Error al cargar los estatus de usuario');
    }
}

function renderStatusUsuario(statusUsuarios) {
    const tbody = document.getElementById('status-usuario-table-body');
    tbody.innerHTML = '';

    const permisos = window.PERMISOS_STATUS_USUARIO || {};
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const esAdmin = user.IdRole == 1 || user.rol == 1 || user.IdRole === '1' || user.rol === '1';
    statusUsuarios.forEach(status => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${status.IdStatusUsuario}</td>
            <td>${status.Nombre}</td>
            <td>
                <div class="table-actions">
                    ${(permisos.Cambio || esAdmin) ? `<button class=\"btn-action btn-edit\" onclick=\"editStatusUsuario(${status.IdStatusUsuario})\">Editar</button>` : ''}
                    ${(permisos.Baja || esAdmin) ? `<button class=\"btn-action btn-delete\" onclick=\"deleteStatusUsuario(${status.IdStatusUsuario})\">Eliminar</button>` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterStatusUsuario() {
    const searchText = document.getElementById('searchStatusUsuario').value.toLowerCase();
    const rows = document.querySelectorAll('#status-usuario-table-body tr');
    
    rows.forEach(row => {
        const nombre = row.cells[1].textContent.toLowerCase();
        const matchesSearch = nombre.includes(searchText);
        
        row.style.display = matchesSearch ? '' : 'none';
    });
}

function openStatusUsuarioModal(statusId = null) {
    const modal = document.getElementById('statusUsuarioModal');
    const title = document.getElementById('modalStatusUsuarioTitle');
    
    if (statusId) {
        title.textContent = 'Editar Estatus de Usuario';
        loadStatusUsuarioData(statusId);
    } else {
        title.textContent = 'Nuevo Estatus de Usuario';
        document.getElementById('statusUsuarioForm').reset();
        document.getElementById('statusUsuarioId').value = '';
    }
    
    modal.style.display = 'block';
}

function closeStatusUsuarioModal() {
    document.getElementById('statusUsuarioModal').style.display = 'none';
}

async function loadStatusUsuarioData(statusId) {
    try {
        const status = await API.getStatusUsuarioById(statusId);
        document.getElementById('statusUsuarioId').value = status.IdStatusUsuario;
        document.getElementById('statusUsuarioNombre').value = status.Nombre;
    } catch (error) {
        console.error('Error cargando datos de estatus de usuario:', error);
        API.showError('Error al cargar los datos del estatus de usuario');
    }
}

async function saveStatusUsuario() {
    const formData = {
        IdStatusUsuario: document.getElementById('statusUsuarioId').value,
        Nombre: document.getElementById('statusUsuarioNombre').value
    };
    console.log('Datos a enviar (saveStatusUsuario):', formData);
    try {
        let response;
        if (formData.IdStatusUsuario) {
            response = await API.updateStatusUsuario({ id: formData.IdStatusUsuario, Nombre: formData.Nombre });
        } else {
            response = await API.createStatusUsuario({ Nombre: formData.Nombre });
        }
        console.log('Respuesta de API (saveStatusUsuario):', response);
        closeStatusUsuarioModal();
        loadStatusUsuario();
        API.showSuccess('Estatus de usuario guardado correctamente');
    } catch (error) {
        console.error('Error guardando estatus de usuario:', error);
        API.showError('Error al guardar el estatus de usuario');
    }
}

async function deleteStatusUsuario(statusId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este estatus de usuario?')) return;
    
    try {
        await API.deleteStatusUsuario(statusId);
        loadStatusUsuario();
        API.showSuccess('Estatus de usuario eliminado correctamente');
    } catch (error) {
        console.error('Error eliminando estatus de usuario:', error);
        API.showError('Error al eliminar el estatus de usuario');
    }
}

function editStatusUsuario(statusId) {
    openStatusUsuarioModal(statusId);
}

// Cerrar modal al hacer clic fuera del contenido
window.onclick = function(event) {
    const modal = document.getElementById('statusUsuarioModal');
    if (event.target === modal) {
        closeStatusUsuarioModal();
    }
};