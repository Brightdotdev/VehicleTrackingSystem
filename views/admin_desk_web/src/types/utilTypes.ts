

export type componentTypes  = {
    vehicleComponent :   "requests" | "vehicles"
}




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

 enum notificationType{
       INFO,
        WARNING,
        SUCCESS,
        DISPATCH_CREATED_ADMIN,
        DANGER
 }
