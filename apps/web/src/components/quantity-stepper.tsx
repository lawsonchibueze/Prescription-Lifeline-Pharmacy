'use client';

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md';
}

export function QuantityStepper({ value, min = 1, max = 99, onChange, size = 'md' }: QuantityStepperProps) {
  const dims = size === 'sm' ? 'size-8 text-sm' : 'size-11 text-base';

  return (
    <div className="inline-flex items-center overflow-hidden rounded-lg border border-line">
      <button
        type="button"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={`${dims} flex items-center justify-center font-bold text-ink-soft hover:bg-surface-hover disabled:opacity-30`}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className={`${dims} flex items-center justify-center font-bold`}>{value}</span>
      <button
        type="button"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={`${dims} flex items-center justify-center font-bold text-ink-soft hover:bg-surface-hover disabled:opacity-30`}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
