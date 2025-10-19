package com.seguridadbravo.seguridadbravobackend.dao;

import com.seguridadbravo.seguridadbravobackend.config.DatabaseConfig;
import com.seguridadbravo.seguridadbravobackend.models.Role;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class RoleDAO {
    
    public List<Role> getAllRoles() {
        List<Role> roles = new ArrayList<>();
        String sql = "SELECT * FROM ROLE ORDER BY Nombre";
        
        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                Role role = new Role();
                role.setIdRole(rs.getInt("IdRole"));
                role.setNombre(rs.getString("Nombre"));
                
                // Campos de auditoría si los necesitas
                Timestamp fechaCreacion = rs.getTimestamp("FechaCreacion");
                if (fechaCreacion != null) {
                    role.setFechaCreacion(fechaCreacion.toLocalDateTime());
                }
                
                role.setUsuarioCreacion(rs.getString("UsuarioCreacion"));
                
                roles.add(role);
            }
        } catch (SQLException e) {
            System.err.println("Error getting all roles: " + e.getMessage());
        }
        
        return roles;
    }
    
    public Role getRoleById(int idRole) {
        String sql = "SELECT * FROM ROLE WHERE IdRole = ?";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, idRole);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                Role role = new Role();
                role.setIdRole(rs.getInt("IdRole"));
                role.setNombre(rs.getString("Nombre"));
                return role;
            }
        } catch (SQLException e) {
            System.err.println("Error getting role by ID: " + e.getMessage());
        }
        
        return null;
    }
    
    public List<Role> getRolesByUserId(String idUsuario) {
        List<Role> roles = new ArrayList<>();
        String sql = "SELECT r.* FROM ROLE r " +
                     "INNER JOIN USUARIO u ON r.IdRole = u.IdRole " +
                     "WHERE u.IdUsuario = ?";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, idUsuario);
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                Role role = new Role();
                role.setIdRole(rs.getInt("IdRole"));
                role.setNombre(rs.getString("Nombre"));
                roles.add(role);
            }
        } catch (SQLException e) {
            System.err.println("Error getting roles by user ID: " + e.getMessage());
        }
        
        return roles;
    }
}