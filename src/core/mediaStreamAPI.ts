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

export type CameraStreamOptions = {
  deviceId: string;
  facingMode?: FacingMode;
  idealWidth: number;
  idealHeight: number;
  aspectRatio?: number;
};

export const getCameraStream = (
  options: CameraStreamOptions
): Promise<MediaStream> => {
  // Use facingMode: environment to attemt to get the front camera on phones
  return navigator.mediaDevices.getUserMedia({
    video: {
      deviceId: options.deviceId,
      facingMode: options.facingMode || 'environment',
      width: { ideal: options.idealWidth },
      height: { ideal: options.idealHeight },
      aspectRatio: {
        ideal: options.aspectRatio || options.idealWidth / options.idealHeight,
      },
    },
  });
};
