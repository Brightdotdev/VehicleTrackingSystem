import { DispatchRequestDto, SaveNewVehiclePopUpProps, VehicleDTO } from "@/types/VehicleTypes";
import { dotEnv } from "./dotEnv";
import { toast } from "sonner";


// save vehicle a new sexy one too grah

   export  const handleSaveVehicleForm =  async (e: React.FormEvent, form : SaveNewVehiclePopUpProps, setOpen : (open : boolean) => void)  => {
    e.preventDefault();
    
    const vehicleUrl = form.isGoodVehicle ? `${dotEnv.adminVehicleBaseUrl}/new` : 
    `${dotEnv.adminVehicleBaseUrl}/new/bad`


    try {    
    const response =  await fetch(vehicleUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", 
          body: JSON.stringify(form), 
        });
        const data  = await response.json();
        console.log(response)
        console.log(data)
        toast.info("Yeah We saved the new Vehicle")
        setOpen(false)
    } catch (error) {    
        toast.error("Somethinggg went wrong")}};



    export const getAllVehicles  = async () /* : VehicleDTO[]  */ => {
         try {
    const response =  await fetch(dotEnv.adminVehicleBaseUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"},
          credentials: "include"});

        const data  = await response.json();
        console.log(response)
        console.log(data)
        toast.info("Yeah these are all the vehicles")
        return data;
    } catch (error) {  
      console.log(error)  
        toast.error("Somethinggg went wrong")}};
        


        // get the vehicle by it's vin
    export const getVehicleByVin  = async (vin : string)  /* : VehicleDTO  */ => {
         try {
    const response =  await fetch(`${dotEnv.adminVehicleBaseUrl}/${vin}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"},
          credentials: "include"});

        const data  = await response.json();
        console.log(response)
        console.log(data)
        toast.info("Yeah these are all the vehicles")
        return data;
    } catch (error) {   
      console.log(error) 
        toast.error("Somethinggg went wrong")}};

            




      // get all dispatchhes
    
          export const getAllDispatches = async () /*: DispatchRequestDto[]*/ => {
         try {

    const response =  await fetch(`${dotEnv.adminDispatchesBaseUrl}/get-all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"},
          credentials: "include"});

        const data  = await response.json();
        console.log(response)
        console.log(data)
        toast.info("Yeah these are all the Dispatches")
        return data;
    } catch (error) {   
      console.log(error) 
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
        console.log(response)
        console.log(data)
        toast.info("Yeah this is the single dispatch you reqquested for boss")
        return data;
    } catch (error) {  
      console.log(error)  
        toast.error("Somethinggg went wrong")}};