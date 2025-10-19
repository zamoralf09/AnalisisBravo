package com.seguridadbravo.seguridadbravobackend.config;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

public class SecurityConfig {

    // Configuración de políticas de seguridad
    public static final int MAX_LOGIN_ATTEMPTS = 5;
    public static final int PASSWORD_EXPIRATION_DAYS = 90;
    public static final int ACCOUNT_LOCKOUT_MINUTES = 30;
    public static final int SESSION_TIMEOUT_MINUTES = 30;

    // Patrones para validación de entrada
    public static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    public static final Pattern PASSWORD_PATTERN = Pattern
            .compile("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$");
    public static final Pattern NAME_PATTERN = Pattern.compile("^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]{2,100}$");

    // Lista de roles del sistema
    public static final List<String> SYSTEM_ROLES = Arrays.asList("ADMIN", "USER");

    // Configuración de CORS
    public static final String[] ALLOWED_ORIGINS = { "http://localhost:3000", "http://127.0.0.1:3000" };
    public static final String[] ALLOWED_METHODS = { "GET", "POST", "PUT", "DELETE", "OPTIONS" };
    public static final String[] ALLOWED_HEADERS = { "Content-Type", "Authorization", "Accept", "Origin" };

    // Configuración de headers de seguridad HTTP
    public static final boolean ENABLE_HTTPS = false; // Cambiar a true en producción
    public static final boolean ENABLE_HSTS = false; // Cambiar a true en producción con HTTPS
    public static final boolean ENABLE_XSS_PROTECTION = true;
    public static final boolean ENABLE_CONTENT_TYPE_OPTIONS = true;
    public static final boolean ENABLE_FRAME_OPTIONS = true;
    public static final String FRAME_OPTIONS_VALUE = "DENY";
    public static final boolean ENABLE_CSP = true;
    public static final String CSP_VALUE = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';";

    // Métodos de validación
    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    public static boolean isValidPassword(String password) {
        return password != null && PASSWORD_PATTERN.matcher(password).matches();
    }

    public static boolean isValidName(String name) {
        return name != null && NAME_PATTERN.matcher(name).matches();
    }

    public static boolean isValidRole(String role) {
        return role != null && SYSTEM_ROLES.contains(role.toUpperCase());
    }

    // Métodos para prevenir inyecciones SQL
    public static String sanitizeInput(String input) {
        if (input == null) {
            return null;
        }

        // Eliminar caracteres potencialmente peligrosos para SQL
        return input.replaceAll("['\"\\;\\-\\-]", "");
    }

    public static boolean containsSqlInjection(String input) {
        if (input == null) {
            return false;
        }

        // Patrones comunes de inyección SQL
        String[] sqlPatterns = {
                "(?i).*\\b(union|select|insert|update|delete|drop|alter|create|table|from|where|exec|execute|script|javascript|onload|onerror)\\b.*",
                "(?i).*['\"].*or.*['\"].*",
                "(?i).*--.*",
                "(?i).*;.*",
                "(?i).*\\b(and|or)\\b.*\\d+.*=.*\\d+.*",
                "(?i).*\\b(and|or)\\b.*['\"].*['\"].*=.*['\"].*['\"].*"
        };

        for (String pattern : sqlPatterns) {
            if (input.matches(pattern)) {
                return true;
            }
        }

        return false;
    }

    // Métodos para prevenir XSS
    public static String sanitizeForXSS(String input) {
        if (input == null) {
            return null;
        }

        // Escapar caracteres HTML peligrosos
        return input.replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll("\"", "&quot;")
                .replaceAll("'", "&#x27;")
                .replaceAll("/", "&#x2F;");
    }

    // Corrección del problema de sintaxis en los patrones XSS
    public static boolean containsXSS(String input) {
        if (input == null) {
            return false;
        }

        String[] xssPatterns = {
                "(?i).*<script.*>.*</script>.*",
                "(?i).*javascript:.*",
                "(?i).*onload=.*",
                "(?i).*onerror=.*",
                "(?i).*onclick=.*",
                "(?i).*onmouseover=.*",
                "(?i).*vbscript:.*",
                "(?i).*<iframe.*>.*</iframe>.*",
                "(?i).*<object.*>.*</object>.*",
                "(?i).*<embed.*>.*</embed>.*"
        };

        for (String pattern : xssPatterns) {
            if (input.matches(pattern)) {
                return true;
            }
        }

        return false;
    }

    // Método para validar y sanitizar entrada completa
    public static String validateAndSanitizeInput(String input, InputType type) {
        if (input == null) {
            return null;
        }

        if (containsSqlInjection(input)) {
            throw new SecurityException("Entrada contiene patrones de inyección SQL");
        }

        if (containsXSS(input)) {
            throw new SecurityException("Entrada contiene patrones de XSS");
        }

        switch (type) {
            case EMAIL:
                if (!isValidEmail(input)) {
                    throw new SecurityException("Email inválido");
                }
                break;
            case PASSWORD:
                if (!isValidPassword(input)) {
                    throw new SecurityException("La contraseña no cumple con los requisitos de seguridad");
                }
                break;
            case NAME:
                if (!isValidName(input)) {
                    throw new SecurityException("Nombre inválido");
                }
                break;
            case GENERAL_TEXT:
                break;
        }

        return sanitizeForXSS(input);
    }

    // Método para aplicar headers de seguridad HTTP
    public static void applySecurityHeaders(spark.Response response) {
        // Para producción, habilite ENABLE_HSTS y ENABLE_HTTPS en true para aplicar
        // este header
        // Aplica el header Strict-Transport-Security solo si ambas opciones están
        // habilitadas
        if (ENABLE_HTTPS) {
            if (ENABLE_HSTS) {
                response.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
            }
        }

        if (ENABLE_XSS_PROTECTION) {
            response.header("X-XSS-Protection", "1; mode=block");
        }

        if (ENABLE_CONTENT_TYPE_OPTIONS) {
            response.header("X-Content-Type-Options", "nosniff");
        }

        if (ENABLE_FRAME_OPTIONS) {
            response.header("X-Frame-Options", FRAME_OPTIONS_VALUE);
        }

        if (ENABLE_CSP) {
            response.header("Content-Security-Policy", CSP_VALUE);
        }
    }

    // Enum para tipos de entrada
    public enum InputType {
        EMAIL, PASSWORD, NAME, GENERAL_TEXT
    }

    // Método para verificar fortaleza de contraseña
    public static PasswordStrength checkPasswordStrength(String password) {
        if (password == null || password.length() < 8) {
            return PasswordStrength.WEAK;
        }

        boolean hasUpper = false;
        boolean hasLower = false;
        boolean hasDigit = false;
        boolean hasSpecial = false;

        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c))
                hasUpper = true;
            if (Character.isLowerCase(c))
                hasLower = true;
            if (Character.isDigit(c))
                hasDigit = true;
            if ("@#$%^&+=!".indexOf(c) >= 0)
                hasSpecial = true;
        }

        int strength = 0;
        if (hasUpper)
            strength++;
        if (hasLower)
            strength++;
        if (hasDigit)
            strength++;
        if (hasSpecial)
            strength++;
        if (password.length() >= 12)
            strength++;

        if (strength >= 5)
            return PasswordStrength.VERY_STRONG;
        if (strength >= 4)
            return PasswordStrength.STRONG;
        if (strength >= 3)
            return PasswordStrength.MEDIUM;
        return PasswordStrength.WEAK;
    }

    // Enum para fortaleza de contraseña
    public enum PasswordStrength {
        WEAK, MEDIUM, STRONG, VERY_STRONG
    }

    // Método para generar tokens CSRF (para usar en la fase 2 con frontend)
    public static String generateCsrfToken() {
        return java.util.UUID.randomUUID().toString();
    }

    // Método para validar tokens CSRF
    public static boolean isValidCsrfToken(String token) {
        if (token == null || token.length() != 36) {
            return false;
        }

        try {
            java.util.UUID.fromString(token);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}