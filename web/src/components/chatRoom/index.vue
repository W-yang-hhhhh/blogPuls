<template>
    <div class="chatting" @click.stop=''>
        <div class="username">
            <img src="@/assets/img/屁股.jpg" alt="">
            <p class="name">{{friendName}}</p>
        </div>
        <div class="room">
            <div class="user "  v-for="(item,index ) in messageList" :class="[item.direction=='right'? 'right':'left']">
                <img src="@/assets/img/屁股.jpg" alt="">
                <div class="text">
                    <p v-html='item.message'> </p>
                </div>
            </div>
           
        </div>
        <Send @click='send'/>
    </div>
</template>
<script>
import Send from './sendFrame.vue'
export default {
  components: {
    Send
  },
  data(){
    return {
      friendName:'wy-hhhhhh',
      userName:'喜羊羊',
      userimg:'@/assets/img/屁股.jpg',
      friendimg:'',
      messageList:[
        {
          direction:'right',
          message:'发动机拉近了付款的啦打卡打卡幅度萨芬扩fsfdfdfsfdfsdfdsfdsfsdfsdfs大',
        },
        {
          direction:'right',
          message:'发动机拉近了付款的啦打卡打卡幅度萨芬扩大',
        },
        {
          direction:'left',
          message:'发动机拉近了付款dsafdsafdsafdsafds 的啦打卡打卡幅度萨芬扩大',
        },{
          direction:'right',
          message:'发动机拉近了付款的啦打卡打卡幅度萨芬扩大',
        }
      ]
      
    }
    
  },
  methods:{
    
    send(message){
      var scrollTos = $('.room')[0].scrollHeight - $('.room').innerHeight();
          console.log($('.room')[0].scrollHeight,$('.room').innerHeight(),scrollTos,$('.room').scrollTop())
      // if(message==''){
      //   reutrn ;
      // }
        this.messageList.push({
          direction:'right',
          message:message,
        })

        
        if(scrollTos>1){
          scrollTos+=40;
        }
        // console.log(typeof(scrollTos))
        // $('.room').scrollTop(300);
        
    
        // $(".room").scrollTop($('.room')[0].scrollHeight);
    }
  },
  updated(){
    var scrollTos = $('.room')[0].scrollHeight - $('.room').innerHeight();
    console.log(scrollTos,$('.room')[0].scrollHeight,$('.room').innerHeight());
    $('.room').scrollTop(scrollTos);
  },
  created:function(){
    
  }
}
</script>
<style>
.chatting {
  position: absolute;
 top: 0;
 left: 0;
 bottom: 0;
 right: 0;
 margin: auto;
  width: 500px;
  height: 500px;
  /* border: 1px solid #000; */
  z-index: 5
}
.chatting .username {
  height: 7%;
  width: 100%;
  /* border: 1px solid #000; */
  display: flex;
  justify-content: center;
  align-self: center;
  background: rgb(36, 169, 225);
}

 .chatting .username img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 10px;
}
 .chatting .username .name {
  font-size: 20px;
}

.chatting .room {
  box-sizing: border-box;
  width: 100%;
  height: 63%;
  /* border: 1px solid #000; */
  background: rgb(253, 218, 4);
  padding: 10px;
  overflow:scroll;
}
::-webkit-scrollbar {
  width: 0px;
  height: 0px;
  background-color: rgba(240, 240, 240, 1);
}
.room img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.room .user {
  width: 50.5%;
  margin-top: 10px
}
.room .left {
  float: left;
}
.room .left img {
  float: left;
  vertical-align: middle;
}
.room .left .text{
  overflow: hidden;
 width: 210px;
}
.room .left p {
  
  float: left;
 /* word-wrap:break-word; */
  word-break: break-all;
  margin-bottom: 0;
  
    background: rgb(107, 194, 53);
  vertical-align: middle;
  font-size: 14px;
  padding: 1px 6px 1px 6px;
  border-radius: 4px;
  margin-left: 7px;
}
.room .right {
  float: right;
}
.room .right img {
  float: right;
  vertical-align: middle;
}
.room .right .text{
  overflow: hidden;
 width: 210px;
}
.room .right p {
  word-break: break-all;
  float: right;
  background: rgb(229, 131, 8);
  margin-bottom: 0;
  
  vertical-align: middle;
  font-size: 14px;
  padding: 1px 6px 1px 6px;
  border-radius: 4px;
  margin-right: 7px;
}
</style>
