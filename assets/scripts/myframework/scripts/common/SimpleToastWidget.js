
cc.Class({
    extends: cc.Component,

    properties: {
        simpleTextLabel:cc.Label,
        lingshiLabel:   cc.Label,
        shiwuLabel:     cc.Label,
        mucaiLabel:     cc.Label,
        yuntieLabel:    cc.Label,

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
        //y方向的移动距离
        distanceY: {
            default: 180,
            type: cc.Float,
        },
        //持续时间
        durationTime: {
            default: 1.5,
            type: cc.Float,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    init(){
        this.node.x = this.initX;
        this.node.y = this.initY;

        this.stuffBgNode = this.node.getChildByName("StuffBg");
        this.sextBgNode = this.node.getChildByName("TextBg");

        this.stuffBgNode.active = false;
        this.sextBgNode.active = false;
    },




    /**
     * 显示toast动画
     */

    show(type,data){
        if (type == yx.ToastUtil.ToastEventType.TOAST_TYPE_SIMPLE){
            this.stuffBgNode.active = false;
            this.sextBgNode.active = true;
            this.simpleTextLabel.string = data;
        }
        else if (type == yx.ToastUtil.ToastEventType.TOAST_TYPE_CAVE){
            this.stuffBgNode.active = true;
            this.sextBgNode.active = false;
            //设置内容
            this.lingshiLabel.string = "灵石："+this._numToStr(data["lingshiNum"]);
            this.shiwuLabel.string = "食物："+this._numToStr(data["shiwuNum"]);
            this.mucaiLabel.string = "木材："+this._numToStr(data["mucaiNum"]);
            this.yuntieLabel.string = "陨铁："+this._numToStr(data["yuntieNum"]);
            //设置颜色
            this._setColor(this.lingshiLabel,data["lingshiNum"]);
            this._setColor(this.shiwuLabel,data["shiwuNum"]);
            this._setColor(this.mucaiLabel,data["mucaiNum"]);
            this._setColor(this.yuntieLabel,data["yuntieNum"]);
        }

        let move = cc.moveBy(this.durationTime,cc.v2(0,this.distanceY)).easing(cc.easeInOut(1.5));
        let faceout = cc.fadeOut(this.durationTime).easing(cc.easeInOut(15.0));//消失的动作，先慢后快
        let ac = cc.spawn(move,faceout);
        this.node.runAction(ac);
    },

    // 整数补+ 负数补- 0 不处理
    _numToStr(num){
        return num > 0 ? "+" + num : "" + num;
    },

    //正数 绿， 负数 红
    _setColor(label,num){
        if (num >= 0) {
            label.node.color = yx.colorUtil.toCCColor(yx.colorUtil.TextGreen);
            return;
        }
        label.node.color = yx.colorUtil.toCCColor(yx.colorUtil.TextRed);
    },

    onLoad () {

    },

    // update (dt) {},
});
