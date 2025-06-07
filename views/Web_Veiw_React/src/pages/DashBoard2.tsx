import { BellIcon, CarIcon, HistoryIcon, MapIcon } from "lucide-react";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BottomNavBar } from "@/components/BottomNavBar";
import type { JSX } from "react";

export const Dashboard2 = (): JSX.Element => {
  // Data for dispatch rows
  const dispatchRows = [
    {
      requester: "Dispatch Requester",
      carName: "CarIcon name",
      score: "Disppatch Score",
      status: "Dispatch Status",
    },
    {
      requester: "Dispatch Requester",
      carName: "CarIcon name",
      score: "Disppatch Score",
      status: "Dispatch Status",
    },
    {
      requester: "Dispatch Requester",
      carName: "CarIcon name",
      score: "Disppatch Score",
      status: "Dispatch Status",
    },
    {
      requester: "Dispatch Requester",
      carName: "CarIcon name",
      score: "Disppatch Score",
      status: "Dispatch Status",
    },
    {
      requester: "Dispatch Requester",
      carName: "CarIcon name",
      score: "Disppatch Score",
      status: "Dispatch Status",
    },
  ];

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1440px] relative min-h-[1059px] px-4">
        {/* Header with user info */}
        <header className="flex justify-between items-center mt-6 mb-12">
          <button
            className="bg-[#484848] rounded-lg w-[300px] h-[64px] flex items-center p-2 transition-shadow hover:shadow-lg focus:outline-none"
            type="button"
            aria-label="David's Desk"
          >
            <div className="w-[44px] h-[44px] mr-2 overflow-hidden rounded-full">
              <img
                src="https://c.animaapp.com/mbberkvwpXsN6D/img/rectangle-2.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="font-semibold text-white text-[22px] leading-[32px]">
              David&apos;s Desk
            </div>
          </button>

          <button
            className="w-[60px] h-[60px] bg-[#484848] rounded-full flex items-center justify-center transition-shadow hover:shadow-lg focus:outline-none"
            type="button"
            aria-label="Notifications"
          >
            <BellIcon className="w-[30px] h-[30px] text-white" />
          </button>
        </header>

        {/* Dispatch Table */}
        <div className="flex flex-col gap-4">
          {dispatchRows.map((row, index) => (
            <button
              key={index}
              className="bg-[#e2e2e2] rounded-lg border-b border-black transition-shadow h-[80px] focus:outline-none hover:shadow-lg"
              type="button"
            >
              <div className="grid grid-cols-4 h-full items-center">
                <div className="font-semibold text-[#111111] text-xl leading-7 text-center">
                  {row.requester}
                </div>
                <div className="font-semibold text-[#111111] text-xl leading-7 text-center">
                  {row.carName}
                </div>
                <div className="font-semibold text-[#111111] text-xl leading-7 text-center">
                  {row.score}
                </div>
                <div className="font-semibold text-[#111111] text-xl leading-7 text-center">
                  {row.status}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom Navigation Bar */}
        <BottomNavBar />
      </div>
    </div>
  );
};
