


import type { HTMLAttributes } from 'react';
import { CreditCard, CreditCardBack, CreditCardChip, CreditCardCvv, CreditCardExpiry, CreditCardFlipper, CreditCardFront, CreditCardLogo, CreditCardMagStripe, CreditCardName, CreditCardNumber, CreditCardServiceProvider } from './CreditCard';
import { CableCar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { UserStatus } from '@/types/authTypes';


const UserLicenceCard = ({userName, userLisence, lisenceExp,userStatus}: {userName : string , userLisence : string, lisenceExp :string, userStatus : UserStatus }) => {



const formatAsCardExpiry = (dateStr: string) => {
  return format(parseISO(dateStr), "MM/yy")
}


const userStatusText = (userStatus : UserStatus) =>{

     switch (userStatus) {
       case  UserStatus.ADMIN :
            return "Auto Port's Admin"
       case UserStatus.CIVILIAN:
            return "Auto Port Civilian Card"
       case UserStatus.DRIVER:
            return "Auto Port Driver"
        case UserStatus.TRANSPORTER:
            return "Auto Port Transpoter"
     }
   
}


    if(userName === undefined || userLisence === undefined || lisenceExp === undefined ) return null

return (
        <CreditCard className='md:w-[20rem] w-[18rem]'>
    <CreditCardFlipper>
      <CreditCardFront className="bg-[#063573]">
        
        <div className="absolute top-0 left-0 h-1/12 flex items-center justify-center gap-2">
    <p className='bodyText'> {userStatusText(userStatus)}</p>
        </div>

        <CreditCardLogo>
          <CableCar className="text-[#0e72d1] size-10" />
        </CreditCardLogo>
        <CreditCardServiceProvider type="AUTO-PORT" format="logo" className="brightness-0 invert" />
        <CreditCardName className="absolute bottom-0 left-0">
            {userName} 
        </CreditCardName>
      </CreditCardFront>
      <CreditCardBack className="bg-[#063573]">
        <CreditCardMagStripe />
        <CreditCardNumber className="absolute bottom-0 left-0">
          {userLisence}
        </CreditCardNumber>
        <div className="-translate-y-1/2 absolute top-1/2 flex gap-4">
          <CreditCardExpiry> {formatAsCardExpiry(lisenceExp)}</CreditCardExpiry>
        </div>
      </CreditCardBack>
    </CreditCardFlipper>
  </CreditCard>
);}
export default UserLicenceCard;
