import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { GameTopBar } from '../../components/Layout.jsx'
import QuestionCard from '../../components/QuestionCard.jsx'
import ChoiceButton from '../../components/ChoiceButton.jsx'
import ResultsScreen from '../../components/ResultsScreen.jsx'
import useGameEngine from '../../hooks/useGameEngine.js'
import { useProgress } from '../../context/ProgressContext.jsx'
import { getTenseExercises, TENSES } from '../../data/tenseExercises.js'
import { shuffle } from '../../data/irregularVerbs.js'

export default function ChooseTense() {
  const { tenseId } = useParams()
  const { addScore } = useProgress()
  const tenseName = TENSES.find(t => t.id === tenseId)?.name || tenseId

  const questions = useMemo(() => {
    return shuffle(getTenseExercises(tenseId, 'choose_tense'))
  }, [tenseId])

  const engine = useGameEngine({ questions })
  const [cardStatus, setCardStatus] = useState(null)
  const [feedbackMsg, setFeedbackMsg] = useState(null)
  const [btnStatuses, setBtnStatuses] = useState({})
  const [showRule, setShowRule] = useState(false)

  const ex = questions[engine.currentQ]

  useEffect(() => {
    if (!ex || engine.isFinished) return
    setCardStatus(null)
    setFeedbackMsg(null)
    setBtnStatuses({})
    setShowRule(false)
  }, [engine.currentQ, ex, engine.isFinished])

  if (engine.isFinished) {
    return <ResultsScreen correct={engine.roundCorrect} wrong={engine.roundWrong}
      bestStreak={engine.bestStreak} mistakes={engine.mistakes}
      onReplay={() => window.location.reload()} backTo="/tenses" />
  }
  if (!ex) return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-dim)' }}>Нет упражнений</div>

  const handleChoice = (opt) => {
    if (engine.answered) return
    const isCorrect = opt === ex.correctTense
    const statuses = {}
    if (isCorrect) {
      statuses[opt] = 'correct'
    } else {
      statuses[opt] = 'wrong'
      statuses[ex.correctTense] = 'reveal'
    }
    setBtnStatuses(statuses)

    if (isCorrect) {
      addScore(10, 'tenses', true)
      setCardStatus('correct')
      setFeedbackMsg({ type: 'ok', text: 'Правильно! +10' })
    } else {
      addScore(0, 'tenses', false)
      setCardStatus('wrong')
      setFeedbackMsg({ type: 'fail', text: `Неправильно! Ответ: ${ex.correctTense}` })
    }
    setShowRule(true)
    engine.registerAnswer(isCorrect, isCorrect ? null : { text: `"${ex.sentence}" — ${ex.correctTense}` })
  }

  return (
    <>
      <GameTopBar backTo="/tenses" progress={engine.progress}
        current={engine.currentQ + 1} total={engine.totalQ} />
      <div style={{ textAlign: 'center', marginBottom: 12, fontSize: '0.85rem', color: 'var(--text-dim)' }}>
        {tenseName} — Определите время
      </div>
      <QuestionCard status={cardStatus}>
        <div className="sentence-display" style={{ fontStyle: 'italic' }}>
          "{ex.sentence}"
        </div>
        <div className="choices">
          {(ex.options || []).map(opt => (
            <ChoiceButton key={opt} text={opt}
              status={btnStatuses[opt]} disabled={engine.answered}
              onClick={() => handleChoice(opt)} />
          ))}
        </div>
      </QuestionCard>
      <div className="feedback">
        {feedbackMsg && <div className={`msg ${feedbackMsg.type}`}>{feedbackMsg.text}</div>}
        {showRule && ex.rule && (
          <div className="rule-box">
            <div className="rule-title">Правило</div>
            {ex.rule}
          </div>
        )}
        {engine.answered && (
          <button className="btn-next" onClick={engine.nextQuestion} style={{ marginTop: 10 }}>Дальше &rarr;</button>
        )}
      </div>
    </>
  )
}
