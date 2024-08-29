import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { defineRule, configure } from 'vee-validate';
import { required, email, min } from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';
import 'normalize.css/normalize.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import Antd from "ant-design-vue";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import VueKonva from 'vue-konva';
// Update the workerSrc path
GlobalWorkerOptions.workerSrc = '/pdf.js/pdf.worker.js';

const app = createApp(App);

// Define rules for vee-validate
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);

// Configure vee-validate
configure({
  generateMessage: localize('en', {
    messages: {
      required: '{field} is required',
      email: '{field} must be a valid email',
      min: '{field} must be at least {length} characters',
    },
  }),
});

app.use(router);
app.use(Antd);
app.use(VueKonva);
app.mount('#app');