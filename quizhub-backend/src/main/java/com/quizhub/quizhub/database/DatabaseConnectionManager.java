package com.quizhub.quizhub.database;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Singleton class for managing database connections.
 * Ensures that only one instance of the database connection manager exists throughout the application.
 */
@Component
public class DatabaseConnectionManager {

    private static DatabaseConnectionManager instance;
    
    @Value("${spring.datasource.url}")
    private String dbUrl;
    
    @Value("${spring.datasource.username}")
    private String dbUsername;
    
    @Value("${spring.datasource.password}")
    private String dbPassword;
    
    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName;
    
    private Connection connection;
    
    /**
     * Private constructor to prevent instantiation from outside.
     * This is part of the Singleton pattern implementation.
     */
    private DatabaseConnectionManager() {
        // Private constructor to enforce singleton pattern
    }
    
    /**
     * Get the singleton instance of the DatabaseConnectionManager.
     * If the instance doesn't exist, it will be created.
     * 
     * @return The singleton instance of DatabaseConnectionManager
     */
    public static synchronized DatabaseConnectionManager getInstance() {
        if (instance == null) {
            instance = new DatabaseConnectionManager();
        }
        return instance;
    }
    
    /**
     * Get a connection to the database.
     * If a connection already exists and is valid, it will be reused.
     * 
     * @return A connection to the database
     * @throws SQLException If a database access error occurs
     */
    public synchronized Connection getConnection() throws SQLException {
        try {
            if (connection == null || connection.isClosed()) {
                Class.forName(driverClassName);
                connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
            }
            return connection;
        } catch (ClassNotFoundException e) {
            throw new SQLException("Database driver not found: " + e.getMessage());
        }
    }
    
    /**
     * Close the database connection if it exists and is open.
     * 
     * @throws SQLException If a database access error occurs
     */
    public synchronized void closeConnection() throws SQLException {
        if (connection != null && !connection.isClosed()) {
            connection.close();
        }
    }
}