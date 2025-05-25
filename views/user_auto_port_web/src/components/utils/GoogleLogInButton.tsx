import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';



import React, { useState } from 'react'

const GoogleLogInButton = () => {
  const [data, setData] = useState({});
  return (
    
<GoogleLogin
  onSuccess={credentialResponse => {
    if (credentialResponse.credential) {
      const decodedUser = jwtDecode(credentialResponse.credential);

      console.log(decodedUser);
      setData(decodedUser);
    } else {
      console.error('Credential is undefined');
    }
    console.log(credentialResponse);
  }}
  onError={() => {
    console.log('Login Failed');
  }}/>
  )
}

export default GoogleLogInButton