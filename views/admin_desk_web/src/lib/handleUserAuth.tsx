// src/lib/authLibrary/handleUserAuth.ts
import { AdminDetails, AdminGoogleLogIn, AdminGoogleSignUp, AdminLocalLogIn, AdminLocalSignUp, GoogleUser, User } from "@/types/authTypes";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "sonner";
import { dotEnv } from "./dotEnv";


// this is self explanatory ode

 const handleAdminReqKeyValidation = async (
  requester : string,
  adminKey : string, setLoading : (loading : boolean) =>  void, setAdminKey : (adminKey : string) =>  void) =>{

  try{
    setLoading(true);
    toast.info("Validating your key...");
    
    const payload = {
      adminKey: adminKey,
    };
    const response = await fetch(dotEnv.adminKeyValidationLink, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
      body: JSON.stringify(payload),
    });


    const isValidAdminKey = await response.json();
    console.log(isValidAdminKey)


    if(isValidAdminKey.code !== 200 && !isValidAdminKey.success === true){
      setLoading(false);
      setAdminKey(" ");
      throw new Error("Invalid admin key!");
    }
    setAdminKey(" ")
    toast.info("Validated admin key...")

  } 
    catch(error){
    toast.error(error instanceof Error ? error.message : String(error));
    toast.message("Redirecting....")
    window.location.replace(requester)}}



    

      
// validate the user outside the context again
        export  const isValidatedUser  = async  (
    setLoading : (loading : boolean) => void ,
    setValidated : (isValidated : boolean) => void,
        setUser : (user : User) => void,
        setAdminDetails : (adminUser : AdminDetails) => void
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
          setAdminDetails(user);
          return setValidated(true);        
        } 
        return setValidated(false);
      } catch (error) {
        console.log(error)
        return setValidated(false);
    } finally {
      setLoading(false)}};



// get my data 

       export  const getMyData  = async  () => {
 try {
    const response = await fetch(dotEnv.cookieValidationLink, {
   method: "GET", headers: { "Content-Type": "application/json"},credentials: "include"});

console.log(response)
  const userResponseData  = await response.json();
  console.log(userResponseData);
  
  const {code , success , data : { valid, user  }} = userResponseData;
      
        if(valid && code === 200 && user.email !== null && success === true ){
         return user  
        } 
        return undefined;
      } catch (error) {
        console.log(error)
        return undefined;
      }};


      
  // sign up with local form
 export const handleAdminLocalSignUp = async (
    userInfo  : AdminLocalSignUp,
   setLoading : (loading : boolean) => void,
   setAdminKey : (adminKey : string) => void,
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
    
    handleAdminReqKeyValidation("/join-us",userInfo.adminKey,setLoading,setAdminKey);
      setLoading(true);
        const response = await fetch(dotEnv.adminLocalSignUpLink, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json", 
        },
        credentials: "include", 
        body: JSON.stringify(userInfo),
      });

      console.log(response)
      const data = await response.json();
      console.log(data)
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


  
  // sign up with local form
 export const handleAdminLocalLogInSubmit = async (
    userInfo  : AdminLocalLogIn,
   setLoading : (loading : boolean) => void,
   setAdminKey : (adminKey : string) => void,
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
    
    handleAdminReqKeyValidation("/weclome-back",userInfo.adminKey,setLoading,setAdminKey);
      setLoading(true);
        const response = await fetch(dotEnv.adminLocalLogInLink, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json", 
        },
        credentials: "include", 
        body: JSON.stringify(userInfo),
      });

      console.log(response)
      const data = await response.json();
      console.log(data)
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