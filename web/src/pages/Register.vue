<template>

    <div class="container-fluid">
        <p class="text-center">Join Srect Room </p>
        <h2>
            <p class="text-center">Create your account</p>
        </h2>

        <div class="row d-flex d-flex justify-content-center">
            <div class="col-sm-5 col-xs">

            <!-- is-invalid  添加给 input 元素 显示错误提示样式 -->
                <form class="text-left needs-validation" novalidate>
                    <div class="form-group">

                        <label for="exampleInputUsername ">User name</label>
                        <input type="text" class="form-control " id="exampleInputUsername" maxlength="10" minlength="2" required v-model="username">
                        <div class="invalid-feedback">
                             该用户名不能为空，请重新输入
                        </div>
                        <small id="emailHelp" class="form-text text-muted">请输入2-10个字符可以包括由中文、英文、符号组成的用户名</small>

                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">邮箱地址</label>
                        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required v-model="email">
                        <div class="invalid-feedback">
                            请输入正确的邮箱格式
                        </div>
                        <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">密码</label>
                        <input type="password" class="form-control " id="exampleInputPassword1" pattern="^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,})$" maxlength="20" minlength="8" v-model="password"  required>
                         <div class="invalid-feedback">
                            请输入密码
                        </div>
                        <small id="emailHelp" class="form-text text-muted">密码长度必须为8-20个字符，包含字母和数字，并且不能包含空格、特殊字符或表情符号。</small>
                       
                    </div>
                    
                    <!-- <div class="form-group form-check">
                        <input type="checkbox" class="form-check-input" id="exampleCheck1">
                        <label class="form-check-label  justify-start" for="exampleCheck1">Check me out</label>
                    </div> -->
                    <div class=" float-right">
                        <button type="submit" class="btn btn-success " @click='sendAxios()'>创建该用户</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
 
   
//   'use strict';
 const axios = require('axios')
 
export default {
  name: 'register',
  data() {
    return {
        username:'',
        email:'',
        password:''
    }
  },
  methods:{
      sendAxios:function(){
         if(this.username&&this.email&&this.password){
               axios.post(`http://localhost:5008/api/user/signup?userName=${this.username}&email=${this.email}&loginPwd=${this.password}&follow=0&followers=0`,
        //    {
        //          params:{
        //              userName:username,
        //          email:email,
        //          password:password,
        //          follow:0,
        //          followers:0
        //          }
        //      }
         ).then((res)=>{
             
             if(res.statusText=='OK'){
                 alert('注册成功！');
                 this.$router.push('/login')
             }
         })
         }else{
             alert('请输入信息！！')
         }
       
      }
  },
  created: function() {
      let that = this
        window.addEventListener('load', function() {
            var forms = document.getElementsByClassName('needs-validation');
            var validation = Array.prototype.filter.call(forms, function(form) {
            form.addEventListener('submit', function(event) {
                
                //   console.log(forms,form.checkValidity)
               

                //   if()
                if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
                form.classList.add('was-validated');
                }else{
                    that.sendAxios()
                }
                
            }, false);
            });
        }, false);
  }
}
</script>
