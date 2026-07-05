import type { ReactNode } from "react";
import styles from "./Toast.module.scss";

type ToastTone = "success" | "info";

type ToastProps = {
  children: ReactNode;
  tone?: ToastTone;
  title: string;
  onDismiss?: () => void;
};

export function Toast({ children, onDismiss, title, tone = "success" }: ToastProps) {
  return (
    <div className={[styles.toast, styles[tone]].join(" ")} role="status">
      <span className={styles.marker} aria-hidden="true" />
      <div className={styles.copy}>
        <strong>{title}</strong>
        <span>{children}</span>
      </div>
      {onDismiss ? (
        <button aria-label="Dismiss notification" onClick={onDismiss} type="button">
          x
        </button>
      ) : null}
    </div>
  );
}
