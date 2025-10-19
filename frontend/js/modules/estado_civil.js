const API = '/api/estado-civil';

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
  const tbody = document.getElementById('estado-civil-table-body');
  tbody.innerHTML = '';
  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.IdEstadoCivil}</td>
      <td>${row.Nombre}</td>
      <td>
        <button class="btn-table" onclick="openEstadoCivilModal(${row.IdEstadoCivil}, '${row.Nombre}')">Editar</button>
        <button class="btn-table btn-danger" onclick="removeEstadoCivil(${row.IdEstadoCivil})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.openEstadoCivilModal = function(id = '', nombre = '') {
  document.getElementById('estadoCivilId').value = id || '';
  document.getElementById('estadoCivilNombre').value = nombre || '';
  document.getElementById('modalEstadoCivilTitle').textContent = id ? 'Editar Estado Civil' : 'Nuevo Estado Civil';
  document.getElementById('estadoCivilModal').style.display = 'block';
}

window.closeEstadoCivilModal = function() {
  document.getElementById('estadoCivilModal').style.display = 'none';
  document.getElementById('estadoCivilForm').reset();
}

window.saveEstadoCivil = async function() {
  const id = document.getElementById('estadoCivilId').value;
  const nombre = document.getElementById('estadoCivilNombre').value.trim();
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
    closeEstadoCivilModal();
    fetchAll();
  } else {
    const error = await res.json();
    alert(error.error || 'Error al guardar');
  }
}

window.removeEstadoCivil = async function(id) {
  if (!confirm('¿Eliminar este estado civil?')) return;
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

document.getElementById('searchEstadoCivil').addEventListener('input', function() {
  const term = this.value.toLowerCase();
  const rows = document.querySelectorAll('#estado-civil-table-body tr');
  rows.forEach(row => {
    const nombre = row.children[1].textContent.toLowerCase();
    row.style.display = nombre.includes(term) ? '' : 'none';
  });
});

// Modal close on outside click
window.onclick = function(event) {
  const modal = document.getElementById('estadoCivilModal');
  if (event.target === modal) {
    closeEstadoCivilModal();
  }
}

// Init
fetchAll();
