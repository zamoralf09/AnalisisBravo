const API = '/api/tipos-saldo-cuenta';

function getToken() {
    return localStorage.getItem('token') || '';
}

function setAuthHeaders(headers = {}) {
    const token = getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;
    return headers;
}

let tiposCuenta = [];

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
        tiposCuenta = await res.json();
        if (!Array.isArray(tiposCuenta)) tiposCuenta = [];
        if (tiposCuenta.length === 0) {
            showError('No hay datos o no tienes permisos para verlos.');
        }
        renderTable(tiposCuenta);
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
            <td>${item.IdTipoSaldoCuenta}</td>
            <td>${item.Nombre}</td>
            <td>
                <button class="btn btn-sm btn-edit" data-id="${item.IdTipoSaldoCuenta}" data-nombre="${item.Nombre}">Editar</button>
                <button class="btn btn-sm btn-delete" data-id="${item.IdTipoSaldoCuenta}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    // Attach event listeners for edit/delete
    tbody.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            openTipoCuentaModal(
                btn.getAttribute('data-id'),
                btn.getAttribute('data-nombre')
            );
        });
    });
    tbody.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            removeTipoCuenta(btn.getAttribute('data-id'));
        });
    });
}

function openTipoCuentaModal(id = '', nombre = '') {
    document.getElementById('idTipoSaldoCuenta').value = id || '';
    document.getElementById('nombre').value = nombre || '';
    document.getElementById('modalTitle').textContent = id ? 'Editar Tipo de Cuenta' : 'Nuevo Tipo de Cuenta';
    document.getElementById('modal').style.display = 'block';
}

function closeTipoCuentaModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('formTipoCuenta').reset();
}

async function saveTipoCuenta() {
    const id = document.getElementById('idTipoSaldoCuenta').value;
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
            closeTipoCuentaModal();
            fetchAll();
        } else {
            const error = await res.json();
            alert(error.error || 'Error al guardar');
        }
    } catch (e) {
        alert('Error de red');
    }
}

async function removeTipoCuenta(id) {
    if (!confirm('¿Eliminar este tipo de cuenta?')) return;
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
document.getElementById('searchTipoCuentaInput').addEventListener('input', function() {
    const term = this.value.toLowerCase();
    const rows = document.querySelectorAll('#tableBody tr');
    rows.forEach(row => {
        const nombre = row.children[1].textContent.toLowerCase();
        row.style.display = nombre.includes(term) ? '' : 'none';
    });
});

document.getElementById('btnNuevo').addEventListener('click', () => openTipoCuentaModal());
document.getElementById('btnCancelar').addEventListener('click', () => closeTipoCuentaModal());
document.querySelector('.close').addEventListener('click', () => closeTipoCuentaModal());
document.getElementById('formTipoCuenta').addEventListener('submit', function(e) {
    e.preventDefault();
    saveTipoCuenta();
});

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeTipoCuentaModal();
    }
}

// Init
fetchAll();
