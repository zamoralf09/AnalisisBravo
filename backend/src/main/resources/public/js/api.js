// Configuración de la API
const API_BASE_URL = 'http://localhost:4567/api';

class ApiService {
    static async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = localStorage.getItem('authToken');
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            }
        };
        
        const config = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };
        
        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                if (response.status === 401) {
                    // Token expirado o inválido
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userData');
                    window.location.href = 'login.html';
                    throw new Error('Sesión expirada');
                }
                
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    // Auth endpoints
    static async login(username, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    }
    
    static async logout() {
        return this.request('/auth/logout', {
            method: 'POST'
        });
    }
    
    static async verifyToken() {
        return this.request('/auth/verify');
    }
    
    // User endpoints
    static async getUsers() {
        return this.request('/users');
    }
    
    static async getUserById(id) {
        return this.request(`/users/${id}`);
    }
    
    static async createUser(userData) {
        return this.request('/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }
    
    static async updateUser(id, userData) {
        return this.request(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }
    
    static async deleteUser(id) {
        return this.request(`/users/${id}`, {
            method: 'DELETE'
        });
    }
    
    static async updatePassword(id, currentPassword, newPassword) {
        return this.request(`/users/${id}/password`, {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword })
        });
    }
    
    static async changeStatus(id, action) {
        return this.request(`/users/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ action })
        });
    }
    
    static async resetPassword(id, newPassword) {
        return this.request(`/users/${id}/reset-password`, {
            method: 'PUT',
            body: JSON.stringify({ newPassword })
        });
    }
}

// Interceptor para manejar errores globalmente
const originalRequest = ApiService.request;
ApiService.request = async function(...args) {
    try {
        return await originalRequest.apply(this, args);
    } catch (error) {
        Utils.showError(error.message);
        throw error;
    }
};