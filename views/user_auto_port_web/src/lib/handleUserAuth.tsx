// src/lib/authLibrary/handleUserAuth.ts
import { AdminGoogleLogIn, AdminGoogleSignUp, AdminLocalLogIn, AdminLocalSignUp, GoogleLogInProps, GoogleUser } from "@/types/authTypes";
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
    window.location.replace(requester);
    console.log(error)}}




// sign up with google after getting the data


export const handleGoogleSignUp = async ( userInfo : AdminGoogleSignUp,
  setAdminKey : (adminKey : string) => void,
  setLoading : (loading : boolean) => void,
  retryCount = 0
    ) => {
        
    if (retryCount > 3) {
        retryCount = 0
        setLoading(false)
        toast("Too many atempts try Signing up again", {
                action: {
                  label: 'Try again',
                  onClick: () => window.location.replace("/join-us"),
                },
              })
      console.error("Max retries reached. Could not save user data.");
      return;
    }
  

    try {
      handleAdminReqKeyValidation("/join-us",userInfo.adminKey,setLoading, setAdminKey);
      setLoading(true);

      console.log(userInfo);
        const response = await fetch(dotEnv.adminGoogleSignUpLink, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"},
        credentials: "include", body: JSON.stringify(userInfo)});
      const data = await response.json();

      console.log(response)
      console.log(data)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      
      console.log("User saved successfully:", data);
      toast.message(`Hello ${userInfo.name} welcome to your desk`)
      setLoading(false)
      window.location.replace("/");
    } catch (error) {
      console.error("Error saving user data:", error);
      toast("There was an issue saving your data. Retrying...");
      await handleGoogleSignUp(userInfo,setAdminKey,setLoading , retryCount + 1); 
    } finally {
      setLoading(false)}}



// handle google log in after gettign the data

export const handleGoogleLogIn = async (
  userInfo : AdminGoogleLogIn,
  setAdminKey : (adminKey : string) => void ,
  setLoading : (loading : boolean) => void,
  retryCount = 0) => {
  
    if (retryCount > 3) {
        setLoading(false)
        toast("We couldnt log you in for some reason", {
                action: {
                  label: 'One more time?',
                  onClick: () => window.location.replace("/join-us"),
                },
              });
      return;
    }
  

    try {
      handleAdminReqKeyValidation("/welcome-back",userInfo.adminKey,setLoading, setAdminKey);

      setLoading(true);

            const response = await fetch(dotEnv.adminGoogleLogInLink, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"},
            credentials: "include", 
            body: JSON.stringify(userInfo),
          });

          if (!response.ok) {
            console.log(response)
          const data = await response.json();
          console.log(data);
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
                console.log("User Logged in succesfully:", data);
                toast.message(`Logged in succefully..Welcome back!`)
                setLoading(false)
               window.location.replace("/");
              } catch (error) {
                console.error("Error saving user data:", error);
                toast("There was an issue saving your data. Retrying...");
                await  handleGoogleLogIn(userInfo,setAdminKey, setLoading, retryCount  + 1) 
              } finally {
                setLoading(false)
              }
          }






// log in with local form
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
                  onClick: () => window.location.replace("/welcome-back"),
                },
              })
           return;
    }

    try {
    
    handleAdminReqKeyValidation("/welcome-back",userInfo.adminKey,setLoading,setAdminKey);
      setLoading(true);
        const response = await fetch(dotEnv.adminLocalLogInLink, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", 
          body: JSON.stringify(userInfo), 
        });

        const data = await response.json();

        if (data.status !== 200 || data.code !== 200 || !data.data) {
        setLoading(false)
        console.log(response)
        throw new Error("Login failed...trying again")}

      console.log(data)
      console.log(response)
      toast.success("Login successful!")
      window.location.replace("/");

    } catch (err: any) {
      toast.error(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  
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

      // Optionally parse the response
      const data = await response.json();
      console.log(data);
    if (data.status !== 200 || data.code !== 200 || !data.data) {
        setLoading(false)
        console.log(response)
        throw new Error("Sign up failed...trying again")}

      console.log(data)
      console.log(response)
      toast.success("Sing up successful!")
      window.location.replace("/");
    } catch (err: any) {
      toast.error(err.message || "Sing Up failed")
    } finally {
      setLoading(false)
    }
  }


// log in with google

  export const useAdminLogInGoogle = (
  setGoogleUserData: (googleUser: GoogleUser) => void,
  setLoading: (googleLoginLoading: boolean) => void,
  onDone : () => void, maxRetries : number = 3
) => {

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);
       let retryCount = 0;
      async function tryLogin() {
        try {
          setLoading(true);
          
          const tokenResponse = await axios.post(
            dotEnv.googleAuthTokenLink,
            {
              code: codeResponse.code,
              client_id: dotEnv.googleCleintId,
              client_secret: dotEnv.googleClientSecret,
              redirect_uri: dotEnv.googleAuthRedirectLink,
              grant_type: "authorization_code",
            }
          );
          const accessToken = tokenResponse.data.access_token;
          const googleResponse = await axios.get(
            dotEnv.versionInfoLink,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              }
            }
          );
      const pageExpTime = Date.now() + 5 * 60 * 1000;
          setGoogleUserData({ ...googleResponse.data, pageExpTime });
          console.log({...googleResponse.data, pageExpTime})

          toast.info(`just a sec..`);
          if (onDone) onDone();
        } catch (error) {
          retryCount++;
          if (retryCount <= maxRetries) {
            toast.error(`Retrying... (${retryCount}/${maxRetries})`);
            await tryLogin();
          } else {
            setLoading(false);
            toast.error("Uhm hi there was an error logging you in.");
          }
        } finally {
          setLoading(false);
        }
      }
      await tryLogin();},
    flow: "auth-code",
  });

  return login;
};




//sign up with google

export const useAdminSignUpGoogle = (
  setGoogleUserData: (googleUser: GoogleUser) => void,
  setGoogleLogInLoading: (googleLoginLoading: boolean) => void, 
  onDone : () => void , maxRetries : number = 3
) => {

   

const signUp = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      let retryCount = 0;
      async function trySignUp() {
        try {
          setGoogleLogInLoading(true);
    
          const tokenResponse = await axios.post(
            dotEnv.googleAuthTokenLink,
            {
              code: codeResponse.code,
              client_id: dotEnv.googleCleintId,
              client_secret: dotEnv.googleClientSecret,
              redirect_uri: dotEnv.googleAuthRedirectLink,
              grant_type: "authorization_code",
            }
          );
          const accessToken = tokenResponse.data.access_token;
          const googleResponse = await axios.get(
            dotEnv.versionInfoLink,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              }
            }
          );
      const pageExpTime = Date.now() + 5 * 60 * 1000;
          setGoogleUserData({...googleResponse.data, pageExpTime});
          console.log({...googleResponse.data, pageExpTime})
          toast.info(`just a sec..`);
          if (onDone) onDone();
        } catch (error) {
          retryCount++;
          if (retryCount <= maxRetries) {
            toast.error(`Retrying... (${retryCount}/${maxRetries})`);
            await trySignUp();
          } else {
            setGoogleLogInLoading(false);
            toast.error("There was an error signing you up.");
          }
        } finally {
          setGoogleLogInLoading(false);
        }
      }
      await trySignUp();
    },
    flow: "auth-code",
  });

  return signUp;
};
