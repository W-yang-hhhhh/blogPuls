<template>

    <div class="input-group p-2 searchbar">
        <input type="text" class="form-control" style="position:relative" placeholder="请输入文章/话题/用户关键字" aria-label="Recipient's username" aria-describedby="button-addon2" @input="searchinput($event)">
        <div v-if="searchResult.searchText.length!=0 || searchResult.searchTag.length!=0 || searchResult.searchUser.length!=0" 
        class="searchResult p-1 col-10 col-md-12" style="width:150%;height:auto;border:1px solid #000;position:absolute;top:85%;z-index:3;background:#fff"
        >
        <!-- 文章 -->
            <div class="text" style="width:100%;border-bottom:1px solid #000" v-if="searchResult.searchText.length!=0">
                <span style="font-size:12px">文章</span>
                <div class="text_item border-bottom mb-1" style="font-size:13px" v-for="(item,index) in searchResult.searchText">
                    <!-- <a href="#" style="display:inline-block;width:65%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{item.blog_title}}</a> -->
                    <router-link 
                    tag='a' 
                    style="display:inline-block;width:65%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" 
                    :to="{name:'article',params:{id:item.id},query:{tag:item.topic}}">{{item.blog_title}}</router-link>
                    <span class="float-right">点赞
                        <span style="color:red">{{item.likes}}</span>
                    </span>
                    <span class="float-right mr-1">评论
                        <span style="color:blue">{{item.comment_count}}</span>
                    </span>
                </div>
            </div>
            <!-- 话题 -->
            <div class="text" style="width:100%;border-bottom:1px solid #000" v-if="searchResult.searchTag.length!=0">
                <span style="font-size:12px">话题</span>
                <div class="text_item border-bottom mb-1" style="font-size:13px" v-for="(item,index) in searchResult.searchTag" >
                    <a href=" # " style="display:inline-block;width:65%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap ">{{item.tag}}</a>
                    <span class="float-right ">话题热度
                        <span style="color:red ">{{index}}</span>
                        
                    </span>
                </div>
            </div>
            <!-- 用户 -->
            <span style="font-size:12px;display:block " v-if="searchResult.searchUser.length!=0">用户</span>
            <div class="userinfo " style="display:flex;flex-wrap:wrap;justify-content:space-between; ">
                <div
                class="userinfo_item pt-1 pb-1 pl-1 mt-1 border shadow " 
                style="width:48%;height:70px;border:1px solid #000;display:inline-block;font-size:13px;background:#eee;borderRadius:3px;cursor:pointer "
                v-for="(item,index) in searchResult.searchUser">
                    <img :src="getHeadImgUrl(item.id) || getHeadImgUrl()" alt="头像" style="display:inline-block;width:30%;height:auto;float:left;margin-top:5% ">
                    <div style="display:inline-block;width:55%;margin-left:3% ">
                        <a href="# ">{{item.userName}}</a>
                        <span style="display:block;font-size:12px ">粉丝:{{item.followers}}  性别:{{item.sex? item.sex:'暂无'}}</span>
                        <span style="font-size:12px ">地区:{{item.address? item.address:'暂无' }}</span>
                    </div>
                    
                </div>
                
                 
                
            </div>
        </div>
        
        <div class="input-group-append">
            <button class="btn btn-outline-secondary " type="button" id="button-addon2">搜索</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      searchResult: {
        searchText: [],
        searchTag: [],
        searchUser: []
      }
    }
  },
  computed:{
      getHeadImgUrl:function(userid){
          return function(userid){
              if(userid){
                  return `http://localhost:5008/public/images/headimg/userHead${userid}.jpg`
              }else{
                  return `http://localhost:5008/public/images/headimg/userHead.jpg`
              }
              
          }
      }
  },
  methods: {
    searchinput: function(val) {
      console.log(val.data)
      let keyword = val.data
      axios({
        method: 'get',
        url: `http://localhost:5008/api/search/searchBykeyword?keyword=${keyword}`
      }).then(res => {
        console.log(res.data.data)
        let result = res.data.data
        this.searchResult.searchUser = result[2].datas
        this.searchResult.searchText = result[0].rows
        this.searchResult.searchTag = result[1].rows
      })
    }
  }
}
</script>


