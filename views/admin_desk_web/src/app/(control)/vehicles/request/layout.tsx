import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Disaptche Request",
  description: "Disaptch overview",
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
