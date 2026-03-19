export default function ChoiceButton({ text, status, disabled, onClick }) {
  let cls = 'choice-btn'
  if (status === 'correct') cls += ' selected-correct'
  else if (status === 'wrong') cls += ' selected-wrong'
  else if (status === 'reveal') cls += ' reveal-correct'

  return (
    <button className={cls} disabled={disabled} onClick={onClick}>
      {text}
    </button>
  )
}
