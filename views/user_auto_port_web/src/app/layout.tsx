import type { Metadata } from "next";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

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
  <html lang="en" >
      <body className="antialiased bodyWrapper duration-700 transition-all" >   
      <GoogleOAuthProvider clientId={googleCleintId}>
      <Toaster position="top-right" />
        
        <ThemeProvider>
          <AuthProvider>
        {children}
        </AuthProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
      </body>
    </html>
  );
}
