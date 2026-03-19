import { useState, useMemo, useEffect, useRef } from 'react'
import { GameTopBar } from '../../components/Layout.jsx'
import StatsBar from '../../components/StatsBar.jsx'
import QuestionCard from '../../components/QuestionCard.jsx'
import ChoiceButton from '../../components/ChoiceButton.jsx'
import TimerBar from '../../components/TimerBar.jsx'
import ResultsScreen from '../../components/ResultsScreen.jsx'
import useGameEngine from '../../hooks/useGameEngine.js'
import useTimer from '../../hooks/useTimer.js'
import { useProgress } from '../../context/ProgressContext.jsx'
import { getVerbPool, shuffle } from '../../data/irregularVerbs.js'

export default function SpeedMode() {
  const { state: pState, addScore } = useProgress()
  const { questionCount, level, timerSeconds } = pState.settings

  const pool = useMemo(() => getVerbPool(level), [level])
  const questions = useMemo(() => {
    const count = questionCount === 0 ? pool.length : Math.min(questionCount, pool.length)
    return shuffle(pool).slice(0, count)
  }, [questionCount, pool])

  const engine = useGameEngine({ questions })
  const [localScore, setLocalScore] = useState(0)
  const [cardStatus, setCardStatus] = useState(null)
  const [feedbackMsg, setFeedbackMsg] = useState(null)
  const [askV3, setAskV3] = useState(false)
  const [options, setOptions] = useState([])
  const [btnStatuses, setBtnStatuses] = useState({})
  const autoAdvRef = useRef(null)

  const verb = questions[engine.currentQ]
  const answeredRef = useRef(engine.answered)
  answeredRef.current = engine.answered

  const handleTimeUp = () => {
    if (answeredRef.current) return
    const v = questions[engine.currentQ]
    if (!v) return
    setBtnStatuses(prev => ({ ...prev, [v.v2]: 'reveal', [v.v3]: 'reveal' }))
    addScore(0, 'irregularVerbs', false)
    setCardStatus('wrong')
    setFeedbackMsg({ type: 'fail', text: `Время вышло! ${v.v1} — ${v.v2} — ${v.v3}` })
    engine.registerAnswer(false, v)
  }

  const timer = useTimer(timerSeconds, handleTimeUp)

  useEffect(() => {
    if (!verb || engine.isFinished) return
    const v3 = Math.random() > 0.5
    setAskV3(v3)
    const correctAnswer = v3 ? verb.v3 : verb.v2
    const wrongVerbs = shuffle(pool.filter(v => v.v1 !== verb.v1)).slice(0, 3)
    const wrongAnswers = wrongVerbs.map(v => v3 ? v.v3 : v.v2)
    setOptions(shuffle([correctAnswer, ...wrongAnswers]))
    setCardStatus(null)
    setFeedbackMsg(null)
    setBtnStatuses({})
    timer.start()
    return () => { timer.stop(); if (autoAdvRef.current) clearTimeout(autoAdvRef.current) }
  }, [engine.currentQ, engine.isFinished])

  if (engine.isFinished) {
    return <ResultsScreen correct={engine.roundCorrect} wrong={engine.roundWrong}
      bestStreak={engine.bestStreak} mistakes={engine.mistakes}
      onReplay={() => window.location.reload()} backTo="/irregular-verbs" />
  }
  if (!verb) return null

  const correctAnswer = askV3 ? verb.v3 : verb.v2
  const formLabel = askV3 ? 'Past Participle (V3)' : 'Past Simple (V2)'

  const handleChoice = (opt) => {
    if (engine.answered) return
    timer.stop()
    const isCorrect = opt === correctAnswer
    const statuses = {}
    if (isCorrect) {
      statuses[opt] = 'correct'
    } else {
      statuses[opt] = 'wrong'
      statuses[correctAnswer] = 'reveal'
    }
    setBtnStatuses(statuses)

    if (isCorrect) {
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
    engine.registerAnswer(isCorrect, isCorrect ? null : verb)

    autoAdvRef.current = setTimeout(() => {
      engine.nextQuestion()
    }, 1500)
  }

  return (
    <>
      <StatsBar score={localScore} streak={engine.streak} />
      <GameTopBar backTo="/irregular-verbs" progress={engine.progress}
        current={engine.currentQ + 1} total={engine.totalQ} />
      <TimerBar timeLeft={timer.timeLeft} pct={timer.pct} />
      <QuestionCard status={cardStatus}>
        <div className="verb-display">
          <div className="translation">{verb.tr}</div>
          <div className="forms">
            <div className="verb-form"><div className="label">V1</div><div className="value">{verb.v1}</div></div>
          </div>
          <div style={{ marginTop: 14, fontSize: '0.85rem', color: 'var(--text-dim)' }}>
            Выберите <strong style={{ color: 'var(--text)' }}>{formLabel}</strong>
          </div>
        </div>
        <div className="choices">
          {options.map(opt => (
            <ChoiceButton key={opt} text={opt}
              status={btnStatuses[opt]} disabled={engine.answered}
              onClick={() => handleChoice(opt)} />
          ))}
        </div>
      </QuestionCard>
      <div className="feedback">
        {feedbackMsg && <div className={`msg ${feedbackMsg.type}`}>{feedbackMsg.text}</div>}
      </div>
    </>
  )
}
