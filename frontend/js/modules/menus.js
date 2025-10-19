// Gestión de Menús - Tablas: MODULO, MENU

let permisosMenus = { crear: false, editar: false, eliminar: false };

document.addEventListener('DOMContentLoaded', async function() {
    window._modulosCache = [];
    try {
        const permisos = await getPermisosUsuario();
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const esAdmin = user.IdRole == 1 || user.rol == 1 || user.IdRole === '1' || user.rol === '1';
        // Buscar permisos para el módulo Menús (puede ser "MENUS" o similar, ajustar si el nombre es diferente)
        const permisoMenus = permisos.find(p => (p.modulo?.toLowerCase?.() || p.Modulo?.toLowerCase?.() || p.nombre_modulo?.toLowerCase?.()) === 'menús' || (p.modulo?.toLowerCase?.() || p.Modulo?.toLowerCase?.() || p.nombre_modulo?.toLowerCase?.()) === 'menus');
        if (permisoMenus) {
            permisosMenus = {
                crear: permisoMenus.crear === 1 || permisoMenus.crear === true || esAdmin,
                editar: permisoMenus.editar === 1 || permisoMenus.editar === true || esAdmin,
                eliminar: permisoMenus.eliminar === 1 || permisoMenus.eliminar === true || esAdmin
            };
        } else if (esAdmin) {
            permisosMenus = { crear: true, editar: true, eliminar: true };
        }
    } catch (e) {
        console.error('No se pudieron obtener los permisos del usuario para Menús', e);
    }
    loadModulosForFilter().then(() => {
        loadMenus();
    });
    setupEventListeners();
    // Ocultar botón Nuevo Menú si no tiene permiso de crear
    const btnAdd = document.querySelector('.btn-add');
    if (btnAdd && !permisosMenus.crear) btnAdd.style.display = 'none';
});

function setupEventListeners() {
    const searchInput = document.getElementById('searchMenus');
    if (searchInput) searchInput.addEventListener('input', filterMenus);
    const filterModulo = document.getElementById('filterModulo');
    if (filterModulo) filterModulo.addEventListener('change', filterMenus);
}

async function loadMenus() {
    try {
        const menus = await getMenus();
        renderMenus(menus);
    } catch (error) {
        console.error('Error cargando menús:', error);
        showError('Error al cargar los menús');
    }
}

async function getMenus() {
    try {
        const response = await fetch('/api/menus', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        return await response.json();
    } catch (error) {
        console.error('Error obteniendo menús:', error);
        return [];
    }
}

function renderMenus(menus) {
    const tbody = document.getElementById('menus-table-body');
    tbody.innerHTML = '';
    menus.forEach(menu => {
        const row = document.createElement('tr');
        let acciones = '';
        if (permisosMenus.editar) {
            acciones += `<button class="btn-action btn-edit" onclick="openMenuModal(${menu.IdMenu})">Editar</button>`;
        }
        if (permisosMenus.eliminar) {
            acciones += `<button class="btn-action btn-delete" onclick="deleteMenu(${menu.IdMenu})">Eliminar</button>`;
        }
        row.innerHTML = `
            <td>${menu.IdMenu}</td>
            <td>${menu.Nombre}</td>
            <td>${menu.NombreModulo || ''}</td>
            <td>${menu.OrdenMenu}</td>
            <td>
                <div class="table-actions">
                    ${acciones || '<span style=\'color:#aaa\'>Sin permisos</span>'}
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}


function filterMenus() {
    const searchText = document.getElementById('searchMenus')?.value.toLowerCase() || '';
    const moduloFilter = document.getElementById('filterModulo')?.value || '';
    const rows = document.querySelectorAll('#menus-table-body tr');
    rows.forEach(row => {
        const nombre = row.cells[1].textContent.toLowerCase();
        const moduloNombre = row.cells[2].textContent;
        const matchesSearch = nombre.includes(searchText);
        const matchesModulo = !moduloFilter || moduloNombre === document.getElementById('filterModulo').selectedOptions[0].text;
        row.style.display = matchesSearch && matchesModulo ? '' : 'none';
    });
}

async function loadModulosForFilter() {
    try {
        const modulos = await window.getModulos();
        window._modulosCache = modulos;
        const filterSelect = document.getElementById('filterModulo');
        if (filterSelect) {
            filterSelect.innerHTML = '<option value="">Todos los módulos</option>';
            modulos.forEach(modulo => {
                filterSelect.innerHTML += `<option value="${modulo.id}">${modulo.nombre}</option>`;
            });
        }
        const menuModulo = document.getElementById('menuModulo');
        if (menuModulo) {
            menuModulo.innerHTML = '<option value="">Seleccionar módulo</option>';
            modulos.forEach(modulo => {
                menuModulo.innerHTML += `<option value="${modulo.id}">${modulo.nombre}</option>`;
            });
        }
    } catch (error) {
        console.error('Error cargando módulos:', error);
    }
}

function filterMenus() {
    const searchText = document.getElementById('searchMenus')?.value.toLowerCase() || '';
    const moduloFilter = document.getElementById('filterModulo')?.value || '';
    const rows = document.querySelectorAll('#menus-table-body tr');
    rows.forEach(row => {
        const nombre = row.cells[1].textContent.toLowerCase();
        const modulo = row.cells[2].textContent;
        const matchesSearch = nombre.includes(searchText);
        const matchesModulo = !moduloFilter || modulo === moduloFilter;
        row.style.display = matchesSearch && matchesModulo ? '' : 'none';
    });
}

function openMenuModal(menuId = null) {
    const modal = document.getElementById('menuModal');
    const title = document.getElementById('modalMenuTitle');

    loadModulosForFilter()
        .then(() => {
            const menuModulo = document.getElementById('menuModulo');
            if (!menuModulo || menuModulo.options.length <= 1) {
                showError('No hay módulos disponibles. Crea un módulo primero.');
                return;
            }
            if (menuId) {
                title.textContent = 'Editar Menú';
                loadMenuData(menuId);
            } else {
                title.textContent = 'Nuevo Menú';
                document.getElementById('menuForm').reset();
                document.getElementById('menuId').value = '';
            }
            modal.style.display = 'block';
        })
        .catch(err => {
            showError('Error al cargar los módulos. ¿Sesión iniciada?');
        });
}

function closeMenuModal() {
    document.getElementById('menuModal').style.display = 'none';
}

async function loadMenuData(menuId) {
    try {
        const menu = await getMenuById(menuId);
        document.getElementById('menuId').value = menu.IdMenu;
        document.getElementById('menuNombre').value = menu.Nombre;
        const menuModuloSelect = document.getElementById('menuModulo');
        let found = false;
        for (let i = 0; i < menuModuloSelect.options.length; i++) {
            if (menuModuloSelect.options[i].value === String(menu.IdModulo)) {
                menuModuloSelect.selectedIndex = i;
                found = true;
                break;
            }
        }
        if (!found) {
            menuModuloSelect.selectedIndex = 0; 
            showError('El módulo asociado a este menú ya no existe. Selecciona uno válido.');
        }
        document.getElementById('menuOrden').value = menu.OrdenMenu;
    } catch (error) {
        console.error('Error cargando datos del menú:', error);
        showError('Error al cargar los datos del menú');
    }
}

async function getMenuById(menuId) {
    const response = await fetch(`/api/menus/${menuId}`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });
    if (!response.ok) throw new Error('No se pudo obtener el menú');
    return await response.json();
}

async function saveMenu() {
    const idModuloRaw = document.getElementById('menuModulo').value;
    const modulos = window._modulosCache || [];
    const moduloValido = modulos.some(m => String(m.id) === String(idModuloRaw));
    const formData = {
        IdMenu: document.getElementById('menuId').value,
        Nombre: document.getElementById('menuNombre').value.trim(),
        IdModulo: (idModuloRaw !== '' && moduloValido) ? Number(idModuloRaw) : null,
        OrdenMenu: Number(document.getElementById('menuOrden').value) || null
    };
    if (!formData.IdModulo || !formData.Nombre || !formData.OrdenMenu) {
        showError('Todos los campos son obligatorios y el módulo debe ser seleccionado');
        return;
    }
    try {
        if (formData.IdMenu) {
            const response = await fetch(`/api/menus/${formData.IdMenu}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    IdModulo: formData.IdModulo,
                    Nombre: formData.Nombre,
                    OrdenMenu: formData.OrdenMenu
                })
            });
            if (!response.ok) throw new Error('Error al actualizar menú');
        } else {
            const response = await fetch('/api/menus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    IdModulo: formData.IdModulo,
                    Nombre: formData.Nombre,
                    OrdenMenu: formData.OrdenMenu
                })
            });
            if (!response.ok) throw new Error('Error al crear menú');
        }
    closeMenuModal();
    await loadModulosForFilter();
    loadMenus();
    showSuccess('Menú guardado correctamente');
    } catch (error) {
        console.error('Error guardando menú:', error);
        showError('Error al guardar el menú');
    }
}

async function deleteMenu(menuId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este menú?')) return;
    try {
        const response = await fetch(`/api/menus/${menuId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        if (!response.ok) throw new Error('Error al eliminar menú');
        loadMenus();
        showSuccess('Menú eliminado correctamente');
    } catch (error) {
        console.error('Error eliminando menú:', error);
        showError('Error al eliminar el menú');
    }
}

function showError(message) {
    alert('Error: ' + message);
}

function showSuccess(message) {
    alert('Éxito: ' + message);
}

window.onclick = function(event) {
    const modal = document.getElementById('menuModal');
    if (event.target === modal) {
        closeMenuModal();
    }
};