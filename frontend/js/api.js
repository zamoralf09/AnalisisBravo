// Permisos del usuario autenticado
async function getPermisosUsuario() {
    const response = await fetch(`${API_BASE_URL}/permisos-usuario`);
    if (!response.ok) throw new Error('No se pudieron obtener los permisos');
    return response.json();
}

const API_BASE_URL = 'http://localhost:3000/api';

// Funciones genéricas para mostrar notificaciones
function showNotification(message, type = 'success') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        background-color: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#f39c12'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Añadir estilos de animación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

function showError(message) {
    showNotification(message, 'error');
}

function showSuccess(message) {
    showNotification(message, 'success');
}

async function loginUser(email, password) {
    try {
        console.log('Intentando conectar a:', `${API_BASE_URL}/login`);
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        console.log('Respuesta del servidor:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Datos recibidos:', data);
        return data;
    } catch (error) {
        console.error('Error en loginUser:', error);
        throw error;
    }
}

// Función para verificar autenticación
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Interceptar fetch para agregar token de autenticación
const originalFetch = window.fetch;
window.fetch = async function(...args) {
    const [url, options = {}] = args;
    
    // Agregar token a las solicitudes a la API
    if (url.startsWith(API_BASE_URL)) {
        const token = localStorage.getItem('token');
        if (token) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${token}`
            };
        }
    }
    
    try {
        const response = await originalFetch(url, options);
        
        if (response.status === 401) {
            logout();
            throw new Error('Sesión expirada');
        }
        
        return response;
    } catch (error) {
        console.error('Error en la solicitud:', error);
        throw error;
    }
};

// Funciones para cada entidad del sistema

// EMPRESAS
async function getEmpresas() {
    const response = await fetch(`${API_BASE_URL}/empresas`);
    return response.json();
}

async function getEmpresaById(id) {
    const response = await fetch(`${API_BASE_URL}/empresas/${id}`);
    return response.json();
}

async function createEmpresa(data) {
    const response = await fetch(`${API_BASE_URL}/empresas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}


async function updateEmpresa(data) {
    const user = JSON.parse(localStorage.getItem('user'));
    data.UsuarioModificacion = user?.email || 'system';
    const response = await fetch(`${API_BASE_URL}/empresas/${data.IdEmpresa}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function deleteEmpresa(id) {
    const response = await fetch(`${API_BASE_URL}/empresas/${id}`, {
        method: 'DELETE'
    });
    return response.json();
}

// SUCURSALES
async function getSucursales() {
    const response = await fetch(`${API_BASE_URL}/sucursales`);
    return response.json();
}

async function getSucursalById(id) {
    const response = await fetch(`${API_BASE_URL}/sucursales/${id}`);
    return response.json();
}

async function createSucursal(data) {
    const response = await fetch(`${API_BASE_URL}/sucursales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function updateSucursal(data) {
    const response = await fetch(`${API_BASE_URL}/sucursales/${data.IdSucursal}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function deleteSucursal(id) {
    const response = await fetch(`${API_BASE_URL}/sucursales/${id}`, {
        method: 'DELETE'
    });
    return response.json();
}

// GÉNEROS
async function getGeneros() {
    const response = await fetch(`${API_BASE_URL}/generos`);
    return response.json();
}

async function getGeneroById(id) {
    const response = await fetch(`${API_BASE_URL}/generos/${id}`);
    return response.json();
}

async function createGenero(data) {
    const response = await fetch(`${API_BASE_URL}/generos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function updateGenero(data) {
    const response = await fetch(`${API_BASE_URL}/generos/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function deleteGenero(id) {
    const response = await fetch(`${API_BASE_URL}/generos/${id}`, {
        method: 'DELETE'
    });
    return response.json();
}

// STATUS USUARIO
async function getStatusUsuario() {
    const response = await fetch(`${API_BASE_URL}/status-usuario`);
    return response.json();
}

async function getStatusUsuarioById(id) {
    const response = await fetch(`${API_BASE_URL}/status-usuario/${id}`);
    return response.json();
}

async function createStatusUsuario(data) {
    const response = await fetch(`${API_BASE_URL}/status-usuario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function updateStatusUsuario(data) {
    const response = await fetch(`${API_BASE_URL}/status-usuario/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function deleteStatusUsuario(id) {
    const response = await fetch(`${API_BASE_URL}/status-usuario/${id}`, {
        method: 'DELETE'
    });
    return response.json();
}

// ROLES
async function getRoles() {
    const response = await fetch(`${API_BASE_URL}/roles`);
    return response.json();
}

async function getRoleById(id) {
    const response = await fetch(`${API_BASE_URL}/roles/${id}`);
    return response.json();
}

async function createRole(data) {
    // Solo enviar el campo Nombre
    const payload = { Nombre: data.Nombre };
    const response = await fetch(`${API_BASE_URL}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return response.json();
}

async function updateRole(data) {
    // Solo enviar el campo Nombre y usar IdRole
    const payload = { Nombre: data.Nombre };
    const response = await fetch(`${API_BASE_URL}/roles/${data.IdRole}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return response.json();
}

async function deleteRole(id) {
    const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
        method: 'DELETE'
    });
    return response.json();
}

// MÓDULOS
async function getModulos() {
    const response = await fetch(`${API_BASE_URL}/modulos`);
    return response.json();
}

async function getModuloById(id) {
    const response = await fetch(`${API_BASE_URL}/modulos/${id}`);
    return response.json();
}

async function createModulo(data) {
    const response = await fetch(`${API_BASE_URL}/modulos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function updateModulo(data) {
    const response = await fetch(`${API_BASE_URL}/modulos/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function deleteModulo(id) {
    const response = await fetch(`${API_BASE_URL}/modulos/${id}`, {
        method: 'DELETE'
    });
    return response.json();
}

// MENÚS
async function getMenus() {
    const response = await fetch(`${API_BASE_URL}/menus`);
    return response.json();
}

async function getMenusByModulo(moduloId) {
    const response = await fetch(`${API_BASE_URL}/menus?modulo_id=${moduloId}`);
    return response.json();
}

async function getMenuById(id) {
    const response = await fetch(`${API_BASE_URL}/menus/${id}`);
    return response.json();
}

async function createMenu(data) {
    const response = await fetch(`${API_BASE_URL}/menus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function updateMenu(data) {
    const response = await fetch(`${API_BASE_URL}/menus/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function deleteMenu(id) {
    const response = await fetch(`${API_BASE_URL}/menus/${id}`, {
        method: 'DELETE'
    });
    return response.json();
}

// OPCIONES
async function getOpciones() {
    const response = await fetch(`${API_BASE_URL}/opciones`);
    return response.json();
}

async function getOpcionById(id) {
    const response = await fetch(`${API_BASE_URL}/opciones/${id}`);
    return response.json();
}

async function createOpcion(data) {
    const response = await fetch(`${API_BASE_URL}/opciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function updateOpcion(data) {
    const response = await fetch(`${API_BASE_URL}/opciones/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function deleteOpcion(id) {
    const response = await fetch(`${API_BASE_URL}/opciones/${id}`, {
        method: 'DELETE'
    });
    return response.json();
}

// USUARIOS
async function getUsuarios() {
    const response = await fetch(`${API_BASE_URL}/usuarios`);
    return response.json();
}

async function getUsuarioById(id) {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`);
    return response.json();
}

async function createUsuario(data) {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function updateUsuario(data) {
    const response = await fetch(`${API_BASE_URL}/usuarios/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function deleteUsuario(id) {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'DELETE'
    });
    return response.json();
}

// ASIGNAR OPCIONES A ROLES
async function getOpcionesPorRole(roleId) {
    const response = await fetch(`${API_BASE_URL}/roles/${roleId}/opciones`);
    return response.json();
}

async function savePermisosRole(roleId, opciones) {
    const response = await fetch(`${API_BASE_URL}/roles/${roleId}/opciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opciones })
    });
    return response.json();
}

// DASHBOARD
async function getDashboardData() {
    const response = await fetch(`${API_BASE_URL}/dashboard`);
    return response.json();
}

// Función para obtener datos del dashboard
async function getDashboardData() {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al obtener datos del dashboard');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        // Datos de ejemplo para modo demo
        return {
            stats: {
                usuarios: 24,
                dispositivos: 12,
                eventos_hoy: 3
            },
            recentActivity: [
                {
                    tipo_evento: 'login',
                    descripcion: 'Usuario admin ha iniciado sesión',
                    fecha: new Date().toISOString(),
                    dispositivo_nombre: 'Sistema'
                }
            ]
        };
    }
}

async function checkBackendConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    } catch (error) {
        console.log('Backend no disponible:', error);
        return false;
    }
}

// Exportar funciones para uso global
window.API = {
    // Autenticación
    loginUser,
    checkAuth,
    logout,
    
    // Empresas
    getEmpresas,
    getEmpresaById,
    createEmpresa,
    updateEmpresa,
    deleteEmpresa,
    
    // Sucursales
    getSucursales,
    getSucursalById,
    createSucursal,
    updateSucursal,
    deleteSucursal,
    
    // Géneros
    getGeneros,
    getGeneroById,
    createGenero,
    updateGenero,
    deleteGenero,
    
    // Status Usuario
    getStatusUsuario,
    getStatusUsuarioById,
    createStatusUsuario,
    updateStatusUsuario,
    deleteStatusUsuario,
    
    // Roles
    getRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    
    // Módulos
    getModulos,
    getModuloById,
    createModulo,
    updateModulo,
    deleteModulo,
    
    // Menús
    getMenus,
    getMenusByModulo,
    getMenuById,
    createMenu,
    updateMenu,
    deleteMenu,
    
    // Opciones
    getOpciones,
    getOpcionById,
    createOpcion,
    updateOpcion,
    deleteOpcion,
    
    // Usuarios
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    
    // Asignar opciones a roles
    getOpcionesPorRole,
    savePermisosRole,
    
    // Dashboard
    getDashboardData,
    
    // Utilidades
    showError,
    showSuccess,
    showNotification,
    checkBackendConnection
};


Object.assign(window, window.API);