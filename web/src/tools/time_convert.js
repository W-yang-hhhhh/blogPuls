
//参数time格式（string） ：2020-09-22T11:56:59.000Z
//   
exports.transformTime = function(time){
    
           
    var json_date = new Date(time).toJSON();
    time =  new Date(new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 

    let mark ;
    const ymd = time.split(' ')[0]
    const year = ymd.split('-')[0];
    const month = ymd.split('-')[1];
    const day = ymd.split('-')[2];
    const hour =  time.split(' ')[1].split(":")[0];
    const minute =  time.split(' ')[1].split(":")[1];

    const nowTime = new Date();
    const now_year = nowTime.getFullYear();
    const now_month = nowTime.getMonth()+1;
    const now_day = nowTime.getDate();
    const now_hour = nowTime.getHours();
    const now_minute = nowTime.getMinutes();
    if(year == now_year && month == now_month && day == now_day){
        if(hour == now_hour){
            if(now_minute==minute){
                return time;
            }else{
                 mark = now_minute - minute;
                return `${mark}分钟前发布`
            }
        }else{
            mark = now_hour - hour;
            return `${mark}小时前发布`;
        }
    }else if(year == now_year && month == now_month  ){
        mark = now_day - day;
        return `${mark}天前发布`;
    }else if(year == now_year){
        if(day>15){
            mark = now_month - month-1;
        
        }else if(now_day>15){
            mark = now_month - month+1;

        }else{
            mark = now_month - month
        }

        return `${mark}月前发布`
    }else{
        return time
    }
    
    
}


exports.transformTime_simple= function(time){
           
    var json_date = new Date(time).toJSON();
   return  time =  new Date(new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 

}

 

