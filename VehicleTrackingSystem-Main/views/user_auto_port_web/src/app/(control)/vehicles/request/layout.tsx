import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Disaptch Request",
  description: "Disaptch Request handling",
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
