"use client";

import { dotEnv } from "@/lib/dotEnv";
import { deleteCookie, getCookie } from "@/lib/utils";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

type User = {
  email: string;
  picture: string;
  username: string;
  roles: string[];
} | null;

type AuthContextType = {
  isAuthenticated: boolean;
  userData: User;
  authLoading: boolean;

  logout: () => Promise<void>;
  logInData :  { email : string, password  : string } ,
  setLogInData : (logInInfo : { email : string, password  : string }) => void,

  signUpData : { email : string, name : string , password  : string },
  setSignUpData : (signUpInfo : { email : string, name : string , password  : string }) => void,
  
  googleLogInData :  { email : string, name : string , picture: string, } ,
  setGoogleLogInData : (googleLogInInfo : { email : string, name: string, picture : string }) => void,

  googleSignUpData :  { email : string, name  : string,  sub: string, 
    picture: string, email_verified: boolean},
  setGoogleSignUpData : (googleSignUpInfo : { email : string, name  : string,  sub: string, 
    picture: string, email_verified: boolean}) => void,

  googleUserData : { sub: string, given_name: string, picture: string, email: string, email_verified: boolean },
  setGoogleUserData : (googleUserData : { sub: string, given_name: string, picture: string, email: string, email_verified: boolean }) => void,
  isPageExpTimeExpired: (pageExpTime: number) => boolean;
  validate: () => void;
};

const AuthContext = createContext<AuthContextType>({
  
  isAuthenticated: false,
  userData: null,
  
  authLoading: true,
  logout: async () => {},
  
  logInData : { email : "", password  : "" },
  setLogInData : () => {},
  
  signUpData : {email : "", name : "" , password  : ""},
  setSignUpData : () => {},

  googleLogInData :  { email : "",name : "", picture: "" },
  setGoogleLogInData : () => {},
  
  googleSignUpData :  { email : "", name  : "",  sub: "", 
    picture: "", email_verified: false},
  setGoogleSignUpData : () => {},

  googleUserData : { sub: "", given_name: "", picture: "", email: "", email_verified: false},
  setGoogleUserData : () => {},
  isPageExpTimeExpired: () => false,
  validate: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [signUpData, setSignUpData] = useState(
    {name  : "", email : "", password : "",})
  
    const [logInData, setLogInData] = useState(
    { email : "", password : "" })
  
    const [googleSignUpData, setGoogleSignUpData] = useState({
       email : "", name  : "",  sub: "", 
    picture: "", email_verified: false})

    const [googleLogInData, setGoogleLogInData] = useState(
      { email : "", name: "", picture: "" })

      
    const [googleUserData, setGoogleUserData] = useState({
      sub: "",
      given_name: "",
      picture: "",
      email: "",
      email_verified: false,
  
    });

    const [userData, setUser] = useState<User>(null);
  const [authLoading, setAuthLoading] = useState(true);


  // Validate and fetch user info
  const validate = async () => {
    setAuthLoading(true);
    try {
        const response = await fetch(dotEnv.cookieValidationLink, {
          method: "GET",
           headers: {
          "Content-Type": "application/json"},credentials: "include"});
        const userResponseData  = await response.json();
        const {code , data : { valid, user  }} = userResponseData;
          console.log(userResponseData)
        
        if(valid && code === 200){
          setUser(user);
          setIsAuthenticated(valid)
        }
        
        setIsAuthenticated(valid)
        setAuthLoading(false);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setAuthLoading(false);}};

  // Logout helper
  const logout = async () => {
    setAuthLoading(true);
    try {
      const authCookie = getCookie(dotEnv.userCookieName)
      if(authCookie){
          const response = await fetch(dotEnv.userLogOutLink, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setUser(null);
        setAuthLoading(false);
        deleteCookie(dotEnv.userCookieName);
        return data
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      setAuthLoading(false);
    } finally {
      setIsAuthenticated(false);
    }
  };
  

const  isPageExpTimeExpired =  (pageExpTime: number): boolean => {
  return Date.now() > pageExpTime;
}

  useEffect(() => {
    validate();
    
  }, []);

  return (
    <AuthContext.Provider
      value={{
      isAuthenticated,
      userData,
      authLoading,
     logout,
  logInData,
  setLogInData,
  signUpData,
  setSignUpData,
  googleLogInData,
  setGoogleLogInData,
  googleSignUpData,
  setGoogleSignUpData,
  googleUserData,
  setGoogleUserData,
  isPageExpTimeExpired,
  validate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('use auth must be used within a ThemeProvider')
  }
  return context
}