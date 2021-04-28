<template>
    <div class="row">
        
         <Friend-module   v-for="(item,index) in item"   :items = item :key = index />
      
    </div>
</template>
<script>
import FriendModule from '@/components/circle/friendNewsModule.vue'
export default {
    props:['item'],
    components:{
        FriendModule
    }
}
</script>
