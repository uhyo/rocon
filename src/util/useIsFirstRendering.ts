import { useRef } from "react";

/**
 * Returns whether this is the first rendering.
 */
export const useIsFirstRendering = (): boolean => {
  const ref = useRef(true);
  const result = ref.current;
  ref.current = false;
  return result;
};
