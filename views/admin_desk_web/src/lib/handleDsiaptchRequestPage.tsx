import { DispatchRequestDto } from "@/types/VehicleTypes";
import { toast } from "sonner";
import { dotEnv } from "./dotEnv";

// ✅ Centralized default fetch settings
const defaultFetchOptions = {
  headers: { "Content-Type": "application/json" },
  credentials: "include" as const,
};

// ✅ Get all dispatch requests (optionally only active)
export const getAllDispatchRequests = async (
  active?: boolean
): Promise<DispatchRequestDto[]> => {
  const baseUrl = active
    ? `${dotEnv.adminDispatchesBaseUrl}/get-all/active`
    : `${dotEnv.adminDispatchesBaseUrl}/get-all`;

  try {
    const response = await fetch(baseUrl, {
      method: "GET",
      ...defaultFetchOptions,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch dispatches");

    return data?.data ?? [];
  } catch (error: any) {
    toast.error(error.message || "Something went wrong while fetching dispatch data.");
    console.error(error);
    return [];
  }
};

// ✅ Get dispatch history for a vehicle
export const getVehicleDispatchHistoryApi = async (
  vehicleVin: string
): Promise<DispatchRequestDto[]> => {
  try {
    const response = await fetch(
      `${dotEnv.adminDispatchesBaseUrl}/get-vehicle-history?vehicleVin=${vehicleVin}`,
      {
        method: "GET",
        ...defaultFetchOptions,
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch vehicle history");

    if (!data.data || data.data.length === 0) {
      toast.error("The vehicle has no dispatch history.");
      return [];
    }

    return data.data;
  } catch (error: any) {
    toast.error(error.message || "Something went wrong while fetching history");
    console.error(error);
    // Redirect only if it's an authentication issue
    if (error.message?.toLowerCase().includes("unauthorized")) {
      window.location.replace("/");
    }
    return [];
  }
};

// ✅ Accept a dispatch
export const handleDispatchAccept = async (dispatchId: number) => {
  try {
    const response = await fetch(
      `${dotEnv.validateDispatchLink}?dispatchId=${dispatchId}`,
      {
        method: "PUT",
        ...defaultFetchOptions,
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to accept dispatch");

    toast.info(data.message);
  } catch (error: any) {
    toast.error(error.message || "Something went wrong while accepting dispatch");
    console.error(error);
    if (error.message?.toLowerCase().includes("unauthorized")) {
      window.location.replace("/");
    }
  }
};

// ✅ Reject a dispatch
export const handleDispatchReject = async (dispatchId: number, reason: string) => {
  try {
    const response = await fetch(
      `${dotEnv.adminDispatchesBaseUrl}/admin-cancel?dispatchId=${dispatchId}`,
      {
        method: "PUT",
        ...defaultFetchOptions,
        body: JSON.stringify({ dispatchReason: reason }),
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to reject dispatch");

    toast.info(data.message);
  } catch (error: any) {
    toast.error(error.message || "Something went wrong while rejecting dispatch");
    console.error(error);
    if (error.message?.toLowerCase().includes("unauthorized")) {
      window.location.replace("/");
    }
  }
};
