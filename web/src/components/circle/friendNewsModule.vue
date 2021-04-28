<template>
    <div class="col-md-12 col-12 friendmodule" >
        <div class="row p-3" >
            <div class="avatar"  >
                <img :src="getHeadImg(items.userid)" style="position:relative;"  alt="头像" @mouseenter="showidCard(items.userid)" @mouseleave="showidCard(false)" >
                <idCard v-if="isShowIdcard" :userinfo = idCardData @mouse= showidCard :isfollow = isfollow />
            </div>
            <div class="newscontent col-md-10 col-10">
                <p class="username  ">{{items.username}}</p>
                <p class="content">{{items.friendsNews}}</p>
                <div class="pictureArea">
                   
                    <ul class="solo mb-0"  v-if="items.pictureUrlArr.length ==1">
                            <li>
                                <video v-if="items.pictureUrlArr[0].split('.')[1] =='mp4'" :src="items.pictureUrlArr[0]" controls="controls"  width="50%"></video>
                                <img v-else-if="items.pictureUrlArr[0].split('.')[1] !='mp4'" :src="items.pictureUrlArr[0]" alt="">
                           
                            </li>
                        
                    </ul>
                    <ul class="mb-0 " v-else>
                        <li class="mr-1"
                        v-for="(item,index) in items.pictureUrlArr"
                        ><img :src="item" alt=""></li>
                    </ul>
                </div>
                <!-- <div class="articleArea">
                     <p class="">
                    <img class=" mr-2" src="@/assets/logo.png" alt="">
                   杭州女子失踪案件最终破解 </p>
                </div> -->
                <div class="friend_btn w-100">
                    <span class="ctime float-left">{{items.createdTime}}</span>
                    <span class="like float-right" @click="changeLikes(items.id,items.likes)">
                        <em class="iconfont icon-act_dianzan_full" :style="{color:(islikes? 'red' :'grey') }" ></em>{{items.likes ==0? '点赞': likes ==null && items.likes ? items.likes : likes}}</span>
                    <span class="comment float-right" @click="showEditor()">
                        <em class="iconfont icon-pinglun"></em>评论</span>
                </div>
                <div class="mt-4" v-show="isEditor">
                    <Commenteditor @put="updateCommentcontent"  :value="clearText"/>
                    <button 
                    class="" 
                    style="height: 3vh; width: 7vh; font-size: 14px;margin-top:2vh; border:0; float:right;  background-color: rgb(255, 129, 64); color: rgb(255, 255, 255);"  
                     @click="publishComment(items.id)"
                    >回复
                    </button>
                </div>
                <div class="friend_comment" v-if="items">
                    <Reply v-for="(item,index) in   replyData" :item = item :key = index  @commentsend = publishComment />
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import Reply from '@/components/Comment/reply.vue'
import Commenteditor from '@/components/editor/commentEditor.vue';
import idCard from '@/components/idCard/index.vue'
import axios from 'axios';
import {transformTime} from '@/tools/time_convert.js';
export default {
    props:['items'],
    components:{
        Reply,
        Commenteditor,
        idCard
    },
    data(){
        return{
            isEditor:false,
            islikes:false,
            likes:null,
            isShowIdcard:false,
            idCardData:null,
            isfollow:false,
            clearText:false,
            commentcontent:'',
            timer:null,
            replyData:[
                    //   {
                    //     user_1_name: 'wangyang', //回复的人
                    //     user_1_id: '',
                    //     user_1_headpic: '',
                    //     user_2_name: '铁锅里的烙饼', //被回复的人
                    //     user_2_id: '',
                    //     user_2_headpic: '',
                    //     content:
                    //         '这里的瓜真香dfsfjdhs丰大厦大火大家看法和肯德基啊是发到客户发动机撒开发和打击阿富汗扩大风很大回复',
                    //     ctime: '今天11：00'
                    //     }, {
                    //     user_1_name: 'wangyang', //回复的人
                    //     user_1_id: '',
                    //     user_1_headpic: '',
                    //     user_2_name: '铁锅里的烙饼', //被回复的人
                    //     user_2_id: '',
                    //     user_2_headpic: '',
                    //     content:
                    //         '这里的瓜真香dfsfjdhs丰大厦大火大家看法和肯德基啊是发到客户发动机撒开发和打击阿富汗扩大风很大回复',
                    //     ctime: '今天11：00'
                    //     },
                 ]
        }
    },
    computed:{
         getHeadImg:function(id){
            return function(id){
           
               return `http://localhost:5008/public/images/headimg/userHead${id}.jpg`
            }
        }
    },
    methods:{
        showEditor:function(){
            this.isEditor = !this.isEditor;
        },
        changeLikes:function(id,likes){
            this.islikes = !this.islikes;
            if(this.islikes){
                this.likes = likes + 1;
                axios({
                    method:'post',
                    url:`http://localhost:5008/api/circle/changeCircleText?id=${id}&likes=${likes+1}`
                }).then((res)=>{
                    // console.log(res)
                })
            }else if(!this.islikes){
                this.likes = likes;
                axios({
                    method:'post',
                    url:`http://localhost:5008/api/circle/changeCircleText?id=${id}&likes=${likes-1}`
                }).then((res)=>{
                    // console.log(res)
                })
            }
        

        },
        updateCommentcontent:function(value){
            this.clearText = false;
            this.commentcontent = value
        },
        sendAxiosComment:function(commentObj){
            let that  =  this;
            axios({
                method:'post',
                url:'http://localhost:5008/api/comment/addcomment',
                data:{
                    mark:commentObj.mark,
                    blog_id:commentObj.blogid,
                    comment_content:commentObj.content,
                    user_id:commentObj.userid,
                    user_name:commentObj.username,
                    parent:commentObj.parent,
                    parent_id:commentObj.parentid,
                    parent_name:commentObj.parentname,
                    email:commentObj.email,
                    likes:0,
                    audio_image:commentObj.image
                    }
                }).then((res)=>{
                    // console.log(res);
                    // that.getCommentByBlogid(commentObj.blogid);
                    this.getCommentByid(commentObj.blogid);
                    this.clearText = true;
                    alert("评论发送成功");
                  
                })
              
        },
        // blogid,userid,timeFrame,username,this.commentcontent
        publishComment:function(blogid,parentid=0,parent=0,parentname='',content,mark=-2){
           
            let obj = {
                mark,
                blogid,
                content:this.commentcontent ? this.commentcontent :content,
                userid:this.$store.state.userinfo.id,
                username:this.$store.state.userinfo.userName,
                parent,
                parentid,
                parentname,
                email:'',
                image:null,
                // this.matchPic(this.commentcontent).picSrcArr
            }
            // console.log('commentobj',obj)
            this.sendAxiosComment(obj);
   
        },
        getCommentByid:function(blogid){
            if(blogid){
                axios({
                method:'get',
                url:`http://localhost:5008/api/comment/selectCommentByText?blogid=${blogid}`,
            }).then((res)=>{
                // {
                //         user_1_name: 'wangyang', //回复的人
                //         user_1_id: '',
                //         user_1_headpic: '',
                //         user_2_name: '铁锅里的烙饼', //被回复的人
                //         user_2_id: '',
                //         user_2_headpic: '',
                //         content:
                //             '这里的瓜真香dfsfjdhs丰大厦大火大家看法和肯德基啊是发到客户发动机撒开发和打击阿富汗扩大风很大回复',
                //         ctime: '今天11：00'
                // }
              this.replyData = res.data.data.rows.map((item,index)=>{
                    return {
                        blogid:item.blog_id,
                        user_1_name:item.user_name, //回复的人
                        user_1_id:item.user_id,
                        user_1_headpic: '',
                        user_2_name:item.parent_name, //被回复的人
                        user_2_id:item.parent_id,
                        user_2_headpic: '',
                        content:item.comment_content,
                        ctime:transformTime(item.createdAt),
                    }
                })
               
            }).catch((error)=>{
                console.log(error)
            })
            }
        },
        showidCard:function(userid){
         
             if(typeof(userid) =='number'){
                let that =this;
                console.log('初始化',userid)
                clearTimeout(this.timer);
                this.isShowIdcard =true;
                //请求用户信息
                axios({
                method:'get',
                url:`http://localhost:5008/api/user/searchUserById?id=${userid}`,
            }).then((res)=>{
                let result = res.data.data;
                this.idCardData = {
                    id:result.id,
                    username:result.userName,
                    follow:result.follow,
                    followers:result.followers,
                    address:result.address,
                    //缺少是否关注
                }
            })
             }
            else if(userid ==false){
                // console.log('关闭')
                this.timer =setTimeout(() => {
                    this.isShowIdcard =false
                }, 500);
                return ;
            }else if(userid==true){
                // console.log('打开')
                 clearTimeout(this.timer);
                 this.isShowIdcard =true;
                 return ;
            } 
   
        },
        },
        watch:{
            items:function(val){
                console.log(val)
               this.getCommentByid(val.id);
                
            }
        }
          
        
}


</script>
<style src="@/assets/css/friendNewsModule.css">
/* @import url(''); */
</style>
