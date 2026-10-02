import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import './style.css';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

const brandName = import.meta.env.VITE_BRAND_NAME || 'DoorSide';
app.config.globalProperties.$brandName = brandName;
document.title = brandName;

app.use(pinia);
app.use(router);

app.mount('#app');
