import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up to Set up your Desk",
  description: "Sign up page for Desk",
  authors: [
    {
      name: "Akinola Bright",
    //  url: "https://desk.com",
    },
  ],
  creator: "Akinola Bright"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
      <>   
        {children}
      </>
  );
}
