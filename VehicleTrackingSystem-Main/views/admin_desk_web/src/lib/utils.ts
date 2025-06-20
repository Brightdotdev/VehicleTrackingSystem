import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split("; "); // Split cookies by semicolon+space
  const cookie = cookies.find((c) => c.startsWith(`${name}=`)); // Find the one that starts with name=
  return cookie ? cookie.split("=")[1] : null; // Return the value (after =) if found
};


export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const setCookie = (name: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/`;
};
