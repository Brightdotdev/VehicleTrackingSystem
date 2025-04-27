import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";

const GoogleLoginButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSuccess = (response: any) => {
    setLoading(true);
    // Get the Google ID token from the response
    const idToken = response.credential;
    
    // Call your API with the Google ID token
    fetch("/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Handle the JWT returned from your API (store in local storage, etc.)
        console.log("Logged in successfully:", data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Login failed. Please try again.");
        setLoading(false);
      });
  };

  const handleLoginError = () => {
    setError("Login failed. Please try again.");
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <GoogleLogin 
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
      />
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default GoogleLoginButton;
