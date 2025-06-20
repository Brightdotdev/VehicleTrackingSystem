"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EngineType, VehicleType, VehicleStatus, FormProps } from "@/types/VehicleTypes";
import { handleSaveVehicleForm } from "@/lib/handleVehiclePage";
import { useRouter } from "next/navigation";






const getDefaultTimestamp = () => new Date(Date.now()).toISOString().substring(0, 19);



export default function SaveNewVehiclePopUp({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;

}) {
  const router = useRouter();
  const [form, setForm] = useState<FormProps>({
    model: "",
    engineType: EngineType.GAS,
    vehicleType: VehicleType.CAR,
    vehicleStatus: VehicleStatus.REGULAR,
    vehicleMetadata: "",
    vehicleImages: [],
    isGoodVehicle: true,
    location: { latitude: 0, longitude: 0 ,timestamp: getDefaultTimestamp() },
  });

  const [loading, setLoading] = useState(false);
const [imageInput, setImageInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setForm({ ...form, vehicleImages: [...form.vehicleImages, imageInput.trim()] });
      setImageInput("");
    }
  };

  const handleRemoveImage = (idx: number) => {
    setForm({ ...form, vehicleImages: form.vehicleImages.filter((_, i) => i !== idx) });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      location: {
        latitude: name === "latitude" ? Number(value) : (form.location?.latitude ?? 0),
        longitude: name === "longitude" ? Number(value) : (form.location?.longitude ?? 0),
        timestamp: form.location?.timestamp ?? getDefaultTimestamp(),
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    
    e.preventDefault();
    setLoading(true);
    setForm(prev => ({
      ...prev,
      location: {
        ...prev.location,
        timestamp: getDefaultTimestamp()
      }
    }));
 await  handleSaveVehicleForm(form, setOpen, setLoading)

 router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-screen max-w-full h-screen flex flex-col justify-center items-center bg-background">
        <form onSubmit={handleSubmit} className="w-full max-w-lg  rounded-lg shadow-lg p-6 space-y-4 scorllebleElement customScrollBar">
          <DialogHeader>
            <DialogTitle className="" >Add New Vehicle</DialogTitle>
          </DialogHeader>

          <div className="flexItemsStart gap-4 py-2 ">
            <Label htmlFor="model" className="text-normal  py-1">Model</Label>
            <Input id="model" name="model" value={form.model} onChange={handleChange} required placeholder="This is the vehicle name" />
          </div>

          <div className="flex gap-4 py-2">
            <div className="flex-1">
              <Label htmlFor="engineType" className="text-small py-4">Engine Type</Label>
              <select
                id="engineType"
                name="engineType"
                value={form.engineType}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 bg-background2/60"
                required
              >
                <option value="GAS">GAS</option>
                <option value="DIESEL">DIESEL</option>
                <option value="ELECTRIC">ELECTRIC</option>
                <option value="HYBRID">HYBRID</option>
              </select>
            </div>
            <div className="flex-1">
              <Label htmlFor="vehicleType" className="text-small py-4">Vehicle Type</Label>
              <select
                id="vehicleType"
                name="vehicleType"
                value={form.vehicleType}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 bg-background2/60"
                required
              >
                <option value="CAR">CAR</option>
                <option value="SEDAN">SEDAN</option>
                <option value="TRUCK">TRUCK</option>
                <option value="MOTORCYCLE">MOTORCYCLE</option>
                <option value="BUS">BUS</option>
                <option value="VAN">VAN</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="vehicleStatus">Vehicle Status</Label>
            <select
              id="vehicleStatus"
              name="vehicleStatus"
              value={form.vehicleStatus}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 bg-background2/60"
              required
            >
              <option value="CLASSIFIED">CLASSIFIED</option>
              <option value="CARGO">CARGO</option>
              <option value="REGULAR">REGULAR</option>
              <option value="TRANSPORT">TRANSPORT</option>
            </select>
          </div>

          <div>
            <Label htmlFor="vehicleMetadata">Metadata (optional)</Label>
            <Textarea
              id="vehicleMetadata"
              name="vehicleMetadata"
              value={form.vehicleMetadata}
              onChange={handleChange}
              placeholder="Enter any extra info..."
              required
            />
          </div>

          <div>
            <Label>Vehicle Images (URLs)</Label>
            <div className="flex gap-2">
              <Input
                value={imageInput}
                onChange={e => setImageInput(e.target.value)}
                placeholder="Paste image URL and press Add"
              />
              <Button type="button" onClick={handleAddImage} variant="secondary">
                Add
              </Button>
            </div>
            <ul className="mt-2 space-y-1">
              {form.vehicleImages.map((img, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="truncate">{img}</span>
                  <Button type="button" size="sm" variant="destructive" onClick={() => handleRemoveImage(idx)}>
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={form.isGoodVehicle}
                      onCheckedChange={checked => setForm({ ...form, isGoodVehicle: checked })}
                      id="isGoodVehicle"
                    />
                    <Label htmlFor="isGoodVehicle">
                      {form.isGoodVehicle ? "Good Vehicle" : "Bad Vehicle"}
                    </Label>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <span>Toggle to mark this vehicle as good or bad.</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div>
            <Label>Vehicle Location (for map)</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="any"
                name="latitude"
                value={form.location?.latitude ?? ""}
                onChange={handleLocationChange}
                placeholder="Latitude"
                required
              />
              <Input
                type="number"
                step="any"
                name="longitude"
                value={form.location?.longitude ?? ""}
                onChange={handleLocationChange}
                placeholder="Longitude"
                required
              />
            </div>
            <span className="text-xs text-muted-foreground">
              Enter the latitude and longitude for this vehicle's location.
            </span>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
              </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <svg className="animate-spin h-4 w-4 mr-2 inline-block text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              ) : null}
              {loading ? "Saving..." : "Save Vehicle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}