import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vehicle Info Page",
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
