<template>
    <div class="row justify-content-around homepage p-3">
        <div class="col-md-3 border p-0">
            <div class="home_left_top">
                <div class="home_self">
                    <img :src="userinfo.picture" alt="">
                    <p class="home_name">{{userinfo.userName}}</p>
                </div>
                <div class="home_atten">
                    <ul>
                        <li :class="{'active':showmenu}"  @click ="changeMenu(true)">
                            <strong>{{userinfo.follow}}</strong>
                            <p >我的关注</p>
                            <i :class="{'bluetriangle':showmenu}"></i>
                        </li>
                        <li :class="{'active':!showmenu}" @click ="changeMenu(false)">
                            <strong>{{userinfo.followers}}</strong>
                            <p>我的粉丝</p>
                            <span :class="{'bluetriangle':!showmenu}"></span>
                        </li>
                        <li>
                            <strong>{{friendsNewsData.length}}</strong>
                             <p>我的微博</p>
                             <span class="bluetriangle"></span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="home_left_bottom">
                <Friendlist v-for="(item,index) in fridendList"  :items = item  :key = index />
                
            </div>

        </div>
        <div class="col-md-6 border">
            <div class="row p-3">
                <FriendModule v-for="(item,index) in friendsNewsData " :items = item :key =index />
              
            </div>
        </div>
        <div class="col-md-3 border">
            <Slider/>
        </div>
    </div>
</template>
<script>
import Friendlist from '@/components/circle/message.vue';
import FriendModule from '@/components/circle/friendNewsModule.vue';
import Slider from '@/components/slider/index.vue'
import axios from 'axios';
import {transformTime} from '@/tools/time_convert.js';
export default {
    data(){
        return {
            fridendList:[],
            showmenu:true,
            friendsNewsData:[],
            temp:[],
            userinfo:{}
        }
    },
    components:{
        Friendlist,
        FriendModule,
        Slider,
        
    },
    methods:{
        changeMenu:function(mark){
            this.showmenu = mark;
            if(mark){
                 this.getuserConnect();
            }else{
                this.getUserFollowers();
            }
        },
        //初始化
        getuserConnect:function(){
            this.fridendList=[]
            let that =this;
            axios({
                method:'get',
                url:`http://localhost:5008/api/user/getUserConnect?userid1=${that.$store.state.userinfo.id}`
            }).then((res)=>{
                let result  = res.data.data.rows;
                let result1= result.map(async(item,index)=>{
                   return await axios({
                    method:'get',
                    url:`http://localhost:5008/api/user/searchUserById?id=${item.userid2}`
                    })
                })
               
                result1.forEach(element => {
                    element.then((res)=>{
                        this.fridendList.push(res.data.data)
                    })
                });
                // this.fridendList = res.data.data.rows;
            })
        },
        getUserFollowers:function(){
            this.fridendList =[]
            let that =this;
            axios({
                method:'get',
                url:`http://localhost:5008/api/user/getUserfollowers?userid1=${that.$store.state.userinfo.id}`
            }).then((res)=>{
                let result  = res.data.data.rows;
                let result1= result.map(async(item,index)=>{
                   return await axios({
                    method:'get',
                    url:`http://localhost:5008/api/user/searchUserById?id=${item.userid1}`
                    })
                })
               
                result1.forEach(element => {
                    element.then((res)=>{
                        this.fridendList.push(res.data.data)
                    })
                });
               
            })
        },
        // getMyBlog:function(){
        //     axios({
        //         method:'get',
        //         url:`http://localhost:5008/api/circle/getCircleText?page=${0}&parent=${2}`
        //     }).then((res)=>{
        //         // console.log(res.data.data)
        //         let result = res.data.data;
        //         result.map((item,index)=>{
        //                 this.FriendModule.push({
        //                 id:item.id,
        //                 userid:item.user_id,
        //                 username:item.user_name,
        //                 friendsNews:item.text_content,
        //                 createdTime:item.createdAt,
        //                 pictureNum:item,
        //                 pictureUrlArr:['https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1963304009,2816364381&fm=26&gp=0.jpg','https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1796762658,4159569164&fm=26&gp=0.jpg','https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2202780618,895893289&fm=26&gp=0.jpg'],
        //                 likes:0,
        //                 replyData:[{
        //                         blogid:blogid,
        //                         user_1_name: 'wangyang', //回复的人
        //                         user_1_id: '',
        //                         user_1_headpic: '',
        //                         user_2_name: '铁锅里的烙饼', //被回复的人
        //                         user_2_id: '',
        //                         user_2_headpic: '',
        //                         content:
        //                             '这里的瓜真香dfsfjdhs丰大厦大火大家看法和肯德基啊是发到客户发动机撒开发和打击阿富汗扩大风很大回复',
        //                         ctime: '今天11：00'
        //                         }],
        //         })
        //         })
                
                
        
        //     })
        // },
        initData: function(page, parent) {
                let that = this
                console.log(that.$store.state.userinfo.id)
                axios({
                    method: 'get',
                    url:`http://localhost:5008/api/circle/getUserText?page=${0}&userid=${that.$store.state.userinfo.id}`
                }).then(res => {
                    let pictureUrlArr = []
                    let replyData = []
                    let result = res.data.data

                    this.temp = result.map(async (item, index) => {
                    let aitem = item
                    let a = await axios({
                        methods: 'get',
                        url: `http://localhost:5008/public/images/userImg/${item.user_name}/${item.text_img}`
                    })
                    let comment = await axios({
                        method: 'get',
                        url: `http://localhost:5008/api/comment/selectCommentByText?blogid=${item.id}`
                    })
                    replyData = comment.data.data.rows.map((item, index) => {
                        return {
                        blogid: item.blog_id,
                        user_1_name: item.user_name, //回复的人
                        user_1_id: item.user_id,
                        user_1_headpic: '',
                        user_2_name: item.parent_name, //被回复的人
                        user_2_id: item.parent_id,
                        user_2_headpic: '',
                        content: item.comment_content,
                        ctime: transformTime(item.createdAt),
                        }
                    })
                    pictureUrlArr = a.data.data.map((item, index) => {
                        return `http://localhost:5008${item}`
                    })
                    return {
                        id: item.id,
                        userid: item.user_id,
                        username: item.user_name,
                        friendsNews: item.text_content,
                        createdTime: transformTime(item.createdAt),
                        pictureNum: item.text_img_count,
                        pictureUrlArr: pictureUrlArr,
                        likes: item.likes,
                        replyData: replyData
                    }
                    })
                    let dirs = []
                    this.temp.forEach(item => {
                    item.then(res => {
                        dirs.push(res)
                        this.friendsNewsData = dirs
                    })
                    })
                })
    }
    },
    created(){
            this.getuserConnect();
            this.initData();
            // console.log(this.$store.state.userinfo)
            console.log(this.$store.state.userinfo)
            this.userinfo = this.$store.state.userinfo;
            
    }
}
</script>
<style src='@/assets/css/homePage.css'>

</style>
