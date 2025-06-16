import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Input the admin key for verification",
  description: "Admin key verfication page for desk",
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
