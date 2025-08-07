"use client";


import UserLicenceCard from '@/components/ui/CreditCardDemo';
import { useUserValidation } from '@/hooks/useUserValidation';
import { UserPageData } from '@/types/authTypes';
import { lazy, useEffect, useState } from 'react';





export default function Page() {
  const { returnMyData} = useUserValidation();
  const [userData, setUserData] = useState<UserPageData | undefined>(null);
  

  
    const handleUserData  = async () => {
         const user = await returnMyData()
      setUserData(user);
    }


  useEffect(() => {
    try {
      handleUserData();
    } catch (error) {
      console.error(error)
    }

  }, []);
  
  if (!userData || !userData.username || !userData.licence || !userData.licenceExp) return null;

    return (
  
      <div className="flex flex-col gap-4 items-center justify-start w-screen h-screen">

      <main className="w-[98vw]  h-[80vh] bg-green-400 flex flex-col items-center justify-start flex-wrap p-4">


          <section className="flex flex-col items-center justify-start h-full w-[65%] bg-yellow-300 gap-4 ">
            
          <article className="w-full h-[70%] bg-red-400 flex items-center justify-center self-start rounded-md">
    
     

<div className="flex item-center justify-center gap-2 p-2 self-end justify-end">
     <UserLicenceCard userStatus={userData?.userStatus} userName={userData?.username} userLisence={userData?.licence} lisenceExp={userData?.licenceExp}/>
</div>

    
          </article>


          <article className="w-full h-[30%] bg-blue-400 flex items-center justify-center self-start rounded-md">
        {
          userData?.email
        }
          </article>

          </section>



          <section className="lg:w-[30%] w-full h-[100%] bg-red-400 flex items-start justify-center flex-col  rounded-md">

            <h4 className="titleTex">
              My Dispatch History
            </h4>
        {
          userData?.email
        }
          </section>



     {/*    <div className="w-full h-[20rem] rounded-sm bg-red-300">
          <img src="/placeholder.png" alt=""  className='max-w-full max-h-full object-cover'/>
        

        </div> */}


      </main>
     </div>
    )
}
