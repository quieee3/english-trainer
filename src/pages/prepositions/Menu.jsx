import { Link } from 'react-router-dom'
import { Header } from '../../components/Layout.jsx'
import MenuCard from '../../components/MenuCard.jsx'

export default function PrepositionsMenu() {
  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Link to="/" className="btn-back">&larr; Главная</Link>
      </div>
      <Header title="Предлоги и артикли" subtitle="Тренировка предлогов и артиклей" />
      <div className="menu-grid">
        <MenuCard to="/prepositions/prepositions-time" icon="🕐" title="Предлоги времени"
          description="in / on / at — когда что использовать с временными выражениями" />
        <MenuCard to="/prepositions/prepositions-place" icon="📍" title="Предлоги места"
          description="in / on / at — когда что использовать с местоположением" />
        <MenuCard to="/prepositions/articles" icon="📄" title="Артикли"
          description="a / an / the / — (без артикля) — правила употребления" />
      </div>
    </>
  )
}
