import React from 'react'
import { Credenza, CredenzaBody, CredenzaClose, CredenzaContent, CredenzaDescription, CredenzaFooter, CredenzaHeader, CredenzaTitle } from '../Credenza'
import { Button } from '../button'
import { DispatchRequestDto, VehicleDTO } from '@/types/VehicleTypes'



interface RejectDispatchModalProps {
  open: boolean;
  setOpen: (open :boolean) => void;
  vehicleData: VehicleDTO;
  dispatchData: DispatchRequestDto;
}



const RejectDispatchModal = ({
  open,
  setOpen,
  vehicleData,
  dispatchData
}: RejectDispatchModalProps) => {

  const [reason, setReason] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleReject = async () => {
    setIsLoading(true);
    console.log(reason)
  }

  return (
      <Credenza open={open} onOpenChange={setOpen}>
        <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Reject Dispatch Request</CredenzaTitle>
          <CredenzaDescription>
          Are you sure you want to reject this dispatch request? Please provide a reason.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <input
          type="text"
          placeholder="Enter rejection reason"
          className="w-full border rounded px-3 py-2 mt-2"
          value={reason}
          onChange={e => setReason(e.target.value)}
          />
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
          <Button variant="secondary">Close</Button>
          </CredenzaClose>
          <Button
          variant="destructive"
          onClick={handleReject}
          disabled={!reason.trim() || isLoading}
          >
          {isLoading ? "Rejecting..." : "Yes, Reject"}
          </Button>
        </CredenzaFooter>
        </CredenzaContent>
      </Credenza>

  )
}

export default RejectDispatchModal