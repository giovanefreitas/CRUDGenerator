import './assets/main.scss'
import "bootstrap";
import "bootstrap-icons/bootstrap-icons.svg";
import "bootstrap-icons/font/bootstrap-icons.css";
import BootstrapIcons from "bootstrap-icons/bootstrap-icons.svg";
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(PrimeVue);
app.use(ToastService);
app.use(createPinia())
app.use(router)

app.mount('#app')
