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

        IN_TRANSIT,
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





    public enum VehicleHealthAttributeType {
        ENGINE(30),
        BRAKES(20),
        TIRES(15),
        LIGHTS(10),
        BATTERY(10),
        TRANSMISSION(15);

        private final int score;

        VehicleHealthAttributeType(int score) {
            this.score = score;
        }

        public int getScore() {
            return score;
        }
    }


    public enum VehicleWildCardType {
        ENGINE_LOCKED,
        GPS_DISABLED,
        UNVERIFIED_VIN,
        FLAGGED_FOR_INSPECTION,
        INSURANCE_IS_EXPIRED,
       IN_MAINTENANCE
    }

}