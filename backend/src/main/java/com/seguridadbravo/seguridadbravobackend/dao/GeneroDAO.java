package com.seguridadbravo.seguridadbravobackend.dao;

import com.seguridadbravo.seguridadbravobackend.config.DatabaseConfig;
import com.seguridadbravo.seguridadbravobackend.models.Genero;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class GeneroDAO {
    
    public List<Genero> getAllGeneros() {
        List<Genero> generos = new ArrayList<>();
        String sql = "SELECT * FROM GENERO ORDER BY Nombre";
        
        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                Genero genero = new Genero();
                genero.setIdGenero(rs.getInt("IdGenero"));
                genero.setNombre(rs.getString("Nombre"));
                generos.add(genero);
            }
        } catch (SQLException e) {
            System.err.println("Error getting all generos: " + e.getMessage());
        }
        
        return generos;
    }
}