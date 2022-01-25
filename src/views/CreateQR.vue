<template>
  <app-container>
    <div class="flex xl12">
      <va-card>
        <va-card-content>
          <p>Enter your text to create QR code</p>
          <va-divider />

          <va-input v-model="text" clearable placeholder="Type your text" />

          <div class="qr-preview">
            <qrcode-vue :value="text" :size="200" level="H" render-as="svg" />
          </div>

          <va-card-actions align="center">
            <va-button gradient>Copy as SVG</va-button>
            <va-button gradient>Save as PNG</va-button>
            <va-button gradient>Save as PDF</va-button>
          </va-card-actions>
        </va-card-content>
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
      preview: null,
    };
  },
  methods: {
    onSubmit(): void {
      console.log(this.text);
    },
  },
})
export default class CreateQR extends Vue {}
</script>
