let isVibrating = false;

export const vibrate = (duration: number): void => {
  if ('vibrate' in navigator && !isVibrating) {
    navigator.vibrate(duration);
    isVibrating = true;

    setTimeout(() => {
      isVibrating = false;
    }, duration);
  }
};
