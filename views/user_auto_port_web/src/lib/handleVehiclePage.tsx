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

        const data  = await response.json();
        toast.info("The vehicle Data are ready")
        console.log(data);
        return data.data;
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

        const data  = await response.json();
        console.log(response)
        console.log(data)
        toast.info("Vehicle Retrival Successful")
        return data.data;
    } catch (error) {   
      console.log(error) 
        toast.error("Somethinggg went wrong")
        return undefined;
    }
  };




  