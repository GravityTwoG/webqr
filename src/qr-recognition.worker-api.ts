/* eslint-disable-next-line */
// @ts-nocheck
import QrWorker from 'worker-loader!./qr-recognition.worker';
// @ts-check
import { QRCode } from 'jsqr';

let worker: Worker | null = null;

export function createWorker(): void {
  worker = new QrWorker() as Worker;
}
export function destroyWorker(): void {
  worker?.terminate();
}

export function sendMessage(msg: ImageData): void {
  worker?.postMessage(msg);
}

export function registerMessageListener(
  callback: (e: null | QRCode) => void
): void {
  if (worker) {
    worker.onmessage = (e) => callback(e.data);
  }
}
