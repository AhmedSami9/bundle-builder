import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Divider } from "../../../components/ui/Divider";
import { LinkButton } from "../../../components/ui/LinkButton";
import { Panel } from "../../../components/ui/Panel";
import { QuantityStepper } from "../../../components/ui/QuantityStepper";
import { Thumbnail } from "../../../components/ui/Thumbnail";
import { Toast } from "../../../components/ui/Toast";
import { catalog } from "../data/catalog";
import { useBundleBuilder } from "../hooks/useBundleBuilder";
import type { ReviewItem } from "../types/bundle";
import { formatCurrency, formatMonthlyCurrency } from "../utils/money";
import styles from "./ReviewPanel.module.scss";

function ReviewLine({ item }: { item: ReviewItem }) {
  const { setQuantity } = useBundleBuilder();
  const lineTotal = item.priceCents * item.quantity;

  return (
    <li className={styles.reviewLine}>
      <Thumbnail alt={item.name} size="sm" src={item.image} />
      <div className={styles.itemCopy}>
        <strong>{item.name}</strong>
        {item.variantLabel ? <span>{item.variantLabel}</span> : null}
      </div>
      <QuantityStepper
        label={`${item.name}${item.variantLabel ? ` ${item.variantLabel}` : ""}`}
        max={item.maxQuantity}
        onChange={(quantity) => setQuantity(item.productId, item.variantId, quantity)}
        value={item.quantity}
      />
      <span className={styles.linePrice}>{formatCurrency(lineTotal)}</span>
    </li>
  );
}

export function ReviewPanel() {
  const { pricing, reviewItems, saveConfiguration, state } = useBundleBuilder();
  const [toast, setToast] = useState<
    | {
        message: string;
        title: string;
        tone: "success" | "info";
      }
    | undefined
  >();

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToast(undefined), 4500);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const handleCheckout = () => {
    setToast({
      title: "System ready",
      message: "Your security bundle is ready for checkout.",
      tone: "success",
    });
  };

  const handleSave = () => {
    saveConfiguration();
    setToast({
      title: "Saved for later",
      message: "Your current devices, plan, and variant quantities are stored.",
      tone: "info",
    });
  };

  return (
    <Panel className={styles.panel} aria-label="Your security system">
      <div className={styles.header}>
        <span>Live review</span>
        <h2>Your security system</h2>
      </div>

      <div className={styles.groups}>
        {catalog.reviewGroups.map((group) => {
          const groupItems = reviewItems.filter((item) => item.category === group.id);

          if (groupItems.length === 0) {
            return null;
          }

          return (
            <section className={styles.group} key={group.id}>
              <h3>{group.title}</h3>
              <ul>
                {groupItems.map((item) => (
                  <ReviewLine item={item} key={item.key} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <Divider />

      <div className={styles.rows}>
        <div>
          <span>Shipping</span>
          <strong>{pricing.shippingCents === 0 ? "Free" : formatCurrency(pricing.shippingCents)}</strong>
        </div>
        <div className={styles.guarantee}>
          <span aria-hidden="true">✓</span>
          <strong>60-day satisfaction guarantee</strong>
        </div>
        <p>
          Financing available from {formatMonthlyCurrency(pricing.financingMonthlyCents)}/mo with
          0% APR.
        </p>
      </div>

      <Divider />

      <div className={styles.totalBlock}>
        <div className={styles.totalRow}>
          <span>Total</span>
          <div>
            {pricing.savingsCents > 0 ? <s>{formatCurrency(pricing.compareAtTotalCents)}</s> : null}
            <strong>{formatCurrency(pricing.totalCents)}</strong>
          </div>
        </div>
        {pricing.savingsCents > 0 ? (
          <p className={styles.savings}>You save {formatCurrency(pricing.savingsCents)} today.</p>
        ) : null}
      </div>

      <div className={styles.checkoutActions}>
        <Button fullWidth onClick={handleCheckout}>
          Checkout
        </Button>
        <LinkButton onClick={handleSave}>Save my system for later</LinkButton>
        {state.savedAt ? (
          <p className={styles.saved}>Saved {new Date(state.savedAt).toLocaleString()}.</p>
        ) : null}
      </div>

      {toast ? (
        <div className={styles.toastRegion}>
          <Toast onDismiss={() => setToast(undefined)} title={toast.title} tone={toast.tone}>
            {toast.message}
          </Toast>
        </div>
      ) : null}
    </Panel>
  );
}
