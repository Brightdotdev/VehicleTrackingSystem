import { z } from "zod";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/LogInCard"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { toast } from "sonner"
import React, { useState } from "react"
import { GoogleButton } from "./utils/UtilComponents"
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";



type GoogleButtonProps = {
  authType: string;
};


const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

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
}


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
const  {setLogInData}   = useAuth()
const [form, setForm] = useState({ email: "", password: "" });
const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
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
      const pageExpTime = Date.now() + 5 * 60 * 1000;
  
      const logInData = {
       ...result.data, pageExpTime
      }
      setLogInData(logInData);
      toast.success("Request data validation successful! Redirecting now....");
      router.replace(`/admin-key?sender=local-log-in`);
};
  return (
    <div className={cn("flex flex-col gap-sm overflow-hidden relative", className)} {...props}>

  
      <Card className="overflow-hidden relative">

  <div className="absolute left-0 top-0 right-0 w-full h-full rounded-xl flex items-end justify-end pointer-events-none">
      <div className="gradient">
     
      </div>
    </div>



        <CardHeader className="text-center">
          <CardTitle className="text-medium">Welcome back</CardTitle>
          <CardDescription>
            Login with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-sm">

              <TopGoogle authType="google-log-in"/>
              
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
                  <Input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  aria-invalid={!!errors.password}
                />
                {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
                </div>
                <Button type="submit" className="relative overflow-hidden px-6 py-2 transition group">
                  <span className="block transition-transform duration-300 group-hover:translate-x-[1000%]">
    Login
  </span>
  <span className="absolute left-0 top-0 w-full h-full flex items-center justify-center transition-transform duration-300 translate-x-[-200%] group-hover:translate-x-0">
    Welcome!
  </span>
                </Button>
              </div>

              <BottomGoogle authType="google-log-in"/>
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
