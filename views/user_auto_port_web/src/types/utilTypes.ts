import { DispatchReason } from "./VehicleTypes"


export type componentTypes  = {
    vehicleComponent :   "requests" | "vehicles"
}


export type reasons = {
  value: DispatchReason
  label: string
}



export  interface NotificationData {
  dispatchId : number;
  vehicleId : string;
  id : string;
  isActionNotif: boolean;
  createdAt: string;
  readAt?: string | null;
  title: string;
  message: string;
  read: boolean;
  type: notificationType;
  badNotificationCta?: string;
  goodNotificationCta?: string;
}

export enum notificationType {
  INFO = "INFO",
  WARNING = "WARNING",
  SUCCESS = "SUCCESS",
  DISPATCH_CREATED_ADMIN = "DISPATCH_CREATED_ADMIN",
  DISPATCH_VALIDATED_USER = "DISPATCH_VALIDATED_USER",
  DANGER = "DANGER"
}


// Step 1: Define the enum and interface
enum CheckPointError {
    MISSING_LATITUDE = "Latitude is required",
    MISSING_LONGITUDE = "Longitude is required",
    MISSING_TIMESTAMP = "TimeStamp is required"
}

// Interface with latitude and longitude as numbers
export interface CheckPoint {
    latitude: number;
    longitude: number;
    timeStamp: string;
}

// Step 2: Factory function to validate and create a CheckPoint
export function createCheckPoint(
    latitude: number,
    longitude: number,
    timeStamp?: string
): CheckPoint {
    // Check if latitude is a valid number (not null, not NaN)
    if (latitude === null || isNaN(latitude)) {
        throw new Error(CheckPointError.MISSING_LATITUDE);
    }

    // Check if longitude is a valid number (not null, not NaN)
    if (longitude === null || isNaN(longitude)) {
        throw new Error(CheckPointError.MISSING_LONGITUDE);
    }

    // Use current time if timeStamp not provided, removing milliseconds and 'Z'
    const now = new Date();
    const formattedTimeStamp = timeStamp ?? now.toISOString().split('.')[0];

    return {
        latitude,
        longitude,
        timeStamp: formattedTimeStamp
    };
}
