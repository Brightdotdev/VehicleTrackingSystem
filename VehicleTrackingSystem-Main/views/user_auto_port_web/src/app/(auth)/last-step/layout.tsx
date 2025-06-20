
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Validate your sign up",
  description: "Last step verification",
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
