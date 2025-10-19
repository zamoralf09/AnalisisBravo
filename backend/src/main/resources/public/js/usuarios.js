// Gestión de Usuarios
let allUsers = [];
let currentPage = 1;
const usersPerPage = 10;
let currentEditId = null;

document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth()) return;
    if (!isAdmin()) {
        alert('Se requieren privilegios de administrador');
        window.location.href = '../dashboard.html';
        return;
    }
    
    loadUserData();
    loadUsers();
    setupModalListeners();
});

function setupModalListeners() {
    const modal = document.getElementById('userModal');
    window.onclick = function(event) {
        if (event.target === modal) {
            closeUserModal();
        }
    }
}

async function loadUsers() {
    try {
        const users = await ApiService.getUsers();
        allUsers = users;
        displayUsers();
        updatePagination();
    } catch (error) {
        console.error('Error loading users:', error);
        Utils.showError('Error al cargar usuarios');
    }
}

function displayUsers() {
    const tbody = document.getElementById('usersTableBody');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filteredUsers = allUsers.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchTerm) ||
                             user.nombre.toLowerCase().includes(searchTerm) ||
                             user.apellido.toLowerCase().includes(searchTerm) ||
                             user.email.toLowerCase().includes(searchTerm);
        
        const matchesStatus = statusFilter ? user.estatus === statusFilter : true;
        
        return matchesSearch && matchesStatus;
    });
    
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    if (paginatedUsers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="loading-row">
                    <i class="fas fa-search"></i>
                    No se encontraron usuarios
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = paginatedUsers.map(user => `
        <tr>
            <td>
                <img src="${user.fotoBase64 || '../images/default-avatar.png'}" 
                     class="user-avatar-table" alt="${user.username}">
            </td>
            <td>${Utils.sanitizeInput(user.username)}</td>
            <td>${Utils.sanitizeInput(user.nombre)} ${Utils.sanitizeInput(user.apellido)}</td>
            <td>${Utils.sanitizeInput(user.email)}</td>
            <td>${Utils.sanitizeInput(user.puesto || 'N/A')}</td>
            <td>
                <span class="status-badge status-${user.estatus.toLowerCase()}">
                    ${user.estatus}
                </span>
            </td>
            <td>${user.fechaUltimoAcceso ? Utils.formatDate(user.fechaUltimoAcceso) : 'Nunca'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit" onclick="editUser(${user.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="showDeleteConfirm(${user.id}, '${user.username}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn-icon btn-status" onclick="changeUserStatus(${user.id})" title="Cambiar Estado">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    document.getElementById('currentCount').textContent = paginatedUsers.length;
    document.getElementById('totalCount').textContent = filteredUsers.length;
}

function filterUsers() {
    currentPage = 1;
    displayUsers();
    updatePagination();
}

function changePage(direction) {
    const totalPages = Math.ceil(allUsers.length / usersPerPage);
    const newPage = currentPage + direction;
    
    if (newPage > 0 && newPage <= totalPages) {
        currentPage = newPage;
        displayUsers();
        updatePagination();
    }
}

function updatePagination() {
    const totalPages = Math.ceil(allUsers.length / usersPerPage);
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentPageElement = document.getElementById('currentPage');
    
    currentPageElement.textContent = currentPage;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

function openUserModal(userId = null) {
    const modal = document.getElementById('userModal');
    const title = document.getElementById('modalTitle');
    const passwordRequired = document.getElementById('passwordRequired');
    const passwordHelp = document.getElementById('passwordHelp');
    
    currentEditId = userId;
    
    if (userId) {
        title.textContent = 'Editar Usuario';
        passwordRequired.classList.add('hidden');
        passwordHelp.classList.remove('hidden');
        loadUserDataForEdit(userId);
    } else {
        title.textContent = 'Nuevo Usuario';
        passwordRequired.classList.remove('hidden');
        passwordHelp.classList.add('hidden');
        resetModalForm();
    }
    
    modal.style.display = 'block';
}

function closeUserModal() {
    document.getElementById('userModal').style.display = 'none';
    resetModalForm();
}

function resetModalForm() {
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('imagePreview').classList.add('hidden');
    document.getElementById('modalEstatus').value = 'ACTIVO';
    currentEditId = null;
}

async function loadUserDataForEdit(userId) {
    try {
        const user = await ApiService.getUserById(userId);
        
        document.getElementById('userId').value = user.id;
        document.getElementById('modalUsername').value = user.username;
        document.getElementById('modalEmail').value = user.email;
        document.getElementById('modalNombre').value = user.nombre;
        document.getElementById('modalApellido').value = user.apellido;
        document.getElementById('modalPuesto').value = user.puesto || '';
        document.getElementById('modalEstatus').value = user.estatus;
        
        if (user.fechaInicio) {
            document.getElementById('modalFechaInicio').value = user.fechaInicio;
        }
        
        if (user.fotoBase64) {
            document.getElementById('previewImg').src = user.fotoBase64;
            document.getElementById('imagePreview').classList.remove('hidden');
        }
        
    } catch (error) {
        console.error('Error loading user data:', error);
        Utils.showError('Error al cargar datos del usuario');
    }
}

function previewImage(input) {
    const preview = document.getElementById('imagePreview');
    const img = document.getElementById('previewImg');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            img.src = e.target.result;
            preview.classList.remove('hidden');
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}

function removeImage() {
    document.getElementById('modalFoto').value = '';
    document.getElementById('imagePreview').classList.add('hidden');
}

async function saveUser() {
    const formData = new FormData();
    const userData = {
        username: document.getElementById('modalUsername').value,
        email: document.getElementById('modalEmail').value,
        nombre: document.getElementById('modalNombre').value,
        apellido: document.getElementById('modalApellido').value,
        puesto: document.getElementById('modalPuesto').value,
        estatus: document.getElementById('modalEstatus').value,
        fechaInicio: document.getElementById('modalFechaInicio').value || null
    };
    
    const password = document.getElementById('modalPassword').value;
    if (password) {
        userData.password = password;
    }
    
    const fileInput = document.getElementById('modalFoto');
    if (fileInput.files[0]) {
        formData.append('foto', fileInput.files[0]);
    }
    
    formData.append('userData', JSON.stringify(userData));
    
    try {
        if (currentEditId) {
            await ApiService.updateUser(currentEditId, userData);
            Utils.showError('Usuario actualizado exitosamente', 'success');
        } else {
            await ApiService.createUser(userData);
            Utils.showError('Usuario creado exitosamente', 'success');
        }
        
        closeUserModal();
        loadUsers();
        
    } catch (error) {
        console.error('Error saving user:', error);
        Utils.showError(error.message || 'Error al guardar usuario');
    }
}

function showDeleteConfirm(userId, username) {
    document.getElementById('deleteUserName').textContent = username;
    document.getElementById('deleteModal').style.display = 'block';
    currentEditId = userId;
}

function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
    currentEditId = null;
}

async function confirmDelete() {
    if (!currentEditId) return;
    
    try {
        await ApiService.deleteUser(currentEditId);
        Utils.showError('Usuario eliminado exitosamente', 'success');
        closeDeleteModal();
        loadUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
        Utils.showError(error.message || 'Error al eliminar usuario');
    }
}

async function changeUserStatus(userId) {
    try {
        const user = await ApiService.getUserById(userId);
        let action;
        
        switch (user.estatus) {
            case 'ACTIVO':
                action = 'INACTIVATE';
                break;
            case 'INACTIVO':
                action = 'ACTIVATE';
                break;
            case 'BLOQUEADO':
                action = 'ACTIVATE';
                break;
            default:
                action = 'ACTIVATE';
        }
        
        await ApiService.changeStatus(userId, action);
        Utils.showError('Estado actualizado exitosamente', 'success');
        loadUsers();
        
    } catch (error) {
        console.error('Error changing user status:', error);
        Utils.showError(error.message || 'Error al cambiar estado');
    }
}