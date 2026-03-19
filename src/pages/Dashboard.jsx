import { Link } from 'react-router-dom'
import { Header } from '../components/Layout.jsx'
import { useProgress } from '../context/ProgressContext.jsx'

function ProgressRing({ pct, color }) {
  const r = 18
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <svg className="progress-ring" viewBox="0 0 48 48">
      <circle className="bg" cx="24" cy="24" r={r} />
      <circle
        className="fill"
        cx="24" cy="24" r={r}
        stroke={color}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 24 24)"
      />
      <text x="24" y="24" textAnchor="middle" dominantBaseline="central"
        fill="var(--text)" fontSize="11" fontWeight="700">
        {Math.round(pct)}%
      </text>
    </svg>
  )
}

export default function Dashboard() {
  const { state } = useProgress()

  const sections = [
    {
      to: '/irregular-verbs',
      icon: '📝',
      title: 'Неправильные глаголы',
      desc: '100 глаголов, 4 режима тренировки, словарь',
      color: 'var(--accent)',
      data: state.irregularVerbs,
    },
    {
      to: '/tenses',
      icon: '⏰',
      title: 'Времена глаголов',
      desc: '7 времён, 3 типа упражнений',
      color: 'var(--green)',
      data: state.tenses,
    },
    {
      to: '/prepositions',
      icon: '🔤',
      title: 'Предлоги и артикли',
      desc: 'in/on/at, a/an/the — с объяснениями правил',
      color: 'var(--yellow)',
      data: state.prepositions,
    },
  ]

  return (
    <>
      <Header title="English Trainer" subtitle="Платформа изучения английского" />

      <div className="stats-bar">
        <div className="stat">
          <div className="stat-value score">{state.totalScore || 0}</div>
          <div className="stat-label">Очки</div>
        </div>
        <div className="stat">
          <div className="stat-value level">{state.totalCorrect || 0}</div>
          <div className="stat-label">Правильно</div>
        </div>
      </div>

      <div className="dashboard-grid">
        {sections.map(s => {
          const total = s.data?.total || 0
          const correct = s.data?.correct || 0
          const pct = total > 0 ? (correct / total) * 100 : 0

          return (
            <Link key={s.to} to={s.to} className="dashboard-card">
              <h2><span className="icon">{s.icon}</span> {s.title}</h2>
              <div className="desc">{s.desc}</div>
              <div className="progress-info">
                <ProgressRing pct={pct} color={s.color} />
                <span className="progress-text">
                  {total > 0
                    ? `${correct} из ${total} правильно`
                    : 'Начните тренировку'}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
