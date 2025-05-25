"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/mapComponents/Map"), {
  ssr: false,
});

export default function Home() {
  return(
      <MapView />
  )
}