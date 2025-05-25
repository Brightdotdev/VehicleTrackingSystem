export interface GoogleLogInProps{
    setGoogleLoading: (loading: boolean) => void;
}

export interface GoogleUser {
    sub: string;
    given_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    pageExpTime: number;
}

export interface AdminGoogleLogIn {
    adminKey : string;
    email: string;
}

export interface AdminGoogleSignUp {
    sub: string;
    name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    adminKey : string;
}


export interface AdminLocalLogIn {
    adminKey : string;
    email: string;
    password : string;
}


export interface AdminLocalSignUp {
    name: string;
    email: string;
    password : string;
    adminKey : string;
}
