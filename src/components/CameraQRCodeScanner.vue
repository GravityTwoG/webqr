<template>
  <div class="scanner-container">
    <canvas v-if="isMediaStreamAPISupported" id="canvas" />
    <p v-else>Media stream API is not supported.</p>
    <p v-if="!isCameraAllowed">
      No access to camera.<br />{{ cameraStreamError }}
    </p>

    <div v-if="devices.length > 1" class="scanner-control">
      <va-select
        v-model="selectedDevice"
        :options="devices"
        placeholder="Select videoInput device"
      />
    </div>
  </div>
</template>

<style scoped>
.scanner-container {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
}
.scanner-container canvas {
  max-width: 100%;
  max-height: 100%;
}
.scanner-control {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
}
video {
  max-width: 100%;
  max-height: 100%;
}
</style>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { throttle } from '@/utilities';

import {
  createWorker,
  destroyWorker,
  registerMessageListener,
  sendDecodeMessage,
} from '@/qr-recognition.worker-api';
import {
  isMediaStreamAPISupported,
  getCameraStream,
  enumerateDevices,
} from '@/mediaStreamAPI';

@Options({
  name: 'camera-qrcode-reader',
  emits: ['decode', 'error'],
  data() {
    return {
      isMounted: false,
      isMediaStreamAPISupported: isMediaStreamAPISupported(),
      isCameraAllowed: true,
      cameraStreamError: '',
      devices: [],
      selectedDevice: '',
    };
  },
  created() {
    if (!this.isMediaStreamAPISupported) {
      return;
    }
    enumerateDevices()
      .then((devices) => {
        const _devices: { value: string; text: string }[] = [];
        devices.forEach((device) => {
          if (device.kind === 'videoinput') {
            _devices.push({
              value: device.deviceId,
              text: device.label || 'no label',
            });
          }
        });
        this.devices = _devices;
      })
      .catch(console.log);

    if (this.devices.length) {
      this.selectedDevice = this.devices[0].deviceid;
    }
  },
  mounted() {
    this.isMounted = true;
    if (!this.isMediaStreamAPISupported) {
      return;
    }

    createWorker();
    this.throttledSendMessage = throttle(sendDecodeMessage, 200);
    registerMessageListener((code) => {
      if (code) {
        this.$emit('decode', code.data);
      } else {
        this.$emit('error', 'not found');
      }
    });

    this.startVideoStream();
  },
  beforeUnmount() {
    this.isMounted = false;
    if (this.stopCamera) this.stopCamera();
    destroyWorker();
  },
  watch: {
    selectedDevice() {
      this.startVideoStream();
    },
  },
  methods: {
    startVideoStream() {
      if (this.stopCamera) this.stopCamera();

      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const video = document.createElement('video');

      const currentDevice = this.selectedDevice;
      getCameraStream(currentDevice)
        .then((stream) => {
          const streamTrack = stream.getTracks()[0];

          this.stopCamera = streamTrack.stop.bind(streamTrack);
          this.isCameraAllowed = true;

          video.srcObject = stream;
          video.setAttribute('playsinline', 'true'); // required to tell iOS safari we don't want fullscreen
          video.play();
          requestAnimationFrame(tick);
        })
        .catch((e) => {
          console.log('Error on getCameraStream: ', e);
          this.isCameraAllowed = false;
          this.cameraStreamError = e;
        });

      const tick = () => {
        if (!this.isMounted) return;
        if (currentDevice !== this.selectedDevice) return;

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.height = video.videoHeight;
          canvas.width = video.videoWidth;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          this.throttledSendMessage(imageData);
        }
        requestAnimationFrame(tick);
      };
    },
  },
})
export default class QRCodeScanner extends Vue {}
</script>
