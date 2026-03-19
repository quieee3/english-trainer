import { useNavigate } from 'react-router-dom'

export default function ResultsScreen({ correct, wrong, bestStreak, mistakes, onReplay, backTo }) {
  const navigate = useNavigate()
  const total = correct + wrong
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0

  let title, subtitle
  if (pct === 100) {
    title = 'Идеально!'
    subtitle = 'Ни одной ошибки!'
  } else if (pct >= 80) {
    title = 'Отлично!'
    subtitle = 'Почти безупречно'
  } else if (pct >= 50) {
    title = 'Неплохо!'
    subtitle = 'Но есть над чем поработать'
  } else {
    title = 'Нужна практика'
    subtitle = 'Попробуйте ещё раз!'
  }

  return (
    <div className="results-card">
      <h2>{title}</h2>
      <p className="subtitle">{subtitle}</p>
      <div className="results-stats">
        <div className="results-stat">
          <div className="val" style={{ color: 'var(--green)' }}>{correct}</div>
          <div className="lbl">Правильно</div>
        </div>
        <div className="results-stat">
          <div className="val" style={{ color: 'var(--red)' }}>{wrong}</div>
          <div className="lbl">Ошибки</div>
        </div>
        <div className="results-stat">
          <div className="val" style={{ color: 'var(--accent)' }}>{pct}%</div>
          <div className="lbl">Точность</div>
        </div>
        {bestStreak !== undefined && (
          <div className="results-stat">
            <div className="val" style={{ color: 'var(--yellow)' }}>{bestStreak}</div>
            <div className="lbl">Макс. серия</div>
          </div>
        )}
      </div>

      {mistakes && mistakes.length > 0 && (
        <div style={{
          background: 'var(--surface2)', borderRadius: 12, padding: 16,
          marginBottom: 20, textAlign: 'left'
        }}>
          <div style={{
            fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px',
            color: 'var(--text-dim)', marginBottom: 10
          }}>
            Ошибки — повторите:
          </div>
          {mistakes.map((m, i) => (
            <div key={i} style={{ padding: '4px 0', fontSize: '0.9rem' }}>
              {m.text || (m.v1 && <><strong>{m.v1}</strong> — {m.v2} — {m.v3} <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>({m.tr})</span></>)}
            </div>
          ))}
        </div>
      )}

      <div className="results-buttons">
        <button className="btn-primary" onClick={onReplay}>Ещё раз</button>
        <button className="btn-secondary" onClick={() => navigate(backTo || '/')}>Меню</button>
      </div>
    </div>
  )
}
