package com.seguridadbravo.seguridadbravobackend.services;

import org.mindrot.jbcrypt.BCrypt;

import com.seguridadbravo.seguridadbravobackend.config.SecurityConfig;

public class EncryptionService {

    public static String hashPassword(String plainPassword) {
        return BCrypt.hashpw(plainPassword, BCrypt.gensalt());
    }

    public static boolean checkPassword(String plainPassword, String hashedPassword) {
        try {
            return BCrypt.checkpw(plainPassword, hashedPassword);
        } catch (Exception e) {
            return false;
        }
    }

    @Deprecated
    public static boolean isPasswordStrong(String password) {
        return SecurityConfig.checkPasswordStrength(password) != SecurityConfig.PasswordStrength.WEAK;
    }
}
