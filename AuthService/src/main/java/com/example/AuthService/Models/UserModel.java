package com.example.AuthService.Models;

import com.example.AuthService.Utils.UserEnums;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate; // <-- for license expiry
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Entity
public class UserModel implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotNull(message = "User email is required")
    @Email(message = "Email should be valid")
    @Column(unique = true)
    private String email;

    private String userImage;

    private String provider = "LOCAL_USER";

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> roles = List.of("ROLE_USER");

    private String password;

    private boolean isValidated;

    @NotNull(message = "We gotta call you something right....We're not strangers here")
    private String name;

    @Column(unique = true, nullable = false)
    private String licenseKey;

    // ========================= NEW FIELDS =========================

    // Optional: Expiry date for driver's license
    private LocalDate licenseExpiry;

    // Optional: Points used for dispatching vehicles (defaults to 1500 when applicable)
    private Integer dispatchPoints;

    // Optional: A fun/visual field for ID-like or level representation
    private LocalDateTime lastDispatched;



    @Enumerated()
    private UserEnums.UserRole userStatus;

    // ========================= CONSTRUCTORS =========================

    public UserModel(int id, String email, List<String> roles, String password, String name, boolean isValidated, String licenseKey) {
        this.id = id;
        this.email = email;
        this.roles = roles;
        this.password = password;
        this.name = name;
        this.isValidated = isValidated;
        this.licenseKey = licenseKey;
    }

    public UserModel() {}

    // ========================= GETTERS & SETTERS =========================

    public String getLicenseKey() {
        return licenseKey;
    }

    public void setLicenseKey(String licenseKey){
        this.licenseKey = licenseKey;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUserImage() {
        return userImage;
    }

    public void setUserImage(String userImage) {
        this.userImage = userImage;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setUsername(String email) {
        this.email = email;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setValidated(boolean isValidated) {
        this.isValidated = isValidated;
    }

    public boolean isValidated() {
        return isValidated;
    }

    // ========== NEW FIELD ACCESSORS ==========

    public LocalDate getLicenseExpiry() {
        return licenseExpiry;
    }

    public void setLicenseExpiry(LocalDate licenseExpiry) {
        this.licenseExpiry = licenseExpiry;
    }

    public Integer getDispatchPoints() {
        return dispatchPoints;
    }

    public void setDispatchPoints(Integer dispatchPoints) {
        this.dispatchPoints = dispatchPoints;
    }

    public LocalDateTime getLastDisaptched() {
        return lastDispatched;
    }

    public void setLastDispatched(LocalDateTime lastDispatched) {
        this.lastDispatched = lastDispatched;
    }

    // ========== UserDetails INTERFACE IMPLEMENTATION ==========

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // you can add real logic later
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // you can add real logic later
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // you can add real logic later
    }

    @Override
    public boolean isEnabled() {
        return true; // you can add real logic later
    }
}
