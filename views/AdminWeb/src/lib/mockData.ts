import type { VehicleData } from '../components/VehicleCard';

// TODO: Replace all this mock data with actual API calls when backend is ready
// This file should be replaced with actual API service functions

// Mock vehicle data - replace with API call to /api/vehicles
export const mockVehicles: VehicleData[] = [
  {
    id: "vehicle-1",
    name: "Toyota Camry",
    status: "Active",
    inTransit: true,
    healthScore: 64,
    dispatchable: true,
    wildCards: "NONE",
    imageUrl: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=facearea&w=400&h=200",
    engineType: "Diesel",
    vehicleType: "Sedan",
  },
  {
    id: "vehicle-2", 
    name: "Honda Civic",
    status: "Active",
    inTransit: true,
    healthScore: 80,
    dispatchable: false,
    wildCards: "BAD GPS",
    imageUrl: "https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=facearea&w=400&h=200",
    engineType: "Petrol",
    vehicleType: "Sedan",
  },
  {
    id: "vehicle-3",
    name: "Ford Focus",
    status: "UNHEALTHY",
    inTransit: true,
    healthScore: 34,
    dispatchable: false,
    wildCards: "BAD GPS",
    imageUrl: "https://images.unsplash.com/photo-1461632830798-3adb3034e4c8?auto=format&fit=facearea&w=400&h=200",
    engineType: "Diesel",
    vehicleType: "Hatchback",
  },
  {
    id: "vehicle-4",
    name: "BMW X5",
    status: "bad",
    inTransit: false,
    healthScore: 20,
    dispatchable: false,
    wildCards: "ENGINE FAILURE",
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=facearea&w=400&h=200",
    engineType: "Petrol",
    vehicleType: "SUV",
  },
];

// Mock request data - replace with API call to /api/requests
export const mockRequests: VehicleData[] = [
  {
    id: "request-1",
    name: "Toyota Camry",
    status: "Active",
    inTransit: true,
    healthScore: 64,
    dispatchable: true,
    wildCards: "NONE",
    requestedBy: "John Smith",
    imageUrl: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=facearea&w=400&h=200",
  },
  {
    id: "request-2",
    name: "Honda Civic", 
    status: "Active",
    inTransit: true,
    healthScore: 80,
    dispatchable: false,
    wildCards: "BAD GPS",
    requestedBy: "Jane Doe",
    imageUrl: "https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=facearea&w=400&h=200",
  },
  {
    id: "request-3",
    name: "Ford Focus",
    status: "UNHEALTHY",
    inTransit: true,
    healthScore: 34,
    dispatchable: false,
    wildCards: "BAD GPS",
    requestedBy: "Mike Johnson",
    imageUrl: "https://images.unsplash.com/photo-1461632830798-3adb3034e4c8?auto=format&fit=facearea&w=400&h=200",
  },
];

// Mock dispatch history data - replace with API call to /api/dispatch-history
export interface DispatchHistoryItem {
  id: string;
  userId: string;
  userImage: string;
  vehicleId: string;
  vehicleName: string;
  status: "Active" | "Completed" | "Rejected";
  requestDate: string;
  dispatchScore?: number;
}

// New interface for pending dispatch requests (notifications)
export interface PendingDispatchRequest {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImageUrl?: string;
  requesterId: string;
  requesterName: string;
  requesterImage?: string;
  reason?: string;
  requestTime: string;
  priority: 'low' | 'medium' | 'high';
  estimatedDuration?: string;
}

// Mock pending dispatch requests - replace with API call to /api/dispatch-requests?status=pending
export const mockPendingDispatchRequests: PendingDispatchRequest[] = [
  {
    id: "pending-1",
    vehicleId: "vehicle-1",
    vehicleName: "Toyota Camry",
    vehicleImageUrl: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=facearea&w=400&h=200",
    requesterId: "user-5",
    requesterName: "Sarah Wilson",
    requesterImage: "https://c.animaapp.com/mbberkvwpXsN6D/img/rectangle-2.png",
    reason: "Transport to client meeting",
    requestTime: "2024-01-15T14:30:00Z",
    priority: "medium",
    estimatedDuration: "2 hours",
  },
  {
    id: "pending-2",
    vehicleId: "vehicle-2",
    vehicleName: "Honda Civic",
    vehicleImageUrl: "https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=facearea&w=400&h=200",
    requesterId: "user-6",
    requesterName: "Alex Thompson",
    requesterImage: "https://c.animaapp.com/mbberkvwpXsN6D/img/rectangle-2.png",
    reason: "Urgent delivery to airport",
    requestTime: "2024-01-15T14:25:00Z",
    priority: "high",
    estimatedDuration: "1.5 hours",
  },
  {
    id: "pending-3",
    vehicleId: "vehicle-3",
    vehicleName: "Ford Focus",
    vehicleImageUrl: "https://images.unsplash.com/photo-1461632830798-3adb3034e4c8?auto=format&fit=facearea&w=400&h=200",
    requesterId: "user-7",
    requesterName: "Maria Garcia",
    requesterImage: "https://c.animaapp.com/mbberkvwpXsN6D/img/rectangle-2.png",
    reason: "Equipment pickup",
    requestTime: "2024-01-15T14:20:00Z",
    priority: "low",
    estimatedDuration: "3 hours",
  },
];

export const mockDispatchHistory: DispatchHistoryItem[] = [
  {
    id: "dispatch-1",
    userId: "user-1",
    userImage: "https://c.animaapp.com/mbberkvwpXsN6D/img/rectangle-2.png",
    vehicleId: "vehicle-1",
    vehicleName: "Toyota Camry",
    status: "Active",
    requestDate: "2024-01-15T10:30:00Z",
    dispatchScore: 85,
  },
  {
    id: "dispatch-2",
    userId: "user-2", 
    userImage: "https://c.animaapp.com/mbberkvwpXsN6D/img/rectangle-2.png",
    vehicleId: "vehicle-2",
    vehicleName: "Honda Civic",
    status: "Completed",
    requestDate: "2024-01-14T15:45:00Z",
    dispatchScore: 92,
  },
  {
    id: "dispatch-3",
    userId: "user-3",
    userImage: "https://c.animaapp.com/mbberkvwpXsN6D/img/rectangle-2.png", 
    vehicleId: "vehicle-3",
    vehicleName: "Ford Focus",
    status: "Rejected",
    requestDate: "2024-01-13T09:15:00Z",
    dispatchScore: 45,
  },
  {
    id: "dispatch-4",
    userId: "user-4",
    userImage: "https://c.animaapp.com/mbberkvwpXsN6D/img/rectangle-2.png",
    vehicleId: "vehicle-1", 
    vehicleName: "Toyota Camry",
    status: "Completed",
    requestDate: "2024-01-12T14:20:00Z",
    dispatchScore: 88,
  },
];

// Mock user data - replace with API call to /api/user/profile
export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  deskName: string;
  role: string;
}

// TODO: Replace dummyUser with real user data from backend or AsyncStorage
export const mockUserProfile: UserProfile = {
  id: "user-1",
  name: "Khome Khome",
  avatarUrl: "https://c.animaapp.com/mbbg27lfJFnztb/img/rectangle-2.png",
  deskName: "Khome's Desk",
  role: "Admin",
};

// Mock API service functions - replace these with actual API calls
export const mockApiService = {
  // TODO: Replace with actual API call
  getVehicles: async (): Promise<VehicleData[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockVehicles;
  },

  // TODO: Replace with actual API call
  getRequests: async (): Promise<VehicleData[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockRequests;
  },

  // TODO: Replace with actual API call
  getVehicleById: async (id: string): Promise<VehicleData | null> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    // Search in both vehicles and requests arrays
    const vehicle = mockVehicles.find(v => v.id === id);
    if (vehicle) return vehicle;
    
    const request = mockRequests.find(r => r.id === id);
    if (request) return request;
    
    return null;
  },

  // TODO: Replace with actual API call
  getDispatchHistory: async (): Promise<DispatchHistoryItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockDispatchHistory;
  },

  // TODO: Replace with actual API call
  getUserProfile: async (): Promise<UserProfile> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockUserProfile;
  },

  // TODO: Replace with actual API call
  markVehicleForMaintenance: async (vehicleId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log(`Marking vehicle ${vehicleId} for maintenance`);
    return true;
  },

  // TODO: Replace with actual API call
  handleDispatch: async (vehicleId: string, action: 'approve' | 'reject'): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log(`Handling dispatch for vehicle ${vehicleId} with action: ${action}`);
    return true;
  },

  // TODO: Replace with actual API call - GET /dispatch-requests?status=pending
  getPendingDispatchRequests: async (): Promise<PendingDispatchRequest[]> => {
    await new Promise(resolve => setTimeout(resolve, 150));
    return mockPendingDispatchRequests;
  },

  // TODO: Replace with actual API call - PATCH /dispatch-request/:id
  updateDispatchRequestStatus: async (requestId: string, status: 'approved' | 'rejected'): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Updating dispatch request ${requestId} status to: ${status}`);
    
    // Remove from pending requests (simulate backend update)
    const index = mockPendingDispatchRequests.findIndex(req => req.id === requestId);
    if (index !== -1) {
      mockPendingDispatchRequests.splice(index, 1);
    }
    
    return true;
  },

  // TODO: Replace with actual API call - GET /notifications/count
  getNotificationCount: async (): Promise<number> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return mockPendingDispatchRequests.length;
  },
}; 