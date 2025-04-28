import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Weclome to your desk dashboard",
  description: "Your vehicle overview",
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
