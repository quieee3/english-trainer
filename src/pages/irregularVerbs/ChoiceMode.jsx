import { useState, useMemo, useEffect } from 'react'
import { GameTopBar } from '../../components/Layout.jsx'
import StatsBar from '../../components/StatsBar.jsx'
import QuestionCard from '../../components/QuestionCard.jsx'
import ChoiceButton from '../../components/ChoiceButton.jsx'
import ResultsScreen from '../../components/ResultsScreen.jsx'
import useGameEngine from '../../hooks/useGameEngine.js'
import { useProgress } from '../../context/ProgressContext.jsx'
import { getVerbPool, shuffle } from '../../data/irregularVerbs.js'

export default function ChoiceMode() {
  const { state: pState, addScore } = useProgress()
  const { questionCount, level } = pState.settings

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

  const verb = questions[engine.currentQ]

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
  }, [engine.currentQ, verb, pool, engine.isFinished])

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
  }

  return (
    <>
      <StatsBar score={localScore} streak={engine.streak} />
      <GameTopBar backTo="/irregular-verbs" progress={engine.progress}
        current={engine.currentQ + 1} total={engine.totalQ} />
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
        {engine.answered && (
          <button className="btn-next" onClick={engine.nextQuestion}>Дальше &rarr;</button>
        )}
      </div>
    </>
  )
}
