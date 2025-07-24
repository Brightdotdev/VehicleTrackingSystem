import { VehicleDTO } from "@/types/VehicleTypes";
import { dotEnv } from "./dotEnv";
import { toast } from "sonner";

    export const getAllVehicles  = async () : Promise<VehicleDTO[]>  => {
         try {
    const response =  await fetch(dotEnv.userVehicleBaseUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"},
          credentials: "include"});
          const data = await response.json();
          if (data && data.data) {
              return data.data;
          } else {
              toast.error("No vehicle data found");
              return [];
          }
    } catch (error) {  
      console.log(error)  
        toast.error("Somethinggg went wrong");
        return [];
    }};
        


        // get the vehicle by it's vin
export const getVehicleByVin  = async (vin : string)  : Promise<VehicleDTO | undefined>  => {
         try {
    const response =  await fetch(`${dotEnv.userVehicleBaseUrl}/get-by-vin?vin=${vin}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"},
          credentials: "include"});

        const data = await response.json();
        console.log(response);
        console.log(data);
        if (data && data.data) {
            return data.data;
        } else {
            toast.error("Vehicle not found");
            return undefined;
        }
    } catch (error) {   
      console.log(error) 
        toast.error("Somethinggg went wrong")
        return undefined;
    }
  };




  