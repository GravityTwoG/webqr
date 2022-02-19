export const isMediaStreamAPISupported = (): boolean => {
  return (
    navigator &&
    navigator.mediaDevices &&
    'enumerateDevices' in navigator.mediaDevices &&
    'getUserMedia' in navigator.mediaDevices
  );
};

export const enumerateDevices = (): Promise<MediaDeviceInfo[]> =>
  navigator.mediaDevices.enumerateDevices();

export type FacingMode = 'environment' | 'user';

export const getCameraStream = (
  deviceId: string,
  facingMode: FacingMode = 'environment'
): Promise<MediaStream> => {
  // Use facingMode: environment to attemt to get the front camera on phones
  return navigator.mediaDevices.getUserMedia({
    video: {
      deviceId,
      facingMode,
      width: { ideal: 1920 },
      height: { ideal: 1920 },
      aspectRatio: { ideal: 1 },
    },
  });
};
