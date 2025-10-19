package com.seguridadbravo.seguridadbravobackend.controllers;

import java.util.HashMap;
import java.util.Map;

import com.google.gson.Gson;
import com.seguridadbravo.seguridadbravobackend.config.SecurityConfig;
import com.seguridadbravo.seguridadbravobackend.services.AuthService;

import spark.Request;
import spark.Response;

public class AuthController {
    private static final Gson gson = new Gson();
    private static final AuthService authService = new AuthService();

    public static Object login(Request request, Response response) {
        try {
            Map<String, String> requestBody = gson.fromJson(request.body(), HashMap.class);
            String email = SecurityConfig.validateAndSanitizeInput(
                    requestBody.get("email"), SecurityConfig.InputType.EMAIL);
            String password = SecurityConfig.validateAndSanitizeInput(
                    requestBody.get("password"), SecurityConfig.InputType.PASSWORD);

            if (email == null || password == null) {
                response.status(400);
                return createErrorResponse("Email y contraseña son requeridos");
            }

            String ipAddress = request.ip();
            String userAgent = request.userAgent();

            Map<String, Object> authResult = authService.authenticate(email, password, ipAddress, userAgent);

            if ((Boolean) authResult.get("success")) {
                response.status(200);
                response.type("application/json");

                Map<String, Object> responseData = new HashMap<>();
                responseData.put("token", authResult.get("token"));
                responseData.put("user", authResult.get("user"));

                return gson.toJson(responseData);
            } else {
                response.status(401);
                return createErrorResponse((String) authResult.get("message"));
            }
        } catch (SecurityException e) {
            response.status(400);
            return createErrorResponse("Error de seguridad: " + e.getMessage());
        } catch (Exception e) {
            response.status(500);
            return createErrorResponse("Error en el inicio de sesión: " + e.getMessage());
        }
    }

    public static Object logout(Request request, Response response) {
        try {
            // Obtener token del header
            String token = request.headers("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            response.status(200);
            return createSuccessResponse("Sesión cerrada exitosamente");
        } catch (Exception e) {
            response.status(500);
            return createErrorResponse("Error al cerrar sesión: " + e.getMessage());
        }
    }

    public static Object verifyToken(Request request, Response response) {
        try {
            String token = request.headers("Authorization");

            if (token == null || !token.startsWith("Bearer ")) {
                response.status(401);
                return createErrorResponse("Token no proporcionado");
            }

            token = token.substring(7);

            if (authService.validateToken(token)) {
                response.status(200);
                return createSuccessResponse("Token válido");
            } else {
                response.status(401);
                return createErrorResponse("Token inválido o expirado");
            }
        } catch (Exception e) {
            response.status(500);
            return createErrorResponse("Error al verificar token: " + e.getMessage());
        }
    }

    public static Object forgotPassword(Request request, Response response) {
        try {
            Map<String, String> requestBody = gson.fromJson(request.body(), HashMap.class);
            String username = SecurityConfig.validateAndSanitizeInput(
                    requestBody.get("email"), SecurityConfig.InputType.EMAIL);

            if (username == null || username.trim().isEmpty()) {
                response.status(400);
                return createErrorResponse("Usuario es requerido");
            }

            response.status(200);
            return createSuccessResponse("Se ha enviado un correo con instrucciones para recuperar su contraseña");
        } catch (SecurityException e) {
            response.status(400);
            return createErrorResponse("Error de seguridad: " + e.getMessage());
        } catch (Exception e) {
            response.status(500);
            return createErrorResponse("Error en recuperación de contraseña: " + e.getMessage());
        }
    }

    public static Object resetPassword(Request request, Response response) {
        try {
            Map<String, String> requestBody = gson.fromJson(request.body(), HashMap.class);
            String token = SecurityConfig.validateAndSanitizeInput(
                    requestBody.get("token"), SecurityConfig.InputType.GENERAL_TEXT);
            String newPassword = SecurityConfig.validateAndSanitizeInput(
                    requestBody.get("newPassword"), SecurityConfig.InputType.PASSWORD);

            if (token == null || newPassword == null) {
                response.status(400);
                return createErrorResponse("Token y nueva contraseña son requeridos");
            }

            // TODO: Implementar lógica completa de reset
            // 1. Validar token
            // 2. Verificar que no esté expirado
            // 3. Actualizar contraseña
            // 4. Invalidar token

            // Validar fortaleza de la nueva contraseña
            SecurityConfig.PasswordStrength strength = SecurityConfig.checkPasswordStrength(newPassword);
            if (strength == SecurityConfig.PasswordStrength.WEAK) {
                return createErrorResponse("La nueva contraseña no cumple con los requisitos de seguridad");
            }

            response.status(200);
            return createSuccessResponse("Contraseña restablecida exitosamente");
        } catch (SecurityException e) {
            response.status(400);
            return createErrorResponse("Error de seguridad: " + e.getMessage());
        } catch (Exception e) {
            response.status(500);
            return createErrorResponse("Error al restablecer contraseña: " + e.getMessage());
        }
    }

    public static Object validateSecurityQuestion(Request request, Response response) {
        try {
            Map<String, String> requestBody = gson.fromJson(request.body(), HashMap.class);
            String username = SecurityConfig.validateAndSanitizeInput(
                    requestBody.get("email"), SecurityConfig.InputType.EMAIL);
            String respuesta = SecurityConfig.validateAndSanitizeInput(
                    requestBody.get("respuesta"), SecurityConfig.InputType.GENERAL_TEXT);

            if (username == null || respuesta == null) {
                response.status(400);
                return createErrorResponse("Usuario y respuesta son requeridos");
            }

            // TODO: Implementar validación de pregunta de seguridad
            // 1. Obtener usuario y su pregunta/respuesta
            // 2. Comparar respuestas
            // 3. Generar token temporal si es correcta

            response.status(200);
            return createSuccessResponse("Pregunta de seguridad validada correctamente");
        } catch (SecurityException e) {
            response.status(400);
            return createErrorResponse("Error de seguridad: " + e.getMessage());
        } catch (Exception e) {
            response.status(500);
            return createErrorResponse("Error al validar pregunta de seguridad: " + e.getMessage());
        }
    }

    private static String createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", SecurityConfig.sanitizeForXSS(message));
        return gson.toJson(response);
    }

    private static String createSuccessResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", SecurityConfig.sanitizeForXSS(message));
        return gson.toJson(response);
    }
}