"use client"

import { UserStatus } from "@/types/authTypes"
import { Check } from "lucide-react"
import { toast } from "sonner"

type UserPreferenceProps = {
  pageSender: string
  selectedStatus?: UserStatus
  onUserStatusChange: (status: UserStatus) => void
}

export function UserPreference({
  pageSender,
  selectedStatus,
  onUserStatusChange
}: UserPreferenceProps) {
  const handleStatusSelect = (status: UserStatus) => {
    if (pageSender === "form-sign-up") {
      toast.info(`this is what thet seeclected ${status}`)
      onUserStatusChange(status)
    } else {
      toast.error("Invalid signup type")
    }
  }

  return (
    <div className="w-full space-y-12">
      <div className="space-y-24">
        <label className="md:text-medium text-normal">
          Select the category that best represents your driving role.
        </label>
        <div className="flex flex-col gap-4 md:mt-8 mt-16">
          {(["DRIVER", "TRANSPORTER", "CIVILIAN"] as UserStatus[]).map((option) => {
            const isSelected = selectedStatus === option

            return (
              <div key={option}>
                <label
                  className={`
                    relative flex items-center justify-between w-full h-12 cursor-pointer border px-4 rounded-md
                    transition-colors
                    hover:bg-accent
                    ${isSelected ? "bg-muted ring-2 ring-ring" : ""}
                  `}
                  onClick={() => handleStatusSelect(option)}
                >
                  <input
                    type="radio"
                    value={option}
                    checked={isSelected}
                    onChange={() => {}}
                    className="sr-only"
                  />
                  <span className="font-normal">{option}</span>
                  {isSelected && (
                    <Check className="absolute top-2 right-2 h-5 w-5 text-primary" />
                  )}
                </label>
              </div>
            )
          })}
        </div>
        
        {!selectedStatus && (
          <p className="text-sm text-mutedText">Please select an option</p>
        )}
      </div>
    </div>
  )
}