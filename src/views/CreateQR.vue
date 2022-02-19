<template>
  <app-container>
    <div class="flex xl12">
      <va-card>
        <va-card-content>
          <p class="display-6 mb-2">Enter your text to create QR code</p>

          <va-input v-model="text" clearable placeholder="Type your text" />

          <div class="qr-preview">
            <qrcode-vue
              :value="text"
              :size="size"
              :level="level"
              :background="background"
              :foreground="foreground"
              render-as="svg"
            />
          </div>
        </va-card-content>

        <va-card-content>
          <va-divider />
          <p class="display-6 mb-2">Settings</p>
          <div class="settings">
            <va-select v-model="level" :options="levels" label="Level" />
          </div>
        </va-card-content>

        <va-card-actions align="center">
          <va-button
            gradient
            id="download-svg"
            href="/qr.svg"
            download="qr.svg"
            @click="downloadSVG"
            >Save as SVG</va-button
          >
        </va-card-actions>
      </va-card>
    </div>
  </app-container>
</template>

<style scoped>
.qr-preview {
  margin-top: 10px;
  padding: 8px;
  display: inline-block;

  border-radius: 6px;
  background-color: rgb(46 132 224 / 8%);
}
.settings {
  margin: auto;
  max-width: 250px;
}
</style>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import QrcodeVue from 'qrcode.vue';

@Options({
  components: { QrcodeVue },
  name: 'CreateQR',
  data() {
    return {
      text: '',
      size: 200,
      level: 'H',
      background: '#ffffff',
      foreground: '#000000',
      levels: ['L', 'M', 'Q', 'H'],
    };
  },
  methods: {
    onSubmit(): void {
      console.log(this.text);
    },
    downloadSVG(e: Event) {
      const svg = document.querySelector('.qr-preview svg');
      const anchor = document.querySelector(
        '#download-svg'
      ) as HTMLAnchorElement;
      if (!svg || !anchor) {
        e.preventDefault();
        return;
      }

      //get svg source.
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(svg);

      //add name spaces.
      if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(
          /^<svg/,
          '<svg xmlns="http://www.w3.org/2000/svg"'
        );
      }
      if (!source.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)) {
        source = source.replace(
          /^<svg/,
          '<svg xmlns:xlink="http://www.w3.org/1999/xlink"'
        );
      }

      //add xml declaration
      source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
      //convert svg source to URI data scheme.
      const url =
        'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);

      anchor.href = url;
    },
    downloadPNG(e: Event) {
      const canvas = document.querySelector(
        '.qr-preview canvas'
      ) as HTMLCanvasElement;
      const anchor = document.querySelector(
        '#download-png'
      ) as HTMLAnchorElement;
      if (!canvas || !anchor) {
        e.preventDefault();
        return;
      }

      let data = canvas.toDataURL('image/png');
      /* Change MIME type to trick the browser to downlaod the file instead of displaying it */
      data = data.replace(
        /^data:image\/[^;]*/,
        'data:application/octet-stream'
      );

      /* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
      data = data.replace(
        /^data:application\/octet-stream/,
        'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=qr.png'
      );

      anchor.href = data;
    },
  },
})
export default class CreateQR extends Vue {}
</script>
