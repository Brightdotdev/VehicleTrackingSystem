"use client";

import React from "react";
import Link from "next/link"; // Add this import

export default function TermsOfService() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background2">
      <Link
        href="/"
        className="absolute bottm-[15%] mb-6 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition"
      >
        Go Back Home
      </Link>
      <h1 className=" font-bold">Terms of Service</h1>
      <p className="mt-4 text-center">
        Welcome to the Vehicle Tracking Application. By using our services, you agree to the following terms and conditions.
      </p>
      <div className="mt-6">
        <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
        <p>
          By accessing or using our application, you agree to comply with and be bound by these Terms of Service.
        </p>
        <h2 className="text-xl font-semibold">2. User Responsibilities</h2>
        <p>
          Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.
        </p>
        <h2 className="text-xl font-semibold">3. Vehicle Safety</h2>
        <p>
          It is the user's responsibility to ensure that vehicles are safe and compliant with our safety scoring system before dispatch.
        </p>
        <h2 className="text-xl font-semibold">4. Dispatch Management</h2>
        <p>
          Users must adhere to the dispatch management rules, including the proper use of vehicle IDs and purposes for dispatch.
        </p>
        <h2 className="text-xl font-semibold">5. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on this page.
        </p>
        <h2 className="text-xl font-semibold">6. Contact Information</h2>
   
       <p>
          If you have any questions about this Privacy Policy, please contact us at
          {"  "}
          <a href="mailto:mail.bright.dev@gmail.com" className="underline-offset-1 underline
          hover:underline-offset-2
          "> Our dev's email</a>
        </p>
      </div>
    </div>
  );
}