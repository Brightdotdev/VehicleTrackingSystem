package com.example.VehicleService.Utils;

import java.util.Random;
public class VehicleDataGenerator {

    private static final String VIN_ALPHANUMERIC = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789";

    private static final String PLATE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final Random random = new Random();


    public static String generateRandomVIN() {
        StringBuilder vin = new StringBuilder(17);
        for (int i = 0; i < 17; i++) {
            vin.append(VIN_ALPHANUMERIC.charAt(random.nextInt(VIN_ALPHANUMERIC.length())));
        }
        return vin.toString();
    }


    public static String generateRandomLicensePlate() {
        StringBuilder plate = new StringBuilder();

        // Add 3 random letters
        for (int i = 0; i < 3; i++) {
            plate.append(PLATE_LETTERS.charAt(random.nextInt(PLATE_LETTERS.length())));
        }

        plate.append('-'); // separator

        // Add 4 random numbers
        for (int i = 0; i < 4; i++) {
            plate.append(random.nextInt(10));
        }
        return plate.toString();
    }

}