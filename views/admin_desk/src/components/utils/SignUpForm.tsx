// components/SignUpForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { UserLocalSignUp } from '@/types/authTypes';
import ThemeToggle from './ThemeToggle';

export default function SignUpForm() {
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserLocalSignUp>();

  // Called when form is valid
  const onSubmit = async (data : UserLocalSignUp) => {
    try {
        const response = await fetch('http://localhost:8102/v1/auth/new-user/join-us', {
          method: 'POST',  
         credentials: "include",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
    
        if (!response.ok) {
          throw new Error('Failed to submit form');
        }
    
        const result = await response.json();
        console.log('Form submitted successfully:', result);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
  };

  return (
      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-md shadow-md">
        <ThemeToggle/>
      <h2 className="textHero">Sign Up</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Name Field */}
        <div className="mb-4">
          <label className="titleText">Name</label>
          <input
            type="text"
            {...register('name', { required: 'Name is required' })}
            className="w-full p-2 border rounded"
          />
          {errors.name && <p className="text-primary text-sm">{errors.name.message}</p>}
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="smallText">Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address',
              },
            })}
            className="w-full p-2 border rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
            className="w-full p-2 border rounded"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isSubmitting ? 'Submitting...' : 'Create Account'}
        </button>
      </form>

      {/* Divider */}
      <div className="my-4 border-t text-center text-sm text-gray-500">or</div>

      {/* Google Login */}
      <button
        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 flex items-center justify-center gap-2"
        onClick={() => {
          // Replace with your Google login handler
          console.log('Redirecting to Google OAuth...');
        }}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.805 10.023h-9.92v3.948h5.725c-.322 2.023-2.065 3.548-5.726 3.548-3.456 0-6.26-2.804-6.26-6.26s2.804-6.26 6.26-6.26c1.54 0 2.946.552 4.037 1.452l2.832-2.832C17.158 1.58 14.673.5 12 .5 5.648.5.5 5.648.5 12S5.648 23.5 12 23.5c6.02 0 11.045-4.61 11.045-11.045 0-.747-.074-1.47-.24-2.137z" />
        </svg>
        Sign in with Google
      </button>
    </div>
  );
}
