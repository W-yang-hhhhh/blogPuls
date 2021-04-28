var emojidata = {
    emoji_code: ['U+1F600', 'U+1F603', 'U+1F604', 'U+1F601', 'U+1F606', 'U+1F605', 'U+1F923', 'U+1F602', 'U+1F642', 'U+1F643', 'U+1F609', 'U+1F60A', 'U+1F607',
        'U+1F970', 'U+1F60D', 'U+1F929', 'U+1F618', 'U+1F617',
        'U+1F61A', 'U+1F619' ,
        'U+1F60B', 'U+1F61B', 'U+1F61C', 'U+1F92A', 'U+1F61D', 'U+1F911',
        'U+1F917', 'U+1F92D', 'U+1F92B', 'U+1F914',
        'U+1F910', 'U+1F928', 'U+1F610', 'U+1F611', 'U+1F636', 'U+1F60F', 'U+1F612', 'U+1F644', 'U+1F62C', 'U+1F925',
        'U+1F60C', 'U+1F614', 'U+1F62A', 'U+1F924', 'U+1F634',
        'U+1F637', 'U+1F912', 'U+1F915', 'U+1F922', 'U+1F92E', 'U+1F927', 'U+1F975', 'U+1F976', 'U+1F974', 'U+1F635', 'U+1F92F',],
    emoji:[],
    emoji_text:[]
}
//  <span class="wawa">&#x1f62c;</span>  这是第二种方法将code后五位取出拼接成 '&#x....;'
function findSurrogatePair(point) {
     
    var points = point.slice(2).toLowerCase();
  
    var points= '0x'+points 
    // assumes point > 0xffff
    var offset = points - 0x10000,
        lead = 0xd800 + (offset >> 10),
        trail = 0xdc00 + (offset & 0x3ff);
    return [lead.toString(16), trail.toString(16)];
}
function createemojitext(){
    emojidata.emoji_text=[];
    emojidata.emoji_text=emojidata.emoji_code.map((item,index)=>{
        var points = item.slice(2).toLowerCase();
        
       return  points = `&#x${points};`;
   
    })
   
}
function createemoji(){
    createemojitext();
    emojidata.emoji=[];
    for(var i of emojidata.emoji_code){
        var a =findSurrogatePair(i);
       
        var b= a.map((item,index)=>{
            return '0x'+item
        })
      
       
        emojidata.emoji.push(String.fromCharCode(...b));
      
      
       
    }
   
    return emojidata;
    
}
export default createemoji