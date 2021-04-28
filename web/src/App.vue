<template>
  <div id="app">
     
    <router-view/>
  </div>
</template>

<script>
const axios = require('axios');
const store = require('./Vuex.js')
export default {
  name: 'App',
  // store,
  created(){
    // console.log(this)
  }
}
</script>
<style scoped>
/* @import 'http://at.alicdn.com/t/font_1963288_0oyb8ou1bi5c.css'; */
@import 'http://at.alicdn.com/t/font_1963288_zddgmi5z1i.css';
#app {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
