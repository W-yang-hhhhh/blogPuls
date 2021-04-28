<template>
    <div class="container-fluid d-flex flex-column justify-content-center">
        <div class="row d-flex   align-items-center inall">
            <div class="col-sm-6 col-xs" >
                <h2>Welcome to Serect Room</h2>
                <Small>一个你想不到的社交平台</Small>
            </div>
            <div class="col-sm-4 col-xs rounded border p-5 shadow " >
                <h3>欢迎进入登录页面<small>请登录您的账号</small></h3>

                <form class="text-left">
                    <div class="form-group">
                        <label for="exampleInputEmail1">Email address</label>
                        <input type="email" class="form-control" id="exampleInputEmail1" placeholder="请输入邮箱/手机号" v-model="login_email">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input type="password" class="form-control" id="exampleInputPassword1" placeholder="请输入密码" v-model="login_pwd">
                    </div>
                    <h6>确保至少有15个字符或至少8个字符，包括一个数字和一个小写字母</h6>
                    <!-- <div class="checkbox">
                        <label>
                        <input type="checkbox"> Check me out
                        </label>
                    </div> -->
                    <button type="submit" class="btn btn-outline-success" @click="login()">登录</button>
                    <router-link tag='button' type="submit" class="btn btn-outline-secondary" :to="{name:'registers'}" >注册</router-link>
                </form>
            </div>
        </div>
    </div>
</template>



<script>

 const axios = require('axios')
export default {
    name:'Login',
    data(){
        return{
            login_email:'',
            login_pwd:''

    }},
    methods:{
        login:function(){
            if(this.login_email&&this.login_pwd){
                  axios({
                methods:'get',
                url:`http://localhost:5008/api/user/signin?email=${this.login_email}&loginPwd=${this.login_pwd}`,
                // data:{
                //     email:this.login_email,
                //     loginPwd:this.login_pwd
                // }
            }).then((res)=>{
                console.log('发送登录请求')
                if(res.data.data.code==404){
                    alert(res.data.data.msg)
                }else{
                    console.log(res)
                    this.setCookie('token',res.data.data.id);
                    this.setCookie('username',res.data.data.userName);
                    this.$store.commit("adduser",res.data.data)
                    this.$router.push('/')
                    // this.$store.commit('adduser',{...res.data.data})
                    console.log(this.$store.state.userinfo)
                }
            })
            console.log(document.cookie)
            }else{
                alert('请输入完整信息！')
            }
          
        },
        setCookie:function(name,value){  
            var Days = 7;   //cookie 将被保存30天
            var exp  = new Date();  //获得当前时间
            exp.setTime(exp.getTime() + Days*24*60*60*1000);  //换成毫秒
            document.cookie = name + "="+ value + ";expires=" + exp.toGMTString();
        }   
    }
}
</script>
<style >
  .container-fluid {
        height: 100vh;
        text-align: center;
       
       
  }
  /* div{
      border: 1px solid #000
  } */
  
</style>

