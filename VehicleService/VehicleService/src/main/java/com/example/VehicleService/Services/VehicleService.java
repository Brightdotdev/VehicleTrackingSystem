package com.example.VehicleService.Services;

import com.example.VehicleService.Exceptions.NotFoundException;
import com.example.VehicleService.Models.VehicleHealthAttributeModel;
import com.example.VehicleService.Models.VehicleModel;
import com.example.VehicleService.Models.VehicleWildcardAttributeModel;
import com.example.VehicleService.Repositories.VehicleRepository;
import com.example.VehicleService.Utils.UtilRecords;
import com.example.VehicleService.Utils.VehicleDataGenerator;
import com.example.VehicleService.Utils.VehicleEnums;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class VehicleService {


    @Autowired
    VehicleDataGenerator vehicleDataGenerator;

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }



    public VehicleModel findVehicleByIdentificationNumber(String vin) {

        VehicleModel foundVehicle = vehicleRepository.findByVehicleIdentificationNumber(vin);
        if (foundVehicle == null) {
            throw new NotFoundException("Vehicle not found of current identification Number");
        }

        return foundVehicle;
    }


    @Transactional
    public VehicleModel saveVehicle(UtilRecords.VehicleDTO vehicleDTO) {

        VehicleModel vehicle = new VehicleModel();

        vehicle.setModel(vehicleDTO.model());
        vehicle.setEngineType(vehicleDTO.engineType());

        vehicle.setVehicleType(vehicleDTO.vehicleType());
        vehicle.setVehicleStatus(vehicleDTO.vehicleStatus());

        vehicle.setDispatchStatus(VehicleEnums.VehicleDispatchStatus.AVAILABLE);
        vehicle.setSafetyScore(100.00);

        vehicle.setVehicleMetadata(vehicleDTO.vehicleMetadata());
        vehicle.setVehicleImages(vehicleDTO.vehicleImages());
        vehicle.setVehicleIdentificationNumber(vehicleDataGenerator.generateRandomVIN());
        vehicle.setLicensePlate(vehicleDataGenerator.generateRandomLicensePlate());
        vehicle.setVehicleAcquiredYear(vehicleDataGenerator.generateRandomAcquiredYear());

        List<VehicleHealthAttributeModel> healthAttributes = new ArrayList<>();

        for (VehicleEnums.VehicleHealthAttributeType type : VehicleEnums.VehicleHealthAttributeType.values()) {
            VehicleHealthAttributeModel attr = new VehicleHealthAttributeModel();

            attr.setAttributeName(type);
            attr.setScore(type.getScore());

            attr.setVehicle(vehicle);
            healthAttributes.add(attr);}

        vehicle.setHealthAttributes(healthAttributes);

        List<VehicleWildcardAttributeModel> wildcardAttributes = new ArrayList<>();

        for (VehicleEnums.VehicleWildCardType type : VehicleEnums.VehicleWildCardType.values()) {

            VehicleWildcardAttributeModel wildcard = new VehicleWildcardAttributeModel();
            wildcard.setWildcardKey(type);
            wildcard.setWildcardValue(false);
            wildcard.setVehicle(vehicle);
            wildcardAttributes.add(wildcard);
        }
        vehicle.setWildcardAttributes(wildcardAttributes);


        return vehicleRepository.save(vehicle);
    }


    @Transactional
    public VehicleModel saveBadVehicle(UtilRecords.VehicleDTO vehicleDTO) {

        VehicleModel vehicle = new VehicleModel();
        double vehicleScore = 0.00;
        vehicle.setModel(vehicleDTO.model());
        vehicle.setEngineType(vehicleDTO.engineType());

        vehicle.setVehicleType(vehicleDTO.vehicleType());
        vehicle.setVehicleStatus(vehicleDTO.vehicleStatus());

        vehicle.setDispatchStatus(VehicleEnums.VehicleDispatchStatus.AVAILABLE);



        vehicle.setVehicleMetadata(vehicleDTO.vehicleMetadata());
        vehicle.setVehicleImages(vehicleDTO.vehicleImages());
        vehicle.setVehicleIdentificationNumber(vehicleDataGenerator.generateRandomVIN());
        vehicle.setLicensePlate(vehicleDataGenerator.generateRandomLicensePlate());
        vehicle.setVehicleAcquiredYear(vehicleDataGenerator.generateRandomAcquiredYear());

        List<VehicleHealthAttributeModel> healthAttributes = new ArrayList<>();

        for (VehicleEnums.VehicleHealthAttributeType type : VehicleEnums.VehicleHealthAttributeType.values()) {
            VehicleHealthAttributeModel attr = new VehicleHealthAttributeModel();
            double score = type.getScore() - 10;
            attr.setAttributeName(type);
            attr.setScore(score);
            vehicleScore += score;
            attr.setVehicle(vehicle);
            healthAttributes.add(attr);}

        vehicle.setHealthAttributes(healthAttributes);

        List<VehicleWildcardAttributeModel> wildcardAttributes = new ArrayList<>();

        for (VehicleEnums.VehicleWildCardType type : VehicleEnums.VehicleWildCardType.values()) {

            VehicleWildcardAttributeModel wildcard = new VehicleWildcardAttributeModel();
            wildcard.setWildcardKey(type);
            wildcard.setWildcardValue(true);
            wildcard.setVehicle(vehicle);
            wildcardAttributes.add(wildcard);
        }
        vehicle.setWildcardAttributes(wildcardAttributes);


        vehicle.setSafetyScore(vehicleScore);

        return vehicleRepository.save(vehicle);
    }



    @Transactional
    public List<UtilRecords.VehicleApiData> findAllVehicles() {
        List<VehicleModel> foundVehicles =   vehicleRepository.findAll();
        List<UtilRecords.VehicleApiData> vehicles =   new ArrayList<>();

        for (VehicleModel vehicle : foundVehicles){
            UtilRecords.VehicleApiData vehicleApi = new UtilRecords.VehicleApiData(
                vehicle.getVehicleIdentificationNumber(),vehicle.getLicensePlate(),vehicle.getModel(),vehicle.getEngineType(),vehicle.getVehicleType(),vehicle.getVehicleStatus(),vehicle.getDispatchStatus(),vehicle.getDispatchHistory(),vehicle.getVehicleImages(),vehicle.getSafetyScore(),vehicle.getVehicleMetadata(),vehicle.getHealthAttributes()
            );
            vehicles.add(vehicleApi);
        }
        return vehicles;
    }



    @Transactional
    public void completeDispatch(UtilRecords.DispatchCompletedEvent dispatchEvent) {
        VehicleModel dispatchedVehicle = vehicleRepository.
                findByVehicleIdentificationNumber(dispatchEvent.vehicleIdentificationNumber());

        if (dispatchedVehicle == null){
            throw new NotFoundException("The vehicle doesn't even exist boss");
        }
        dispatchedVehicle.setDispatchStatus(VehicleEnums.VehicleDispatchStatus.COMPLETED);
    }
}

