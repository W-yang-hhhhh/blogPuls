<template>
      <ckeditor @input="inputcontent" class="fixed" id="editor1" name="editor1"  v-model="value? '':content" :config="editorConfig"></ckeditor>
</template>

<script>
// CKEDITOR.replace('editor1', {
//       // Define the toolbar groups as it is a more accessible solution.
//       toolbarGroups: [{
//           "name": "basicstyles",
//           "groups": ["basicstyles"]
//         },
//         {
//           "name": "links",
//           "groups": ["links"]
//         },
//         {
//           "name": "paragraph",
//           "groups": ["list", "blocks"]
//         },
//         {
//           "name": "document",
//           "groups": ["mode"]
//         },
//         {
//           "name": "insert",
//           "groups": ["insert"]
//         },
//         {
//           "name": "styles",
//           "groups": ["styles"]
//         },
//         {
//           "name": "about",
//           "groups": ["about"]
//         }
//       ],
//       // Remove the redundant buttons from toolbar groups defined above.
//       removeButtons: 'Underline,Strike,Subscript,Superscript,Anchor,Styles,Specialchar'
//     });
export default {
    data(){
        return {
            content:'',
            editorConfig:{
                toolbarGroups: [
                {
                "name": "insert",
                "groups":['Specialchar']
                },
                 
                
            ],
            height:50,
            extraPlugins : 'smiley',
            smiley_columns : 4,
            extraPlugins :'autogrow',
            autoGrow_maxHeight:80,
            resize_enabled :false,
            toolbarCanCollapse : true,
            toolbarLocation:'bottom',
      // Remove the redundant buttons from toolbar groups defined above.
      removeButtons: 'Table,Horizontalrule,'
    }
        }
    },
    props:['wdith','height','value'],
    methods:{
        inputcontent:function(){
          
            this.$emit('put',this.content)
           
        },
        
    }
}
</script>
<style>

    .fixed p{
        margin: 0;
        padding: 0;
        color: red !important
    }
</style>

 