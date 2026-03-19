import { useState, useRef, useCallback, useEffect } from 'react'

export default function useTimer(maxTime, onTimeUp) {
  const [timeLeft, setTimeLeft] = useState(maxTime)
  const intervalRef = useRef(null)
  const onTimeUpRef = useRef(onTimeUp)
  onTimeUpRef.current = onTimeUp

  const start = useCallback(() => {
    stop()
    setTimeLeft(maxTime)
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 0.1
        if (next <= 0) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
          onTimeUpRef.current?.()
          return 0
        }
        return next
      })
    }, 100)
  }, [maxTime])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    stop()
    setTimeLeft(maxTime)
  }, [maxTime, stop])

  useEffect(() => () => stop(), [stop])

  const pct = (timeLeft / maxTime) * 100

  return { timeLeft, pct, start, stop, reset }
}
