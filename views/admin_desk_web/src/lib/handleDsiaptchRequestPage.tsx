import { DispatchRequestDto } from "@/types/VehicleTypes";
import { toast } from "sonner";
import { dotEnv } from "./dotEnv";


    export const getAllDispatchRequests  = async (active? : boolean) : Promise<DispatchRequestDto[]>  => {
            
      const baseUrl = active ? `${dotEnv.adminDispatchesBaseUrl}/get-all/active` : `${dotEnv.adminDispatchesBaseUrl}/get-all`;
    
      try {
    const response =  await fetch(baseUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"},
          credentials: "include"});

        
          console.log(response)
          const data  = await response.json();

        if(data.data !== null){
        return data.data;  
      }
        else{
        toast.error("The vehicle is data acc empty");
          return [];
        }
    } catch (error) {  
        toast.error("Somethinggg went wrong");
        return [];
    }};
        


    //actual uusage of the appi grahhhh
   export const getVehicleDispatchHistoryApi = async (vehicleVin : string) : Promise<DispatchRequestDto[] | undefined> => {
         try {

    const response =  await fetch(`${dotEnv.adminDispatchesBaseUrl}/get-vehicle-history?vehicleVin=${vehicleVin}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"},
          credentials: "include"});

        const data  = await response.json();
        if(data.data !== null){
        return data.data;
      }else{
        toast.error("The vehicle is data acc empty");
          return [];
      }
    } catch (error) {   
      toast.error("Somethinggg went wrong")}}  





    //accepting a dispatch
   export const handleDispatchAccept = async (dispatchId : number) => {
         try {

    const response =  await fetch(`${dotEnv.validateDispatchLink}?dispatchId=${dispatchId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"},
          credentials: "include"});

          console.log(response)
        const data  = await response.json();

        console.log(data)
        toast.info(data.message)
    } catch (error) {   
      toast.error("Somethinggg went wrong")}}  



      



    //rejecting a dispatch
   export const handleDispatchReject = async (dispatchId : number, reason : string) => {
         try {

    const response =  await fetch(`${dotEnv.adminDispatchesBaseUrl}/admin-cancel?dispatchId=${dispatchId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"},
          credentials: "include",
          body: JSON.stringify({dispatchReason : reason}), 
        });

        const data  = await response.json();
        console.log("Rejected dispatch " , data)
        toast.info(data.message)
    } catch (error) {   
      toast.error("Somethinggg went wrong")}}  



      


