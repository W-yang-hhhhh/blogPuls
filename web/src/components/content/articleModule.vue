<template>

  <div class="card shadow mt-4  position-relative">

    <div class="card-body " style='cursor:pointer'>
      <h5 class="card-title">
        <!-- <a href=""></a> -->
        <router-link tag='a' :to="{name:'article',params:{id:item.id},query:{tag:item.topic}}">{{item.title}}</router-link>
      </h5>
      <p class="card-text">
        <div class="float-right w-25 h-25">
          <img v-if="item.img" :src="item.img" style="width:100%;height:100%" />
        </div>
        {{item.topic}} {{item.content}}
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
          <span class=" iconfont icon-pinglun ml-3  replybutton" @click="changeicon('comment',item.id)" ref="dom1">{{item.comment_count==0? '评论' : item.comment_count}}</span>
          <span class=" iconfont icon-dianzan1 ml-3 replybutton" @click="changeicon('like',item.id)" ref="dom">{{item.likes==0? '点赞' : item.likes}}</span>
        </div>
      </div>
    </div>
    <div class="card-body Comment"  :class='setclass(item.id)'  style="display:none">
      <!-- <em class="point triangle position-absolute" style="top:42%;right:48%"></em> -->
      <div class="userComment  row d-flex justify-content-center">
        <div v-if="isUser"  class="col-md-12 col-12  d-flex  align-items-center h-100 mb-3">
          <img class="rounded h-100" :src="this.$store.state.userinfo.picture" style="heigth:4vh;width:4vh" alt="">
          <!-- <input class="ml-3 w-75  pl-2 h-100" type="text" placeholder="请写下你的评价"> -->
          <Commenteditor class="ml-3 w-75  pl-2 h-100" @put="updateCommentcontent" :value="clearText"/>
          <button type="button " class="border border-warning" style="height:4vh;width:8vh;fontSize:14px;marginLeft:3vh;backgroundColor:#ff8140;color:#fff;" @click="publishComment(item.id)">发表</button>
        </div>
        <div v-if="!isUser" class="noUser">
           <p>请您
             <router-link  :to="{name:'login'}" style="color:rgb(255, 129, 64)">登录</router-link>
               一下，然后再发表评论~~~~~ </p>
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
import Comment from '@/components/Comment/index.vue'
import Commenteditor from '@/components/editor/commentEditor.vue'
import axios from 'axios'
import {transformTime,transformTime_simple} from '../../tools/time_convert.js'
export default {
  props: ['item'],
  components: {
    Comment,
    Commenteditor
  },
  data() {
    return {
      tagName:"",
      likeCounts: 0,
      commentList: false,
      isUser:false, //看用户是否登录来显示评论框;
      commentData:[],
      commentcontent:'',
      clearText:false,
      
      //commentData 数据 内容格式
      // {
      //   userid:1,
      //   headpic:'',
      //   blogid:1,
      //   name:'wy-hhhhh',
      //   content:'真的有一种人能让时光为他静止，青春不灭。陈坤不愧是你 sjah范德萨激发大家看法和扩大回复可见大师傅法撒旦范德萨范德萨发的萨芬的萨芬无法',
      //   picture:'https://wx1.sinaimg.cn/thumb180/93d38a0bly1gh1u1submbj21hb1z3kjl.jpg',
      //   alt:'陈坤',
      //   ctime:'今天 22：00',
      //   timeFrame:'2020-7-15 15:30:22'
      //   likes:123,
      //   children:[{
      //           user_1_name:'wangyang',  //回复的人
      //           user_1_id:'',
      //           user_1_headpic:'',
      //           user_2_name:'铁锅里的烙饼',   //被回复的人
      //           user_2_id:'',
      //           user_2_headpic:'',
      //           content:'这里的瓜真香dfsfjdhs丰大厦大火大家看法和肯德基啊是发到客户发动机撒开发和打击阿富汗扩大风很大回复',
      //           ctime:'今天11：00'
      //       },{
      //           user_1_name:'wangyang',  //回复的人
      //           user_1_id:'',
      //           user_1_headpic:'',
      //           user_2_name:'铁锅里的烙饼',   //被回复的人
      //           user_2_id:'',
      //           user_2_headpic:'',
      //           content:'这里的瓜真香dfsfjdhs丰大厦大火大家看法和肯德基啊是发到客户发动机撒开发和打击阿富汗扩大风很大回复',
      //           ctime:'今天11：00'
      //       },{
      //           user_1_name:'wangyang',  //回复的人
      //           user_1_id:'',
      //           user_1_headpic:'',
      //           user_2_name:'铁锅里的烙饼',   //被回复的人
      //           user_2_id:'',
      //           user_2_headpic:'',
      //           content:'这里的瓜真香dfsfjdhs丰大厦大火大家看法和肯德基啊是发到客户发动机撒开发和打击阿富汗扩大风很大回复',
      //           ctime:'今天11：00'
      //       }]
      // }
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
      // this.sendAxios({
      //   id:id,
      //   views:this.item.views,
      //   likes:this.item.likes,
      //   comment_count:this.item.comment_count
      // })
   
      if (mark == 'like') {
        var dom = this.$refs.dom.style

        if (dom.color == 'orange') {
          dom.color = ''
          if (this.item.likes <= 0) {
            this.item.likes = 0
          } else {
            this.item.likes--
            //点赞-1 发送数据请求
            //  this.sendAxios({
            //   id:id,
            //   views:this.item.views,
            //   likes:this.item.likes,
            //   comment_count:this.item.comment_count
            // })
          }

         
        } else if (dom.color == '') {
          dom.color = 'orange'
          this.item.likes++
          //点赞+1
          //  this.sendAxios({
          //     id:id,
          //     views:this.item.views,
          //     likes:this.item.likes,
          //     comment_count:this.item.comment_count
          //   })

          
        }
      } else if (mark == 'comment') {
        this.islogin();
        this.commentList = !this.commentList
        var dom = this.$refs.dom1
       
        if (this.commentList == true) {
          dom.classList.add('triangleComment')
          $(`.Comment${id}`).slideDown();
          //评论区域下拉；获取评论数据；
          this.commentButton(id);
         
        } else {
          dom.classList.remove('triangleComment')
          $(`.Comment${id}`).slideUp()
        }
      }



      this.sendAxios({...this.item});
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
       error:function(res){
         console.log(res)
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
   },
   //判断用户是否登录
   islogin:function(){
    
       if(this.$store.state.userinfo.id){
       this.isUser = true
      }else{
        this.isUser=false
      }
   }
  },
  created(){
    //判断用户是否登录 来限制用户使用的功能
    // const user = document.cookie.split(';');
    //     let userInfo ={}
         
    //     for(var a of user){
    //         var splite = a.trim().split('=');
    //         userInfo[splite[0]]=splite[1];
    //     }
       this.islogin();
   
  
  
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