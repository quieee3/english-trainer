import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { VERBS } from '../../data/irregularVerbs.js'

export default function Dictionary() {
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('all')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return VERBS.filter(v => {
      if (level !== 'all' && v.lv > parseInt(level)) return false
      if (q) {
        const hay = `${v.v1} ${v.v2} ${v.v3} ${v.tr}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [search, level])

  return (
    <>
      <div className="game-top-bar" style={{ marginBottom: 16 }}>
        <Link to="/irregular-verbs" className="btn-back">&larr; Меню</Link>
      </div>
      <div className="dict-controls">
        <input type="text" placeholder="Поиск..." value={search}
          onChange={e => setSearch(e.target.value)} />
        <select value={level} onChange={e => setLevel(e.target.value)}>
          <option value="all">Все уровни</option>
          <option value="1">Уровень 1 — Базовый</option>
          <option value="2">Уровень 2 — Средний</option>
          <option value="3">Уровень 3 — Продвинутый</option>
        </select>
      </div>
      <div style={{ overflowX: 'auto', borderRadius: 'var(--radius)' }}>
        <table className="dict-table">
          <thead>
            <tr><th>V1 (Base)</th><th>V2 (Past)</th><th>V3 (P. Part.)</th><th>Перевод</th></tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.map(v => (
              <tr key={v.v1}>
                <td>{v.v1}</td><td>{v.v2}</td><td>{v.v3}</td>
                <td className="transl">{v.tr}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-dim)', padding: 20 }}>
                  Ничего не найдено
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
