"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import { Check } from "lucide-react"

const FormSchema = z.object({
  type: z.enum(["DRIVER", "TRANSPORTER", "CIVILIAN"], {
    required_error: "You need to select a notification type.",
  }),
})

export function UserPreference() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("You submitted the following values", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-medium">Select the category that best represents your driving role.</FormLabel>
              <FormControl>
<RadioGroup
  onValueChange={field.onChange}
  value={field.value} // control the value
  className="flex flex-col gap-4"
>
  {["DRIVER", "TRANSPORTER", "CIVILIAN"].map((option) => {
    const isSelected = field.value === option

    return (
      <FormItem key={option}>
        <label
          className={`
            relative flex items-center justify-between w-full h-20 cursor-pointer border p-4 rounded-md
            transition-colors
            hover:bg-accent
            ${isSelected ? "bg-muted ring-2 ring-ring" : ""}
          `}
        >
          {/* Visually hidden but functionally present radio */}
          <FormControl>
            <RadioGroupItem value={option} className="sr-only" />
          </FormControl>

          {/* Option text */}
          <span className="font-normal">{option}</span>

          {/* Check icon shown only when selected */}
          {isSelected && (
            <Check className="absolute top-2 right-2 h-5 w-5 text-primary" />
          )}
        </label>
      </FormItem>
    )
  })}
</RadioGroup>


      
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
