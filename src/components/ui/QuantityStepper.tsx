import styles from "./QuantityStepper.module.scss";

type QuantityStepperProps = {
  value: number;
  min?: number;
  max?: number;
  label: string;
  onChange: (value: number) => void;
};

export function QuantityStepper({
  label,
  max = 99,
  min = 0,
  onChange,
  value,
}: QuantityStepperProps) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  return (
    <div aria-label={label} className={styles.stepper} role="group">
      <button
        aria-label={`Decrease ${label}`}
        disabled={value <= min}
        onClick={decrement}
        type="button"
      >
        -
      </button>
      <output aria-live="polite">{value}</output>
      <button
        aria-label={`Increase ${label}`}
        disabled={value >= max}
        onClick={increment}
        type="button"
      >
        +
      </button>
    </div>
  );
}
