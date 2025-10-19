package com.seguridadbravo.seguridadbravobackend.services;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.seguridadbravo.seguridadbravobackend.dao.UserDAO;
import com.seguridadbravo.seguridadbravobackend.models.Usuario;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

public class AuthService {
    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private static final long EXPIRATION_TIME = 86400000; // 24 horas

    private UserDAO userDAO = new UserDAO();

    public Map<String, Object> authenticate(String email, String password, String ipAddress, String userAgent) {
        Map<String, Object> result = new HashMap<>();

        Usuario user = userDAO.getUserByEmail(email);
        if (user == null) {
            result.put("success", false);
            result.put("message", "Usuario no encontrado");
            return result;
        }

        // Verificar si el usuario está activo (1 = Activo)
        if (user.getIdStatusUsuario() != 1) {
            result.put("success", false);
            result.put("message", "Usuario inactivo o bloqueado");
            return result;
        }

        // Verificar contraseña (MD5 en la base de datos)
        String hashedPassword = md5(password);
        boolean passwordCorrect = hashedPassword.equals(user.getPassword());

        if (passwordCorrect) {
            userDAO.resetFailedAttempts(user.getCorreoElectronico());

            userDAO.updateLastLogin(user.getCorreoElectronico());

            String token = generateToken(user);

            result.put("success", true);
            result.put("token", token);
            result.put("user", user);

        } else {
            // Incrementar intentos fallidos
            userDAO.incrementFailedAttempts(email);

            if (user.getIntentosDeAcceso() + 1 >= 5) {
                userDAO.blockUser(email);
                result.put("message", "Cuenta bloqueada por demasiados intentos fallidos");
            } else {
                result.put("message",
                        "Credenciales incorrectas. Intentos restantes: " + (5 - (user.getIntentosDeAcceso() + 1)));
            }

            result.put("success", false);
        }

        return result;
    }

    private String generateToken(Usuario user) {
        return Jwts.builder()
                .setSubject(user.getIdUsuario())
                .claim("userId", user.getIdUsuario())
                .claim("nombre", user.getNombre())
                .claim("role", user.getIdRole())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            return null;
        }
    }

    // Método MD5 para compatibilidad con tu base de datos
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
            return null;
        }
    }
}