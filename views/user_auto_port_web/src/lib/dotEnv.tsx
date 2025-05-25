    const googleCleintId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
    const googleClientSecret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "";

    const googleAuthRedirectLink = process.env.NEXT_PUBLIC_REDIRECT_URL || "";

    const googleAuthTokenLink = process.env.NEXT_PUBLIC_OATH2_TOKEN_LINK || "";
    const versionInfoLink = process.env.NEXT_PUBLIC_VERSION_INFO_LINK || "";
    
    const adminLocalLogInLink = process.env.NEXT_PUBLIC_SPRING_LOCAL_LOGIN_BACKEND || "";
    const adminGoogleLogInLink = process.env.NEXT_PUBLIC_SPRING_GOOGLE_LOGIN_BACKEND || "";

    const adminLocalSignUpLink = process.env.NEXT_PUBLIC_SPRING_LOCAL_SIGNUP_BACKEND || "";
    const adminGoogleSignUpLink = process.env.NEXT_PUBLIC_SPRING_GOOGLE_SIGNUP_BACKEND || "";
        
    const adminLogOutLink = process.env.NEXT_PUBLIC_ADMIN_LOG_OUT || "";

    const cookieValidationLink = process.env.NEXT_PUBLIC_SPRING_COOKIE_VALIDATE || "";
    const adminKeyValidationLink = process.env.NEXT_PUBLIC_ADMIN_VALIDATE_ADMIN_KEY || "";


    const adminCookieName = process.env.NEXT_PUBLIC_ADMIN_COOKIE_NAME || "";


  export const dotEnv = {
      adminKeyValidationLink,
        adminLocalLogInLink,
        adminGoogleLogInLink,
        adminLogOutLink,
        adminLocalSignUpLink,
        adminGoogleSignUpLink,
        adminCookieName,
        googleCleintId,
        googleClientSecret,
        googleAuthTokenLink,
        googleAuthRedirectLink,
        versionInfoLink,
        cookieValidationLink
}
   