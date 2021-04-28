<template>
    <div class="row message_inall" @click="showchatroom()">
       <div class="col-md-12 messagelist border-bottom"  >
        <img class="redpoint" :src="getHeadImg(items)" alt="头像">
        <div class="info">
            <p class="name">{{items.userName}}</p>
            <p class="date">6分钟前</p>
        <p class="message">好吧！就的士大夫士大夫撒旦这样吧附近的卡萨活佛卡号</p>
        </div>
       </div>
    </div>
</template>
<script>
export default {
    props:['showchat','items'],
    computed:{
        getHeadImg:function(items){
            return function(items){
           
               return  'http://localhost:5008/public/images/'+items.picture
            }
        }
    },
    methods:{
        showchatroom(){
            this.$emit('click')
        }
    },
    watch:{
        items:function(val){
            console.log(val)
        },
    }
}
</script>
<style src="@/assets/css/message.css">

</style>
