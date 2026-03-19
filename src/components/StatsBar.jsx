import { useProgress } from '../context/ProgressContext.jsx'

export default function StatsBar({ score, streak }) {
  const { state, getLevel } = useProgress()
  const displayScore = score !== undefined ? score : state.totalScore
  const displayStreak = streak !== undefined ? streak : 0

  return (
    <div className="stats-bar">
      <div className="stat">
        <div className="stat-value score">{displayScore}</div>
        <div className="stat-label">Очки</div>
      </div>
      <div className="stat">
        <div className="stat-value streak">{displayStreak}</div>
        <div className="stat-label">Серия</div>
      </div>
      <div className="stat">
        <div className="stat-value level">{getLevel()}</div>
        <div className="stat-label">Уровень</div>
      </div>
    </div>
  )
}
