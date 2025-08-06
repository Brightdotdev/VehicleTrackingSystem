import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup';
import { DispatchRequestBody } from '@/types/VehicleTypes'
import { toast } from 'sonner';
import { Credenza, CredenzaBody, CredenzaClose, CredenzaContent, CredenzaDescription, CredenzaFooter, CredenzaHeader, CredenzaTitle } from './Credenza';
import { Button } from './button';
import { calculateDispatchCost, handleDispatchRequest } from '@/lib/handleUserDispatchPage';
import { dispatchCostResponse } from '@/types/utilTypes';
import { Fuel } from 'lucide-react';



interface UserDispatchReqPopUpProps {
  loading : boolean
  setLoading: (laoding :boolean) => void;
  open: boolean;
  setOpen: (open :boolean) => void;
  dispatchReqBody: DispatchRequestBody | undefined ;
}

const handleDispatchRequestFunc = async (
  dispatchReqBody: DispatchRequestBody,
  setLoading: (loading: boolean) => void
) => {
  // Start loading indicator
  setLoading(true);

  // Send the dispatch request
  const response = await handleDispatchRequest(dispatchReqBody);

  // Log for debugging
  console.log(response);

  // Check if the response is successful
  if (response?.canDispatch == true) {
    toast.success("Yup! The dispatch is accepted");

    // Optional: small delay for better UX before redirecting
    setTimeout(() => {
      toast.info("Redirecting now...");

      // Redirect to "/" without adding current page to history
      window.location.replace("/");
    }, 1000);
  } else {
    // If request failed, show error and stop loading
    toast.error("Dispatch failed. Please try again.");
    setLoading(false);
  }
};


export const UserDispatchReqPopUp = ({
  open,
  setOpen,
  loading,
  setLoading,
  dispatchReqBody
}: UserDispatchReqPopUpProps) => {
  

  const [dispatchCost, setDispatchCost] = useState<dispatchCostResponse>()
const getPriceLevel = (price: number) => {
  if (price < 200) return { label: "Cheap", color: "text-green-600", icon: "⬇️" };
  if (price < 600) return { label: "Fair", color: "text-yellow-500", icon: "➡️" };
  return { label: "Expensive", color: "text-red-400", icon: "⬆️" };
};



useEffect(() => {
  if (!dispatchReqBody) return;

  try {
    const result = calculateDispatchCost(dispatchReqBody);
    setDispatchCost(result);
    
  } catch (err) {
    toast.error("Something went wrong calculating cost");
    console.error(err);
  }
}, [dispatchReqBody]);

  if(dispatchReqBody === undefined ||dispatchCost === undefined ) return null
const priceLevel = getPriceLevel(dispatchCost?.price || 0)

  return (

    <Credenza open={open} onOpenChange={setOpen}>
            <CredenzaContent>
            <CredenzaHeader>
              <CredenzaTitle>Welcome to the final step of your dispatch request</CredenzaTitle>

              <CredenzaDescription >

                   REMINEDER... this your request for the {dispatchReqBody.vehicleName} for
                   {dispatchReqBody.dispatchReason === "CLASSIFIED" ? " a classified trip " :
                   dispatchReqBody.dispatchReason === "TRANSPORT" ? " transportation reasons" :
                   dispatchReqBody.dispatchReason === "DELIVERY" ? "delivery" :
                   ""}
              </CredenzaDescription>
            </CredenzaHeader>
     <CredenzaBody>
  <div className="space-y-4">

 <div className="flex justify-between">
    <span className="text-sm font-semibold">Trip Summary</span>
 
 <div className="flex items-center justify-center g">
<Fuel className='size-6 p-1'/>
   <CountUp
    end={dispatchCost?.price || 0}
    decimals={2}
    className={`text-sm font-bold ${priceLevel.color}`}
  />

 </div>
 
 </div>

    <div className="flex justify-between">
      <span>Your Remaining Score:</span>

<div className="flex items-center justify-center gap-2">
   <Fuel className='size-6 p-1'/>
  <CountUp
    end={dispatchCost?.finalUserScore || 0}
    decimals={2}
    className={`${dispatchCost?.finalUserScore >= 0 ? "text-green-600" : "text-red-600"} font-bold`}/>
</div>
    </div>
    {dispatchCost?.isEnough ? (
      <p className="text-sm text-gray-600">
        Looks good! Your score is enough to cover this dispatch. Let’s get rolling 🚗💨
      </p>
    ) : (
      <p className="text-sm text-red-500">
        Oops... Your score isn't enough for this dispatch. You need to earn or top up 🧍‍♂️💳
      </p>
    )}
  </div>
</CredenzaBody>

       <CredenzaFooter>
  <Button
    onClick={() => handleDispatchRequestFunc(dispatchReqBody, setLoading)}
    disabled={!dispatchCost?.isEnough || loading}
    className="w-full"
  >
    {loading
      ? "Processing your dispatch request..."
      : dispatchCost?.isEnough
      ? "Get My Vehicle !"
      : "Not Enough Score Dispatch Points"}
  </Button>
</CredenzaFooter>
            </CredenzaContent>
          </Credenza>

  )
}

export default UserDispatchReqPopUp