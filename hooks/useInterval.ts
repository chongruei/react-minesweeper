import { useEffect, useRef } from "react";
import { Callback } from "@interface/common";

export const useInterval = (callback: Callback, delay: number | null) => {
  const callbackRef = useRef<Callback>(callback);

  // save the callback function instance
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    // no setInterval if delay is null or delay is equals to 0
    if (!delay) {
      return;
    }

    const interval = setInterval(() => callbackRef.current(), delay);
    return () => clearInterval(interval);
  }, [delay]);
};
