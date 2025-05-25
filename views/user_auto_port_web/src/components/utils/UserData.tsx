import axios from 'axios';
import React, { useEffect, useState } from 'react';

const UserData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Add error state

 
  const fetchUser = async () =>{
      
    try{
  const response = await axios.get(
    "http://localhost:8102/user", 
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,});

      setData(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Handle Axios-specific errors
        if (err.response) {
          // Server responded with a status code outside the 2xx range
          setError(`Error ${err.response.status}: ${err.response.data?.message || "An error occurred"}`);
          console.error("Server Error:", err.response.data);
        } else if (err.request) {
          // Request was made but no response was received
          setError("No response from the server. Please try again later.");
          console.error("No Response:", err.request);
        } else {
          // Something happened while setting up the request
          setError(`Request Error: ${err.message}`);
          console.error("Request Error:", err.message);
        }
      } else {
        // Handle non-Axios errors
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        console.error("Unknown Error:", err);
      }
    } finally {
      setLoading(false);
    }
  }; 
  

  useEffect(() => {
    fetchUser();
  }, []);
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>} {/* Show error message if something goes wrong */}
      {!loading && !data && !error && <p>No data available</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
  
};

export default UserData;
