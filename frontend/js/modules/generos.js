// Gestión de Géneros - Tabla: GENERO
document.addEventListener('DOMContentLoaded', function() {
    cargarPermisosUsuarioGeneros().then(permisos => {
        window.PERMISOS_GENEROS = permisos;
        renderBotonesPorPermisoGeneros(permisos);
        loadGeneros();
        setupEventListeners();
    });
// Cargar permisos del usuario para la opción Géneros
async function cargarPermisosUsuarioGeneros() {
    try {
        const response = await fetch('/api/permisos-usuario', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const permisos = await response.json();
        // Buscar permisos para la opción Géneros
        return permisos.find(p => p.NombreOpcion === 'Géneros') || {};
    } catch (e) {
        return {};
    }
}

// Mostrar/ocultar botones según permisos
function renderBotonesPorPermisoGeneros(permisos) {
    // Mostrar siempre si es admin
    const btnAdd = document.querySelector('.btn-add');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const esAdmin = user.IdRole == 1 || user.rol == 1 || user.IdRole === '1' || user.rol === '1';
    if (btnAdd) btnAdd.style.display = (permisos.Alta || esAdmin) ? '' : 'none';
}
});

function setupEventListeners() {
    document.getElementById('searchGeneros').addEventListener('input', filterGeneros);
}

async function loadGeneros() {
    try {
        const generos = await API.getGeneros();
        renderGeneros(generos);
    } catch (error) {
        console.error('Error cargando géneros:', error);
        API.showError('Error al cargar los géneros');
    }
}

function renderGeneros(generos) {
    const tbody = document.getElementById('generos-table-body');
    tbody.innerHTML = '';
    const permisos = window.PERMISOS_GENEROS || {};
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const esAdmin = user.IdRole == 1 || user.rol == 1 || user.IdRole === '1' || user.rol === '1';
    generos.forEach(genero => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${genero.IdGenero}</td>
            <td>${genero.Nombre}</td>
            <td>
                <div class="table-actions">
                    ${(permisos.Cambio || esAdmin) ? `<button class="btn-action btn-edit" onclick="editGenero(${genero.IdGenero})">Editar</button>` : ''}
                    ${(permisos.Baja || esAdmin) ? `<button class="btn-action btn-delete" onclick="deleteGenero(${genero.IdGenero})">Eliminar</button>` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterGeneros() {
    const searchText = document.getElementById('searchGeneros').value.toLowerCase();
    const rows = document.querySelectorAll('#generos-table-body tr');

    rows.forEach(row => {
        const nombre = row.cells[1].textContent.toLowerCase();
        const matchesSearch = nombre.includes(searchText);
        row.style.display = matchesSearch ? '' : 'none';
    });
}

function openGeneroModal(generoId = null) {
    const modal = document.getElementById('generoModal');
    const title = document.getElementById('modalGeneroTitle');

    if (generoId) {
        title.textContent = 'Editar Género';
        loadGeneroData(generoId);
    } else {
        title.textContent = 'Nuevo Género';
        document.getElementById('generoForm').reset();
        document.getElementById('generoId').value = '';
    }

    modal.style.display = 'block';
}

function closeGeneroModal() {
    document.getElementById('generoModal').style.display = 'none';
}

async function loadGeneroData(generoId) {
    try {
        const genero = await API.getGeneroById(generoId);
        document.getElementById('generoId').value = genero.IdGenero;
        document.getElementById('generoNombre').value = genero.Nombre;
    } catch (error) {
        console.error('Error cargando datos de género:', error);
        API.showError('Error al cargar los datos del género');
    }
}

async function saveGenero() {
    const formData = {
        IdGenero: document.getElementById('generoId').value,
        Nombre: document.getElementById('generoNombre').value
    };

    try {
        if (formData.IdGenero) {
            await API.updateGenero({ id: formData.IdGenero, Nombre: formData.Nombre });
        } else {
            await API.createGenero({ Nombre: formData.Nombre });
        }

        closeGeneroModal();
        loadGeneros();
        API.showSuccess('Género guardado correctamente');
    } catch (error) {
        console.error('Error guardando género:', error);
        API.showError('Error al guardar el género');
    }
}

async function deleteGenero(generoId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este género?')) return;

    try {
        await API.deleteGenero(generoId);
        loadGeneros();
        API.showSuccess('Género eliminado correctamente');
    } catch (error) {
        console.error('Error eliminando género:', error);
        API.showError('Error al eliminar el género');
    }
}

function editGenero(generoId) {
    openGeneroModal(generoId);
}

window.onclick = function(event) {
    const modal = document.getElementById('generoModal');
    if (event.target === modal) {
        closeGeneroModal();
    }
};