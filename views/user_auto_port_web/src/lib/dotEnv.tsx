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
    const validateDispatchLink = process.env.NEXT_PUBLIC_VALIDATE_DISPATCH_URL || "";
    const cancelDispatchLink = process.env.NEXT_PUBLIC_CANCEL_DISPATCH_URL || "";
    const sseSubscribeUrl = process.env.NEXT_PUBLIC_SSE_SUBSCRIBE_URL || "";
    const getAllDispatchUrl = process.env.NEXT_PUBLIC_GET_ALL_DISPATCH_ADMIN_URL || "";
    const markForMentainanceUrl = process.env.NEXT_PUBLIC_MARK_FOR_MAINTENANCE || "";
    const adminVehicleBaseUrl = process.env.NEXT_PUBLIC_ADMIN_VEHICLE_BASE_URL || "";
    const adminDispatchesBaseUrl = process.env.NEXT_PUBLIC_ADMIN_DISPATCH_BASE_URL || "";


  export const dotEnv = {
    adminDispatchesBaseUrl,
     adminVehicleBaseUrl,
    markForMentainanceUrl,
    sseSubscribeUrl,
    getAllDispatchUrl,
    cancelDispatchLink,
    validateDispatchLink,
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
   