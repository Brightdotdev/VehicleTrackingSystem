import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My dispatch Info",
  description: "Your dispatch overview",
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
