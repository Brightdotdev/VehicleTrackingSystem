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
}

export interface UserLocalLogIn {
    email: string;
    password : string;
}


export interface UserLocalSignUp {
    name: string;
    email: string;
    password : string;
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