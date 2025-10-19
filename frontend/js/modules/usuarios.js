// Gestión de Usuarios - Tabla: USUARIO
document.addEventListener('DOMContentLoaded', function() {
    // construirMenuLateral(); // Desactivado para mostrar siempre el menú lateral
    loadUsuarios();
    loadRolesForForm();
    loadSucursalesForForm();
    loadGenerosForForm();
    loadStatusForForm();
    setupEventListeners();
    setupFotoPreview();
async function construirMenuLateral() {
    try {
        const permisos = await getPermisosUsuario();
        // Opciones permitidas (por nombre de opción y permiso Alta, Baja, Cambio, Imprimir, Exportar)
        const opcionesPermitidas = new Set();
        permisos.forEach(op => {
            if (op.Alta || op.Baja || op.Cambio || op.Imprimir || op.Exportar) {
                opcionesPermitidas.add(op.NombreOpcion);
            }
        });
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(link => {
            const texto = link.textContent.trim();
            if (!opcionesPermitidas.has(texto) && texto !== 'Dashboard') {
                link.style.display = 'none';
            }
        });
    } catch (error) {
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(link => {
            const texto = link.textContent.trim();
            if (texto !== 'Dashboard') {
                link.style.display = 'none';
            }
        });
    }
}
});

function setupFotoPreview() {
    const fotoInput = document.getElementById('usuarioFoto');
    const preview = document.getElementById('previewFoto');
    if (!fotoInput || !preview) return;
    fotoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            showError('Solo se permiten imágenes.');
            fotoInput.value = '';
            return;
        }
        // validar tamaño (máx 2MB)
        if (file.size > 2 * 1024 * 1024) {
            showError('La imagen no debe superar los 2MB.');
            fotoInput.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = function(evt) {
            preview.src = evt.target.result;
            preview.style.display = 'block';
            preview.dataset.base64 = evt.target.result;
        };
        reader.readAsDataURL(file);
    });
    // Efecto visual al pasar el mouse sobre la foto de perfil
    preview.addEventListener('mouseenter', function() {
        preview.style.boxShadow = '0 0 0 3px #3498db';
        preview.style.cursor = 'pointer';
    });
    preview.addEventListener('mouseleave', function() {
        preview.style.boxShadow = '';
        preview.style.cursor = '';
    });
}

function setupEventListeners() {
}


async function loadUsuarios() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/usuarios', {
            headers: token ? { 'Authorization': 'Bearer ' + token } : {}
        });
        if (response.status === 401 || response.status === 403) {
            showError('No autorizado para cargar usuarios. Inicie sesión de nuevo.');
            setTimeout(() => window.location.href = '/login.html', 1500);
            return;
        }
        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        const usuarios = await response.json();
        renderUsuarios(usuarios);
    } catch (error) {
        console.error('Error cargando usuarios:', error);
        showError('Error al cargar los usuarios');
    }
}

function renderUsuarios(usuarios) {
    const tbody = document.getElementById('usuarios-table-body');
    tbody.innerHTML = '';
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const esAdmin = user.IdRole == 1 || user.rol == 1 || user.IdRole === '1' || user.rol === '1';
    usuarios.forEach(usuario => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${usuario.IdUsuario || ''}</td>
            <td>${usuario.Nombre || ''}</td>
            <td>${usuario.Apellido || ''}</td>
            <td>${usuario.CorreoElectronico || ''}</td>
            <td>${usuario.FechaNacimiento ? usuario.FechaNacimiento.substring(0,10) : ''}</td>
            <td>${usuario.IdRole || ''}</td>
            <td>${usuario.IdGenero || ''}</td>
            <td>${usuario.IdStatusUsuario || ''}</td>
            <td>${usuario.TelefonoMovil || ''}</td>
            <td>${usuario.IdSucursal || ''}</td>
            <td>${usuario.Fotografia ? `<img src='${usuario.Fotografia}' style='max-width:40px;max-height:40px;border-radius:6px;'/>` : ''}</td>
            <td>
                <div class="table-actions">
                    ${(esAdmin) ? `<button class=\"btn-action btn-edit\" onclick=\"openUsuarioModal('${usuario.IdUsuario}')\">Editar</button><button class=\"btn-action btn-delete\" onclick=\"deleteUsuario('${usuario.IdUsuario}')\">Eliminar</button>` : `<button class=\"btn-action btn-edit\" onclick=\"openUsuarioModal('${usuario.IdUsuario}')\">Editar</button><button class=\"btn-action btn-delete\" onclick=\"deleteUsuario('${usuario.IdUsuario}')\">Eliminar</button>`}
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}



async function loadRolesForForm() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/roles', {
            headers: token ? { 'Authorization': 'Bearer ' + token } : {}
        });
        if (response.status === 401 || response.status === 403) {
            showError('No autorizado para cargar roles. Inicie sesión de nuevo.');
            return;
        }
        if (!response.ok) throw new Error('Error al cargar roles');
        const roles = await response.json();
        const rolSelect = document.getElementById('usuarioRol');
        rolSelect.innerHTML = '<option value="">Seleccionar rol</option>';
        roles.forEach(role => {
            rolSelect.innerHTML += `<option value="${role.IdRole}">${role.Nombre}</option>`;
        });
    } catch (error) {
        console.error('Error cargando roles:', error);
        showError('Error al cargar roles');
    }
}

async function loadGenerosForForm() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/generos', {
            headers: token ? { 'Authorization': 'Bearer ' + token } : {}
        });
        if (response.status === 401 || response.status === 403) {
            showError('No autorizado para cargar géneros. Inicie sesión de nuevo.');
            return;
        }
        if (!response.ok) throw new Error('Error al cargar géneros');
        const generos = await response.json();
        const generoSelect = document.getElementById('usuarioGenero');
        generoSelect.innerHTML = '<option value="">Seleccionar género</option>';
        generos.forEach(genero => {
            generoSelect.innerHTML += `<option value="${genero.IdGenero}">${genero.Nombre}</option>`;
        });
    } catch (error) {
        console.error('Error cargando géneros:', error);
        showError('Error al cargar géneros');
    }
}

async function loadStatusForForm() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/status-usuario', {
            headers: token ? { 'Authorization': 'Bearer ' + token } : {}
        });
        if (response.status === 401 || response.status === 403) {
            showError('No autorizado para cargar estatus usuario. Inicie sesión de nuevo.');
            return;
        }
        if (!response.ok) throw new Error('Error al cargar estatus usuario');
        const statusUsuarios = await response.json();
        const statusSelect = document.getElementById('usuarioStatus');
        statusSelect.innerHTML = '<option value="">Seleccionar estatus</option>';
        statusUsuarios.forEach(status => {
            statusSelect.innerHTML += `<option value="${status.IdStatusUsuario}">${status.Nombre}</option>`;
        });
    } catch (error) {
        console.error('Error cargando estatus de usuario:', error);
        showError('Error al cargar estatus usuario');
    }
}

function filterUsuarios() {
    const searchText = document.getElementById('searchUsuarios').value.toLowerCase();
    const rolFilter = document.getElementById('filterRol').value;
    const statusFilter = document.getElementById('filterStatus').value;
    
    const rows = document.querySelectorAll('#usuarios-table-body tr');
    
    rows.forEach(row => {
        const username = row.cells[1].textContent.toLowerCase();
        const nombre = row.cells[2].textContent.toLowerCase();
        const rol = row.cells[4].getAttribute('data-rol-id') || '';
        const estado = row.cells[5].textContent.toLowerCase();
        
        const matchesSearch = username.includes(searchText) || nombre.includes(searchText);
        const matchesRol = !rolFilter || rol === rolFilter;
        const matchesStatus = !statusFilter || estado === statusFilter;
        
        row.style.display = matchesSearch && matchesRol && matchesStatus ? '' : 'none';
    });
}

function openUsuarioModal(usuarioId = null) {
    const modal = document.getElementById('usuarioModal');
    const title = document.getElementById('modalUsuarioTitle');
    const passwordField = document.getElementById('usuarioPassword');
    if (usuarioId) {
        title.textContent = 'Editar Usuario';
        passwordField.required = false;
        passwordField.placeholder = 'Dejar vacío para mantener la actual';
        document.getElementById('usuarioIdOriginal').value = usuarioId;
        loadUsuarioData(usuarioId);
    } else {
        title.textContent = 'Nuevo Usuario';
        passwordField.required = true;
        passwordField.placeholder = '';
        document.getElementById('usuarioForm').reset();
        document.getElementById('usuarioId').value = '';
        document.getElementById('usuarioIdOriginal').value = '';
    }
    modal.style.display = 'block';
}

function closeUsuarioModal() {
    document.getElementById('usuarioModal').style.display = 'none';
}

async function loadUsuarioData(usuarioId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/usuarios/${usuarioId}`, {
            headers: token ? { 'Authorization': 'Bearer ' + token } : {}
        });
        if (response.status === 401 || response.status === 403) {
            showError('No autorizado para cargar usuario. Inicie sesión de nuevo.');
            setTimeout(() => window.location.href = '/login.html', 1500);
            return;
        }
        if (!response.ok) throw new Error('Error al cargar usuario');
        const usuario = await response.json();
    document.getElementById('usuarioId').value = usuario.IdUsuario || '';
    document.getElementById('usuarioIdOriginal').value = usuario.IdUsuario || '';
    document.getElementById('usuarioUsername').value = usuario.IdUsuario || '';
        document.getElementById('usuarioPassword').value = '';
        document.getElementById('usuarioNombre').value = usuario.Nombre || '';
        document.getElementById('usuarioApellido').value = usuario.Apellido || '';
        document.getElementById('usuarioEmail').value = usuario.CorreoElectronico || '';
        document.getElementById('usuarioFechaNacimiento').value = usuario.FechaNacimiento ? usuario.FechaNacimiento.substring(0,10) : '';
        document.getElementById('usuarioRol').value = usuario.IdRole || '';
        document.getElementById('usuarioGenero').value = usuario.IdGenero || '';
        document.getElementById('usuarioStatus').value = usuario.IdStatusUsuario || '';
        document.getElementById('usuarioTelefono').value = usuario.TelefonoMovil || '';
        document.getElementById('usuarioSucursal').value = usuario.IdSucursal || '';
        document.getElementById('usuarioPregunta').value = usuario.Pregunta || '';
        document.getElementById('usuarioRespuesta').value = usuario.Respuesta || '';
        document.getElementById('usuarioRequiereCambio').checked = usuario.RequiereCambiarPassword == 1;
        const preview = document.getElementById('previewFoto');
        if (usuario.Fotografia) {
            preview.src = usuario.Fotografia;
            preview.style.display = 'block';
            preview.dataset.base64 = usuario.Fotografia;
        } else {
            preview.src = '';
            preview.style.display = 'none';
            preview.dataset.base64 = '';
        }
    } catch (error) {
        console.error('Error cargando datos del usuario:', error);
        showError('Error al cargar los datos del usuario');
    }
}

async function saveUsuario() {
    const formData = {
        IdUsuario: document.getElementById('usuarioId').value,
        Password: document.getElementById('usuarioPassword').value,
        Nombre: document.getElementById('usuarioNombre').value,
        Apellido: document.getElementById('usuarioApellido').value,
        CorreoElectronico: document.getElementById('usuarioEmail').value,
        FechaNacimiento: document.getElementById('usuarioFechaNacimiento').value,
        IdRole: document.getElementById('usuarioRol').value,
        IdGenero: document.getElementById('usuarioGenero').value || null,
        IdStatusUsuario: document.getElementById('usuarioStatus').value,
        TelefonoMovil: document.getElementById('usuarioTelefono').value,
        IdSucursal: document.getElementById('usuarioSucursal').value,
        Pregunta: document.getElementById('usuarioPregunta').value,
        Respuesta: document.getElementById('usuarioRespuesta').value,
        RequiereCambiarPassword: document.getElementById('usuarioRequiereCambio').checked ? 1 : 0,
        Fotografia: document.getElementById('previewFoto').dataset.base64 || ''
    };
    if (document.getElementById('usuarioId').value && !formData.Password) {
        delete formData.Password;
    }
    try {
        const token = localStorage.getItem('token');
        let response;
        const idOriginal = document.getElementById('usuarioIdOriginal').value;
        if (idOriginal) {
            response = await fetch(`/api/usuarios/${encodeURIComponent(idOriginal)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': 'Bearer ' + token } : {})
                },
                body: JSON.stringify(formData)
            });
        } else {
            response = await fetch('/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': 'Bearer ' + token } : {})
                },
                body: JSON.stringify(formData)
            });
        }
        if (response.status === 401 || response.status === 403) {
            showError('No autorizado para guardar usuario. Inicie sesión de nuevo.');
            setTimeout(() => window.location.href = '/login.html', 1500);
            return;
        }
        if (!response.ok) throw new Error('Error al guardar usuario');
        closeUsuarioModal();
        loadUsuarios();
        showSuccess('Usuario guardado correctamente');
    } catch (error) {
        console.error('Error guardando usuario:', error);
        showError('Error al guardar el usuario');
    }
}

async function deleteUsuario(usuarioId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/usuarios/${usuarioId}`, {
            method: 'DELETE',
            headers: token ? { 'Authorization': 'Bearer ' + token } : {}
        });
        if (response.status === 401 || response.status === 403) {
            showError('No autorizado para eliminar usuario. Inicie sesión de nuevo.');
            setTimeout(() => window.location.href = '/login.html', 1500);
            return;
        }
        if (!response.ok) throw new Error('Error al eliminar usuario');
        loadUsuarios();
        showSuccess('Usuario eliminado correctamente');
    } catch (error) {
        console.error('Error eliminando usuario:', error);
        showError('Error al eliminar el usuario');
    }
}

window.onclick = function(event) {
    const modal = document.getElementById('usuarioModal');
    if (event.target === modal) {
        closeUsuarioModal();
    }
};

// Exponer funciones globalmente para HTML inline
window.openUsuarioModal = openUsuarioModal;
window.deleteUsuario = deleteUsuario;
window.editUsuario = openUsuarioModal;

document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('usuarioIdOriginal')) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.id = 'usuarioIdOriginal';
        input.name = 'usuarioIdOriginal';
        document.getElementById('usuarioForm').appendChild(input);
    }
});

async function loadSucursalesForForm() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/sucursales', {
            headers: token ? { 'Authorization': 'Bearer ' + token } : {}
        });
        if (response.status === 401 || response.status === 403) {
            showError('No autorizado para cargar sucursales. Inicie sesión de nuevo.');
            return;
        }
        if (!response.ok) throw new Error('Error al cargar sucursales');
        const sucursales = await response.json();
        const sucursalSelect = document.getElementById('usuarioSucursal');
        sucursalSelect.innerHTML = '<option value="">Seleccionar sucursal</option>';
        sucursales.forEach(suc => {
            sucursalSelect.innerHTML += `<option value="${suc.IdSucursal}">${suc.Nombre}</option>`;
        });
    } catch (error) {
        console.error('Error cargando sucursales:', error);
        showError('Error al cargar sucursales');
    }
}