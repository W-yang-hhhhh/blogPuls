<template>
    <div class="container-fluid" >
         
        <div class="row">
            <div class="col-12 border text-center pt-1 pb-1" style="background:rgb(68,174,165)">
                <h3 style="color:white">Let's Chat !</h3>
            </div>
        </div>
        <div class="row mt-5 d-flex justify-content-around">
            <div class="col-md-3 col-11 userinfo">
                <div class="row justify-content-around">
                    <h4 style="color:rgb(68,174,165)">CONNECTED USER</h4>
                  
                </div>
                <div class="row border">
                    <!-- 用户名列表 -->
                    <ul style="width:100%" class="text-center">
                        <li
                        v-for="item in userList">{{item}}</li>
                        
                    </ul>
                </div>
            </div>
            <div class="col-md-7 col-11 chatroom ">
                    <!-- 用户名字填写 -->
                   <div v-if="ischange" class="row justify-content-around shadow pt-3 pb-3">
                       <h4 style="color:rgb(68,174,165);margin-top:15px;">Give yourself a nickname</h4>
                       <input class="col-10" type="text"
                        placeholder="Name"
                        style="
                        margin-top:10px;
                        outline:none;
                        maring-top:5px;
                        border-bottom:1px solid #dee2e6;
                        border-top:0;
                        border-left:0;
                        border-right:0;
                        "
                        v-model="username"
                         @keydown.enter="sendName()"
                        >
                       <button class="col-3" style="
                       border:0;
                       padding-top:2px;
                       padding-bottom:2px;
                       padding-right:4px;
                       padding-left:4px;
                       display:block;
                       background:rgb(68,174,165);
                       color:white;
                       font-size:13px;
                       cursor:pointer;
                       margin-top:20px;
                       justify-content-end;
                       outline:none;
                       "
                       @click="sendName()"
                      

                       >Let's Chat!</button>
                   </div>
                    <!-- 聊天室 -->
                    <div v-else class="row  shadow pt-3 pb-3 " >
                        <div class="col-12 text-center " style="background:rgb(73,97,110); height:0; padding-bottom:50%; overflow:scroll">
                            
                            <h6 style="color:rgb(68,174,165);margin-top:15px;">Welcome {{username}} joined chat!</h6>
                              <ul class="row-12 text-left">
                                    <li v-for="item in messageList" 
                                    style="
                                    display:block;
                                    color:white;
                                    font-weight:bolder;
                                    ">
                                    <span style="color:grey">{{item.name}}</span>
                                    :{{item.message}}</li>
                              </ul>
                        </div>
                       <input class="col-12" type="text"
                        placeholder="message"
                        style="
                        margin-top:10px;
                        outline:none;
                        maring-top:5px;
                        border-bottom:1px solid #dee2e6;
                        border-top:0;
                        border-left:0;
                        border-right:0;
                        "
                        v-model="message"
                        @keydown.enter="sendMessage()"
                        >
                      <div class="col-12 d-flex justify-content-end">
                           <button class="" style="
                       border:0;
                       padding-top:2px;
                       padding-bottom:2px;
                       padding-right:4px;
                       padding-left:4px;
                       background:rgb(68,174,165);
                       color:white;
                       font-size:13px;
                       cursor:pointer;
                       margin-top:20px;
                       outline:none;
                       
                       "
                       @click="sendMessage()"   >Send Message</button>
                      </div>
                    </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            ischange:true,
            username:'',
            userList:[],
            message:'',
            messageList:[]

        }
    },
    methods:{
        sendName:function(){
            console.log('触发键盘事件')
            if(this.username){
                    this.$socket.emit('logins',this.username,e=>{
                    this.ischange = false;
                    })
            }
        },
        sendMessage:function(){
            if(this.message.trim() ==''){
                alert('不能发送空信息');
                return ;
            }
            this.$socket.emit('chat message',this.message);
            this.message = ''

        },
        keydown:function(){
            console.log(111111111111111)
        }
    },
    created(){
        if(this.$socket){
            console.log('正在连接')
        }
        this.$socket.on('loaduser',user=>{
            this.userList =user;
        })
        this.$socket.on('output',data=>{
             this.messageList.push(data);
             console.log(this.messageList)
        })
    }
}
</script>
