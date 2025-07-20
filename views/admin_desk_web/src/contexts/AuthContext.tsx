"use client";

import { dotEnv } from "@/lib/dotEnv";
import { deleteCookie, getCookie } from "@/lib/utils";
import { User } from "@/types/authTypes";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";


type AuthContextType = {
  isAuthenticated: boolean;
  userData: User;
  authLoading: boolean;
  
    setUser : (
    userData: User
  ) => void;
  
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
  setUser:  () => {},
  

  authLoading: true,
  
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
        console.log(userResponseData)
        const {code , data : { valid, user  }} = userResponseData;
        if(valid && code === 200){
          setUser(user);
          setIsAuthenticated(valid)
          return
        }else{
          setAuthLoading(false);
          setIsAuthenticated(valid)
          return
        }
    } catch (error) {        
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setAuthLoading(false);}};



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
     setUser,
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