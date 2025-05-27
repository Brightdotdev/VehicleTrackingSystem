
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';


type GlobalContext = {
  loading: boolean;
  heavyLoading: boolean;
  setLoading: (value: boolean) => void;
  setHeavyLoading: (value: boolean) => void;
};


const GlobalContext = createContext<GlobalContext>({
  loading: false,
  heavyLoading: false,
  setLoading: () => {},
  setHeavyLoading: () => {},
});



export function GlobalContextProvider({ children }: { children: ReactNode }) {
  const [heavyLoading, setHeavyLoading] = useState(false);
  const [loading, setLoading] = useState(false);


  return (
    <GlobalContext.Provider value={{ loading, setLoading,heavyLoading, setHeavyLoading }}>
      {children}
    </GlobalContext.Provider>
  );
}


export function useGlobal() {
  return useContext(GlobalContext);
}
