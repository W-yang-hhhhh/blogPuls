<template id="aPlayer">
  <div class="ui-aPlayer-warp" :class="{'ui-aPlayer-hide':!isPlayer}">
    <div class="ui-aPlayer-container">
      <!--封面-->
      <div class="ui-aPlayer-poster">
        <img :src="curSong.image" alt="封面">
        <svg t="1592281805404" class="ui-load-error" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3681" width="200" height="200" v-if="isError">
          <path d="M512 85.333333C277.333333 85.333333 85.333333 277.333333 85.333333 512s192 426.666667 426.666667 426.666667 426.666667-192 426.666667-426.666667S746.666667 85.333333 512 85.333333z m42.666667 640h-85.333334v-85.333333h85.333334v85.333333z m0-170.666666h-85.333334V298.666667h85.333334v256z" p-id="3682" fill="#cdcdcd"></path>
        </svg>
      </div>
      <!--歌曲信息，歌名、歌手、时间-->
      <div class="ui-aPlayer-infoBox">
        <div class="ui-song-infoRow ui-song-name">{{curSong.title}}</div>
        <div class="ui-song-infoRow ui-song-author">{{curSong.author}}</div>
        <div class="ui-song-infoRow ui-song-time">{{totalTime | formatTime}}</div>
      </div>
      <!--播放器控制器，上一曲、播放/暂停、下一曲-->
      <div class="ui-aPlayer-ctlBox">
        <div class="ui-ctrl-col">
          <span class="iconfont icon-prev" @click="prevSong"></span>
        </div>
        <div class="ui-ctrl-col ui-toggle-ctrl">
          <span class="iconfont" @click="togglePlay" :class="isPlay?'icon-pause':'icon-play'"></span>
        </div>
        <div class="ui-ctrl-col">
          <span class="iconfont icon-next" @click="nextSong"></span>
        </div>
      </div>
      <!--音量控制器，调节播放音量-->
      <div class="ui-aPlayer-volBox">
        <span class="iconfont ui-vol-icon" :class="volume==0?'icon-mute':'icon-voice'"></span>
        <div class="ui-voice-box"></div>
      </div>
      <!--播放器功能菜单，歌词显示、播放列表-->
      <div class="ui-aPlayer-menuBox">
        <span class="ui-aPlayer-lrcBtn" @click="isLrc=!isLrc">词</span>
        <span class="ui-aPlayer-listBtn iconfont icon-menu" @click="isList=!isList"></span>
      </div>
      <!--播放器时间进度-->
      <div class="ui-aPlayer-timeBox"></div>
      <span class="ui-aPlayer-curTime">{{curTime | formatTime}}</span>
    </div>
    <div class="ui-aPlayer-toggleShowBtn" @click="isPlayer=!isPlayer">
      <span class="iconfont icon-left ui-toggle-showBtn"></span>
      <span class="iconfont icon-right ui-toggle-showBtn"></span>
    </div>
    <div class="ui-aPlayer-lrcBox" :class="{'ui-aPlayer-lrcHide':!isLrc}">
      <div class="ui-aPlayer-lrcWarp"></div>
      <span class="ui-close-lrcBtn iconfont icon-close" @click="isLrc=false"></span>
    </div>
    <audio></audio>
    <div class="ui-aPlayer-songsWarp" :class="{'ui-aPlayer-songsHide':!isList}">
      <div class="ui-songs-header">
        <span class="ui-header-text">歌曲列表</span>
        <span class="ui-songs-num">({{songList.length}})</span>
        <span class="ui-close-listBtn iconfont icon-xiangxia" @click="isList=false"></span>
      </div>
      <div class="ui-songListWarp scroll">
        <div class="ui-song-item" v-for="item in songList" :key="item.id" :class="{active:item.id==curSong.id}">
          <span class="iconfont icon-bofang ui-play-cur"></span>
          <span class="ui-song-info">{{item.title}}-{{item.author}}</span>
          <div class="ui-song-btnBox">
            <span class="iconfont icon-bofang" @click="play(item)"></span>
            <span class="iconfont icon-up" @click="moveUp(item)"></span>
            <span class="iconfont icon-down" @click="moveDown(item)"></span>
            <span class="iconfont icon-shanchu" @click="deleteSong(item)"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/tools/chatroom.js'
import {LRC,UiProgress,utils} from '@/tools/chaRoom.js'
import axios from 'axios'
import jsonp from 'jsonp'

 export default{
  data(){
    return {
      songList:[],
      curSong:{},
      totalTime:0,
      curTime:0,
      volume:0.5,
      isPlay:false,
      isPlayer:false,
      isLrc:false,
      isList:false,
      isError:false,
    }
  },
  filters:{
    formatTime(value){
      let m=parseInt(value/60);
      let s=parseInt(value%60);
      if(m<=9){
        m="0"+m;
      }
      if(s<=9){
        s="0"+s;
      }
      return m+":"+s;
    }
  },
  mounted(){
    this.init();
    console.log(UiProgress,utils)
    // console.log(jsonp)
    console.log(this.$http)
    this.$http.jsonp("https://api.asilu.com/163music/?type=playlist&id="+545888750)
      .then(function (response) {
        let list=response.body.songs;
        this.songList=list;
        this.changeSong(list[0]);
      })
    // axios({
    //     method:'get',
    //     url:'https://api.asilu.com/163music/?type=playlist&id=545888750'
    // }).then((res)=>{
    //   console.log(res)
    // })
    // this.jsonp('https://api.asilu.com/163music/?type=playlist&id=545888750').then((res)=>{
    //   console.log(res)
    // })

      
  },
  methods:{
    togglePlay() {
      if(this.$audio.paused){
        this.$audio.play();
      }else {
        this.$audio.pause();
      }
    },
    changeSong(song) {
      if(this.curSong.id==song.id){
        return;
      }
      let _this=this;
      this.totalTime=0;
      this.curTime=0;
      this.timeCtrl.setPayload(0);
      this.timeCtrl.setProgress(0);
      this.getLrc("https://api.asilu.com/163music/?type=songlrc&lrc=lrc&id="+song.id,(body)=>{
        let lrcText=body?body:"";
        _this.lrcCtrl.loadLrcText(lrcText)
      })
      this.$audio.src='https://music.163.com/song/media/outer/url?id='+song.id+'.mp3';
      this.isError=false;
      this.curSong=song;
    },
    play(song){
      this.changeSong(song);
      this.$audio.play();
    },
    nextSong() {
      let len =this.songList.length;
      let index=this.findIndex(this.curSong);
      let isPaused=this.$audio.paused;
      if(len>0){
        let nextIndex=index+1;
        if((nextIndex>=0)&&(nextIndex<len)){
          let song=this.songList[nextIndex];
          this.changeSong(song);
        }else {
          let song=this.songList[0];
          this.changeSong(song);
        }
        if(!isPaused){
          this.$audio.play();
        }
      }
    },
    prevSong() {
      let len =this.songList.length;
      let index=this.findIndex(this.curSong);
      let isPaused=this.$audio.paused;
      if(len>0){
        let prevIndex=index-1;
        if((prevIndex>=0)&&(prevIndex<len)){
          let song=this.songList[prevIndex];
          this.changeSong(song);
        }else {
          let song=this.songList[len-1];
          this.changeSong(song);
        }
        if(!isPaused){
          this.$audio.play();
        }
      }
    },
    moveUp(song) {
      let index=this.findIndex(song);
      let len =this.songList.length;
      if(index!=-1){
        let prevIndex=index-1;
        if(prevIndex>=0){
          let prevSong=this.songList[prevIndex];
          this.$set(this.songList,prevIndex,song);
          this.$set(this.songList,index,prevSong);
          let $songList=this.$el.querySelector('.ui-songListWarp');
          this.$nextTick(()=>{
            $songList.scrollTop-=28;
          })
        }
      }
    },
    moveDown(song) {
      let index=this.findIndex(song);
      let len =this.songList.length;
      if(index!=-1){
        let nextIndex=index+1;
        if(nextIndex<len){
          let nextSong=this.songList[nextIndex];
          this.$set(this.songList,nextIndex,song);
          this.$set(this.songList,index,nextSong);
          let $songList=this.$el.querySelector('.ui-songListWarp');
          this.$nextTick(()=>{
            $songList.scrollTop+=28;
          })
        }
      }
    },
    deleteSong(song){
      let index=this.findIndex(song)
      if(index!=-1){
        this.songList.splice(index,1)
      }
    },
    init(){
      let _this=this;
      let $audio=this.$el.querySelector("audio");
      _this.$audio=$audio;
      this.volCtrl=new UiProgress({
        el:_this.$el.querySelector(".ui-voice-box"),
        progress: _this.volume,
        created() {
          _this.$audio.volume=_this.volume;
        },
        updateProgress(val,type){
          _this.$audio.volume=val;
          _this.volume=val;
        }
      });
      this.timeCtrl=new UiProgress({
        el:_this.$el.querySelector(".ui-aPlayer-timeBox"),
        progress: 0,
        updateProgress(val,type){
          if(type!='move'){
            if(_this.$audio.duration){
              _this.$audio.currentTime=_this.$audio.duration*val;
            }
          }
        }
      });
      this.lrcCtrl=new LRC({
        el:_this.$el.querySelector(".ui-aPlayer-lrcWarp")
      });
      $audio.onpause=()=>{
        _this.isPlay=false;
      }
      $audio.onplay=()=>{
        _this.isPlay=true;
      }
      $audio.onloadstart=()=>{

      }
      $audio.ontimeupdate=function (e) {
        let time=$audio.currentTime;
        _this.curTime=time;
        _this.lrcCtrl.setCurTime(time);
        if(_this.timeCtrl.isMoveing){
          return
        }
        _this.timeCtrl.setProgress(time/$audio.duration);
      }
      $audio.onended=function (e) {
        console.log("播放完毕！")
        _this.nextSong();
        $audio.play();
      }
      $audio.onerror=()=>{
        _this.isPlay=false;
        _this.isError=true;
        console.error("加载期间发生错误！")
      }
      $audio.onloadeddata=()=>{
        console.log("媒介数据已加载!")
      }
      $audio.onloadedmetadata=()=>{
        _this.totalTime=$audio.duration;
        console.log("元数据（比如分辨率和时长）被加载!")
      }
      $audio.ondurationchange=()=>{
        _this.totalTime=$audio.duration;
      }
      $audio.onprogress=()=>{
        let len =$audio.buffered.length;
        if (len<=0){
          return
        }
        let time=$audio.buffered.end(len-1);
        _this.timeCtrl.setPayload(time/$audio.duration);
      }
    },
    getLrc(url, callback) {
      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if(xhr.readyState != 4 ) return; // 4 表示数据发送完毕
        if(xhr.status == 200) {
          let rsp = xhr.responseText;
          callback(rsp);
        }
        else callback();
      }
      xhr.open('GET', url, true);
      xhr.send(null);
    },
    findIndex(song){
      let index=-1;
      this.songList.forEach((item,i)=>{
        if(item.id==song.id){
          index=i;
        }
      })
      return index;
    },
    //myself function
    //request jsonp
    jsonp(url){
      return new Promise((resolve,reject)=>{
        window.jsonCallback = (result)=>{
          resolve(result)
        }

        const JSONP = document.createElemment('script')
        JSONP.type = 'text/javascript';
        JSONP.src = url;
        document.getElementsByTagName('head')[0].appendChild(JSONP);
        setTimeout(() => {

                document.getElementsByTagName('head')[0].removeChild(JSONP)

            },500)

      })
    }
  }
 
 }
</script>
<style src="@/assets/css/webTalk.css"></style>
<style src="@/assets/css/iconfont.css"></style>

 