"use client";

import React from "react";
import Link from "next/link";
import HomeButton from "@/components/utils/HomeButton";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/ui/Loading";

export default function PrivacyPolicy() {

  const { userData, authLoading } = useAuth();


  return (
    <>    
    {
      authLoading ? <Loading/> : (
      <>  
 <HomeButton/>

    <main className="w-screen min-h-screen flex flex-col items-center justify-center px-2 gap-md">

      <section className="flexItemsCenter md:w-1/2 items-center justify-center gap-xs">
        <h1 className="titleText">{`${userData?.username  || "Nobody"}'s Profile Page` }</h1> 

        <article className="flexItemsCenter">
            
        </article>

      </section>

    </main>
   </>
      )
    }


    </>

  );
}