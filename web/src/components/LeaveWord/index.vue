<template>
       <div class="content_left mt-5">
           <div class="description">
               <p>欢迎灌水交流，别看我长时间不发博，博主可一直都在线~</p>
               <p>欢迎灌水交流，别看我长时间不发博，博主可一直都在线~</p>
               <p>欢迎灌水交流，别看我长时间不发博，博主可一直都在线~</p>
           </div>
           <div class="blog_comments" id="blog_comments">
            <span class="blog_comments_msg">关于：目前有{{comments.length}} 条留言</span>
            <div class="blog_comment" v-for="item in comments">
                <span><b>{{item.user_name}}</b>:{{item.options}}发表于 {{item.ctime}} 12:35 <a href="#send_comment" @click ="replay(item.id,item.user_name)">[回复]</a></span>
                <div>{{item.comments}}</div>
            </div>
        </div>
        <div class="send_comment" id="send_comment">
            <span>匿名留言</span>
            <span v-if="commentdata.parentName.length!=0" >回复：{{commentdata.parentName}}</span>
            <div>
                <input type="hidden" id="comment_reply_id" value="0">
                <input type="hidden" id="comment_reply_name" value="1">
                <input type="text" placeholder="昵称(长度在2-8位)" id="comment_name" v-model="commentdata.name" >
                <input type="email" placeholder="邮箱 (评论被回复时你能收到通知)" id="comment_eamil"  v-model="commentdata.email" >
            </div>
            <div>
                <textarea name=""   cols="30" rows="10" placeholder="无意义的内容我可能不会回复你" id="comment_content" v-model="commentdata.content"  ></textarea>
            </div>
            <div>
                <input type="text" placeholder="验证码" id="comment_code" v-model="commentdata.svg" >
                <span v-html="svg" @click="getSvgCaptcha()"></span>
            </div>
            <button @click="sendComment()">提交评论</button>
             
        </div>
        </div>
</template>
<script>
import axios from 'axios'
export default {
    data(){
        return {
            svg:'',//验证码 图片
            text:'',//验证码文本
            comments_total:20,
            commentdata:{
                name:'',
                email:'',
                content:'',
                svg:'',
                parentName:'',
                parent_id:'',

            },
            comments:[{
                user_name:'wy-hhhhhh',
                options:'@sdfjkl',
                ctime:'2020-7-22',
                comments:'这个网站做的非常精致，大佬厉害！'
            },{
                user_name:'wy-hhhhhh',
                options:'@sdfjkl',
                ctime:'2020-7-22',
                comments:'这个网站做的非常精致，大佬厉害！'
            },{
                user_name:'wy-hhhhhh',
                options:'@sdfjkl',
                ctime:'2020-7-22',
                comments:'这个网站做的非常精致，大佬厉害！'
            },{
                user_name:'wy-hhhhhh',
                options:'@sdfjkl',
                ctime:'2020-7-22',
                comments:'这个网站做的非常精致，大佬厉害！'
            },]
        }
    },
    methods:{
        getSvgCaptcha:function (params) {
            axios({
                method:'get',
                url:'http://localhost:5008/captcha',
            }).then((res)=>{
              
                let result = res.data.data;
                this.svg = result.data;
                this.text = result.text;
            })
        },
        sendComment:function(){
 
            let that = this;
                // var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
                // reg.test(that.commentdata.eamil) &&
                if( this.commentdata.name.length>=2 && this.commentdata.name.length<=12 && this.commentdata.content.trim().length!=0){
                    //名字 和 邮箱 验证通过 
                    let text = this.commentdata.svg.toLowerCase();
                    if(this.text.toLowerCase() == text){
                        axios({
                            method:'post',
                            url:'http://localhost:5008/api/comment/addcomment',
                            data:{
                                    mark:0,
                                    blog_id:0,
                                    comment_content:that.commentdata.content,
                                    user_id:-1,
                                    user_name:that.commentdata.name,
                                    parent:-1,
                                    parent_id:that.commentdata.parent_id,
                                    parent_name:that.commentdata.parentName,
                                    email:that.commentdata.email,
                                    likes:0,
                                    audio_image:null,
                            }
                        }).then((res)=>{
                            console.log(res)
                            if(res.statusText=="OK"){
                                alert("评论成功！");
                               
                            }
                             this.getAnonymousComment()
                        })
                    }else{
                        alert("验证码输入错误")
                    }

                }
                // else if(!reg.test(that.commentdata.eamil)){
                //     alert("邮箱不正确,请重新输入");
                // }
                else if(!this.commentdata.name.length>=2 || !this.commentdata.name.length<=8){
                    alert("名字长度不正确，请重新输入");
                }else if(!this.commentdata.content.trim().length!=0){
                    alert('内容区不能为空');
                }
        },
        getAnonymousComment:function(){
            this.comments=[];
            let that = this;
            axios({
                method:'get',
                url:'http://localhost:5008/api/comment/getanonymousComment'
            }).then((res)=>{
                console.log(res)
                let result = res.data.data.rows;
                result.map((item,index)=>{
                  
                   that.comments.push({
                        id:item.id,
                         user_name:item.user_name,
                        options:item.parent_name.length==0? '':`@${item.parent_name}`,
                        ctime:item.createdAt,
                        comments:item.comment_content,
                    }) 
                })

            })
        },
        replay:function(id,name){
            this.commentdata.parentName = name;
            this.commentdata.parent_id = id;

        },
        confuse:function(){
            this.commentdata.parentName = '';
            this.commentdata.parent_id = '';
        }
    },
    created(){
            this.getSvgCaptcha();
            this.getAnonymousComment();
    }
}
</script>
 <style scoped src="@/assets/css/guestbook.css">
 </style>
 
