import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./LinkButton.module.scss";

type LinkButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function LinkButton({ children, className, type = "button", ...props }: LinkButtonProps) {
  const classes = [styles.button, className ?? ""].filter(Boolean).join(" ");

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
