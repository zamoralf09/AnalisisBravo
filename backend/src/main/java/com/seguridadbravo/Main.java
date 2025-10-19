package com.seguridadbravo;

import com.seguridadbravo.seguridadbravobackend.config.DatabaseConfig;
import com.seguridadbravo.seguridadbravobackend.config.SecurityConfig;
import com.seguridadbravo.seguridadbravobackend.controllers.AuthController;
import com.seguridadbravo.seguridadbravobackend.controllers.UserController;
import com.seguridadbravo.seguridadbravobackend.filters.AuthFilter;
import static spark.Spark.*;

public class Main {
    public static void main(String[] args) {
        // Configuración inicial
        port(4567);
        init();
        
        // Inicializar base de datos
        DatabaseConfig.initializeDatabase();
        
        // Configurar CORS manualmente
        enableCORS();
        
        // Configurar manejo de excepciones
        configureExceptionHandling();
        
        // Rutas de autenticación (públicas)
        configureAuthRoutes();
        
        // Rutas de usuarios (protegidas)
        configureUserRoutes();
        
        // Rutas de catálogos (protegidas)
        configureCatalogRoutes();






        /* 
        // Rutas de perfil (protegidas)
        configureProfileRoutes();
        */




        
        // Ruta de verificación de salud del servidor
        configureHealthCheck();
        
        // Mensaje de inicio
        printStartupMessage();
    }
    
    // Configuración manual de CORS
    private static void enableCORS() {
        options("/*", (request, response) -> {
            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }
            
            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }
            
            return "OK";
        });
        
        before((request, response) -> {
            response.header("Access-Control-Allow-Origin", "http://localhost:3000");
            response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, X-Requested-With");
            response.header("Access-Control-Allow-Credentials", "true");
            response.type("application/json");
            
            // Aplicar headers de seguridad
            SecurityConfig.applySecurityHeaders(response);
            
            // No procesar solicitudes OPTIONS como rutas normales
            if (request.requestMethod().equals("OPTIONS")) {
                response.status(200);
                halt();
            }
        });
    }
    
    // Configurar manejo de excepciones
    private static void configureExceptionHandling() {
        // Manejo de excepciones generales
        exception(Exception.class, (exception, request, response) -> {
            response.status(500);
            response.body("{\"success\": false, \"message\": \"Error interno del servidor: " + 
                         SecurityConfig.sanitizeForXSS(exception.getMessage()) + "\"}");
            System.err.println("❌ Error no manejado: " + exception.getMessage());
            exception.printStackTrace();
        });
        
        // Manejo de excepciones de seguridad
        exception(SecurityException.class, (exception, request, response) -> {
            response.status(400);
            response.body("{\"success\": false, \"message\": \"Error de seguridad: " + 
                         SecurityConfig.sanitizeForXSS(exception.getMessage()) + "\"}");
        });
        
        // Manejo de excepciones de validación
        exception(IllegalArgumentException.class, (exception, request, response) -> {
            response.status(400);
            response.body("{\"success\": false, \"message\": \"Error de validación: " + 
                         SecurityConfig.sanitizeForXSS(exception.getMessage()) + "\"}");
        });
        
        // Manejo de excepciones de autenticación
        exception(com.seguridadbravo.seguridadbravobackend.exceptions.AuthenticationException.class, (exception, request, response) -> {
            response.status(401);
            response.body("{\"success\": false, \"message\": \"Error de autenticación: " + 
                         SecurityConfig.sanitizeForXSS(exception.getMessage()) + "\"}");
        });
        
        // Manejo de excepciones de autorización
        exception(com.seguridadbravo.seguridadbravobackend.exceptions.AuthorizationException.class, (exception, request, response) -> {
            response.status(403);
            response.body("{\"success\": false, \"message\": \"Error de autorización: " + 
                         SecurityConfig.sanitizeForXSS(exception.getMessage()) + "\"}");
        });
    }
    
    // Configurar rutas de autenticación
    private static void configureAuthRoutes() {
        post("/api/auth/login", AuthController::login);
        post("/api/auth/logout", AuthController::logout);
        get("/api/auth/verify", AuthController::verifyToken);
        post("/api/auth/forgot-password", AuthController::forgotPassword);
        post("/api/auth/reset-password", AuthController::resetPassword);
        post("/api/auth/validate-question", AuthController::validateSecurityQuestion);
    }
    
    // Configurar rutas de usuarios
    private static void configureUserRoutes() {
        path("/api/users", () -> {
            before("/*", AuthFilter.requireAuth);
            
            // Rutas básicas de CRUD
            get("", UserController::getAllUsers);
            post("", UserController::createUser);
            get("/:id", UserController::getUserById);
            put("/:id", UserController::updateUser);
            delete("/:id", UserController::deleteUser);
            
            // Rutas de gestión de contraseñas
            put("/:id/password", UserController::updatePassword);
            put("/:id/reset-password", UserController::resetPassword);
            
            // Rutas de gestión de estado
            put("/:id/status", UserController::changeStatus);
            
            // Rutas adicionales
            get("/:id/activity", UserController::getUserActivity);
            get("/:id/permissions", UserController::getUserPermissions);
        });
    }
    
    // Configurar rutas de catálogos
    private static void configureCatalogRoutes() {
        path("/api/catalogos", () -> {
            before("/*", AuthFilter.requireAuth);
            
            get("", UserController::getCatalogos);
            get("/roles", UserController::getCatalogos);
            get("/status", UserController::getCatalogos);
            get("/generos", UserController::getCatalogos);
            get("/sucursales", UserController::getCatalogos);
        });
    }



    /*
    // Configurar rutas de perfil
    private static void configureProfileRoutes() {
        path("/api/profile", () -> {
            before("/*", AuthFilter::requireAuth);
            
            get("", UserController::getMyProfile);
            put("", UserController::updateMyProfile);
            put("/password", UserController::updateMyPassword);
            put("/avatar", UserController::updateMyAvatar);
        });
    }*/


    
    
    // Configurar verificación de salud
    private static void configureHealthCheck() {
        get("/api/health", (req, res) -> {
            res.type("application/json");
            return "{\"status\": \"OK\", \"timestamp\": \"" + java.time.LocalDateTime.now() + 
                   "\", \"service\": \"Sistema de Seguridad Bravo\", \"version\": \"1.0.0\"}";
        });
        
        get("/api/health/database", (req, res) -> {
            res.type("application/json");
            try {
                DatabaseConfig.getConnection().close();
                return "{\"status\": \"OK\", \"database\": \"Conectado correctamente\"}";
            } catch (Exception e) {
                res.status(500);
                return "{\"status\": \"ERROR\", \"database\": \"Error de conexión: " + e.getMessage() + "\"}";
            }
        });
    }
    
    // Mensaje de inicio
    private static void printStartupMessage() {
        System.out.println("==========================================");
        System.out.println("🚀 SISTEMA DE SEGURIDAD BRAVO - BACKEND");
        System.out.println("==========================================");
        System.out.println();
        System.out.println("✅ Servidor iniciado correctamente");
        System.out.println("📍 Puerto: 4567");
        System.out.println("🌐 Entorno: Desarrollo");
        System.out.println("🗄️  Base de datos: ProyectoAnalisis");
        System.out.println();
        System.out.println("📊 ENDPOINTS DISPONIBLES:");
        System.out.println();
        System.out.println("🔐 AUTENTICACIÓN:");
        System.out.println("   POST   http://localhost:4567/api/auth/login");
        System.out.println("   POST   http://localhost:4567/api/auth/logout");
        System.out.println("   GET    http://localhost:4567/api/auth/verify");
        System.out.println("   POST   http://localhost:4567/api/auth/forgot-password");
        System.out.println("   POST   http://localhost:4567/api/auth/reset-password");
        System.out.println();
        System.out.println("👥 USUARIOS:");
        System.out.println("   GET    http://localhost:4567/api/users");
        System.out.println("   POST   http://localhost:4567/api/users");
        System.out.println("   GET    http://localhost:4567/api/users/:id");
        System.out.println("   PUT    http://localhost:4567/api/users/:id");
        System.out.println("   DELETE http://localhost:4567/api/users/:id");
        System.out.println("   PUT    http://localhost:4567/api/users/:id/password");
        System.out.println("   PUT    http://localhost:4567/api/users/:id/reset-password");
        System.out.println("   PUT    http://localhost:4567/api/users/:id/status");
        System.out.println();
        System.out.println("📋 CATÁLOGOS:");
        System.out.println("   GET    http://localhost:4567/api/catalogos");
        System.out.println("   GET    http://localhost:4567/api/catalogos/roles");
        System.out.println("   GET    http://localhost:4567/api/catalogos/status");
        System.out.println("   GET    http://localhost:4567/api/catalogos/generos");
        System.out.println("   GET    http://localhost:4567/api/catalogos/sucursales");
        System.out.println();
        System.out.println("👤 PERFIL:");
        System.out.println("   GET    http://localhost:4567/api/profile");
        System.out.println("   PUT    http://localhost:4567/api/profile");
        System.out.println("   PUT    http://localhost:4567/api/profile/password");
        System.out.println("   PUT    http://localhost:4567/api/profile/avatar");
        System.out.println();
        System.out.println("🏥 HEALTH CHECK:");
        System.out.println("   GET    http://localhost:4567/api/health");
        System.out.println("   GET    http://localhost:4567/api/health/database");
        System.out.println();
        System.out.println("🔒 SEGURIDAD:");
        System.out.println("   - CORS habilitado para: http://localhost:3000");
        System.out.println("   - Autenticación JWT requerida");
        System.out.println("   - Headers de seguridad aplicados");
        System.out.println();
        System.out.println("💡 CREDENCIALES DE PRUEBA:");
        System.out.println("   Usuario: Administrador");
        System.out.println("   Contraseña: ITAdmin");
        System.out.println();
        System.out.println("==========================================");
    }
    
    // Método para detener el servidor gracefulmente
    public static void stopServer() {
        stop();
        System.out.println("🛑 Servidor detenido correctamente");
    }
    
    // Método para obtener información del servidor
    public static String getServerInfo() {
        return "Sistema de Seguridad Bravo - Puerto: 4567 - Estado: Activo";
    }
}