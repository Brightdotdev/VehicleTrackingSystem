package com.example.AuthService.Repositories;

import com.example.AuthService.Models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserModel,Integer> {

    Optional<UserModel> findByEmail(String email);

    boolean existsByEmail(String email);

    List<UserModel> findAllByEmail(String email);
}
