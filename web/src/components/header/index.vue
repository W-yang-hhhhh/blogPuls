<template>
     <div class="col-md-9 col-12 " >
         <div class="row" >
             <div class="col-md-2 col-12 text-center align-self-center"><h3>Secret Room</h3></div>
             <div class=" col-md-4 col-ms-12 align-self-center">
                <SearchBar/>
            </div>
             <div class=" col-md-6 col-ms-12 align-self-center">
                 <Nav/>
             </div>
             
         </div>
     </div>
</template>
<script>
import SearchBar from './searchBar.vue';
import Nav from './nav.vue'
export default {
    components:{
        SearchBar,
        Nav
    }
}
</script>
<style scoped>
  
</style>
