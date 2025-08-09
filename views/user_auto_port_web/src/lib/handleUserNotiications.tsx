import { toast } from "sonner";
import { dotEnv } from "./dotEnv";
import { getMyData } from "./handleUserAuth";

export const  pollNotifications = async ( lastChecked : string , setLastChecked : (lastChecked : string) => void) => {
      
        try {


          
      console.log("Yeah this is actually happening")
    const userDara = await getMyData()
    console.log(userDara)
      if(userDara === undefined) {
        console.log("Not a validated user")
        return [] }


           const  response = await fetch(`${dotEnv.userNotificationBaseUrl}/new-after?since=${lastChecked}`,
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
              toast.error("This is what is looping the the poll")
            toast.error(message)
            return [] 
          }
        } catch (error) {
          console.log(error)
        }
      
        }


export const markNofiticationAsReadApi = async (id : string) => {

  try {
  const setToRead = {
    notifId : id
  }
        const  response = await fetch(`${dotEnv.userNotificationBaseUrl}/set-read`,
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
  } catch (error) {
    console.log(error)
  }

}

export const getAllMyNotifications = async (
   isAuthenticated : boolean ,setIsAuthenticated : (isAuthenticated : boolean) => void
) => {


    try {
      
             if(!isAuthenticated){            
    
      const userDara = await getMyData()
      console.log(userDara)
      if(userDara === undefined) {
        setIsAuthenticated(false)
        return [] 
      }else{
      setIsAuthenticated(true)}}
  
      
    const  response = await fetch(`${dotEnv.userNotificationBaseUrl}/get-all-me`,
       {   method: "GET",
           headers: {
          "Content-Type": "application/json"},
          credentials: "include"})
       
          const data = await response.json();

          console.log("data response of all my notifications" , data)
            const {code , success , message , data : notifications} = data;

            if(success || code === 200){
              return notifications;
            }
            else{
              toast.error("This is what is looping the getallmynotifications")
              toast.error(message)
              return [] 
            }
    } catch (error) {
      console.log(error);
    }

        }