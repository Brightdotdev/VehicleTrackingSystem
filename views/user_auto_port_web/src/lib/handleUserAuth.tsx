import { User, UserLocalLogIn, UserLocalSignUp, UserPageData } from "@/types/authTypes";
import { toast } from "sonner";
import { dotEnv } from "./dotEnv";

// ✅ Shared fetch options
const defaultFetchOptions = {
  headers: { "Content-Type": "application/json" },
  credentials: "include" as const,
};

/**
 * ✅ Safely parse JSON if body exists
 */
async function safeJsonParse(response: Response): Promise<any | undefined> {
  if (response.status === 204) return undefined; // No Content

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
 * ✅ Validate user from cookie
 */
export const isValidatedUser = async (
  setLoading: (loading: boolean) => void,
  setValidated: (isValidated: boolean) => void,
  setUser: (user: User) => void
) => {
  try {
    setLoading(true);
    const response = await fetch(dotEnv.cookieValidationLink, {
      method: "GET",
      ...defaultFetchOptions,
    });

    const userResponseData = await safeJsonParse(response);
    const { code, success, data } = userResponseData ?? {};
    const valid = data?.valid ?? false;
    const user = data?.user ?? {};

    if (response.ok && valid && code === 200 && success && user.email) {
      setUser(user);
      setValidated(true);
    } else {
      setValidated(false);
    }
  } catch (error) {
    console.error("[isValidatedUser] Error:", error);
    setValidated(false);
  } finally {
    setLoading(false);
  }
};

/**
 * ✅ Fetch logged-in user data
 */
export const getMyData = async (
  setLoading?: (loading: boolean) => void
): Promise<UserPageData | undefined> => {
  try {
    setLoading?.(true);
    const response = await fetch(dotEnv.getMyDataLink, {
      method: "GET",
      ...defaultFetchOptions,
    });

    const userResponseData = await safeJsonParse(response);
    const { code, success, data } = userResponseData ?? {};
    const valid = data?.valid ?? false;
    const userData = data?.userData ?? {};

    if (response.ok && valid && code === 200 && success && userData.email) {
      return userData;
    } else {
      
      return undefined;
    }
  } catch (error) {
    console.error("[getMyData] Error:", error);
    return undefined;
  } finally {
    setLoading?.(false);
  }
};

/**
 * ✅ Local login
 */
export const handleUserLocalLogInSubmit = async (
  userInfo: UserLocalLogIn,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    const response = await fetch(dotEnv.userLocalLogInLink, {
      method: "POST",
      ...defaultFetchOptions,
      body: JSON.stringify(userInfo),
    });

    const data = await safeJsonParse(response);
    if (
      !response.ok ||
      !data?.success ||
      ![200, 201].includes(data.code) ||
      !data?.data
    ) {
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
 * ✅ Local signup
 */
export const handleUserLocalSignUp = async (
  userInfo: UserLocalSignUp,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    const response = await fetch(dotEnv.userLocalSignUpLink, {
      method: "POST",
      ...defaultFetchOptions,
      body: JSON.stringify(userInfo),
    });

    const data = await safeJsonParse(response);
    if (!response.ok || data?.code !== 201 || !data?.data) {
      throw new Error("Sign up failed.");
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
