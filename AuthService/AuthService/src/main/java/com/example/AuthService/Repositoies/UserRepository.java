package com.example.AuthService.Repositoies;

import com.example.AuthService.Models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserModel,Integer> {

    Optional<UserModel> findByEmail(String email);




    boolean existsByEmail(String email);
}
