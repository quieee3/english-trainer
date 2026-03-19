import { useState, useEffect } from 'react'

export default function QuestionCard({ status, children }) {
  const [animClass, setAnimClass] = useState('')

  useEffect(() => {
    if (status === 'correct') {
      setAnimClass('correct pop')
    } else if (status === 'wrong') {
      setAnimClass('wrong shake')
    } else {
      setAnimClass('')
    }
  }, [status])

  return (
    <div className={`card ${animClass}`}>
      {children}
    </div>
  )
}
