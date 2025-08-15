import { useAuth } from "@/contexts/AuthContext";
import { dotEnv } from "@/lib/dotEnv";
import { isValidatedUser } from "@/lib/handleUserAuth";
import { deleteCookie } from "@/lib/utils";
import { AdminDetails } from "@/types/authTypes";
import { useEffect, useState } from "react";
import { toast } from "sonner";


    export const useUserValidation = (
    ) => {
        const [isValidated, setValidated] = useState<boolean | null>(false);
        const [loading, setLoading] = useState(true);
        const [adminDetails, setAdminDetails] = useState<AdminDetails | null>(null)
  
        
        const {setUser, userData} = useAuth();
 
        const checkValidation = async () => {
                setLoading(true);
             await isValidatedUser(setLoading,setValidated,setUser,setAdminDetails);
            };   

        
      const handleLogOut = async () => {
            toast.info("Routing")
            setLoading(true);
        
            
            try {
               await fetch(dotEnv.adminLogOutLink, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include", 
                });
                
                setLoading(false);
                deleteCookie(dotEnv.adminCookieName);
                return window.location.replace("/")
            } catch (error) {
              setLoading(false);
              console.log(error)
              toast.error("Something went wrong")
            } finally {
              setLoading(false);
            }
          };

            useEffect(() => {
                checkValidation();
            }, []);

            return { isValidated , loading ,checkValidation, handleLogOut, adminDetails, userData };
        };