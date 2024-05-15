import { createApp } from 'vue';

import { router } from './router';
import App from './App.vue';
import './assets/index.css';

import './core/registerServiceWorker';

const app = createApp(App);
app.use(router);

app.mount('#app');
