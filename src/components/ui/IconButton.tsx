import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./IconButton.module.scss";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  ariaLabel: string;
  children: ReactNode;
};

export function IconButton({ ariaLabel, children, className, type = "button", ...props }: IconButtonProps) {
  const classes = [styles.button, className ?? ""].filter(Boolean).join(" ");

  return (
    <button aria-label={ariaLabel} className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
