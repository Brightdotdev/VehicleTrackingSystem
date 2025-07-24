import { DispatchRequestDto, FormProps, SaveNewVehiclePopUpProps, VehicleDTO } from "@/types/VehicleTypes";
import { dotEnv } from "./dotEnv";
import { toast } from "sonner";


// save vehicle a new sexy one too grah

   export  const handleSaveVehicleForm =  async (form : FormProps, 
    setOpen : (open : boolean) => void,
        setLoading: (loading : boolean) => void,
  
  )  => {
    
    const vehicleUrl = form.isGoodVehicle ? `${dotEnv.adminVehicleBaseUrl}/new` : 
    `${dotEnv.adminVehicleBaseUrl}/new/bad`


    
    const vehicleApiData: SaveNewVehiclePopUpProps = {
      model: form.model,
      engineType: form.engineType,
      vehicleType: form.vehicleType,
      vehicleStatus: form.vehicleStatus,
      vehicleMetadata: form.vehicleMetadata,
      vehicleImages: form.vehicleImages,
      vehicleLocation: {
        latitude: form.location.latitude,
        longitude: form.location.longitude,
        timeStamp: form.location.timestamp,
      },
    };


    try {    
    const response =  await fetch(vehicleUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", 
          body: JSON.stringify(vehicleApiData), 
        });
        const data  = await response.json();
        console.log(data)
        toast.info("Yeah We saved the new Vehicle")
        toast.info(data.message)
        setOpen(false)
        setLoading(false)
        
    } catch {    
        toast.error("Somethinggg went wrong")}};



    export const getAllVehicles  = async () : Promise<VehicleDTO[]>  => {
         try {
    const response =  await fetch(dotEnv.adminVehicleBaseUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"},
          credentials: "include"});

        const data  = await response.json();
        return data.data;
    } catch {  
        toast.error("Somethinggg went wrong");
        return [];
    }};
        


        // get the vehicle by it's vin
export const getVehicleByVin  = async (vin : string)  : Promise<VehicleDTO | undefined>  => {
         try {
    const response =  await fetch(`${dotEnv.adminVehicleBaseUrl}/${vin}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"},
          credentials: "include"});

        const data  = await response.json();
        return data.data;
    } catch {   
        toast.error("Somethinggg went wrong")
        return undefined;
    }
  };




        // get the dispatch by it's id
export const getDispatchRequest  = async (dispatchRequstid : number, vehcileId : string)  : Promise<DispatchRequestDto | undefined>  => {
         try {
    const response =  await fetch(`${dotEnv.adminDispatchesBaseUrl}/get-dispatch-by-id-and-vin?dispatchId=${dispatchRequstid}&vehicleId=${vehcileId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"},
          credentials: "include"});

        const data  = await response.json();
        return data.data;
    } catch {   
        toast.error("Somethinggg went wrong")
        return undefined;
    }
  };





      // get all dispatchhes
    
          export const getAllDispatches = async () /*: DispatchRequestDto[]*/ => {
         try {

    const response =  await fetch(`${dotEnv.adminDispatchesBaseUrl}/get-all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"},
          credentials: "include"});

        const data  = await response.json();
        return data;
    } catch {   
        toast.error("Somethinggg went wrong")}};
        


        // get dispatch by it's id and the vin
         export const getDispatchByVinAndId  = async (vin : string, id : number) /* : DispatchRequestDto */ => {
         try {
    const response =  await fetch(`${dotEnv.adminDispatchesBaseUrl}/get-dispatch-by-id-and-vin?dispatchId=${id}&vehicleId=${vin}`,{

          method: "GET",
          headers: {
            "Content-Type": "application/json"},
          credentials: "include"});

        const data  = await response.json();
        
        return data;
    } catch {  
       toast.error("Somethinggg went wrong")}};