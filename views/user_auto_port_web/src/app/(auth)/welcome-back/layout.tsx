import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in to acces your fleet",
  description: "Log in page for Auto-Port",
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
