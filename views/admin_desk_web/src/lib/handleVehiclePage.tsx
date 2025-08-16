import { DispatchRequestDto, FormProps, SaveNewVehiclePopUpProps, VehicleDTO } from "@/types/VehicleTypes";
import { dotEnv } from "./dotEnv";
import { toast } from "sonner";

// Helper function for fetch options
const defaultFetchOptions = {
  headers: { "Content-Type": "application/json" },
  credentials: "include" as const,
};

// ✅ Save a new vehicle
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
    setLoading(true);
    const response = await fetch(vehicleUrl, {
      method: "POST",
      ...defaultFetchOptions,
      body: JSON.stringify(vehicleApiData),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Failed to save vehicle");

    toast.info(data.message);
    setOpen(false);
  } catch (err: any) {
    toast.error(err.message || "Something went wrong while saving vehicle");
  } finally {
    setLoading(false);
  }
};

// ✅ Get all vehicles
export const getAllVehicles = async (): Promise<VehicleDTO[]> => {
  try {
    const response = await fetch(dotEnv.adminVehicleBaseUrl, {
      method: "GET",
      ...defaultFetchOptions,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch vehicles");

    return data.data;
  } catch (err: any) {
    toast.error(err.message || "Error fetching vehicles");
    return [];
  }
};

// ✅ Get vehicle by VIN
export const getVehicleByVin = async (vin: string): Promise<VehicleDTO | undefined> => {
  try {
    const response = await fetch(`${dotEnv.adminVehicleBaseUrl}/${vin}`, {
      method: "GET",
      ...defaultFetchOptions,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch vehicle");

    return data.data;
  } catch (err: any) {
    toast.error(err.message || "Error fetching vehicle by VIN");
    return undefined;
  }
};

// ✅ Get dispatch request by ID & vehicle ID
export const getDispatchRequest = async (
  dispatchRequestId: number,
  vehicleId: string
): Promise<DispatchRequestDto | undefined> => {
  try {
    const response = await fetch(
      `${dotEnv.adminDispatchesBaseUrl}/get-dispatch-by-id-and-vin?dispatchId=${dispatchRequestId}&vehicleId=${vehicleId}`,
      { method: "GET", ...defaultFetchOptions }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch dispatch request");

    return data.data;
  } catch (err: any) {
    toast.error(err.message || "Error fetching dispatch request");
    return undefined;
  }
};

// ✅ Get all dispatches
export const getAllDispatches = async (): Promise<DispatchRequestDto[]> => {
  try {
    const response = await fetch(`${dotEnv.adminDispatchesBaseUrl}/get-all`, {
      method: "GET",
      ...defaultFetchOptions,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch dispatches");

    return data.data;
  } catch (err: any) {
    toast.error(err.message || "Error fetching dispatches");
    return [];
  }
};

// ✅ Get dispatch by VIN & ID
export const getDispatchByVinAndId = async (
  vin: string,
  id: number
): Promise<DispatchRequestDto | undefined> => {
  try {
    const response = await fetch(
      `${dotEnv.adminDispatchesBaseUrl}/get-dispatch-by-id-and-vin?dispatchId=${id}&vehicleId=${vin}`,
      { method: "GET", ...defaultFetchOptions }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch dispatch");

    return data.data;
  } catch (err: any) {
    toast.error(err.message || "Error fetching dispatch by VIN & ID");
    return undefined;
  }
};
