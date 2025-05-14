package com.example.DispatchService.Utils;

public class DispatchEnums {

    public static enum DispatchReason {
        TRANSPORT,
        CLASSIFIED,
        DELIVERY
    }


    static enum VehicleClass {
        TRANSPORT,
        CLASSIFIED,
        DELIVERY
    }

    public static enum DispatchStatus {
        PENDING,
        IN_PROGRESS,
        EXPIRED,
        CANCELLED,
        COMPLETED
    }
    public static enum VehicleStatus {

        CLASSIFIED,
        CARGO,
        REGULAR,
        TRANSPORT
    }

}