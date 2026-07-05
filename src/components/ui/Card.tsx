import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Card.module.scss";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  selected?: boolean;
};

export function Card({ children, className, selected = false, ...props }: CardProps) {
  const classes = [styles.card, selected ? styles.selected : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
