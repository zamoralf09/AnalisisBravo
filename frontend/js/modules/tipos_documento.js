const API = '/api/tipos-documento';

function getToken() {
  return localStorage.getItem('token') || '';
}

function setAuthHeaders(headers = {}) {
  const token = getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;
  return headers;
}

async function fetchAll() {
  const res = await fetch(API, {
    headers: setAuthHeaders()
  });
  const data = await res.json();
  renderTable(data);
}

function renderTable(data) {
  const tbody = document.getElementById('tipos-documento-table-body');
  tbody.innerHTML = '';
  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.IdTipoDocumento}</td>
      <td>${row.Nombre}</td>
      <td>
        <button class="btn-table" onclick="openTipoDocumentoModal(${row.IdTipoDocumento}, '${row.Nombre}')">Editar</button>
        <button class="btn-table btn-danger" onclick="removeTipoDocumento(${row.IdTipoDocumento})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.openTipoDocumentoModal = function(id = '', nombre = '') {
  document.getElementById('tipoDocumentoId').value = id || '';
  document.getElementById('tipoDocumentoNombre').value = nombre || '';
  document.getElementById('modalTipoDocumentoTitle').textContent = id ? 'Editar Tipo de Documento' : 'Nuevo Tipo de Documento';
  document.getElementById('tipoDocumentoModal').style.display = 'block';
}

window.closeTipoDocumentoModal = function() {
  document.getElementById('tipoDocumentoModal').style.display = 'none';
  document.getElementById('tipoDocumentoForm').reset();
}

window.saveTipoDocumento = async function() {
  const id = document.getElementById('tipoDocumentoId').value;
  const nombre = document.getElementById('tipoDocumentoNombre').value.trim();
  if (!nombre) return alert('El nombre es obligatorio');
  const payload = { Nombre: nombre };
  let res;
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
    closeTipoDocumentoModal();
    fetchAll();
  } else {
    const error = await res.json();
    alert(error.error || 'Error al guardar');
  }
}

window.removeTipoDocumento = async function(id) {
  if (!confirm('¿Eliminar este tipo de documento?')) return;
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
}

document.getElementById('searchTipoDocumento').addEventListener('input', function() {
  const term = this.value.toLowerCase();
  const rows = document.querySelectorAll('#tipos-documento-table-body tr');
  rows.forEach(row => {
    const nombre = row.children[1].textContent.toLowerCase();
    row.style.display = nombre.includes(term) ? '' : 'none';
  });
});

window.onclick = function(event) {
  const modal = document.getElementById('tipoDocumentoModal');
  if (event.target === modal) {
    closeTipoDocumentoModal();
  }
}

fetchAll();
