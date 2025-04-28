// src/lib/authLibrary/handleUserAuth.ts

import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "sonner";



interface GoogleLogInProps{
    setLoading: (loading: boolean) => void;
}

interface GoogleUser {
    sub: string;
    given_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
}


export const useHandleGoogleSignIn = ({ setLoading}: GoogleLogInProps): (() => void) => {
   
    const googleCleintId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
    const googleClientSecret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "";

    const login = useGoogleLogin({
      onSuccess: async (codeResponse) => {
        console.log(codeResponse);
        try {
            setLoading(true)
          toast.info(`Validating your data from google....`);
            // Exchange authorization code for access token
          const tokenResponse = await axios.post(
            "https://oauth2.googleapis.com/token",
            {
              code: codeResponse.code,
              client_id: googleCleintId,
              client_secret: googleClientSecret, 
              redirect_uri: "http://localhost:3000" ,
              grant_type: "authorization_code",
            }
          );
  
          const accessToken = tokenResponse.data.access_token;
          console.log("Access Token:", accessToken);
  
          // Use the access token to fetch user info
          const googleResponse = await axios.get(
            `https://www.googleapis.com/oauth2/v3/userinfo`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              }});


          
          console.log("Google User Info:", googleResponse.data);
          toast.info(`just a sec..`);
            
          handleUserDatabaseSave(googleResponse.data, setLoading)

        } catch (error) {
            setLoading(false)
            const axiosError = error as any; // or use AxiosError if imported
        console.error("Error response:", axiosError.response?.data);
          console.error("Error fetching user data:", error);
          toast.error("Uhm hi there was an error logging you in Let's try that again");
        }
      },
      flow: "auth-code",
    });
  
    return login;
  }




  const handleUserDatabaseSave = async (userData:  GoogleUser ,setLoading : (loading : boolean) => void, retryCount = 0) => {
   
    if (retryCount > 3) {
        retryCount = 0
        setLoading(false)
        toast("We couldn't communicate with the server.", {
                action: {
                  label: 'One more time?',
                  onClick: () => handleUserDatabaseSave(userData, setLoading, retryCount + 1),
                },
              })
      console.error("Max retries reached. Could not save user data.");
      return;
    }
  

    try {
      const response = await axios.post(
        "http://localhost:8102/v1/auth/new-user/google", // Added "http://"
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
  
      console.log("User saved successfully:", response.data);
      toast.message(`Hello ${userData.given_name} welcome to your desk`)
      setLoading(false)
      window.location.replace("/dashboard");
    } catch (error) {
      console.error("Error saving user data:", error);
      toast("There was an issue saving your data. Retrying...");
      await handleUserDatabaseSave(userData,setLoading , retryCount + 1); // Retry with incremented count
    }
  };