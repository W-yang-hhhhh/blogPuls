<template>
     <div class="area-box">
        <div class="send-box">
               <span class='icon emoji'   @click="show_emoji=!show_emoji">&#x1f600;</span>
            <span class="icon circular">+</span>
            <span class="submit" @click="sendMessage()">发送</span>
            <div v-show="show_emoji" class="emoji_box">
                <div class="emoji_list">
                    <span v-for="(v,index) in sample_list.emoji" @click="selectEmoji(index)">{{v}}</span>
                </div>
            </div>
        </div>
        
         <!-- <textarea  class="bottom-box" v-model="content" @input="content=$event.target.innerHTML" name="chatting" ref='chatting' id="" cols="30" rows="10" ></textarea> -->
     <div contenteditable="true"
       class="bottom-box" 
       v-model="content" 
       @input="content=$event.target.innerHTML" 
       name="chatting" 
       ref='chatting'  
       @blur="contentBlur"
       @click="contentFoucs"
       ></div>
    </div> 
</template>
<script>
import emoji from './emoji_database.js'
export default {
    data(){
        return{
            show_emoji:false,
            sample_list:[],
            content:'',
             range: {},
            selection: {},
        }
    },
    props:['send'],
    methods:{
         contentFoucs (index) {
              this.selection  =window.getSelection();
              this.range = this.selection.getRangeAt(0);
            //   console.log(this.range.startOffset,this.range.endOffset);
                },
            contentBlur(){
                     const  chatDom = this.$refs.chatting; 
                     this.selection  =window.getSelection();
                    this.range = this.selection.getRangeAt(0);
              console.log(this.range.startOffset,this.range.endOffset);
                 
            
            },
            selectEmoji:function(index){
                /**这一种方法适用于 textarea */
                //    const  chatDom = this.$refs.chatting;        
                //     if((chatDom.selectionStart || chatDom.selectionStart ==0)&& chatDom.selectionStart!= chatDom.selectionEnd){
                //         var start=chatDom.selectionStart;
                //         var end = chatDom.selectionEnd;
                //         // var ss = chatDom.value.substring(start, end);
                //          chatDom.innerText = chatDom.innerText.substring(0, start)+ this.sample_list.emoji_text[index]+chatDom.innerText.substring(end, chatDom.innerText.length)
                //          chatDom.focus();
                //    }else{
                //         var start = chatDom.selectionStart;
                //         chatDom.innerText =chatDom.innerText.substring(0, start)+ this.sample_list.emoji_text[index]+chatDom.innerText.substring(start, chatDom.innerText.length)
                //         chatDom.focus();
                //    }       
                // this.range = this.selection.getRangeAt(0);
               
                 console.log(this.range,this.selection)
                 console.log(this.range.startOffset,this.range.endOffset);
                  const  chatDom = this.$refs.chatting; 
                       if(this.range.startOffset==this.range.endOffset){
                           var start =this.range.startOffset
                        //    this.range.insertNodeContent(this.sample_list.emoji_text[index])
                        //  chatDom.innerText = chatDom.innerText.substring(0, start)+this.sample_list.emoji[index] +chatDom.innerText.substring(start, chatDom.innerText.length)
                       chatDom.innerText= this.content =   this.content.substring(0, start)+this.sample_list.emoji[index] + this.content.substring(start, chatDom.innerText.length)
                        // console.log( this.range.insertNodeContent)
                        
                       }else{
                           var start =this.range.startOffset;
                           var  end =this.range.endOffset;
                            //  chatDom.innerText = chatDom.innerText.substring(0, start)+this.sample_list.emoji[index] +chatDom.innerText.substring(end, chatDom.innerText.length)
                   chatDom.innerText =      this.content =   this.content.substring(0, start)+this.sample_list.emoji[index] + this.content.substring(end, chatDom.innerText.length)
                       }

                    //    this.range = this.selection.getRangeAt(0)
                      
                    //    chatDom.focus();
                 
            },    
            
            sendMessage:function(){
                // var textarea = this.$refs.chatting 
                console.log(this.content)
                var textarea = $('.bottom-box')
                if(this.content==''){
                    return;
                }
 
                 this.$emit('click',this.content);
                this.content='';
                textarea.html('')
               
                textarea.focus();
            }
    },
    created(){
        this.sample_list = emoji();
      
    
    }
}   
</script>
<style src='@/assets/css/sendFrame.css'>

</style>


