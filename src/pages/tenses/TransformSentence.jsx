import { useState, useMemo, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { GameTopBar } from '../../components/Layout.jsx'
import QuestionCard from '../../components/QuestionCard.jsx'
import ResultsScreen from '../../components/ResultsScreen.jsx'
import useGameEngine from '../../hooks/useGameEngine.js'
import { useProgress } from '../../context/ProgressContext.jsx'
import { getTenseExercises, TENSES } from '../../data/tenseExercises.js'
import { shuffle } from '../../data/irregularVerbs.js'

export default function TransformSentence() {
  const { tenseId } = useParams()
  const { addScore } = useProgress()
  const tenseName = TENSES.find(t => t.id === tenseId)?.name || tenseId

  const questions = useMemo(() => {
    return shuffle(getTenseExercises(tenseId, 'transform'))
  }, [tenseId])

  const engine = useGameEngine({ questions })
  const [cardStatus, setCardStatus] = useState(null)
  const [feedbackMsg, setFeedbackMsg] = useState(null)
  const [showRule, setShowRule] = useState(false)
  const inputRef = useRef(null)

  const ex = questions[engine.currentQ]

  useEffect(() => {
    if (!ex || engine.isFinished) return
    setCardStatus(null)
    setFeedbackMsg(null)
    setShowRule(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [engine.currentQ, ex, engine.isFinished])

  if (engine.isFinished) {
    return <ResultsScreen correct={engine.roundCorrect} wrong={engine.roundWrong}
      bestStreak={engine.bestStreak} mistakes={engine.mistakes}
      onReplay={() => window.location.reload()} backTo="/tenses" />
  }
  if (!ex) return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-dim)' }}>Нет упражнений</div>

  const doCheck = () => {
    if (engine.answered) return
    const val = inputRef.current?.value?.trim().toLowerCase() || ''
    const correct = ex.answer.toLowerCase()
    const isCorrect = val === correct

    if (isCorrect) {
      addScore(10, 'tenses', true)
      setCardStatus('correct')
      setFeedbackMsg({ type: 'ok', text: 'Правильно! +10' })
    } else {
      addScore(0, 'tenses', false)
      setCardStatus('wrong')
      setFeedbackMsg({ type: 'fail', text: `Неправильно! Ответ: ${ex.answer}` })
    }
    setShowRule(true)
    engine.registerAnswer(isCorrect, isCorrect ? null : { text: `${ex.sentence} → ${ex.answer} (ваш ответ: ${val || '—'})` })
  }

  return (
    <>
      <GameTopBar backTo="/tenses" progress={engine.progress}
        current={engine.currentQ + 1} total={engine.totalQ} />
      <div style={{ textAlign: 'center', marginBottom: 12, fontSize: '0.85rem', color: 'var(--text-dim)' }}>
        {tenseName} — Трансформация
      </div>
      <QuestionCard status={cardStatus}>
        <div className="sentence-display">
          {ex.sentence}
        </div>
        <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 12 }}>
          Напишите правильную форму: <strong style={{ color: 'var(--accent)' }}>{ex.original}</strong>
        </div>
        <div className="input-area">
          <input ref={inputRef} type="text" placeholder="Ваш ответ..."
            disabled={engine.answered}
            onKeyDown={e => e.key === 'Enter' && doCheck()}
            autoComplete="off"
            style={{ width: 220 }} />
          <button className="btn-submit" onClick={doCheck} disabled={engine.answered}>Проверить</button>
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
