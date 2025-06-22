import { DispatchRequestBody, DispatchRequestDto } from "@/types/VehicleTypes";
import { toast } from "sonner";
import { dotEnv } from "./dotEnv";
import { authFetch } from "./utils";


// Get all dispatches
export const getAllMyDispatches = async () => {
  try {
    const response = await authFetch(`${dotEnv.userDispatchesBaseUrl}/revalidate-all-me`);
    const data = await response.json();

    console.log(response);
    console.log(data);

    toast.info("Yeah these are my active Dispatches");
    return data;
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong... argggghh");
  }
};

// Get valid/active dispatches
export const getMyValidDispatches = async (): Promise<DispatchRequestDto[]> => {
  try {
    const response = await authFetch(`${dotEnv.userDispatchesBaseUrl}/revalidate-active-dispatch`);
    const data = await response.json();

    console.log(response);
    console.log(data);

    toast.info("Yeah these are my active Dispatches");
    return data.data;
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong... argggghh");
    return [];
  }
};

// Get a specific dispatch
export const getThisDispatch = async (vehicleId: string, dispatchId: number) => {
  try {
    const response = await authFetch(
      `${dotEnv.userDispatchesBaseUrl}/get-current-dispatch?dispatchId=${dispatchId}&vin=${vehicleId}`
    );
    const data = await response.json();

    console.log(response);
    console.log(data);

    toast.info("Yeah this is a current dispatch and it is gotten");
    return data.data;
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong... argggghh");
  }
};

// Make a dispatch request
export const handleDispatchRequest = async (dispatchData: DispatchRequestBody) => {
  try {
    const response = await authFetch(`${dotEnv.userDispatchesBaseUrl}/request-dispatch`, {
      method: "POST",
      body: JSON.stringify(dispatchData),
    });

    console.log(response);
    const data = await response.json();

    if (data.data === null) {
      toast("The Vehicle Can't be dispatched", {
        description: data.message,
        action: {
          label: "Explore more vehicles",
          onClick: () => (window.location.href = "/vehicles"),
        },
      });

      return data;
    }

    return data;
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong... argggghh");
  }
};
