package com.example.AuthService.Models;

import com.example.AuthService.Utils.UserEnums;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.ArrayList;
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

    private LocalDateTime licenseExpiry;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<Double> dispatchPoints = new ArrayList<>();


    @Enumerated(EnumType.STRING)
    private UserEnums.UserRole userStatus;

    // ===== Constructors =====

    public UserModel() {}

    public UserModel(int id, String email, List<String> roles, String password, String name,
                     boolean isValidated, String licenseKey) {
        this.id = id;
        this.email = email;
        this.roles = roles;
        this.password = password;
        this.name = name;
        this.isValidated = isValidated;
        this.licenseKey = licenseKey;
    }

    // ===== Getters and Setters =====

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

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isValidated() {
        return isValidated;
    }

    public void setValidated(boolean validated) {
        isValidated = validated;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLicenseKey() {
        return licenseKey;
    }

    public void setLicenseKey(String licenseKey) {
        this.licenseKey = licenseKey;
    }

    public LocalDateTime getLicenseExpiry() {
        return licenseExpiry;
    }

    public void setLicenseExpiry(LocalDateTime licenseExpiry) {
        this.licenseExpiry = licenseExpiry;
    }

    public List<Double> getDispatchPoints() {
        return dispatchPoints;
    }

    public void setDispatchPoints(List<Double> dispatchPoints) {
        this.dispatchPoints = dispatchPoints;
    }

    public void addToDispatchPoint(Double point) {
        if (this.dispatchPoints == null) {
            this.dispatchPoints = new ArrayList<>();
        }
        this.dispatchPoints.add(point);
    }


    public UserEnums.UserRole getUserStatus() {
        return userStatus;
    }

    public void setUserStatus(UserEnums.UserRole userStatus) {
        this.userStatus = userStatus;
    }

    // ===== Spring Security Methods =====

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Add logic later
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Add logic later
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Add logic later
    }

    @Override
    public boolean isEnabled() {
        return true; // Add logic later
    }
}
