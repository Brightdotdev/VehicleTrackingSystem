import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Page Overview",
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
