"use client";

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function useHover() {
  const [hover, setHover] = useState<boolean>(false);

  const showHover = useDebouncedCallback(() => {
    setHover(true);
  }, 300);

  const hideHover = () => {
    showHover.cancel();
    setHover(false);
  };

  return { showHover, hideHover, hover };
}
