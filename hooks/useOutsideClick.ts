import { useEffect, useRef } from "react";

export const useOutsideClick = (callback: () => void) => {
  const ref: React.MutableRefObject<any> = useRef(null);

  const handleClick = (e: MouseEvent | TouchEvent) => {
    if (ref.current && !ref.current.contains(e.target)) callback();
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  });

  return { ref };
};
