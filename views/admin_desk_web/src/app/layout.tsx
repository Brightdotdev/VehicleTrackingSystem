import type { Metadata } from "next";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { GlobalContextProvider } from "@/contexts/GlobalContext";
import BottomNav from "@/components/ui/BottomNav";
import { AdminNotificationProvider } from "@/contexts/NotificationContext";
import React from "react";


export const metadata: Metadata = {
  title: "Welcome to your desk",
  description: "Set up your admin level control of your fleet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      
      <body className="antialiased bodyWrapper duration-700 transition-all">
  
          <Toaster position="top-right" />
          <ThemeProvider>
            <AuthProvider>
              <GlobalContextProvider>
              <AdminNotificationProvider>
                <div className="bg-background">
                  {children}
                </div>
              </AdminNotificationProvider>
                <BottomNav />
              </GlobalContextProvider>
            </AuthProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}





