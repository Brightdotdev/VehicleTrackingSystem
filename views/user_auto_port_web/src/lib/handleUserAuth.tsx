// src/lib/authLibrary/handleUserAuth.ts

import { User, UserLocalLogIn, UserLocalSignUp, UserPageData } from "@/types/authTypes";
import { toast } from "sonner";
import { dotEnv } from "./dotEnv";

/**
 * Safely parse response to JSON if it has body content.
 * Returns undefined if no content or invalid JSON.
 */
async function safeJsonParse(response: Response): Promise<any | undefined> {
  const text = await response.text();

  if (!text) {
    console.warn("[safeJsonParse] Response body is empty");
    return undefined;
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("[safeJsonParse] Failed to parse JSON:", err);
    return undefined;
  }
}
/**
 * Validate user from cookie
 */
export const isValidatedUser = async (
  setLoading: (loading: boolean) => void,
  setValidated: (isValidated: boolean) => void,
  setUser: (user: User) => void
) => {
  try {
    setLoading(true);
    console.log("[isValidatedUser] Fetching:", dotEnv.cookieValidationLink);

    const response = await fetch(dotEnv.cookieValidationLink, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    console.log("[isValidatedUser] Raw response:", response);

    const userResponseData = await safeJsonParse(response);
    console.log("[isValidatedUser] Parsed JSON:", userResponseData);

    // Safe destructuring
    const { code, success, data } = userResponseData ?? {};
    const valid = data?.valid ?? false;
    const user = data?.user ?? {};

    console.log("[isValidatedUser] Safe destructured:", { code, success, valid, user });

    if (valid && code === 200 && success === true && user.email !== null) {
      console.log("[isValidatedUser] User validated successfully");
      setUser(user);
      return setValidated(true);
    }

    console.log("[isValidatedUser] Validation failed");
    return setValidated(false);
  } catch (error) {
    console.log("[isValidatedUser] Error:", error);
    return setValidated(false);
  } finally {
    setLoading(false);
  }
};



/**
 * Fetch and validate user data
 */
export const getMyData = async (
  setLoading?: (loading: boolean) => void
): Promise<UserPageData | undefined> => {
  try {
    setLoading?.(true);
    console.log("[getMyData] Fetching:", dotEnv.getMyDataLink);

    const response = await fetch(dotEnv.getMyDataLink, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    console.log("[getMyData] Raw response:", response);

    const userResponseData = await safeJsonParse(response);
    console.log("[getMyData] Parsed JSON:", userResponseData);

    // ✅ Safe destructuring (no crash if data is null)
    const { code, success, data } = userResponseData ?? {};
    const valid = data?.valid ?? false;
    const userData = data?.userData ?? {};

    console.log("[getMyData] Validation check:", { code, success, valid, userData });

    if (
      valid === true &&
      code === 200 &&
      success === true &&
      userData &&
      userData.email !== null
    ) {
      console.log("[getMyData] Returning userData:", userData);
      return userData;
    } else {
      toast.error('Something went wrong');
      return undefined;
    }
  } catch (error) {
    console.error("[getMyData] Failed to fetch user data:", error);
    return undefined;
  } finally {
    setLoading?.(false);
  }
};


/**
 * Local login
 */
export const handleUserLocalLogInSubmit = async (
  userInfo: UserLocalLogIn,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    console.log("[handleUserLocalLogInSubmit] Sending login request:", userInfo);

    const response = await fetch(dotEnv.userLocalLogInLink, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(userInfo),
    });

    console.log("[handleUserLocalLogInSubmit] Raw response:", response);

    const data = await safeJsonParse(response);
    console.log("[handleUserLocalLogInSubmit] Parsed JSON:", data);

    // Note: original logic seemed off on success/failure checks, fixing it:
    if (!data || !data.success || (data.code !== 200 && data.code !== 201) || !data.data) {
      console.log("[handleUserLocalLogInSubmit] Invalid login credentials");
      setLoading(false);
      return toast("Invalid Login Credentials", {
        action: {
          label: "Create New Account?",
          onClick: () => window.location.replace("/join-us"),
        },
      });
    }

    toast.success("Login successful!");
    window.location.replace("/");
  } catch (err: any) {
    console.error("[handleUserLocalLogInSubmit] Error:", err);
    toast.error(err.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

/**
 * Local signup
 */
export const handleUserLocalSignUp = async (
  userInfo: UserLocalSignUp,
  setLoading: (loading: boolean) => void
) => {
 
  console.log("[handleUserLocalSignUp] Sending signup request:", userInfo);


  try {
    setLoading(true);
    console.log("[handleUserLocalSignUp] Sending signup request:", userInfo);

    const response = await fetch(dotEnv.userLocalSignUpLink, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(userInfo),
    });

    console.log("[handleUserLocalSignUp] Raw response:", response);

    const data = await safeJsonParse(response);
    console.log("[handleUserLocalSignUp] Parsed JSON:", data);

    if (!data || data.code !== 201 || !data.data) {
      console.log("[handleUserLocalSignUp] Signup failed");
      setLoading(false);
      throw new Error("Sign up failed..");
    }

    toast.success("Sign up successful!");
    window.location.replace("/");
  } catch (err: any) {
    console.error("[handleUserLocalSignUp] Error:", err);
    toast.error(err.message || "Sign Up failed");
  } finally {
    setLoading(false);
  }
};
