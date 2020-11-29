import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

// // declare custom directives globally, then there is no need to declare it by components
// import pinDirective from './directives/pin.directive';
// Vue.directive('pin', pinDirective);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
