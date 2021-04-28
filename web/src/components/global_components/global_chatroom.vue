<template>
    <div class="inall">
        <div class="tagall">
            <span class="tag1" v-if="showtext">
             <router-link :to="{name:'chat2',path:'/chat2'}">公共聊天室</router-link>
            </span>
            <span class="tag2" v-if="!showtext">
                welcome to secretRoom ! 
            </span> 
        </div>   
    </div>    
</template>
<script>
export default {
    data(){
        return {
            showtext:true,
            text:false,
        }
    }
}
</script>
<style>
    .inall{
        position:fixed;
        top:20%;
        right:-16vh;
        width: 15vh;
        height:50px;
        background: #333;
        display: flex;
        flex-direction: row;
        text-align: center;
        z-index: 3;
        cursor: pointer;
        color: white;
        line-height:50px;
      
    }
    .inall::after{
        content:'<<';
        position: absolute;
        right: 100%;
        width: 50px;
        height: 50px;
        line-height:50px;
        font-size: 15px;
        background: #333;   
          border-top-left-radius: 50%;
        border-bottom-left-radius: 50%;
    }
    .inall:hover{
        position:fixed;
        top:20%;
        animation: tagtrans 1s  linear forwards;
         color:chartreuse
    }
    /* .inall .tagall{
       
        color: white;
      
        width:30%;
        font-size: 14px;
        margin-top: 5px;
        font-weight: bold;
    } */
    /* .inall .tagall:hover{
        color: aqua;
        color: #333;
      
        width:100%;
        font-size: 14px;
    } */

    @keyframes tagtrans {
        0%{
             right:-16vh;
        }
        25%{
             right:-12vh;
        }
        50%{
             right:-8vh;
        }
        75%{
             right:-4vh;
        }
        100%{
             right:0;
        }

    }
</style>
