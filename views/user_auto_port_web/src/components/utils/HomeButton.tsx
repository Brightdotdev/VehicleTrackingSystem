import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

const HomeButton = () => {
  return (
    <Button
      asChild
      variant="link"
      className="fixed bottom-6 right-6 z-50 subTitleText rounded shadow-lg transition"
    >
      <Link href="/">
        Go Back Home
      </Link>
    </Button>
  )
}

export default HomeButton