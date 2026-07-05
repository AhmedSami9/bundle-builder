import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/ui/Card";
import { Price } from "../../../components/ui/Price";
import { QuantityStepper } from "../../../components/ui/QuantityStepper";
import { Thumbnail } from "../../../components/ui/Thumbnail";
import { VariantSelector } from "../../../components/ui/VariantSelector";
import { useBundleBuilder } from "../hooks/useBundleBuilder";
import type { BundleProduct } from "../types/bundle";
import {
  getActiveVariant,
  getProductPrice,
  getQuantityForSelection,
} from "../utils/bundleSelectors";
import styles from "./ProductCard.module.scss";

export function ProductCard({ product }: { product: BundleProduct }) {
  const { selectVariant, setQuantity, state } = useBundleBuilder();
  const activeVariant = getActiveVariant(product, state);
  const variantId = activeVariant?.id;
  const quantity = getQuantityForSelection(state, product.id, variantId);
  const price = getProductPrice(product, activeVariant);
  const image = activeVariant?.image ?? product.image;
  const maxQuantity = product.maxQuantity ?? 10;

  return (
    <Card selected={quantity > 0}>
      <article className={styles.card}>
        <div className={styles.media}>
          {product.badge ? <Badge>{product.badge}</Badge> : null}
          <Thumbnail alt={product.title} size="lg" src={image} />
        </div>
        <div className={styles.body}>
          <div className={styles.copy}>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <a href={product.learnMoreUrl}>Learn More</a>
          </div>

          {product.variants ? (
            <VariantSelector
              activeVariantId={variantId ?? product.variants[0].id}
              label="Color"
              onChange={(nextVariantId) => selectVariant(product.id, nextVariantId)}
              variants={product.variants}
            />
          ) : null}

          <div className={styles.purchaseRow}>
            <Price compareAtCents={price.compareAtCents} priceCents={price.priceCents} />
            <QuantityStepper
              label={`${product.title}${activeVariant ? ` ${activeVariant.label}` : ""}`}
              max={maxQuantity}
              onChange={(nextQuantity) => setQuantity(product.id, variantId, nextQuantity)}
              value={quantity}
            />
          </div>
        </div>
      </article>
    </Card>
  );
}
