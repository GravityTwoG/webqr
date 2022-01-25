<template>
  <div class="scanner-container">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import jsQR from 'jsqr';
import { Point } from 'jsqr/dist/locator';

@Options({
  name: 'stream-barcode-reader',

  data() {
    return {
      isLoading: true,
      isMounted: false,
      isMediaStreamAPISupported:
        navigator &&
        navigator.mediaDevices &&
        'enumerateDevices' in navigator.mediaDevices,
    };
  },

  mounted() {
    this.isMounted = true;
    if (!this.isMediaStreamAPISupported) {
      throw new Error('Media Stream API is not supported');
    }

    const video = document.createElement('video');
    const canvasElement = document.getElementById(
      'canvas'
    ) as HTMLCanvasElement;
    const ctx = canvasElement.getContext('2d')!;

    function drawLine(begin: Point, end: Point, color: string) {
      ctx.beginPath();
      ctx.moveTo(begin.x, begin.y);
      ctx.lineTo(end.x, end.y);
      ctx.lineWidth = 4;
      ctx.strokeStyle = color;
      ctx.stroke();
    }

    // Use facingMode: environment to attemt to get the front camera on phones
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        const streamTrack = stream.getTracks()[0];
        this.stopCamera = streamTrack.stop.bind(streamTrack);

        video.srcObject = stream;
        video.setAttribute('playsinline', 'true'); // required to tell iOS safari we don't want fullscreen
        video.play();
        requestAnimationFrame(tick);
      });

    const tick = () => {
      if (!this.isMounted) return;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        ctx.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        var imageData = ctx.getImageData(
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });
        if (code) {
          drawLine(
            code.location.topLeftCorner,
            code.location.topRightCorner,
            '#FF3B58'
          );
          drawLine(
            code.location.topRightCorner,
            code.location.bottomRightCorner,
            '#FF3B58'
          );
          drawLine(
            code.location.bottomRightCorner,
            code.location.bottomLeftCorner,
            '#FF3B58'
          );
          drawLine(
            code.location.bottomLeftCorner,
            code.location.topLeftCorner,
            '#FF3B58'
          );
          this.$emit('decode', code.data);
        } else {
          this.$emit('error', 'not found');
        }
      }
      requestAnimationFrame(tick);
    };
  },
  beforeUnmount() {
    this.isMounted = false;
    if (this.stopCamera) this.stopCamera();
  },
  methods: {},
})
export default class QRCodeScanner extends Vue {}
</script>

<style scoped>
video {
  max-width: 100%;
  max-height: 100%;
}
.scanner-container {
  position: relative;
}

.overlay-element {
  position: absolute;
  top: 0;
  width: 100%;
  height: 99%;
  background: rgba(30, 30, 30, 0.5);

  -webkit-clip-path: polygon(
    0% 0%,
    0% 100%,
    20% 100%,
    20% 20%,
    80% 20%,
    80% 80%,
    20% 80%,
    20% 100%,
    100% 100%,
    100% 0%
  );
  clip-path: polygon(
    0% 0%,
    0% 100%,
    20% 100%,
    20% 20%,
    80% 20%,
    80% 80%,
    20% 80%,
    20% 100%,
    100% 100%,
    100% 0%
  );
}

.laser {
  width: 60%;
  margin-left: 20%;
  background-color: tomato;
  height: 1px;
  position: absolute;
  top: 40%;
  z-index: 2;
  box-shadow: 0 0 4px red;
  -webkit-animation: scanning 2s infinite;
  animation: scanning 2s infinite;
}
@-webkit-keyframes scanning {
  50% {
    -webkit-transform: translateY(75px);
    transform: translateY(75px);
  }
}
@keyframes scanning {
  50% {
    -webkit-transform: translateY(75px);
    transform: translateY(75px);
  }
}
</style>
