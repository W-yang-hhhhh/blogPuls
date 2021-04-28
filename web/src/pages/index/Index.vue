<template>
    <div class="container-fluid d-flex justify-content-center content">
         
            <div class="col-md-9 col-12">
                <div class="row">
                   <div class="col-md-8 col-12">
                       <router-view/>
                   </div>
                   <div class="col-md-4 col-12">
                       <!-- 信息栏slider -->
                       <Slider/>
                   </div>
                </div>
              
            </div>
   
    </div>
</template>
<script>
 import Slider from '@/components/slider/index.vue'
export default {
    components:{
     Slider
       
    }
}
</script>
<style scoped>
 .content{
     border:1px solid #000
 }
/* .header{
    height: 60px
} */
</style>

