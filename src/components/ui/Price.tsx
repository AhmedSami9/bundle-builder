import { formatCurrency } from "../../features/bundle-builder/utils/money";
import styles from "./Price.module.scss";

type PriceProps = {
  priceCents: number;
  compareAtCents?: number;
  align?: "start" | "end";
};

export function Price({ align = "start", compareAtCents, priceCents }: PriceProps) {
  const hasSavings = Boolean(compareAtCents && compareAtCents > priceCents);

  return (
    <span className={[styles.price, styles[align]].join(" ")}>
      {hasSavings ? <s>{formatCurrency(compareAtCents ?? 0)}</s> : null}
      <strong>{formatCurrency(priceCents)}</strong>
    </span>
  );
}
