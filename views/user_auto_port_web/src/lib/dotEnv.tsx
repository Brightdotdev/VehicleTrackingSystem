    const googleCleintId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
    const googleClientSecret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "";

    const googleAuthRedirectLink = process.env.NEXT_PUBLIC_REDIRECT_URL || "";

    const googleAuthTokenLink = process.env.NEXT_PUBLIC_OATH2_TOKEN_LINK || "";
    const versionInfoLink = process.env.NEXT_PUBLIC_VERSION_INFO_LINK || "";
    
    const userLocalLogInLink = process.env.NEXT_PUBLIC_SPRING_LOCAL_LOGIN_BACKEND || "";
    const userGoogleSignInLink = process.env.NEXT_PUBLIC_SPRING_GOOGLE_SIGN_IN_BACKEND || "";

    const userLocalSignUpLink = process.env.NEXT_PUBLIC_SPRING_LOCAL_SIGNUP_BACKEND || "";
    
        
    const userLogOutLink = process.env.NEXT_PUBLIC_USER_LOG_OUT || "";

    const cookieValidationLink = process.env.NEXT_PUBLIC_SPRING_COOKIE_VALIDATE || "";
  
    const userVehicleBaseUrl = process.env.NEXT_PUBLIC_VEHICLES_BASE_URL || "";

    const userCookieName = process.env.NEXT_PUBLIC_USER_COOKIE_NAME || "";
  
    
    const userDispatchesBaseUrl = process.env.NEXT_PUBLIC_USER_DISPATCH_BASE_URL || "";
    const userNotificationBaseUrl = process.env.NEXT_PUBLIC_NOTIFICATION_BASE_URL || "";
    const userTrackingBaseUrl = process.env.NEXT_PUBLIC_USER_TRACKING_BASE_URL || "";
    const costPerDay = process.env.NEXT_PUBLIC_COST_PER_DAY ?? 0;
    const getMyDataLink = process.env.NEXT_PUBLIC_SPRING_GET_MY_DATA || "";


  export const dotEnv = {
    getMyDataLink,
    costPerDay,
    userTrackingBaseUrl,
    userNotificationBaseUrl,
    userVehicleBaseUrl ,
    userDispatchesBaseUrl,
    userLocalLogInLink,
        userGoogleSignInLink,
        userLogOutLink,
        userLocalSignUpLink,
        userCookieName,
        googleCleintId,
        googleClientSecret,
        googleAuthTokenLink,
        googleAuthRedirectLink,
        versionInfoLink,
        cookieValidationLink
}
   