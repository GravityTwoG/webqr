export function debounce<T>(
  f: (...args: T[]) => unknown,
  delay: number
): typeof f & { cancel: () => void } {
  let timeout: number;

  const debounced = function (...args: T[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => f(...args), delay);
  };

  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = 0;
  };

  return debounced;
}

export function throttle<T>(
  callback: (...args: T[]) => unknown,
  limit: number
): typeof callback {
  let waiting = false;

  return (...args: T[]) => {
    if (!waiting) {
      callback(...args);
      waiting = true; // Prevent future invocations

      setTimeout(function () {
        waiting = false; // allow future invocations after period of time
      }, limit);
    }
  };
}
