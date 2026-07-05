import type { StepIconName } from "../types/bundle";
import styles from "./StepIcon.module.scss";

const iconPaths: Record<StepIconName, string> = {
  camera: "M7 9h3l1.2-2h5.6L18 9h3v10H7V9Zm7 7.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z",
  shield: "M14 4 22 7v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V7l8-3Zm0 4v10",
  sensor: "M8 8h12v12H8V8Zm3 3h6v6h-6v-6ZM5 11H3m2 6H3m22-6h-2m2 6h-2",
  spark: "M14 3l1.6 6.1L22 11l-6.4 1.9L14 19l-1.6-6.1L6 11l6.4-1.9L14 3Zm-7 14 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z",
};

export function StepIcon({ name }: { name: StepIconName }) {
  return (
    <span className={styles.icon}>
      <svg aria-hidden="true" focusable="false" viewBox="0 0 28 28">
        <path d={iconPaths[name]} />
      </svg>
    </span>
  );
}
