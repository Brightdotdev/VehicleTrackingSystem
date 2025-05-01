package com.example.VehicleService.Utils;

public class VehicleEnums {


    public static enum EngineType {
        GAS,
        DIESEL,
        ELECTRIC,
        HYBRID
    }

    public static enum VehicleType {
        CAR,
        TRUCK,
        MOTORCYCLE,
        BUS,
        VAN,
        OTHER
    }

    static enum VehicleClass {
        TRANSPORT,
        CLASSIFIED,
        DELIVERY
    }

    public static enum VehicleDispatchStatus {
        PENDING,
        IN_PROGRESS,
        CANCELLED,
        COMPLETED
    }

    public static enum VehicleHealthStatus {
        ACTIVE,
        INACTIVE,
        MAINTENANCE
    }

    public static enum VehicleStatus {

        CLASSIFIED,
        CARGO,
        REGULAR,
        TRANSPORT
    }

}