import { useAuth } from '@/contexts/AuthContext';
import React from 'react'
import Loading from './Loading';

const Notifications = () => {

  const { userData , authLoading } = useAuth();

  return (
    <>    
    {
      authLoading ? <Loading/> : (
      <>
      

    <main className="w-screen min-h-screen flex flex-col items-start justify-start py-6 px-4 gap-md">

             <h1 className="subTitleText2">{`${userData?.username  || "Nobody"}'s Notifications`}</h1> 

        <section className="w-full flex flex-col items-start justify-center gap-sm"> 


      <article className="flexItemsCenter  gap-2 w-full h-20 bg-foreground">
      </article>

<div className="flex items-center justify-center gap-2 w-full h-20 bg-foreground"></div>
             
        </section>
          


    </main>
   </>
      )
    }
    </>

  );
}

export default Notifications