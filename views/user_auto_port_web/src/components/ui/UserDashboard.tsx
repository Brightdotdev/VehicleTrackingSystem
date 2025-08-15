// components/UserDashboard.tsx
"use client"

import { Button } from "@/components/ui/button"
import UserLicenceCard from "@/components/ui/CreditCardDemo"
import UserDispatchHistory from "@/components/ui/UserDispatchHistory"
import { UserPageData } from "@/types/authTypes"
import { format, parseISO } from "date-fns"
import { ArrowUpLeft, Baby, Fuel, Timer, X } from "lucide-react"
import { useState } from "react"
import UnvalidatedPage from "../utils/UnvalidatedPage"
import { useTheme } from "@/contexts/ThemeContext"

export default function UserDashboard({ userData }: { userData: UserPageData }) {
  const [isCardOpen, setOpenCard] = useState(false)
  const {toggleTheme} = useTheme()



  const formatReadableDate = (dateStr: string) => {
    return format(parseISO(dateStr), "MM/yy")
  }

if(userData === null) return <UnvalidatedPage/>

  if (isCardOpen)
    return (
      <section className="z-30 flex items-center justify-center w-screen h-screen bg-background2 absolute top-0 left-0">
        <Button
          className="flex items-center jutify-center absolute lg:top-6 lg:right-6 bottom-4 right-4 h-fit lg:rounded-full lg:size-10"
          onClick={() => setOpenCard(false)}
        >
          <X className="hidden lg:flex" />
          <span className="flex items-center justify-center gap-4 group lg:hidden flex">
            <ArrowUpLeft className="transition-transform duration-200 group-hover:-rotate-45" />
            Go Back
          </span>
        </Button>

        <UserLicenceCard
          userStatus={userData.userStatus}
          userName={userData.username}
          userLisence={userData.licence}
          lisenceExp={userData.licenceExp}
        />
      </section>
    )

  return (
    <div className="flex flex-col gap-4 items-center justify-start w-screen h-screen">
      <main className="lg:w-[98vw] w-screen lg:h-[80vh] md:h-[90vh] flex flex-col items-center justify-start flex-wrap md:p-4 overflow-y-auto overflow-hidden overflow-y-scroll lg:overlow-hidden lg:customScrollBar">

      

      
        <section className="flex flex-col items-center justify-start h-full lg:w-[68%] w-full  gap-4 ">
          <article className="w-full h-[70%] flex items-start justify-start self-start md:rounded-md bg-background2 p-4">
            <div className="flex items-start justify-center flex-col gap-8 w-full">
              {/* user profile stuff */}
              <div className="flex items-center justify-center gap-2">
                <img
                  className="lg:size-20 md:size-10 size-8  bg-blue-200 rounded-full"
                  src="/userProfilePlaceHolder.png"
                />
                <h4 className="lg:text-medium-2 text-normal flex items-center justify-center gap-2">
                  {userData.username.toLocaleUpperCase()} <span>•</span>{" "}
                  <span className="text-muted-foreground">{userData.userStatus}</span>
                </h4>
              </div>

              {/* USER DATA SECTION STUFF */}
              <div className="flex items-start justify-center flex-col gap-4">
                <h2 className="bodyText flex items-center justify-center gap-2">
                  <Baby className="size-4 text-green-400" />
                  <span className="mutedText"> Member since: </span>
                  <div className="flex items-center justify-center gap-1">
                    {formatReadableDate(userData.joinedAt)}
                  </div>
                </h2>

                <h2 className="bodyText flex items-center justify-center gap-2">
                  <Fuel className="size-4 text-blue-400" />
                  <span className="mutedText"> Dispatch Points: </span>
                  <div className="flex items-center justify-center gap-1">
                    {userData.dispatchPoints}
                  </div>
                </h2>

                <h2 className="bodyText flex items-center justify-center gap-2">
                  <Timer className="size-4 text-red-400" />
                  <span className="mutedText">Lisence Expires In: </span>
                  <div className="flex items-center justify-center gap-1">
                    {formatReadableDate(userData.licenceExp)}
                  </div>
                </h2>
              </div>


  
    <div className="flex items-center justify-between w-full">
         <Button onClick={() => toggleTheme()}>
    Change Theme
              </Button>

              <Button  onClick={() => setOpenCard(true)}>
                View Drivers card
              </Button>
    </div>
            </div>
          </article>

          {/* mobile history section */}
          <section className="lg:hidden w-full md:rounded-md flex items-start justify-center flex-col md:rounded-md">
            <UserDispatchHistory />
          </section>

          <footer className="w-full py-8 px-4 text-center bg-background2  md:rounded-md ">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">AutoPort</h2>
              <p className="text-sm">Simplifying dispatch and safety tracking</p>
            </div>

            <div className="flex justify-center gap-4 text-sm mutedText mb-4">
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Privacy Policy
              </a>
              <span>•</span>
              <a
                href="/terms-of-service"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Terms of Use
              </a>
            </div>

            <p className="text-xs">
              &copy; {new Date().getFullYear()} AutoPort Inc. All rights reserved.
            </p>
          </footer>
        </section>

        {/* desktop history section */}
        <section className="lg:w-[30%] lg:h-full md:rounded-md lg:flex hidden items-start justify-center flex-col md:rounded-md">
          <UserDispatchHistory />
        </section>
      </main>
    </div>
  )
}
