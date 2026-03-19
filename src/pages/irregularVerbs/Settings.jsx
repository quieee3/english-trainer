import { Link } from 'react-router-dom'
import { useProgress } from '../../context/ProgressContext.jsx'

export default function Settings() {
  const { state, updateSettings, resetStats } = useProgress()
  const { questionCount, level, timerSeconds } = state.settings

  return (
    <>
      <div className="game-top-bar" style={{ marginBottom: 16 }}>
        <Link to="/irregular-verbs" className="btn-back">&larr; Меню</Link>
      </div>
      <div className="setting-group">
        <h3>Игра</h3>
        <div className="setting-row">
          <label>Количество вопросов</label>
          <select value={questionCount} onChange={e => updateSettings('questionCount', parseInt(e.target.value))}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="0">Все глаголы</option>
          </select>
        </div>
        <div className="setting-row">
          <label>Уровень сложности</label>
          <select value={level} onChange={e => updateSettings('level', parseInt(e.target.value))}>
            <option value="1">1 — Базовый</option>
            <option value="2">2 — Средний</option>
            <option value="3">3 — Все глаголы</option>
          </select>
        </div>
        <div className="setting-row">
          <label>Время на вопрос (скоростной)</label>
          <select value={timerSeconds} onChange={e => updateSettings('timerSeconds', parseInt(e.target.value))}>
            <option value="5">5 сек</option>
            <option value="8">8 сек</option>
            <option value="10">10 сек</option>
            <option value="15">15 сек</option>
          </select>
        </div>
      </div>
      <div className="setting-group">
        <h3>Статистика</h3>
        <div className="setting-row">
          <label>Всего правильных ответов: <strong>{state.totalCorrect || 0}</strong></label>
          <button className="btn-back" onClick={resetStats}>Сбросить</button>
        </div>
      </div>
    </>
  )
}
