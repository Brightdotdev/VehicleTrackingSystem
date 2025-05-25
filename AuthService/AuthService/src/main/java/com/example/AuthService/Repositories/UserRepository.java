package com.example.AuthService.Repositories;

import com.example.AuthService.Models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserModel,Integer> {

    Optional<UserModel> findByEmail(String email);


    Optional<UserModel> findByEmailAndProvider(String email, String provider);



    boolean existsByEmail(String email);

    List<UserModel> findAllByEmail(String email);
}
