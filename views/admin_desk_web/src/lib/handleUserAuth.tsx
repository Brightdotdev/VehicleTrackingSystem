// src/lib/authLibrary/handleUserAuth.ts
import { AdminGoogleLogIn, AdminGoogleSignUp, AdminLocalLogIn, AdminLocalSignUp, GoogleLogInProps, GoogleUser } from "@/types/authTypes";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "sonner";
import { dotEnv } from "./dotEnv";
import { authFetch } from "./utils";




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
              
      return;
    }
  

    try {
      handleAdminReqKeyValidation("/join-us",userInfo.adminKey,setLoading, setAdminKey);
      setLoading(true);
    
        const response = await fetch(dotEnv.adminGoogleSignUpLink, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"},
        credentials: "include", body: JSON.stringify(userInfo)});
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      
      
      toast.message(`Hello ${userInfo.name} welcome to your desk`)
      setLoading(false)
      window.location.replace("/");
    } catch (error) {

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
          const data = await response.json();
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
                toast.message(`Logged in succefully..Welcome back!`)
                setLoading(false)
               window.location.replace("/");
              } catch (error) {
                
                toast("There was an issue saving your data. Retrying...");
                await  handleGoogleLogIn(userInfo,setAdminKey, setLoading, retryCount  + 1) 
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



// Validate admin request key before login/signup
const handleAdminReqKeyValidation = async (
  requester: string,
  adminKey: string,
  setLoading: (loading: boolean) => void,
  setAdminKey: (adminKey: string) => void
) => {
  try {
    setLoading(true);
    toast.info("Validating your key...");

    const payload = { adminKey };
    const response = await authFetch(dotEnv.adminKeyValidationLink, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const isValidAdminKey = await response.json();

    if (isValidAdminKey.code !== 200 || !isValidAdminKey.success) {
      setLoading(false);
      setAdminKey("");
      throw new Error("Invalid admin key!");
    }

    setAdminKey("");
    toast.info("Validated admin key...");
  } catch (error) {
    toast.error(error instanceof Error ? error.message : String(error));
    toast.message("Redirecting....");
    window.location.replace(requester);
  }
};

// ✅ Admin local login
export const handleAdminLocalLogInSubmit = async (
  userInfo: AdminLocalLogIn,
  setLoading: (loading: boolean) => void,
  setAdminKey: (adminKey: string) => void,
  retryCount = 0
) => {
  if (retryCount > 3) {
    setLoading(false);
    toast("We couldn't communicate with the server.", {
      action: {
        label: "One more time?",
        onClick: () => window.location.replace("/welcome-back"),
      },
    });
    return;
  }

  try {
    await handleAdminReqKeyValidation(
      "/welcome-back",
      userInfo.adminKey,
      setLoading,
      setAdminKey
    );

    setLoading(true);

    const response = await authFetch(dotEnv.adminLocalLogInLink, {
      method: "POST",
      body: JSON.stringify(userInfo),
    });

    const data = await response.json();

    if (data.status !== 200 || data.code !== 200 || !data.data) {
      throw new Error("Login failed...trying again");
    }

    localStorage.setItem("accessToken", data.jwt); // ✅ Store token
    toast.success("Login successful!");
    window.location.replace("/");
  } catch (err: any) {
    toast.error(err.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

// ✅ Admin local signup
export const handleAdminLocalSignUp = async (
  userInfo: AdminLocalSignUp,
  setLoading: (loading: boolean) => void,
  setAdminKey: (adminKey: string) => void,
  retryCount = 0
) => {
  if (retryCount > 3) {
    setLoading(false);
    toast("We couldn't communicate with the server.", {
      action: {
        label: "One more time?",
        onClick: () => window.location.replace("/join-us"),
      },
    });
    return;
  }

  try {
    await handleAdminReqKeyValidation(
      "/join-us",
      userInfo.adminKey,
      setLoading,
      setAdminKey
    );

    setLoading(true);

    const response = await authFetch(dotEnv.adminLocalSignUpLink, {
      method: "POST",
      body: JSON.stringify(userInfo),
    });

    const data = await response.json();

    if (data.code !== 201 || !data.data) {
      throw new Error("Sign up failed...trying again");
    }

    localStorage.setItem("accessToken", data.jwt); // ✅ Store token
    toast.success("Sign up successful!");
    window.location.replace("/");
  } catch (err: any) {
    toast.error(err.message || "Sign up failed");
  } finally {
    setLoading(false);
  }
};

// ✅ Admin user validation
export const isValidatedUser = async (
  setLoading: (loading: boolean) => void,
  setValidated: (isValidated: boolean) => void
) => {
  try {
    const response = await authFetch(dotEnv.cookieValidationLink, {
      method: "GET",
    });

    const userResponseData = await response.json();
    const {
      code,
      success,
      data: { valid, user },
    } = userResponseData;

    if (valid && code === 200 && user.email !== null && success === true) {
      return setValidated(true);
    }

    return setValidated(false);
  } catch (error) {
    return setValidated(false);
  } finally {
    setLoading(false);
  }
};
