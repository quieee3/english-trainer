import { Link } from 'react-router-dom'
import { Header } from '../../components/Layout.jsx'
import { TENSES } from '../../data/tenseExercises.js'

export default function TensesMenu() {
  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Link to="/" className="btn-back">&larr; Главная</Link>
      </div>
      <Header title="Времена глаголов" subtitle="Выберите время для тренировки" />
      <div className="menu-grid">
        {TENSES.map(t => (
          <div key={t.id} className="menu-card" style={{ padding: 20 }}>
            <h3 style={{ marginBottom: 12 }}>{t.name}</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Link to={`/tenses/${t.id}/fill-blank`} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '8px 14px' }}>
                Заполнить пропуск
              </Link>
              <Link to={`/tenses/${t.id}/choose-tense`} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '8px 14px' }}>
                Выбрать время
              </Link>
              <Link to={`/tenses/${t.id}/transform`} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '8px 14px' }}>
                Трансформация
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
