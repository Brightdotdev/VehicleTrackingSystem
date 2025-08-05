import React, { useState } from 'react'
import { Button } from '../button';
import { UserPreference } from '../UserPreference';
import { LastStep } from './LastStepForm';

const UserSignUpMultiStep = ({pageSender} : {pageSender: string}) => {
    const [step, setStep]  = useState(1);
  return (
    <div className="flex flex-col items-center justify-start w-full h-full">
        <div className="md:w-2/3 w-full bg-red-300 flex flex-col items-start justify-start h-full p-4  gap-4">

    <div className='flex items-center justify-center w-fit h-3 rounded-full px-8 py-4 bg-background2 
    self-end'>
        {
step === 1 ? "Step 1 of 2" : "Final Step"
}   </div>



<div className="h-[80%] w-full bg-red-600">
    {
    step === 1 ? <UserPreference/> : step === 2 &&  <LastStep pageSender={pageSender}  /> 
}

</div>





<div className="w-full flex justify-between items-center">

{
step === 2 && (
<Button onClick={() => setStep(1)} variant="secondary">
Go Back
</Button>
)
}

<Button onClick={() => setStep((step) =>  step === 1 ? 2 : 1)} className='self-end'>
{
step === 1 ? "Next Step (2/2)" : "Sign Me Up!"
}
</Button>
</div>

    </div>
    </div>    
)
}

export default UserSignUpMultiStep