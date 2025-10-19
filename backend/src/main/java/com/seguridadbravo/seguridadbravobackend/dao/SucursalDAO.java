package com.seguridadbravo.seguridadbravobackend.dao;

import com.seguridadbravo.seguridadbravobackend.config.DatabaseConfig;
import com.seguridadbravo.seguridadbravobackend.models.Sucursal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class SucursalDAO {
    
    public List<Sucursal> getAllSucursales() {
        List<Sucursal> sucursales = new ArrayList<>();
        String sql = "SELECT * FROM SUCURSAL ORDER BY Nombre";
        
        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                Sucursal sucursal = new Sucursal();
                sucursal.setIdSucursal(rs.getInt("IdSucursal"));
                sucursal.setNombre(rs.getString("Nombre"));
                sucursal.setDireccion(rs.getString("Direccion"));
                sucursales.add(sucursal);
            }
        } catch (SQLException e) {
            System.err.println("Error getting all sucursales: " + e.getMessage());
        }
        
        return sucursales;
    }
}