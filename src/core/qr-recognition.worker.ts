import jsQR from 'jsqr';

const ctx = self as unknown as Worker;

function decodeQR(data: ImageData) {
  const decoded = jsQR(data.data, data.width, data.height, {
    inversionAttempts: 'dontInvert',
  });
  ctx.postMessage(decoded);
}

ctx.addEventListener('message', (e) => {
  decodeQR(e.data);
});
