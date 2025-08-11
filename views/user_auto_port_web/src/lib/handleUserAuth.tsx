// src/lib/authLibrary/handleUserAuth.ts
import { GoogleUser, User, UserGoogleLogIn, UserGoogleSignUp, UserLocalLogIn, UserLocalSignUp, UserPageData } from "@/types/authTypes";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "sonner";
import { dotEnv } from "./dotEnv";



// Function to fetch and validate user data
export const getMyData = async (
  setLoading?: (loading: boolean) => void
): Promise<UserPageData | undefined> => {
  try {
    // Start loading if the callback was passed
    setLoading?.(true);

    const response = await fetch(dotEnv.getMyDataLink, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    console.log(response);

    // Check response type before parsing
    const userResponseData = await response.json();
    console.log(userResponseData);

    // Safe destructuring with fallback
    const {
      code,
      success,
      data = {},
    } = userResponseData ?? {};

    const { valid, userData } = data;

    // Validate that all necessary values are present
    if (
      valid === true &&
      code === 200 &&
      success === true &&
      userData &&
      userData.email !== null
    ) {
      return userData;
    } else {
      toast.error('Something went wrong');
      return undefined;
    }
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return undefined;
  } finally {
    // End loading if the callback was passed
    setLoading?.(false);
  }
};




// validate the user outside the context again
        export  const isValidatedUser  = async  (
    setLoading : (loading : boolean) => void ,
    setValidated : (isValidated : boolean) => void,
        setUser : (user : User) => void
  ) => {
 try {
    const response = await fetch(dotEnv.cookieValidationLink, {
   method: "GET", headers: { "Content-Type": "application/json"},credentials: "include"});

console.log(response)
  const userResponseData  = await response.json();
  
  console.log(userResponseData);
  const {code , success , data : { valid, user  }} = userResponseData;
      
        if(valid && code === 200 && user.email !== null && success === true ){
          setUser(user);
          return setValidated(true);
        
        } 
        return setValidated(false);
      } catch (error) {
        console.log(error)
        return setValidated(false);
    } finally {
      setLoading(false)}};



// log in with local form
 export const handleUserLocalLogInSubmit = async (
    userInfo  : UserLocalLogIn,
   setLoading : (loading : boolean) => void) => {
    
    
      try {
      setLoading(true);
        
      const response = await fetch(dotEnv.userLocalLogInLink, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", 
          body: JSON.stringify(userInfo), 
        });

        const data = await response.json();
        console.log(data);


        if (!data.success || data.code !== 404 || !data.data) {
           setLoading(false)
           return toast("Invalid Login Credentials", {
                action: {
                  label: "Create New Account?",
                  onClick: () => window.location.replace("/join-us"),
                },
              })
            }



        if (!data.success || data.code !== 201 || !data.data) {
        setLoading(false)
        throw new Error("Login failed...trying again")
      }

      
        toast.success("Login successful!")
      window.location.replace("/");

    } catch (err: any) {
      toast.error(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  
  // sign up with local form
 export const handleUserLocalSignUp = async (
    userInfo  : UserLocalSignUp,
   setLoading : (loading : boolean) => void,
   retryCount = 0) => {
      
    if (retryCount > 3) {
        retryCount = 0
        setLoading(false)
        toast("We couldn't communicate with the server.", {
                action: {
                  label: 'One more time?',
                  onClick: () => window.location.replace("/join-us"),
                },
              })
           return;
    }

    try {
    
      
      setLoading(true);
        const response = await fetch(dotEnv.userLocalSignUpLink, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json", 
        },
        credentials: "include", 
        body: JSON.stringify(userInfo),
      });

      // Optionally parse the response
      const data = await response.json();
      console.log(data);
    if (data.code !== 201 && !data.data) {
        setLoading(false)
        
        throw new Error("Sign up failed...trying again")}

        
      toast.success("Sign up successful!")
      window.location.replace("/");
    } catch (err: any) {
      toast.error(err.message || "Sign Up failed")
    } finally {
      setLoading(false)
    }
  }




