"use client";

import React, { useEffect, useState } from "react";
import { Progress } from "./progress";
import { LampDesk } from "lucide-react";

const Loading = ({ loadingPage }: { loadingPage?: string }) => {

  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((old) => {
        if (old < 95) return old + 5; 
        return old;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // When your page/data is ready, setProgress(100);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-md flex flex-col items-center gap-md">
        
   <LampDesk className='size-12 stroke-muted-foreground hover:stroke-sidebar-accent-foreground cursor-pointer' />

        <h3 className="text-foreground-muted text-normal">
          {`${loadingPage ||  "Desk"} Loading....`}</h3>

        <Progress value={progress} />
      </div>
    </div>
  );
};

export default Loading;