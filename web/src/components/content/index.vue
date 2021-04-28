<template>
    <div>
        <ArticleModule v-for="(item,index) in article"  :item = item :key= index  />
        <div class="mt-5">
            <nav aria-label="Page navigation example">
        <!-- <ul class="pagination">
            <li class="page-item"><a class="page-link" href="#">上一页</a></li>
            <li class="page-item"><a class="page-link" href="#">1</a></li>
            <li class="page-item"><a class="page-link" href="#">2</a></li>
            <li class="page-item"><a class="page-link" href="#">3</a></li>
            <li class="page-item"><a class="page-link" href="#">下一页</a></li>
        </ul> -->
        <Pager :pagesum='20'/>
        </nav>
        </div>
    </div>
</template>

<script>
import ArticleModule from './articleModule.vue'
import axios from 'axios'
import Pager from '@/components/Pager/pager.vue'
import {transformTime} from '../../tools/time_convert.js'
export default {
    data(){
        return {
            isUser:false,
            article:[{
                id:1,
                title:'文章题目',
                content:' 昨天，我国科学家在纳木错成功钻取长100.63米的湖芯，这是我国首次在西藏高原高海拔深水大湖获取超过100米长的湖芯，在该领域实现了突破。湖芯是指湖泊沉积物，是从气体或水体中自然沉降到湖底并堆积起来的物质，其中的一些物理、化学和生物指标可以反映当时的沉积环境和气候条件。',
                topic:'#我国首次在西藏高原成功钻取百范德萨范德萨范德萨发米湖芯#',
                ctime:'2020-7-22',
                author:'汪洋',
                views:20,
                img:'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2752748333,3965197483&fm=26&gp=0.jpg'
            },{
                id:2,
                title:'文章题目',
                content:' #我国首次在西藏高原成功钻取百米湖芯#昨天，我国科学家在纳木错成功钻取长100.63米的湖芯，这是我国首次在西藏高原高海拔深水大湖获取超过100米长的湖芯，在该领域实现了突破。湖芯是指湖泊沉积物，是从气体或水体中自然沉降到湖底并堆积起来的物质，其中的一些物理、化学和生物指标可以反映当时的沉积环境和气候条件。',
                topic:'#我国首次在西藏高原成功钻取百米湖芯#',
                ctime:'2020-7-22',
                author:'汪洋',
                views:20,
                img:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3225163326,3627210682&fm=26&gp=0.jpg'
            },{
                id:3,
                title:'文章题目',
                content:' #我国首次在西藏高原成功钻取百米湖芯#昨天，我国科学家在纳木错成功钻取长100.63米的湖芯，这是我国首次在西藏高原高海拔深水大湖获取超过100米长的湖芯，在该领域实现了突破。湖芯是指湖泊沉积物，是从气体或水体中自然沉降到湖底并堆积起来的物质，其中的一些物理、化学和生物指标可以反映当时的沉积环境和气候条件。',
                topic:'#我国首次在西藏高原成功钻取百米湖芯#',
                ctime:'2020-7-22',
                author:'汪洋',
                views:20
            },{
                id:4,
                title:'文章题目',
                content:' #我国首次在西藏高原成功钻取百米湖芯#昨天，我国科学家在纳木错成功钻取长100.63米的湖芯，这是我国首次在西藏高原高海拔深水大湖获取超过100米长的湖芯，在该领域实现了突破。湖芯是指湖泊沉积物，是从气体或水体中自然沉降到湖底并堆积起来的物质，其中的一些物理、化学和生物指标可以反映当时的沉积环境和气候条件。',
                topic:'#我国首次在西藏高原成功钻取百米湖芯#',
                ctime:'2020-7-22',
                author:'汪洋',
                views:20
            },],
            page:1,
            limit:8,
            blogSum:'',
        }
    },
    components:{
            ArticleModule,
            Pager
    },
    methods:{
        rTime:function(date) {
           
    var json_date = new Date(date).toJSON();
    return new Date(new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 
}
        
    },
    created:function(){
      
        //根据 路由参数 来获取文章内容
        if(this.$route.query.tag){
            axios({
                method:'get',
                url:`http://localhost:5008/api/blog/getBlogByTagName?name=${this.$route.query.tag}&page=0&size=5`
            }).then((res)=>{
                 const data = res.data.data
            this.blogSum=data.count;
            this.article = data.rows.map((item,index)=>{
                return {
                id:item.id,
                title:item.blog_title,
                content:item.blog_content,
                topic:item.tags,
                ctime:transformTime(item.createdAt),
                author:item.blog_author,
                views:item.views,
                likes:item.likes,
                comment_count:item.comment_count
                }
            })
            })
        }else{
              axios({
            method:'get',
            url:`http://localhost:5008/api/blog/getBlogByPage?page=${this.page}&limit=${this.limit}`
        }).then((res)=>{
            const data = res.data.data
            this.blogSum=data.count;
            this.article = data.rows.map((item,index)=>{
                return {
                id:item.id,
                title:item.blog_title,
                content:item.blog_content,
                topic:item.tags,
                ctime:transformTime(this.rTime(item.createdAt)),
                author:item.blog_author,
                views:item.views,
                likes:item.likes,
                comment_count:item.comment_count
                }
            })
       
        })
        }
      
    }
}
</script>

<style>

</style>
