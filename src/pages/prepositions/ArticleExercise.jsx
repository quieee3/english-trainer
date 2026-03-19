import { useState, useMemo, useEffect } from 'react'
import { GameTopBar } from '../../components/Layout.jsx'
import QuestionCard from '../../components/QuestionCard.jsx'
import ChoiceButton from '../../components/ChoiceButton.jsx'
import ResultsScreen from '../../components/ResultsScreen.jsx'
import useGameEngine from '../../hooks/useGameEngine.js'
import { useProgress } from '../../context/ProgressContext.jsx'
import { ARTICLE_EXERCISES } from '../../data/prepositionExercises.js'
import { shuffle } from '../../data/irregularVerbs.js'

export default function ArticleExercise() {
  const { addScore } = useProgress()

  const questions = useMemo(() => shuffle([...ARTICLE_EXERCISES]), [])

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
      onReplay={() => window.location.reload()} backTo="/prepositions" />
  }
  if (!ex) return null

  const parts = ex.sentence.split('___')

  const handleChoice = (opt) => {
    if (engine.answered) return
    const isCorrect = opt.toLowerCase() === ex.answer.toLowerCase()
    const statuses = {}
    if (isCorrect) {
      statuses[opt] = 'correct'
    } else {
      statuses[opt] = 'wrong'
      // Find the matching option for reveal
      const revealOpt = ex.options.find(o => o.toLowerCase() === ex.answer.toLowerCase()) || ex.answer
      statuses[revealOpt] = 'reveal'
    }
    setBtnStatuses(statuses)

    if (isCorrect) {
      addScore(10, 'prepositions', true)
      setCardStatus('correct')
      setFeedbackMsg({ type: 'ok', text: 'Правильно! +10' })
    } else {
      addScore(0, 'prepositions', false)
      setCardStatus('wrong')
      const displayAnswer = ex.answer === '—' ? '— (без артикля)' : ex.answer
      setFeedbackMsg({ type: 'fail', text: `Неправильно! Ответ: ${displayAnswer}` })
    }
    setShowRule(true)
    engine.registerAnswer(isCorrect, isCorrect ? null : { text: `${ex.sentence.replace('___', ex.answer === '—' ? '(-)' : ex.answer)}` })
  }

  return (
    <>
      <GameTopBar backTo="/prepositions" progress={engine.progress}
        current={engine.currentQ + 1} total={engine.totalQ} />
      <div style={{ textAlign: 'center', marginBottom: 12, fontSize: '0.85rem', color: 'var(--text-dim)' }}>
        Артикли
      </div>
      <QuestionCard status={cardStatus}>
        <div className="sentence-display">
          {parts[0]}<span className="blank">{engine.answered ? (ex.answer === '—' ? '(-)' : ex.answer) : '___'}</span>{parts[1]}
        </div>
        <div className="choices">
          {(ex.options || []).map(opt => (
            <ChoiceButton key={opt} text={opt === '—' ? '— (без артикля)' : opt}
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
