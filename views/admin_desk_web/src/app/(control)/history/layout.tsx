
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Vehicle Dispatch History",
  description: "View the complete history of vehicle dispatches, including dates, status, and destinations.",
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
