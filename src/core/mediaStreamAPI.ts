export const isMediaStreamAPISupported = (): boolean => {
  return (
    'enumerateDevices' in navigator?.mediaDevices &&
    'getUserMedia' in navigator?.mediaDevices
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
  const aspectRatio =
    options.aspectRatio ?? options.idealWidth / options.idealHeight;
  // Use facingMode: environment to attemt to get the rear camera on phones
  return navigator.mediaDevices.getUserMedia({
    video: {
      deviceId: options.deviceId,
      facingMode: options.facingMode ?? 'environment',
      width: { max: options.idealWidth },
      height: { max: options.idealHeight },
      aspectRatio: {
        ideal: aspectRatio,
        max: aspectRatio,
      },
    },
  });
};
