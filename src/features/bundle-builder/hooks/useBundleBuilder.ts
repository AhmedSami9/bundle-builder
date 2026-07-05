import { useContext } from "react";
import { BundleBuilderContext } from "../store/bundleBuilderContext";

export function useBundleBuilder() {
  const context = useContext(BundleBuilderContext);

  if (!context) {
    throw new Error("useBundleBuilder must be used within BundleBuilderProvider");
  }

  return context;
}
