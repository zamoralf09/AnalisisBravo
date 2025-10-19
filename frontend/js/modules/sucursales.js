// Gestión de Sucursales - Tabla: SUCURSAL
document.addEventListener('DOMContentLoaded', function() {
    cargarPermisosUsuario().then(permisos => {
        window.PERMISOS_SUCURSALES = permisos;
        renderBotonesPorPermiso(permisos);
        loadSucursales();
        loadEmpresasForFilter();
        setupEventListeners();
    });
// Cargar permisos del usuario para la opción Sucursales
async function cargarPermisosUsuario() {
    try {
        const response = await fetch('/api/permisos-usuario', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const permisos = await response.json();
        // Buscar permisos para la opción Sucursales
        return permisos.find(p => p.NombreOpcion === 'Sucursales') || {};
    } catch (e) {
        return {};
    }
}

// Mostrar/ocultar botones según permisos
function renderBotonesPorPermiso(permisos) {
    // Botón de crear
    const btnAdd = document.querySelector('.btn-add');
    if (btnAdd) btnAdd.style.display = permisos.Alta ? '' : 'none';
}
});

function setupEventListeners() {
    const searchInput = document.getElementById('searchSucursales');
    if (searchInput) searchInput.addEventListener('input', filterSucursales);
    const empresaFilter = document.getElementById('filterEmpresa');
    if (empresaFilter) empresaFilter.addEventListener('change', filterSucursales);
    const statusFilter = document.getElementById('filterStatus');
    if (statusFilter) statusFilter.addEventListener('change', filterSucursales);
}

async function loadSucursales() {
    try {
        const [sucursales, empresas] = await Promise.all([
            window.API.getSucursales(),
            window.API.getEmpresas()
        ]);
        if (typeof sucursales === 'string' && sucursales.trim().startsWith('<')) {
            showError('Error: El backend devolvió una página HTML en vez de datos JSON. Verifica que el backend esté corriendo y la ruta sea correcta.');
            return;
        }
        if (typeof empresas === 'string' && empresas.trim().startsWith('<')) {
            showError('Error: El backend devolvió una página HTML en vez de datos JSON. Verifica que el backend esté corriendo y la ruta sea correcta.');
            return;
        }
        const empresasMap = {};
        empresas.forEach(e => { empresasMap[e.IdEmpresa] = e.Nombre; });
        sucursales.forEach(s => {
            s.EmpresaNombre = empresasMap[s.IdEmpresa] || '';
        });
        renderSucursales(sucursales);
    } catch (error) {
        console.error('Error cargando sucursales:', error);
        showError(error?.message || 'Error al cargar las sucursales');
    }
}


function renderSucursales(sucursales) {
    const tbody = document.getElementById('sucursales-table-body');
    tbody.innerHTML = '';

    const permisos = window.PERMISOS_SUCURSALES || {};
    sucursales.forEach(sucursal => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sucursal.IdSucursal}</td>
            <td>${sucursal.Nombre}</td>
            <td>${sucursal.EmpresaNombre || ''}</td>
            <td>${sucursal.Direccion}</td>
            <td>
                <div class="table-actions">
                    ${permisos.Cambio ? `<button class="btn-action btn-edit" onclick="editSucursal(${sucursal.IdSucursal})">Editar</button>` : ''}
                    ${permisos.Baja ? `<button class="btn-action btn-delete" onclick="deleteSucursal(${sucursal.IdSucursal})">Eliminar</button>` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function loadEmpresasForFilter() {
    try {
        const empresas = await window.API.getEmpresas();
        const filterSelect = document.getElementById('filterEmpresa');
        const formSelect = document.getElementById('sucursalEmpresa');
        filterSelect.innerHTML = '<option value="">Todas</option>';
        formSelect.innerHTML = '<option value="">Seleccione una empresa</option>';
        empresas.forEach(empresa => {
            filterSelect.innerHTML += `<option value="${empresa.IdEmpresa}">${empresa.Nombre}</option>`;
            formSelect.innerHTML += `<option value="${empresa.IdEmpresa}">${empresa.Nombre}</option>`;
        });
    } catch (error) {
        console.error('Error cargando empresas:', error);
        showError(error?.message || 'Error al cargar empresas');
    }
}

function filterSucursales() {
    const searchText = document.getElementById('searchSucursales').value.toLowerCase();
    const empresaFilter = document.getElementById('filterEmpresa').value;
    const rows = document.querySelectorAll('#sucursales-table-body tr');
    rows.forEach(row => {
        const nombre = row.cells[1].textContent.toLowerCase();
        const empresa = row.cells[2].textContent;
        const matchesSearch = nombre.includes(searchText);
        const matchesEmpresa = !empresaFilter || empresa === empresaFilter;
        row.style.display = matchesSearch && matchesEmpresa ? '' : 'none';
    });
}

function openSucursalModal(sucursalId = null) {
    const modal = document.getElementById('sucursalModal');
    const title = document.getElementById('modalSucursalTitle');
    
    if (sucursalId) {
        title.textContent = 'Editar Sucursal';
        loadSucursalData(sucursalId);
    } else {
        title.textContent = 'Nueva Sucursal';
        document.getElementById('sucursalForm').reset();
        document.getElementById('sucursalId').value = '';
    }
    
    modal.style.display = 'block';
}

function closeSucursalModal() {
    document.getElementById('sucursalModal').style.display = 'none';
}

async function loadSucursalData(sucursalId) {
    try {
        const sucursal = await window.API.getSucursalById(sucursalId);
        if (!sucursal || typeof sucursal !== 'object' || sucursal.error) {
            showError(sucursal?.error || 'No se encontró la sucursal.');
            return;
        }
        document.getElementById('sucursalId').value = sucursal.IdSucursal;
        document.getElementById('sucursalNombre').value = sucursal.Nombre;
        document.getElementById('sucursalEmpresa').value = sucursal.IdEmpresa;
        document.getElementById('sucursalDireccion').value = sucursal.Direccion;
    } catch (error) {
        console.error('Error cargando datos de sucursal:', error);
        showError(error?.message || 'Error al cargar los datos de la sucursal');
    }
}

async function saveSucursal() {
    const formData = {
        IdSucursal: document.getElementById('sucursalId').value,
        Nombre: document.getElementById('sucursalNombre').value,
        IdEmpresa: document.getElementById('sucursalEmpresa').value,
        Direccion: document.getElementById('sucursalDireccion').value
    };
    // Si IdSucursal está vacío, eliminarlo para el insert
    if (!formData.IdSucursal) delete formData.IdSucursal;
    
    try {
        let result;
        if (formData.IdSucursal) {
            result = await window.API.updateSucursal(formData);
        } else {
            result = await window.API.createSucursal(formData);
        }
        if (result?.error) {
            showError(result.error);
            return;
        }
        closeSucursalModal();
        loadSucursales();
        showSuccess('Sucursal guardada correctamente');
    } catch (error) {
        console.error('Error guardando sucursal:', error);
        showError(error?.message || 'Error al guardar la sucursal');
    }
}

async function deleteSucursal(sucursalId) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta sucursal?')) return;
    try {
        const result = await window.API.deleteSucursal(sucursalId);
        if (result?.error) {
            showError(result.error);
            return;
        }
        loadSucursales();
        showSuccess('Sucursal eliminada correctamente');
    } catch (error) {
        console.error('Error eliminando sucursal:', error);
        showError(error?.message || 'Error al eliminar la sucursal');
    }
}

function editSucursal(sucursalId) {
    openSucursalModal(sucursalId);
}

window.onclick = function(event) {
    const modal = document.getElementById('sucursalModal');
    if (event.target === modal) {
        closeSucursalModal();
    }
};