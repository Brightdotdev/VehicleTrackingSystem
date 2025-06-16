import { isValidatedUser } from "@/lib/handleUserAuth";
import { User } from "@/types/authTypes";
import { useEffect, useState } from "react";


    export const useUserValidation = (
    ) => {
        const [isValidated, setValidated] = useState(false);
        const [loading, setLoading] = useState(false);
        const [user, setUser] = useState<User>();

        const checkValidation = async () => {
                setLoading(true);
             await isValidatedUser(setLoading,setValidated,setUser);
            };

            useEffect(() => {
                checkValidation();
            }, []);

            return { isValidated , loading , checkValidation, user };
        };