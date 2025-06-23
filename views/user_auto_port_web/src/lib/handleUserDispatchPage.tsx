import { DispatchRequestBody, DispatchRequestDto} from "@/types/VehicleTypes";
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

    console.log(response);
    console.log(data);

    toast.info("Yeah these are my active Dispatches");

    return data.data; // Ensure data.data is of type DispatchRequestDto[]
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong...argggghh");
    return []; // Return empty array to satisfy return type
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
        toast.info("Yeah this is a current dispatch and it is gotten")
        return data.data;
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
          if(data.data === null) {
            console.log(data.data)

                  toast("The Vehicle Can't be dispatched", {
          description: data.message,
          action: {
            label: "Explore more vehicles",
            onClick: () => window.location.href = "/vehicles",
          },
        })

            console.log(data.message)
            return data;
          }
          console.log(data)
          return data;
        }
       catch (error) {
        console.log(error)
        }
      }
        