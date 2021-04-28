<template>
<!-- 缺少私信功能 -->
<!-- col-md-3 col-5 -->
     <div class="card col-md-3 col-5  d-flex justify-content-center align-items-center shadow " style="zIndex:3;position:absolute;bottom:100%;display:inline-block;" v-if="showUserInfo" @mouseenter="leave(true)" @mouseleave="leave(false)" >
        <div class="content" v-if="isready">
            <img src="https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg" class="card-img-top" alt="...">
            <div class="card-body p-0">
            <h5 class="" style="color:#333">{{userinfo.username || ''}}</h5>
            <span class=" " style="color:#333;font-size:12px;font-weight:700;display:block">关注 {{userinfo.follow}} | 粉丝 {{userinfo.followers}} | 文章9</span>
           
               <span style="display:block;font-size:12px;color:#333">{{userinfo.address==null? '暂无':userinfo.address}}</span>
            
            <a 
            class="btn shadow-sm float-left font-weight-normal pl-2 pr-2 pt-0 pb-0 mt-2 mb-2 border col-md-5 mr-1  col-12" 
            :class="{'follow':isfollow}"
            style="font-size:13px"
            @click="follow(userinfo.id)"
            >关注{{isfollow?'✔':''}}
            </a>
            <!-- <a   class="btn shadow-sm float-right font-weight-normal pl-2 pr-2 pt-0 pb-0 mt-2 mb-2 border col-md-5 col-12" style="font-size:13px">私信</a> -->
            <router-link class="btn shadow-sm float-right font-weight-normal pl-2 pr-2 pt-0 pb-0 mt-2 mb-2 border col-md-5 col-12" style="font-size:13px" :to="{name:'test'}">私信</router-link>
        </div>
        </div>
        <div class="loading p-2 w-100 triangleComment" v-if="!isready">
            <div class="spinner-border text-success  " role="status" style="width:15px;height:15px">
                <span class="sr-only" style="font-size:13px">Loading...</span>
            </div>
            <span style="display:inline-block;font-size:13px">正在加载中，请稍后....</span>
        </div>
        </div>
</template>
<script>
import axios from 'axios'
export default {
    props:['userinfo',],
    data(){
        return{
            isready:false,
            showUserInfo:true,
            isfollow:false,
        }
    },
    methods:{
        follow:function(userid){
            
            this.isfollow =!this.isfollow;
            let that = this;
            if(this.isfollow){
                axios({
                    method:'post',
                    url:'http://localhost:5008/api/user/addUserConnect',
                    data:{
                        userid1:that.$store.state.userinfo.id,
                        userid2:userid,
                    }
                }).then((res)=>{
           
                    let msg = res.data.data.msg;
                    if(msg=='不能关注自己'){
                        alert(msg);
                    }else{
                          //更新用户 粉丝 和 关注
                         this.updateUserFollow('add',that.$store.state.userinfo.id,userid)
                    }
                })

              
            }else{
                axios({
                    method:'post',
                    url:'http://localhost:5008/api/user/deleteUserConnect',
                    data:{
                        userid1:that.$store.state.userinfo.id,
                        userid2:userid,
                    }
                }).then((res)=>{
                    console.log(res.data.data)
                })
            }

        },
        leave:function(judge){
            this.$emit('mouse',judge);
        },
        propsData:function(val){
                let that = this;
                //请求是否用户关联
                axios({
                    method:'get',
                    url:'http://localhost:5008/api/user/isUserConnect',
                    params:{
                        userid1:that.$store.state.userinfo.id,
                        userid2:val.id,
                    }
                }).then((res)=>{
                    console.log(res)
                  if( res.data.data.code ==200){
                      this.isfollow = true;
                  }else{
                      this.isfollow = false;
                  }
                  this.isready = true;
                })
        },
        updateUserFollow:function(mark,userid1,userid2){
            let that = this;
            //更新主用户 关注
             axios({
                    method:'post',
                    url:`http://localhost:5008/api/user/updataUserFollow?id=${that.$store.state.userinfo.id}&followers=${that.$store.state.userinfo.followers}&follow=${that.$store.state.userinfo.follow + 1}`
                }).then((res)=>{
                    console.log(res)
                })
            //更新 副用户的 粉丝
            axios({
                method:'get',
                url:`http://localhost:5008/api/user/searchUserById?id=${userid2}`
            }).then((res)=>{
                console.log(res.data.data);
                let result = res.data.data;
                //添加该用户的粉丝数
                axios({
                method:'post',
                url:`http://localhost:5008/api/user/updataUserFollow?id=${userid2}&followers=${result.followers + 1}&follow=${result.follow}`
            }).then((res)=>{
                console.log(res)
            })
            })
            
        }
    },
    watch:{
        userinfo:'propsData'
    }
}
</script>
<style>
 .follow{
     background: #4395ff;
     color: #eee

 }
 
</style>
