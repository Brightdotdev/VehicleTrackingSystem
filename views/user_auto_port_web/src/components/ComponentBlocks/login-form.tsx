import { z } from "zod";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/auth/LogInCard"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { toast } from "sonner"
import React, { useState } from "react"
import { GoogleButton } from "../utils/UtilComponents"
import { useAuth } from "@/contexts/AuthContext";
import { handleUserLocalLogInSubmit } from "@/lib/handleUserAuth";
import { UserLocalLogIn } from "@/types/authTypes";
import { Loader2 } from "lucide-react";



type GoogleButtonProps = {
  authType: string;
};


const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});
/* 
const TopGoogle = ({ authType }: GoogleButtonProps) =>{
    const [googleLoading, setGoogleLoading] = useState(false)
  return(
            <div className="hidden md:flex-col gap-sm md:flex">

                <GoogleButton authType={authType} loading={googleLoading} setGoogleLoading={setGoogleLoading} />
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="md:bg-card bg-background text-muted-foreground relative z-10 px-[var(--space-sm)]">
                  Or continue with
                </span>
              </div>
              </div>)}
 */

/* 
const BottomGoogle = ({ authType }: GoogleButtonProps) => {
    const [googleLoading, setGoogleLoading] = useState(false)
  return(
            <div className="md:hidden gap-sm flex flex-col">

              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="md:bg-card bg-background text-muted-foreground relative z-10 px-[var(--space-sm)]">
                  Or continue with
                </span>
              </div>
                <GoogleButton authType={authType} loading={googleLoading} setGoogleLoading={setGoogleLoading} />
              </div>

  )
} */


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  
const [showPassword, setShowPassword] = useState(false);
const  {setLogInData}   = useAuth()
const [form, setForm] = useState({ email: "", password: "" });
const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
const [loading,setLoading] = useState(false);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setForm({ ...form, [e.target.name]: e.target.value });
  setErrors({ ...errors, [e.target.name]: undefined });
};


const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const result = loginSchema.safeParse(form);

  if (!result.success) {
    const fieldErrors: { email?: string; password?: string } = {};
    result.error.errors.forEach(err => {
      if (err.path[0]) fieldErrors[err.path[0] as "email" | "password"] = err.message;
    });
    setErrors(fieldErrors);
    toast.error("Please fix the errors in the form.");
    return;
  }


      console.log(result.data)

      
      const logInData : UserLocalLogIn = {
       ...result.data
      }
      setLogInData(logInData);
      toast.success("Request data validation Successful...");
      toast.success("Validating you with our server...");
      handleUserLocalLogInSubmit(logInData,setLoading)
};
  return (
    <div className={cn("flex flex-col gap-sm overflow-hidden relative w-md", className)} {...props}>

  
      <Card className="overflow-hidden relative">

  <div className="absolute left-0 top-0 right-0 w-full h-full rounded-xl flex items-end justify-end pointer-events-none">
      <div className="gradient">
     
      </div>
    </div>



        <CardHeader className="text-center">
          <CardTitle className="text-medium">Welcome back</CardTitle>
          <CardDescription>
            Login to your Auto Port account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-sm">

              {/* <TopGoogle authType="google-log-in"/> */}
              
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
          <Input
          id="email"
          name="email"
          type="email"
          placeholder="myemail@example.com"
          value={form.email}
          onChange={handleChange}
          required
          aria-invalid={!!errors.email}
        />
        {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}

                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        toast.error("Omo you're on your own o");
                        toast.info("Try creating a new account or sum");
                      }}
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>

<div className="flex items-center justify-center gap-2 w-full relative">



                  <Input
                  id="password"
                  name="password"
                  value={form.password}
                   type={showPassword ? "text" : "password"}
                  onChange={handleChange}
                  required
                  aria-invalid={!!errors.password}
                  />
        <button
                                      type="button"
                                      onClick={() => setShowPassword((prev) => !prev)}
                                      className="absolute right-4
                                       top-1/2 -translate-y-1/2 text-xs text-muted-foreground"
                                      tabIndex={-1}
                                      aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                      {showPassword ? "Hide" : "Show"}
                                    </button>  

                  </div>
                  
             
                {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
                </div>
               {
               
               loading ? 
                   <Button className="flex items-center justify-center
    bg-muted-foreground
    font-bold
    text-primary-foreground         
    h-[var(--size-md)]  
  relative overflow-hidden px-6 py-2">
    <Loader2 className="animate-spin mr-2" />
    Loading
  </Button>
  :
   <Button type="submit" className="relative overflow-hidden px-6 py-2 transition group">
                  <span className="block transition-transform duration-300 group-hover:translate-x-[1000%]">
    Login
  </span>
  <span className="absolute left-0 top-0 w-full h-full flex items-center justify-center transition-transform duration-300 translate-x-[-200%] group-hover:translate-x-0">
    Welcome Back!
  </span>
                </Button>}
              </div>

              {/* <BottomGoogle authType="google-log-in"/> */}
            </div>
          </form>

              <div className="my-[var(--space-sm)] inline md:hidden text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <Link href="/terms-of-service">Terms of Service</Link>{" "}
        and <Link href="/privacy-policy">Privacy Policy</Link>.
      </div>
        </CardContent>
      </Card>
      <div className=" hidden md:inline text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <Link href="/terms-of-service">Terms of Service</Link>{" "}
        and <Link href="/privacy-policy">Privacy Policy</Link>.
      </div>
    </div>
  )
}
