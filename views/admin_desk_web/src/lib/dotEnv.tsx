

    const adminLocalSignUpLink = process.env.NEXT_PUBLIC_SPRING_LOCAL_SIGNUP_BACKEND || "";
    const adminLocalLogInLink = process.env.NEXT_PUBLIC_SPRING_LOCAL_ADMIN_LOGIN_BACKEND || "";

    
    const adminLogOutLink = process.env.NEXT_PUBLIC_ADMIN_LOG_OUT || "";

    const cookieValidationLink = process.env.NEXT_PUBLIC_SPRING_ADMIN_COOKIE_VALIDATE || "";
    const adminKeyValidationLink = process.env.NEXT_PUBLIC_ADMIN_VALIDATE_ADMIN_KEY || "";


    const adminCookieName = process.env.NEXT_PUBLIC_ADMIN_COOKIE_NAME || "";
    const validateDispatchLink = process.env.NEXT_PUBLIC_VALIDATE_DISPATCH_URL || "";
    const cancelDispatchLink = process.env.NEXT_PUBLIC_CANCEL_DISPATCH_URL || "";
    
    const getAllDispatchUrl = process.env.NEXT_PUBLIC_GET_ALL_DISPATCH_ADMIN_URL || "";
    const markForMentainanceUrl = process.env.NEXT_PUBLIC_MARK_FOR_MAINTENANCE || "";


    const adminVehicleBaseUrl = process.env.NEXT_PUBLIC_ADMIN_VEHICLE_BASE_URL || "";
    const adminDispatchesBaseUrl = process.env.NEXT_PUBLIC_ADMIN_DISPATCH_BASE_URL || "";

    const notificationBaseUrl = process.env.NEXT_PUBLIC_NOTIFICATION_BASE_URL || "";


  export const dotEnv = {
    notificationBaseUrl,
    adminLocalLogInLink,
    adminDispatchesBaseUrl,
     adminVehicleBaseUrl,
    markForMentainanceUrl,
    getAllDispatchUrl,
    cancelDispatchLink,
    validateDispatchLink,
      adminKeyValidationLink,
        adminLogOutLink,
        adminLocalSignUpLink,
        adminCookieName,
        cookieValidationLink
}
   