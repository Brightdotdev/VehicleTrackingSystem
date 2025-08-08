import { DispatchReason, DispatchRequestBody, DispatchRequestDto, VehicleStatus} from "@/types/VehicleTypes";
import { toast } from "sonner";
import { dotEnv } from "./dotEnv";
import { dispatchCostResponse } from "@/types/utilTypes";




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
        
          
      if(data.data !==  null){
        toast.info(data.message)
        return data.data;
        }else{
      toast.error("You have No Dispatch History?")
      toast.error(data.message)
      return []
    }


      } catch (error) {
        console.log(error)
        toast.error("Somethinggg went wrong...argggghh")
      return []
  
      }
    }



// Get all valid/active dispatches
export const getMyValidDispatches = async (): Promise<DispatchRequestDto[]> => {
  try {
    const response = await fetch(`${dotEnv.userDispatchesBaseUrl}/revalidate-active-dispatch`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();
    if(data.data !==  null){
    return data.data;
    }else{
      toast.error(data.message)
      return []
    }

  } catch (error) {
    console.error(error);
    toast.error("Something went wrong...argggghh");
    return [];
  }
};


    
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

            if(data.data !== null){
        return data.data;
            }else{
              toast.error("There was an issue getting this dispatch")
              toast.error(data.message)
              return []
            }
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
          console.log(response)

          const data  = await response.json();
            console.log(data)
            toast.info(data.message)

          if(data.data === null) {

          toast("The Vehicle Can't be dispatched", {
          description: data.message,
          action: {
            label: "Explore more vehicles",
            onClick: () => window.location.href = "/vehicles",
          },
        })
            return data;
          }
          console.log(data)
          return data.data;
        }
       catch (error) {
        console.log(error)
        }
      }

      
  export const handleTerminateDispatch = async (dispatchId : number, vehcileVin : string) => {

      try {
        toast.info("Terminating dispatch");
        const response = await fetch(`${dotEnv.userDispatchesBaseUrl}/user-cancel?dispatchId=${dispatchId}&vin=${vehcileVin}`,{
          method: "PUT",
          headers: {
            "Content-Type": "application/json"},
            credentials: "include"});
          console.log(response)

          const data  = await response.json();
 
          toast.info(data.message)
            console.log(data)
        }
       catch (error) {
        console.log(error)}}



const calculateDispatchPrice = (dispatchRequestBody: DispatchRequestBody) => {
  const costPerDay = Number(dotEnv.costPerDay ?? 0 );
  if (isNaN(costPerDay)) throw new Error("Invalid costPerDay in .env");


  const start = new Date(dispatchRequestBody.dispatchRequestTime);
  const end = new Date(dispatchRequestBody.dispatchEndTime);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid dispatch start or end time");
  }

  const diffInMs = end.getTime() - start.getTime();
  const totalHours = diffInMs / (1000 * 60 * 60);
  const halfDayBlocks = Math.ceil(totalHours / 12);
  const totalDays = halfDayBlocks * 0.5;
  const totalScoreForDays = totalDays * costPerDay;

  let vehicleClassScore = 0;
  let dispatchReasonScore = 0;

  switch (dispatchRequestBody.vehicleStatus) {
    case VehicleStatus.CLASSIFIED:
      vehicleClassScore = 1000;
      break;
    case VehicleStatus.CARGO:
      vehicleClassScore = 300;
      break;
    case VehicleStatus.REGULAR:
      vehicleClassScore = 200;
      break;
    case VehicleStatus.TRANSPORT:
      vehicleClassScore = 400;
      break;
  }

  switch (dispatchRequestBody.dispatchReason) {
    case DispatchReason.CLASSIFIED:
      dispatchReasonScore = 1000;
      break;
    case DispatchReason.DELIVERY:
      dispatchReasonScore = 200;
      break;
    case DispatchReason.TRANSPORT:
      dispatchReasonScore = 150;
      break;
  }

  return dispatchReasonScore + vehicleClassScore + totalScoreForDays;
};


        export const calculateDispatchCost = (requestBody : DispatchRequestBody) : dispatchCostResponse  =>   {
          
       const dispatchPrice : number = calculateDispatchPrice(requestBody);
   
    
console.log("userDispatchScore:", requestBody.userDispatchScore);
console.log("dispatchPrice:", dispatchPrice);

        const costAfterPay : number = requestBody.userDispatchScore - dispatchPrice;

    const response = {
  isEnough: costAfterPay > 0,
  finalUserScore: costAfterPay,
  price: dispatchPrice,
};
return response;}

    