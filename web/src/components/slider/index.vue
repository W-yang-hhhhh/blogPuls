<template>
    <div class="row">
        <Moduled :title='hotTag'/>
        <Moduled :title='hotText'/>
        <Moduled :title='lastComments'/>
    
    </div>
   <!-- <router-link tag='a' :to="{name:'article',params:{id:item.id}}">{{item.title}}</router-link> -->
</template>
<script>
import Moduled from './module.vue'
import axios from 'axios'
export default {
    data(){
        return {
            
            hotText:{
                id:'1',
                name:'#热门文章#',
                content:[{
                name:'webpack探索-编译过程',
                url:'',
                ctime:'2020/3/20',
                views:'20'
            },{
                name:'webpack探索-编译过程',
                url:'',
                ctime:'2020/3/20',
                views:'20'
            }]
            },
            hotTag:{
                id:'2',
                name:'#热门话题#',
                content:[{
                name:'webpack探索-编译过程',
                url:'',
                ctime:'2020/3/20',
                views:'20'
            },{
                name:'webpack探索-编译过程',
                url:'',
                ctime:'2020/3/20',
                views:'20'
            }]
            },
            lastComments:{
                id:'3',
                name:'#最近留言#',
                content:[
                    {
                        comments:'这个网站真好看，十分精致',
                        author:'wy-hhhhhh',
                        ctime:'2020-7-22'
                    },
                    {
                        comments:'这个网站真好看，十分精致',
                        author:'wy-hhhhhh',
                        ctime:'2020-7-22'
                    } 
                ]
            }
        }
    },
    components:{
        Moduled,
    },
    methods:{
        rTime:function(date) {
          
    var json_date = new Date(date).toJSON();
    return new Date(new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 
    }
    },
    created(){
        axios({
            method:'get',
            url:'http://localhost:5008/api/blog/gethotBlog',
            
        }).then((res)=>{
            let result = res.data.data
        
          result =   result.map((item,index)=>{
                return {
                name:item.blog_title,
                url:item.id,
                ctime:this.rTime(item.createdAt),
                views:item.views
            }
            })
            this.hotText.content = result
        });

        axios({
            method:'get',
            url:'http://localhost:5008/api/tag/getHotTag'
        }).then((res)=>{
            let result = res.data.data;
           
            this.hotTag.content = result.map((item,index)=>{
                return{
                 
                name:item.tag,
                url:'',
                ctime:this.rTime(item.createdAt),
                views:item.likes
           
                }
            })
        })
    }
}
</script>

