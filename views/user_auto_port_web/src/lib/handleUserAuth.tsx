import { GoogleUser, User, UserGoogleLogIn, UserGoogleSignUp, UserLocalLogIn, UserLocalSignUp } from "@/types/authTypes";
import { toast } from "sonner";
import { dotEnv } from "./dotEnv";
import { authFetch } from "./utils";


// ========== ✅ GOOGLE SIGN UP (still uses fetch — ignore, as you said) ========== //
export const handleGoogleSignUp = async (userInfo: UserGoogleSignUp, setLoading: (loading: boolean) => void, retryCount = 0) => {
  if (retryCount > 3) {
    retryCount = 0;
    setLoading(false);
    toast("Too many attempts. Try signing up again", {
      action: { label: "Try again", onClick: () => window.location.replace("/join-us") },
    });
    return;
  }

  try {
    setLoading(true);
    const response = await fetch(dotEnv.userGoogleSignInLink, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(userInfo),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    toast.message(`Hello ${userInfo.name}, welcome to your fleet`);
    window.location.replace("/");
  } catch (error) {
    toast("There was an issue saving your data. Retrying...");
    await handleGoogleSignUp(userInfo, setLoading, retryCount + 1);
  } finally {
    setLoading(false);
  }
};

// ========== ✅ LOCAL LOGIN ========== //
export const handleUserLocalLogInSubmit = async (userInfo: UserLocalLogIn, setLoading: (loading: boolean) => void, retryCount = 0) => {
  if (retryCount > 3) {
    retryCount = 0;
    setLoading(false);
    toast("We couldn't communicate with the server.", {
      action: { label: "One more time?", onClick: () => window.location.replace("/welcome-back") },
    });
    return;
  }

  try {
    setLoading(true);
    const response = await authFetch(dotEnv.userLocalLogInLink, {
      method: "POST",
      body: JSON.stringify(userInfo),
    });

    const data = await response.json();
    if (!data.success || data.code !== 201 || !data.data) throw new Error("Login failed...trying again");

    toast.success("Login successful!");
    localStorage.setItem("accessToken", data.jwt);
    window.location.replace("/");
  } catch (err: any) {
    toast.error(err.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

// ========== ✅ LOCAL SIGNUP ========== //
export const handleUserLocalSignUp = async (userInfo: UserLocalSignUp, setLoading: (loading: boolean) => void, retryCount = 0) => {
  if (retryCount > 3) {
    retryCount = 0;
    setLoading(false);
    toast("We couldn't communicate with the server.", {
      action: { label: "One more time?", onClick: () => window.location.replace("/join-us") },
    });
    return;
  }

  try {
    setLoading(true);
    const response = await authFetch(dotEnv.userLocalSignUpLink, {
      method: "POST",
      body: JSON.stringify(userInfo),
    });

    const data = await response.json();
    if (data.code !== 201 || !data.data) {
      toast.error(data.message || "Sign Up failed");
      throw new Error("Sign up failed...trying again");
    }

    localStorage.setItem("accessToken", data.jwt);
    toast.success("Sign up successful!");
    // window.location.replace("/");
  } catch (err: any) {
    toast.error(err.message || "Sign Up failed");
  } finally {
    setLoading(false);
  }
};

// ========== ✅ VALIDATE USER FROM COOKIE/TOKEN ========== //
export const isValidatedUser = async (
  setLoading: (loading: boolean) => void,
  setValidated: (isValidated: boolean) => void,
  setUser: (user: User) => void
) => {
  try {
    const response = await authFetch(dotEnv.cookieValidationLink);
    const userResponseData = await response.json();

    const { code, success, data: { valid, user } } = userResponseData;
    if (valid && code === 201 && user.email !== null && success === true) {
      setUser(user);
      return setValidated(true);
    }
    return setValidated(false);
  } catch (error) {
    console.log(error);
    return setValidated(false);
  } finally {
    setLoading(false);
  }
};
