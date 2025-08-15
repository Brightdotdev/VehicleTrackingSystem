import React, { useState } from 'react'
import { Button } from '../button'
import { UserPreference } from '../UserPreference'
import { LastStep } from './LastStepForm'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { UserLocalSignUp, UserStatus } from '@/types/authTypes'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { handleUserLocalSignUp } from '@/lib/handleUserAuth'

type FormData = {
  name: string
  agree: boolean
  userStatus?: UserStatus
}

const UserSignUpMultiStep = ({ pageSender }: { pageSender: string }) => {
  const { signUpData, googleUserData } = useAuth()
  const [step, setStep] = useState(1)
  const [validationError, setValidationError] = useState(false)
  const [termsError, setTermsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const [formData, setFormData] = useState<FormData>({
    name: pageSender === "form-sign-up" ? signUpData.name : googleUserData.given_name,
    agree: false,
    userStatus: signUpData.userStatus
  })

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.userStatus) {
        setValidationError(true)
        toast.error("Please select your user type")
        return
      }
      setStep(2)
      setValidationError(false)
    }
  }

  const handleUserStatusChange = (status: UserStatus) => {
    setFormData(prev => ({
      ...prev,
      userStatus: status
    }))
    // Also update in auth context if needed
    signUpData.userStatus = status
  }

  const handleSubmit = async () => {
    
    setIsLoading(true)
    try {
      if (pageSender === "form-sign-up") {
        const userInfo: UserLocalSignUp = {
          name: formData.name,
          email: signUpData.email,
          password: signUpData.password,
          userStatus: formData.userStatus!
        }
        

        if(!formData.agree) {
        return  setTermsError(true)
        }

        if (!userInfo.name || !userInfo.email || !userInfo.password || !userInfo.userStatus) {
          toast.error("Incomplete data provided")
          router.replace("/join-us")
          return
        }
        
        await handleUserLocalSignUp(userInfo, setIsLoading)
      } 
      else {
        toast.error("Invalid sign in parameters")
        return window.location.replace("/")
      }
    } catch (error) {
      toast.error("An error occurred during sign up")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="flex flex-col items-center justify-start w-full h-full">
      <div className="md:w-2/3 w-full flex flex-col items-start justify-start h-full p-4 gap-4">
        <div className='flex items-center justify-center w-fit h-3 rounded-full px-8 py-4 bg-background2 self-end'>
          {step === 1 ? "Step 1 of 2" : "Final Step"}
        </div>

        <div className="h-[80%] w-full">
          {step === 1 ? (
            <UserPreference 
              pageSender={pageSender}
              onUserStatusChange={handleUserStatusChange}
              selectedStatus={formData.userStatus}
            />
          ) : (

            <LastStep
            termsError={termsError}
              name={formData.name}
              onNameChange={(name) => handleFormChange('name', name)}
              onAgreeChange={(agree) => handleFormChange('agree', agree)}
              isLoading={isLoading}
              imgSrc={pageSender === "google-sign-up" ? googleUserData.picture : null}
            />
          )}
        </div>

        {(validationError && !isLoading) && (
          <p className="text-sm text-red-400 dark:text-red-400">Please select a user type before proceeding</p>
        )}

 

        <div className="w-full flex justify-between items-center">
          {step === 2 && (
            <Button onClick={() => setStep(1)} variant="secondary">
              Go Back
            </Button>
          )}

          <Button 
            onClick={step === 1 ? handleNextStep : handleSubmit}
            disabled={isLoading}
            className='self-end'
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 stroke-foreground" />
                {step === 1 ? "Processing..." : "Signing you up..."}
              </>
            ) : step === 1 ? (
              "Next Step (2/2)"
            ) : (
              "Sign Me Up"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UserSignUpMultiStep