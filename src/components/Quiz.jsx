import React, { useEffect, useState, useMemo } from 'react'

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
  // answers: { q1: 'bride'|'groom'|null, ... }
  const [answers, setAnswers] = useState(() => {
    const initial = {}
    STATEMENTS.forEach((_, idx) => {
      const k = `q${idx + 1}`
      const v = storageGet(k)
      initial[k] = v || null
    })
    return initial
  })

  // locked rows: true if an answer exists
  const locked = {}
  STATEMENTS.forEach((_, idx) => {
    const k = `q${idx + 1}`
    locked[k] = !!answers[k]
  })

  useEffect(() => {
    // ensure state reflects storage on mount (in case of cross-tab changes)
    const fresh = {}
    STATEMENTS.forEach((_, idx) => {
      const k = `q${idx + 1}`
      fresh[k] = storageGet(k) || null
    })
    setAnswers(() => ({ ...fresh }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSelect(index, choice) {
    const key = `q${index + 1}`
    // If already locked, ignore
    if (answers[key]) return
    // Save and lock
    storageSet(key, choice)
    setAnswers((prev) => ({ ...prev, [key]: choice }))
  }

  // Totals: count how many 'bride' and 'groom' selections exist (per device)
  const totals = useMemo(() => {
    let bride = 0
    let groom = 0
    Object.values(answers).forEach((v) => {
      if (v === 'bride') bride += 1
      if (v === 'groom') groom += 1
    })
    return { bride, groom }
  }, [answers])

  return (
    <section className="quiz-section" aria-labelledby="quiz-title">
      <div className="quiz-inner">
        <h2 id="quiz-title">Guess whether the bride or groom made each statement</h2>

        <div className="quiz-controls">
          <div className="quiz-totals" aria-live="polite">
            <span className="quiz-total">Bride: {totals.bride}</span>
            <span className="quiz-total">Groom: {totals.groom}</span>
            <span className="quiz-total">Answered: {Object.values(answers).filter(Boolean).length}</span>
          </div>
        </div>

        <table className="quiz-table" role="grid" aria-describedby="quiz-instructions">
          <caption id="quiz-instructions" className="visually-hidden">Select one option per row. Selections are saved to your device and will be locked.</caption>
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
                <tr
                  key={key}
                  className={`quiz-row ${isLocked ? 'locked' : ''}`}
                  tabIndex={0}
                  aria-live="polite"
                >
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
