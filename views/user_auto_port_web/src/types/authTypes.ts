export interface GoogleLogInProps{
    setGoogleLoading: (loading: boolean) => void;
}

export interface GoogleUser {
    sub: string;
    given_name: string;
    picture: string;
    email: string;
    email_verified: boolean;}

export interface UserGoogleLogIn {
    email: string;
}

export interface UserGoogleSignUp {
    sub: string;
    name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    userStatus? : UserStatus;

}

export interface UserLocalLogIn {
    email: string;
    password : string;
}


export interface UserLocalSignUp {
    name: string;
    email: string;
    password : string;
    userStatus? : UserStatus;
}

export enum UserStatus {
  DRIVER = "DRIVER",
  TRANSPORTER = "TRANSPORTER",
  ADMIN = "ADMIN",
  CIVILIAN = "CIVILIAN"
}


 
export type User = {
  email: string;
  picture: string;
  username: string;
  roles: string[];
} | null;

export type UserPageData = {
  email: string;
  picture?: string;
  licence: string;
  username: string;
  roles: string[];
} | null;