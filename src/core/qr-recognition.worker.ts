import jsQR from 'jsqr';

const ctx = self as unknown as Worker;

function decodeQR(data: ImageData) {
  const decoded = jsQR(data.data, data.width, data.height, {
    inversionAttempts: 'dontInvert',
  });
  if (decoded) {
    ctx.postMessage(decoded);
  } else {
    ctx.postMessage(null);
  }
}

ctx.addEventListener('message', (e) => {
  decodeQR(e.data);
});
