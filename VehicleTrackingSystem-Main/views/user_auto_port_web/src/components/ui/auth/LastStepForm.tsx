"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/auth/form"

import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { handleGoogleSignUp, handleUserLocalSignUp} from "@/lib/handleUserAuth"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { UserGoogleSignUp, UserLocalSignUp } from "@/types/authTypes"
import { Switch } from "../switch"
import { Input } from "../input"
import { useRouter } from "next/navigation"



const FormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters "),
  agree: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms..yes you must" }),
  }),
});





export function LastStep({pageSender} : {pageSender: string} ) {
    const router  = useRouter();
    const { signUpData,googleUserData } = useAuth()
      
    const [loading, setLoading] = useState(false);  
    let imgSrc = null;


  if (pageSender === "google-sign-up") {
  imgSrc = googleUserData.picture;
  }


const form = useForm<z.infer<typeof FormSchema>>({
  resolver: zodResolver(FormSchema),
  defaultValues: {
    name: `${pageSender === "form-sign-up" ?   `${signUpData.name}`  :  `${googleUserData.given_name}` }`,
    agree: true,
  },
});




  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.info( JSON.stringify(data, null, 2))
    setLoading(true);

    if (pageSender === "form-sign-up") {
      const userInfo: UserLocalSignUp = {
        name : signUpData.name,
        email: signUpData.email,
        password: signUpData.password};
        console.log(userInfo)
          if(userInfo.name === "" || userInfo.email === "" ||
userInfo.password === ""
          ){
        toast.error("No data provided..redirecting")
        router.replace("/join-us")
      }
      handleUserLocalSignUp(userInfo,setLoading)}
     else if (pageSender === "google-sign-up") {
      const userInfo: UserGoogleSignUp = {
        name : googleUserData.given_name,
        email: googleUserData.email,
        sub : googleUserData.sub,
        email_verified : googleUserData.email_verified,
        picture : googleUserData.picture
      }
          if(userInfo.name === "" || userInfo.email === "" 
 || userInfo.sub === "" 
           ){
        toast.error("No data provided..redirecting")
        router.replace("/join-us")
      }
      handleGoogleSignUp(userInfo, setLoading);
    } 
 else{
      toast.error("Then who sent you here boss...you're not allowed to be here lmao");
      return
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-[var(--space-md)]">

       <article className="w-full flex flex-col items-start justify-center gap-[var(--space-xxs)]">
           
           { imgSrc && (

           <img alt="user image" className="fixed top-4 left-4 size-[var(--size-lg)] rounded-full" src={imgSrc} /> 
           )}
            <h2 className="titleText">{
            pageSender === "google-sign-up" ? `Hello ${googleUserData.given_name}` :
           `Hello ${signUpData.name}` }</h2>
           
          {!loading && (  <h3 className="mutedText">or is this what you'll like us to call you by?</h3>)}
       </article>


<div className="flex flex-col items-start justify-center gap-4 w-full">
  <FormField
    control={form.control}
    name="name"
    render={({ field }) => (
      <FormItem className="w-full">
        <label className="titleText block mb-2">
        
        </label>
        <FormControl>
          <Input
            type="text"
            className="bg-card"
            placeholder="Hello i'm"
            value={field.value ?? (pageSender === "google-sign-up" ? googleUserData.given_name : signUpData.name)}
            onChange={e => {
              field.onChange(e.target.value);
              if (pageSender === "google-sign-up") {
                googleUserData.given_name = e.target.value;
              } else {
                signUpData.name = e.target.value;
              }
            }}/>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  <FormField
    control={form.control}
    name="agree"
    render={({ field }) => (
      <FormItem className="flex items-start gap-2">
        <FormControl>
          {/* shadcn/ui Switch */}
          <div className="flex flex-col items-start gap-2">
            <Switch
              checked={!!field.value}
              onCheckedChange={field.onChange}
              id="terms"
            />
            <label htmlFor="terms" className="text-xs text-muted-foreground">

By continuing, you obviously agree to our
{" "}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/policy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                Privacy Policy {" "}

              </a>
              and the data collection to help you get the best experience of this application.
            </label>
        <FormMessage />
          </div>
        </FormControl>
      </FormItem>
    )}
  />
</div>
{
loading ? (
                <Button disabled className="cursor-pointer text-background ">
                                   <Loader2 className="animate-spin mr-2 stroke-foreground" />
               Getting you in...
                </Button>
            ) : (
                <Button
                    className="cursor-pointer
                        relative overflow-hidden group rounded-lg text-background font-semibold
                        px-[var(--space-md)] py-[var(--space-sm)] transition duration-300 hover:shadow-lg focus:outline-none"
                   type="submit" disabled={loading}
                > Sign Me Up </Button> )}

      </form>
    </Form>
  )
}
