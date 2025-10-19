package com.seguridadbravo.seguridadbravobackend.services;

import java.util.List;

import com.seguridadbravo.seguridadbravobackend.config.SecurityConfig;
import com.seguridadbravo.seguridadbravobackend.dao.UserDAO;
import com.seguridadbravo.seguridadbravobackend.models.Usuario;

public class UserService {
    private UserDAO userDAO = new UserDAO();

    public Usuario createUser(Usuario user) {
        // Validar que el correo no exista
        Usuario existingUser = userDAO.getUserByEmail(user.getCorreoElectronico());
        if (existingUser != null) {
            throw new RuntimeException("El correo electrónico ya está registrado");
        }

        // Validar fortaleza de la contraseña
        SecurityConfig.PasswordStrength strength = SecurityConfig.checkPasswordStrength(user.getPassword());
        if (strength == SecurityConfig.PasswordStrength.WEAK) {
            throw new RuntimeException("La contraseña no cumple con los requisitos de seguridad mínimos");
        }

        // Encriptar contraseña con MD5 (para compatibilidad con tu base de datos)
        String hashedPassword = md5(user.getPassword());
        user.setPassword(hashedPassword);

        // Establecer valores por defecto
        user.setIntentosDeAcceso(0);
        user.setRequiereCambiarPassword(1); // 1 = Requiere cambiar contraseña

        // TODO: Implementar lógica para guardar el usuario en la base de datos
        // Por ahora, simular la creación devolviendo el usuario
        return user;
    }

    public Usuario getUserByEmail(String email) {
        Usuario user = userDAO.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("Usuario no encontrado");
        }
        return user;
    }

    public List<Usuario> getAllUsers() {
        return userDAO.getAllUsers();
    }

    public boolean updateUser(Usuario user) {
        // Validar que el usuario existe
        Usuario existingUser = userDAO.getUserByEmail(user.getCorreoElectronico());
        if (existingUser == null) {
            throw new RuntimeException("Usuario no encontrado");
        }

        // Validar campos si es necesario
        if (user.getCorreoElectronico() != null && !SecurityConfig.isValidEmail(user.getCorreoElectronico())) {
            throw new RuntimeException("El email no tiene un formato válido");
        }

        return userDAO.updateUser(user);
    }

    public boolean deleteUser(String email) {
        // Validar que el usuario existe
        Usuario existingUser = userDAO.getUserByEmail(email);
        if (existingUser == null) {
            throw new RuntimeException("Usuario no encontrado");
        }

        // No permitir eliminar usuarios del sistema
        if ("system".equals(email) || "Administrador".equals(email)) {
            throw new RuntimeException("No se puede eliminar usuarios del sistema");
        }

        // TODO: Implementar eliminación lógica o física según tu estructura
        // Por ahora, simular eliminación
        return true;
    }

    public boolean updatePassword(String email, String currentPassword, String newPassword) {
        Usuario user = userDAO.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("Usuario no encontrado");
        }

        // Verificar contraseña actual (MD5)
        String currentHashedPassword = md5(currentPassword);
        if (!currentHashedPassword.equals(user.getPassword())) {
            throw new RuntimeException("Contraseña actual incorrecta");
        }

        // Validar que la nueva contraseña sea diferente a la actual
        String newHashedPassword = md5(newPassword);
        if (newHashedPassword.equals(user.getPassword())) {
            throw new RuntimeException("La nueva contraseña debe ser diferente a la actual");
        }

        // Validar fortaleza de la nueva contraseña
        SecurityConfig.PasswordStrength strength = SecurityConfig.checkPasswordStrength(newPassword);
        if (strength == SecurityConfig.PasswordStrength.WEAK) {
            throw new RuntimeException("La nueva contraseña no cumple con los requisitos de seguridad mínimos");
        }

        // Encriptar nueva contraseña con MD5
        return userDAO.updatePassword(email, newHashedPassword);
    }

    public boolean resetPassword(String email, String newPassword) {
        Usuario user = userDAO.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("Usuario no encontrado");
        }

        // Validar fortaleza de la nueva contraseña
        SecurityConfig.PasswordStrength strength = SecurityConfig.checkPasswordStrength(newPassword);
        if (strength == SecurityConfig.PasswordStrength.WEAK) {
            throw new RuntimeException("La nueva contraseña no cumple con los requisitos de seguridad mínimos");
        }

        // Encriptar nueva contraseña con MD5
        String hashedPassword = md5(newPassword);

        return userDAO.updatePassword(email, hashedPassword);
    }

    public boolean blockUser(String email) {
        Usuario user = userDAO.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("Usuario no encontrado");
        }

        return userDAO.blockUser(email);
    }

    public boolean activateUser(String email) {
        Usuario user = userDAO.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("Usuario no encontrado");
        }

        return userDAO.activateUser(email);
    }

    public boolean incrementFailedAttempts(String email) {
        Usuario user = userDAO.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("Usuario no encontrado");
        }

        return userDAO.incrementFailedAttempts(email);
    }

    public boolean resetFailedAttempts(String email) {
        Usuario user = userDAO.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("Usuario no encontrado");
        }

        return userDAO.resetFailedAttempts(email);
    }

    public boolean updateLastLogin(String email) {
        Usuario user = userDAO.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("Usuario no encontrado");
        }

        return userDAO.updateLastLogin(email);
    }

    public boolean validateSecurityAnswer(String email, String respuesta) {
        Usuario user = userDAO.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("Usuario no encontrado");
        }

        // Comparar respuestas (case-insensitive y trim)
        String respuestaUsuario = user.getRespuesta() != null ? user.getRespuesta().trim().toLowerCase() : "";
        String respuestaIngresada = respuesta != null ? respuesta.trim().toLowerCase() : "";

        return respuestaUsuario.equals(respuestaIngresada);
    }

    public boolean requiresPasswordChange(String email) {
        Usuario user = userDAO.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("Usuario no encontrado");
        }

        return user.getRequiereCambiarPassword() == 1;
    }

    public int getFailedAttempts(String email) {
        Usuario user = userDAO.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("Usuario no encontrado");
        }

        return user.getIntentosDeAcceso();
    }

    public boolean isUserBlocked(String email) {
        Usuario user = userDAO.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("Usuario no encontrado");
        }

        return user.getIdStatusUsuario() == 2; // 2 = Bloqueado
    }

    public boolean isUserActive(String email) {
        Usuario user = userDAO.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("Usuario no encontrado");
        }

        return user.getIdStatusUsuario() == 1;
    }

    private String md5(String input) {
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("MD5");
            byte[] array = md.digest(input.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : array) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (java.security.NoSuchAlgorithmException e) {
            throw new RuntimeException("Error al encriptar contraseña", e);
        }
    }

    public boolean inactivateUser(String email) {
        Usuario user = userDAO.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("Usuario no encontrado");
        }

        // Cambiar el estado del usuario a inactivo (por ejemplo, idStatusUsuario = 3)
        user.setIdStatusUsuario(3);
        return userDAO.updateUser(user);
    }

    public boolean isPasswordExpired(String email) {
        Usuario user = userDAO.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("Usuario no encontrado");
        }

        return false;
    }

    public boolean canUserLogin(String email) {
        Usuario user = userDAO.getUserByEmail(email);
        if (user == null) {
            return false;
        }

        if (user.getIdStatusUsuario() != 1) {
        }
        if (user.getIntentosDeAcceso() >= 5) {
            return false;
        }

        return true;
    }

}