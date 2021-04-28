<template>
   
        <div   class="col-md-12 col-12  border-top">
     
            <div class="row p-3">
                
                <img class="rounded h-100"   :src="getuserHeadPic(item.userid)" style="heigth:4vh;width:4vh" alt="头像">

                <div class="col-md-11 col-10 float-right text">
                    <p>
                        <span style="color:#eb7350;display:inline-block">{{item.name}}:</span><span style="display:inline-block" v-html="item.content"></span>
                    </p>
                    <img v-show="item.picture" :src="item.picture" alt="陈坤" >
                

                </div>
                <div class="col-md-12 pl-5 ">
                    <p class="d-inline ">
                        <small style="color:#808080">{{item.ctime}}
                            <span class="float-right ml-2 iconfont icon-dianzan1 replybutton" style="fontSize:100%;fontWeight:400">{{item.likes!=0 ? comment.likes:'点赞'}}</span>
                            <span class="float-right">|</span>
                            <span class="float-right mr-2 replybutton" @click="Comment()">回复</span>
                        </small>
                    </p>
                    <div v-show="showComment">
                        <Commenteditor @put="updateCommentcontent"  :value="clearText"/>
                        <button class="" style="height: 3vh; width: 7vh; font-size: 14px;margin-top:2vh; border:0; float:right; background-color: rgb(255, 129, 64); color: rgb(255, 255, 255);"  @click="publishReply(item.blogid,item.userid,item.timeFrame,item.name)" >回复</button>
                    </div>

                </div>
            </div>
           <!-- 回复 -->
            <div class="row reply  justify-content-end">
                <div class="col-md-11 col-12">
                    <Reply v-for="(items,index) in item.children" :item= items :key="index" @commentsend="publishReply"/>
                </div>
            </div>
        </div>
        
      <!-- https://dn-coding-net-production-pp.codehub.cn/29402486-bf33-4cb4-9ea2-ab4bae89bee2.png //没有头像用户的默认头像-->
</template>
<script>
import Reply from '@/components/Comment/reply.vue';
import Commenteditor from '@/components/editor/commentEditor.vue';
export default {
  props: ['item'],
  data() {
    return {
      showComment: false,
      commentcontent:'',
      headImgUrl:'',
      clearText:false,
      comment: {
        name: 'wy-hhhhh',
        content:
          '真的有一种人能让时光为他静止，青春不灭。陈坤不愧是你 sjah范德萨激发大家看法和扩大回复可见大师傅法撒旦范德萨范德萨发的萨芬的萨芬无法',
        picture:
          'https://wx1.sinaimg.cn/thumb180/93d38a0bly1gh1u1submbj21hb1z3kjl.jpg',
        alt: '陈坤',
        ctime: '今天 22：00',
        likes: 123
      },
      reply: [
        {
          user_1_name: 'wangyang', //回复的人
          user_1_id: '',
          user_1_headpic: '',
          user_2_name: '铁锅里的烙饼', //被回复的人
          user_2_id: '',
          user_2_headpic: '',
          content:
            '这里的瓜真香dfsfjdhs丰大厦大火大家看法和肯德基啊是发到客户发动机撒开发和打击阿富汗扩大风很大回复',
          ctime: '今天11：00'
        },
        {
          user_1_name: 'wangyang', //回复的人
          user_1_id: '',
          user_1_headpic: '',
          user_2_name: '铁锅里的烙饼', //被回复的人
          user_2_id: '',
          user_2_headpic: '',
          content:
            '这里的瓜真香dfsfjdhs丰大厦大火大家看法和肯德基啊是发到客户发动机撒开发和打击阿富汗扩大风很大回复',
          ctime: '今天11：00'
        },
        {
          user_1_name: 'wangyang', //回复的人
          user_1_id: '',
          user_1_headpic: '',
          user_2_name: '铁锅里的烙饼', //被回复的人
          user_2_id: '',
          user_2_headpic: '',
          content:
            '这里的瓜真香dfsfjdhs丰大厦大火大家看法和肯德基啊是发到客户发动机撒开发和打击阿富汗扩大风很大回复',
          ctime: '今天11：00'
        }
      ]
    }
  },
  components: {
    Reply,
    Commenteditor
  },
  computed:{
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
    },
    getuserHeadPic:function(userid){
      return function (userid){
        return 'http://localhost:5008/public/images/headimg/userHead'+userid+'.jpg';
      }
    }
  },
  methods: {
    Comment:function(){
      this.showComment = !this.showComment
    },
    publishReply:function(blogid,userid,timeFrame,username,content){
       
      this.$emit('commentsend',blogid,-1,timeFrame,userid,username,this.commentcontent||content);
      this.clearText = true
    },
     updateCommentcontent:function(value){
       this.clearText = false;
     this.commentcontent = value
   }
  //   publishComment:function(blogid,mark=-1,parent=0){
  //    console.log(this.commentcontent)
  //    let obj = {
  //      mark,
  //      blogid,
  //      content:this.matchPic(this.commentcontent).text,
  //      userid:this.$store.state.userinfo.id,
  //      username:this.$store.state.userinfo.userName,
  //      parent,
  //      parentid:0,
  //      parentname:'',
  //      email:'',
  //      image:this.matchPic(this.commentcontent).picSrcArr

  //    }
  //    console.log('commentobj',obj)
  //    this.sendAxiosComment(obj)

  //  },
  //   sendAxiosComment:function(commentObj){
  //    axios({
  //      method:'post',
  //      url:'http://localhost:5008/api/comment/addcomment',
  //      data:{
  //           mark:commentObj.mark,
  //           blog_id:commentObj.blogid,
  //           comment_content:commentObj.content,
  //           user_id:commentObj.userid,
  //           user_name:commentObj.username,
  //           parent:commentObj.parent,
  //           parent_id:commentObj.parentid,
  //           parent_name:commentObj.parentname,
  //           email:commentObj.email,
  //           likes:0,
  //           audio_image:commentObj.image
  //      }
  //    }).then((res)=>{
  //      console.log(res)
  //    })
  //  }
  },
  created(){
    this.getuserHeadPic()
  },

}
</script>
<style>
</style>
