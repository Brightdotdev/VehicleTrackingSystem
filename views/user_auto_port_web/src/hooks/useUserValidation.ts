import { isValidatedUser } from "@/lib/handleUserAuth";
import { useEffect, useState } from "react";


    export const useUserValidation = (
    ) => {
        const [isValidated, setValidated] = useState(false);
        const [loading, setLoading] = useState(false);

        const checkValidation = async () => {
                setLoading(true);
             await isValidatedUser(setLoading,setValidated)
            };

            useEffect(() => {
                checkValidation();
            }, []);

            return { isValidated , loading , checkValidation };
        };