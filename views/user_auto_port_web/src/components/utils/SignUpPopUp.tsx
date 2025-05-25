/* 'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Toaster } from '../ui/sonner'
import { useLogInGoogle } from '@/lib/handleUserAuth'
import { Loader2 } from 'lucide-react'

interface SignUpPopUpProps {
  isOpen: boolean
  onClose?: () => void
}


const SignUpPopUp: React.FC<SignUpPopUpProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false)
  // const login = useLogInGoogle(setLoadin})
  const modalRef = useRef<HTMLDivElement>(null)

  const handleOutsideClick = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      toast.info('We need to sign you up')
    }
  };

  

  useEffect(() => {

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
  
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    }
  }, [isOpen]);
  return (
    <AnimatePresence>

      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            className="md:bg-background2 rounded-radius-lg md:rounded-[var(--radius-lg)] p-6 w-full max-w-md
             md:h-auto h-full
            justify-center flex flex-col
            "
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: .5, ease: 'easeInOut' }}
          >
            <h2 className="text-xl font-semibold text-center mb-4">Hello</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              Choose how you'd like to get started:
            </p>

            <div className="flex flex-col space-y-3">
              <Button variant="outline" onClick={() => console.log('Sign In')}>
                Sign In
              </Button>
              <Button variant="outline" onClick={() => console.log('Sign Up')}>
                Sign Up
              </Button>

              {
                loading ? (
                  <Button disabled>
                  <Loader2 className="animate-spin" />
                  Signing You Up
                </Button>
                ) : (                  
              <Button variant="default" onClick={() => login()}>
                  Continue with Google
              </Button>)
              }
    </div>

            <div className="mt-6 text-center">
              <button
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SignUpPopUp
 */


import React from 'react'

const SignUpPopUp = () => {
  return (
    <div>SignUpPopUp</div>
  )
}

export default SignUpPopUp