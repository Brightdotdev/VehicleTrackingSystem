package com.example.DispatchService.Messaging;

import com.example.DispatchService.Utils.UtilRecords;

import java.util.Map;

public interface ResponseMapperService {

    public Map<String, Object> dispatchRequestMapper(Object response);

    public UtilRecords.DispatchResponseDTO dispatchResponseMapper (Map<String, Object> dispatchResponse);


}
