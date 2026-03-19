export default function TimerBar({ timeLeft, pct }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Время</span>
        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--yellow)' }}>
          {Math.ceil(timeLeft)}s
        </span>
      </div>
      <div className="progress-bar" style={{ height: 6 }}>
        <div
          className="progress-fill"
          style={{
            background: 'linear-gradient(90deg, var(--red), var(--yellow))',
            width: pct + '%',
          }}
        />
      </div>
    </div>
  )
}
