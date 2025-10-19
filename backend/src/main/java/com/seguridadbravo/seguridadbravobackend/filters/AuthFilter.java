package com.seguridadbravo.seguridadbravobackend.filters;

import com.seguridadbravo.seguridadbravobackend.services.AuthService;
import spark.Filter;
import spark.Request;
import spark.Response;

public class AuthFilter {
    private static final AuthService authService = new AuthService();
    
    public static Filter requireAuth = (Request request, Response response) -> {
        String authHeader = request.headers("Authorization");
        
        if (authHeader == null) {
            response.status(401);
            response.body("{\"success\": false, \"message\": \"Token de autenticación requerido\"}");
            response.type("application/json");
            spark.Spark.halt(); // Usar halt() estático de Spark
            return;
        }
        
        if (!authHeader.startsWith("Bearer ")) {
            response.status(401);
            response.body("{\"success\": false, \"message\": \"Formato de token inválido. Use: Bearer <token>\"}");
            response.type("application/json");
            spark.Spark.halt();
            return;
        }
        
        String token = authHeader.substring(7);
        
        if (token.isEmpty()) {
            response.status(401);
            response.body("{\"success\": false, \"message\": \"Token vacío\"}");
            response.type("application/json");
            spark.Spark.halt();
            return;
        }
        
        if (!authService.validateToken(token)) {
            response.status(401);
            response.body("{\"success\": false, \"message\": \"Token inválido o expirado\"}");
            response.type("application/json");
            spark.Spark.halt();
            return;
        }
        
        // Agregar información del usuario a la solicitud para uso posterior
        String username = authService.getUsernameFromToken(token);
        if (username == null) {
            response.status(401);
            response.body("{\"success\": false, \"message\": \"No se pudo extraer información del token\"}");
            response.type("application/json");
            spark.Spark.halt();
            return;
        }
        
        request.attribute("username", username);
        request.attribute("token", token);
    };
    
    public static Filter requireAdmin = (Request request, Response response) -> {
        // Primero verificar autenticación
        requireAuth.handle(request, response);
        
        // Si hay un error de autenticación, ya se habrá enviado la respuesta
        if (response.status() != 200) {
            return;
        }
        
        // Verificar si es administrador
        String username = request.attribute("username");
        
        // Por ahora, solo verificamos si es el usuario admin
        // En una implementación real, consultaríamos la base de datos para los roles
        if (!"admin".equals(username)) {
            response.status(403);
            response.body("{\"success\": false, \"message\": \"Se requieren privilegios de administrador\"}");
            response.type("application/json");
            spark.Spark.halt();
        }
    };
}