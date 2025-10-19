package com.seguridadbravo.seguridadbravobackend.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConfig {
    // Configuración para la base de datos ProyectoAnalisis
    private static final String URL = "jdbc:mysql://localhost:3306/ProyectoAnalisis";
    private static final String USER = "root";
    private static final String PASSWORD = "root";
    
    public static Connection getConnection() throws SQLException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("✅ Conexión a MySQL (ProyectoAnalisis) establecida correctamente");
            return conn;
        } catch (ClassNotFoundException e) {
            throw new SQLException("MySQL Driver not found", e);
        } catch (SQLException e) {
            System.err.println("❌ Error al conectar con MySQL: " + e.getMessage());
            throw e;
        }
    }
    
    public static void initializeDatabase() {
        // Solo verificar conexión, la estructura ya está creada por tu script
        try (Connection conn = getConnection()) {
            System.out.println("✅ Base de datos ProyectoAnalisis verificada correctamente");
        } catch (SQLException e) {
            System.err.println("❌ Error al verificar la base de datos: " + e.getMessage());
        }
    }
}