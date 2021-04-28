//chatroom组件的全局属性包
 
    //工具包
    
    let utils={
      addClassName(element,clsName){
        let classNames=element.className.split(" ");
        let clsNames=clsName.split(" ");
        clsNames.forEach((item)=>{
          if(classNames.indexOf(item)==-1){
            classNames.push(item);
          }
        })
        element.className=classNames.join(" ");
      },
      removeClassName(element,clsName){
        let classNames=element.className.split(" ");
        let clsNames=clsName.split(" ");
        clsNames.forEach((item)=>{
          let index=classNames.indexOf(item);
          if(index!=-1){
            classNames.splice(index,1);
          }
        })
        element.className=classNames.join(" ");
      },
      toggleClassName(element,clsName){
        let classNames=element.className.split(" ");
        let index=classNames.indexOf(clsName);
        if(index==-1){
          classNames.push(clsName);
        }else {
          classNames.splice(index,1)
        }
        element.className=classNames.join(" ");
      },
      formatTime(time){
        let m=parseInt(time/60);
        let s=parseInt(time%60);
        if(m<=9){
          m="0"+m;
        }
        if(s<=9){
          s="0"+s;
        }
        return m+":"+s;
      },
      getLrc:function(url, callback) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if(xhr.readyState != 4 ) return; // 4 表示数据发送完毕
          if(xhr.status == 200) {
            let rsp = xhr.responseText;
            callback(rsp);
          }
          else callback();
        }
        xhr.open('GET', url, true);
        xhr.send(null);
      },
    }
    /**
     * *
     * @param option 配置项
     * @constructor
     */
    function UiProgress(option) {
      let defaultOpt={
        el:document.body,
        progress:0,
        payload:0,
        isVertical:false,
        updateProgress(){},
        created(){},
        isAsync:true,
        isShowTips:false,
        formatTips(){}
      }
      this.opt=Object.assign({},defaultOpt,option);
      this._init();
    }
    UiProgress.prototype={
      _init(){
        let _this=this;
        this.state={x:0, y:0, barWidth:0};
        this.isMoveing=false;
        this.$el=document.createElement('div');
        this.$el.className="ui-progress-warp ui-progress-row";
        if(_this.opt.isVertical){
          this.$el.className="ui-progress-warp ui-progress-col";
        }
        let template='<div class="ui-progress-content">' +
          '<div class="ui-progress-payload"></div>' +
          '<div class="ui-progress-bar"><span class="ui-progress-ctrl"></span></div><span class="ui-progress-tips">100%</span>' +
          '</div>';
        this.$el.innerHTML=template;
        this.opt.el.innerHTML="";
        this.opt.el.appendChild(this.$el);
        this.$content=this.$el.querySelector(".ui-progress-content");
        this.$payload=this.$el.querySelector(".ui-progress-payload");
        this.$bar=this.$el.querySelector(".ui-progress-bar");
        this.$ctrl=this.$el.querySelector(".ui-progress-ctrl");
        this.$tips=this.$el.querySelector(".ui-progress-tips");
        if(!this.opt.isShowTips){
          this.addClassName(_this.$tips,"ui-progress-tips-hide");
        }
        this.$content.addEventListener("click",(e)=>{
          let barWidth=_this.getPos(e,_this.$content).dx;
          if(_this.opt.isVertical){
            barWidth=_this.$content.offsetHeight-_this.getPos(e,_this.$content).dy;
          }
          _this.setBarProgress(barWidth,'click')
        })
        this.$ctrl.addEventListener('mousedown',(e)=>{
          _this.isMoveing=true;
          _this.state.x=e.clientX;
          _this.state.y=e.clientY;
          _this.state.barWidth=_this.$bar.offsetWidth;
          if(_this.opt.isVertical){
            _this.state.barWidth=_this.$bar.offsetHeight;
          }
          addMoveEvent();
          addUpEvent();
          _this.addClassName(_this.$el,'ui-progress-moving')
        })
        this.$content.addEventListener("mousemove",(e)=>{
          let barWidth=_this.getPos(e,_this.$content).dx;
          if(_this.opt.isVertical){
            barWidth=_this.$content.offsetHeight-_this.getPos(e,_this.$content).dy;
          }
          if(_this.isMoveing){
            return;
          }
          _this.setTips(barWidth);
        })
        function addMoveEvent() {
          document.addEventListener("mousemove",moveEvent)
        }
        function addUpEvent() {
          document.addEventListener("mouseup",upEvent)
        }
        function moveEvent(e) {
          let pos={
            dx:e.clientX-_this.state.x,
            dy:e.clientY-_this.state.y
          };
          let barWidth=_this.state.barWidth+pos.dx;
          if(_this.opt.isVertical){
            barWidth=_this.state.barWidth-pos.dy;
          }
          _this.setBarProgress(barWidth,'move');
        }
        function upEvent(e) {
          let pos={
            dx:e.clientX-_this.state.x,
            dy:e.clientY-_this.state.y
          };
          let barWidth=_this.state.barWidth+pos.dx;
          if(_this.opt.isVertical){
            barWidth=_this.state.barWidth-pos.dy;
          }
          _this.setBarProgress(barWidth,'up');
          document.removeEventListener("mousemove",moveEvent);
          document.removeEventListener("mouseup",upEvent);
          _this.isMoveing=false;
          _this.removeClassName(_this.$el,'ui-progress-moving')
        }
        this.setProgress(this.opt.progress);
        this.setPayload(this.opt.payload);
        this.opt.created(this.opt.progress)
      },
      getPos(e,ele) {
        let pos=this.getElePos(ele);
        let dx = e.clientX - pos.x;
        let dy = e.clientY - pos.y;
        return {dx,dy}
      },
      getElePos(ele){
        let pos={
          x:ele.offsetLeft,
          y:ele.offsetTop
        };
        if(ele.offsetParent!=null) {
          pos.x+=this.getElePos(ele.offsetParent).x;
          pos.y+=this.getElePos(ele.offsetParent).y;
        };
        return pos;
      },
      setBarProgress(barWidth,type){
        let contentWidth=this.$content.offsetWidth;
        if(this.opt.isVertical){
          contentWidth=this.$content.offsetHeight;
        }
        if(barWidth>=0&&barWidth<=contentWidth){
          this.setProgress(barWidth/contentWidth,type);
        }
        if(barWidth<0){
          this.setProgress(0,type);
        }
        if(barWidth>contentWidth){
          this.setProgress(1,type);
        }
      },
      setProgress(percent,type){
        let key=this.opt.isVertical?"height":"width";
        this.$bar.style[key]=(percent*100)+"%";
        if(this.isMoveing){
          this.setTipsProgress(percent);
        }
        if(type){
          if(this.isMoveing&&!this.opt.isAsync){
            return
          }
          this.opt.updateProgress(percent,type)
        }
      },
      setPayload(percent){
        let key=this.opt.isVertical?"height":"width";
        this.$payload.style[key]=(percent*100)+"%";
      },
      addClassName(element,clsName){
        let classNames=element.className.split(" ");
        let clsNames=clsName.split(" ");
        clsNames.forEach((item)=>{
          if(classNames.indexOf(item)==-1){
            classNames.push(item);
          }
        })
        element.className=classNames.join(" ");
      },
      removeClassName(element,clsName){
        let classNames=element.className.split(" ");
        let clsNames=clsName.split(" ");
        clsNames.forEach((item)=>{
          let index=classNames.indexOf(item);
          if(index!=-1){
            classNames.splice(index,1);
          }
        })
        element.className=classNames.join(" ");
      },
      toggleClassName(element,clsName){
        let classNames=element.className.split(" ");
        let index=classNames.indexOf(clsName);
        if(index==-1){
          classNames.push(clsName);
        }else {
          classNames.splice(index,1)
        }
        element.className=classNames.join(" ");
      },
      setTips(barWidth){
        let contentWidth=this.$content.offsetWidth;
        if(this.opt.isVertical){
          contentWidth=this.$content.offsetHeight;
        }
        if(barWidth>=0&&barWidth<=contentWidth){
          this.setTipsProgress(barWidth/contentWidth);
        }
        if(barWidth<0){
          this.setTipsProgress(0);
        }
        if(barWidth>contentWidth){
          this.setTipsProgress(1);
        }
      },
      setTipsProgress(percent){
        let key=this.opt.isVertical?"bottom":"left";
        this.$tips.style[key]=(percent*100)+"%";
        this.$tips.innerHTML=(percent*100).toFixed(0)+"%";
        if(this.opt.formatTips(percent)){
          this.$tips.innerHTML=this.opt.formatTips(percent);
        }
      }
    }
    /**
     * *
     * @param option 配置项
     * @constructor
     */
    function LRC(option) {
      let defaultOpt={
        el:document.body,
        time:0,
        lrcText:""
      }
      this.opt=Object.assign({},defaultOpt,option);
      this._init();
    }
    LRC.prototype={
      _init(){
        this.$el=document.createElement('div');
        this.$el.className="ui-lrc-warp";
        let template="<div class='ui-lrc-container'><div class='ui-lrc-list'></div></div>";
        this.$el.innerHTML=template;
        this.opt.el.innerHTML="";
        this.opt.el.appendChild(this.$el);
        this.$container=this.$el.querySelector('.ui-lrc-container');
        this.$lrcList=this.$el.querySelector('.ui-lrc-list');
        this.lrcArr=[];
        this.loadLrcText(this.opt.lrcText);
      },
      parseLrc(lrcText){
        let arr=lrcText.split("\n");
        let lrcArr=[];
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i];
          let temp =item.split(']');
          let reg=/^\[\d+:\d+/g;
          if(!reg.test(temp[0])){
            continue;
          }
          let text=temp[1].trim();
          if(text==''){
            text="......";
          };
          let timeArr=temp[0].replace(/^\s*\[/g, '').split(':');
          let time=parseInt(timeArr[0])*60 + parseFloat(timeArr[1]);
          lrcArr.push({
            time:time,
            text:text
          })
        }
        lrcArr.sort((a,b)=>{
          return a.time-b.time;
        })
        return lrcArr;
      },
      loadLrc(lrcArr){
        let len=lrcArr.length;
        this.$lrcList.innerHTML="";
        let temp="";
        if(len<=0){
          temp+="<div class='ui-lrc-no'>未找到相关歌词</div>";
        }else {
          lrcArr.forEach((item)=>{
            temp+="<div class='ui-lrc-item' lrc-time='"+item.time+"'>"+item.text+"</div>";
          })
        }
        return temp;
      },
      setCurTime(time){
        let lrcItem=this.getTimeLrc(time,this.lrcArr);
        this.setLrcPos(lrcItem);
      },
      getTimeLrc(time,lrcArr){
        if(!lrcArr){
          lrcArr=this.lrcArr;
        }
        let len=lrcArr.length;
        if(len>0){
          let minTime=lrcArr[0].time;
          let maxTime=lrcArr[len-1].time;
          if(time>minTime&&time<maxTime){
            let index=0;
            for (let i = 0; i < lrcArr.length; i++) {
              let lrcItem = lrcArr[i];
              if(lrcItem.time>time){
                index=i-1;
                break;
              }
            }
            return lrcArr[index];
          }else {
            if(time<=minTime){
              return lrcArr[0]
            }else {
              return lrcArr[len-1];
            }
          }
        }else {
          return {}
        }
      },
      setLrcPos(lrcItem){
        let _this=this;
        let $container=this.$container;
        let $lrcList=this.$lrcList;
        if(lrcItem.text){
          let $lrc=$lrcList.querySelector("[lrc-time='"+lrcItem.time+"']");
          let $active=$lrcList.querySelector('.active');
          if($lrc.className!="ui-lrc-item active"){
            if($active){
              $active.className='ui-lrc-item';
            }
            $lrc.className="ui-lrc-item active";
          }
          let top=$lrc.offsetTop-($container.offsetHeight/2)+($lrc.offsetHeight/2);
          if(top>0){
            $lrcList.style.top=-top+"px";
          }else {
            $lrcList.style.top=0;
          }
        }
      },
      loadLrcText(lrcText) {
        this.lrcArr=this.parseLrc(lrcText);
        let html=this.loadLrc(this.lrcArr);
        this.$lrcList.removeAttribute("style");
        this.$lrcList.innerHTML=html;
      }
    }
    export {LRC,UiProgress,utils}