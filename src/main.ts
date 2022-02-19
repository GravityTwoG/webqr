import { createApp } from 'vue';
import {
  VuesticPluginsWithoutComponents,
  VaInput,
  VaButton,
  VaCard,
  VaCardContent,
  VaCardActions,
  VaFileUpload,
  VaDivider,
  VaIcon,
  VaSelect,
} from 'vuestic-ui';

import { router } from './router';
import App from './App.vue';
import AppContainer from './components/Container.vue';
import './index.css';

import './registerServiceWorker';

const app = createApp(App);
app.use(router);
app.component('app-container', AppContainer);

app.use(VuesticPluginsWithoutComponents);
app
  .component('va-input', VaInput)
  .component('va-button', VaButton)
  .component('va-card', VaCard)
  .component('va-card-actions', VaCardActions)
  .component('va-card-content', VaCardContent)
  .component('va-divider', VaDivider)
  .component('va-icon', VaIcon)
  .component('va-file-upload', VaFileUpload)
  .component('va-select', VaSelect);

app.mount('#app');
