import { CheckPoint, createCheckPoint, NotificationData } from "@/types/utilTypes";
import { dotEnv } from "./dotEnv";
import { toast } from "sonner";




export const handleDispatchValidatedTracking  = async (dispatchId  : number, setLoading : (loading : boolean) => void, setWorked : (worked : boolean) => void) => {
        
    setLoading(true);
    const userLocation  = await getUsersLocation(setLoading);
    
  
    if(userLocation === undefined || userLocation === null) {
      toast.error("We cant seem to get your exact loacation...the dispatch cant be processed")
      return setWorked(false);
    }
    
    
    try {
      
        const response = await fetch(`${dotEnv.userTrackingBaseUrl}/start/${dispatchId}`,{
          method: "PUT",
          headers: {
            "Content-Type": "application/json"},
            credentials: "include"  , body : JSON.stringify(userLocation)});
          console.log(response)

          
          const data  = await response.json();
            console.log(data)
          if(data.data === null) {
            toast.error(data.message)
            setWorked(false)
            return data;
          }else{
            toast.info(data.message)
            setWorked(true);
            setLoading(false);
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