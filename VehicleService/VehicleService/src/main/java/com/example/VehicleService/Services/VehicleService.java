package com.example.VehicleService.Services;



import com.example.VehicleService.Exceptions.NotFoundException;
import com.example.VehicleService.Models.VehicleModel;
import com.example.VehicleService.Repositories.VehicleRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }


    public VehicleModel findByEmail(String email) {
        return vehicleRepository.findBy(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    public VehicleModel save(VehicleModel user) {
        return vehicleRepository.save(user);
    }

    public boolean existsByEmail(String email) {
        return vehicleRepository.existsByEmail(email);
    }

    public List<VehicleModel> findAll() {
        return vehicleRepository.findAll();
    }


    // Add @Transactional to manage database transactions automatically
    @Transactional
    public VehicleModel findOrCreateFromOAuth(String email, String name, String imageUrl, String provider, boolean email_verified
    ) {
        // Try to find the user by email
        return vehicleRepository.findByEmail(email)
                // If the user is not found, create and save a new one
                .orElseGet(() -> {
                    VehicleModel user = new VehicleModel();
                    user.setEmail(email);
                    user.setName(name);
                    user.setUserImage(imageUrl);
                    user.setProvider(provider);
                    user.setValidated(email_verified);
                    user.setRoles(List.of("ROLE_USER"));
                    return vehicleRepository.save(user);
                });
    }

}
