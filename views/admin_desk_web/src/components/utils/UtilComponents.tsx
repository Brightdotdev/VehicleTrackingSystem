"use client"

import React from 'react'
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminLogInGoogle, useAdminSignUpGoogle } from '@/lib/handleUserAuth';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';


export const  GoogleButton = ({ loading, setGoogleLoading, authType }: { loading: boolean, setGoogleLoading: (loading: boolean) => 
  void, authType : string }) => {
    const router = useRouter();
    const {setGoogleUserData} = useAuth();

    const login = useAdminLogInGoogle(setGoogleUserData, setGoogleLoading,() => {
  toast.success("Login successful!");
  router.replace("/admin-key?sender=google-log-in");
}
    );
    const signUp = useAdminSignUpGoogle(setGoogleUserData, setGoogleLoading,() => {
  toast.success("Sign Up successful!");
  router.replace("/admin-key?sender=google-sign-up");});


    return (
        <>
            {loading ? (
                <Button disabled className="w-full cursor-pointer bg-background2 text-foreground ">
                    <Loader2 className="animate-spin " />
                    {authType === 'google-sign-up' ? "Google Sign Up Coming Up" : "Google Log In Coming Up"}
                </Button>
            ) : (
                <Button
                    variant="outline"
                    className="w-full cursor-pointer bg-chart-1
                        relative overflow-hidden group rounded-lg  text-background dark:text-foreground font-semibold shadow-md transition duration-300 hover:shadow-lg focus:outline-none"
                  onClick={async (e) => {
    e.preventDefault();
    if (authType === 'google-sign-up') {
      try {
        toast.info("Google Sign Up Coming Up");
         signUp();
      } catch (error) {
        toast.error("Google Sign Up failed!");
        console.log(error);
      }
    } else if (authType === 'google-log-in') {
      try {
        toast.info("Google Log In Coming Up");
        login();
        } catch (error) {
        toast.error("Google Log In failed!");
        console.log(error);
      }
    } else {
      toast.error("Unknown authentication type!");
    }
  }}
                >
                    <span className="relative z-160 flex gap-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path
                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                fill="currentColor"
                            />
                        </svg>
                        {authType === 'google-sign-up' ? "Google Sign Up" : "Google Log In"}
                    </span>
                    <span className="absolute inset-0 z-0 pointer-events-none">
                        <span className="absolute top-0 left-[-75%] h-full w-[50%] rotate-12 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 animate-sheen" />
                    </span>
                </Button>
            )}
        </>
    );
};




export const HealthText = ({value} : {value : number}) =>{
  if(value === 100 ) 
  return <p className='text-body-2 text-green-900'>{value}</p> 
  else if(value >= 95)
  return <p className='text-body-2 text-green-800'>{value}</p> 
  else if(value >= 90)
  return <p className='text-body-2 text-blue-800'>{value}</p>
  else if(value >= 85 ) 
  return <p className='text-body-2 text-blue-500'>{value}</p>
  else if (value >= 80)
  return <p className='text-body-2 text-orange-400'>{value}</p> 
   else if (value >= 75)
  return <p className='text-body-2 text-orange-600'>{value}</p> 
  else if ( value >= 63 ) 
  return <p className='text-body-2 text-yellow-900'>{value}</p> 
 else
  return <p className='text-body-2 text-red-900'>{value}</p>  
}