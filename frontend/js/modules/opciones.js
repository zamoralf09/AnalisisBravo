// Gestión de Opciones - Tablas: MODULO, MENU, OPCION
document.addEventListener('DOMContentLoaded', function() {
    loadOpciones();
    loadModulosForFilter();
    loadMenusForFilter();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('searchOpciones').addEventListener('input', filterOpciones);
    document.getElementById('filterModulo').addEventListener('change', filterOpciones);
    document.getElementById('filterMenu').addEventListener('change', filterOpciones);
    document.getElementById('filterStatus').addEventListener('change', filterOpciones);
    
    // Cargar menús cuando se seleccione un módulo
    document.getElementById('opcionModulo').addEventListener('change', function() {
        loadMenusForOpcion(this.value);
    });
}

async function loadOpciones() {
    try {
        const opciones = await getOpciones();
        renderOpciones(opciones);
    } catch (error) {
        console.error('Error cargando opciones:', error);
        showError('Error al cargar las opciones');
    }
}

async function getOpciones() {
    try {
        const response = await fetch('/api/opciones');
        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        const data = await response.json();
        return data.map(o => ({
            id: o.IdOpcion,
            nombre: o.Nombre,
            modulo_id: o.IdModulo,
            modulo_nombre: o.ModuloNombre,
            menu_id: o.IdMenu,
            menu_nombre: o.MenuNombre,
            url: o.Pagina,
            orden: o.OrdenMenu,
        }));
    } catch (error) {
        console.error('Error obteniendo opciones:', error);
        return [];
    }
}

function renderOpciones(opciones) {
    const tbody = document.getElementById('opciones-table-body');
    tbody.innerHTML = '';
    opciones.forEach(opcion => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${opcion.id}</td>
            <td>${opcion.nombre}</td>
            <td data-modulo-id="${opcion.modulo_id}">${opcion.modulo_nombre}</td>
            <td data-menu-id="${opcion.menu_id}">${opcion.menu_nombre}</td>
            <td>${opcion.url}</td>
            <td>${opcion.icono || ''}</td>
            <td>${opcion.orden}</td>
            <td><span class="status-badge ${opcion.estado}">${opcion.estado}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-action btn-edit" onclick="editOpcion(${opcion.id})">Editar</button>
                    <button class="btn-action btn-delete" onclick="deleteOpcion(${opcion.id})">Eliminar</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function getModulos() {
    const response = await fetch('/api/modulos');
    if (!response.ok) throw new Error('Error al obtener módulos');
    const data = await response.json();
    return data.map(m => ({ id: m.IdModulo, nombre: m.Nombre }));
}

async function loadModulosForFilter() {
    try {
        const modulos = await getModulos();
        const filterSelect = document.getElementById('filterModulo');
        const formSelect = document.getElementById('opcionModulo');
        filterSelect.innerHTML = '<option value="">Todos los módulos</option>';
        formSelect.innerHTML = '<option value="">Seleccionar módulo</option>';
        modulos.forEach(modulo => {
            filterSelect.innerHTML += `<option value="${modulo.id}">${modulo.nombre}</option>`;
            formSelect.innerHTML += `<option value="${modulo.id}">${modulo.nombre}</option>`;
        });
    } catch (error) {
        console.error('Error cargando módulos:', error);
    }
}

async function getMenus() {
    const response = await fetch('/api/menus');
    if (!response.ok) throw new Error('Error al obtener menús');
    const data = await response.json();
    return data.map(m => ({ id: m.IdMenu, nombre: m.Nombre, modulo_id: m.IdModulo }));
}

async function loadMenusForFilter() {
    try {
        const menus = await getMenus();
        const filterSelect = document.getElementById('filterMenu');
        filterSelect.innerHTML = '<option value="">Todos los menús</option>';
        menus.forEach(menu => {
            filterSelect.innerHTML += `<option value="${menu.id}">${menu.nombre}</option>`;
        });
    } catch (error) {
        console.error('Error cargando menús:', error);
    }
}

async function getMenusByModulo(moduloId) {
    const response = await fetch(`/api/menus?modulo=${moduloId}`);
    if (!response.ok) throw new Error('Error al obtener menús por módulo');
    const data = await response.json();
    return data.map(m => ({ id: m.IdMenu, nombre: m.Nombre, modulo_id: m.IdModulo }));
}

async function loadMenusForOpcion(moduloId) {
    try {
        const menus = await getMenusByModulo(moduloId);
        const menuSelect = document.getElementById('opcionMenu');
        menuSelect.innerHTML = '<option value="">Seleccionar menú</option>';
        menus.forEach(menu => {
            menuSelect.innerHTML += `<option value="${menu.id}">${menu.nombre}</option>`;
        });
    } catch (error) {
        console.error('Error cargando menús:', error);
    }
}

function filterOpciones() {
    const searchText = document.getElementById('searchOpciones').value.toLowerCase();
    const moduloFilter = document.getElementById('filterModulo').value;
    const menuFilter = document.getElementById('filterMenu').value;
    const statusFilter = document.getElementById('filterStatus').value;
    
    const rows = document.querySelectorAll('#opciones-table-body tr');
    
    rows.forEach(row => {
        const nombre = row.cells[1].textContent.toLowerCase();
        const modulo = row.cells[2].getAttribute('data-modulo-id') || '';
        const menu = row.cells[3].getAttribute('data-menu-id') || '';
        const estado = row.cells[7].textContent.toLowerCase();
        
        const matchesSearch = nombre.includes(searchText);
        const matchesModulo = !moduloFilter || modulo === moduloFilter;
        const matchesMenu = !menuFilter || menu === menuFilter;
        const matchesStatus = !statusFilter || estado === statusFilter;
        
        row.style.display = matchesSearch && matchesModulo && matchesMenu && matchesStatus ? '' : 'none';
    });
}

function openOpcionModal(opcionId = null) {
    const modal = document.getElementById('opcionModal');
    const title = document.getElementById('modalOpcionTitle');
    
    if (opcionId) {
        title.textContent = 'Editar Opción';
        loadOpcionData(opcionId);
    } else {
        title.textContent = 'Nueva Opción';
        document.getElementById('opcionForm').reset();
        document.getElementById('opcionId').value = '';
        document.getElementById('opcionMenu').innerHTML = '<option value="">Seleccionar menú</option>';
    }
    
    modal.style.display = 'block';
}

function closeOpcionModal() {
    document.getElementById('opcionModal').style.display = 'none';
}

async function getOpcionById(id) {
    const response = await fetch(`/api/opciones/${id}`);
    if (!response.ok) throw new Error('Error al obtener opción');
    const o = await response.json();
    return {
        id: o.IdOpcion,
        nombre: o.Nombre,
        modulo_id: o.IdModulo,
        modulo_nombre: o.ModuloNombre,
        menu_id: o.IdMenu,
        menu_nombre: o.MenuNombre,
        url: o.Pagina,
        icono: '',
        orden: o.OrdenMenu,
        descripcion: '',
        estado: 'activo'
    };
}

async function loadOpcionData(opcionId) {
    try {
        const opcion = await getOpcionById(opcionId);
        document.getElementById('opcionId').value = opcion.id;
        document.getElementById('opcionNombre').value = opcion.nombre;
        document.getElementById('opcionModulo').value = opcion.modulo_id;
        await loadMenusForOpcion(opcion.modulo_id);
        document.getElementById('opcionMenu').value = opcion.menu_id;
        document.getElementById('opcionUrl').value = opcion.url;
        document.getElementById('opcionIcono').value = opcion.icono || '';
        document.getElementById('opcionOrden').value = opcion.orden;
        document.getElementById('opcionDescripcion').value = opcion.descripcion || '';
        document.getElementById('opcionEstado').value = opcion.estado;
    } catch (error) {
        console.error('Error cargando datos de la opción:', error);
        showError('Error al cargar los datos de la opción');
    }
}

async function saveOpcion() {
    const formData = {
        Nombre: document.getElementById('opcionNombre').value,
        IdMenu: document.getElementById('opcionMenu').value,
        Pagina: document.getElementById('opcionUrl').value,
        OrdenMenu: document.getElementById('opcionOrden').value
    };
    const id = document.getElementById('opcionId').value;
    try {
        if (id) {
            await fetch(`/api/opciones/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        } else {
            await fetch('/api/opciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        }
        closeOpcionModal();
        loadOpciones();
        showSuccess('Opción guardada correctamente');
    } catch (error) {
        console.error('Error guardando opción:', error);
        showError('Error al guardar la opción');
    }
}

async function deleteOpcion(opcionId) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta opción?')) return;
    try {
        await fetch(`/api/opciones/${opcionId}`, { method: 'DELETE' });
        loadOpciones();
        showSuccess('Opción eliminada correctamente');
    } catch (error) {
        console.error('Error eliminando opción:', error);
        showError('Error al eliminar la opción');
    }
}

// Cerrar modal al hacer clic fuera del contenido
window.onclick = function(event) {
    const modal = document.getElementById('opcionModal');
    if (event.target === modal) {
        closeOpcionModal();
    }
};