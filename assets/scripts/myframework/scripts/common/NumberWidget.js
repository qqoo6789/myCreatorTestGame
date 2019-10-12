cc.Class({
    extends: cc.Component,
    properties: {          
        numLabel:           cc.Label,
        subBtn:             cc.Button,
        numBtn:             cc.Button,
        addBtn:             cc.Button,
        maxBtn:             cc.Button,

        _curNum:            Number,
        _maxNum:            Number,
        _numClickEnable:    Boolean,
        _changedCallback:   null,
        _callbackTarget:    null,

        curNum:{
            get: function(){
                return this._curNum;
            }
        },
        maxNum:{
            get: function(){
                return this._maxNum;
            }
        }
    },

    onLoad(){
        this.subBtn.node.on('click', this.subBtnOnClick, this);
        this.numBtn.node.on('click', this.numBtnOnClick, this);
        this.addBtn.node.on('click', this.addBtnOnClick, this);
        this.maxBtn.node.on('click', this.maxBtnOnClick, this);

        this._numClickEnable = true;
    },

    /**
     *
     * @param curNum 当前值、
     * @param maxNum 最大值（用于显示的最大值）
     */
    init(curNum, maxNum,changedCallback, callbackTarget){
        this._curNum = curNum;
        this._maxNum = maxNum;

        this._changedCallback = changedCallback;
        this._callbackTarget = callbackTarget;

        this._refreshNumLabel();
    },

    //设置数字区域是否可以点击唤起数量输入面板
    setNumberClickEnable(enable)
    {
        this._numClickEnable = enable;
    },

    changeCurNum(num){
        if (this.curNum != num)
        {
            this._curNum = num;

            if (this._changedCallback && this._callbackTarget)
            {
                this._changedCallback.call(this._callbackTarget, this.curNum);
            }
        }        
    },

    _refreshNumLabel(){
        this.numLabel.string = this.curNum + "/" + this._maxNum;
    },

    addBtnOnClick(){

        if (this.curNum < this._maxNum)
        {
            this.changeCurNum(this.curNum + 1);
       
            this._refreshNumLabel();
        }        
    },

    subBtnOnClick(){
        if (this.curNum > 1)
        {
            this.changeCurNum(this.curNum - 1);
            this._refreshNumLabel();
        }    
    },

    numBtnOnClick(){
        if (!this._numClickEnable)
        {
            return;
        }
        //要弹出小键盘输入数字

        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "NumberWidget";
        clickEventHandler.handler = "numpadCallback";        

        let args = {};
        args.callback = clickEventHandler;
        yx.windowMgr.showWindow("numpad", args);
    },

    numpadCallback(num){
        num = Math.min(num, this._maxNum);

        this.changeCurNum(num);
        this._refreshNumLabel();
    },

    maxBtnOnClick(){

        if (this.curNum != this._maxNum)
        {
            let num = this._maxNum;
            this.changeCurNum(num);
            this._refreshNumLabel();
        }
    },
    //获取当前值
    getCurNum(){
        return this._curNum;
    },
});