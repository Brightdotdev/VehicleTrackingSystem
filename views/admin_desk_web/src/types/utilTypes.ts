

export type componentTypes  = {
    vehicleComponent :   "requests" | "vehicles"
}

export type LatLng = [number, number];



export  interface NotificationData {
  dispatchId? : string | null ;
  vehicleId? : string | null ;
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
  DANGER = "DANGER"
}
