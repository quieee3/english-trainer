import { useState, useMemo, useRef, useEffect } from 'react'
import { GameTopBar } from '../../components/Layout.jsx'
import StatsBar from '../../components/StatsBar.jsx'
import QuestionCard from '../../components/QuestionCard.jsx'
import ResultsScreen from '../../components/ResultsScreen.jsx'
import useGameEngine from '../../hooks/useGameEngine.js'
import { useProgress } from '../../context/ProgressContext.jsx'
import { getVerbPool, shuffle, checkAnswer } from '../../data/irregularVerbs.js'

export default function WriteMode() {
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
  const [revealed, setRevealed] = useState({})
  const [hideConfig, setHideConfig] = useState(null)
  const inp2Ref = useRef(null)
  const inp3Ref = useRef(null)

  const verb = questions[engine.currentQ]

  useEffect(() => {
    if (!verb || engine.isFinished) return
    const r = Math.random()
    const hv2 = r < 0.4
    const hv3 = r >= 0.4 && r < 0.8
    setHideConfig({ hideV2: hv2 || r >= 0.8, hideV3: hv3 || r >= 0.8 })
    setCardStatus(null)
    setFeedbackMsg(null)
    setInputStatuses({})
    setRevealed({})
  }, [engine.currentQ, verb, engine.isFinished])

  useEffect(() => {
    if (!hideConfig || engine.answered) return
    if (hideConfig.hideV2 && inp2Ref.current) inp2Ref.current.focus()
    else if (hideConfig.hideV3 && inp3Ref.current) inp3Ref.current.focus()
  }, [hideConfig, engine.answered])

  if (engine.isFinished) {
    return <ResultsScreen correct={engine.roundCorrect} wrong={engine.roundWrong}
      bestStreak={engine.bestStreak} mistakes={engine.mistakes}
      onReplay={() => { setLocalScore(0); window.location.reload() }}
      backTo="/irregular-verbs" />
  }

  if (!verb || !hideConfig) return null

  const doCheck = () => {
    if (engine.answered) return
    let allCorrect = true
    const statuses = {}
    const rev = {}

    if (hideConfig.hideV2) {
      const val = inp2Ref.current?.value || ''
      if (checkAnswer(val, verb.v2)) {
        statuses.v2 = 'correct'
        rev.v2 = 'revealed-correct'
      } else {
        statuses.v2 = 'wrong'
        rev.v2 = 'revealed-wrong'
        allCorrect = false
      }
    }
    if (hideConfig.hideV3) {
      const val = inp3Ref.current?.value || ''
      if (checkAnswer(val, verb.v3)) {
        statuses.v3 = 'correct'
        rev.v3 = 'revealed-correct'
      } else {
        statuses.v3 = 'wrong'
        rev.v3 = 'revealed-wrong'
        allCorrect = false
      }
    }

    setInputStatuses(statuses)
    setRevealed(rev)

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

  return (
    <>
      <StatsBar score={localScore} streak={engine.streak} />
      <GameTopBar backTo="/irregular-verbs" progress={engine.progress}
        current={engine.currentQ + 1} total={engine.totalQ} />
      <QuestionCard status={cardStatus}>
        <div className="verb-display">
          <div className="translation">{verb.tr}</div>
          <div className="forms">
            <div className="verb-form">
              <div className="label">V1</div>
              <div className="value">{verb.v1}</div>
            </div>
            <div className="verb-form">
              <div className="label">V2 (Past)</div>
              <div className={`value ${hideConfig.hideV2 ? (revealed.v2 || 'hidden-value') : ''}`}>
                {hideConfig.hideV2 ? (engine.answered ? verb.v2 : '?') : verb.v2}
              </div>
            </div>
            <div className="verb-form">
              <div className="label">V3 (P.P.)</div>
              <div className={`value ${hideConfig.hideV3 ? (revealed.v3 || 'hidden-value') : ''}`}>
                {hideConfig.hideV3 ? (engine.answered ? verb.v3 : '?') : verb.v3}
              </div>
            </div>
          </div>
        </div>
        <div className="input-area">
          {hideConfig.hideV2 && (
            <input ref={inp2Ref} type="text" placeholder="Past Simple"
              className={inputStatuses.v2 ? (inputStatuses.v2 === 'correct' ? 'correct-input' : 'wrong-input') : ''}
              disabled={engine.answered} onKeyDown={handleKeyDown} autoComplete="off" />
          )}
          {hideConfig.hideV3 && (
            <input ref={inp3Ref} type="text" placeholder="Past Participle"
              className={inputStatuses.v3 ? (inputStatuses.v3 === 'correct' ? 'correct-input' : 'wrong-input') : ''}
              disabled={engine.answered} onKeyDown={handleKeyDown} autoComplete="off" />
          )}
          <button className="btn-submit" onClick={doCheck} disabled={engine.answered}>
            Проверить
          </button>
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
