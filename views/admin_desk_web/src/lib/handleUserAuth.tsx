// src/lib/authLibrary/handleUserAuth.ts

import {
  AdminDetails,
  AdminGoogleLogIn,
  AdminGoogleSignUp,
  AdminLocalLogIn,
  AdminLocalSignUp,
  GoogleUser,
  User
} from "@/types/authTypes";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "sonner";
import { dotEnv } from "./dotEnv";

/**
 * Validates the admin request key with the backend
 */
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
    console.log("[handleAdminReqKeyValidation] Sending payload:", payload);

    const response = await fetch(dotEnv.adminKeyValidationLink, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    console.log("[handleAdminReqKeyValidation] Raw response:", response);

    const isValidAdminKey = await response.json();
    console.log("[handleAdminReqKeyValidation] Parsed JSON:", isValidAdminKey);

    if (isValidAdminKey.code !== 200 || isValidAdminKey.success !== true) {
      console.log("[handleAdminReqKeyValidation] Invalid key detected");
      setLoading(false);
      setAdminKey("");
      throw new Error("Invalid admin key!");
    }

    setAdminKey("");
    toast.info("Validated admin key...");
  } catch (error) {
    console.error("[handleAdminReqKeyValidation] Error:", error);
    toast.error(error instanceof Error ? error.message : String(error));
    toast.message("Redirecting...");
    window.location.replace(requester);
  }
};

/**
 * Validates the logged-in user
 */
export const isValidatedUser = async (
  setLoading: (loading: boolean) => void,
  setValidated: (isValidated: boolean) => void,
  setUser: (user: User) => void,
  setAdminDetails: (adminUser: AdminDetails) => void
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
      console.log("[isValidatedUser] Validation success");
      setUser(user);
      setAdminDetails(user);
      return setValidated(true);
    }

    console.log("[isValidatedUser] Validation failed");
    return setValidated(false);
  } catch (error) {
    console.error("[isValidatedUser] Error:", error);
    return setValidated(false);
  } finally {
    setLoading(false);
  }
};

/**
 * Gets user data
 */
export const getMyData = async () => {
  try {
    console.log("[getMyData] Fetching:", dotEnv.cookieValidationLink);

    const response = await fetch(dotEnv.cookieValidationLink, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    console.log("[getMyData] Raw response:", response);

    const userResponseData = await response.json();
    console.log("[getMyData] Parsed JSON:", userResponseData);

    const { code, success, data: { valid, user } = { valid: false, user: {} } } = userResponseData;
    console.log("[getMyData] Destructured:", { code, success, valid, user });

    if (valid && code === 200 && user.email !== null && success === true) {
      console.log("[getMyData] Returning user data");
      return user;
    }

    console.log("[getMyData] Returning undefined (failed validation)");
    return undefined;
  } catch (error) {
    console.error("[getMyData] Error:", error);
    return undefined;
  }
};

/**
 * Admin sign up
 */
export const handleAdminLocalSignUp = async (
  userInfo: AdminLocalSignUp,
  setLoading: (loading: boolean) => void,
  setAdminKey: (adminKey: string) => void,
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
    console.log("[handleAdminLocalSignUp] User info:", userInfo);

    await handleAdminReqKeyValidation("/join-us", userInfo.adminKey, setLoading, setAdminKey);

    setLoading(true);
    const response = await fetch(dotEnv.adminLocalSignUpLink, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(userInfo),
    });

    console.log("[handleAdminLocalSignUp] Raw response:", response);

    const data = await response.json();
    console.log("[handleAdminLocalSignUp] Parsed JSON:", data);

    if (data.code !== 201 || !data.data) {
      console.log("[handleAdminLocalSignUp] Sign up failed");
      setLoading(false);
      throw new Error("Sign up failed...trying again");
    }

    toast.success("Sign up successful!");
    window.location.replace("/");
  } catch (err: any) {
    console.error("[handleAdminLocalSignUp] Error:", err);
    toast.error(err.message || "Sign Up failed");
  } finally {
    setLoading(false);
  }
};

/**
 * Admin login
 */
export const handleAdminLocalLogInSubmit = async (
  userInfo: AdminLocalLogIn,
  setLoading: (loading: boolean) => void,
  setAdminKey: (adminKey: string) => void,
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
    console.log("[handleAdminLocalLogInSubmit] User info:", userInfo);

    await handleAdminReqKeyValidation("/weclome-back", userInfo.adminKey, setLoading, setAdminKey);

    setLoading(true);
    const response = await fetch(dotEnv.adminLocalLogInLink, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(userInfo),
    });

    console.log("[handleAdminLocalLogInSubmit] Raw response:", response);

    const data = await response.json();
    console.log("[handleAdminLocalLogInSubmit] Parsed JSON:", data);

    if (data.code !== 201 || !data.data) {
      console.log("[handleAdminLocalLogInSubmit] Login failed");
      setLoading(false);
      throw new Error("Sign up failed...trying again");
    }

    toast.success("Sign up successful!");
    window.location.replace("/");
  } catch (err: any) {
    console.error("[handleAdminLocalLogInSubmit] Error:", err);
    toast.error(err.message || "Sign Up failed");
  } finally {
    setLoading(false);
  }
};
