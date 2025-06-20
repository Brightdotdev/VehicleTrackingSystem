"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/auth/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/auth/input-otp"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { handleAdminLocalLogInSubmit, handleAdminLocalSignUp, handleGoogleLogIn, handleGoogleSignUp} from "@/lib/handleUserAuth"
import { useState } from "react"
import { AdminGoogleLogIn, AdminGoogleSignUp, AdminLocalLogIn, AdminLocalSignUp } from "@/types/authTypes"
import { Loader2 } from "lucide-react"


const FormSchema = z.object({ pin: z
    .string()
    .min(6, { message: "The key is not complete" })
    .regex(/^\d+$/, { message: "Only numbers are allowed" })})



export function AdminKeyForm({pageSender} : {pageSender: string} ) {
    const { signUpData, logInData,googleUserData } = useAuth()
      const [loading, setLoading] = useState(false);
      const getAdminKey = () => form.getValues("pin");
      const setAdminKey = (value: string) => form.setValue("pin", value);
      let imgSrc = null;

if (pageSender === "google-log-in") {
  imgSrc = googleUserData.picture;
} else if (pageSender === "google-sign-up") {
  imgSrc = googleUserData.picture;
}


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })


  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.info("You submitted the following values")
    toast.info( JSON.stringify(data, null, 2))
    setLoading(true);

    if (pageSender === "form-log-in") {
      const userInfo: AdminLocalLogIn = {
        email: logInData.email,
        password: logInData.password,
        adminKey: data.pin
      };
      console.log(userInfo)

      handleAdminLocalLogInSubmit(userInfo, setLoading, setAdminKey);
    } 

    else if (pageSender === "form-sign-up") {
      const userInfo: AdminLocalSignUp = {
        name : signUpData.name,
        email: signUpData.email,
        password: signUpData.password,
        adminKey: data.pin
      };
      console.log(userInfo)

      handleAdminLocalSignUp(userInfo, setLoading, setAdminKey);
    } 

     else if (pageSender === "google-sign-up") {
      const userInfo: AdminGoogleSignUp = {
        name : googleUserData.given_name,
        email: googleUserData.email,
        sub : googleUserData.sub,
        email_verified : googleUserData.email_verified,
        adminKey: data.pin,
        picture : googleUserData.picture
      }
      console.log(userInfo)
      handleGoogleSignUp(userInfo, setAdminKey, setLoading);
    } 
     else if (pageSender === "google-log-in") {
      const userInfo: AdminGoogleLogIn = {
        email: googleUserData.email,
        adminKey: data.pin
      };
      console.log(userInfo)

      handleGoogleLogIn(userInfo, setAdminKey, setLoading);
    } else{
      toast.error("Then who sent you here boss...you're not allowed to be here lmao");
      return
    }
  }



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-[var(--space-md)]">

       <article className="w-full flex flex-col items-start justify-center gap-[var(--space-xxs)]">
           
           { imgSrc && (

           <img alt="Admin image" className="fixed top-4 left-4 size-[var(--size-lg)] rounded-full" src={imgSrc} /> 
           )}
            <h2 className="titleText">{
            pageSender === "form-log-in" ? "Welcome back" :
            pageSender === "google-log-in" ? `Welcome back ${googleUserData.given_name}` :
            pageSender === "google-sign-up" ? `Hello ${googleUserData.given_name}` :
           `Hello ${signUpData.name}` }</h2>

            <h3 className="mutedText">{pageSender === "log-in" ? "We'll like you to input the admin key to Log in" :  "We'll like you to input the admin key to sign up"}</h3>
       </article>
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputOTP maxLength={6} {...field}
                inputMode="numeric"
                pattern="[0-9]*">

                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
              Please input the admin's verification code (number).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />


{

loading ? (
                <Button disabled className="cursor-pointer text-background ">
                                   <Loader2 className="animate-spin mr-2 stroke-foreground" />
                        

                    Validating Your Data
                </Button>
            ) : (
                <Button
                    className="cursor-pointer
                        relative overflow-hidden group rounded-lg text-background font-semibold
                        px-[var(--space-md)] py-[var(--space-sm)] transition duration-300 hover:shadow-lg focus:outline-none"
                   type="submit" disabled={loading}
                > Submit </Button>
                  )}

      </form>
    </Form>
  )
}
