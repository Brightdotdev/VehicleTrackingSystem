package com.example.VehicleService.Services;

import com.example.VehicleService.Exceptions.ConflictException;
import com.example.VehicleService.Exceptions.NotFoundException;
import com.example.VehicleService.Models.VehicleHealthAttributeModel;
import com.example.VehicleService.Models.VehicleModel;
import com.example.VehicleService.Models.VehicleWildcardAttributeModel;
import com.example.VehicleService.Repositories.VehicleRepository;
import com.example.VehicleService.Utils.UtilRecords;
import com.example.VehicleService.Utils.VehicleDataGenerator;
import com.example.VehicleService.Utils.VehicleEnums;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.example.VehicleService.Utils.VehicleEnums.VehicleDispatchStatus.*;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleHealthService vehicleHealthService;
    private final VehicleDataGenerator vehicleDataGenerator;

    private static final Logger logger = LoggerFactory.getLogger(VehicleService.class);

    // ✅ Constructor injection for all dependencies (consistent and testable)
    public VehicleService(VehicleRepository vehicleRepository,
                          VehicleHealthService vehicleHealthService,
                          VehicleDataGenerator vehicleDataGenerator) {
        this.vehicleRepository = vehicleRepository;
        this.vehicleHealthService = vehicleHealthService;
        this.vehicleDataGenerator = vehicleDataGenerator;
    }

    // Find a vehicle by VIN
    public VehicleModel findVehicleByIdentificationNumber(String vin) {
        VehicleModel foundVehicle = vehicleRepository.findByVehicleIdentificationNumber(vin);
        if (foundVehicle == null) {
            throw new NotFoundException("Vehicle not found for the given VIN: " + vin);
        }
        return foundVehicle;
    }

    // Mark a vehicle for maintenance
    @Transactional
    public VehicleModel markVehicleForMaintenance(String vin) {
        VehicleModel foundVehicle = findVehicleByIdentificationNumber(vin);

        Optional<VehicleWildcardAttributeModel> existing = foundVehicle.getWildcardAttributes().stream()
                .filter(attr -> attr.getWildcardKey() == VehicleEnums.VehicleWildCardType.IN_MAINTENANCE)
                .findFirst();

        if (existing.isPresent()) {
            existing.get().setWildcardValue(true);
        } else {
            VehicleWildcardAttributeModel wildcard = new VehicleWildcardAttributeModel(
                    foundVehicle,
                    VehicleEnums.VehicleWildCardType.IN_MAINTENANCE,
                    true
            );
            foundVehicle.getWildcardAttributes().add(wildcard);
        }

        return vehicleRepository.save(foundVehicle);
    }

    // Get vehicle dispatch history
    @Transactional
    public List<Long> getVehicleDispatchHistory(String vin) {
        return findVehicleByIdentificationNumber(vin).getDispatchHistory();
    }

    // Save "all vehicles randomly good" vehicle
    @Transactional
    public List<VehicleModel> saveAllVehicles(List<UtilRecords.VehicleDTO> vehicleListDTO) {

        List<VehicleModel> allVehicles = new ArrayList<>();


        for(UtilRecords.VehicleDTO vehicleDTO : vehicleListDTO) {
            VehicleModel vehicle = new VehicleModel();
            vehicle.setModel(vehicleDTO.model());
            vehicle.setEngineType(vehicleDTO.engineType());
            vehicle.setVehicleType(vehicleDTO.vehicleType());
            vehicle.setVehicleStatus(vehicleDTO.vehicleStatus());
            vehicle.setVehicleLocation(vehicleDTO.vehicleLocation());
            vehicle.setDispatchStatus(AVAILABLE);
            vehicle.setSafetyScore(Math.random() * 100 + 1);
            vehicle.setVehicleMetadata(vehicleDTO.vehicleMetadata());
            vehicle.setVehicleImages(vehicleDTO.vehicleImages());
            vehicle.setVehicleIdentificationNumber(vehicleDataGenerator.generateRandomVIN());
            vehicle.setLicensePlate(vehicleDataGenerator.generateRandomLicensePlate());
            vehicle.setVehicleAcquiredYear(vehicleDataGenerator.generateRandomAcquiredYear());

            // Add health attributes
            List<VehicleHealthAttributeModel> healthAttributes = new ArrayList<>();
            for (VehicleEnums.VehicleHealthAttributeType type : VehicleEnums.VehicleHealthAttributeType.values()) {
                VehicleHealthAttributeModel attr = new VehicleHealthAttributeModel();
                attr.setAttributeName(type);
                attr.setScore(type.getScore());
                attr.setVehicle(vehicle);
                healthAttributes.add(attr);
            }
            vehicle.setHealthAttributes(healthAttributes);

            // Add wildcard attributes
            List<VehicleWildcardAttributeModel> wildcardAttributes = new ArrayList<>();
            for (VehicleEnums.VehicleWildCardType type : VehicleEnums.VehicleWildCardType.values()) {
                VehicleWildcardAttributeModel wildcard = new VehicleWildcardAttributeModel();
                wildcard.setWildcardKey(type);
                wildcard.setWildcardValue(Math.random() > 0.5);
                wildcard.setVehicle(vehicle);
                wildcardAttributes.add(wildcard);
            }
            vehicle.setWildcardAttributes(wildcardAttributes);


        allVehicles.add(vehicle);
        }



        return vehicleRepository.saveAll(allVehicles);
    }
 // Save a "good" vehicle
    @Transactional
    public VehicleModel saveVehicle(UtilRecords.VehicleDTO vehicleDTO) {
        VehicleModel vehicle = new VehicleModel();

        vehicle.setModel(vehicleDTO.model());
        vehicle.setEngineType(vehicleDTO.engineType());
        vehicle.setVehicleType(vehicleDTO.vehicleType());
        vehicle.setVehicleStatus(vehicleDTO.vehicleStatus());
        vehicle.setVehicleLocation(vehicleDTO.vehicleLocation());
        vehicle.setDispatchStatus(AVAILABLE);
        vehicle.setSafetyScore(100.00);
        vehicle.setVehicleMetadata(vehicleDTO.vehicleMetadata());
        vehicle.setVehicleImages(vehicleDTO.vehicleImages());
        vehicle.setVehicleIdentificationNumber(vehicleDataGenerator.generateRandomVIN());
        vehicle.setLicensePlate(vehicleDataGenerator.generateRandomLicensePlate());
        vehicle.setVehicleAcquiredYear(vehicleDataGenerator.generateRandomAcquiredYear());

        // Add health attributes
        List<VehicleHealthAttributeModel> healthAttributes = new ArrayList<>();
        for (VehicleEnums.VehicleHealthAttributeType type : VehicleEnums.VehicleHealthAttributeType.values()) {
            VehicleHealthAttributeModel attr = new VehicleHealthAttributeModel();
            attr.setAttributeName(type);
            attr.setScore(type.getScore());
            attr.setVehicle(vehicle);
            healthAttributes.add(attr);
        }
        vehicle.setHealthAttributes(healthAttributes);

        // Add wildcard attributes
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

    // Save a "bad" vehicle with random weaker health scores
    @Transactional
    public VehicleModel saveBadVehicle(UtilRecords.VehicleDTO vehicleDTO) {
        VehicleModel vehicle = new VehicleModel();
        double vehicleScore = 0.0;

        vehicle.setModel(vehicleDTO.model());
        vehicle.setEngineType(vehicleDTO.engineType());
        vehicle.setVehicleType(vehicleDTO.vehicleType());
        vehicle.setVehicleStatus(vehicleDTO.vehicleStatus());
        vehicle.setVehicleLocation(vehicleDTO.vehicleLocation());
        vehicle.setDispatchStatus(AVAILABLE);
        vehicle.setVehicleMetadata(vehicleDTO.vehicleMetadata());
        vehicle.setVehicleImages(vehicleDTO.vehicleImages());
        vehicle.setVehicleIdentificationNumber(vehicleDataGenerator.generateRandomVIN());
        vehicle.setLicensePlate(vehicleDataGenerator.generateRandomLicensePlate());
        vehicle.setVehicleAcquiredYear(vehicleDataGenerator.generateRandomAcquiredYear());

        // Add degraded health attributes
        List<VehicleHealthAttributeModel> healthAttributes = new ArrayList<>();
        for (VehicleEnums.VehicleHealthAttributeType type : VehicleEnums.VehicleHealthAttributeType.values()) {
            VehicleHealthAttributeModel attr = new VehicleHealthAttributeModel();
            // ✅ Fixed formula: random degradation (0–9) but not boosting above type.getScore()
            double score = Math.max(0, type.getScore() - (int) (Math.random() * 10));
            attr.setAttributeName(type);
            attr.setScore(score);
            vehicleScore += score;
            attr.setVehicle(vehicle);
            healthAttributes.add(attr);
        }
        vehicle.setHealthAttributes(healthAttributes);

        // Add random wildcards
        List<VehicleWildcardAttributeModel> wildcardAttributes = new ArrayList<>();
        for (VehicleEnums.VehicleWildCardType type : VehicleEnums.VehicleWildCardType.values()) {
            boolean isTrue = Math.random() < 0.5; // 50% chance
            VehicleWildcardAttributeModel wildcard = new VehicleWildcardAttributeModel();
            wildcard.setWildcardKey(type);
            wildcard.setWildcardValue(isTrue);
            wildcard.setVehicle(vehicle);
            wildcardAttributes.add(wildcard);
        }
        vehicle.setWildcardAttributes(wildcardAttributes);

        vehicle.setSafetyScore(vehicleScore);
        return vehicleRepository.save(vehicle);
    }

    // Get all vehicles
    @Transactional
    public List<UtilRecords.VehicleApiData> findAllVehicles() {
        List<VehicleModel> foundVehicles = vehicleRepository.findAll();
        List<UtilRecords.VehicleApiData> vehicles = new ArrayList<>();
        for (VehicleModel vehicle : foundVehicles) {
            vehicles.add(mapToApiData(vehicle));
        }
        return vehicles;
    }

    // Get all dispatchable vehicles (skip PENDING/ONGOING/IN_PROGRESS)
    @Transactional
    public List<UtilRecords.VehicleApiData> getAllDispatchAble() {
        List<VehicleModel> foundVehicles = vehicleRepository.findAll();
        List<UtilRecords.VehicleApiData> vehicles = new ArrayList<>();

        for (VehicleModel vehicle : foundVehicles) {
            if (vehicle.getDispatchStatus() == PENDING ||
                    vehicle.getDispatchStatus() == ONGOING ||
                    vehicle.getDispatchStatus() == IN_PROGRESS) {
                continue;
            }
            vehicles.add(mapToApiData(vehicle));
        }
        return vehicles;
    }

    // ✅ Fixed lat/long bug here
    @Transactional
    public List<UtilRecords.LatitudeLongitude> getAllVehiclesLocation() {
        logger.info("Starting getAllVehiclesLocation()");

        // Fetch all vehicles
        List<UtilRecords.VehicleApiData> foundVehicles = findAllVehicles();
        logger.debug("Fetched {} vehicles from DB", foundVehicles.size());

        List<UtilRecords.LatitudeLongitude> vehicleLocations = new ArrayList<>();

        // Loop through vehicles
        for (UtilRecords.VehicleApiData vehicle : foundVehicles) {
            if (vehicle.location() == null) {
                logger.warn("Vehicle with VIN={} has no location data!", vehicle.vehicleIdentificationNumber());
                continue;
            }

            double lat = vehicle.location().latitude();
            double lon = vehicle.location().longitude();

            logger.debug("Processing VIN={} -> latitude={}, longitude={}",
                    vehicle.vehicleIdentificationNumber(), lat, lon);

            UtilRecords.LatitudeLongitude vehicleLocation =
                    new UtilRecords.LatitudeLongitude(lat, lon);

            vehicleLocations.add(vehicleLocation);
        }

        logger.info("Completed getAllVehiclesLocation(): {} locations extracted", vehicleLocations.size());
        return vehicleLocations;
    }
    @Transactional
    public UtilRecords.VehicleApiData getVehicleByVin(String vin) {
        VehicleModel foundVehicle = findVehicleByIdentificationNumber(vin);
        return mapToApiData(foundVehicle);
    }

    // ✅ Fixed dispatch completion logic
    @Transactional
    public void completedDispatch(UtilRecords.DispatchEndedDTO dispatchEvent) {
        logger.info("Starting completedDispatch for VIN: {}", dispatchEvent.vehicleIdentificationNumber());
        VehicleModel dispatchedVehicle = vehicleRepository
                .findByVehicleIdentificationNumber(dispatchEvent.vehicleIdentificationNumber());

        if (dispatchedVehicle == null) {
            throw new NotFoundException("The vehicle doesn't exist");
        }

        if (dispatchedVehicle.getDispatchStatus() == IN_PROGRESS ||
                dispatchedVehicle.getDispatchStatus() == PENDING ||
                dispatchedVehicle.getDispatchStatus() == ONGOING) {

            dispatchedVehicle.setDispatchStatus(AVAILABLE);
            vehicleRepository.save(dispatchedVehicle);
            logger.info("Vehicle marked AVAILABLE after dispatch completion: {}", dispatchedVehicle.getVehicleIdentificationNumber());
        }
    }

    @Transactional
    public void handleDispatchTracking(UtilRecords.StartTrackingDTO trackingEvent) {
        VehicleModel dispatchedVehicle = findVehicleByIdentificationNumber(trackingEvent.vehicleIdentificationNumber());

        if (dispatchedVehicle.getDispatchStatus() != IN_PROGRESS) {
            throw new ConflictException("The vehicle is not staged for dispatch");
        }

        if (!dispatchedVehicle.getDispatchHistory().contains(trackingEvent.dispatchId())) {
            dispatchedVehicle.addDispatchHistoryEntry(trackingEvent.dispatchId());
        }

        dispatchedVehicle.setDispatchStatus(ONGOING);
        vehicleRepository.save(dispatchedVehicle);
    }

    @Transactional
    public void handleVehicleLocationUpdate(UtilRecords.vehicleLocationUpdate locationUpdate) {
        VehicleModel foundVehicle = vehicleRepository.findByVehicleIdentificationNumber(locationUpdate.vehicleIdentificationNumber());
        if (foundVehicle == null) {
            return;
        }
        foundVehicle.setVehicleLocation(locationUpdate.checkPoint());
        vehicleRepository.save(foundVehicle);
    }

    @Transactional
    public Map<String, Object> handleDispatchRequest(UtilRecords.dispatchRequestBodyDTO dispatchEvent) {
        if (dispatchEvent == null || dispatchEvent.vehicleIdentificationNumber() == null) {
            throw new NotFoundException("Vehicle VIN missing for creating a new dispatch");
        }

        VehicleModel vehicle = findVehicleByIdentificationNumber(dispatchEvent.vehicleIdentificationNumber());
        vehicle.setDispatchStatus(PENDING);
        vehicleRepository.save(vehicle);

        return vehicleHealthService.vehicleDispatchStatus(vehicle, dispatchEvent);
    }

    @Transactional
    public void handleValidatedDispatch(UtilRecords.ValidatedDispatch dispatchEvent) {
        VehicleModel dispatchedVehicle = findVehicleByIdentificationNumber(dispatchEvent.vehicleIdentificationNumber());

        if (dispatchedVehicle.getDispatchStatus() != PENDING) {
            throw new ConflictException("The vehicle is not staged for dispatch");
        }

        dispatchedVehicle.addDispatchHistoryEntry(dispatchEvent.dispatchId());
        dispatchedVehicle.setDispatchStatus(IN_PROGRESS);
        vehicleRepository.save(dispatchedVehicle);
    }

    // ✅ Helper method to map VehicleModel → VehicleApiData
    private UtilRecords.VehicleApiData mapToApiData(VehicleModel vehicle) {
        return new UtilRecords.VehicleApiData(
                vehicle.getVehicleIdentificationNumber(),
                vehicle.getLicensePlate(),
                vehicle.getModel(),
                vehicle.getEngineType(),
                vehicle.getVehicleType(),
                vehicle.getVehicleStatus(),
                vehicle.getDispatchStatus(),
                vehicle.getDispatchHistory(),
                vehicle.getVehicleImages(),
                vehicle.getSafetyScore(),
                vehicle.getVehicleMetadata(),
                vehicle.getVehicleAcquiredYear(),
                vehicle.getHealthAttributes(),
                vehicle.getWildcardAttributes(),
                vehicle.getVehicleLocation()
        );
    }
}
