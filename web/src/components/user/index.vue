<template>
    <div class="col-sm-9 col-12 text-right align-self-center">
        <div class="dropdown d-inline-block" style="cursor:pointer;" v-if="isUser" @mouseenter="changeUserinfo(true)" @mouseleave="changeUserinfo(false)">
            <router-link tag='div' :to="{name:'home'}" >
                Hi!
                <img class="rounded" :src="userinfo.picture" style="heigth:4vh;width:4vh" alt=""> {{isUser.username}}
            </router-link>
        </div>
        <div v-if="!isUser">
            <router-link :to="{name:'login'}">登录</router-link>/
            <router-link :to="{name:'registers'}">注册</router-link>
        </div>
        <div class="card p-0" style="width:30%;zIndex:3;display:absoult;top:0rem;right:-60vw" v-if="showUserInfo"  @mouseenter="changeUserinfo(true)" @mouseleave="changeUserinfo(false)">
            <img :src="userinfo.picture" class="card-img-top" alt="...">
            <div class="card-body  p-1 text-left">
                <h5 class="card-title">{{isUser.username}}</h5>
                <p class="card-text ">
                    粉丝：{{userinfo.followers}} 关注：{{userinfo.follow}} 博客：{{userinfo.followers}}
                </p>
                <a href="#" class="btn btn-primary float-left col-sm-5 col-12">
                    <router-link tag='div' :to="{name:'home'}">
                        用户中心
                    </router-link>
                </a>
                <a href="#" class="btn btn-primary float-right col-sm-5 col-12" @click="loginout()">退出登录</a>
            </div>
        </div>

    </div>
    <!-- 这里是主页顶部用户信息 -->
</template>


<script>
import axios from 'axios'
export default {
  data() {
    return {
      isUser: false,
      showUserInfo: false,
      userinfo: '',
      timer:null,
    }
  },
  computed: {},
  methods: {
    changeUserinfo: function(mark) {
         
        if(mark){
            clearInterval(this.timer)
            this.showUserInfo = true;
        }else if(!mark){
            this.timer = setTimeout(()=>{
            this.showUserInfo = false;
          },500)
        }
    },
    //退出登录
    loginout:function(){
        let a = confirm("确定退出登录？");
        if(a){
                    this.delAllCookie();
                    this.$store.commit("deleteuser");
                  
                    // this.isUser = false;
                    this.getUserinfo();
        }else{
            return ;


            
        }
        
    },
    delAllCookie:function(){    
            var myDate=new Date();    
            myDate.setTime(-1000);//设置时间    
            var data=document.cookie;    
            var dataArray=data.split(";");    
            for(var i=0;i<dataArray.length;i++){    
                 var varName=dataArray[i].split("="); 
                 document.cookie=varName[0]+'=""; expires='+myDate.toGMTString();    
            }    
         
                          
      },
    getUserinfo:function(){
          const user = document.cookie.split(';')
    let userInfo = {}
   

    for (var a of user) {
      var splite = a.trim().split('=')
 
      if(splite[1]=='""'){
    
        userInfo[splite[0]] =''
      }else{
     
         userInfo[splite[0]] = splite[1];
      }
     
    }
      
 
    if(userInfo.token && userInfo.username){
          console.log('token username 存在')
          this.isUser = userInfo
          // if (this.$store.state.userinfo.userName == '') {
            axios({
              method: 'get',
              url:'http://localhost:5008/api/user/searchUserById?id='+this.isUser.token,
            }).then(res => {
              this.userinfo = res.data.data;
            
              this.userinfo.picture ='http://localhost:5008/public/images/' + this.userinfo.picture;
              this.$store.commit('adduser', res.data.data);
            })
            // console.log(this.userinfo)
          }
    // }else{
          // console.log('不存在')
    // }
    }
  },
  created: function() {
    this.getUserinfo();
  }
}
</script>
