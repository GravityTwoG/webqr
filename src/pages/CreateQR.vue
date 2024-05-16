<script lang="ts" setup>
import { ref } from 'vue';
import QrcodeVue from 'qrcode.vue';
import Navbar from '@/components/ui/Navbar.vue';
import Page from '@/components/ui/Page.vue';
import Container from '@/components/ui/Container.vue';
import Copyrights from '@/components/Copyrights.vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Select from '@/components/ui/Select.vue';

const LEVELS = [
  {
    value: 'L',
    label: 'Size - L',
  },
  {
    value: 'M',
    label: 'Size - M',
  },
  {
    value: 'Q',
    label: 'Size - Q',
  },
  {
    value: 'H',
    label: 'Size - H',
  },
] as const;
const BACKGROUND = '#ffffff';
const FOREGROUND = '#000000';

const level = ref<typeof LEVELS[number]['value']>('L');
const size = ref(400);
const text = ref('');

const downloadSVG = (e: Event) => {
  const svg = document.querySelector('.qr-preview svg');
  const anchor = document.querySelector('#download-svg') as HTMLAnchorElement;
  if (!svg || !anchor) {
    e.preventDefault();
    return;
  }

  const svg2000 = /^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/;
  const svg1999 = /^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/1999\/xlink"/;

  //get svg source.
  let source = new XMLSerializer().serializeToString(svg);

  //add name spaces.
  if (!svg2000.exec(source)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!svg1999.exec(source)) {
    source = source.replace(
      /^<svg/,
      '<svg xmlns:xlink="http://www.w3.org/1999/xlink"'
    );
  }

  //add xml declaration
  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
  //convert svg source to URI data scheme.
  const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);

  anchor.href = url;
};

const downloadPNG = (e: Event) => {
  const canvas = document.querySelector(
    '.qr-preview canvas'
  ) as HTMLCanvasElement;
  const anchor = document.querySelector('#download-png') as HTMLAnchorElement;
  if (!canvas || !anchor) {
    e.preventDefault();
    return;
  }

  let data = canvas.toDataURL('image/png');
  /* Change MIME type to trick the browser to downlaod the file instead of displaying it */
  data = data.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');

  /* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
  data = data.replace(
    /^data:application\/octet-stream/,
    'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=qr.png'
  );

  anchor.href = data;
};
</script>

<template>
  <Page class="page">
    <Container class="page-content">
      <Copyrights />

      <div class="qr-preview">
        <qrcode-vue
          :value="text"
          :size="size"
          :level="level"
          :background="BACKGROUND"
          :foreground="FOREGROUND"
          render-as="canvas"
        />
        <qrcode-vue
          :value="text"
          :size="size"
          :level="level"
          :background="BACKGROUND"
          :foreground="FOREGROUND"
          render-as="svg"
        />
      </div>

      <div class="field">
        <Select
          class="input"
          :value="level"
          @input="level = $event.target.value as typeof LEVELS[number]['value']"
          :options="LEVELS"
          label="Level"
        />
      </div>

      <div class="field">
        <Input
          class="input"
          :value="text"
          @input="text = $event.target.value"
          placeholder="Type your text"
        />
      </div>

      <div class="actions">
        <Button
          id="download-svg"
          href="/qr.svg"
          download="qr.svg"
          @click="downloadSVG"
        >
          Save as SVG
        </Button>

        <Button
          id="download-png"
          href="/qr.png"
          download="qr.png"
          @click="downloadPNG"
        >
          Save as PNG
        </Button>
      </div>
    </Container>

    <Navbar />
  </Page>
</template>

<style scoped>
.page-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: nowrap;
  gap: 1rem;
}

.qr-preview {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;

  border-radius: 12px;
  background-color: rgb(46 132 224 / 8%);
}

.field {
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.input {
  width: 100%;
  max-width: 450px;
}

.actions {
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.actions > * {
  flex-grow: 1;
  text-align: center;
}
</style>

<style>
.qr-preview canvas {
  display: none;
}
.qr-preview svg {
  max-width: 100%;
  max-height: 100%;
}
</style>
