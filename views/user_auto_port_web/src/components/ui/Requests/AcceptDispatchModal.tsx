import React, { useState } from 'react'
import { Credenza, CredenzaBody, CredenzaClose, CredenzaContent, CredenzaDescription, CredenzaFooter, CredenzaHeader, CredenzaTitle } from "../Credenza"
import { Button } from '../button'
import { DispatchRequestDto, VehicleDTO } from '@/types/VehicleTypes'
import { toast } from 'sonner';


interface AcceptDispatchModalProps {
  open: boolean;
  setOpen: (open :boolean) => void;
  vehicleData: VehicleDTO;
  dispatchData: DispatchRequestDto;
}

const handleAcceptDispatch = (vehicleData: VehicleDTO, dispatchData: DispatchRequestDto, setLoading : (loading: boolean) => void) => {

  setLoading(true)
  console.log("accepting dispatch")
  console.log(vehicleData)
  console.log(dispatchData)
  vehicleData.dispatchStatus = 'IN_PROGRESS' as VehicleDTO['dispatchStatus']
  dispatchData.dispatchAdmin = "me"
  dispatchData.dispatchStartTime = new Date().toISOString()
  
  toast.info("Yup the dispatch is accepted")
  setLoading(false);
  toast.info("Redirecting now")

  window.location.href =`/vehicles/request?vehicleReq=${dispatchData.dispatchId}&vehicle=${vehicleData.vehicleIdentificationNumber}`
}


export const AcceptDispatchModal = ({
  open,
  setOpen,
  vehicleData,
  dispatchData
}: AcceptDispatchModalProps) => {
  const [isLoading, setLoading] = useState(false);
  return (

    <Credenza open={open} onOpenChange={setOpen}>
            <CredenzaContent>
            <CredenzaHeader>
              <CredenzaTitle>Are you sure you want to accept</CredenzaTitle>
              <CredenzaDescription >
                   REMINEDER... this is {dispatchData.dispatchRequester}'s request for the {dispatchData.vehicleName}
                   {dispatchData.dispatchReason === "CLASSIFIED" ? " and it's classified" :
                   dispatchData.dispatchReason === "TRANSPORT" ? " for transportation reasons" :
                   dispatchData.dispatchReason === "DELIVERY" ? " for delivery" :
                   ""}
              </CredenzaDescription>
            </CredenzaHeader>
            <CredenzaBody>

       {vehicleData.safetyScore < 63 && (
            <div className='text-small text-red-500'>
              Warning: Vehicle health score is low ({vehicleData.safetyScore}). Accepting dispatch is not recommended..i wont even let you lmao.
            </div>
          )}

          { (dispatchData?.wildCards?.length ?? 0) > 0 && (
            <div className='text-red-500 text-small'>
              <strong>This Vehicle Contains some wildards...and cant be dispatched</strong>
              <ul>
                {(dispatchData.wildCards ?? []).map((item: any, idx: number) => (
                  <li key={idx}>{Object.keys(item).join(", ")}</li>
                ))}
              </ul>
            </div>
          )}



            </CredenzaBody>
            <CredenzaFooter>
              <CredenzaClose asChild>
              <Button variant="secondary">Close</Button>
              </CredenzaClose>
           <Button

            onClick={() => handleAcceptDispatch(vehicleData,dispatchData, setLoading)}

          disabled={vehicleData.safetyScore < 63 || ((dispatchData?.wildCards?.length ?? 0) > 0)}>
              {isLoading ? `Accpting....${dispatchData.dispatchRequester}'s request` : "Yes, Accept"}
              </Button>
            </CredenzaFooter>
            </CredenzaContent>
          </Credenza>

  )
}

export default AcceptDispatchModal