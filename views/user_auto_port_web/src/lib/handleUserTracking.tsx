import { CheckPoint, createCheckPoint, NotificationData } from "@/types/utilTypes";
import { dotEnv } from "./dotEnv";
import { toast } from "sonner";




export const handleDispatchValidatedTracking  = async (notification : NotificationData , loading :boolean , setLoading : (loading : boolean) => void) => {
        setLoading(true);

    console.log( "Yeah this is the handle dispatch validated tracking notification")
    console.log(notification)
    const userLocation  = await getUsersLocation(setLoading);
    toast.info(JSON.stringify(userLocation))
    
    try {
        toast.info("Yayyy Tracking finally");
        const response = await fetch(`${dotEnv.userTrackingBaseUrl}/start/${notification.dispatchId}`,{
          method: "PUT",
          headers: {
            "Content-Type": "application/json"},
            credentials: "include"  , body : JSON.stringify(userLocation)});
          console.log(response)

          
          const data  = await response.json();
            console.log(data)
          if(data.data === null) {
            toast.error(data.message)
            return data;
          }else{
            toast.info(data.message)
            return data.data;
          }}
       catch (error) {
        console.log(error)}
    
    
    }



export const getUsersLocation = async (
  setLoading: (loading: boolean) => void
): Promise<CheckPoint | undefined> => {
  setLoading(true);

  if (!navigator.geolocation) {
    toast.error("Geolocation is not supported by your browser.");
    setLoading(false);
    return;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const checkpoint = createCheckPoint(latitude, longitude);
          resolve(checkpoint);
        } catch (err: any) {
          toast.error(err.message || "Failed to create CheckPoint");
          resolve(undefined);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        toast.error("Location permission denied or unavailable.");
        setLoading(false);
        resolve(undefined);
      }
    );
  });
};