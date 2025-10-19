// Manejo de autenticación
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    
    if (loginForm) {
        // Cargar usuario recordado si existe
        const rememberedUser = localStorage.getItem('rememberedUser');
        if (rememberedUser) {
            document.getElementById('username').value = rememberedUser;
            document.getElementById('rememberMe').checked = true;
        }
        
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Verificar si ya está autenticado
    if (isAuthenticated() && window.location.pathname.endsWith('login.html')) {
        window.location.href = 'dashboard.html';
    }
});

async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const loginBtn = document.getElementById('loginBtn');
    
    // Validaciones básicas
    if (!username || !password) {
        Utils.showError('Por favor, complete todos los campos');
        return;
    }
    
    Utils.showLoading(loginBtn);
    Utils.hideError();
    
    try {
        const response = await ApiService.login(username, password);
        
        if (response.success) {
            // Guardar token y datos de usuario
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userData', JSON.stringify(response.user));
            
            // Recordar usuario si está marcado
            if (rememberMe) {
                localStorage.setItem('rememberedUser', username);
            } else {
                localStorage.removeItem('rememberedUser');
            }
            
            // Redirigir al dashboard
            window.location.href = 'dashboard.html';
            
        } else {
            Utils.showError(response.message || 'Error en el inicio de sesión');
        }
    } catch (error) {
        console.error('Login error:', error);
        Utils.showError(error.message || 'Error en el inicio de sesión');
    } finally {
        Utils.hideLoading(loginBtn);
    }
}

// Auto-logout por inactividad
let inactivityTimer;
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        if (isAuthenticated()) {
            if (confirm('Su sesión está por expirar por inactividad. ¿Desea continuar?')) {
                resetInactivityTimer();
            } else {
                logout();
            }
        }
    }, 30 * 60 * 1000); // 30 minutos
}

// Iniciar timer de inactividad si está autenticado
if (isAuthenticated()) {
    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keypress', resetInactivityTimer);
    resetInactivityTimer();
}