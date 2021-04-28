<template>
 <div class="col-md-12 col-12  reply  float-left" style="fontSize:13px;backgroundColor:#eaeaec" >
      <div class=" pt-2 pb-2 mb-0" style="borderBottom:1px solid #d9d9d9">
          <p class="mb-0"><span style='color:#32a2d5'>{{item.user_1_name}}</span>:回复 <span style='color:#32a2d5' v-if="item.user_2_name">@{{item.user_2_name}}</span> 
          :<span v-html="item.content" style="display:inline-block"></span></p>
          <p class="mb-0 text-right d-flex justify-content-between" style="color:#808080"> <span>{{item.ctime}}</span> <span class="replybutton" @click="replay()">回复</span></p>
      </div>
      <div v-if="showComment" class="comment">
          <Commenteditor @put="updateCommentcontent" :value="clearText"/>
          <button style="height: 3vh; width: 7vh; font-size: 14px;margin-top:2vh; border:0; float:right; background-color: rgb(255, 129, 64); color: rgb(255, 255, 255);"
          @click="publishReply(item.blogid,item.user_1_id,item.timeFrame,item.user_1_name)"
          >回复</button>
      </div>
      
     
 </div>    
</template>
<script>
import Commenteditor from '@/components/editor/commentEditor.vue'
export default {
    props:['item'],
    data(){
        return {
            showComment:false,
            commentcontent:'',
            clearText:false,
        }
    },
    methods :{
        replay:function(){
            this.showComment =!this.showComment
        },
        publishReply:function(blogid,userid,timeFrame=0,username){
        this.$emit('commentsend',blogid,userid,timeFrame,username,this.commentcontent);
        this.clearText = true;
    },
        updateCommentcontent:function(value){
        this.commentcontent = value
        this.clearText = false;
     
    }
    },
    components:{
        Commenteditor
    }
}
</script>
<style>
 
</style>
