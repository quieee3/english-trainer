import { useState, useCallback } from 'react'

export default function useGameEngine({ questions }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [roundCorrect, setRoundCorrect] = useState(0)
  const [roundWrong, setRoundWrong] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [mistakes, setMistakes] = useState([])
  const [answered, setAnswered] = useState(false)

  const totalQ = questions.length
  const progress = totalQ > 0 ? (currentQ / totalQ) * 100 : 0
  const isFinished = currentQ >= totalQ

  const registerAnswer = useCallback((isCorrect, mistakeData) => {
    setAnswered(true)
    if (isCorrect) {
      setRoundCorrect(c => c + 1)
      setStreak(s => {
        const next = s + 1
        setBestStreak(bs => Math.max(bs, next))
        return next
      })
    } else {
      setRoundWrong(w => w + 1)
      setStreak(0)
      if (mistakeData) setMistakes(m => [...m, mistakeData])
    }
  }, [])

  const nextQuestion = useCallback(() => {
    setCurrentQ(q => q + 1)
    setAnswered(false)
  }, [])

  const resetGame = useCallback(() => {
    setCurrentQ(0)
    setRoundCorrect(0)
    setRoundWrong(0)
    setStreak(0)
    setBestStreak(0)
    setMistakes([])
    setAnswered(false)
  }, [])

  return {
    currentQ, totalQ, progress,
    roundCorrect, roundWrong, streak, bestStreak, mistakes,
    answered, registerAnswer,
    nextQuestion, isFinished, resetGame
  }
}
