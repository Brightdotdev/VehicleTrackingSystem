import { useAuth } from "@/contexts/AuthContext";
import { dotEnv } from "@/lib/dotEnv";
import { isValidatedUser } from "@/lib/handleUserAuth";
import { deleteCookie } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";


    export const useUserValidation = (
    ) => {
        const [isValidated, setValidated] = useState<boolean | null>(null);
        const [loading, setLoading] = useState(true);
        const {setUser, userData} = useAuth();
      

        const checkValidation = async () => {
                setLoading(true);
             await isValidatedUser(setLoading,setValidated,setUser);
                
            };

            
      const handleLogOut = async () => {
            toast.info("Routing")
            setLoading(true);
        
            
            try {
                  const response = await fetch(dotEnv.adminLogOutLink, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include", 
                });
                console.log(response)
                const data = await response.json();
               
                console.log(data)

                setLoading(false);
                deleteCookie(dotEnv.adminCookieName);
                return window.location.replace("/")
            } catch (error) {
              setLoading(false);
              toast.error("Something went wrong")
            } finally {
              setLoading(false);
            }
          };




            useEffect(() => {
                checkValidation();
            }, []);

            return { isValidated , loading , checkValidation, handleLogOut , userData };
        };