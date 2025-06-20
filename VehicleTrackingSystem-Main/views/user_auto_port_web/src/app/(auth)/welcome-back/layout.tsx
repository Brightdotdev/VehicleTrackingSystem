import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in to your Desk",
  description: "Log in page for Desk",
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
