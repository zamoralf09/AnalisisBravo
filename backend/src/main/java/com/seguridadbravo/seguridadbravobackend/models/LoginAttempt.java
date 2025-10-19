package com.seguridadbravo.seguridadbravobackend.models;

import java.time.LocalDateTime;

public class LoginAttempt {
    private int id;
    private int userId;
    private boolean intentoExitoso;
    private LocalDateTime fechaIntento;
    private String ipAddress;
    private String userAgent;

    // Constructores
    public LoginAttempt() {
    }

    public LoginAttempt(int userId, boolean intentoExitoso, String ipAddress, String userAgent) {
        this.userId = userId;
        this.intentoExitoso = intentoExitoso;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
    }

    // Getters y Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public boolean isIntentoExitoso() {
        return intentoExitoso;
    }

    public void setIntentoExitoso(boolean intentoExitoso) {
        this.intentoExitoso = intentoExitoso;
    }

    public LocalDateTime getFechaIntento() {
        return fechaIntento;
    }

    public void setFechaIntento(LocalDateTime fechaIntento) {
        this.fechaIntento = fechaIntento;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }
}