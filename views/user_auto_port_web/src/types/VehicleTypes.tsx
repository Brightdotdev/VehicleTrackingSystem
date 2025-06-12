// --- Enums translated from com.example.VehicleService.Utils.VehicleEnums ---

/** Engine types for vehicles */
export enum EngineType {
  GAS = 'GAS',
  DIESEL = 'DIESEL',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
}

export enum DispatchStatus {
    EXPIRED = "EXPIRED",
    PENDING = "PENDING",  
    REJECTED = "REJECTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}
/** Broad categories of vehicles */
export enum VehicleType {
  CAR = 'CAR',
  SEDAN = 'SEDAN',
  TRUCK = 'TRUCK',
  MOTORCYCLE = 'MOTORCYCLE',
  BUS = 'BUS',
  VAN = 'VAN',
  OTHER = 'OTHER',
}

/** Status of a vehicle within your domain (e.g., classification) */
export enum VehicleStatus {
  CLASSIFIED = 'CLASSIFIED',
  CARGO = 'CARGO',
  REGULAR = 'REGULAR',
  TRANSPORT = 'TRANSPORT',
}

/** Dispatch lifecycle states for vehicles */
export enum VehicleDispatchStatus {
  IN_TRANSIT = 'IN_TRANSIT',
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  AVAILABLE = 'AVAILABLE',
}

/** Reasons for dispatching a vehicle */
export enum DispatchReason {
  TRANSPORT = 'TRANSPORT',
  CLASSIFIED = 'CLASSIFIED',
  DELIVERY = 'DELIVERY',
}

/** Health attributes with their weighting scores */
export enum VehicleHealthAttributeType {
  ENGINE = 'ENGINE',
  BRAKES = 'BRAKES',
  TIRES = 'TIRES',
  LIGHTS = 'LIGHTS',
  BATTERY = 'BATTERY',
  TRANSMISSION = 'TRANSMISSION',
}

/** Special boolean flags or “wildcards” on vehicles */
export enum VehicleWildCardType {
  ENGINE_LOCKED = 'ENGINE_LOCKED',
  GPS_DISABLED = 'GPS_DISABLED',
  UNVERIFIED_VIN = 'UNVERIFIED_VIN',
  FLAGGED_FOR_INSPECTION = 'FLAGGED_FOR_INSPECTION',
  INSURANCE_IS_EXPIRED = 'INSURANCE_IS_EXPIRED',
  IN_MAINTENANCE = 'IN_MAINTENANCE',
}


// --- Supporting attribute interfaces ---

/** Mirrors VehicleHealthAttributeModel */
export interface VehicleHealthAttribute {
  /** Database ID */
  id: number;
  /** Which health metric this is (ENGINE, BRAKES, etc.) */
  attributeName: VehicleHealthAttributeType;
  /** Numeric score for that metric */
  score: number;
}

/** Mirrors VehicleWildcardAttributeModel */
export interface VehicleWildcardAttribute {
  /** Database ID */
  id: number;
  /** The wildcard key name */
  wildcardKey: VehicleWildCardType;
  /** The boolean value for this wildcard */
  wildcardValue: boolean;
}




// --- Main Vehicle interface ---


export interface VehicleDTO {
 
  id: number;
 
  vehicleIdentificationNumber: string;
 
  licensePlate: string;
 
  model: string;
 
  vehicleAcquiredYear: number;
 
  engineType: EngineType;
 
  vehicleType: VehicleType;
 
  vehicleStatus: VehicleStatus;
 
  dispatchStatus: VehicleDispatchStatus;
 
  dispatchHistory: number[];
 
  vehicleImages: string[];
 
  safetyScore: number;
 
  vehicleMetadata: string;
 
  healthAttributes: VehicleHealthAttribute[];
  
  wildcardAttributes: VehicleWildcardAttribute[];
}






export interface DispatchRequestDto {

  dispatchId : number;

  dispatchRequester: string;

  dispatchAdmin?: string;

  dispatchVehicleId: string;

  dispatchRequesterRole: string[];

  vehicleClass: VehicleStatus

  dispatchRequestTime: string;

  dispatchRequestApproveTime?: string;

  dispatchStartTime?: string;

  dispatchEndTime?: string;


  dispatchReason: DispatchReason


  dispatchStatus: DispatchStatus
  
  dispatchMetadata?: Record<string, any>;

  
  dispatchReviewScore?: number;

  userImage?: string;
  vehicleImage?: string;

  vehicleName: string;
  wildCards?: Array<Record<string, boolean>>;

  healthAttributes?: Array<Record<string, number>>;

  safetyScore: number;

  canDispatch: boolean;
}



 export interface SaveNewVehiclePopUpProps {
  model: string;
  engineType: EngineType;
  vehicleType: VehicleType;
  vehicleStatus: VehicleStatus;
  vehicleMetadata?: string;
  vehicleImages: string[];
  isGoodVehicle?: boolean;
}