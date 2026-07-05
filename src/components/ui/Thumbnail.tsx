import styles from "./Thumbnail.module.scss";

type ThumbnailProps = {
  alt: string;
  src: string;
  size?: "sm" | "md" | "lg";
};

export function Thumbnail({ alt, size = "md", src }: ThumbnailProps) {
  return (
    <span className={[styles.thumbnail, styles[size]].join(" ")}>
      <img alt={alt} src={src} />
    </span>
  );
}
