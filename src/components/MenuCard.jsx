import { Link } from 'react-router-dom'

export default function MenuCard({ to, icon, title, description, onClick }) {
  if (onClick) {
    return (
      <div className="menu-card" onClick={onClick}>
        <h3><span className="icon">{icon}</span> {title}</h3>
        <p>{description}</p>
      </div>
    )
  }
  return (
    <Link to={to} className="menu-card">
      <h3><span className="icon">{icon}</span> {title}</h3>
      <p>{description}</p>
    </Link>
  )
}
