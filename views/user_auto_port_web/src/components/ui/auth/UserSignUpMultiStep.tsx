import React, { useState } from 'react'

const UserSignUpMultiStep = () => {
    const [step, setStep]  = useState(1);
  return (
    <div className="flex flex-col items-center justify-start w-full h-full">

        <div className="w-2/3 bg-red-300 flex items-start justify-center h-full p-4">

    <div className='flex items-center justify-center w-fit h-3 rounded-full px-8 py-4 bg-background2
    justify-self-end
    '>Step one of one</div>



</div>
    </div>    
)
}

export default UserSignUpMultiStep