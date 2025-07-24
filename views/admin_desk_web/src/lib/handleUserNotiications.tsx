import { toast } from "sonner";
import { dotEnv } from "./dotEnv";

export const  pollNotifications = async (
      lastChecked : string , setLastChecked : (lastChecked : string) => void) => {
       const  response = await fetch(`${dotEnv.notificationBaseUrl}/new-after?since=${lastChecked}`,
       {   method: "GET",
           headers: {
          "Content-Type": "application/json"},
          credentials: "include"})
      
          
          const data = await response.json();
          console.log("notificcation response" , response)
          console.log("data response for the after notifications and stuff" , data)
          
          const {code , success , message , data : notifications} = data;

          if(success || code === 200){
          const now = new Date().toISOString().replace("Z", "");
          setLastChecked(now);
            return notifications;
          }else{
            toast.error(message)
            return [] 
          }
      
        }


const setNotiicationToRead = () => {
    
}

export const getAdminNotifications = async () => {

    const  response = await fetch(`${dotEnv.notificationBaseUrl}`,
       {   method: "GET",
           headers: {
          "Content-Type": "application/json"},
          credentials: "include"})
       
          const data = await response.json();
          console.log("data response of all my notifications" , data)
            const  {code , success , message , data : notifications} = data;

            if(success || code === 200){
              return notifications;
            }
            else{
              toast.error(message)
              return [] 
            }
        }



        
export const setNotificationToRead = async (id : string) => {

  const setToRead = {
    notifId : id
  }
        const  response = await fetch(`${dotEnv.notificationBaseUrl}/set-read`,
       {   method: "POST",
           headers: {
          "Content-Type": "application/json"},
          body : JSON.stringify(setToRead),
          credentials: "include"})
       
          const data = await response.json();
          console.log(data)
            const  {code , success , message , data : notifications} = data;
            if(success || code === 200){
              return notifications;
            }
            else{
              toast.error(message)
              return [] 
            }
}
