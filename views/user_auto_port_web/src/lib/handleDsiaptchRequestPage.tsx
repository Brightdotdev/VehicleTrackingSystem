import { DispatchRequestDto, VehicleDTO } from "@/types/VehicleTypes";
import { dummyDispatchRequests, testVehicles } from "../../dummyData";
import { toast } from "sonner";
import { dotEnv } from "./dotEnv";


  /**
  ill have to like simulate an api request here to like get the data of the vehicle and the user too from like the dummy api for now to return the data for this page
  **/

 export const getVehicleByIdAndVinForDispatch = (id: number, vin: string): DispatchRequestDto | undefined => {
  return dummyDispatchRequests.find(
    (vehicle) =>
      vehicle.dispatchId === id &&
      vehicle.dispatchVehicleId === vin
  );
}

 export const getVehicleDataByVin =  (vin: string): VehicleDTO | undefined => {
  return testVehicles.find(
    (vehicle) =>
      vehicle.vehicleIdentificationNumber === vin
  );
}


 export const getVehicleDispatchHistory = (id : string) /* : DispatchRequestDto[] | undefined */ => {
  
 const finalVehicleData : DispatchRequestDto[] = []
const vehicle = testVehicles.find((vehicle) => vehicle.vehicleIdentificationNumber === id);

if (!vehicle) {
  console.log("Vehicle not found");
  return undefined;
}

console.log(JSON.stringify(vehicle))
console.log(JSON.stringify(vehicle.dispatchHistory))

 
  
        vehicle.dispatchHistory.map((value, index) =>{
      let dispatch: DispatchRequestDto | undefined = dummyDispatchRequests.find(
        (dispatchData) =>
          dispatchData.dispatchId === value);
        
        if (dispatch) {

        console.log(index)
        console.log(dispatch)
        finalVehicleData.push(dispatch);
      }
    });
    return finalVehicleData;}
    



    //actual uusage of the appi grahhhh
   export const getVehicleDispatchHistoryApi = async (vehicleVin : string) /* : DispatchRequestDto[] | undefined */ => {
         try {

    const response =  await fetch(`${dotEnv.adminDispatchesBaseUrl}/get-vehicle-history?vehicleVin=${vehicleVin}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"},
          credentials: "include"});

        const data  = await response.json();
        console.log(response)
        console.log(data)
        toast.info("Yeah these are all the Dispatche history")
        return data;
    } catch (error) {   
      console.log(error) 
        toast.error("Somethinggg went wrong")}}  




