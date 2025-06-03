import React, { useState } from "react";
import { Google } from "iconsax-react";
import type { JSX } from "react/jsx-runtime";
import bcrypt from 'bcryptjs';

export const Auth = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hashedPassword, setHashedPassword] = useState("");

  const handlePasswordChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    // Hash the password as it's typed
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPassword, salt);
      setHashedPassword(hash);
    } else {
      setHashedPassword("");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <div className="w-full max-w-[400px] px-4">
        <div className="flex flex-col items-center gap-6">
          <div className="inline-flex flex-col items-center gap-1">
                    <div className="text-center mt-8 font-semibold text-black text-[32px] tracking-[-0.32px]">
          DESK
        </div>
            <div className="font-semibold text-black text-2xl text-center tracking-[-0.24px] leading-9">
              SET UP YOUR DESK
            </div>

            <p className="font-normal text-black text-base text-center tracking-[0] leading-6">
              Enter your email to sign up for this app
            </p>
          </div>

          <div className="w-full flex flex-col gap-4">
            <input
              className="w-full h-10 px-4 py-2 bg-white rounded-lg border border-solid border-[#dfdfdf] font-body-text text-[#828282] text-base"
              id="input-1"
              placeholder="email@domain.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="w-full h-10 px-4 py-2 bg-white rounded-lg border border-solid border-[#dfdfdf] font-body-text text-[#828282] text-base"
              id="input-2"
              placeholder="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />

            <button className="w-full h-10 bg-black rounded-lg flex items-center justify-center">
              <label
                className="text-white text-base font-medium cursor-pointer"
                htmlFor="input-1"
              >
                Sign up with email
              </label>
            </button>
          </div>

          <div className="w-full flex items-center gap-2">
            <div className="flex-1 h-px bg-[#e6e6e6]" />
            <div className="text-[#828282] text-base">
              or continue with
            </div>
            <div className="flex-1 h-px bg-[#e6e6e6]" />
          </div>

          <button className="w-full h-10 bg-[#eeeeee] hover:bg-[#e0e0e0] rounded-lg flex items-center relative">
            <span className="absolute left-3.5 flex items-center justify-center">
              <Google size={20} color="white" />
            </span>
            <div className="w-full text-center text-base font-medium text-white">
              Google
            </div>
          </button>

          <p className="text-base text-center">
            <span className="text-[#828282]">
              By clicking continue, you agree to our{" "}
            </span>
            <span className="text-black">Terms of Service</span>
            <span className="text-[#828282]"> and </span>
            <span className="text-black">Privacy Policy</span>
          </p>

          <p className="text-black text-center text-sm mt-4">
            New here? <a href="/signup" className="text-blue-600 hover:underline">Sign up now</a>
          </p>
        </div>


      </div>
    </div>
  );
};
