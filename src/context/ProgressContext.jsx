import { createContext, useContext, useCallback } from 'react'
import useLocalStorage from '../hooks/useLocalStorage.js'

const ProgressContext = createContext()

const DEFAULT_STATE = {
  totalScore: 0,
  totalCorrect: 0,
  irregularVerbs: { correct: 0, total: 0 },
  tenses: { correct: 0, total: 0 },
  prepositions: { correct: 0, total: 0 },
  settings: {
    questionCount: 10,
    level: 3,
    timerSeconds: 10,
  },
}

function migrateOldState(state) {
  try {
    const old = JSON.parse(localStorage.getItem('irrverbs_state'))
    if (old && !state.totalScore) {
      return {
        ...state,
        totalScore: old.totalScore || 0,
        totalCorrect: old.totalCorrect || 0,
        irregularVerbs: {
          correct: old.totalCorrect || 0,
          total: old.totalCorrect || 0,
        },
      }
    }
  } catch { /* ignore */ }
  return state
}

export function ProgressProvider({ children }) {
  const [state, setState] = useLocalStorage('english_trainer_state', () => {
    return migrateOldState(DEFAULT_STATE)
  })

  const addScore = useCallback((points, section, isCorrect) => {
    setState(prev => {
      const next = { ...prev }
      next.totalScore = (prev.totalScore || 0) + points
      if (isCorrect) {
        next.totalCorrect = (prev.totalCorrect || 0) + 1
      }
      if (section && prev[section]) {
        next[section] = {
          correct: (prev[section].correct || 0) + (isCorrect ? 1 : 0),
          total: (prev[section].total || 0) + 1,
        }
      }
      return next
    })
  }, [setState])

  const updateSettings = useCallback((key, value) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, [key]: value },
    }))
  }, [setState])

  const resetStats = useCallback(() => {
    setState(DEFAULT_STATE)
  }, [setState])

  const getLevel = () => {
    const c = state.totalCorrect || 0
    if (c < 30) return 1
    if (c < 100) return 2
    if (c < 250) return 3
    if (c < 500) return 4
    return 5
  }

  return (
    <ProgressContext.Provider value={{
      state, addScore, updateSettings, resetStats, getLevel,
    }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  return useContext(ProgressContext)
}
