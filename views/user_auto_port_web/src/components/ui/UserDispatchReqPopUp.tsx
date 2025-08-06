import React, { useEffect, useState } from 'react'

import { DispatchRequestBody, DispatchRequestDto, DispatchStatus, VehicleDTO } from '@/types/VehicleTypes'
import { toast } from 'sonner';
import { Credenza, CredenzaBody, CredenzaClose, CredenzaContent, CredenzaDescription, CredenzaFooter, CredenzaHeader, CredenzaTitle } from './Credenza';
import { Button } from './button';
import { handleDispatchRequest } from '@/lib/handleUserDispatchPage';



interface UserDispatchReqPopUpProps {
  loading : boolean
  setLoading: (laoding :boolean) => void;
  open: boolean;
  setOpen: (open :boolean) => void;
  dispatchReqBody: DispatchRequestBody | undefined ;
}

const handleDispatchRequestFunc = async ( dispatchReqBody: DispatchRequestBody, setLoading : (loading: boolean) => void) => {
     

  const response = await handleDispatchRequest(dispatchReqBody);      
      console.log(response);


  toast.info("Yup the dispatch is accepted")
  setLoading(false);
  toast.info("Redirecting now")

}


export const UserDispatchReqPopUp = ({
  open,
  setOpen,
  loading,
  setLoading,
  dispatchReqBody
}: UserDispatchReqPopUpProps) => {
  

  const [dispatchCost, setDispatchCost] = useState(0)


  if(dispatchReqBody === undefined) return null

  return (

    <Credenza open={open} onOpenChange={setOpen}>
            <CredenzaContent>
            <CredenzaHeader>
              <CredenzaTitle>Welcome to the final setp od your dispatch request</CredenzaTitle>
              <CredenzaDescription >

                   REMINEDER... this your request for the {dispatchReqBody.vehicleName} for
                   {dispatchReqBody.dispatchReason === "CLASSIFIED" ? " a classified trip " :
                   dispatchReqBody.dispatchReason === "TRANSPORT" ? " transportation reasons" :
                   dispatchReqBody.dispatchReason === "DELIVERY" ? "delivery" :
                   ""}
              </CredenzaDescription>
            </CredenzaHeader>
            <CredenzaBody>

                  {
                    "Yayyy"
                  }

            </CredenzaBody>
            <CredenzaFooter>
       
           <Button
            onClick={() => handleDispatchRequestFunc(dispatchReqBody, setLoading)}
          disabled={dispatchCost <= 0}>
              {loading ? `Processing Request` : "Get My Vehicle !"}
              </Button>
            </CredenzaFooter>
            </CredenzaContent>
          </Credenza>

  )
}

export default UserDispatchReqPopUp