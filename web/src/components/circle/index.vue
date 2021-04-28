<template>
    <div class="row justify-content-around mt-3">

        <div class="col-md-7" style="fontSize:13px;cursor:pointer">

            <div class="mb-2 row border " style="background:rgba(240, 240, 240, 1)">
                <PublishFN @getData = initData />
            </div>
            <div class="mb-2 border-bottom row">
                <ul class="mb-0">
                    <li class="float-left p-2" :style="{background:(changefriendNews==0? 'rgba(240, 240, 240, 1)':'white')}" @click="changeFN(0)">广场</li>
                    <li class="float-left p-2" :style="{background:(changefriendNews==1? 'rgba(240, 240, 240, 1)':'white')}" @click="changeFN(1)">朋友圈</li>
                </ul>
            </div>
            <!-- 内容区域 -->
            <Friend-news v-if="friendsNewsData.length!=0" :item=friendsNewsData />
            <!-- 加载缓冲显示区域 -->
            <div class="text-center" v-if="friendsNewsData==0">
                <div class="spinner-border" style="width:15px;height:15px" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
                正在加载中，请稍后......
            </div>
        </div>
        <div class="col-md-3 border p-0" style="overflow:hidden;border-radius:4px">

            <div class="d-flex justify-content-between barbutton"  style="width:100%">
                <!-- <span class="m-0 redpoint float-left" style="font-size:14px;border:1px solid #000">消息列表</span>
                <span style="font-size:14px;float:left;border:1px solid #000">关注列表</span>
                <span class="flaot-right" @click="showlist()">︾</span> -->
                <ul class="nav nav-tabs" style="width:100%">
                    <li class="nav-item">
                        <span class="redpoint" :class="['nav-link',{'active':showfriendList}]" href="#" style="font-size:13px" @click="changefriendList()" >消息列表</span>
                    </li>
                    <li class="nav-item">
                        <span :class="['nav-link',{'active':!showfriendList}]" href="#" style="font-size:13px" @click="changefriendList()" >关注列表</span>
                    </li>
                    
                </ul>
            </div>
            <div class="message_list">
                <div v-if="friendListData.length!=0">
                  <MeeageList  v-for="(item,index) in friendListData" :key= index :items= item />
                </div>
                <span v-else-if="friendListData.length==0" style="font-size:13px;width:100%;display:inline-block;text-align:center" >{{showfriendList? '暂无消息~~':'暂无关注~~'}}</span>

            </div>

        </div>

        <div class="mock" @click.stop="showchat()" v-show="showchatroom">
            <Chatroom/>
        </div>

        <!-- <div class="userIdCard">
            <Idcard/>
        </div> -->
    </div>

</template>
 <script>
import FriendNews from './friendNews.vue'
import MeeageList from './message.vue'
import Chatroom from '@/components/chatRoom/index.vue'
import PublishFN from '../editor/publishFridendNews.vue'
import Idcard from '@/components/idCard/index.vue'
import axios from 'axios'
import url from 'url'
import {transformTime} from '@/tools/time_convert.js';
export default {
  data() {
    return {
      showlistmark: true,
      showchatroom: false,
      showfriendList:true,
      changefriendNews: 0,
      friendsNewsData: [
        //  {
        //  id:id,
        //  userid:user_id
        //  username:'wy-hhhh',
        //  friendsNews:'房间都是垃圾法尔微积分文件发i额我安抚',
        //  createdTime:'3个小时前',
        //  pictureNum:'3',
        //  pictureUrlArr:['https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1963304009,2816364381&fm=26&gp=0.jpg','https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1796762658,4159569164&fm=26&gp=0.jpg','https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2202780618,895893289&fm=26&gp=0.jpg'],
        //  likes:0,
        //  replyData:[{
        //         blogid:blogid
        //         user_1_name: 'wangyang', //回复的人
        //         user_1_id: '',
        //         user_1_headpic: '',
        //         user_2_name: '铁锅里的烙饼', //被回复的人
        //         user_2_id: '',
        //         user_2_headpic: '',
        //         content:
        //             '这里的瓜真香dfsfjdhs丰大厦大火大家看法和肯德基啊是发到客户发动机撒开发和打击阿富汗扩大风很大回复',
        //         ctime: '今天11：00'
        //         }],
        //             }
      ],
      friendListData: []
    }
  },
  components: {
    FriendNews,
    MeeageList,
    Chatroom,
    PublishFN,
    Idcard
  },
  methods: {
    showlist: function() {
      if (this.showlistmark) {
        $('.message_list').slideUp()
        this.showlistmark = !this.showlistmark
      } else if (!this.showlistmark) {
        $('.message_list').slideDown()
        this.showlistmark = !this.showlistmark
      }
    },
    showchat: function() {
      this.showchatroom = !this.showchatroom
    },
    changeFN: function(num) {
      this.changefriendNews = num
      this.initData(0, num)
    },
    initData: function(page, parent) {
      let that = this
      axios({
        method: 'get',
        url: `http://localhost:5008/api/circle/getCircleText?page=${page}&parent=${parent}`
      }).then(res => {
        let pictureUrlArr = []
        let replyData = []
        let result = res.data.data

        this.temp = result.map(async (item, index) => {
          let aitem = item
          let a = await axios({
            methods: 'get',
            url: `http://localhost:5008/public/images/userImg/${
              item.user_name
            }/${item.text_img}`
          })
          let comment = await axios({
            method: 'get',
            url: `http://localhost:5008/api/comment/selectCommentByText?blogid=${
              item.id
            }`
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
              ctime: transformTime(item.createdAt)
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
    },
    url_encode: function(url) {
      url = encodeURIComponent(url)
      url = url.replace(/\%3A/g, ':')
      url = url.replace(/\%2F/g, '/')
      url = url.replace(/\%3F/g, '?')
      url = url.replace(/\%3D/g, '=')
      url = url.replace(/\%26/g, '&')

      return url
    },
    changefriendList:function(){
        this.showfriendList = !this.showfriendList;
        if(!this.showfriendList){
            this.getfirendList();
        }else{
            this.friendListData = []
        }
    },
    //获取关注好友列表信息
    getfirendList:function(){
          let that = this
                axios({
                method: 'get',
                url: 'http://localhost:5008/api/user/getUserConnect',
                params: {
                    userid1: that.$store.state.userinfo.id
                }
                }).then(res => {
                let result = res.data.data.rows.map(async (item, index) => {
                    return await axios({
                    method: 'get',
                    url: `http://localhost:5008/api/user/searchUserById?id=${
                        item.userid2
                    }`
                    })
                })
                console.log(result)
                result.forEach((item, index) => {
                    item.then(res => {
                    let userData = res.data.data
                    delete userData.loginPwd
                    delete userData.updateAt
                    delete userData.createdAt
                    delete userData.deletedAt
                    that.friendListData.push(userData)
                    })
                })
                })
    }
  },
  created() {
    this.initData(0, 0)
  
  }
}
</script>
 <style>
html .mock {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* width: 100%;
            height: 100%; */
  background-image: url('http://img95.699pic.com/xsj/04/rj/fd.jpg!/fh/300');
  /* background: #eee; */
  background-size: over;

  z-index: 4;
}
</style>
 
 









 


      
                    