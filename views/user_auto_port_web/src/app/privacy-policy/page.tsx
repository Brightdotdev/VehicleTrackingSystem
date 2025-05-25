"use client";

import React from "react";
import Link from "next/link";
import HomeButton from "@/components/utils/HomeButton";

export default function PrivacyPolicy() {
  return (
    <>    
    
 <HomeButton/>

    <main className="flex flex-col items-center justify-center min-h-screen px-2 gap-md">
      <article className="flexItemsCenter md:w-1/2 items-center justify-center gap-xs">
             <h1 className="titleText">Privacy Policy</h1>
      <p className="text-small text-muted-foreground text-center">
        This Privacy Policy describes how the Vehicle Tracking Application ("we", "us", or "our") collects, uses, and protects your information when you use our services. By using our application, you agree to the collection and use of information in accordance with this policy.
      </p>
      </article>

      <section className="max-w-2xl flex flex-col gap-sm">

<article className="flex flex-col justify-start gap-[var(--space-xs)]">

        <h2 className="text-normal">1. Information We Collect</h2>
        <p className="text-body text-muted-foreground">
          We collect information you provide when creating dispatches, such as vehicle IDs, destinations, and purposes. We also collect real-time location data and vehicle health attributes for safety scoring.
        </p>
</article>

<article className="flex flex-col justify-start gap-[var(--space-xs)]">

        <h2 className="text-normal">2. How We Use Your Information</h2>
        <p className="text-body text-muted-foreground">
      Your information is used to manage vehicle dispatches, track vehicles in real-time, ensure vehicle safety, and enforce business rules. We may also use data to improve our services.
        </p>
</article>


<article className="flex flex-col justify-start gap-[var(--space-xs)]">

        <h2 className="text-normal">3. Data Sharing</h2>
        <p className="text-body text-muted-foreground">
          
          We do not sell or share your personal information with third parties except as required by law or to provide core application functionality (such as real-time tracking).
        </p>
</article>

<article className="flex flex-col justify-start gap-[var(--space-xs)]">

        <h2 className="text-normal">4. Data Security</h2>
        <p className="text-body text-muted-foreground">
          
          We implement security measures to protect your data, including secure communication and access controls. Only authorized personnel can access sensitive information.
        </p>
</article>

<article className="flex flex-col justify-start gap-[var(--space-xs)]">

        <h2 className="text-normal">5. Data Retention</h2>
        <p className="text-body text-muted-foreground">    
            We retain your data only as long as necessary to fulfill the purposes described in this policy or as required by law.
        </p>
</article>

<article className="flex flex-col justify-start gap-[var(--space-xs)]">

        <h2 className="text-normal">6. Your Rights</h2>
        <p className="text-body text-muted-foreground">
    You may request access to, correction of, or deletion of your personal data by contacting us....i personally dgaf
         </p>
</article>

<article className="flex flex-col justify-start gap-[var(--space-xs)]">

        <h2 className="text-normal">7. Changes to This Policy</h2>
        <p className="text-body text-muted-foreground">
     We may update this Privacy Policy from time to time. Changes will be posted on this page and are effective immediately.
        </p>
</article>

<article className="flex flex-col justify-start gap-[var(--space-xs)]">

        <h2 className="text-normal">8. Contact Us</h2>
        <p className="text-body text-muted-foreground">
       If you have any questions about this Privacy Policy, please contact us at
          {"  "}
          <a href="mailto:mail.bright.dev@gmail.com" className="underline-offset-1 underline
          hover:underline-offset-2
          "> Our dev's email</a>
        </p>
</article>

      </section>
    </main>
    </>

  );
}