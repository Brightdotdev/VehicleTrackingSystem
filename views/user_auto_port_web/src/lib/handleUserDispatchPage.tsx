import { DispatchRequestBody} from "@/types/VehicleTypes";
import { toast } from "sonner";
import { dotEnv } from "./dotEnv";




///////main content






        export const getAllMyDIspatches = async () => {
      try {
    const response =  await fetch(`${dotEnv.userDispatchesBaseUrl}/revalidate-all-me`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json"},
          credentials: "include"});


        const data  = await response.json();
        console.log(response)
        console.log(data)
        toast.info("Yeah these are my active the Dispatchs")
        return data;
      } catch (error) {
        console.log(error)
        toast.error("Somethinggg went wrong...argggghh")
      }
    }




  // get my valid dispatches
    export const getMyValidDIspatches = async () => {
      try {

    const response =  await fetch(`${dotEnv.userDispatchesBaseUrl}/revalidate-active-dispatch`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json"},
          credentials: "include"});


        const data  = await response.json();
        console.log(response)
        console.log(data)
        toast.info("Yeah these are my active the Dispatchs")
        return data.data;
      } catch (error) {
        console.log(error)
        toast.error("Somethinggg went wrong...argggghh")
      }
    }




    
  // get my valid dispatches
    export const getThisDispatch = async (vehicleId :string , dispatchId : number) => {
      try {

    const response =  await fetch(`${dotEnv.userDispatchesBaseUrl}/get-current-dispatch?dispatchId=${dispatchId}&vin=${vehicleId}`,{

          method: "GET",
          headers: {
            "Content-Type": "application/json"},
          credentials: "include"});


        const data  = await response.json();
        console.log(response)
        console.log(data)
        toast.info("Yeah this is a current dispatch and it is gotten")
        return data;
      } catch (error) {
        console.log(error)
        toast.error("Somethinggg went wrong...argggghh")
      }
    }


  

    export const handleDispatchRequest  =  async (dispatchData : DispatchRequestBody) => {
      try {
        const response = await fetch(`${dotEnv.userDispatchesBaseUrl}/request-dispatch`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json"},
          body: JSON.stringify(dispatchData),
          credentials: "include"});
          const data  = await response.json();
          console.log(response)
          console.log(data)
          console.log(data.data)
          toast.info("Yeah the requeest was made alright...")
          return data;
        }
       catch (error) {
        console.log(error)
        }
      }
        