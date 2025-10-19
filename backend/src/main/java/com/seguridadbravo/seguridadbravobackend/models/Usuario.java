package com.seguridadbravo.seguridadbravobackend.models;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Usuario {
    private String idUsuario;
    private String nombre;
    private String apellido;
    private LocalDate fechaNacimiento;
    private int idStatusUsuario;
    private String password;
    private int idGenero;
    private LocalDateTime ultimaFechaIngreso;
    private int intentosDeAcceso;
    private String sesionActual;
    private LocalDateTime ultimaFechaCambioPassword;
    private String correoElectronico;
    private int requiereCambiarPassword;
    private byte[] fotografia;
    private String telefonoMovil;
    private int idSucursal;
    private String pregunta;
    private String respuesta;
    private int idRole;
    private LocalDateTime fechaCreacion;
    private String usuarioCreacion;
    private LocalDateTime fechaModificacion;
    private String usuarioModificacion;

    // Campos adicionales para joins
    private String nombreStatus;
    private String nombreGenero;
    private String nombreSucursal;
    private String nombreRole;

    public Usuario() {
    }

    // Getters y Setters
    public String getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(String idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public int getIdStatusUsuario() {
        return idStatusUsuario;
    }

    public void setIdStatusUsuario(int idStatusUsuario) {
        this.idStatusUsuario = idStatusUsuario;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getIdGenero() {
        return idGenero;
    }

    public void setIdGenero(int idGenero) {
        this.idGenero = idGenero;
    }

    public LocalDateTime getUltimaFechaIngreso() {
        return ultimaFechaIngreso;
    }

    public void setUltimaFechaIngreso(LocalDateTime ultimaFechaIngreso) {
        this.ultimaFechaIngreso = ultimaFechaIngreso;
    }

    public int getIntentosDeAcceso() {
        return intentosDeAcceso;
    }

    public void setIntentosDeAcceso(int intentosDeAcceso) {
        this.intentosDeAcceso = intentosDeAcceso;
    }

    public String getSesionActual() {
        return sesionActual;
    }

    public void setSesionActual(String sesionActual) {
        this.sesionActual = sesionActual;
    }

    public LocalDateTime getUltimaFechaCambioPassword() {
        return ultimaFechaCambioPassword;
    }

    public void setUltimaFechaCambioPassword(LocalDateTime ultimaFechaCambioPassword) {
        this.ultimaFechaCambioPassword = ultimaFechaCambioPassword;
    }

    public String getCorreoElectronico() {
        return correoElectronico;
    }

    public void setCorreoElectronico(String correoElectronico) {
        this.correoElectronico = correoElectronico;
    }

    public int getRequiereCambiarPassword() {
        return requiereCambiarPassword;
    }

    public void setRequiereCambiarPassword(int requiereCambiarPassword) {
        this.requiereCambiarPassword = requiereCambiarPassword;
    }

    public byte[] getFotografia() {
        return fotografia;
    }

    public void setFotografia(byte[] fotografia) {
        this.fotografia = fotografia;
    }

    public String getTelefonoMovil() {
        return telefonoMovil;
    }

    public void setTelefonoMovil(String telefonoMovil) {
        this.telefonoMovil = telefonoMovil;
    }

    public int getIdSucursal() {
        return idSucursal;
    }

    public void setIdSucursal(int idSucursal) {
        this.idSucursal = idSucursal;
    }

    public String getPregunta() {
        return pregunta;
    }

    public void setPregunta(String pregunta) {
        this.pregunta = pregunta;
    }

    public String getRespuesta() {
        return respuesta;
    }

    public void setRespuesta(String respuesta) {
        this.respuesta = respuesta;
    }

    public int getIdRole() {
        return idRole;
    }

    public void setIdRole(int idRole) {
        this.idRole = idRole;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public String getUsuarioCreacion() {
        return usuarioCreacion;
    }

    public void setUsuarioCreacion(String usuarioCreacion) {
        this.usuarioCreacion = usuarioCreacion;
    }

    public LocalDateTime getFechaModificacion() {
        return fechaModificacion;
    }

    public void setFechaModificacion(LocalDateTime fechaModificacion) {
        this.fechaModificacion = fechaModificacion;
    }

    public String getUsuarioModificacion() {
        return usuarioModificacion;
    }

    public void setUsuarioModificacion(String usuarioModificacion) {
        this.usuarioModificacion = usuarioModificacion;
    }

    public String getNombreStatus() {
        return nombreStatus;
    }

    public void setNombreStatus(String nombreStatus) {
        this.nombreStatus = nombreStatus;
    }

    public String getNombreGenero() {
        return nombreGenero;
    }

    public void setNombreGenero(String nombreGenero) {
        this.nombreGenero = nombreGenero;
    }

    public String getNombreSucursal() {
        return nombreSucursal;
    }

    public void setNombreSucursal(String nombreSucursal) {
        this.nombreSucursal = nombreSucursal;
    }

    public String getNombreRole() {
        return nombreRole;
    }

    public void setNombreRole(String nombreRole) {
        this.nombreRole = nombreRole;
    }

    public String getNombreCompleto() {
        return nombre + " " + apellido;
    }
}