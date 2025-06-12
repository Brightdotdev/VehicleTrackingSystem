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
import { SaveNewVehiclePopUpProps, EngineType, VehicleType, VehicleStatus } from "@/types/VehicleTypes";
import { handleSaveVehicleForm } from "@/lib/handleVehiclePage";




export default function SaveNewVehiclePopUp({
  open,
  setOpen,
  
}: {
  open: boolean;
  setOpen: (open: boolean) => void;}) {
  const [form, setForm] = useState<SaveNewVehiclePopUpProps>({
    model: "",
    engineType: EngineType.GAS,
    vehicleType: VehicleType.CAR,
    vehicleStatus: VehicleStatus.REGULAR,
    vehicleMetadata: "",
    vehicleImages: [],
    isGoodVehicle: true,
  });

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



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className=" flex flex-col gap-4 justify-center items-center bg-background/95 p-0 md:p-4 lg:p-6 max-w-md">
        <form onSubmit={(e) => handleSaveVehicleForm(e, form,setOpen)} className="w-full rounded-lg shadow-lg flex flex-col gap-4 overflow-y-auto max-h-[30rem]">
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

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save Vehicle</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}