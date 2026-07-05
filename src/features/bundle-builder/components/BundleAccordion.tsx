import { Button } from "../../../components/ui/Button";
import { catalog, productsById } from "../data/catalog";
import { useBundleBuilder } from "../hooks/useBundleBuilder";
import { ProductCard } from "./ProductCard";
import { StepIcon } from "./StepIcon";
import styles from "./BundleAccordion.module.scss";

export function BundleAccordion() {
  const { goToNextStep, selectedCountForStep, setActiveStep, state } = useBundleBuilder();

  return (
    <div className={styles.accordion}>
      {catalog.steps.map((step) => {
        const isOpen = state.activeStepId === step.id;
        const selectedCount = selectedCountForStep(step.id);
        const countLabel = `${selectedCount} selected`;

        return (
          <section className={styles.step} key={step.id}>
            <button
              aria-controls={`${step.id}-panel`}
              aria-expanded={isOpen}
              className={styles.trigger}
              onClick={() => setActiveStep(step.id)}
              type="button"
            >
              <StepIcon name={step.icon} />
              <span className={styles.heading}>
                <span>{step.eyebrow}</span>
                <strong>{step.title}</strong>
              </span>
              <span className={styles.count}>{countLabel}</span>
              <span aria-hidden="true" className={styles.chevron}>
                {isOpen ? "^" : "v"}
              </span>
            </button>

            {isOpen ? (
              <div className={styles.panel} id={`${step.id}-panel`}>
                <div className={styles.products}>
                  {step.productIds.map((productId) => {
                    const product = productsById[productId];

                    return product ? <ProductCard key={product.id} product={product} /> : null;
                  })}
                </div>
                <div className={styles.actions}>
                  <Button onClick={() => goToNextStep(step.id)} variant="secondary">
                    Next
                  </Button>
                </div>
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
