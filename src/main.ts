import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';

import { VuesticPlugin } from 'vuestic-ui';
import 'vuestic-ui/dist/vuestic-ui.css';

import AppContainer from './components/Container.vue';

const app = createApp(App);
app.component('app-container', AppContainer);
app.use(router);
app.use(VuesticPlugin);

app.mount('#app');
