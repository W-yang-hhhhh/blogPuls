import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import Index from '@/pages/index/Index.vue'
import Blank from '@/layout/blank.vue'
import Default from '@/layout/default.vue'
import Content from '@/components/content/index.vue'
import Article from '@/components/article_detail/index.vue'
import About from '@/components/aboutMe/index.vue'
import Circle from '@/pages/index/CircleOfFriend.vue'
import Guestbook from '@/components/LeaveWord/index.vue'
import Friend from '@/components/circle/index.vue'
import Editor from '@/components/editor/commentEditor.vue'
import Chatroom from '@/components/chatRoom/index.vue'
import HomePage from '@/components/homePage/index.vue'
import AnonymousChat from '@/components/chatRoom/AnonymousChatRoom/index.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      name:'default',
      component:Default,
      redirect:'/index',
      children:[{
        path:'/index',
        name:'index',
        component:Index,
        children:[
          {
            path:'/',
            name:'content',
            component:Content
          },
          {
            path:'/index/:id',
            name:'article',
            component:Article
          },{
            path:'/about',
            name:'about',
            component:About
          },{
            path:'/guestbook',
            name:'guestbook',
            component:Guestbook
          }
        ]
      },{
        path:'/circle',
        name:'circle',
        redirect:'/circle/friend',
        component:Circle,
        children:[{
          path:'/circle/friend',
          name:'friend',
          component:Friend
        },{
          path:'/circle/homepage',
          name:'home',
          component:HomePage
        }]
      }]
    },
    {
      path:'/blank',
      name:'blank',
      component:Blank,
      children:[
        {
          path: '/login',
          name: 'login',
          component: Login,
        },
        {
          path:'/register',
          name:'registers',
          component:Register,
        }
      ]
    },{
      path:'/test',
      name:'test',
      component:Chatroom
    },
    {
      path:'/chat2',
      name:'chat2',
      component:AnonymousChat
    }
    
  ]
})
