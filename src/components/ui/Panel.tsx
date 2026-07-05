import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Panel.module.scss";

type PanelProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export function Panel({ children, className, ...props }: PanelProps) {
  const classes = [styles.panel, className ?? ""].filter(Boolean).join(" ");

  return (
    <section className={classes} {...props}>
      {children}
    </section>
  );
}
