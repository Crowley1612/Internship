import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { defineRule, configure } from 'vee-validate';
import { required, email, min } from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';
import 'normalize.css/normalize.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import Antd from "ant-design-vue";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import VueKonva from 'vue-konva';
import store from './store';
import './assets/tailwind.css';
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
      required: '{field} là bắt buộc',
      email: '{field} phải là một địa chỉ email hợp lệ',
      min: '{field} phải có tối thiểu {length} ký tự',
    },
  }),
});

app.use(store);
app.use(router);
app.use(Antd);
app.use(VueKonva);
app.mount('#app');