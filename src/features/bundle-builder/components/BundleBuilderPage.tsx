import { BundleBuilderProvider } from "../store/BundleBuilderProvider";
import { BundleAccordion } from "./BundleAccordion";
import { ReviewPanel } from "./ReviewPanel";
import styles from "./BundleBuilderPage.module.scss";

function BundleBuilderContent() {
  return (
    <main className={styles.page}>
      <section className={styles.intro}>
        <p>Security system builder</p>
        <h1>Build a system that fits your home.</h1>
        <span>Start with cameras, add monitoring and sensors, then review every choice live.</span>
      </section>

      <div className={styles.layout}>
        <BundleAccordion />
        <ReviewPanel />
      </div>
    </main>
  );
}

export function BundleBuilderPage() {
  return (
    <BundleBuilderProvider>
      <BundleBuilderContent />
    </BundleBuilderProvider>
  );
}
