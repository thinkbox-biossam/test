import React from 'react';

const diceOptions = [
  { label: 'd4', sides: 4 },
  { label: 'd6', sides: 6 },
  { label: 'd8', sides: 8 },
  { label: 'd10', sides: 10 },
  { label: 'd12', sides: 12 },
  { label: 'd20', sides: 20 },
  { label: 'd100', sides: 100 },
] as const;

export type DiceSides = typeof diceOptions[number]['sides'];

interface DiceSelectorPanelProps {
  selected: Record<DiceSides, boolean>;
  toggle: (sides: DiceSides) => void;
}

const DiceSelectorPanel: React.FC<DiceSelectorPanelProps> = ({ selected, toggle }) => {
  return (
    <div className="dice-selector-panel">
      {diceOptions.map(({ label, sides }) => (
        <label key={sides} style={{ marginRight: '1rem' }}>
          <input
            type="checkbox"
            checked={!!selected[sides]}
            onChange={() => toggle(sides)}
            style={{ marginRight: '0.25rem' }}
          />
          {label}
        </label>
      ))}
    </div>
  );
};

export default DiceSelectorPanel;