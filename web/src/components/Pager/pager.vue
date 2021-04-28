<template>
    <div>
        <nav aria-label="Page navigation example ">
        <ul class="pagination">
            <!-- <li class="page-item"><a class="page-link" href="#">上一页</a></li>
            <li class="page-item"><a class="page-link" href="#">1</a></li>
            <li class="page-item"><a class="page-link" href="#">2</a></li>
            <li class="page-item"><a class="page-link" href="#">3</a></li>
            <li class="page-item"><a class="page-link" href="#">下一页</a></li> -->
            <li class="page-item" v-for="item in showpage"><a class="page-link" href="#">{{item}}</a></li>
        </ul>
        </nav>
    </div>
</template>

<script>
export default {
    
    data(){
        return {
        page:1,
        pageSize:5,
        pagercontent:5,
        lastpagenum:10,
        showpage:[],
        
         
       
        }
    },
    props:['pagesum'],
    methods:{
         Pagerinit:function(firstPageNum = 1,lastPageNum,pageContent,page){
            let arr = [];
            arr.push("上一页");
            arr.push(firstPageNum);
            if(firstPageNum==lastPageNum){
                return ;
            }
            if(page>=lastPageNum){
                page = lastPageNum;
            
            }
            if(page<=firstPageNum){
                page = firstPageNum;
            
            }
            if(lastPageNum<=pageContent+1){
                for(let i = firstPageNum+1 ;i<lastPageNum;i++){
                    arr.push(i);
                }
            }
            else if(page-parseInt(pageContent/2)<=firstPageNum+1){
                for(let i = page-parseInt(pageContent/2) <2? 2:page-parseInt(pageContent/2) ;i<=firstPageNum+pageContent-1;i++){
                    arr.push(i);
                }
                arr.push("...");
             
                
            }else if(page+parseInt(pageContent/2)>=lastPageNum-1){
                arr.push("...");
           
                for(let i = page-parseInt(pageContent/2)>=lastPageNum-pageContent-1? lastPageNum-pageContent+1:lastPageNum-pageContent+2 ; i<=lastPageNum-1 ; i++){
                    
                    arr.push(i);
                    
                }
         
            }else{
                arr.push("...");
                for(let i = page-parseInt(pageContent/2) ;i<=page-parseInt(pageContent/2)+pageContent-1;i++){
                    arr.push(i);
                }
                arr.push("...");
            
            }
            
            arr.push(lastPageNum);
            arr.push("下一页");

            return arr;
             
            },
         movePage:function(page){
            
            if(page=="上一页" || page=="下一页"){
             
                if(page=="上一页"){
                    this.page-=1;
                    console.log("-1");
                   
                }else if(page=="下一页"){
                    console.log("+1");
                    this.page+=1;

                }
                if(this.page<1){
                    this.page = 1;
                    console.log("赋值1");
                }
                if(this.page>this.lastpagenum){
                    this.page=this.lastpagenum
                    console.log("赋值2");
                }
              
                this.getPage(this.page,this.pageSize);

            
            }else{
                this.page = page;
            
                
                this.getPage(this.page,this.pageSize);
            }   
         
    },
    },
    created(){
       this.showpage =  this.Pagerinit(1,this.lastpagenum,);
    //    console.log("pager:",this.showpage)
    }
}
     

</script>

