"use client";

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function InvalidLinkPage() {
  const router = useRouter();

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-2xl font-bold mb-2">Invalid Link</h1>
      <p className="text-muted-foreground mb-4">
        The link you followed is missing required parameters or is malformed.
      </p>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
      >
        <ArrowLeft size={16} />
        Go Back
      </button>
    </div>
  );
}
