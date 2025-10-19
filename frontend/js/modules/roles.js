
async function editRole(roleId) {
    openRoleModal(roleId);
}
async function updateRole(formData) {
    await API.updateRole(formData);
}

async function deleteRole(roleId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este role?')) return;
    try {
        const result = await API.deleteRole(roleId);
        if (result && result.error) {
            showError('No se pudo eliminar: ' + result.error);
        } else {
            loadRoles();
            showSuccess('Role eliminado correctamente');
        }
    } catch (error) {
        console.error('Error eliminando role:', error);
        showError('Error al eliminar el role: ' + (error.message || error));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    cargarPermisosUsuarioRoles().then(permisos => {
        window.PERMISOS_ROLES = permisos;
        renderBotonesPorPermisoRoles(permisos);
        loadRoles();
        setupEventListeners();
    });
// cargar los permisosd
async function cargarPermisosUsuarioRoles() {
    try {
        const response = await fetch('/api/permisos-usuario', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const permisos = await response.json();
        // Buscar permisos para la opción Roles
        return permisos.find(p => p.NombreOpcion === 'Roles') || {};
    } catch (e) {
        return {};
    }
}

// Mostrar/ocultar botones según permisos
function renderBotonesPorPermisoRoles(permisos) {
    const btnAdd = document.querySelector('.btn-add');
    if (btnAdd) btnAdd.style.display = permisos.Alta ? '' : 'none';
}
});

function setupEventListeners() {
    document.getElementById('searchRoles').addEventListener('input', filterRoles);
}

async function loadRoles() {
    try {
        const roles = await API.getRoles();
        renderRoles(roles);
    } catch (error) {
        console.error('Error cargando roles:', error);
        showError('Error al cargar los roles');
    }
}



function renderRoles(roles) {
    const tbody = document.getElementById('roles-table-body');
    tbody.innerHTML = '';

    const permisos = window.PERMISOS_ROLES || {};
    roles.forEach(role => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${role.IdRole || role.id}</td>
            <td>${role.Nombre || role.nombre}</td>
            <td>${role.FechaCreacion ? (role.FechaCreacion.substring(0, 10)) : ''}</td>
            <td>
                <div class="table-actions">
                    ${permisos.Cambio ? `<button class=\"btn-action btn-edit\">Editar</button>` : ''}
                    ${permisos.Baja ? `<button class=\"btn-action btn-delete\">Eliminar</button>` : ''}
                </div>
            </td>
        `;
        if (permisos.Cambio) row.querySelector('.btn-edit').addEventListener('click', () => editRole(role.IdRole || role.id));
        if (permisos.Baja) row.querySelector('.btn-delete').addEventListener('click', () => deleteRole(role.IdRole || role.id));
        tbody.appendChild(row);
    });
}

function filterRoles() {
    const searchText = document.getElementById('searchRoles').value.toLowerCase();
    const rows = document.querySelectorAll('#roles-table-body tr');
    rows.forEach(row => {
        const nombre = row.cells[1].textContent.toLowerCase();
        const matchesSearch = nombre.includes(searchText);
        row.style.display = matchesSearch ? '' : 'none';
    });
}

function openRoleModal(roleId = null) {
    const modal = document.getElementById('roleModal');
    const title = document.getElementById('modalRoleTitle');
    
    if (roleId) {
        title.textContent = 'Editar Role';
        loadRoleData(roleId);
    } else {
        title.textContent = 'Nuevo Role';
        document.getElementById('roleForm').reset();
        document.getElementById('roleId').value = '';
    }
    
    modal.style.display = 'block';
}

function closeRoleModal() {
    document.getElementById('roleModal').style.display = 'none';
}

async function loadRoleData(roleId) {
    try {
        const role = await getRoleById(roleId);
        document.getElementById('roleId').value = role.IdRole || role.id;
        document.getElementById('roleNombre').value = role.Nombre || role.nombre;
    } catch (error) {
        console.error('Error cargando datos del role:', error);
        showError('Error al cargar los datos del role');
    }
}

async function saveRole() {
    const formData = {
        IdRole: document.getElementById('roleId').value,
        Nombre: document.getElementById('roleNombre').value
    };

    try {
        if (formData.IdRole) {
            await updateRole(formData);
        } else {
            await createRole(formData);
        }
        closeRoleModal();
        loadRoles();
        showSuccess('Role guardado correctamente');
    } catch (error) {
        console.error('Error guardando role:', error);
        showError('Error al guardar el role');
    }
}

async function deleteRole(roleId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este role?')) return;
    
    try {
        await fetch(`/api/roles/${roleId}`, { method: 'DELETE' });
        loadRoles();
        showSuccess('Role eliminado correctamente');
    } catch (error) {
        console.error('Error eliminando role:', error);
        showError('Error al eliminar el role');
    }
}

// Cerrar modal al hacer clic fuera del contenido
window.onclick = function(event) {
    const modal = document.getElementById('roleModal');
    if (event.target === modal) {
        closeRoleModal();
    }
};