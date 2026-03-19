import { forwardRef } from 'react'

const InputField = forwardRef(function InputField({ status, ...props }, ref) {
  let cls = 'game-input'
  if (status === 'correct') cls += ' correct-input'
  else if (status === 'wrong') cls += ' wrong-input'

  return <input ref={ref} className={cls} autoComplete="off" {...props} />
})

export default InputField
