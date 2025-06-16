import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request Vehicle | Vehicle Dispatch System",
  description: "Request a vehicle for your needs. Fill out the form to submit a new vehicle request in the Vehicle Dispatch System.",
  keywords: ["vehicle request", "dispatch", "user", "fleet management", "booking", "transportation"],
  openGraph: {
    title: "Request Vehicle - Vehicle Dispatch System",
    description: "Submit a new vehicle request and track its status in the dispatch system.",
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
