

const API = '/api/status-cuentas';

function getToken() {
    return localStorage.getItem('token') || '';
}

function setAuthHeaders(headers = {}) {
    const token = getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;
    return headers;
}

let statusCuentas = [];

function showError(msg) {
    let errorDiv = document.getElementById('errorMsg');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'errorMsg';
        errorDiv.style.color = 'red';
        errorDiv.style.margin = '10px 0';
        errorDiv.style.textAlign = 'center';
        document.querySelector('.module-container').prepend(errorDiv);
    }
    errorDiv.textContent = msg;
}

function clearError() {
    const errorDiv = document.getElementById('errorMsg');
    if (errorDiv) errorDiv.textContent = '';
}

async function fetchAll() {
    clearError();
    try {
        const res = await fetch(API, { headers: setAuthHeaders() });
        if (res.status === 401 || res.status === 403) {
            showError('No autorizado. Inicia sesión nuevamente.');
            renderTable([]);
            return;
        }
        if (!res.ok) {
            showError('Error al cargar datos.');
            renderTable([]);
            return;
        }
        statusCuentas = await res.json();
        if (!Array.isArray(statusCuentas)) statusCuentas = [];
        if (statusCuentas.length === 0) {
            showError('No hay datos o no tienes permisos para verlos.');
        }
        renderTable(statusCuentas);
    } catch (e) {
        showError('Error de red o de servidor.');
        renderTable([]);
    }
}

function renderTable(data) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    if (!data.length) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center">No hay registros</td></tr>';
        return;
    }
    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.IdStatusCuenta}</td>
            <td>${item.Nombre}</td>
            <td>
                <button class="btn btn-sm btn-edit" data-id="${item.IdStatusCuenta}" data-nombre="${item.Nombre}">Editar</button>
                <button class="btn btn-sm btn-delete" data-id="${item.IdStatusCuenta}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    // Attach event listeners for edit/delete
    tbody.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            openStatusCuentaModal(
                btn.getAttribute('data-id'),
                btn.getAttribute('data-nombre')
            );
        });
    });
    tbody.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            removeStatusCuenta(btn.getAttribute('data-id'));
        });
    });
}

function openStatusCuentaModal(id = '', nombre = '') {
    document.getElementById('idStatusCuenta').value = id || '';
    document.getElementById('nombre').value = nombre || '';
    document.getElementById('modalTitle').textContent = id ? 'Editar Status de Cuenta' : 'Nuevo Status de Cuenta';
    document.getElementById('modal').style.display = 'block';
}

function closeStatusCuentaModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('formStatusCuenta').reset();
}

async function saveStatusCuenta() {
    const id = document.getElementById('idStatusCuenta').value;
    const nombre = document.getElementById('nombre').value.trim();
    if (!nombre) return alert('El nombre es obligatorio');
    const payload = { Nombre: nombre };
    let res;
    try {
        if (id) {
            res = await fetch(`${API}/${id}`, {
                method: 'PUT',
                headers: setAuthHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(payload)
            });
        } else {
            res = await fetch(API, {
                method: 'POST',
                headers: setAuthHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(payload)
            });
        }
        if (res.ok) {
            closeStatusCuentaModal();
            fetchAll();
        } else {
            const error = await res.json();
            alert(error.error || 'Error al guardar');
        }
    } catch (e) {
        alert('Error de red');
    }
}

async function removeStatusCuenta(id) {
    if (!confirm('¿Eliminar este status de cuenta?')) return;
    try {
        const res = await fetch(`${API}/${id}`, {
            method: 'DELETE',
            headers: setAuthHeaders()
        });
        if (res.ok) {
            fetchAll();
        } else {
            const error = await res.json();
            alert(error.error || 'Error al eliminar');
        }
    } catch (e) {
        alert('Error de red');
    }
}

// Búsqueda en tabla
document.getElementById('searchStatusCuentaInput').addEventListener('input', function() {
    const term = this.value.toLowerCase();
    const rows = document.querySelectorAll('#tableBody tr');
    rows.forEach(row => {
        const nombre = row.children[1].textContent.toLowerCase();
        row.style.display = nombre.includes(term) ? '' : 'none';
    });
});

document.getElementById('btnNuevo').addEventListener('click', () => openStatusCuentaModal());
document.getElementById('btnCancelar').addEventListener('click', () => closeStatusCuentaModal());
document.querySelector('.close').addEventListener('click', () => closeStatusCuentaModal());
document.getElementById('formStatusCuenta').addEventListener('submit', function(e) {
    e.preventDefault();
    saveStatusCuenta();
});

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeStatusCuentaModal();
    }
}

// Init
fetchAll();
