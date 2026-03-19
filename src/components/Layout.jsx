import { Link } from 'react-router-dom'

export function GameTopBar({ backTo, progress, current, total }) {
  return (
    <div className="game-top-bar">
      <Link to={backTo} className="btn-back">&larr; Меню</Link>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: progress + '%' }} />
      </div>
      <div className="question-counter">{current} / {total}</div>
    </div>
  )
}

export function Header({ title, subtitle }) {
  return (
    <div className="header">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  )
}
