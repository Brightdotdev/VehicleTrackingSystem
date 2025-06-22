import { DispatchRequestDto } from "@/types/VehicleTypes";
import { toast } from "sonner";
import { dotEnv } from "./dotEnv";
import { authFetch } from "./utils";


// Get all dispatch requests (optionally filter for active only)
export const getAllDispatchRequests = async (active?: boolean): Promise<DispatchRequestDto[]> => {
  const baseUrl = active
    ? `${dotEnv.adminDispatchesBaseUrl}/get-all/active`
    : `${dotEnv.adminDispatchesBaseUrl}/get-all`;

  try {
    const response = await authFetch(baseUrl);
    const data = await response.json();

    toast.info("Vehicle requests are ready");
    console.log(data);

    return data.data;
  } catch (error) {
    toast.error("Something went wrong while fetching dispatch requests");
    return [];
  }
};

// Get dispatch history for a specific vehicle
export const getVehicleDispatchHistoryApi = async (
  vehicleVin: string
): Promise<DispatchRequestDto[] | undefined> => {
  try {
    const response = await authFetch(
      `${dotEnv.adminDispatchesBaseUrl}/get-vehicle-history?vehicleVin=${vehicleVin}`
    );
    const data = await response.json();

    toast.info("Dispatch history retrieved successfully");
    return data.data;
  } catch (error) {
    toast.error("Something went wrong while fetching vehicle dispatch history");
  }
};

// Accept a dispatch
export const handleDispatchAccept = async (
  dispatchId: number
): Promise<DispatchRequestDto[] | undefined> => {
  try {
    const response = await authFetch(
      `${dotEnv.adminDispatchesBaseUrl}/v1/admin/dispatch/validate?dispatchId=${dispatchId}`,
      { method: "PUT" }
    );
    const data = await response.json();

    toast.info("Dispatch accepted successfully");
    return data.data;
  } catch (error) {
    toast.error("Something went wrong while accepting dispatch");
  }
};

// Reject a dispatch with reason
export const handleDispatchReject = async (
  dispatchId: number,
  reason: string
): Promise<DispatchRequestDto[] | undefined> => {
  try {
    const response = await authFetch(
      `${dotEnv.adminDispatchesBaseUrl}/v1/admin/dispatch/admin-cancel?dispatchId=${dispatchId}`,
      {
        method: "PUT",
        body: JSON.stringify({ dispatchReason: reason }),
      }
    );
    const data = await response.json();

    toast.info("Dispatch rejected successfully");
    return data.data;
  } catch (error) {
    toast.error("Something went wrong while rejecting dispatch");
  }
};
