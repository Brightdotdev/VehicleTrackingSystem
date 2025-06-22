// src/lib/api/adminVehicle.ts
import {
  DispatchRequestDto,
  FormProps,
  SaveNewVehiclePopUpProps,
  VehicleDTO,
} from "@/types/VehicleTypes";
import { dotEnv } from "./dotEnv";
import { toast } from "sonner";
import { authFetch } from "./utils";

// Save a new vehicle (good or bad)
export const handleSaveVehicleForm = async (
  form: FormProps,
  setOpen: (open: boolean) => void,
  setLoading: (loading: boolean) => void
) => {
  const vehicleUrl = form.isGoodVehicle
    ? `${dotEnv.adminVehicleBaseUrl}/new`
    : `${dotEnv.adminVehicleBaseUrl}/new/bad`;

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
    const response = await authFetch(vehicleUrl, {
      method: "POST",
      body: JSON.stringify(vehicleApiData),
    });

    const data = await response.json();
    console.log(data);
    toast.info("Yeah, we saved the new vehicle.");
    setOpen(false);
    setLoading(false);
  } catch {
    toast.error("Something went wrong.");
    setLoading(false);
  }
};

// Get all vehicles
export const getAllVehicles = async (): Promise<VehicleDTO[]> => {
  try {
    const response = await authFetch(dotEnv.adminVehicleBaseUrl, {
      method: "GET",
    });

    const data = await response.json();
    toast.info("The vehicle data are ready.");
    return data.data;
  } catch {
    toast.error("Something went wrong.");
    return [];
  }
};

// Get vehicle by VIN
export const getVehicleByVin = async (
  vin: string
): Promise<VehicleDTO | undefined> => {
  try {
    const response = await authFetch(`${dotEnv.adminVehicleBaseUrl}/${vin}`, {
      method: "GET",
    });

    const data = await response.json();
    toast.info("Vehicle retrieval successful.");
    return data.data;
  } catch {
    toast.error("Something went wrong.");
    return undefined;
  }
};

// Get dispatch by ID and vehicle ID
export const getDispatchRequest = async (
  dispatchId: number,
  vehicleId: string
): Promise<DispatchRequestDto | undefined> => {
  try {
    const response = await authFetch(
      `${dotEnv.adminDispatchesBaseUrl}/get-dispatch-by-id-and-vin?dispatchId=${dispatchId}&vehicleId=${vehicleId}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();
    toast.info("Dispatch retrieval successful.");
    return data.data;
  } catch {
    toast.error("Something went wrong.");
    return undefined;
  }
};

// Get all dispatches
export const getAllDispatches = async () => {
  try {
    const response = await authFetch(`${dotEnv.adminDispatchesBaseUrl}/get-all`, {
      method: "GET",
    });

    const data = await response.json();
    toast.info("Here are all the dispatches.");
    return data;
  } catch {
    toast.error("Something went wrong.");
  }
};

// Get dispatch by VIN and ID
export const getDispatchByVinAndId = async (
  vin: string,
  id: number
) => {
  try {
    const response = await authFetch(
      `${dotEnv.adminDispatchesBaseUrl}/get-dispatch-by-id-and-vin?dispatchId=${id}&vehicleId=${vin}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();
    toast.info("Here's the single dispatch you requested, boss.");
    return data;
  } catch {
    toast.error("Something went wrong.");
  }
};
