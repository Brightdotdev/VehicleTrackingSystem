import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage dispatch",
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
