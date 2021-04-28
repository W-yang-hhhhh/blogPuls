<template>
      <div class="container-fluid">
          
        <div class="row User justify-content-center border-bottom" style="height:5vh;"  >
            <User/>
        </div>
        <div class="row header justify-content-center border-bottom" style="backgroundColor:black">
                    <Header/>
        </div>
        <div class="row body">
            <Chattag/>
            
            <router-view :key = "key"/>
        </div>
        <div class="row footer justify-content-center">
            <Footer/>
        </div>
    </div>
</template>

<script>
import User from '@/components/user/index.vue'
import Header from '@/components/header/index.vue'
import Footer from '@/components/footer/index.vue'
import Chattag from '@/components/global_components/global_chatroom.vue'
 
export default {
     components:{
        Header,
        User,
        Footer,
        Chattag
         
    },
    computed:{
        key(){
            return this.$route.path + Math.random();
        }
    },
    created(){
      
    }
}
</script>
<style>
/* div{
     
    border: 1px solid #000
} */
</style>

