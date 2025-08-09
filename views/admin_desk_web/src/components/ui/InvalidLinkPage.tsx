"use client";

import { useRouter } from 'next/navigation';
import { ArrowLeft, InfoIcon } from 'lucide-react';
import { Button } from './button';

export default function InvalidLinkPage() {
  const router = useRouter();

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center text-center px-4">

      <InfoIcon/>
      <h1 className="text-2xl font-bold mb-2">Invalid Link</h1>
      <p className="text-muted-foreground mb-4">
        The link you followed is missing required parameters or is malformed.
      </p>
      <Button
        onClick={() => router.back()}
        className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-primary/90 transition"
      >
        <ArrowLeft size={16} />
        Go Back
      </Button>
    </div>
  );
}
