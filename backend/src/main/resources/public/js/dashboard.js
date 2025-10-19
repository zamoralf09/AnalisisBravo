// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth()) return;
    
    loadUserData();
    loadDashboardStats();
    loadRecentActivity();
    
    // Menu toggle for mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
    }
});

function loadUserData() {
    const userData = getUserData();
    if (userData) {
        document.getElementById('userName').textContent = 
            `${userData.nombre} ${userData.apellido}`;
        document.getElementById('userRole').textContent = 
            userData.username === 'admin' ? 'Administrador' : 'Usuario';
        
        // Cargar avatar si existe
        if (userData.fotoBase64) {
            document.getElementById('userAvatar').src = userData.fotoBase64;
        }
    }
}

async function loadDashboardStats() {
    try {
        const users = await ApiService.getUsers();
        
        const totalUsers = users.length;
        const activeUsers = users.filter(user => user.estatus === 'ACTIVO').length;
        const blockedUsers = users.filter(user => user.estatus === 'BLOQUEADO').length;
        
        document.getElementById('totalUsers').textContent = totalUsers;
        document.getElementById('activeUsers').textContent = activeUsers;
        document.getElementById('blockedUsers').textContent = blockedUsers;
        document.getElementById('recentLogins').textContent = '0'; // Placeholder
        
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        Utils.showError('Error al cargar estadísticas');
    }
}

async function loadRecentActivity() {
    const activityList = document.getElementById('activityList');
    
    try {
        // Placeholder - En una implementación real, obtendrías esto de la API
        const activities = [
            { action: 'Inicio de sesión', user: 'admin', time: new Date().toISOString() },
            { action: 'Usuario creado', user: 'nuevo_usuario', time: new Date(Date.now() - 3600000).toISOString() },
            { action: 'Contraseña actualizada', user: 'usuario1', time: new Date(Date.now() - 7200000).toISOString() }
        ];
        
        activityList.innerHTML = '';
        
        activities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <i class="fas fa-circle"></i>
                <span>
                    <strong>${activity.action}</strong> por ${activity.user} - 
                    ${Utils.formatDate(activity.time)}
                </span>
            `;
            activityList.appendChild(activityItem);
        });
        
    } catch (error) {
        console.error('Error loading recent activity:', error);
        activityList.innerHTML = `
            <div class="activity-item">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Error al cargar actividad reciente</span>
            </div>
        `;
    }
}

// Auto-refresh dashboard every 5 minutes
setInterval(() => {
    if (isAuthenticated() && window.location.pathname.endsWith('dashboard.html')) {
        loadDashboardStats();
        loadRecentActivity();
    }
}, 5 * 60 * 1000);