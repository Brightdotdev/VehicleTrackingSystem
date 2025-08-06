import { DispatchReason, DispatchRequestBody, VehicleDTO, VehicleStatus } from '@/types/VehicleTypes';
import { ArrowLeft,  CarFront,  CircleHelp, Cog, HeartPulse, IdCard, Info,  Shield, TimerIcon} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { HealthText } from '../../utils/UtilComponents';
import { VehicleInfoPageStatusPills } from '@/components/utils/VehiclePageUtilComponent';
import { format } from "date-fns";
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { reasons } from '@/types/utilTypes';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { z } from "zod"
import { toast } from 'sonner';
import { getVehicleByVin } from '@/lib/handleVehiclePage';
import { useUserValidation } from '@/hooks/useUserValidation';
import { Calendar } from '@/components/ui/MiniCalenderProvider';
import UserDispatchReqPopUp from '@/components/ui/UserDispatchReqPopUp';

const dispatchReasons: reasons[] = [
  {
    value: DispatchReason.CLASSIFIED,
    label:  DispatchReason.CLASSIFIED
  },
  {
    value: DispatchReason.DELIVERY,
    label:  DispatchReason.DELIVERY
  },
  {
    value: DispatchReason.TRANSPORT,
    label: DispatchReason.TRANSPORT
  }]
  
  const DispatchReasonPopOver = ({
    selectedStatus,
    setSelectedStatus,
  }: {
    selectedStatus: reasons | undefined;
    setSelectedStatus: (status: reasons | undefined) => void;
  }) => {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button    type="button" variant="outline" className="w-[150px] justify-start">
            {selectedStatus ? <>{selectedStatus.label}</> : <>Set Reason</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <StatusList setOpen={setOpen} setSelectedStatus={setSelectedStatus} />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline"    type="button" className="w-[150px] justify-start">
          {selectedStatus ? <>{selectedStatus.label}</> : <>Set Reason</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StatusList setOpen={setOpen} setSelectedStatus={setSelectedStatus} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function StatusList({
  setOpen,
  setSelectedStatus,
}: {
  setOpen: (open: boolean) => void
  setSelectedStatus: (status: reasons | undefined) => void
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter status..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {dispatchReasons.map((status) => (
            <CommandItem
              key={status.value}
              value={status.value}
              onSelect={(value) => {
                setSelectedStatus(
                  dispatchReasons?.find((priority) => priority.value === value) || undefined
                )
                setOpen(false)
              }}
            >
              {status.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}


const VehicleNamePill = (
  { model, isDispatchable} : { model? : string,isDispatchable : boolean}
) => {

  return(
<div className="w-full h-4 z-10 flex items-center justify-center  absolute top-0">
  <div className={`
 bg-gray-800 p-4 flex gap-3 h-[2.4rem] rounded-full items-center justify-start shadow-xl pl-4`}>

<div className={`bg-white rounded-full w-2 h-2`}>
</div>

<p className="flex items-center justify-center gap-1  text-small text-primary-foreground  dark:text-foreground">
   Your Request for the  {model} the vehicle is {isDispatchable  ?  "Do able" : "Not Do able" } </p> 
</div>
</div>


  )
}


const VehicleRequestPage = ({vehicleVin} : {vehicleVin : string}) => {
  
    const { userData , returnMyData } = useUserValidation()
  const [vehicleData, setVehicleData] = useState<VehicleDTO | undefined>(undefined);
  const [isDispatchable, setDispatchAble] = useState<boolean>(false);
  const [openDispatchCostCalculator, setOpenDispatchCostCalculator] = useState<boolean>(false);
  const [loading, setLoading]  = useState<boolean>(false)

  // Form state
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedStatus, setSelectedStatus] = useState<reasons | undefined>();
  const [dispatchData, setDispatchData] = useState<DispatchRequestBody | undefined>(undefined);
  // Zod schema for validation
  const requestSchema = z.object({
    date: z.date({ required_error: "Please select a dispatch end date" }),
    reason: z.object({
      value: z.string(),
      label: z.string(),
    }).nullable().refine(val => val !== undefined, { message: "Please select a reason" }),
  });

  // Submit handler
  const handleSubmit = async (e: React.FormEvent, selectedDate : Date, submitedStatus : reasons) => {
    e.preventDefault();
    const me = await returnMyData();

    const dateFormat = selectedDate ? format(selectedDate, "yyyy-MM-dd'T'HH:mm:ss"): "";
      console.log("date format: ", dateFormat )
      console.log("selected reason: ", submitedStatus)
      console.log("Java LocalDateTime:", date);
      console.log("Reason normal:", selectedStatus);

    if (
      selectedStatus?.value === DispatchReason.CLASSIFIED &&
      (vehicleData?.vehicleStatus as any) !== DispatchReason.CLASSIFIED
    ) {
      toast.error("Ordinary vehicles can't be used for classified purposes.");
      return;
    }
      
    if (
      !vehicleData?.model ||
      !vehicleData?.vehicleIdentificationNumber ||
      !vehicleData?.vehicleStatus ||
      !selectedStatus ||
      !userData?.email
    ) {
      toast.error("Missing required vehicle or user data.");
      return;
    }
      const dispatchData: DispatchRequestBody = {
      vehicleName: vehicleData?.model ?? "",
      vehicleIdentificationNumber: vehicleData?.vehicleIdentificationNumber ?? "",
      vehicleStatus: vehicleData?.vehicleStatus as VehicleStatus,
      dispatchReason: submitedStatus?.value as DispatchReason,
      dispatchRequester: userData?.email ?? "",
      dispatchEndTime: dateFormat ,
      userDispatchScore : me?.dispatchPoints ?? 0
    }


    setDispatchData(dispatchData);
    const result = requestSchema.safeParse({ date, reason: selectedStatus });
  
    if (!result.success) {
      result.error.errors.forEach(err => {
        toast.error("Validation Error...please double check your form request");
      });
      return;
    }

    toast("Calculating Your cost...");
    setOpenDispatchCostCalculator(true);
  };


  useEffect(() =>{

    const handleVehiclePage = async () =>{
       const vData = await getVehicleByVin(vehicleVin);
        setVehicleData(vData)
        const hasWildcardDispatch = vData?.wildcardAttributes?.some(attribute => attribute.wildcardValue === true)  
const hasLowSafetyScore = (vData?.safetyScore || 0 ) <  63 ;

const canDispatch = hasLowSafetyScore ? false : hasWildcardDispatch  ? false : true

setDispatchAble(canDispatch);
 if (!date) {  setDate(new Date(Date.now() + 24 * 60 * 60 * 1000));}}

handleVehiclePage();
  }, [])
  


  
  return (

    <main className="flex flex-col items-center justify-center w-screen h-screen relative overflow-scroll overflow-y-auto overflow-hidden overflow-x-hidden lg:overflow-x-hidden">
      <div
        className="flex items-center justify-center xl:p-3 p-2 shadow-lg absolute lg:rounded-full
        rounded-lg
        lg:size-14 w-fit
        lg:top-3 lg:left-2 bottom-4 shadow-lg right-2 z-10 cursor-pointer dark:bg-gray-800 bg-teal-900 text-primary-foreground dark:text-foreground"
        onClick={() => window.history.back()}
      >
        <ArrowLeft />  
      <p className="text-sm lg:hidden">Go Back</p>
      </div>
    
      <section className='relative flex flex-col items-center justify-start w-[96vw] h-[94vh] h-24 disatchRequestContainer'>

        <VehicleNamePill  model={vehicleData?.model ?? "Unknown vehicle"} isDispatchable={isDispatchable}/>
        
        <article className="relative sm:w-full  disatchRequestImage hidden md:flex lg:h-[var(--size-xl2)] md:h-[var(--size-xl)]">
          {
            vehicleData?.vehicleImages[0] ?
            <img src={vehicleData?.vehicleImages[0] || "/placeholder.png" } alt="vehicle" className="w-full h-full object-cover disatchRequestImage object-center" /> :
          <div className="w-full h-full object-cover disatchRequestImage object-center bg-background"></div>
          }
        
          {
          
             isDispatchable  ?
                <VehicleInfoPageStatusPills statusName="DISPATCHABLE" className='absolute bottom-2 right-8 sahdow-lg' />
                : <VehicleInfoPageStatusPills statusName="NOT_DISPATCHABLE" className='absolute bottom-2 right-2 sahdow-lg' />
                       }
        </article>
<div className="w-full h-full flex items-center justify-between flex-col md:p-[var(--space-sm)]">
  <div className="pt-8 py-4 md:pt-0 w-full flex items-center justify-between  md:h-[var(--size-md)]">
    <h3 className="md:text-medium text-normal-2">
      {vehicleData?.model} 
    </h3>

            {vehicleData?.vehicleStatus && (
              <VehicleInfoPageStatusPills statusName={vehicleData.vehicleStatus} className='flex' />
            )}
  </div>

  <div className="relative w-full  flex-1 flex items-start  justify-start gap-12
  md:gap-0
  md:justify-between lg:flex-row flex-col  md:pt-4 scorllebleElement customScrollBar"> 
 
<article
  className="flex flex-col items-start justify-start gap-6 bg-background2 rounded-sm lg:w-[48%] w-full lg:p-[var(--size-xxs)] pt-4 p-2
   min-h-full lg:max-h-[20rem] scorllebleElement customScrollBar"
>

<div className="flex md:items-center items-start justify-center gap-2 flex-col md:flex-row ">
<div className="flex items-center justify-center">
<Info /><span className='text-sm pl-2 font-[500]' > VEHICLE METADATA :</span>
</div>
<p className='text-body text-muted-foreground' >{vehicleData?.vehicleMetadata || "No metadata Provided"} </p>
</div>

<div className="flex md:items-center items-start justify-center gap-2 flex-col md:flex-row">
  <div className="flex items-center justify-center">
<IdCard /> 
<span className='text-sm pl-2 font-[500]'>LISENSE PLATE:</span>
</div>
<p className='text-body text-muted-foreground' >{vehicleData?.licensePlate || "License plate not porovided"} </p>
</div>



<div className="flex md:items-center items-start justify-center gap-2 flex-col md:flex-row">
  <div className="flex items-center justify-center">
<TimerIcon /> 
<span className='text-sm pl-2 font-[500]' > VEHICLE ACQURED TIME :</span>
</div>
<p className='text-body text-muted-foreground' >{vehicleData?.vehicleAcquiredYear || "Now"} </p>
</div>

<div className="flex md:items-center items-start justify-center gap-2 flex-col md:flex-row ">
  <div className="flex items-center justify-center">
<Cog /><span className='text-sm pl-2 font-[500]' > ENGINE TYPE:</span>
  </div>
<p className='text-body text-muted-foreground' >{vehicleData?.engineType || "No vehicle Data"} </p>
</div>

<div className="flex md:items-center items-start justify-center gap-2 flex-col md:flex-row ">

  <div className="flex items-center justify-center">
<CarFront /><span className='text-sm pl-2 font-[500]' > VEHICLE TYPE:</span>
</div>

<p className='text-body text-muted-foreground' >{vehicleData?.vehicleType || "Not my type"} </p>
</div>

<div className="flex md:items-center items-start justify-center gap-2 flex-col md:flex-row ">
  <div className="flex items-center justify-center">
<CircleHelp /><span className='text-sm pl-2 font-[500]' > DISPATCH STATUS :</span>
</div>
<p className='text-body text-muted-foreground' >{vehicleData?.dispatchStatus.split("_").join(" ") || "Def not dispatchable" } </p>
</div>


<div className="flex md:items-center items-start justify-center gap-2">
  <div className="flex items-center justify-center">

<Shield /> <span className='text-sm pl-2 font-[500]' >Safety Score :</span>
</div>
<HealthText  value={vehicleData?.safetyScore || 0}/>
</div>


{vehicleData?.healthAttributes && vehicleData?.healthAttributes.length > 0 && (
  <div className="flex md:items-center items-start justify-center gap-2 flex-col md:flex-row ">
    <div className="flex items-center justify-center">
      <HeartPulse/>
    <span className="text-sm pl-2 font-[500]">Health Attributes:</span>
</div>
    <span className="text-body text-muted-foreground">
      {vehicleData.healthAttributes
        .map(obj =>
          Object.entries(obj)
            .filter(([key]) => key !== "id") // Exclude the "id" key
            .map(([key, value]) => key === "attributeName" ? `${value}: ${obj.score}` : null)
            .filter(Boolean)
            .join(", ")
        )
        .join(", ")
      }
    </span>
  </div>
)}

 </article>

<article className="flex flex-col items-center justify-start gap-2 w-full h-full  lg:w-[48%]
h-full p-2 bg-background2 customScrollBar rounded-sm
">

<h4 className='flex items-center justify-center bg-background rounded-sm w-full py-[var(--size-sm)]'>
  Fill This To Get The Vehicle
</h4>

<form className="flex flex-col items-start justify-start md:gap-6 gap-12 bg-background rounded-sm w-full
   min-h-full md:h-full overflow-hidden overflow-y-auto no-scrollbar md:p-4 p-2"  onSubmit={ (e) =>   {

  if (!date) {
    e.preventDefault();
    toast.error("Please select a dispatch end date.");
    return;
  }

  const now = new Date();
  // Check if selected date is before today
  if (date < now) {
    e.preventDefault();
    toast.error("Dispatch end date cannot be in the past.");
    return;
  }

  
  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isSameDay && date.getTime() <= now.getTime()) {
    e.preventDefault();
    toast.error("Dispatch end time must be after the current time.");
    return;
  }
  if (!selectedStatus) {
    e.preventDefault();
    toast.error("Please select a reason for dispatch.");
    return;
  }
  handleSubmit(e, date, selectedStatus);
   } } >

<label className="flex flex-col md:gap-1 gap-2 w-full">
  <span className="md:text-normal text-small-2 font-medium">When do You Want your vehicle dispatch to end</span>



   <Calendar  value={date} onChange={setDate}  />



  <span className="text-xs text-muted-foreground">Please select when you want the dispatch to end.</span>

</label>



<label className="flex flex-col md:gap-1 gap-2 w-full">
  <span className="md:text-normal text-small-2 font-medium">What do you plan to use the vehicle for</span>

<DispatchReasonPopOver selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}/>

  <span className="text-xs text-muted-foreground">Please what your dispatch mission is.</span>
</label>
<Button
  type="submit"
  className="w-full mt-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600 transition-all shadow-md"
>
  Submit
</Button>



</form>

 </article>

  </div>

</div>


<UserDispatchReqPopUp   loading={loading} setLoading={setLoading} setOpen={setOpenDispatchCostCalculator}  open={openDispatchCostCalculator} dispatchReqBody={dispatchData ?? undefined  } />

  
      </section>
    </main>
  )
}

export default  VehicleRequestPage