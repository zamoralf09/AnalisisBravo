// js/dashboard.js

let permisosGlobales = { usuarios: false, asignarOpciones: false };

document.addEventListener('DOMContentLoaded', async function() {
    checkAuth();
    try {
        const permisos = await getPermisosUsuario();
        // Buscar permisos para Usuarios y Asignar Opciones (ajustar nombre si es necesario)
        const permisoUsuarios = permisos.find(p => (p.modulo?.toLowerCase?.() || p.Modulo?.toLowerCase?.() || p.nombre_modulo?.toLowerCase?.()) === 'usuarios');
        const permisoAsignar = permisos.find(p => (p.modulo?.toLowerCase?.() || p.Modulo?.toLowerCase?.() || p.nombre_modulo?.toLowerCase?.()) === 'asignar opciones');
        permisosGlobales.usuarios = permisoUsuarios && (permisoUsuarios.ver === 1 || permisoUsuarios.ver === true);
        permisosGlobales.asignarOpciones = permisoAsignar && (permisoAsignar.ver === 1 || permisoAsignar.ver === true);
    } catch (e) {
        console.error('No se pudieron obtener los permisos globales', e);
    }
    loadDashboardData();
    setupEventListeners();
    loadUserInfo();
    // Ocultar accesos si no hay permiso (opcional, pero preferimos solo interceptar el clic)
});

function setupEventListeners() {
    // Manejar logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }

    // Interceptar clics solo para Asignar Opciones
    const interceptores = [
        { selector: 'a[href$="modules/asignar-opciones.html"], a[href$="modules/asignar-opciones.html"]', permiso: 'asignarOpciones' },
        { selector: 'a[href$="asignar-opciones.html"], a[href$="asignar-opciones.html"]', permiso: 'asignarOpciones' }
    ];
    interceptores.forEach(({ selector, permiso }) => {
        document.querySelectorAll(selector).forEach(link => {
            link.addEventListener('click', function(e) {
                if (!permisosGlobales[permiso]) {
                    e.preventDefault();
                    mostrarModalSinPermiso();
                }
            });
        });
    });

    // Prevenir clic en enlaces que no existen (resto de módulos)
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Permitir navegación normal al Dashboard
            if (href && (href.endsWith('dashboard.html') || href === 'dashboard.html')) {
                return; // No hacer nada especial
            }
            // Solo verificar módulos, no el dashboard ni logout
            if (href && href.includes('modules/') && !href.endsWith('usuarios.html') && !href.endsWith('asignar-opciones.html')) {
                e.preventDefault();
                checkFileExists(href, function(exists) {
                    if (exists) {
                        window.location.href = href;
                    } else {
                        showNotification('Módulo en desarrollo. Próximamente disponible.', 'info');
                    }
                });
            }
        });
    });
}

// Modal bonito para "No tienes permisos"
function mostrarModalSinPermiso() {
    if (document.getElementById('modalSinPermiso')) return;
    const modal = document.createElement('div');
    modal.id = 'modalSinPermiso';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.35); z-index: 10001; display: flex; align-items: center; justify-content: center;`;
    modal.innerHTML = `
        <div style="background: white; padding: 2rem 2.5rem; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.18); text-align: center; max-width: 350px;">
            <div style="font-size: 2.5rem; color: #e74c3c; margin-bottom: 0.5rem;">&#9888;&#65039;</div>
            <h2 style="margin-bottom: 0.5rem; color: #e74c3c;">Acceso denegado</h2>
            <p style="color: #555; margin-bottom: 1.5rem;">No tienes permisos para ver este apartado.</p>
            <button id="cerrarModalSinPermiso" style="background: #e74c3c; color: white; border: none; border-radius: 6px; padding: 0.5rem 1.5rem; font-size: 1rem; cursor: pointer;">Cerrar</button>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('cerrarModalSinPermiso').onclick = () => {
        modal.remove();
    };
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}

function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('current-user').textContent = user.nombre || user.email;
    }
}

async function loadDashboardData() {
    try {
        const data = await getDashboardData();
        
        // Actualizar estadísticas
        if (data.stats) {
            updateStats(data.stats);
        }
        
        // Actualizar actividad reciente
        if (data.recentActivity && data.recentActivity.length > 0) {
            updateRecentActivity(data.recentActivity);
        }
    } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
        // Valores por defecto en caso de error
        setDefaultStats();
    }
}

function updateStats(stats) {
    document.getElementById('empresas-count').textContent = stats.empresas || 0;
    document.getElementById('usuarios-count').textContent = stats.usuarios || 1;
    document.getElementById('roles-count').textContent = stats.roles || 4;
    document.getElementById('modulos-count').textContent = stats.modulos || 3;
}

function setDefaultStats() {
    document.getElementById('empresas-count').textContent = '0';
    document.getElementById('usuarios-count').textContent = '1';
    document.getElementById('roles-count').textContent = '4';
    document.getElementById('modulos-count').textContent = '3';
}

function updateRecentActivity(activities) {
    const container = document.getElementById('recent-activity');
    if (!container) return;
    
    container.innerHTML = '';
    
    activities.slice(0, 5).forEach(activity => {
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <div class="activity-icon">📋</div>
            <div class="activity-content">
                <p>${activity.descripcion || 'Actividad del sistema'}</p>
                <span class="activity-time">${formatTime(activity.fecha)}</span>
            </div>
        `;
        container.appendChild(item);
    });
}

function formatTime(dateString) {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        
        if (diffMins < 1) return 'Hace un momento';
        if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
        if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
        
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return 'Fecha no disponible';
    }
}

// Verificar si un archivo existe
function checkFileExists(url, callback) {
    fetch(url, { method: 'HEAD' })
        .then(response => {
            callback(response.ok);
        })
        .catch(() => {
            callback(false);
        });
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    // Eliminar notificaciones existentes
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `custom-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#2ecc71' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-left: 15px;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Añadir estilos de animación para notificaciones
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .notification-message {
        flex: 1;
        margin-right: 10px;
    }
    
    .custom-notification {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
`;
document.head.appendChild(notificationStyles);

// Función para verificar autenticación
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Verificar si el token es válido (opcional)
    try {
        const userData = JSON.parse(user);
        // Aceptar si tiene username, nombre o email
        if (!userData.username && !userData.nombre && !userData.email) {
            throw new Error('Datos de usuario inválidos');
        }
    } catch (error) {
        console.error('Error verificando autenticación:', error);
        logout();
    }
}

// Función para cerrar sesión
function logout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Mostrar notificación antes de salir
        showNotification('Sesión cerrada correctamente', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1200);
    }
}

// Manejar errores no capturados
window.addEventListener('error', function(e) {
    console.error('Error global:', e.error);
    showNotification('Error en la aplicación. Por favor recarga la página.', 'error');
});

// Exportar funciones para uso global
window.Dashboard = {
    loadDashboardData,
    updateStats,
    showNotification,
    checkAuth,
    logout
};