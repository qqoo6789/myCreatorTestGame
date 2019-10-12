/**
 * 移动的文本节点预制品的挂载组件，使得预制品具备移动的功能
 */

cc.Class({
    extends: cc.Component,

    properties: {
        //初始位置x
        initX: {
            default: 0, 
            type: cc.Float, 
        },
        //初始位置y
        initY: {
            default: 0, 
            type: cc.Float, 
        },
        //y方向的移动速度
        moveSpeedY: {
            default: 80, 
            type: cc.Float, 
        },
        //每一次的移动距离
        perY: {
            default: 40, 
            type: cc.Float, 
        },

        //隐藏的速度
        hideSpeed: {
            default: 1000, 
            type: cc.Float, 
        },
        //最大停留时间，超过则开始隐藏
        maxStopTime: {
            default: 1.5, 
            type: cc.Float, 
        },
        //maxLine 显示的最大条目行数 （不包括最上一行即将隐藏的）
        maxLine:{
            default: 4,
            type: cc.Float,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    init (){
        this.node.x = this.initX;
        this.node.y = this.initY;
        this.node.opacity = 255;        
        this.isDoMoveUp = true;         // 上移开关
        this.isDoHide = false;          // 隐藏开关
        this.needToMoveY = this.initY;  // 需要移动的距离
        this.curStopTime = 0;           // 当前停留的时间总计

        //最大的移动距离
        this.maxY = this.initY + ((this.maxLine+1) * this.perY);
    },
    start () {
        //this.init();
    },

     update (dt) {

        //如果当前已经停下来了，那么开始计算停留时间
        if (!this.isDoMoveUp){
            this.curStopTime += dt;
        }

        //超出停留时间maxStopTime，且当前是最上层的node,则开始隐藏动画
        if (this.curStopTime >= this.maxStopTime && yx.ToastUtil.isCurActionListFirst(this.node)){
            this.isDoHide = true;// 
        }

        //当前向上移动，移动的时候需要把 停留时间重置
         if (this.isDoMoveUp){
            this.curStopTime = 0;
            this.node.y += this.moveSpeedY*dt;
         }

          //当前已经移动到了目的点，那么就停下来
          if (this.isDoMoveUp && this.node.y >= this.needToMoveY){
            //将等待时间置0，开始重新计算停留时间
            this.curStopTime = 0;
            this.node.y = this.needToMoveY;
            this.isDoMoveUp = false;
        }

        //如果超过到达了倒数第一个位置，在往上的话，那么要开始隐藏了
        if (this.node.y > (this.maxY - this.perY)){
            this.isDoHide = true;// 
        }

         //进入隐藏
         if (this.isDoHide){
            this.node.opacity -= this.hideSpeed*dt;
            if (this.node.opacity <= 0){
                this.node.opacity = 0;
                //console.log("移除")
                yx.ToastUtil.removeCurActionNode(this.node);
                //this.node.removeFromParent(true);
            }
         }
     },

     //设置上移开关
     setIsDoMoveUp:function(is){
        this.isDoMoveUp = is;
     },

     //设置隐藏开关
     setIsDoHide:function(is){
        this.isDoHide = is;
     },

     //继续上移 -- 把需要移动的距离跌加，将上移开关打开
     continueMoveUp:function(){
        this.needToMoveY += this.perY;
        this.setIsDoMoveUp(true);
        
        //
        if (this.needToMoveY > this.maxY){
            this.needToMoveY = this.maxY + this.perY;
            this.setIsDoMoveUp(false);
        }
     },

     //设置文字内容
     setContent:function(content){

        if (!content) return ; //内容为空，返回

        //由于此方法在节点尚未添加到ui树上的时候，就已经执行了。这在onstart/onload之前调用。
        if (!this.contentRichText){
            this.contentRichText = this.node.getChildByName("content").getComponent(cc.RichText);
        }
        this.contentRichText.string = content;
     },

     //设置背景图片
     setBgSpriteFrame:function(bgSpriteFrame){

        if (!bgSpriteFrame) return ; //内容为空，返回

        if (!this.bgSprite){
            this.bgSprite = this.node.getComponent(cc.Sprite);
        }
        this.bgSprite.spriteFrame = bgSpriteFrame;
     }

});
