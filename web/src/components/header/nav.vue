<template>
     <ul class="nav   justify-content-between ">
  <li class="nav-item ">
    <a class="nav-link active" href="/">首页</a>
  </li>
  <li class="nav-item">
    <!-- <a class="nav-link" href="#">我的圈子</a> -->
    <router-link class="nav-link" :to="{name:'friend'}">贵圈</router-link>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#">随心听</a>
  </li>
  <li class="nav-item">
    <!-- <a class="nav-link " href="#" >留言</a> -->
    <router-link class="nav-link" :to="{name:'guestbook'}">留言</router-link>
  </li>
   <li class="nav-item d-inline-block">
    <!-- <a class="nav-link" href="about">关于我</a> -->
    <router-link class="nav-link" :to="{name:'about'}">关于我</router-link>
  </li>
  
</ul>
     
</template>
