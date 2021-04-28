// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import $ from 'jquery'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.min'
import '@/assets/css/index.css'
import store from './Vuex'
import CKEditor from 'ckeditor4-vue';
import Editor from 'vue-area';
import axios from 'axios';
//socket.io
import VueSocketIo from 'vue-socket.io';
// import VueRouter from 'vue-router';
Vue.use(Editor);
Vue.use(CKEditor);

Vue.config.productionTip = false;
Vue.prototype.mywindow = window;
// Vue.use(new VueSocketIo({
//   debug:true,
//   connection:'http://localhost:5008',
//   vuex:{
//     store
//   }
// }))

Vue.use(VueSocketIo,'http://localhost:5008')
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
})
