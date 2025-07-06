import { useState } from 'react'
import './App.css'
import DiceSelectorPanel from './components/DiceSelectorPanel'
import type { DiceSides } from './components/DiceSelectorPanel'

function App() {
  const [selected, setSelected] = useState<Record<DiceSides, boolean>>({} as Record<DiceSides, boolean>)

  const toggle = (sides: DiceSides) => {
    setSelected((prev) => ({
      ...prev,
      [sides]: !prev[sides],
    }))
  }

  const handleRoll = () => {
    const chosen = Object.entries(selected)
      .filter(([, v]) => v)
      .map(([s]) => s)
    alert(`Rolling: ${chosen.join(', ') || 'none'}`)
    // TODO: replace with actual roll logic and UI later
  }

  return (
    <main style={{ padding: '2rem', maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Mendeleev Dice Simulator</h1>

      <section style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Select Dice</h2>
        <DiceSelectorPanel selected={selected} toggle={toggle} />
      </section>

      <button onClick={handleRoll} style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
        Roll Dice
      </button>
    </main>
  )
}

export default App
