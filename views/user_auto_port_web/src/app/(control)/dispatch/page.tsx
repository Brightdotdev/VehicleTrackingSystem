"use client";

import Link from 'next/link';
import React from 'react';


export default function Page() {

    return (
  
      <div className="flex flex-col gap-4 items-center justify-center w-screen h-screen">

        <h2 className="subTitleText2">
        Yeah..the dispatch pagee was moved
        </h2>

        <Link href='/' className="text-normal text-muted-foreground underline underline-offset-6">Go To the New Page</Link>
      </div>
    )
}
