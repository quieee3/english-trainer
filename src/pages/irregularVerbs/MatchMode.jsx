import { useState, useMemo, useRef, useEffect } from 'react'
import { GameTopBar } from '../../components/Layout.jsx'
import StatsBar from '../../components/StatsBar.jsx'
import QuestionCard from '../../components/QuestionCard.jsx'
import ResultsScreen from '../../components/ResultsScreen.jsx'
import useGameEngine from '../../hooks/useGameEngine.js'
import { useProgress } from '../../context/ProgressContext.jsx'
import { getVerbPool, shuffle, checkAnswer } from '../../data/irregularVerbs.js'

export default function MatchMode() {
  const { state: pState, addScore } = useProgress()
  const { questionCount, level } = pState.settings

  const questions = useMemo(() => {
    const pool = getVerbPool(level)
    const count = questionCount === 0 ? pool.length : Math.min(questionCount, pool.length)
    return shuffle(pool).slice(0, count)
  }, [questionCount, level])

  const engine = useGameEngine({ questions })
  const [localScore, setLocalScore] = useState(0)
  const [cardStatus, setCardStatus] = useState(null)
  const [feedbackMsg, setFeedbackMsg] = useState(null)
  const [inputStatuses, setInputStatuses] = useState({})
  const v1Ref = useRef(null)
  const v2Ref = useRef(null)
  const v3Ref = useRef(null)

  const verb = questions[engine.currentQ]

  useEffect(() => {
    if (!verb || engine.isFinished) return
    setCardStatus(null)
    setFeedbackMsg(null)
    setInputStatuses({})
    v1Ref.current?.focus()
  }, [engine.currentQ, verb, engine.isFinished])

  if (engine.isFinished) {
    return <ResultsScreen correct={engine.roundCorrect} wrong={engine.roundWrong}
      bestStreak={engine.bestStreak} mistakes={engine.mistakes}
      onReplay={() => window.location.reload()} backTo="/irregular-verbs" />
  }
  if (!verb) return null

  const doCheck = () => {
    if (engine.answered) return
    let allCorrect = true
    const statuses = {}

    const checks = [
      { ref: v1Ref, key: 'v1', correct: verb.v1 },
      { ref: v2Ref, key: 'v2', correct: verb.v2 },
      { ref: v3Ref, key: 'v3', correct: verb.v3 },
    ]

    for (const c of checks) {
      const val = c.ref.current?.value || ''
      if (checkAnswer(val, c.correct)) {
        statuses[c.key] = 'correct'
      } else {
        statuses[c.key] = 'wrong'
        allCorrect = false
      }
    }

    setInputStatuses(statuses)

    if (allCorrect) {
      const bonus = engine.streak + 1 >= 5 ? 3 : engine.streak + 1 >= 3 ? 2 : 1
      const points = 10 * bonus
      setLocalScore(s => s + points)
      addScore(points, 'irregularVerbs', true)
      setCardStatus('correct')
      const streakMsg = engine.streak + 1 >= 3 ? ` (серия ${engine.streak + 1} — x${bonus}!)` : ''
      setFeedbackMsg({ type: 'ok', text: `Правильно! +${points}${streakMsg}` })
    } else {
      addScore(0, 'irregularVerbs', false)
      setCardStatus('wrong')
      setFeedbackMsg({ type: 'fail', text: `Неправильно! ${verb.v1} — ${verb.v2} — ${verb.v3}` })
    }

    engine.registerAnswer(allCorrect, allCorrect ? null : verb)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') doCheck()
  }

  const getInputClass = (key) => {
    if (!inputStatuses[key]) return ''
    return inputStatuses[key] === 'correct' ? 'correct-input' : 'wrong-input'
  }

  return (
    <>
      <StatsBar score={localScore} streak={engine.streak} />
      <GameTopBar backTo="/irregular-verbs" progress={engine.progress}
        current={engine.currentQ + 1} total={engine.totalQ} />
      <QuestionCard status={cardStatus}>
        <div className="verb-display">
          <div className="translation" style={{ fontSize: '1.1rem', marginBottom: 4 }}>{verb.tr}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Впишите все три формы глагола</div>
        </div>
        {engine.answered && (
          <div className="verb-display" style={{ marginTop: 10 }}>
            <div className="forms">
              <div className="verb-form"><div className="label">V1</div><div className="value">{verb.v1}</div></div>
              <div className="verb-form"><div className="label">V2</div><div className="value">{verb.v2}</div></div>
              <div className="verb-form"><div className="label">V3</div><div className="value">{verb.v3}</div></div>
            </div>
          </div>
        )}
        <div className="input-area" style={{ flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: 4 }}>V1</div>
              <input ref={v1Ref} type="text" placeholder="Base form" style={{ width: 150 }}
                className={getInputClass('v1')} disabled={engine.answered} onKeyDown={handleKeyDown} autoComplete="off" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: 4 }}>V2</div>
              <input ref={v2Ref} type="text" placeholder="Past Simple" style={{ width: 150 }}
                className={getInputClass('v2')} disabled={engine.answered} onKeyDown={handleKeyDown} autoComplete="off" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: 4 }}>V3</div>
              <input ref={v3Ref} type="text" placeholder="Past Participle" style={{ width: 150 }}
                className={getInputClass('v3')} disabled={engine.answered} onKeyDown={handleKeyDown} autoComplete="off" />
            </div>
          </div>
          <button className="btn-submit" onClick={doCheck} disabled={engine.answered}>Проверить</button>
        </div>
      </QuestionCard>
      <div className="feedback">
        {feedbackMsg && <div className={`msg ${feedbackMsg.type}`}>{feedbackMsg.text}</div>}
        {engine.answered && (
          <button className="btn-next" onClick={engine.nextQuestion}>Дальше &rarr;</button>
        )}
      </div>
    </>
  )
}
