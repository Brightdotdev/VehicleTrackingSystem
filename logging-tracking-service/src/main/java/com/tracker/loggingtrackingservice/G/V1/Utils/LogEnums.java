package com.tracker.loggingtrackingservice.G.V1.Utils;

public class LogEnums {


    public static enum NotificationType {
        INFO,
        WARNING,
        SUCCESS,
        DISPATCH_CREATED_ADMIN,
        DANGER
    }

    public static enum VehicleType {
        CAR,
        SEDAN,
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

        ONGOING,
        PENDING,
        IN_PROGRESS,
        EXPIRED,
        CANCELLED,
        COMPLETED,
        AVAILABLE
    }


    public static enum VehicleStatus {
        CLASSIFIED,
        CARGO,
        REGULAR,
        TRANSPORT
    }

    public static enum DispatchReason {
        TRANSPORT,
        CLASSIFIED,
        DELIVERY
    }



    public static enum DispatchStatus {
        PENDING,
        IN_PROGRESS,
        EXPIRED,
        CANCELLED,
        COMPLETED,
        ONGOING
    }


}