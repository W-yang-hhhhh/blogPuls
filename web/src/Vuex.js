import Vuex from'vuex'
import Vue from 'vue'
Vue.use(Vuex)
export default new Vuex.Store({
    state: {
       userinfo:{
         id:'',
         userName:'',
         age:'',
         email:'',
         sex:'',
         picture:'',
         followers:'',
         follow:''
       }
    },
    getters:{
      getheadImg:state=>{
        console.log('http://localhost:5008/public/images/'+state.userinfo.picture);
        return 'http://localhost:5008/public/images/'+state.userinfo.picture
      }
    },
    mutations: {
      adduser(state,params) {
        state.userinfo.id = params.id;
         state.userinfo.userName=params.userName;
         state.userinfo.age=params.age;
         state.userinfo.email=params.email;
         state.userinfo.sex=params.sex;
         state.userinfo.picture=params.picture;
         state.userinfo.followers=params.followers;
         state.userinfo.follow=params.follow;
      },
      deleteuser(state){
        state.userinfo={
          id:'',
          userName:'',
          age:'',
          email:'',
          sex:'',
          picture:'',
          followers:'',
          follow:''
        }
      }
    }
  })

  