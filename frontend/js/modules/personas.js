
const API = '/api/personas';
let personas = [];
let generos = [];
let estadosCivil = [];
let tiposDocumento = [];
let documentosCounter = 0;
let editingId = null;

document.addEventListener('DOMContentLoaded', () => {
    checkAuth && checkAuth();
    cargarCatalogos();
    cargarPersonas();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('btnNuevo').addEventListener('click', () => openModalPersona());
    document.getElementById('btnCancelar').addEventListener('click', closeModalPersona);
    document.querySelector('.close').addEventListener('click', closeModalPersona);
    document.getElementById('formPersona').addEventListener('submit', handleSubmitPersona);
    document.getElementById('searchInput').addEventListener('input', filterPersonas);
    document.getElementById('btnAgregarDocumento').addEventListener('click', () => addDocumento());
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('modal');
        if (event.target === modal) closeModalPersona();
    });
}

async function cargarCatalogos() {
    try {
        // Géneros
        const resGen = await fetch('/api/generos', { headers: getAuthHeaders() });
        generos = await resGen.json();
        llenarSelect('idGenero', generos, 'IdGenero', 'Nombre');
        // Estado civil
        const resEst = await fetch('/api/estado-civil', { headers: getAuthHeaders() });
        estadosCivil = await resEst.json();
        llenarSelect('idEstadoCivil', estadosCivil, 'IdEstadoCivil', 'Nombre');
        // Tipos documento
        const resTipo = await fetch('/api/tipo-documento', { headers: getAuthHeaders() });
        tiposDocumento = await resTipo.json();
    } catch (e) {
        showError('Error al cargar catálogos');
    }
}

function llenarSelect(selectId, data, valueField, textField) {
    const select = document.getElementById(selectId);
    const currentValue = select.value;
    while (select.options.length > 1) select.remove(1);
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueField];
        option.textContent = item[textField];
        select.appendChild(option);
    });
    if (currentValue) select.value = currentValue;
}

async function cargarPersonas() {
    try {
        const res = await fetch(API, { headers: getAuthHeaders() });
        if (!res.ok) throw new Error('Error al cargar personas');
        personas = await res.json();
        renderTablaPersonas(personas);
    } catch (e) {
        showError('Error al cargar personas');
        renderTablaPersonas([]);
    }
}

function renderTablaPersonas(data) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    if (!data.length) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No hay registros</td></tr>';
        return;
    }
    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.IdPersona}</td>
            <td>${item.Nombre} ${item.Apellido}</td>
            <td>${formatDate(item.FechaNacimiento)}</td>
            <td>${item.GeneroNombre || ''}</td>
            <td>${item.EstadoCivilNombre || ''}</td>
            <td>${item.Telefono}</td>
            <td>${item.CorreoElectronico || ''}</td>
            <td>
                <button class="btn btn-sm btn-edit" data-id="${item.IdPersona}">Editar</button>
                <button class="btn btn-sm btn-delete" data-id="${item.IdPersona}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    tbody.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => openModalPersona(btn.getAttribute('data-id')));
    });
    tbody.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deletePersona(btn.getAttribute('data-id')));
    });
}

function filterPersonas() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const filtered = personas.filter(item => {
        return (
            (item.Nombre || '').toLowerCase().includes(term) ||
            (item.Apellido || '').toLowerCase().includes(term) ||
            (item.CorreoElectronico || '').toLowerCase().includes(term)
        );
    });
    renderTablaPersonas(filtered);
}

function openModalPersona(id = null) {
    editingId = id;
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('formPersona');
    form.reset();
    document.getElementById('documentosContainer').innerHTML = '';
    documentosCounter = 0;
    if (id) {
        modalTitle.textContent = 'Editar Persona';
        loadPersona(id);
    } else {
        modalTitle.textContent = 'Nueva Persona';
    }
    modal.style.display = 'block';
}

async function loadPersona(id) {
    try {
        const res = await fetch(`${API}/${id}`, { headers: getAuthHeaders() });
        if (!res.ok) throw new Error('Error al cargar persona');
        const persona = await res.json();
        document.getElementById('idPersona').value = id;
        document.getElementById('nombre').value = persona.Nombre;
        document.getElementById('apellido').value = persona.Apellido;
        document.getElementById('fechaNacimiento').value = formatDateForInput(persona.FechaNacimiento);
        document.getElementById('idGenero').value = persona.IdGenero;
        document.getElementById('idEstadoCivil').value = persona.IdEstadoCivil;
        document.getElementById('telefono').value = persona.Telefono;
        document.getElementById('correoElectronico').value = persona.CorreoElectronico || '';
        document.getElementById('direccion').value = persona.Direccion;
        if (persona.documentos && Array.isArray(persona.documentos)) {
            persona.documentos.forEach(doc => {
                addDocumento(doc.IdTipoDocumento, doc.NoDocumento);
            });
        }
    } catch (e) {
        showError('Error al cargar persona');
    }
}

function closeModalPersona() {
    document.getElementById('modal').style.display = 'none';
    editingId = null;
}

function addDocumento(tipoDocId = '', numDoc = '') {
    const container = document.getElementById('documentosContainer');
    const docId = documentosCounter++;
    const docDiv = document.createElement('div');
    docDiv.className = 'documento-item';
    docDiv.dataset.docId = docId;
    docDiv.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Tipo de Documento</label>
                <select class="tipoDocumento" data-doc-id="${docId}" required>
                    <option value="">Seleccione...</option>
                    ${tiposDocumento.map(tipo => 
                        `<option value="${tipo.IdTipoDocumento}" ${tipo.IdTipoDocumento == tipoDocId ? 'selected' : ''}>${tipo.Nombre}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Número de Documento</label>
                <input type="text" class="numeroDocumento" data-doc-id="${docId}" value="${numDoc}" maxlength="50" required>
            </div>
            <div class="form-group">
                <button type="button" class="btn btn-danger btn-sm btn-eliminar-doc" data-doc-id="${docId}">Eliminar</button>
            </div>
        </div>
    `;
    container.appendChild(docDiv);
    docDiv.querySelector('.btn-eliminar-doc').addEventListener('click', () => removeDocumentoForm(docId));
}

function removeDocumentoForm(docId) {
    const docDiv = document.querySelector(`[data-doc-id="${docId}"]`);
    if (docDiv) docDiv.remove();
}

async function handleSubmitPersona(e) {
    e.preventDefault();
    const documentos = [];
    document.querySelectorAll('.documento-item').forEach(div => {
        const tipo = div.querySelector('.tipoDocumento').value;
        const num = div.querySelector('.numeroDocumento').value.trim();
        if (tipo && num) documentos.push({ IdTipoDocumento: parseInt(tipo), NoDocumento: num });
    });
    const data = {
        Nombre: document.getElementById('nombre').value.trim(),
        Apellido: document.getElementById('apellido').value.trim(),
        FechaNacimiento: document.getElementById('fechaNacimiento').value,
        IdGenero: parseInt(document.getElementById('idGenero').value),
        Direccion: document.getElementById('direccion').value.trim(),
        Telefono: document.getElementById('telefono').value.trim(),
        CorreoElectronico: document.getElementById('correoElectronico').value.trim(),
        IdEstadoCivil: parseInt(document.getElementById('idEstadoCivil').value),
        documentos
    };
    try {
        const url = editingId ? `${API}/${editingId}` : API;
        const res = await fetch(url, {
            method: editingId ? 'PUT' : 'POST',
            headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Error al guardar');
        }
        showSuccess(editingId ? 'Persona actualizada' : 'Persona creada');
        closeModalPersona();
        cargarPersonas();
    } catch (e) {
        showError(e.message);
    }
}

async function deletePersona(id) {
    if (!confirm('¿Eliminar esta persona? Se eliminarán también sus documentos.')) return;
    try {
        const res = await fetch(`${API}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Error al eliminar');
        }
        showSuccess('Persona eliminada');
        cargarPersonas();
    } catch (e) {
        showError(e.message);
    }
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-GT');
}
function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function showSuccess(msg) {
    if (window.showNotification) {
        showNotification(msg, 'success');
    } else {
        alert(msg);
    }
}
function showError(msg) {
    if (window.showNotification) {
        showNotification(msg, 'error');
    } else {
        alert(msg);
    }
}
