<template>
    <div class="all col-12 p-2 shadow mt-4 "  style="background:#fff">
       <h5 >
             <p   class="text-monospace font-weight-bolder">{{title.name}}</p>
       </h5>
        <ul>
            <li class="border-bottom p-2"  v-for="(item,index) in title.content "  :key='index'>
                <router-link  style="font-size:16px;cursor:pointer;display:block"   v-if="title.id==1" :to="{name:'article',params:{id:item.url}}">{{item.name||item.comments}}</router-link>
                 <router-link  style="font-size:16px;cursor:pointer;display:block"   v-else-if="title.id==2" :to="{name:'content',query:{tag:item.name}}">{{item.name||item.comments}}</router-link>
                <p v-else class=" font-weight-normal mb-1" style="font-size:16px;cursor:pointer">{{item.name||item.comments}}</p>
                <p class="d-inline mr-1 text-muted" >{{item.ctime}}</p>|<p v-if="item.views" class="font-weight-light d-inline ml-1 text-muted">{{item.views}}次阅读</p>
                <p v-else-if="item.article" class="font-weight-light d-inline ml-1 text-muted"> ---{{item.author}}</p>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props:['title'],
    data(){
        return {
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
            },{
                name:'webpack探索-编译过程',
                url:'',
                ctime:'2020/3/20',
                views:'20'
            },{
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
        }
    },
     created(){
        //  console.log(title)
     }
}
</script>
<style>
 
</style>

