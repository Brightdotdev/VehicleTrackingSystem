'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '../ui/button'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button onClick={toggleTheme}>
      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </Button>
  )
}
