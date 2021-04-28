<template>
    <div class="col-md-11">
        <span>有什么事想要告诉大家么？</span>
        <div class="float-right" v-show="textarea.length!=0">
            <span>已输入</span>{{textarea.trim().length}}<span>字</span>
        </div>
        <textarea class=" " name="" id="" style="width:100%" rows="5" v-model="textarea"></textarea>

        <div class="footer mb-2 overflow-hidden">
            <ul style="display:inline-block">
                <li class="float-left mr-1">
                    <em class=" iconfont icon-biaoqing" style="color:#ff8140;"></em>
                    表情
                </li>
                <li class="float-left mr-1" @click="getPic()">
                    <em class=" iconfont icon-picture" style="color:#ff8140;"></em>
                    图片
                    <input ref="dom" id="files" type="file" accept="image/jpg,image/jpeg,image/png,image/gif" multiple="multiple" style="display:none" @change="preview($event)" />
                </li>
                <div v-show="isShowPic" class="pic_preview w-50 h-125 p-3 border" style="position:absolute;display:inline-block;background:#fff;z-index:3;top:22vh;left:5vw">
                    <span class="float-right" style="font-size:18px" @click="closed_up_pic()">×</span>
                    <h6>本地上传</h6>
                    <p>共{{imgDataBase.length}}张,还能再上传{{PicRest}}张 </p>
                    <div v-for="(item,index) in imgDataBase" style="display:inline-block" class="mr-2 mb-2 border">
                        <img :src="item" alt="" style="width:80px;height:80px; vertical-align: middle;" />
                    </div>
                    <!-- <form method="post" enctype="multipart/form-data" action="http://localhost:5008/uploadCirclePic">
                            <input type="file" value="" style="display:none" multiple="multiple"  />    
                        </form>    -->
                    <div id="addPic" style="" @click="getPic()">
                        ＋
                    </div>

                </div>
                <li class="float-left mr-1" @click="getvideo()">
                    <em class="iconfont icon-shipin" style="color:#ff8140;"></em>
                    视频
                    <input ref="video" id="files" type="file" accept=".mpg,.m4v,.mp4,.flv,.3gp,.mov,.avi,.rmvb,.mkv,.wmv" multiple="multiple" style="display:none" @change="preview_video($event)" />
                </li>
                <div v-show="isShowVideo" class="video_preview w-75 border p-3" style="position:absolute;top:20vh;background:#fff;z-index:3">
                    <span class="float-right" style="font-size:18px;font-weight:bold" @click="cancel_ip()">×</span>
                    <h6>上传普通视频</h6>

                    <p>请上传15GB一下的视频，请勿上传色情、反动等违法视频</p>
                    <div class="up_video_progress" v-show="!up_video_finish">
                          <span class="up_cancel" @click="cancel_ip()">取消上传</span>
                        <div class="progress w-75 ">
                            <div class="progress-bar" role="progressbar" :style="{width: progressBar+'%'}" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      

                    <div v-if="isUp" class="up_data">
                            <span>已上传:{{progressBar}}%</span>
                            <span>{{nowFileSize}}MB/{{fileSize}}MB</span>
                            <span>当前速度:{{up_speed}}MB/s</span>
                        </div>
                        <span v-if="!isUp">视频上传成功！</span>
                    </div>
                    <div v-show="!up_video_finish">
                        <label for="title">标题</label>
                        <input type="text" id="title" placeholder="好的标题可以获得更多推荐及粉丝" class="w-75 mt-2 mb-2 p-1" ref="video_topic">
                    </div>
                    <div v-show="!up_video_finish">
                        <label for="videofile">视频</label>
                        <video :src="videoSrc" crossOrigin="anonymous" controls="controls" style="width: 60%;height: auto;" ref="videoFilter" id="videofile"></video>
                    </div>
                    <div>
                        <label for="">封面</label>
                        
                        <div id="output" class="w-50 h-50 d-inline-block"></div>
                        
                    </div>
                    <input v-show="!up_video_finish" type="button" style="float:right;padding-left:4px;padding-right:4px;background:" value="完成" @click="video_finish()">
                </div>
            </ul>
            <div class="float-right ml-2">
                <input class="pl-3 pr-3 pt-1 pb-1" style="background:#ff8140;border:0;border-radius:3px" type="button" :disabled="publish_disable" value="发布" @click="publishText()">
            </div>
            <div class="float-right " style="marginTop:4px">
                <div @click="showit" class="selected "   style="position:relative;">{{jurisdiction}}V</div>
                <ul v-show="publish_jurisdiction" class="shadow" style="position:absolute;borderRadius:4px;marginTop:5px;background:#fff;">
                    <li v-for="(item,index) in jurisdiction_text" class="selectit " @click="selectit(item,index)">{{item}}</li>
                </ul>
             
            </div>

        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      publish_jurisdiction: false,
      jurisdiction_text: ['公开', '仅朋友可见', '仅自己可见🔒'],
      jurisdiction: '公开', //朋友圈权限文本
      data_type: 0, //朋友圈权限
      imgDataBase: [], //图片预览的base64编码
      PicRest: 9, //上传图片的数量限制
      isShowPic: false,
      fileList: [], //要发送请求的图片文件信息,
      isShowVideo: false,
      isUp:true,
      progressBar:0, //文件上传进度
      fileSize:0, //文件总大小
      nowFileSize:0,//当前已上传文件大小
      up_speed:0,
      source:null, //上传取消事件
      publish_disable:false,
      videoSrc:'',   //视频上传的  视频预览的地址
      up_video_finish:false, //上传视频的完成按钮
      textarea:'', //输入框的内容
      nowdata:'',// 图片 音频 的时间帧
      
    }
  },
  computed: {
    getPicRest: function() {
      return function() {
        this.PicRest = 9 - this.imgDataBase.length
      }
    }
  },
  methods: {
    //展示朋友圈权限
    showit: function() {
      this.publish_jurisdiction = !this.publish_jurisdiction
    },
    //朋友圈权限的选择
    selectit: function(text, data_type) {
      this.jurisdiction = text
      this.data_type = data_type;
      
      this.showit()
      console.log(this.jurisdiction, this.data_type)
    },
    //图片的input点击
    getPic: function() {
      if(this.isShowVideo ==true){
        var a  = confirm ("确定取消上传视频？")
        if(a){
          this.cancel_ip()
        }else{
          return ;
        }
      }
      this.$refs.dom.click()
    },
    //图片选择后的方法
    preview: function(event) {
      let file = event.path[0].files

      for (let j = 0; j < file.length; j++) {
        this.fileList.push(
          new File([file[j]], file[j].name, { type: 'image/jpeg' })
        )
      }
      console.log(this.fileList)
      if (this.imgDataBase.length <= 9) {
        let that = this
        let files = event.path[0].files
        console.log(event.path[0].files)
        for (let i = 0; i < files.length; i++) {
          var reader = new FileReader()
          reader.readAsDataURL(files[i])
          reader.onload = function(e) {
            //成功读取文件

            console.log(typeof e.target.result)
            that.imgDataBase.push(e.target.result)
            that.getPicRest()
          }
        }
        this.isShowPic = true

        console.log(this.$refs.dom.files)
      }
    },
    //视频选择后的方法
    preview_video: function(event) {
        this.isShowVideo = true;
        this.publish_disable = true;
        let that =this;
        let cancelToken = axios.CancelToken;//Axios使我修改axios原型链了。
        that.source =cancelToken.source();
        
        var files = event.path[0].files[0];
        var filelocaladress = this.$refs.video.value
        var filename = filelocaladress.substring(filelocaladress.lastIndexOf("\\")+1);
        console.log(files,filelocaladress,filename)
        //判断浏览器
        var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
        var fileSize = 0;
        //IE浏览器
        if(isIE){
            //获取上传文件的绝对路径
            var filePath = filelocaladress;
            var fileSystem = new ActiveXObject("Scripting.FileSystenobject");
            var file = fileSystem.GetFile(filePath);
            fileSize = file.Size;
        }else{
            fileSize = files.size;
        }
        var size = fileSize /1024/1024;
        if(size >50){
            alert("视频大小不能超过50M");
            //缺少清空视频的方法
            this.isShowVideo = false;
            return ;
        }
        this.fileSize = size.toFixed(1);


         //读取视频
        var fileReader = new FileReader()
        fileReader.readAsDataURL(files);
        fileReader.onload = function(e) {
              that.videoSrc = e.currentTarget.result
               
               const width = 750;
                    const height = 1360;
                    var video = document.getElementById("videofile");
                    // console.log(video, 66666);
                    video.currentTime = 5; //必须设置视频当前时长，要不然会黑屏
                    var output = document.getElementById("output");
                    // 创建画布准备截图
                    var canvas = document.createElement('canvas');
                    // 创建图片标签
                    var img = document.createElement("img");
                    // 获取视频的标签
                    video = document.getElementById('videofile');
                    video.setAttribute('crossOrigin', 'anonymous');


                     // 图片绘制
                    video.onloadeddata = (() => {
                        // 设置画布的宽高
                        canvas.width = video.clientWidth;
                        canvas.height = video.clientHeight;
                        console.log('', video.clientWidth, video.clientHeight, window.getComputedStyle(that.$refs.videoFilter).width, window.getComputedStyle(that.$refs.videoFilter).height);
                        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                        var dataURL = canvas.toDataURL('image/jpeg');
                        // console.log(dataURL,"-----")
                        img.src = dataURL;
                        //img.width = 400;
                        //img.height = 300;
                        // 添加到output盒子里面
                        output.appendChild(img);
                        // console.log(img)
                        
                    })

        }
        //上传视频
        var formData = new FormData()
        formData.append('video', files)
        let a =0;
       var nowdata = new Date().getTime();
        this.nowdata = nowdata;
        axios({
            method:'post',
            url:`http://localhost:5008/uploadCircleVideo?id=${this.$store.state.userinfo.id}&nowdata=${nowdata}`,
            data:formData,
            cancelToken:that.source.token,
            onUploadProgress: progressEvent => {
                let complete = (progressEvent.loaded / progressEvent.total * 100 | 0);
                this.up_speed = (progressEvent.loaded/1024/1024-a).toFixed(1)  ;
                 a=progressEvent.loaded/1024/1024
                // this.up_speed = progressEvent.loaded -this.up_speed;
                this.nowFileSize = (progressEvent.loaded/1024/1024).toFixed(1);
                this.progressBar = complete
            },
            
        }).then((res)=>{
          console.log(res)
            setTimeout(()=>{
              that.isUp = false
            },1000)
        }).catch((error)=>{
          console.log(error)
               if(axios.isCancel(error)){//主要是这里
               
                      // util.notification('success', '成功', '取消上传镜像操作成功');
                }
        })
    },
    video_finish:function(){
      console.log(this.$refs.video_topic.value.length)
      if(this.$refs.video_topic.value.length<=6){
        alert("请输入标题,且长度大于6")
        return;
      }
      this.publish_disable = false;
      this.up_video_finish = true;
      this.textarea = this.$refs.video_topic.value
      console.log(this.$refs.video_topic.value)
    },
    //取消上传视频
    cancel_ip:function(){
        let that = this;
        var a = confirm("是否取消上传视频？");
        if(a){
            
            let that = this;

                if(that.source){//我先判断soucre是否存在，因为如果我打开弹框不作任何操作，点击取消按钮没有这一层判断的话，that.source.cancel('取消上传');会报错。

                that.source.cancel('取消上传');//"取消上传"这几个字，会在上面catch（）的error中输出的，可以console看一下。

                }

            
            this.isShowVideo = false;
        }else{
            return ;
        }
        
    },
    //发布朋友圈
    publishText: function() {
      
      let that = this;
      if(this.textarea.trim().length==0){
        alert('不允许输入空内容！');
        return ;
      }
      var nowdata = null;
      this.isShowVideo = false;
     if(this.fileList.length!=0){
        var formData = new FormData()
      // console.log(this.$refs.dom.files)
      // var f=document.getElementById("files");
      // console.log(new FileList())
      for (let i = 0; i < this.fileList.length; i++) {
        //  formData.append("userID", userID);
        formData.append('multerFile', this.fileList[i])
      }
        nowdata = new Date().getTime()
      axios({
        method: 'post',
        url: `http://localhost:5008/uploadCirclePic?id=${
          this.$store.state.userinfo.id
        }&nowdata=${nowdata}`,
        data: formData
      }).then(res => {
        console.log(res)
      })
      //发送完post请求 清空 fileList imgDataBase
      this.fileList = []
      this.imgDataBase = []
      this.isShowPic = false
     }else{
        nowdata = this.nowdata;
     }


     //发送 发布朋友圈的请求
      let axiosData = {
       userid:this.$store.state.userinfo.id,
       username:this.$store.state.userinfo.userName,
       content:this.textarea,
       text_img:nowdata,
       text_img_count:this.fileList.length ==0 ? 1:this.fileList.length,
       parent:this.data_type,
  
      } 
     axios({
       method:'post',
       url:'http://localhost:5008/api/circle/addCircleText',
       data:axiosData
     }).then((res)=>{
       console.log(res)
       alert("发布成功！")
       that.textarea = '';
       this.$emit('getData',0,0);
     })



    },
    //上传图片模块的关闭
    closed_up_pic: function() {
      let a = confirm('确定要放弃上传的图片？')
      if (a) {
        this.isShowPic = false
        this.fileList = []
        this.imgDataBase = []
      } else {
        return
      }
    },
    //视频input的点击
    getvideo: function() {
      if(this.isShowPic ==true){
        this.closed_up_pic();
      }else{
          this.$refs.video.click()
      }
    
    },
    

  },
  created(){
      
  }
}
</script>


<style>
#addPic {
  display: inline-block;
  width: 80px;
  height: 80px;
  border: 1px dashed #eee;
  text-align: center;
  line-height: 80px;
  font-size: 20px;
  font-weight: bold;
  color: #eee;
  background: #ddd;
  vertical-align: middle;
}
#addPic:hover {
  color: rgb(255, 129, 64);
  border: 1px dashed rgb(255, 129, 64);
}
textarea {
  resize: none;
}
.up_video_progress {
  width: 100%;
  
}

.up_video_progress .up_cancel {

  float:right; 
  font-size: 13px;
  margin-right: 1vw       
}
.up_video_progress .up_cancel:hover{

  color: rgb(255, 129, 64);
 vertical-align:middle;
 
       
}
.selectit{
  padding:3px;
}
.selectit:hover{
  background: #4E6EF2;
  color:#fff;
}
.selected:hover{
  color:  #4E6EF2
}
</style>
 