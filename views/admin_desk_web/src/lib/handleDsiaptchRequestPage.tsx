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

        const data  = await response.json();
        toast.info("Vehicle requests are ready")
        console.log(data);
        return data.data;
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
        toast.info("Dispatch history retrieved successfully")
        return data.data;
    } catch (error) {   
      toast.error("Somethinggg went wrong")}}  





    //accepting a dispatch
   export const handleDispatchAccept = async (dispatchId : number) : Promise<DispatchRequestDto[] | undefined> => {
         try {

    const response =  await fetch(`${dotEnv.adminDispatchesBaseUrl}/v1/admin/dispatch/validate?dispatchId=${dispatchId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"},
          credentials: "include"});

        const data  = await response.json();
        toast.info("Dispatch history retrieved successfully")
        return data.data;
    } catch (error) {   
      toast.error("Somethinggg went wrong")}}  



      



    //rejecting a dispatch
   export const handleDispatchReject = async (dispatchId : number, reason : string) : Promise<DispatchRequestDto[] | undefined> => {
         try {

    const response =  await fetch(`${dotEnv.adminDispatchesBaseUrl}/v1/admin/dispatch/admin-cancel?dispatchId=${dispatchId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"},
          credentials: "include",
          body: JSON.stringify({dispatchReason : reason}), 
        });

        const data  = await response.json();
        toast.info("Dispatch history retrieved successfully")
        return data.data;
    } catch (error) {   
      toast.error("Somethinggg went wrong")}}  



      


