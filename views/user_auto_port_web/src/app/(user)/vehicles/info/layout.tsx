import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vehicle Details | Vehicle Dispatch System",
  description: "View detailed information about your assigned or requested vehicle, including status, specifications, and dispatch history.",
  keywords: ["vehicle", "dispatch", "user", "info", "tracking", "assignment", "fleet management"],
  openGraph: {
    title: "Vehicle Details - Vehicle Dispatch System",
    description: "Access comprehensive details and status of your vehicle in the dispatch system.",
    type: "website",
  },
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
