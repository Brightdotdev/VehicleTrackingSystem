import { boolean, z } from "zod";

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
import React, { useRef, useState } from "react"
import { GoogleButton } from "./utils/UtilComponents"
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";


const signUpSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
})

type GoogleButtonProps = {
  authType: string;
};


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
              </div>

  )
}




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



export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const {setSignUpData, signUpData} = useAuth();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ name: signUpData?.name || "" , email: signUpData?.email || "", password: ""});

  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string;}>({});


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = signUpSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: { email?: string; password?: string} = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as "email" | "password"] = err.message;
        console.log(err.message)
      });
      setErrors(fieldErrors);
      toast.error("Please fix the errors in the form.");
      return;
    }

    console.log(result.data)
    const pageExpTime = Date.now() + 5 * 60 * 1000;

    const signUpData = {
     ...result.data, pageExpTime
    }
    setSignUpData(signUpData);
    toast.success("Request data validation successful! Redirecting now....");
    router.replace(`/admin-key?sender=form-sign-up`);
  };

  return (
    <div className={cn("flex flex-col gap-sm overflow-hidden relative", className)} {...props}>

  
      <Card className="overflow-hidden relative">

  <div className="absolute left-0 top-0 right-0 w-full h-full rounded-xl flex items-end justify-end pointer-events-none">
      <div className="gradient">
     
      </div>
    </div>



        <CardHeader className="text-center">
          <CardTitle className="text-medium">Hello</CardTitle>
          <CardDescription>
            Sign up with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-sm">
              <TopGoogle authType="google-sign-up"/>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                    <Input
                  id="name"
                  name="name"
                  type="name"
                  placeholder="Hi... i'm.."
                  value={form.name}
                  onChange={handleChange}
                  required
                  aria-invalid={!!errors.name}
                />
                  {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                </div>

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
                    <Label htmlFor="password">Password</Label>
       
                  <Input 
                  id="password" 
                  type="password"
                  name="password"
                  placeholder="mysecurepass123"
                  value={form.password}
                  onChange={handleChange}
                  required
                  aria-invalid={!!errors.password} />

                  {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}

                </div>
                      <Button type="submit" className="relative overflow-hidden px-6 py-2 transition group">
                  <span className="block transition-transform duration-300 group-hover:translate-x-[1000%]">
    Login
  </span>
  <span className="absolute left-0 top-0 w-full h-full flex items-center justify-center transition-transform duration-300 translate-x-[-200%] group-hover:translate-x-0">
    JOIN US!
  </span>
                </Button>
              </div>

              <BottomGoogle authType="google-sign-up"/>
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
