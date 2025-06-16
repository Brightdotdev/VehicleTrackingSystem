package com.tracker.loggingtrackingservice.G.V1.Repositories;

import com.tracker.loggingtrackingservice.G.V1.Models.AdminModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AdminRepository extends MongoRepository<AdminModel, String> {


     AdminModel  findByEmail(String email);
    }


