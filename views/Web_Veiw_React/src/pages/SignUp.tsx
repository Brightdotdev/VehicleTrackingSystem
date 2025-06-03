import React, { useState } from "react";
import { Google } from "iconsax-react";
import type { JSX } from "react/jsx-runtime";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  username: string;
  birthDate: Date | null;
  phoneNumber: string;
}

export const SignUp = (): JSX.Element => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    username: "",
    birthDate: null,
    phoneNumber: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date) => {
    setFormData(prev => ({ ...prev, birthDate: date }));
  };

  const nextStep = () => {
    setStep(2);
  };

  const prevStep = () => {
    setStep(1);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
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
              CREATE YOUR ACCOUNT
            </div>
            <p className="font-normal text-black text-base text-center tracking-[0] leading-6">
              {step === 1 ? "Let's start with the basics" : "Complete your profile"}
            </p>
          </div>

          <AnimatePresence initial={false} custom={step}>
            <motion.div
              key={step}
              custom={step}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="w-full"
            >
              {step === 1 ? (
                <div className="w-full flex flex-col gap-4">
                  <input
                    className="w-full h-10 px-4 py-2 bg-white rounded-lg border border-solid border-[#dfdfdf] font-body-text text-[#828282] text-base"
                    name="fullName"
                    placeholder="Full Name"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                  <input
                    className="w-full h-10 px-4 py-2 bg-white rounded-lg border border-solid border-[#dfdfdf] font-body-text text-[#828282] text-base"
                    name="email"
                    placeholder="email@domain.com"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <input
                    className="w-full h-10 px-4 py-2 bg-white rounded-lg border border-solid border-[#dfdfdf] font-body-text text-[#828282] text-base"
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button 
                    onClick={nextStep}
                    className="w-full h-10 bg-black rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
                  >
                    <span className="text-white text-base font-medium">
                      Next
                    </span>
                  </button>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-4">
                  <input
                    className="w-full h-10 px-4 py-2 bg-white rounded-lg border border-solid border-[#dfdfdf] font-body-text text-[#828282] text-base"
                    name="username"
                    placeholder="Username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                  <div className="relative">
                    <DatePicker
                      selected={formData.birthDate}
                      onChange={handleDateChange}
                      dateFormat="dd/MM/yy"
                      placeholderText="Date of Birth (DD/MM/YY)"
                      className="w-full h-10 px-4 py-2 bg-white rounded-lg border border-solid border-[#dfdfdf] font-body-text text-[#828282] text-base"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={100}
                      maxDate={new Date()}
                    />
                  </div>
                  <input
                    className="w-full h-10 px-4 py-2 bg-white rounded-lg border border-solid border-[#dfdfdf] font-body-text text-[#828282] text-base"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                  <div className="flex gap-4">
                    <button 
                      onClick={prevStep}
                      className="flex-1 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <span className="text-gray-800 text-base font-medium">
                        Back
                      </span>
                    </button>
                    <button 
                      className="flex-1 h-10 bg-black rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
                    >
                      <span className="text-white text-base font-medium">
                        Create Account
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

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
        </div>
        <p className="text-black text-center text-sm mt-4">
          Already have an account? <a href="/" className="text-blue-600 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}; 