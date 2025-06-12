import type { Metadata } from "next";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { GlobalContextProvider } from "@/contexts/GlobalContext";
import BottomNav from "@/components/ui/BottomNav";

export const metadata: Metadata = {
  title: "Weclome to your desk",
  description: "Set up your admin level control of your fleet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleCleintId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
  <html lang="en" suppressHydrationWarning >
      <body className="antialiased bodyWrapper duration-700 transition-all"  >   
      <GoogleOAuthProvider clientId={googleCleintId}>
      <Toaster position="top-right" />
        
        <ThemeProvider>
          <AuthProvider>
            <GlobalContextProvider>
              
          <div vaul-drawer-wrapper="" className="bg-background">
              <BottomNav/>
        {children}
          </div>
        </GlobalContextProvider>  
        </AuthProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
      </body>
    </html>
  );
}
