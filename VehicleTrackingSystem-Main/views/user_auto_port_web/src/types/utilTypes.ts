import { DispatchReason } from "./VehicleTypes"


export type componentTypes  = {
    vehicleComponent :   "requests" | "vehicles"
}


export type reasons = {
  value: DispatchReason
  label: string
}