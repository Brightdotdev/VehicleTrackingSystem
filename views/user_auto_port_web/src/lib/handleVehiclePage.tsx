import { VehicleDTO } from "@/types/VehicleTypes";
import { dotEnv } from "./dotEnv";
import { toast } from "sonner";
import { authFetch } from "./utils";


// Get all vehicles
export const getAllVehicles = async (): Promise<VehicleDTO[]> => {
  try {
    const response = await authFetch(dotEnv.userVehicleBaseUrl);
    const data = await response.json();

    toast.info("The vehicle data are ready");
    console.log(data);

    return data.data;
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong while fetching vehicles");
    return [];
  }
};

// Get vehicle by VIN
export const getVehicleByVin = async (vin: string): Promise<VehicleDTO | undefined> => {
  try {
    const response = await authFetch(`${dotEnv.userVehicleBaseUrl}/get-by-vin?vin=${vin}`);
    const data = await response.json();

    console.log(response);
    console.log(data);

    toast.info("Vehicle retrieval successful");
    return data.data;
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong while fetching vehicle by VIN");
    return undefined;
  }
};
