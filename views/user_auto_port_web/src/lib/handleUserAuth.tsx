// src/lib/authLibrary/handleUserAuth.ts
import { GoogleUser, User, UserGoogleLogIn, UserGoogleSignUp, UserLocalLogIn, UserLocalSignUp, UserPageData } from "@/types/authTypes";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "sonner";
import { dotEnv } from "./dotEnv";







// sign up with google after getting the data

export const handleGoogleSignUp = async ( userInfo : UserGoogleSignUp,
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
              
      return;
    }
  

    try {
      setLoading(true);
    
        const response = await fetch(dotEnv.userGoogleSignInLink, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"},
        credentials: "include", body: JSON.stringify(userInfo)});

        const data = await response.json();
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      
      
      toast.message(`Hello ${userInfo.name} welcome to your fleet`)
      setLoading(false)
      window.location.replace("/");
    } catch (error) {
      toast("There was an issue saving your data. Retrying...");
      await handleGoogleSignUp(userInfo,setLoading , retryCount + 1); 
    } finally {
      setLoading(false)}}



      
// handle google log in after gettign the data

export const handleGoogleLogIn = async (
  userInfo : UserGoogleLogIn,
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
      
      setLoading(true);
            const response = await fetch(dotEnv.userGoogleSignInLink, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"},
            credentials: "include", 
            body: JSON.stringify(userInfo),
          });

          if (!response.ok) {
          const data = await response.json();
            throw new Error(`HTTP error! status: ${response.status}`);
          }

                const data = await response.json();
                toast.message(`Logged in succefully..Welcome back!`)
                setLoading(false)
               window.location.replace("/");
              } catch (error) {
                
                toast("There was an issue saving your data. Retrying...");
                await  handleGoogleLogIn(userInfo, setLoading, retryCount  + 1) 
              } finally {
                setLoading(false)
              }
          }



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


// sign in with google
  export const useUserGoogleSignIn = (
  setGoogleUserData: (googleUser: GoogleUser) => void,
  setLoading: (googleLoginLoading: boolean) => void,
  onDone : () => void, maxRetries : number = 3
) => {

  const signIn = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      
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

  return signIn;
};



