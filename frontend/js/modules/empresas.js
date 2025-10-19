function toggleConfig() {
    const configContent = document.getElementById('configContent');
    const badge = document.getElementById('configBadge');
    if (configContent.style.display === 'block') {
        configContent.style.display = 'none';
        badge.textContent = 'Oculto';
    } else {
        configContent.style.display = 'block';
        badge.textContent = 'Visible';
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    // Ocultar config avanzado al inicio
    const configContent = document.getElementById('configContent');
    if (configContent) configContent.style.display = 'none';
    const badge = document.getElementById('configBadge');
    if (badge) badge.textContent = 'Oculto';

    checkAuth();

    // Permisos globales para navegación lateral
    let permisosGlobales = { usuarios: false, asignarOpciones: false };
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.IdRole == 1 || user.IdRole === '1' || user.rol == 1 || user.rol === '1') {
        // Si es administrador, acceso total
        permisosGlobales.usuarios = true;
        permisosGlobales.asignarOpciones = true;
    } else {
        try {
            const permisos = await fetch('/api/permisos-usuario', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } }).then(r => r.json());
            const permisoUsuarios = permisos.find(p => (p.modulo?.toLowerCase?.() || p.Modulo?.toLowerCase?.() || p.nombre_modulo?.toLowerCase?.()) === 'usuarios');
            const permisoAsignar = permisos.find(p => (p.modulo?.toLowerCase?.() || p.Modulo?.toLowerCase?.() || p.nombre_modulo?.toLowerCase?.()) === 'asignar opciones');
            permisosGlobales.usuarios = permisoUsuarios && (permisoUsuarios.ver === 1 || permisoUsuarios.ver === true || permisoUsuarios.Ver);
            permisosGlobales.asignarOpciones = permisoAsignar && (permisoAsignar.ver === 1 || permisoAsignar.ver === true || permisoAsignar.Ver);
        } catch (e) {}
    }

    const permisosEmpresas = await cargarPermisosUsuarioEmpresas();
    //if (!permisosEmpresas.Ver) {
    //    mostrarModalSinPermiso();
    //    return;
    //}
    window.PERMISOS_EMPRESAS = permisosEmpresas;
    renderBotonesPorPermisoEmpresas(permisosEmpresas);
    loadEmpresas();
    setupEventListeners();
    loadUserInfo();
});

// Modal de acceso denegado (si no lo tienes ya)
function mostrarModalSinPermiso() {
    if (document.getElementById('modalSinPermiso')) return;
    const modal = document.createElement('div');
    modal.id = 'modalSinPermiso';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.35); z-index: 10001; display: flex; align-items: center; justify-content: center;`;
    modal.innerHTML = `
        <div style="background: white; padding: 2rem 2.5rem; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.18); text-align: center; max-width: 350px;">
            <div style="font-size: 2.5rem; color: #e74c3c; margin-bottom: 0.5rem;">&#9888;&#65039;</div>
            <h2 style="margin-bottom: 0.5rem; color: #e74c3c;">Acceso denegado</h2>
            <p style="color: #555; margin-bottom: 1.5rem;">No tienes permisos para ver este apartado.</p>
            <button id="cerrarModalSinPermiso" style="background: #e74c3c; color: white; border: none; border-radius: 6px; padding: 0.5rem 1.5rem; font-size: 1rem; cursor: pointer;">Cerrar</button>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('cerrarModalSinPermiso').onclick = () => {
        modal.remove();
    };
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}
// Cargar permisos del usuario para la opción Empresas
async function cargarPermisosUsuarioEmpresas() {
    try {
        const response = await fetch('/api/permisos-usuario', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const permisos = await response.json();
        // Buscar permisos para la opción Empresas
        return permisos.find(p => p.NombreOpcion === 'Empresas') || {};
    } catch (e) {
        return {};
    }
}

// Mostrar/ocultar botones según permisos
function renderBotonesPorPermisoEmpresas(permisos) {
    // Botón de crear
    const btnAdd = document.querySelector('.btn-add');
    if (btnAdd) btnAdd.style.display = permisos.Alta ? '' : 'none';
}

function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('current-user').textContent = user.nombre || user.email;
    }
}

function setupEventListeners() {
    document.getElementById('searchEmpresas').addEventListener('input', filterEmpresas);
    document.getElementById('filterStatus').addEventListener('change', filterEmpresas);
}

async function loadEmpresas() {
    try {
        showLoading(true);
        const empresas = await API.getEmpresas();
        renderEmpresas(empresas);
    } catch (error) {
        console.error('Error cargando empresas:', error);
        showError('Error al cargar las empresas');
    } finally {
        showLoading(false);
    }
}

function renderEmpresas(empresas) {
    const tbody = document.getElementById('empresas-table-body');
    tbody.innerHTML = '';

    if (!empresas || empresas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="no-data">No hay empresas registradas</td>
            </tr>
        `;
        return;
    }

    const permisos = window.PERMISOS_EMPRESAS || {};
    empresas.forEach(empresa => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${empresa.IdEmpresa || '-'}</td>
            <td>${empresa.Nombre || '-'}</td>
            <td>${empresa.Nit || '-'}</td>
            <td>${empresa.Direccion || '-'}</td>
            <td>${empresa.FechaCreacion || '-'}</td>
            <td>
                <div class="table-actions">
                    ${permisos.Cambio ? `<button class="btn-action btn-edit" onclick="editEmpresa(${empresa.IdEmpresa})">Editar</button>` : ''}
                    ${permisos.Baja ? `<button class="btn-action btn-delete" onclick="deleteEmpresa(${empresa.IdEmpresa})">Eliminar</button>` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterEmpresas() {
    const searchText = document.getElementById('searchEmpresas').value.toLowerCase();
    const statusFilter = document.getElementById('filterStatus').value;
    const rows = document.querySelectorAll('#empresas-table-body tr');

    rows.forEach(row => {
        if (row.classList.contains('no-data')) return;

        const nombre = row.cells[1].textContent.toLowerCase();
        const estado = row.cells[5].textContent.toLowerCase();

        const matchesSearch = nombre.includes(searchText);
        const matchesStatus = !statusFilter || estado === statusFilter;

        row.style.display = matchesSearch && matchesStatus ? '' : 'none';
    });
}

function openEmpresaModal(empresaId = null) {
    const modal = document.getElementById('empresaModal');
    const title = document.getElementById('modalEmpresaTitle');
    const form = document.getElementById('empresaForm');

    if (empresaId) {
        title.textContent = 'Editar Empresa';
        loadEmpresaData(empresaId);
    } else {
        title.textContent = 'Nueva Empresa';
        form.reset();
        document.getElementById('empresaId').value = '';
        document.getElementById('empresaNombre').value = '';
        document.getElementById('empresaNit').value = '';
        document.getElementById('empresaDireccion').value = '';
        document.getElementById('passwordLargo').value = 8;
        document.getElementById('passwordMayusculas').value = 1;
        document.getElementById('passwordMinusculas').value = 1;
        document.getElementById('passwordNumeros').value = 1;
        document.getElementById('passwordCaracteresEspeciales').value = 1;
        document.getElementById('passwordIntentosBloqueo').value = 5;
        document.getElementById('passwordCaducidadDias').value = 60;
        document.getElementById('passwordPreguntasValidar').value = 1;
    }

    modal.style.display = 'block';
}

function closeEmpresaModal() {
    document.getElementById('empresaModal').style.display = 'none';
}

async function loadEmpresaData(empresaId) {
    try {
        showLoading(true);
        const empresa = await API.getEmpresaById(empresaId);

        document.getElementById('empresaId').value = empresa.IdEmpresa || '';
        document.getElementById('empresaNombre').value = empresa.Nombre || '';
        document.getElementById('empresaNit').value = empresa.Nit || '';
        document.getElementById('empresaDireccion').value = empresa.Direccion || '';
        document.getElementById('passwordLargo').value = empresa.PasswordLargo || 8;
        document.getElementById('passwordMayusculas').value = empresa.PasswordMayusculas || 1;
        document.getElementById('passwordMinusculas').value = empresa.PasswordMinusculas || 1;
        document.getElementById('passwordNumeros').value = empresa.PasswordNumeros || 1;
        document.getElementById('passwordCaracteresEspeciales').value = empresa.PasswordCaracteresEspeciales || 1;
        document.getElementById('passwordIntentosBloqueo').value = empresa.PasswordIntentosBloqueo || 5;
        document.getElementById('passwordCaducidadDias').value = empresa.PasswordCaducidadDias || 60;
        document.getElementById('passwordPreguntasValidar').value = empresa.PasswordPreguntasValidar || 1;
    } catch (error) {
        console.error('Error cargando datos de empresa:', error);
        showError('Error al cargar los datos de la empresa');
    } finally {
        showLoading(false);
    }
}

async function saveEmpresa() {

    const safe = v => (v === undefined || v === '' ? null : v);
    const user = JSON.parse(localStorage.getItem('user'));
    const formData = {
        IdEmpresa: safe(document.getElementById('empresaId').value),
        Nombre: safe(document.getElementById('empresaNombre').value),
        Nit: safe(document.getElementById('empresaNit').value),
        Direccion: safe(document.getElementById('empresaDireccion').value),
        PasswordCantidadMayusculas: safe(document.getElementById('passwordMayusculas').value),
        PasswordCantidadMinusculas: safe(document.getElementById('passwordMinusculas').value),
        PasswordCantidadCaracteresEspeciales: safe(document.getElementById('passwordCaracteresEspeciales').value),
        PasswordCantidadCaducidadDias: safe(document.getElementById('passwordCaducidadDias').value),
        PasswordLargo: safe(document.getElementById('passwordLargo').value),
        PasswordIntentosAntesDeBloquear: safe(document.getElementById('passwordIntentosBloqueo').value),
        PasswordCantidadNumeros: safe(document.getElementById('passwordNumeros').value),
        PasswordCantidadPreguntasValidar: safe(document.getElementById('passwordPreguntasValidar').value),
        UsuarioCreacion: user?.email || 'system',
        UsuarioModificacion: user?.email || 'system'
    };
    if (!formData.Nombre || !formData.Nit) {
        showError('Nombre y NIT son campos obligatorios');
        return;
    }

    try {
        showLoading(true);

        if (formData.IdEmpresa) {
            await API.updateEmpresa(formData);
        } else {
            await API.createEmpresa(formData);
        }

        closeEmpresaModal();
        await loadEmpresas();
        showSuccess('Empresa guardada correctamente');

    } catch (error) {
        console.error('Error guardando empresa:', error);
        showError('Error al guardar la empresa: ' + (error.message || ''));
    } finally {
        showLoading(false);
    }
}

async function deleteEmpresa(empresaId) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta empresa?\nEsta acción no se puede deshacer.')) return;

    try {
        showLoading(true);
        await API.deleteEmpresa(empresaId);
        await loadEmpresas();
        showSuccess('Empresa eliminada correctamente');
    } catch (error) {
        console.error('Error eliminando empresa:', error);
        showError('Error al eliminar la empresa: ' + (error.message || ''));
    } finally {
        showLoading(false);
    }
}

function showLoading(show) {
    const loadingElement = document.getElementById('loading') || createLoadingElement();
    loadingElement.style.display = show ? 'flex' : 'none';
}

function createLoadingElement() {
    const loading = document.createElement('div');
    loading.id = 'loading';
    loading.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    loading.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 5px;">
            <div style="text-align: center;">Cargando...</div>
        </div>
    `;
    document.body.appendChild(loading);
    return loading;
}

window.onclick = function (event) {
    const modal = document.getElementById('empresaModal');
    if (event.target === modal) {
        closeEmpresaModal();
    }
};

function editEmpresa(empresaId) {
    openEmpresaModal(empresaId);
}

// Exportar funciones para uso global
window.openEmpresaModal = openEmpresaModal;
window.closeEmpresaModal = closeEmpresaModal;
window.editEmpresa = editEmpresa;
window.deleteEmpresa = deleteEmpresa;
window.saveEmpresa = saveEmpresa;