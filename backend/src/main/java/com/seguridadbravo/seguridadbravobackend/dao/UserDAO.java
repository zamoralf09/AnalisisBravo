package com.seguridadbravo.seguridadbravobackend.dao;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import com.seguridadbravo.seguridadbravobackend.config.DatabaseConfig;
import com.seguridadbravo.seguridadbravobackend.models.Usuario;

public class UserDAO {

    public Usuario getUserByEmail(String email) {
        String sql = "SELECT u.*, s.Nombre as nombreStatus, g.Nombre as nombreGenero, " +
                "su.Nombre as nombreSucursal, r.Nombre as nombreRole " +
                "FROM USUARIO u " +
                "LEFT JOIN STATUS_USUARIO s ON u.IdStatusUsuario = s.IdStatusUsuario " +
                "LEFT JOIN GENERO g ON u.IdGenero = g.IdGenero " +
                "LEFT JOIN SUCURSAL su ON u.IdSucursal = su.IdSucursal " +
                "LEFT JOIN ROLE r ON u.IdRole = r.IdRole " +
                "WHERE u.CorreoElectronico = ?";

        try (Connection conn = DatabaseConfig.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, email);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                return mapResultSetToUser(rs);
            }
        } catch (SQLException e) {
            System.err.println("Error getting user by email: " + e.getMessage());
        }

        return null;
    }

    public List<Usuario> getAllUsers() {
        List<Usuario> users = new ArrayList<>();
        String sql = "SELECT u.*, s.Nombre as nombreStatus, g.Nombre as nombreGenero, " +
                "su.Nombre as nombreSucursal, r.Nombre as nombreRole " +
                "FROM USUARIO u " +
                "LEFT JOIN STATUS_USUARIO s ON u.IdStatusUsuario = s.IdStatusUsuario " +
                "LEFT JOIN GENERO g ON u.IdGenero = g.IdGenero " +
                "LEFT JOIN SUCURSAL su ON u.IdSucursal = su.IdSucursal " +
                "LEFT JOIN ROLE r ON u.IdRole = r.IdRole " +
                "ORDER BY u.Nombre, u.Apellido";

        try (Connection conn = DatabaseConfig.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                users.add(mapResultSetToUser(rs));
            }
        } catch (SQLException e) {
            System.err.println("Error getting all users: " + e.getMessage());
        }

        return users;
    }

    public boolean updateUser(Usuario user) {
        String sql = "UPDATE USUARIO SET Nombre = ?, Apellido = ?, FechaNacimiento = ?, " +
                "IdStatusUsuario = ?, IdGenero = ?, CorreoElectronico = ?, " +
                "TelefonoMovil = ?, IdSucursal = ?, IdRole = ?, " +
                "FechaModificacion = NOW(), UsuarioModificacion = ? " +
                "WHERE IdUsuario = ?";

        try (Connection conn = DatabaseConfig.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, user.getNombre());
            pstmt.setString(2, user.getApellido());
            pstmt.setDate(3, Date.valueOf(user.getFechaNacimiento()));
            pstmt.setInt(4, user.getIdStatusUsuario());
            pstmt.setInt(5, user.getIdGenero());
            pstmt.setString(6, user.getCorreoElectronico());
            pstmt.setString(7, user.getTelefonoMovil());
            pstmt.setInt(8, user.getIdSucursal());
            pstmt.setInt(9, user.getIdRole());
            pstmt.setString(10, user.getUsuarioModificacion());
            pstmt.setString(11, user.getIdUsuario());

            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Error updating user: " + e.getMessage());
        }

        return false;
    }

    public boolean updatePassword(String email, String newPassword) {
        String sql = "UPDATE USUARIO SET Password = ?, UltimaFechaCambioPassword = NOW(), " +
                "RequiereCambiarPassword = 0 WHERE CorreoElectronico = ?";

        try (Connection conn = DatabaseConfig.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, newPassword);
            pstmt.setString(2, email);

            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Error updating password: " + e.getMessage());
        }

        return false;
    }

    public boolean incrementFailedAttempts(String email) {
        String sql = "UPDATE USUARIO SET IntentosDeAcceso = IntentosDeAcceso + 1 WHERE CorreoElectronico = ?";

        try (Connection conn = DatabaseConfig.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, email);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Error incrementing failed attempts: " + e.getMessage());
        }

        return false;
    }

    public boolean resetFailedAttempts(String email) {
        String sql = "UPDATE USUARIO SET IntentosDeAcceso = 0 WHERE CorreoElectronico = ?";

        try (Connection conn = DatabaseConfig.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, email);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Error resetting failed attempts: " + e.getMessage());
        }

        return false;
    }

    public boolean blockUser(String email) {
        String sql = "UPDATE USUARIO SET IdStatusUsuario = 2 WHERE CorreoElectronico = ?"; // 2 = Bloqueado

        try (Connection conn = DatabaseConfig.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, email);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Error blocking user: " + e.getMessage());
        }

        return false;
    }

    public boolean activateUser(String email) {
        String sql = "UPDATE USUARIO SET IdStatusUsuario = 1, IntentosDeAcceso = 0 WHERE CorreoElectronico = ?"; // 1 =
                                                                                                                 // Activo

        try (Connection conn = DatabaseConfig.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, email);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Error activating user: " + e.getMessage());
        }

        return false;
    }

    public boolean updateLastLogin(String email) {
        String sql = "UPDATE USUARIO SET UltimaFechaIngreso = NOW() WHERE CorreoElectronico = ?";

        try (Connection conn = DatabaseConfig.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, email);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Error updating last login: " + e.getMessage());
        }

        return false;
    }

    private Usuario mapResultSetToUser(ResultSet rs) throws SQLException {
        Usuario user = new Usuario();
        user.setIdUsuario(rs.getString("IdUsuario"));
        user.setNombre(rs.getString("Nombre"));
        user.setApellido(rs.getString("Apellido"));

        Date fechaNacimiento = rs.getDate("FechaNacimiento");
        if (fechaNacimiento != null) {
            user.setFechaNacimiento(fechaNacimiento.toLocalDate());
        }

        user.setIdStatusUsuario(rs.getInt("IdStatusUsuario"));
        user.setPassword(rs.getString("Password"));
        user.setIdGenero(rs.getInt("IdGenero"));

        Timestamp ultimaFechaIngreso = rs.getTimestamp("UltimaFechaIngreso");
        if (ultimaFechaIngreso != null) {
            user.setUltimaFechaIngreso(ultimaFechaIngreso.toLocalDateTime());
        }

        user.setIntentosDeAcceso(rs.getInt("IntentosDeAcceso"));
        user.setSesionActual(rs.getString("SesionActual"));

        Timestamp ultimaFechaCambioPassword = rs.getTimestamp("UltimaFechaCambioPassword");
        if (ultimaFechaCambioPassword != null) {
            user.setUltimaFechaCambioPassword(ultimaFechaCambioPassword.toLocalDateTime());
        }

        user.setCorreoElectronico(rs.getString("CorreoElectronico"));
        user.setRequiereCambiarPassword(rs.getInt("RequiereCambiarPassword"));
        user.setTelefonoMovil(rs.getString("TelefonoMovil"));
        user.setIdSucursal(rs.getInt("IdSucursal"));
        user.setPregunta(rs.getString("Pregunta"));
        user.setRespuesta(rs.getString("Respuesta"));
        user.setIdRole(rs.getInt("IdRole"));

        Timestamp fechaCreacion = rs.getTimestamp("FechaCreacion");
        if (fechaCreacion != null) {
            user.setFechaCreacion(fechaCreacion.toLocalDateTime());
        }

        user.setUsuarioCreacion(rs.getString("UsuarioCreacion"));

        Timestamp fechaModificacion = rs.getTimestamp("FechaModificacion");
        if (fechaModificacion != null) {
            user.setFechaModificacion(fechaModificacion.toLocalDateTime());
        }

        user.setUsuarioModificacion(rs.getString("UsuarioModificacion"));

        // Campos de joins
        user.setNombreStatus(rs.getString("nombreStatus"));
        user.setNombreGenero(rs.getString("nombreGenero"));
        user.setNombreSucursal(rs.getString("nombreSucursal"));
        user.setNombreRole(rs.getString("nombreRole"));

        return user;
    }
}