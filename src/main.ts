import Vue from 'vue';
import Vconsole from 'vconsole';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

import './assets/styles/index.scss';
import fastclick from 'fastclick'
import requestPlugin from './plugins/request'
import VueLazyLoad from 'vue-lazyload'

/* eslint-disable no-unused-vars */
const vConsole = new Vconsole();

fastclick(document.body)

/* plugins */
Vue.use(requestPlugin)
Vue.use(VueLazyLoad, {
    loading: require('./assets/images/default.png'),
})

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');
