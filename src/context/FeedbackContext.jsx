import { createContext, useContext, useState } from 'react'
import { FeedbackToast } from '../components/shared/FeedbackToast.jsx'

const FeedbackContext = createContext(null)

export function FeedbackProvider ({ children }) {
  const [toast, setToast] = useState(null)

  const showFeedback = (variant, title, message, duration = 5000) => {
    setToast({ variant, title, message })

    if (duration > 0) {
      window.setTimeout(() => {
        setToast(null)
      }, duration)
    }
  }

  const clearFeedback = () => setToast(null)

  return (
    <FeedbackContext.Provider value={{ showFeedback, clearFeedback }}>
      {children}
      <FeedbackToast toast={toast} onClose={clearFeedback} />
    </FeedbackContext.Provider>
  )
}

export function useFeedback () {
  const context = useContext(FeedbackContext)
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider')
  }
  return context
}
