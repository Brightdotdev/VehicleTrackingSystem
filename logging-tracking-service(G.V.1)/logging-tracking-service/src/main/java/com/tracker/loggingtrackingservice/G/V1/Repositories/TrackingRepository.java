package com.tracker.loggingtrackingservice.G.V1.Repositories;


import com.tracker.loggingtrackingservice.G.V1.Models.TrackingModel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface TrackingRepository extends MongoRepository<TrackingModel, String> {

    Optional<TrackingModel> findByDispatchId(String dispatchId);


}
