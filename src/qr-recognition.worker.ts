import jsQR from 'jsqr';

const ctx = self as unknown as Worker;

ctx.addEventListener('message', (e) => {
  const decoded = jsQR(e.data.data, e.data.width, e.data.height, {
    inversionAttempts: 'dontInvert',
  });
  if (decoded) {
    ctx.postMessage(decoded);
  } else {
    ctx.postMessage(null);
  }
});
