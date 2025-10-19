package com.seguridadbravo.seguridadbravobackend.dao;

import com.seguridadbravo.seguridadbravobackend.config.DatabaseConfig;
import com.seguridadbravo.seguridadbravobackend.models.StatusUsuario;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class StatusUsuarioDAO {
    
    public List<StatusUsuario> getAllStatus() {
        List<StatusUsuario> statusList = new ArrayList<>();
        String sql = "SELECT * FROM STATUS_USUARIO ORDER BY Nombre";
        
        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                StatusUsuario status = new StatusUsuario();
                status.setIdStatusUsuario(rs.getInt("IdStatusUsuario"));
                status.setNombre(rs.getString("Nombre"));
                statusList.add(status);
            }
        } catch (SQLException e) {
            System.err.println("Error getting all status: " + e.getMessage());
        }
        
        return statusList;
    }
}