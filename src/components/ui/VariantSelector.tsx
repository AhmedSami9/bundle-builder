import type { ProductVariant } from "../../features/bundle-builder/types/bundle";
import styles from "./VariantSelector.module.scss";

type VariantSelectorProps = {
  activeVariantId: string;
  label: string;
  variants: ProductVariant[];
  onChange: (variantId: string) => void;
};

export function VariantSelector({ activeVariantId, label, onChange, variants }: VariantSelectorProps) {
  return (
    <fieldset className={styles.selector}>
      <legend>{label}</legend>
      <div className={styles.options}>
        {variants.map((variant) => (
          <button
            aria-pressed={activeVariantId === variant.id}
            className={activeVariantId === variant.id ? styles.active : undefined}
            key={variant.id}
            onClick={() => onChange(variant.id)}
            type="button"
          >
            <span className={[styles.swatch, styles[variant.swatchTone]].join(" ")} />
            <span>{variant.label}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
