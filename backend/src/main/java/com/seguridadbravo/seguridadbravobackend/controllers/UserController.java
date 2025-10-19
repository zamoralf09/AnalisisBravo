package com.seguridadbravo.seguridadbravobackend.controllers;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import com.seguridadbravo.seguridadbravobackend.config.SecurityConfig;
import com.seguridadbravo.seguridadbravobackend.dao.GeneroDAO;
import com.seguridadbravo.seguridadbravobackend.dao.RoleDAO;
import com.seguridadbravo.seguridadbravobackend.dao.StatusUsuarioDAO;
import com.seguridadbravo.seguridadbravobackend.dao.SucursalDAO;
import com.seguridadbravo.seguridadbravobackend.models.Usuario;
import com.seguridadbravo.seguridadbravobackend.services.UserService;

import spark.Request;
import spark.Response;

public class UserController {
    private static final Gson gson = new Gson();
    private static final UserService userService = new UserService();
    private static final RoleDAO roleDAO = new RoleDAO();
    private static final StatusUsuarioDAO statusDAO = new StatusUsuarioDAO();
    private static final GeneroDAO generoDAO = new GeneroDAO();
    private static final SucursalDAO sucursalDAO = new SucursalDAO();

    public static Object createUser(Request request, Response response) {
        try {
            Map<String, Object> requestBody = gson.fromJson(request.body(), HashMap.class);

            // Validar y sanitizar entrada
            String correoElectronico = SecurityConfig.validateAndSanitizeInput(
                    (String) requestBody.get("correoElectronico"), SecurityConfig.InputType.EMAIL);

            // Crear objeto User
            Usuario user = new Usuario();
            user.setCorreoElectronico(correoElectronico);

            // Campos opcionales con valores por defecto
            user.setIdStatusUsuario(1); // Activo por defecto
            user.setIdSucursal(1); // Sucursal por defecto
            user.setIdRole(2); // Role por defecto (Sin Opciones)
            user.setRequiereCambiarPassword(1); // Requiere cambiar password

            // Campos opcionales desde request
            if (requestBody.containsKey("fechaNacimiento")) {
                user.setFechaNacimiento(java.time.LocalDate.parse((String) requestBody.get("fechaNacimiento")));
            }

            if (requestBody.containsKey("idStatusUsuario")) {
                user.setIdStatusUsuario(Integer.parseInt(requestBody.get("idStatusUsuario").toString()));
            }

            if (requestBody.containsKey("idGenero")) {
                user.setIdGenero(Integer.parseInt(requestBody.get("idGenero").toString()));
            }

            if (requestBody.containsKey("telefonoMovil")) {
                user.setTelefonoMovil(SecurityConfig.validateAndSanitizeInput(
                        (String) requestBody.get("telefonoMovil"), SecurityConfig.InputType.GENERAL_TEXT));
            }

            if (requestBody.containsKey("idSucursal")) {
                user.setIdSucursal(Integer.parseInt(requestBody.get("idSucursal").toString()));
            }

            if (requestBody.containsKey("idRole")) {
                user.setIdRole(Integer.parseInt(requestBody.get("idRole").toString()));
            }

            if (requestBody.containsKey("pregunta")) {
                user.setPregunta(SecurityConfig.validateAndSanitizeInput(
                        (String) requestBody.get("pregunta"), SecurityConfig.InputType.GENERAL_TEXT));
            }

            if (requestBody.containsKey("respuesta")) {
                user.setRespuesta(SecurityConfig.validateAndSanitizeInput(
                        (String) requestBody.get("respuesta"), SecurityConfig.InputType.GENERAL_TEXT));
            }

            // Procesar imagen
            if (requestBody.containsKey("fotografiaBase64")) {
                String fotoBase64 = (String) requestBody.get("fotografiaBase64");
                if (fotoBase64 != null && !fotoBase64.isEmpty()) {
                    if (fotoBase64.contains(",")) {
                        fotoBase64 = fotoBase64.split(",")[1];
                    }
                    user.setFotografia(Base64.getDecoder().decode(fotoBase64));
                }
            }

            Usuario createdUser = userService.createUser(user);
            createdUser.setPassword(null);

            response.status(201);
            response.type("application/json");
            return gson.toJson(createdUser);
        } catch (RuntimeException e) {
            response.status(400);
            return createErrorResponse("Error: " + e.getMessage());
        }
    }

    public static Object getAllUsers(Request request, Response response) {
        try {
            List<Usuario> users = userService.getAllUsers();
            for (Usuario user : users) {
                user.setPassword(null);
            }

            response.status(200);
            response.type("application/json");
            return gson.toJson(users);
        } catch (Exception e) {
            response.status(500);
            return createErrorResponse("Error al obtener usuarios: " + e.getMessage());
        }
    }

    public static Object getUserById(Request request, Response response) {
        try {
            String correoElectronico = request.params(":email");
            Usuario user = userService.getUserByEmail(correoElectronico);

            if (user != null) {
                user.setPassword(null);
                response.status(200);
                response.type("application/json");
                return gson.toJson(user);
            } else {
                response.status(404);
                return createErrorResponse("Usuario no encontrado");
            }
        } catch (Exception e) {
            response.status(500);
            return createErrorResponse("Error al obtener usuario: " + e.getMessage());
        }
    }

    public static Object updateUser(Request request, Response response) {
        try {
            String correoElectronico = request.params(":email");
            Usuario existingUser = userService.getUserByEmail(correoElectronico);

            if (existingUser == null) {
                response.status(404);
                return createErrorResponse("Usuario no encontrado");
            }

            Map<String, Object> requestBody = gson.fromJson(request.body(), HashMap.class);

            // Actualizar campos
            if (requestBody.containsKey("nombre")) {
                existingUser.setNombre(SecurityConfig.validateAndSanitizeInput(
                        (String) requestBody.get("nombre"), SecurityConfig.InputType.NAME));
            }

            if (requestBody.containsKey("apellido")) {
                existingUser.setApellido(SecurityConfig.validateAndSanitizeInput(
                        (String) requestBody.get("apellido"), SecurityConfig.InputType.NAME));
            }

            if (requestBody.containsKey("correoElectronico")) {
                existingUser.setCorreoElectronico(SecurityConfig.validateAndSanitizeInput(
                        (String) requestBody.get("correoElectronico"), SecurityConfig.InputType.EMAIL));
            }

            if (requestBody.containsKey("fechaNacimiento")) {
                existingUser.setFechaNacimiento(java.time.LocalDate.parse((String) requestBody.get("fechaNacimiento")));
            }

            if (requestBody.containsKey("idStatusUsuario")) {
                existingUser.setIdStatusUsuario(Integer.parseInt(requestBody.get("idStatusUsuario").toString()));
            }

            if (requestBody.containsKey("idGenero")) {
                existingUser.setIdGenero(Integer.parseInt(requestBody.get("idGenero").toString()));
            }

            if (requestBody.containsKey("telefonoMovil")) {
                existingUser.setTelefonoMovil(SecurityConfig.validateAndSanitizeInput(
                        (String) requestBody.get("telefonoMovil"), SecurityConfig.InputType.GENERAL_TEXT));
            }

            if (requestBody.containsKey("idSucursal")) {
                existingUser.setIdSucursal(Integer.parseInt(requestBody.get("idSucursal").toString()));
            }

            if (requestBody.containsKey("idRole")) {
                existingUser.setIdRole(Integer.parseInt(requestBody.get("idRole").toString()));
            }

            if (requestBody.containsKey("pregunta")) {
                existingUser.setPregunta(SecurityConfig.validateAndSanitizeInput(
                        (String) requestBody.get("pregunta"), SecurityConfig.InputType.GENERAL_TEXT));
            }

            if (requestBody.containsKey("respuesta")) {
                existingUser.setRespuesta(SecurityConfig.validateAndSanitizeInput(
                        (String) requestBody.get("respuesta"), SecurityConfig.InputType.GENERAL_TEXT));
            }

            // Procesar imagen
            if (requestBody.containsKey("fotografiaBase64")) {
                String fotoBase64 = (String) requestBody.get("fotografiaBase64");
                if (fotoBase64 != null && !fotoBase64.isEmpty()) {
                    if (fotoBase64.contains(",")) {
                        fotoBase64 = fotoBase64.split(",")[1];
                    }
                    existingUser.setFotografia(Base64.getDecoder().decode(fotoBase64));
                }
            }

            String currentUser = request.attribute("correoElectronico");
            existingUser.setUsuarioModificacion(currentUser);

            boolean success = userService.updateUser(existingUser);

            if (success) {
                response.status(200);
                return createSuccessResponse("Usuario actualizado exitosamente");
            } else {
                response.status(500);
                return createErrorResponse("Error al actualizar usuario");
            }
        } catch (RuntimeException e) {
            response.status(400);
            return createErrorResponse("Error: " + e.getMessage());
        } catch (Exception e) {
            response.status(500);
            return createErrorResponse("Error al actualizar usuario: " + e.getMessage());
        }
    }

    public static Object deleteUser(Request request, Response response) {
        try {
            String correoElectronico = request.params(":email");
            Usuario existingUser = userService.getUserByEmail(correoElectronico);

            if (existingUser == null) {
                response.status(404);
                return createErrorResponse("Usuario no encontrado");
            }

            if ("system".equals(correoElectronico) || "Administrador".equals(correoElectronico)) {
                response.status(400);
                return createErrorResponse("No se puede eliminar usuarios del sistema");
            }

            boolean success = userService.deleteUser(correoElectronico);

            if (success) {
                response.status(200);
                return createSuccessResponse("Usuario eliminado exitosamente");
            } else {
                response.status(500);
                return createErrorResponse("Error al eliminar usuario");
            }
        } catch (Exception e) {
            response.status(500);
            return createErrorResponse("Error al eliminar usuario: " + e.getMessage());
        }
    }

    public static Object updatePassword(Request request, Response response) {
        try {
            String correoElectronico = request.params(":email");
            Usuario existingUser = userService.getUserByEmail(correoElectronico);

            if (existingUser == null) {
                response.status(404);
                return createErrorResponse("Usuario no encontrado");
            }

            Map<String, String> requestBody = gson.fromJson(request.body(), HashMap.class);
            String currentPassword = SecurityConfig.validateAndSanitizeInput(
                    requestBody.get("currentPassword"), SecurityConfig.InputType.PASSWORD);
            String newPassword = SecurityConfig.validateAndSanitizeInput(
                    requestBody.get("newPassword"), SecurityConfig.InputType.PASSWORD);

            boolean success = userService.updatePassword(correoElectronico, currentPassword, newPassword);

            if (success) {
                response.status(200);
                return createSuccessResponse("Contraseña actualizada exitosamente");
            } else {
                response.status(400);
                return createErrorResponse("Error al actualizar contraseña");
            }
        } catch (SecurityException e) {
            response.status(400);
            return createErrorResponse("Error de seguridad: " + e.getMessage());
        } catch (Exception e) {
            response.status(500);
            return createErrorResponse(e.getMessage());
        }
    }

    public static Object resetPassword(Request request, Response response) {
        try {
            String correoElectronico = request.params(":email");
            Usuario existingUser = userService.getUserByEmail(correoElectronico);

            if (existingUser == null) {
                response.status(404);
                return createErrorResponse("Usuario no encontrado");
            }

            Map<String, String> requestBody = gson.fromJson(request.body(), HashMap.class);
            String newPassword = SecurityConfig.validateAndSanitizeInput(
                    requestBody.get("newPassword"), SecurityConfig.InputType.PASSWORD);

            boolean success = userService.resetPassword(correoElectronico, newPassword);

            if (success) {
                response.status(200);
                return createSuccessResponse("Contraseña restablecida exitosamente");
            } else {
                response.status(400);
                return createErrorResponse("Error al restablecer contraseña");
            }
        } catch (SecurityException e) {
            response.status(400);
            return createErrorResponse("Error de seguridad: " + e.getMessage());
        } catch (Exception e) {
            response.status(500);
            return createErrorResponse(e.getMessage());
        }
    }

    public static Object changeStatus(Request request, Response response) {
        try {
            String correoElectronico = request.params(":email");
            Usuario existingUser = userService.getUserByEmail(correoElectronico);

            if (existingUser == null) {
                response.status(404);
                return createErrorResponse("Usuario no encontrado");
            }

            Map<String, String> requestBody = gson.fromJson(request.body(), HashMap.class);
            String action = SecurityConfig.validateAndSanitizeInput(
                    requestBody.get("action"), SecurityConfig.InputType.GENERAL_TEXT);

            switch (action.toUpperCase()) {
                case "ACTIVATE":
                    if (userService.activateUser(correoElectronico)) {
                        response.status(200);
                        return createSuccessResponse("Usuario activado exitosamente");
                    }
                    break;
                case "INACTIVATE":
                    if (userService.inactivateUser(correoElectronico)) {
                        response.status(200);
                        return createSuccessResponse("Usuario inactivado exitosamente");
                    }
                    break;
                case "BLOCK":
                    if (userService.blockUser(correoElectronico)) {
                        response.status(200);
                        return createSuccessResponse("Usuario bloqueado exitosamente");
                    }
                    break;
                default:
                    response.status(400);
                    return createErrorResponse("Acción no válida. Use: ACTIVATE, INACTIVATE o BLOCK");
            }

            response.status(500);
            return createErrorResponse("Error al cambiar estado del usuario");
        } catch (RuntimeException e) {
            response.status(400);
            return createErrorResponse("Error al cambiar estado: " + e.getMessage());
        }
    }

    public static Object getCatalogos(Request request, Response response) {
        try {
            Map<String, Object> catalogos = new HashMap<>();
            catalogos.put("roles", roleDAO.getAllRoles());
            catalogos.put("status", statusDAO.getAllStatus());
            catalogos.put("generos", generoDAO.getAllGeneros());
            catalogos.put("sucursales", sucursalDAO.getAllSucursales());

            response.status(200);
            response.type("application/json");
            return gson.toJson(catalogos);
        } catch (Exception e) {
            response.status(500);
            return createErrorResponse("Error al obtener catálogos: " + e.getMessage());
        }
    }

    public static Object getMyProfile(Request request, Response response) {
        try {
            String email = request.attribute("email");
            Usuario user = userService.getUserByEmail(email);

            if (user != null) {
                user.setPassword(null);
                response.status(200);
                response.type("application/json");
                return gson.toJson(user);
            } else {
                response.status(404);
                return createErrorResponse("Usuario no encontrado");
            }
        } catch (Exception e) {
            response.status(500);
            return createErrorResponse("Error al obtener perfil: " + e.getMessage());
        }
    }

    public static Object updateMyProfile(Request request, Response response) {
        try {
            String email = request.attribute("email");
            Usuario existingUser = userService.getUserByEmail(email);

            if (existingUser == null) {
                response.status(404);
                return createErrorResponse("Usuario no encontrado");
            }

            Map<String, Object> requestBody = gson.fromJson(request.body(), HashMap.class);

            // Actualizar campos permitidos para perfil propio
            if (requestBody.containsKey("nombre")) {
                existingUser.setNombre(SecurityConfig.validateAndSanitizeInput(
                        (String) requestBody.get("nombre"), SecurityConfig.InputType.NAME));
            }

            if (requestBody.containsKey("apellido")) {
                existingUser.setApellido(SecurityConfig.validateAndSanitizeInput(
                        (String) requestBody.get("apellido"), SecurityConfig.InputType.NAME));
            }

            if (requestBody.containsKey("correoElectronico")) {
                existingUser.setCorreoElectronico(SecurityConfig.validateAndSanitizeInput(
                        (String) requestBody.get("correoElectronico"), SecurityConfig.InputType.EMAIL));
            }

            if (requestBody.containsKey("fechaNacimiento")) {
                existingUser.setFechaNacimiento(java.time.LocalDate.parse((String) requestBody.get("fechaNacimiento")));
            }

            if (requestBody.containsKey("telefonoMovil")) {
                existingUser.setTelefonoMovil(SecurityConfig.validateAndSanitizeInput(
                        (String) requestBody.get("telefonoMovil"), SecurityConfig.InputType.GENERAL_TEXT));
            }

            // Procesar imagen
            if (requestBody.containsKey("fotografiaBase64")) {
                String fotoBase64 = (String) requestBody.get("fotografiaBase64");
                if (fotoBase64 != null && !fotoBase64.isEmpty()) {
                    if (fotoBase64.contains(",")) {
                        fotoBase64 = fotoBase64.split(",")[1];
                    }
                    existingUser.setFotografia(Base64.getDecoder().decode(fotoBase64));
                }
            }

            existingUser.setUsuarioModificacion(email);

            boolean success = userService.updateUser(existingUser);

            if (success) {
                response.status(200);
                return createSuccessResponse("Perfil actualizado exitosamente");
            } else {
                response.status(500);
                return createErrorResponse("Error al actualizar perfil");
            }
        } catch (SecurityException e) {
            response.status(400);
            return createErrorResponse("Error de seguridad: " + e.getMessage());
        } catch (Exception e) {
            response.status(500);
            return createErrorResponse("Error al actualizar perfil: " + e.getMessage());
        }
    }

    public static Object updateMyPassword(Request request, Response response) {
        try {
            String username = request.attribute("username");

            Map<String, String> requestBody = gson.fromJson(request.body(), HashMap.class);
            String currentPassword = SecurityConfig.validateAndSanitizeInput(
                    requestBody.get("currentPassword"), SecurityConfig.InputType.PASSWORD);
            String newPassword = SecurityConfig.validateAndSanitizeInput(
                    requestBody.get("newPassword"), SecurityConfig.InputType.PASSWORD);

            boolean success = userService.updatePassword(username, currentPassword, newPassword);

            if (success) {
                response.status(200);
                return createSuccessResponse("Contraseña actualizada exitosamente");
            } else {
                response.status(400);
                return createErrorResponse("Error al actualizar contraseña");
            }
        } catch (SecurityException e) {
            response.status(400);
            return createErrorResponse("Error de seguridad: " + e.getMessage());
        } catch (Exception e) {
            response.status(500);
            return createErrorResponse(e.getMessage());
        }
    }

    public static Object getUserActivity(Request request, Response response) {
        try {
            // TODO: Implementar obtención de actividad
            List<Map<String, Object>> actividad = new java.util.ArrayList<>();

            response.status(200);
            response.type("application/json");
            return gson.toJson(actividad);
        } catch (Exception e) {
            response.status(500);
            return createErrorResponse("Error al obtener actividad: " + e.getMessage());
        }
    }

    public static Object getUserPermissions(Request request, Response response) {
        try {
            // TODO: Implementar obtención de permisos
            List<Map<String, Object>> permisos = new java.util.ArrayList<>();

            response.status(200);
            response.type("application/json");
            return gson.toJson(permisos);
        } catch (Exception e) {
            response.status(500);
            return createErrorResponse("Error al obtener permisos: " + e.getMessage());
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