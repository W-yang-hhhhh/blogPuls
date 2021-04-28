<template>

    <form>
        <div class="form-group">
            <label for="exampleInputEmail1">文章题目</label>
            <input type="text" class="form-control" v-model='info.title' id="exampleInputEmail1" aria-describedby="emailHelp">
        </div>
        <p>文章话题</p>
        <select class="form-control form-control-sm mb-3" v-model="info.tags">
            <option v-for="(item,index) in tags"   v-text="getstyle(item.tag)" data-id="item.id"></option>
         
        </select>
   
        <ckeditor  v-model="info.content" :config="editorConfig"></ckeditor>
        <button type="submit" class="btn btn-primary" @click="publishArticle()">发表文章</button>
    </form>
</template>
<script>
const axios = require('axios')
export default {
  data() {
    return {
     info:{
         title:'',
         tags:'',
         content: '',
         author:'wXXXXX'
     },
      editorConfig: { 

      },
      tags:[{
          id:1,
          tag:'广东东软社团大全'
      },
      ]
    }
  },
  computed:{
      getstyle:function(tag){
          return function(tag){
              console.log(tag)
              return '#'+tag+'#'
          }
      }
  },
  methods:{
      publishArticle:function(){
        let that = this
          axios({
              method:'post',
              contentType:'application/x-www-form-urlencoded',
              url:'http://localhost:5008/api/blog/publishBlog',
              data:{
                  title:that.info.title,
                  tags:that.info.tags,
                  content:that.info.content,
                  author:that.info.author

              }
          }).then((res)=>{
              console.log(res)
          })
          console.log(this.info)
      }
  },
  created:function(){
      axios({
          method:'get',
          url:'http://localhost:5008/api/tag/getAllTag',
      }).then((res)=>{
          this.tags = res.data.data.rows
          console.log(res)
      })
  }
}
</script>





