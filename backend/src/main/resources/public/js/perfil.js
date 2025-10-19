// Perfil de Usuario
let originalFormData = {};

document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth()) return;
    
    loadUserData();
    loadProfileData();
    setupPasswordValidation();
    setupFormListeners();
});

function setupFormListeners() {
    document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);
    document.getElementById('passwordForm').addEventListener('submit', handlePasswordChange);
}

async function loadProfileData() {
    try {
        const userData = getUserData();
        if (!userData) return;
        
        const user = await ApiService.getUserById(userData.id);
        displayProfileData(user);
        loadUserActivity();
        
    } catch (error) {
        console.error('Error loading profile data:', error);
        Utils.showError('Error al cargar datos del perfil');
    }
}

function displayProfileData(user) {
    // Información básica
    document.getElementById('profileName').textContent = `${user.nombre} ${user.apellido}`;
    document.getElementById('profileUsername').textContent = `@${user.username}`;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileStatus').textContent = user.estatus;
    document.getElementById('profileStatus').className = `status-badge status-${user.estatus.toLowerCase()}`;
    
    // Avatar
    if (user.fotoBase64) {
        document.getElementById('profileAvatar').src = user.fotoBase64;
        document.getElementById('userAvatar').src = user.fotoBase64;
    }
    
    // Estadísticas
    if (user.fechaInicio) {
        const daysSince = Math.floor((new Date() - new Date(user.fechaInicio)) / (1000 * 60 * 60 * 24));
        document.getElementById('profileSince').textContent = daysSince;
    }
    
    if (user.fechaUltimoAcceso) {
        document.getElementById('lastLogin').textContent = Utils.formatDate(user.fechaUltimoAcceso);
    }
    
    if (user.fechaExpiracionPassword) {
        const daysUntilExpiration = Math.floor((new Date(user.fechaExpiracionPassword) - new Date()) / (1000 * 60 * 60 * 24));
        document.getElementById('passwordExpires').textContent = Math.max(0, daysUntilExpiration);
    }
    
    // Formulario
    document.getElementById('profileNombre').value = user.nombre;
    document.getElementById('profileApellido').value = user.apellido;
    document.getElementById('profileUsername').value = user.username;
    document.getElementById('profileEmail').value = user.email;
    document.getElementById('profilePuesto').value = user.puesto || '';
    
    if (user.fechaInicio) {
        document.getElementById('profileFechaInicio').value = user.fechaInicio;
    }
    
    // Guardar datos originales para comparar
    originalFormData = {
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        puesto: user.puesto || '',
        fechaInicio: user.fechaInicio || ''
    };
}

function switchTab(tabName) {
    // Ocultar todos los tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar tab seleccionado
    document.getElementById(`tab-${tabName}`).classList.add('active');
    document.querySelector(`.tab-btn:nth-child(${['info', 'security', 'activity'].indexOf(tabName) + 1})`).classList.add('active');
}

async function handleProfileUpdate(event) {
    event.preventDefault();
    
    const userData = getUserData();
    if (!userData) return;
    
    const formData = {
        nombre: document.getElementById('profileNombre').value,
        apellido: document.getElementById('profileApellido').value,
        email: document.getElementById('profileEmail').value,
        puesto: document.getElementById('profilePuesto').value,
        fechaInicio: document.getElementById('profileFechaInicio').value || null
    };
    
    // Verificar si hay cambios
    const hasChanges = Object.keys(formData).some(key => 
        formData[key] !== originalFormData[key]
    );
    
    if (!hasChanges) {
        Utils.showError('No hay cambios para guardar');
        return;
    }
    
    try {
        await ApiService.updateUser(userData.id, formData);
        
        // Actualizar datos en localStorage
        const updatedUser = await ApiService.getUserById(userData.id);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        
        Utils.showError('Perfil actualizado exitosamente', 'success');
        loadProfileData();
        
    } catch (error) {
        console.error('Error updating profile:', error);
        Utils.showError(error.message || 'Error al actualizar perfil');
    }
}

function resetForm() {
    document.getElementById('profileNombre').value = originalFormData.nombre;
    document.getElementById('profileApellido').value = originalFormData.apellido;
    document.getElementById('profileEmail').value = originalFormData.email;
    document.getElementById('profilePuesto').value = originalFormData.puesto;
    
    if (originalFormData.fechaInicio) {
        document.getElementById('profileFechaInicio').value = originalFormData.fechaInicio;
    }
}

async function handlePasswordChange(event) {
    event.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        Utils.showError('Las contraseñas no coinciden');
        return;
    }
    
    const userData = getUserData();
    if (!userData) return;
    
    try {
        await ApiService.updatePassword(userData.id, currentPassword, newPassword);
        
        Utils.showError('Contraseña actualizada exitosamente', 'success');
        document.getElementById('passwordForm').reset();
        updatePasswordStrength(0);
        
    } catch (error) {
        console.error('Error changing password:', error);
        Utils.showError(error.message || 'Error al cambiar contraseña');
    }
}

function setupPasswordValidation() {
    const newPasswordInput = document.getElementById('newPassword');
    
    newPasswordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        updatePasswordStrength(strength);
        validatePasswordRequirements(password);
    });
}

function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength;
}

function updatePasswordStrength(strength) {
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    const strengthClasses = ['very-weak', 'weak', 'medium', 'strong', 'very-strong'];
    const strengthLabels = ['Muy Débil', 'Débil', 'Media', 'Fuerte', 'Muy Fuerte'];
    const strengthColors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60'];
    
    strengthBar.style.width = `${(strength / 5) * 100}%`;
    strengthBar.style.backgroundColor = strengthColors[strength] || '#e74c3c';
    strengthText.textContent = `Seguridad: ${strengthLabels[strength] || 'Muy Débil'}`;
}

function validatePasswordRequirements(password) {
    const requirements = {
        reqLength: password.length >= 8,
        reqUpper: /[A-Z]/.test(password),
        reqLower: /[a-z]/.test(password),
        reqNumber: /[0-9]/.test(password),
        reqSpecial: /[^A-Za-z0-9]/.test(password)
    };
    
    Object.keys(requirements).forEach(reqId => {
        const element = document.getElementById(reqId);
        if (element) {
            element.style.color = requirements[reqId] ? '#27ae60' : '#e74c3c';
            element.style.fontWeight = requirements[reqId] ? '600' : '400';
        }
    });
}

async function uploadAvatar(input) {
    if (!input.files[0]) return;
    
    const userData = getUserData();
    if (!userData) return;
    
    try {
        const reader = new FileReader();
        reader.onload = async function(e) {
            const base64Image = e.target.result;
            
            await ApiService.updateUser(userData.id, {
                fotoBase64: base64Image
            });
            
            // Actualizar avatares
            document.getElementById('profileAvatar').src = base64Image;
            document.getElementById('userAvatar').src = base64Image;
            
            // Actualizar localStorage
            const updatedUser = await ApiService.getUserById(userData.id);
            localStorage.setItem('userData', JSON.stringify(updatedUser));
            
            Utils.showError('Avatar actualizado exitosamente', 'success');
        };
        
        reader.readAsDataURL(input.files[0]);
        
    } catch (error) {
        console.error('Error uploading avatar:', error);
        Utils.showError('Error al subir avatar');
    }
}

async function removeAvatar() {
    const userData = getUserData();
    if (!userData) return;
    
    try {
        await ApiService.updateUser(userData.id, {
            fotoBase64: null
        });
        
        // Restablecer avatares
        const defaultAvatar = '../images/default-avatar.png';
        document.getElementById('profileAvatar').src = defaultAvatar;
        document.getElementById('userAvatar').src = defaultAvatar;
        
        // Actualizar localStorage
        const updatedUser = await ApiService.getUserById(userData.id);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        
        Utils.showError('Avatar eliminado exitosamente', 'success');
        
    } catch (error) {
        console.error('Error removing avatar:', error);
        Utils.showError('Error al eliminar avatar');
    }
}

async function loadUserActivity() {
    const activityList = document.getElementById('profileActivityList');
    
    try {
        // Placeholder - En una implementación real, obtendrías esto de la API
        const activities = [
            { action: 'Inicio de sesión', time: new Date().toISOString(), details: 'Desde 192.168.1.1' },
            { action: 'Perfil actualizado', time: new Date(Date.now() - 3600000).toISOString(), details: 'Información personal' },
            { action: 'Contraseña cambiada', time: new Date(Date.now() - 86400000).toISOString(), details: 'Contraseña actualizada' }
        ];
        
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <i class="fas fa-circle"></i>
                <div class="activity-details">
                    <strong>${activity.action}</strong>
                    <span>${Utils.formatDate(activity.time)}</span>
                    <small>${activity.details}</small>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading activity:', error);
        activityList.innerHTML = `
            <div class="activity-item">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Error al cargar actividad</span>
            </div>
        `;
    }
}