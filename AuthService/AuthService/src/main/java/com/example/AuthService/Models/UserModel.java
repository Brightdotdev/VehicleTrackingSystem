package com.example.AuthService.Models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

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

    private String provider = "LOCAL_USER" ;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> roles = List.of("ROLE_USER");

    private String password;

    private boolean isValidated;
    @NotNull(message = "We gotta call you something right....We're not strangers here")
    private String name;

    // === Constructors ===

    public UserModel(int id, String email, List<String> roles, String password, String name, boolean isValidated) {
        this.id = id;
        this.email = email;
        this.roles = roles;
        this.password = password;
        this.name = name;
        this.isValidated = isValidated;
    }

    public UserModel() {}

    // === Getters and Setters ===

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
        this.userImage = UserModel.this.userImage;
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

    // === UserDetails Implementation ===

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Convert each role string to a SimpleGrantedAuthority
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
        return true; // Change based on your logic
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Change based on your logic
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Change based on your logic
    }

    @Override
    public boolean isEnabled() {
        return true; // Change based on your logic
    }
}
