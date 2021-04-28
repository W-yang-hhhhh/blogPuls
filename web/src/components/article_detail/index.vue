<template>

  <div class="card shadow mt-4  position-relative" >
   <p class="ml-4 mt-2" style="font-size:13px">
     <router-link :to="{name:'content'}">首页</router-link>
     >>
     <span v-if="tagName">
     <router-link :to="{name:'content',query:{tag:tagName}}">{{tagName}}</router-link>
     >>
     </span>
     {{item.title}}
     </p>
    <div class="card-body text-center" style='cursor:pointer'>
      
      <h5 class="card-title">
        <a href="">{{item.title}}</a>
      </h5>
      <p class="card-text">
        <!-- <div class="float-right w-25 h-25">
          <img v-if="item.img" v-bind:src='item.img' style="width:100%;height:100%" />
        </div> -->
        <span style='color:#ef4d58' v-html='item.content'> </span>  
      </p>
      <!-- <a href="#" class="btn btn-primary">Go somewhere</a> -->
    </div>
    <div class="card-header">
      <div class="row">
        <div class="col-md">
          {{item.author}} {{item.ctime}} 浏览({{item.views}})
        </div>
        <div class="col-md d-flex justify-content-end justify-content-sm-center ">
          <span class=" iconfont icon-icon-- replybutton">转发</span>
          <span class=" iconfont icon-pinglun ml-3  replybutton triangleComment"   ref="dom1">{{item.comment_count==0? '评论' : '评论'+item.comment_count}}</span>
          <span class=" iconfont icon-dianzan1 ml-3 replybutton" @click="changeicon('like',item.id)" ref="dom">{{item.likes==0? '点赞' : item.likes}}</span>
        </div>
      </div>
    </div>
    <div class="card-body Comment"  :class='setclass(item.id)' >
      <!-- <em class="point triangle position-absolute" style="top:42%;right:48%"></em> -->
      <div class="userComment  row d-flex justify-content-center">
        <div class="col-md-12 col-12  d-flex  align-items-center h-100 mb-3">
          <img class="rounded h-100" src="@/assets/img/屁股.jpg" style="heigth:4vh;width:4vh" alt="">
          <!-- <input class="ml-3 w-75  pl-2 h-100" type="text" placeholder="请写下你的评价"> -->
          <Commenteditor class="ml-3 w-75  pl-2 h-100" @put="updateCommentcontent" :value="clearText"/>
          <button type="button " class="border border-warning" style="height:4vh;width:8vh;fontSize:14px;marginLeft:3vh;backgroundColor:#ff8140;color:#fff;"
           @click="publishComment(item.id)"
          >发表</button>
        </div>

      </div>
      <div class="comment row " style='fontSize:14px'>
        <Comment v-if="commentData.length!=0" v-for="(item,index) in commentData"  :item = item :key = index @commentsend ="publishComment"  />
        <!-- 没有评论时的渲染 -->
        <div v-if="commentData.length==0"   class="col-md-12 col-12 text-center hidecomment">
            <hr/>
            <p style="color:rgb(255, 129, 64)"> :)还没有人发表评论，快来发表吧~~~~~~~~~~</p>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import axios from 'axios'
import Comment from '@/components/Comment/index.vue'
import Commenteditor from '@/components/editor/commentEditor.vue'
import {transformTime,transformTime_simple} from '../../tools/time_convert.js'
export default {
  name:'article_detail',
  props: [],
  components: {
    Comment,
    Commenteditor
  },
  data() {
    return {
      tagName:'',
      likeCounts: 0,
      commentList: false,
      isUser:false, //看用户是否登录来显示评论框;
      commentData:[],
      commentcontent:'',
      clearText:false,
      item:{
                id:1,
                title:'文章题目',
                content:'加载中。。。。。',
                topic:'',
                ctime:'2020-7-22',
                author:'汪洋',
                views:20,
                img:'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2752748333,3965197483&fm=26&gp=0.jpg',
                likes:'',
                comment_count:'',

            }
    }
  },
  computed:{
    setclass:function(){
      return function(id){
        return 'Comment'+id;
      }
    },
      matchPic:function(text){
      return function(text){
        //匹配 文章所有 <img> 正则
        var imgReg = /<img.*?(?:>|\/>)/gi;
        //用来匹配  src属性 正则
        var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
        var arr = text.match(imgReg);
        var picSrcArr = '';
         
        if(arr){
          for(let i = 0 ;i<arr.length;i++){
           var src = arr[i].match(srcReg);
          picSrcArr =picSrcArr+src[1]+','
        }
        }
        text = text.replace(/<img[\w\W]*">/g,"");
        return{
          text,
          picSrcArr
        }
        // let imgUrl = 
      }
    }
  },
  methods: {
    changeicon: function(mark,id) {
      let likes_mark = this.item.likes;
      if (mark == 'like') {
        var dom = this.$refs.dom.style

        if (dom.color == 'orange') {
          dom.color = ''
          if (this.item.likes <= 0) {
            this.item.likes = 0
          } else {
            this.item.likes--
          }

          
        } else if (dom.color == '') {
          dom.color = 'orange'
          this.item.likes++

          
        }
      } 
      
      if(likes_mark!=this.item.likes){
         this.sendAxios({...this.item});
        
      }
    },
    sendAxios:function(data){
     
     axios({
       method:'post',
       url:'http://localhost:5008/api/blog/updateBlog',
       data:{
         id:data.id,
         views:data.views,
         likes:data.likes,
         comment_count:data.comment_count

       },
       success:function(res){
         
         console.log(JSON.parse(res))
       },
       error:function(err){
         console.log(err)
       }
     })
   },
   getCommentByBlogid:function(blogid){
     //获取品论，发送请求  并循环摘选成可用于渲染的json数据格式
     axios({
       method:'get',
       url:'http://localhost:5008/api/comment/selectCommentByBlog?blogid='+blogid,
     }).then((res)=>{
       
       let result = res.data.data.rows
       let CommentDatemodel=[]
       let obj = {};
        
       for(let i = 0;i<result.length;i++){
          
          if(result[i].parent == 0){
           obj = {};
           obj.userid = result[i].user_id;
           obj.blogid = result[i].blog_id;
           obj.timeFrame = transformTime_simple(result[i].createdAt);
           obj.name=result[i].user_name;
           obj.content=result[i].comment_content;
           obj.picture=result[i].audio_image;
           obj.alt='图片';
           obj.ctime=transformTime(result[i].createdAt);
           obj.likes=result[i].likes;
           obj.children=[];

           for(let j = i ; j<result.length; j++){
             
             if(result[j].parent ==transformTime_simple(result[i].createdAt)){
               obj.children.push({
                blogid:result[i].blog_id,
                timeFrame: transformTime_simple(result[i].createdAt),
                user_1_name:result[j].user_name,  //回复的人
                user_1_id:result[j].user_id,
                user_1_headpic:'',
                user_2_name:result[j].parent_name,   //被回复的人
                user_2_id:result[j].parent_id,
                user_2_headpic:'',
                content:result[j].comment_content,
                ctime:transformTime(result[j].createdAt),
           })
             }
           }
           CommentDatemodel.push(obj);
           
           this.commentData =CommentDatemodel;
          }
       }
      

     })
  
   },
    commentButton:function(id){
     this.getCommentByBlogid(id);
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
       console.log(res);
        that.getCommentByBlogid(commentObj.blogid);
        this.clearText = true;
        alert("评论发送成功");
     })
   },
   publishComment:function(blogid,mark=-1,parent=0,parentid=0,parentname='',content){
     console.log('publishComment')
     let obj = {
       mark,
       blogid,
       content:this.commentcontent ? this.matchPic(this.commentcontent).text :this.matchPic(content).text,
       userid:this.$store.state.userinfo.id,
       username:this.$store.state.userinfo.userName,
       parent,
       parentid,
       parentname,
       email:'',
       image:this.matchPic(this.commentcontent).picSrcArr

     }
     console.log('commentobj',obj)
     this.sendAxiosComment(obj);
    

   },
   updateCommentcontent:function(value){
     this.clearText = false;
     this.commentcontent = value
   }
  },
  
  // beforeRouteLeave(to,from,next){
  //   // if(from.query.tag){
  //   // this.tagName = from.query.tag;
  //   // }

  //   // else{
  //   // this.tagName = '';
  //   // }
  //   console.log(this)
 
  //   console.log('生命周期函数',to,from)
  //   next();
  // },
  created:function(){
   
    this.tagName = this.$route.query.tag;
    let id = this.$route.params.id
    axios({
      method:'get',
      url:'http://localhost:5008/api/blog/selectBlog?id='+id,
    }).then((res)=>{
     
      let result = res.data.data
       this.item = {
                id:result.id,
                title:result.blog_title,
                content: result.blog_content,
                topic: result.tags,
                ctime: result.createdAt,
                author: result.author,
                views:result.views,
                likes:result.likes,
                comment_count:result.comment_count,
                img:'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2752748333,3965197483&fm=26&gp=0.jpg'
            }
    })


    this.getCommentByBlogid(this.item.id);
     //判断用户是否登录 来限制用户使用的功能
    const user = document.cookie.split(';');
        let userInfo ={}
         
        for(var a of user){
            var splite = a.trim().split('=');
            userInfo[splite[0]]=splite[1];
        }
       
     if(userInfo.token){
       this.isUser = true
     }else{
       this.isUser=false
     }
  }


  
}
</script>
<style>
span {
  cursor: pointer;
}
 .replybutton:hover {
  color: orange;
}
em{
  color: #6097d6
}
@media screen and (min-width: 768px) {
  .triangleComment::after {
    content: '';
    display: inline-block;
    width: 0px;
    height: 0px;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #fff;
    z-index: 5;
    position: absolute;
    top: 3.8vh;
    right: 11vw;
    
  }
}
</style>
