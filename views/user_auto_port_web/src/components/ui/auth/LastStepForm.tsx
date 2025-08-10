"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/auth/form"
import { Switch } from "../switch"
import { Input } from "../input"
import { Loader2 } from "lucide-react"

const FormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  agree: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms",
  }),
})

type FormValues = z.infer<typeof FormSchema>

type LastStepProps = {
  termsError : boolean,
  name: string
  onNameChange: (name: string) => void
  onAgreeChange: (agree: boolean) => void
  isLoading: boolean
  imgSrc?: string | null
}

export function LastStep({
  name,
  onNameChange,
  onAgreeChange,
  isLoading,
  imgSrc, 
  termsError
}: LastStepProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name,
      agree : false,
    },
  })

  return (
    <Form {...form}>
      <form className="w-2/3 space-y-[var(--space-md)]">
        <article className="w-full flex flex-col items-start justify-center gap-[var(--space-xxs)]">
          {imgSrc && (
            <img 
              alt="User profile" 
              className="fixed top-4 left-4 size-[var(--size-lg)] rounded-full object-cover" 
              src={imgSrc} 
              width={40}
              height={40}
            />
          )}
          <h2 className="titleText">Hello {name}</h2>
          {!isLoading && (
            <h3 className="mutedText">or is this what you'll like us to call you by?</h3>
          )}
        </article>

        <div className="flex flex-col items-start justify-center gap-4 w-full">
          <FormField<FormValues>
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    type="text"
                    className="bg-card"
                    placeholder="Hello I'm"
                    value={field.value as string}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                      onNameChange(e.target.value)
                    }}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField<FormValues>
            control={form.control}
            name="agree"
            render={({ field }) => (
              <FormItem className="flex items-start gap-2">
                <FormControl>
                  <div className="flex flex-col items-start gap-2">
                    <Switch
                        checked={field.value as boolean}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                        onAgreeChange(checked)
                      }}
                      id="terms"
                      disabled={isLoading}
                    />
                    <label htmlFor="terms" className="text-xs text-muted-foreground">
                      By continuing, you agree to our{" "}
                      <a
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-primary"
                      >
                        Terms
                      </a>{" "}
                      and{" "}
                      <a
                        href="/policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-primary"
                      >
                        Privacy Policy
                      </a>
                      , and data collection for optimal experience.
                    </label>



              {(termsError && !isLoading) && (
          <p className="text-sm text-red-300 dark:text-red-400">Uhm you need to agree to our terms of use (consent)</p>
        )}


                    <FormMessage />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}