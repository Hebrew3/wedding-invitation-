import React, { useMemo, useState } from 'react'

const STATEMENTS = [
  'I made the first move.',
  'I wake up earlier.',
  'I said "I love you" first.',
  'I am the better cook.',
  'I am more organized.',
  'I am more adventurous.',
  'I spend more time on social media.',
  'I am more likely to get lost while driving.',
  'I planned the first date.',
]

function storageGet(key) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function storageSet(key, value) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // ignore
  }
}

export default function Quiz() {
  const [answers, setAnswers] = useState(() => {
    const initial = {}
    STATEMENTS.forEach((_, idx) => {
      const k = `q${idx + 1}`
      initial[k] = storageGet(k) || null
    })
    return initial
  })

  const localTotals = useMemo(() => {
    let bride = 0
    let groom = 0
    let answered = 0
    Object.values(answers).forEach((v) => {
      if (v === 'bride') bride += 1
      if (v === 'groom') groom += 1
      if (v) answered += 1
    })
    return { bride, groom, answered }
  }, [answers])

  function handleSelect(index, choice) {
    const key = `q${index + 1}`
    if (answers[key]) return // already locked on this device
    storageSet(key, choice)
    setAnswers((prev) => ({ ...prev, [key]: choice }))
  }

  return (
    <section className="quiz-section" aria-labelledby="quiz-title">
      <div className="quiz-inner">
        <h2 id="quiz-title">Guess whether the bride or groom made each statement</h2>

        <div className="quiz-controls">
          <div className="quiz-totals" aria-live="polite">
            <span className="quiz-total">Bride: {localTotals.bride}</span>
            <span className="quiz-total">Groom: {localTotals.groom}</span>
            <span className="quiz-total">Answered: {localTotals.answered}</span>
          </div>
        </div>

        <table className="quiz-table" role="grid" aria-describedby="quiz-instructions">
          <caption id="quiz-instructions" className="visually-hidden">
            Select one option per row. Selections are saved to your device and will be locked.
          </caption>
          <thead>
            <tr>
              <th className="quiz-col-statement">Statement</th>
              <th className="quiz-col-choice">Bride</th>
              <th className="quiz-col-choice">Groom</th>
            </tr>
          </thead>
          <tbody>
            {STATEMENTS.map((text, idx) => {
              const key = `q${idx + 1}`
              const val = answers[key]
              const isLocked = !!val
              return (
                <tr key={key} className={`quiz-row ${isLocked ? 'locked' : ''}`} tabIndex={0} aria-live="polite">
                  <td className="quiz-statement">{text}</td>
                  <td className={`quiz-cell ${val === 'bride' ? 'selected' : ''}`}>
                    <label className="quiz-label">
                      <input
                        type="radio"
                        name={key}
                        value="bride"
                        checked={val === 'bride'}
                        disabled={isLocked}
                        onChange={() => handleSelect(idx, 'bride')}
                      />
                    </label>
                  </td>
                  <td className={`quiz-cell ${val === 'groom' ? 'selected' : ''}`}>
                    <label className="quiz-label">
                      <input
                        type="radio"
                        name={key}
                        value="groom"
                        checked={val === 'groom'}
                        disabled={isLocked}
                        onChange={() => handleSelect(idx, 'groom')}
                      />
                    </label>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
 

