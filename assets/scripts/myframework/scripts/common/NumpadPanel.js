const BaseWindow = require('BaseWindow');

cc.Class({
    extends: BaseWindow,

    properties: { 
        titleLabel:             cc.Label,
        numberLabel:            cc.Label,
        numBtnLayout:           cc.Layout,

        confirmBtn:             cc.Button,
        clearBtn:               cc.Button,

        _callback:              cc.Component.EventHandler,
    },

    _onInit(args){       
        this._callback = args.callback;

        this.confirmBtn.node.on('click', this.onConfirmBtnClick, this);
        this.clearBtn.node.on('click', this.onClearBtnClick, this);

        this.numberLabel.string = "";

        let numBtns = this.numBtnLayout.node.children;

        for (let i = 0; i < numBtns.length; i++)
        {
            let btnNum = parseInt(numBtns[i].name);
            if (!isNaN(btnNum))
            {
                this._setNumBtn(numBtns[i], btnNum);
            }
        }
    },

    _setNumBtn(btnNode, num)
    {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "NumpadPanel";
        clickEventHandler.handler = "onNumBtnClick";
        clickEventHandler.customEventData = num;

        btnNode.getComponent(cc.Button).clickEvents.length = 0;
        btnNode.getComponent(cc.Button).clickEvents.push(clickEventHandler);
        btnNode.getChildByName("Background").getComponentInChildren(cc.Label).string = num;
    },

    _onShow(){
        this._refresh();
    },

    _refresh(){
        //this.numberLabel.string = this._num;
    },

    onNumBtnClick(event, customEventData){
        if (customEventData >=0 && customEventData <= 9)
        {
            this.numberLabel.string += customEventData;
        }
    },

    onClearBtnClick(){
        this.numberLabel.string = "";
        this._refresh();
    },

    onConfirmBtnClick(){
        let num = parseInt(this.numberLabel.string);

        cc.log("[NumpadPanel onConfirmBtnClick] num:" + num);

        if (num > 0)
        {
            if (this._callback != null)
            {
                this._callback.emit([num]);
            }

            yx.windowMgr.goBack();
        }
        else
        {
            //TODO:提示数量为零
        }
    },

    onCloseBtnClick(){
        yx.windowMgr.goBack();
    },

});