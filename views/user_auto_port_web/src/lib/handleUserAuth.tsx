// src/lib/authLibrary/handleUserAuth.ts

import { GoogleUser, User, UserGoogleLogIn, UserGoogleSignUp, UserLocalLogIn, UserLocalSignUp, UserPageData } from "@/types/authTypes";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "sonner";
import { dotEnv } from "./dotEnv";

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

    const userResponseData = await response.json();
    console.log("[getMyData] Parsed JSON:", userResponseData);

    const { code, success, data = {} } = userResponseData ?? {};
    console.log("[getMyData] Destructured:", { code, success, data });

    const { valid, userData } = data;
    console.log("[getMyData] Validation check:", { valid, userData });

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
 * Validate user from cookie
 */
export const isValidatedUser = async (
  setLoading: (loading: boolean) => void,
  setValidated: (isValidated: boolean) => void,
  setUser: (user: User) => void
) => {
  try {
    console.log("[isValidatedUser] Fetching:", dotEnv.cookieValidationLink);

    const response = await fetch(dotEnv.cookieValidationLink, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    console.log("[isValidatedUser] Raw response:", response);

    const userResponseData = await response.json();
    console.log("[isValidatedUser] Parsed JSON:", userResponseData);

    const { code, success, data: { valid, user } = { valid: false, user: {} } } = userResponseData;
    console.log("[isValidatedUser] Destructured:", { code, success, valid, user });

    if (valid && code === 200 && user.email !== null && success === true) {
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

    const data = await response.json();
    console.log("[handleUserLocalLogInSubmit] Parsed JSON:", data);

    if (!data.success || data.code !== 404 || !data.data) {
      console.log("[handleUserLocalLogInSubmit] Invalid login credentials");
      setLoading(false);
      return toast("Invalid Login Credentials", {
        action: {
          label: "Create New Account?",
          onClick: () => window.location.replace("/join-us"),
        },
      });
    }

    if (!data.success || data.code !== 201 || !data.data) {
      console.log("[handleUserLocalLogInSubmit] Login failed, retrying...");
      setLoading(false);
      throw new Error("Login failed...trying again");
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
  setLoading: (loading: boolean) => void,
  retryCount = 0
) => {
  if (retryCount > 3) {
    retryCount = 0;
    setLoading(false);
    toast("We couldn't communicate with the server.", {
      action: {
        label: 'One more time?',
        onClick: () => window.location.replace("/join-us"),
      },
    });
    return;
  }

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

    const data = await response.json();
    console.log("[handleUserLocalSignUp] Parsed JSON:", data);

    if (data.code !== 201 && !data.data) {
      console.log("[handleUserLocalSignUp] Signup failed");
      setLoading(false);
      throw new Error("Sign up failed...trying again");
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
