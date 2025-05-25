"use client";

import { dotEnv } from "@/lib/dotEnv";
import { deleteCookie, getCookie } from "@/lib/utils";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { set } from "react-hook-form";

type User = {
  email: string;
  picture: string;
  username: string;
  roles: string[];
} | null;

type AuthContextType = {
  isAuthenticated: boolean;
  userData: User;
  authLoaing: boolean;

  logout: () => Promise<void>;
  logInData :  { email : string, password  : string, pageExpTime : number } ,
  setLogInData : (logInInfo : { email : string, password  : string, pageExpTime : number }) => void,

  signUpData : { email : string, name : string , password  : string ,pageExpTime : number},
  setSignUpData : (signUpInfo : { email : string, name : string , password  : string ,pageExpTime : number}) => void,
  
  googleLogInData :  { email : string, name : string , pageExpTime : number, picture: string, } ,
  setGoogleLogInData : (googleLogInInfo : { email : string, name: string, pageExpTime : number, picture : string }) => void,

  googleSignUpData :  { email : string, name  : string,  sub: string, 
    picture: string, email_verified: boolean, pageExpTime : number},
  setGoogleSignUpData : (googleSignUpInfo : { email : string, name  : string,  sub: string, 
    picture: string, email_verified: boolean, pageExpTime : number}) => void,

  googleUserData : { sub: string, given_name: string, picture: string, email: string, email_verified: boolean, pageExpTime : number },
  setGoogleUserData : (googleUserData : { sub: string, given_name: string, picture: string, email: string, email_verified: boolean, pageExpTime : number }) => void,
  isPageExpTimeExpired: (pageExpTime: number) => boolean;
  validate: () => void;
};

const AuthContext = createContext<AuthContextType>({
  
  isAuthenticated: false,
  userData: null,
  
  authLoaing: true,
  logout: async () => {},
  
  logInData : { email : "", password  : "" , pageExpTime : Date.now()},
  setLogInData : () => {},
  
  signUpData : {email : "", name : "" , password  : "" ,pageExpTime : Date.now()},
  setSignUpData : () => {},

  googleLogInData :  { email : "",name : "", pageExpTime : Date.now(), picture: "" },
  setGoogleLogInData : () => {},
  
  googleSignUpData :  { email : "", name  : "",  sub: "", 
    picture: "", email_verified: false, pageExpTime : Date.now()},
  setGoogleSignUpData : () => {},

  googleUserData : { sub: "", given_name: "", picture: "", email: "", email_verified: false, pageExpTime : Date.now()},
  setGoogleUserData : () => {},
  isPageExpTimeExpired: () => false,
  validate: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [signUpData, setSignUpData] = useState(
    {name  : "", email : "", password : "",  pageExpTime : Date.now()})
  
    const [logInData, setLogInData] = useState(
    { email : "", password : "", pageExpTime : Date.now() })
  
    const [googleSignUpData, setGoogleSignUpData] = useState({
       email : "", name  : "",  sub: "", 
    picture: "", email_verified: false, pageExpTime : Date.now()})

    const [googleLogInData, setGoogleLogInData] = useState(
      { email : "", name: "", pageExpTime : Date.now(), picture: "" })

      
    const [googleUserData, setGoogleUserData] = useState({
      sub: "",
      given_name: "",
      picture: "",
      email: "",
      email_verified: false,
      pageExpTime : Date.now()
    });

    const [userData, setUser] = useState<User>(null);
  const [authLoaing, setAuthLoading] = useState(true);


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
        
        console.log(code,valid,user)
        if(valid && code === 200){
          setUser(user);
          console.log(user)
          console.log(userData)
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
      const authCookie = getCookie(dotEnv.adminCookieName)
      console.log(authCookie);
      if(authCookie){
          const response = await fetch(dotEnv.adminLogOutLink, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setUser(null);
        setAuthLoading(false);
        deleteCookie(dotEnv.adminCookieName);
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
      authLoaing,
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

export const useAuth = () => useContext(AuthContext);