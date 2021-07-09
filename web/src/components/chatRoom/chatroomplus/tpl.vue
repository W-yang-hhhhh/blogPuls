
<template id="tpl">
<!-- 聊天室 -->
  <div class="tpl">
    <div class="wt-warp" v-if="loginUser">
      <!-- 最左边功能栏 -->
      <div class="wt-menu-box">
        <!-- 用户头像 -->
        <div class="wt-login-avatar">
          <img :src="loginUser.picture" alt="">
        </div>
        
        <!-- 左边菜单 -->
        <div class="wt-menu-list">
        
          <div class="wt-menu-item" :class="{active:currentMenu=='session'}" @click="currentMenu='session'">
            <span class="wt-menu-icon iconfont icon-comments"></span>
          </div>
          <div class="wt-menu-item" :class="{active:currentMenu=='setting'}" @click="currentMenu='setting'">
            <span class="wt-menu-icon iconfont icon-cog"></span>
          </div>
          <div class="wt-menu-item" :class="{active:currentMenu=='about'}" @click="currentMenu='about'">
            <span class="wt-menu-icon iconfont icon-info"></span>
          </div>
        </div>
        <!-- bug -->
        <div class="wt-debug" @click.stop="showLogs">
          <span class="iconfont icon-bug"></span>
        </div>
      </div>
      <!-- 用户消息栏 -->
      <div class="wt-container">
          <!-- <img src="../../../assets/images/qq/爱你.gif" alt="头像"> -->
          <!-- <img src="../../../assets/images/qq/爱你.gif" alt="头像"> -->
        <div class="wt-session-warp" style="display: none" v-show="currentMenu=='session'">
          <!-- 用户列表区 -->
          <div class="wt-session-list" >
            <!-- 用户搜索区 -->
            <div class="wt-session-search">
              <i class="iconfont icon-search"></i>
              <input type="text" class="wt-search-input" placeholder="搜索" v-model="keyword">
            </div>
            <!-- 用户列表显示区 -->
            <div class="wt-session-users">
              <div class="wt-session-listBox wt-scroll">
                <!-- 用户列表 -->
                <div class="wt-users-item" v-for="item in searchUser(keyword)"
                     :class="{active:item.id==sessionId}"
                     @click="changeSession(item)">
                  <div class="wt-user-avatar">
                    <img :src="item.picture" alt="">
                  </div>
                  <div class="wt-item-info">
                    <div class="wt-item-name">
                      {{item.userName}}
                      <span class="wt-message-time" v-if="getLastMessage(item.id).time">{{getLastMessage(item.id).time | friendlyTime}}</span>
                    </div>
                    <div class="wt-item-message">
                      {{getLastMessage(item.id).content}}
                      <span class="wt-message-num" v-if="getUnReaderNum(item.id)!=0">{{getUnReaderNum(item.id)}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="wt-session-container">
            <div class="wt-session-window" v-if="session">
              <div class="wt-window-header">
                <div class="wt-session-info">
                  <img :src="session.picture" alt="头像">
                  <span>{{session.userName}}</span>
                  <span class="wt-icon iconfont icon-phone wt-icon-phone" v-if="session.deviceType=='touch'"></span>
                  <span class="wt-icon iconfont icon-pc wt-icon-pc" v-if="session.deviceType=='pc'"></span>
                  <span class="wt-session-address">{{session.address}}</span>
                  <template v-if="session.type=='group'">
                    <span class="wt-session-address">({{sessionList.length}})</span>
                  </template>
                </div>
              </div>
              <div class="wt-window-container">
                <div class="wt-window-messageList wt-scroll" ref="messageList">
                  <template v-for="item in messageList">
                    <div class="wt-message-item" :class="item.from.id==loginUser.id?'wt-message-send':'wt-message-receive'" >
                      <div class="wt-avatarBox">
                        <img :src="item.from.picture" alt="">
                      </div>
                      <div class="wt-message-body">
                        <template v-if="setting.isName">
                          <div class="wt-from-info"  v-if="item.from.id!=loginUser.id">
                            <span >{{item.from.name}}</span>
                            <span class="wt-time-span" v-if="setting.isTime">{{item.time | friendlyTime}}</span>
                          </div>
                          <div class="wt-from-info" v-else>
                            <span class="wt-time-span" v-if="setting.isTime">{{item.time | friendlyTime}}</span>
                            <span >{{item.from.name}}</span>
                          </div>
                        </template>
                        <div class="wt-message-text" v-html="parseText(item.content)"></div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <div class="wt-window-footer">
                <div class="wt-toolBar-box">
                  <transition name="slider">
                    <div class="wt-expression-panel" v-show="isShow">
                      <div class="wt-expression-list">
                        <div class="wt-expression-item" v-for="item in qqExpression" @click.stop="selectExpression(item)">
                          
                          <img :src="require(`../../../assets/images/qq${item.url}`)" alt="" >
                          
                        </div>
                      </div>
                    </div>
                  </transition>
                  <span class="wt-toolBtn" @click.stop="showExpression()">
                  <i class="iconfont icon-expression"></i>
                </span>
                </div>
                <div class="wt-message-box">
                <textarea class="wt-message-input wt-scroll"
                          v-model="text"
                          placeholder="请输入信息"
                          @keyup.enter="sendMessage(text)"></textarea>
                </div>
                <div class="wt-sendBtn-box">
                  <span class="wt-sendBtn" @click="sendMessage(text)">发送</span>
                </div>
              </div>
            </div>
            <div class="wt-session-window" v-if="!session">
            <span class="wt-no-session">
              <svg t="1591765273919" class="icon" viewBox="0 0 1284 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2667" width="200" height="200"><path d="M558.563164 680.893113c0 165.030026 162.721913 298.900536 362.373623 298.900536 48.470357 0 95.786658-8.078393 137.332679-21.927066 11.540561 5.770281 94.632602 77.32176 113.0975 64.627143 12.694617-10.386505-30.005459-87.708265-33.467628-101.556939 88.862322-54.240638 146.565128-140.794847 146.565128-238.889618 0-165.030026-162.721913-298.900536-362.373623-298.900536S558.563164 515.863087 558.563164 680.893113z m438.541327-106.173163c0-28.851403 23.081122-51.932526 51.932526-51.932526s51.932526 23.081122 51.932525 51.932526-23.081122 51.932526-51.932525 51.932525c-28.851403 1.154056-51.932526-23.081122-51.932526-51.932525z m-255.046403 0c0-28.851403 23.081122-51.932526 51.932525-51.932526s51.932526 23.081122 51.932526 51.932526-23.081122 51.932526-51.932526 51.932525c-28.851403 1.154056-53.086582-23.081122-51.932525-51.932525z" p-id="2668" fill="#707070"></path><path d="M526.249593 678.585001c0-180.032755 177.724643-325.443827 395.84125-325.443827 11.540561 0 23.081122 0 33.467628 1.154056C931.323292 154.643521 727.055358 0 478.933291 0 214.654439 0 0 176.570587 0 394.687194c0 129.254286 76.167704 244.659898 192.727373 316.211378-4.616224 17.310842-60.010918 120.021837-43.854133 133.870511 24.235179 16.156786 133.87051-78.475816 148.87324-85.400153 55.394694 19.618954 116.559669 30.005459 181.186811 30.005459 23.081122 0 46.162245-1.154056 69.243368-4.616225-15.00273-33.467628-21.927066-69.243367-21.927066-106.173163zM646.271429 185.803036c38.083852 0 69.243367 31.159515 69.243368 69.243367 1.154056 38.083852-30.005459 69.243367-69.243368 69.243368-38.083852 0-69.243367-31.159515-69.243367-69.243368s31.159515-69.243367 69.243367-69.243367z m-335.830332 138.486735c-38.083852 0-69.243367-31.159515-69.243367-69.243368s31.159515-69.243367 69.243367-69.243367 69.243367 31.159515 69.243368 69.243367-31.159515 69.243367-69.243368 69.243368z" p-id="2669" fill="#707070"></path></svg>
            </span>
            </div>
          </div>
        </div>
        <!-- 聊天设置内容区 -->
        <div class="wt-setting-warp" style="display: none" v-show="currentMenu=='setting'">
          <div class="wt-setting-container">
            <h2 class="wt-container-title">设置</h2>
            <div class="wt-loginInfo-warp">
              <div class="wt-loginInfo-avatar">
                <img :src="loginUser.avatarUrl" alt="">
              </div>
              <div class="wt-loginInfo-container">
                <div class="wt-user-name">{{loginUser.name}}</div>
                <div class="wt-user-subInfo" >
                  <span class="wt-icon iconfont icon-pc wt-icon-pc"></span>
                  {{loginUser.address}}
                </div>
              </div>
            </div>
            <div class="wt-setting-list">
              <div class="wt-setting-item">
                <label><input type="checkbox" v-model="setting.isVoice"><span>消息提示音</span></label>
              </div>
              <div class="wt-setting-item">
                <label><input type="checkbox" v-model="setting.isTime"><span>显示消息时间</span></label>
              </div>
              <div class="wt-setting-item">
                <label><input type="checkbox" v-model="setting.isName"><span>显示用户名称</span></label>
              </div>
            </div>
          </div>
        </div>
        <!-- 聊天工具介绍区 -->
        <div class="wt-about-warp" v-show="currentMenu=='about'">
          <div class="wt-about-container">
            <h2 class="wt-container-title">关于</h2>
            <div class="wt-about-list">
              <div class="wt-about-item"><span>版本：v1.0</span></div>
              <div class="wt-about-item"><span>协议：MIT</span></div>
              <div class="wt-about-item"><span>GitHub：</span><a href="https://github.com/cleverqin/node-websocket-Chatroom" target="_blank">https://github.com/cleverqin/node-websocket-Chatroom</a></div>
              <div class="wt-about-item"><span>邮箱：705597001@qq.com</span></div>
              <div class="wt-about-item">
              <span>
                <a href="https://github.com/cleverqin/node-websocket-Chatroom" target="_blank">
                  <img src="https://img.shields.io/github/stars/cleverqin/node-websocket-Chatroom?label=Star&style=flat&logo=github" alt="" style="vertical-align: middle;">
                </a>
                <a href="https://github.com/cleverqin/node-websocket-Chatroom" target="_blank">
                  <img src="https://img.shields.io/github/forks/cleverqin/node-websocket-Chatroom?label=Fork&style=flat&logo=github" alt="" style="vertical-align: middle;">
                </a>
              </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <login @login="userLogin" v-if="!loginUser"></login> -->
    <transition name="slider">
      <div class="wt-logBox" v-show="isShowLog">
        <div class="wt-logHeader">
          连接日志
          <span class="wt-log-closeBtn iconfont icon-close" @click.stop="isShowLog=false"></span>
        </div>
        <div class="wt-log-container" @click.stop="">
          <div class="ui-scroll wt-log-list" id="log-container">
            <div class="wt-log-item" v-for="log in logs">
              <span :class="'wt-log-'+log.type">{{log.text}}</span>
              <span class="wt-log-time">{{log.time|formatTime}}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="slider">
      <div class="wt-alter-message" v-show="isAlter">{{alterMessage}}</div>
      </transition>
      <!-- <audio src="/assets/images/8400.mp3" ref="audio"></audio>   -->
      <!-- <a-player></a-player>   -->
  </div>
</template>
<script src="@/tools/chatroom.js" ></script>
<script>
import '@/tools/chatroom.js'
import aPlayer from './aPlayer.vue';
    export default{
        data(){
            let QQ=[
                {title:"微笑]",url: "/微笑.gif"},
                {title:"[撇嘴]",url: "/撇嘴.gif"},
                {title:"[色]",url: "/色.gif"},
                {title:"[发呆]",url: "/发呆.gif"},
                {title:"[得意]",url: "/得意.gif"},
                {title:"[流泪]",url: "/流泪.gif"},
                {title:"[害羞]",url: "/害羞.gif"},
                {title:"[闭嘴]",url: "/闭嘴.gif"},
                {title:"[睡]",url: "/睡.gif"},
                {title:"[大哭]",url: "/大哭.gif"},
                {title:"[尴尬]",url: "/尴尬.gif"},
                {title:"[呲牙]",url: "/呲牙.gif"},
                {title:"[发怒]",url: "/发怒.gif"},
                {title:"[调皮]",url: "/调皮.gif"},
                {title:"[惊讶]",url: "/惊讶.gif"},
                {title:"[难过]",url: "/难过.gif"},
                {title:"[酷]",url: "/酷.gif"},
                {title:"[冷汗]",url: "/冷汗.gif"},
                {title:"[抓狂]",url: "/抓狂.gif"},
                {title:"[吐]",url: "/吐.gif"},
                {title:"[偷笑]",url: "/偷笑.gif"},
                {title:"[可爱]",url: "/可爱.gif"},
                {title:"[白眼]",url: "/白眼.gif"},
                {title:"[傲慢]",url: "/傲慢.gif"},
                {title:"[饥饿]",url: "/饥饿.gif"},
                {title:"[困]",url: "/困.gif"},
                {title:"[惊恐]",url: "/惊恐.gif"},
                {title:"[流汗]",url: "/流汗.gif"},
                {title:"[憨笑]",url: "/憨笑.gif"},
                {title:"[大兵]",url: "/大兵.gif"},
                {title:"[奋斗]",url: "/奋斗.gif"},
                {title:"[咒骂]",url: "/咒骂.gif"},
                {title:"[疑问]",url: "/疑问.gif"},
                {title:"[嘘]",url: "/嘘.gif"},
                {title:"[晕]",url: "/晕.gif"},
                {title:"[折磨]",url: "/折磨.gif"},
                {title:"[衰]",url: "/衰.gif"},
                {title:"[骷髅]",url: "/骷髅.gif"},
                {title:"[敲打]",url: "/敲打.gif"},
                {title:"[再见]",url: "/再见.gif"},
                {title:"[擦汗]",url: "/擦汗.gif"},
                {title:"[抠鼻]",url: "/抠鼻.gif"},
                {title:"[鼓掌]",url: "/鼓掌.gif"},
                {title:"[嗅大了]",url: "/嗅大了.gif"},
                {title:"[坏笑]",url: "/坏笑.gif"},
                {title:"[左哼哼]",url: "/左哼哼.gif"},
                {title:"[右哼哼]",url: "/右哼哼.gif"},
                {title:"[哈欠]",url: "/哈欠.gif"},
                {title:"[鄙视]",url: "/鄙视.gif"},
                {title:"[委屈]",url: "/委屈.gif"},
                {title:"[可怜]",url: "/可怜.gif"},
                {title:"[阴险]",url: "/阴险.gif"},
                {title:"[亲亲]",url: "/亲亲.gif"},
                {title:"[吓]",url: "/吓.gif"},
                {title:"[快哭了]",url: "/快哭了.gif"},
                {title:"[菜刀]",url: "/菜刀.gif"},
                {title:"[西瓜]",url: "/西瓜.gif"},
                {title:"[啤酒]",url: "/啤酒.gif"},
                {title:"[篮球]",url: "/篮球.gif"},
                {title:"[乒乓]",url: "/乒乓.gif"},
                {title:"[咖啡]",url: "/咖啡.gif"},
                {title:"[饭]",url: "/饭.gif"},
                {title:"[猪头]",url: "/猪头.gif"},
                {title:"[玫瑰]",url: "/玫瑰.gif"},
                {title:"[凋谢]",url: "/凋谢.gif"},
                {title:"[心]",url: "/心.gif"},
                {title:"[心碎]",url: "/心碎.gif"},
                {title:"[蛋糕]",url: "/蛋糕.gif"},
                {title:"[闪电]",url: "/闪电.gif"},
                {title:"[炸弹]",url: "/炸弹.gif"},
                {title:"[刀]",url: "/刀.gif"},
                {title:"[足球]",url: "/足球.gif"},
                {title:"[瓢虫]",url: "/瓢虫.gif"},
                {title:"[便便]",url: "/便便.gif"},
                {title:"[夜晚]",url: "/夜晚.gif"},
                {title:"[太阳]",url: "/太阳.gif"},
                {title:"[礼物]",url: "/礼物.gif"},
                {title:"[拥抱]",url: "/拥抱.gif"},
                {title:"[强]",url: "/强.gif"},
                {title:"[弱]",url: "/弱.gif"},
                {title:"[握手]",url: "/握手.gif"},
                {title:"[胜利]",url: "/胜利.gif"},
                {title:"[抱拳]",url: "/抱拳.gif"},
                {title:"[勾引]",url: "/勾引.gif"},
                {title:"[拳头]",url: "/拳头.gif"},
                {title:"[差劲]",url: "/差劲.gif"},
                {title:"[爱你]",url: "/爱你.gif"},
                {title:"[NO]",url: "/NO.gif"},
                {title:"[OK]",url: "/OK.gif"},
                {title:"[爱情]",url: "/爱情.gif"},
                {title:"[飞吻]",url: "/飞吻.gif"},
                {title:"[发财]",url: "/发财.gif"},
                {title:"[帅]",url: "/帅.gif"},
                {title:"[雨伞]",url: "/雨伞.gif"},
                {title:"[高铁左车头]",url: "/高铁左车头.gif"},
                {title:"[车厢]",url: "/车厢.gif"},
                {title:"[高铁右车头]",url: "/高铁右车头.gif"},
                {title:"[纸巾]",url: "/纸巾.gif"},
                {title:"[右太极]",url: "/右太极.gif"},
                {title:"[左太极]",url: "/左太极.gif"},
                {title:"[献吻]",url: "/献吻.gif"},
                {title:"[街舞]",url: "/街舞.gif"},
                {title:"[激动]",url: "/激动.gif"},
                {title:"[挥动]",url: "/挥动.gif"},
                {title:"[跳绳]",url: "/跳绳.gif"},
                {title:"[回头]",url: "/回头.gif"},
                {title:"[磕头]",url: "/磕头.gif"},
                {title:"[转圈]",url: "/转圈.gif"},
                {title:"[怄火]",url: "/怄火.gif"},
                {title:"[发抖]",url: "/发抖.gif"},
                {title:"[跳跳]",url: "/跳跳.gif"},
                {title:"[爆筋]",url: "/爆筋.gif"},
                {title:"[沙发]",url: "/沙发.gif"},
                {title:"[钱]",url: "/钱.gif"},
                {title:"[蜡烛]",url: "/蜡烛.gif"},
                {title:"[枪]",url: "/枪.gif"},
                {title:"[灯]",url: "/灯.gif"},
                {title:"[香蕉]",url: "/香蕉.gif"},
                {title:"[吻]",url: "/吻.gif"},
                {title:"[下雨]",url: "/下雨.gif"},
                {title:"[闹钟]",url: "/闹钟.gif"},
                {title:"[囍]",url: "/囍.gif"},
                {title:"[棒棒糖]",url: "/棒棒糖.gif"},
                {title:"[面条]",url: "/面条.gif"},
                {title:"[车]",url: "/车.gif"},
                {title:"[邮件]",url: "/邮件.gif"},
                {title:"[风车]",url: "/风车.gif"},
                {title:"[药丸]",url: "/药丸.gif"},
                {title:"[奶瓶]",url: "/奶瓶.gif"},
                {title:"[灯笼]",url: "/灯笼.gif"},
                {title:"[青蛙]",url: "/青蛙.gif"},
                {title:"[戒指]",url: "/戒指.gif"},
                {title:"[K歌]",url: "/K歌.gif"},
                {title:"[熊猫]",url: "/熊猫.gif"},
                {title:"[喝彩]",url: "/喝彩.gif"},
                {title:"[购物]",url: "/购物.gif"},
                {title:"[多云]",url: "/多云.gif"},
                {title:"[鞭炮]",url: "/鞭炮.gif"},
                {title:"[飞机]",url: "/飞机.gif"},
                {title:"[气球]",url: "/气球.gif"}
                ]
            return {
            loginUser:null ,
            currentMenu:"session",
            setting:{
                isVoice:true,
                isTime:true,
                isName:true
            },
            about:{
                version:"",
                license:"",
                url:"",
                email:""
            },
            sessionList:[],
            sessionId:"",
            messages:{},
            text:"",
            qqExpression:QQ,
            baseUrl:"../../../assets/images/qq",
            isShow:false,
            keyword:"",
            isShowLog:false,
            logs:[],
            alterMessage:"",
            isAlter:false
            }
        },
        created(){
          console.log(loginUser)
          this.initSocket();
          this.userLogin();
         

            
        },
        components:{
          aPlayer
        },
        computed:{
            session(){
              let session=null,
                  sessionId=this.sessionId;
              this.sessionList.forEach((item,index)=>{
                  if(item.id==sessionId){
                  session=item;
                  }
              })
              return session;
            },
            messageList(){
              if(this.sessionId==''){
                  return []
              }
              if(this.messages[this.sessionId]){
                  return this.messages[this.sessionId]
              }else {
                  return [];
              }
            },
            
           
        },
        methods:{
            changeSession(user){
              let sessionId=user.id;
              let messageList=this.messages[sessionId];
              if(messageList){
                  messageList.forEach((item)=>{
                  item.isRead=true;
                  })
              }
              this.sessionId=sessionId;
              this.scrollFooter();
            },
            sendMessage(msg){
              console.log(msg)
              if(msg==""){
                  return;
              }
              let message={
                  channelId:this.sessionId,
                  from:this.loginUser,
                  to:this.session,
                  content:msg,
                  time:new Date().getTime(),
                  type:"text",
                  isRead:true
              }
              if(!this.messages[this.sessionId]){
                  this.$set(this.messages,this.sessionId,[])
              }
              this.messages[this.sessionId].push(message);
              this.text="";
              this.scrollFooter();
              if(this.$socket){
                  this.$socket.emit("message",message.from,message.to,message.content,"text");
              }
            },
            receiveMessage(from,to,msg,type){
              if(msg==""){
                  return;
              }
              let channelId=to.type=='group'?to.id:from.id;
              let isRead=channelId==this.sessionId;
              let message={
                  channelId:channelId,
                  from:from,
                  to:to,
                  content:msg,
                  time:new Date().getTime(),
                  type:type,
                  isRead: isRead
              }
              if(!this.messages[channelId]){
                  this.$set(this.messages,channelId,[])
              }
              this.messages[channelId].push(message);
              this.text="";
              if(isRead){
                  this.scrollFooter();
              }else{
                  if(this.setting.isVoice&&this.$refs.audio){
                  if(to.type!='group'){
                      this.$refs.audio.play();
                  }
                  }
              }
            },
            scrollFooter(){
              let $list=this.$refs['messageList'];
              if($list){
                  this.$nextTick(()=>{
                  $list.scrollTop = $list.scrollHeight
                  })
              }
            },
            getLastMessage(sessionId){
              let messageList=this.messages[sessionId];
              if(messageList){
                  let len=messageList.length;
                  if(messageList.length>0){
                  return {
                      time:messageList[len-1].time,
                      content:messageList[len-1].content
                  }
                  }else {
                  return {
                      time:null,
                      content:""
                  }
                  }
              }else {
                  return {
                  time:null,
                  content:""
                  }
              }
            },
            getUnReaderNum(sessionId){
              let messageList=this.messages[sessionId];
              if(messageList){
                  let len=messageList.length;
                  if(len>0){
                  let count=0;
                  messageList.forEach((item)=>{
                      if(!item.isRead){
                      count++;
                      }
                  })
                  if(count>99){
                      return "99+"
                  }else {
                      return count;
                  }
                  }else {
                  return 0
                  }
              }else {
                  return 0
              }
            },
            showExpression(){
              let _this=this;
              _this.isShow=!_this.isShow;
              function hide(){
                  _this.isShow=false;
                  document.removeEventListener('click',hide)
              }
              _this.$nextTick(()=>{
                  document.addEventListener('click',hide)
              })
              },
              selectExpression(expression){
              this.text+=expression.title;
            },
            parseText(text){
              let arr=this.qqExpression;
              let baseUrl=this.baseUrl;
              const getIndex=(title)=>{
                  let index=-1;
                  arr.forEach((item,i)=>{
                  if(item.title==title){
                      index=i;
                  }
                  });
                  return index;
              }
              if(typeof (text) != "undefined") {
                  let sArr = text.match(/\[.*?\]/g);
                  console.log(sArr)
                  if(sArr&&sArr.length>0){
                  for(let i = 0; i < sArr.length; i++){
                      let index=getIndex(sArr[i]);
                      if(index!=-1) {
                        console.log(baseUrl+arr[index].url)
                        let url = require(`../../../assets/images/qq${arr[index].url}`)
                      const reStr = `<img src="${url}"  height='20' width='20' />`;
                      text = text.replace(sArr[i], reStr);
                      console.log(text)
                      }
                  }
                  }
              }
              return text;
            },
            searchUser(keyword){
              console.log(this.sessionList)
              let arr=[],_this=this;
              this.sessionList.forEach( (item )=>{
                 
                      if((item.userName.indexOf(keyword)!=-1)||(item.id.indexOf(keyword)!=-1)){
                      arr.push(item)
                      }
              })
              return arr;
            },
            //用户登录
            userLogin(){
              let user  =  this.$store.state.userinfo;
              console.log('user',user)
              if(this.$socket){
                  this.$socket.emit("login",user);
              }else {
                  user.id="user_"+new Date().getTime();
                  user.deviceType="pc";
                  this.saveLog(user.name+"登陆成功",'success')
                  this.loginUser=user;
              }
            },
            showLogs(){
              let _this=this;
              _this.isShowLog=!_this.isShowLog;
              function show() {
                  _this.isShowLog=false;
                  document.removeEventListener('click',show)
              }
              document.addEventListener("click",show)
            },
            //添加日志信息
            saveLog(text,type){
              this.logs.push({
                  text:text,
                  type:type,
                  time:new Date().getTime()
              })
            },
            //初始化 socket监听函数
            initSocket(){
                let _this=this;
                // this.$socket=io('ws://localhost:5008');
                this.$socket.on("message",(from,to,message,type)=>{
                    _this.receiveMessage(from,to,message,type)
                })
                this.$socket.on("system",(user,type)=>{
                    switch (type) {
                    case "join":
                        _this.addUser(user);
                        break;
                    case "logout":
                        _this.removeUser(user);
                        if(user.id==_this.threadId){
                        document.title="欢迎使用webTalk聊天应用！"
                        }
                        break;
                    default:
                        return;
                    }
                })
                this.$socket.on("error",(error)=>{
                    console.log("出错了！！")
                    _this.saveLog("socket链接出错了！"+JSON.stringify(error),"error");
                })
                this.$socket.on("connection",(data)=>{
                    console.log("链接成功！",data)
                    _this.saveLog("连接成功！"+JSON.stringify(data),"success");
                    _this.isOnline=true;
                })
                this.$socket.on("disconnect",(data)=>{
                    _this.isOnline=false;
                    console.log(JSON.stringify(data)+ ' - disconnect');
                    _this.saveLog("断开连接！"+JSON.stringify(data)+ ' - disconnect',"warning");
                })
                this.$socket.on("connect_error",(data)=>{
                    _this.isOnline=false;
                    console.log(JSON.stringify(data)+ ' - connect_error')
                    _this.saveLog("连接出错了！"+JSON.stringify(data)+ ' - connect_error',"error");
                })
                this.$socket.on("connect_timeout",(data)=>{
                    _this.isOnline=false;
                    console.log(JSON.stringify(data)+ ' - connect_timeout')
                    _this.saveLog("连接超时！"+JSON.stringify(data)+ ' - connect_timeout',"warning");
                })
                this.$socket.on("reconnect",(data)=>{
                    console.log(JSON.stringify(data)+ ' - reconnect')
                    _this.saveLog("重新连接！"+JSON.stringify(data)+ ' - reconnect',"info");
                })
                this.$socket.on("reconnect_attempt",(data)=>{
                    if(_this.loginUser){
                    this.$socket.io.opts.query={
                        User:_this.loginUser.id?JSON.stringify(_this.loginUser):''
                    }
                    _this.saveLog("尝试重新连接！"+JSON.stringify(data)+ ' - reconnect_attempt',"info");
                    }
                })
                this.$socket.on("loginSuccess",(user,users)=>{
                    _this.loginUser=user;
                    _this.sessionList=users;
                })
                this.$socket.on("loginFail",(message)=>{
                    _this.showAlterMessage(message)
                    console.log(message)
                })
            },
            addUser(user){
              let _this=this;
              let index=-1;
              for (let i = 0; i < _this.sessionList.length; i++) {
                  let item = _this.sessionList[i];
                  if(user.id==item.id){
                  index=i;
                  _this.sessionList[i]=user;
                  }
              }
              if(index==-1){
                  _this.sessionList.push(user);
              }
            },
            removeUser(user){
              let _this=this;
              for (let i = 0; i < _this.sessionList.length; i++) {
                  let item = _this.sessionList[i];
                  if(user.id==item.id){
                  _this.sessionList.splice(i,1);
                  break;
                  }
              }
            },
            showAlterMessage(message){
              let _this=this;
              this.alterMessage=message;
              _this.isAlter=true;
              let inter=setTimeout(()=>{
                  clearTimeout(inter);
                  _this.isAlter=false;
              },3000)
            },
             //  myself Methods:
        },
        filters:{
            friendlyTime(value){
            let time=new Date().getTime();
            time=parseInt((time-value)/1000);
            //存储转换值
            let s;
            if(time<60*3){//三分钟内
                return '刚刚';
            }else if((time<60*60)&&(time>=60*3)){
                //超过十分钟少于1小时
                s = Math.floor(time/60);
                return  s+"分钟前";
            }else if((time<60*60*24)&&(time>=60*60)){
                //超过1小时少于24小时
                s = Math.floor(time/60/60);
                return  s+"小时前";
            }else if((time<60*60*24*3)&&(time>=60*60*24)){
                //超过1天少于3天内
                s = Math.floor(time/60/60/24);
                return s+"天前";
            }else{
                //超过3天
                let date= new Date(value);
                return date.getFullYear()+"."+(date.getMonth()+1)+"."+date.getDate();
            }
            },
            formatTime(value){
            let date=new Date(value);
            let year=date.getFullYear();
            let month=date.getMonth()+1;
            let day=date.getDate();
            let hour=date.getHours()>9?date.getHours():("0"+date.getHours());
            let minutes=date.getMinutes()>9?date.getMinutes():("0"+date.getMinutes());
            let seconds=date.getSeconds()>9?date.getSeconds():("0"+date.getSeconds());
            return year+"."+month+"."+day+" "+hour+":"+minutes+":"+seconds;
            }
        },
        beforeRouteEnter:function(to,from,next){
            console.log(to,from)
        }
    }
</script>
<style src="@/assets/css/webTalk.css"></style>
<style src="@/assets/css/iconfont.css"></style>