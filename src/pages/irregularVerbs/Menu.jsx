import { Header } from '../../components/Layout.jsx'
import MenuCard from '../../components/MenuCard.jsx'
import { Link } from 'react-router-dom'

export default function IrregularMenu() {
  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Link to="/" className="btn-back">&larr; Главная</Link>
      </div>
      <Header title="Irregular Verbs" subtitle="Тренажёр неправильных глаголов" />
      <div className="menu-grid">
        <MenuCard to="/irregular-verbs/write" icon="✍️" title="Написать форму"
          description="Вам показывают глагол — впишите недостающие формы (V2, V3)" />
        <MenuCard to="/irregular-verbs/choice" icon="🎯" title="Выбрать ответ"
          description="Выберите правильную форму глагола из четырёх вариантов" />
        <MenuCard to="/irregular-verbs/match" icon="🔗" title="Собрать тройку"
          description="Впишите все три формы глагола по переводу" />
        <MenuCard to="/irregular-verbs/speed" icon="⚡" title="Скоростной режим"
          description="Отвечайте как можно быстрее — время ограничено!" />
        <MenuCard to="/irregular-verbs/dictionary" icon="📖" title="Словарь"
          description="Просмотр всех неправильных глаголов с переводом" />
        <MenuCard to="/irregular-verbs/settings" icon="⚙️" title="Настройки"
          description="Количество вопросов, уровень сложности" />
      </div>
    </>
  )
}
