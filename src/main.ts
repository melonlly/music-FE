import Vue from 'vue';
import Vconsole from 'vconsole';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

import './assets/styles/index.scss';

/* eslint-disable no-unused-vars */
const vConsole = new Vconsole();

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');
