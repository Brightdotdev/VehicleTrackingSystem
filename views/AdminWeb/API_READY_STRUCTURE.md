# DESK - API Ready Frontend Structure

## Overview

The frontend has been restructured to be fully API-ready with placeholder data and state-based rendering. All UI components are now prop-based and ready for backend integration without any UI code changes.

## 🎯 Key Features Implemented

### ✅ Reusable Components
- **`VehicleCard`** - Handles vehicle display with routing logic
- **`StatusBadge`** - Consistent status display across the app
- **`Header`** - Reusable header with navigation and notifications

### ✅ Centralized Mock Data Service
- **`mockData.ts`** - Contains all placeholder data and mock API functions
- **Type-safe interfaces** - Ready for backend API response types
- **Mock API service functions** - Simulate real API calls with delays

### ✅ Proper Routing Logic
- Vehicle cards route to `/vehicle-info/:id` for normal vehicles
- Vehicle cards route to `/bad-vehicle/:id` for vehicles with status 'bad'
- All routes use vehicle IDs instead of names for consistency

### ✅ State Management
- Loading states for all data fetching
- Error handling for failed API calls
- Proper TypeScript interfaces for all data structures

## 📁 File Structure

```
src/
├── components/
│   ├── VehicleCard.tsx          # Reusable vehicle display component
│   ├── StatusBadge.tsx          # Reusable status badge component
│   ├── Header.tsx               # Reusable header component
│   └── BottomNavBar.tsx         # Navigation component
├── lib/
│   └── mockData.ts              # Centralized mock data and API functions
├── pages/
│   ├── RequestDispatchPage.tsx  # API-ready requests page
│   ├── Vehicles.tsx             # API-ready vehicles page
│   ├── VehicleInfo.tsx          # API-ready vehicle details
│   ├── BadVehiclePage.tsx       # API-ready bad vehicle page
│   ├── HistoryPage.tsx          # API-ready history page
│   └── DashBoard.tsx            # API-ready dashboard
└── App.tsx                      # Updated routing
```

## 🔄 API Integration Guide

### 1. Replace Mock Data Service

Replace `src/lib/mockData.ts` with actual API calls:

```typescript
// Replace this:
export const mockApiService = {
  getVehicles: async (): Promise<VehicleData[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockVehicles;
  },
  // ... other mock functions
};

// With this:
export const apiService = {
  getVehicles: async (): Promise<VehicleData[]> => {
    const response = await fetch('/api/vehicles');
    if (!response.ok) throw new Error('Failed to fetch vehicles');
    return response.json();
  },
  // ... other API functions
};
```

### 2. Update API Endpoints

The following endpoints should be implemented by the backend:

- `GET /api/vehicles` - Get all vehicles
- `GET /api/requests` - Get all dispatch requests
- `GET /api/vehicles/:id` - Get specific vehicle details
- `GET /api/dispatch-history` - Get dispatch history
- `GET /api/user/profile` - Get user profile
- `POST /api/vehicles/:id/maintenance` - Mark vehicle for maintenance
- `POST /api/dispatch/:id/handle` - Handle dispatch (approve/reject)

### 3. Update Data Types

Replace the mock interfaces in `mockData.ts` with actual API response types:

```typescript
// Current mock interface
export interface VehicleData {
  id: string;
  name: string;
  status: 'Active' | 'UNHEALTHY' | 'bad';
  // ... other fields
}

// Replace with actual API response type
export interface VehicleData {
  vehicle_id: string;
  vehicle_name: string;
  vehicle_status: 'active' | 'unhealthy' | 'maintenance';
  // ... actual API fields
}
```

### 4. Update Component Props

Update component props to match actual API response structure:

```typescript
// In VehicleCard.tsx, update the mapping:
<span>{vehicle.name}</span>

// To match API response:
<span>{vehicle.vehicle_name}</span>
```

## 🎨 UI Components Ready for API

### VehicleCard Component
- **Props**: `vehicle: VehicleData`, `showRequestedBy?: boolean`
- **Routing**: Automatically routes based on vehicle status
- **API Ready**: All data comes from props, no hardcoded values

### StatusBadge Component
- **Props**: `status: string`, `size?: 'small' | 'medium' | 'large'`
- **Consistent**: Same styling across all pages
- **API Ready**: Accepts any status string from API

### Header Component
- **Props**: `avatarUrl`, `deskName`, `showSegmentedNav`, etc.
- **Reusable**: Used across multiple pages
- **API Ready**: All user data comes from props

## 🔧 Backend Integration Checklist

- [ ] Implement all required API endpoints
- [ ] Update data types to match API response structure
- [ ] Replace `mockApiService` with actual API calls
- [ ] Update component prop mappings if needed
- [ ] Test routing logic with real vehicle statuses
- [ ] Implement error handling for API failures
- [ ] Add authentication/authorization if required

## 📝 Code Comments

All placeholder data and mock functions include clear TODO comments:

```typescript
// TODO: Replace this dummy vehicle list with actual API response
const vehicles = [...];

// TODO: Replace mockApiService.getVehicles() with actual API call
const data = await mockApiService.getVehicles();

// TODO: Replace with actual notification handling when backend is ready
console.log('Notifications clicked');
```

## 🚀 Benefits

1. **No UI Changes Required** - All components are prop-based
2. **Type Safety** - Full TypeScript support with proper interfaces
3. **Consistent Styling** - Reusable components maintain design consistency
4. **Error Handling** - Loading states and error messages already implemented
5. **Routing Logic** - Proper navigation based on vehicle status
6. **Scalable** - Easy to add new features without breaking existing UI

## 🎯 Next Steps for Backend Team

1. Review the mock data structures in `src/lib/mockData.ts`
2. Implement the required API endpoints
3. Update the data types to match your API response format
4. Replace the mock service functions with real API calls
5. Test the integration with real data

The frontend is now fully prepared for backend integration with minimal code changes required! 