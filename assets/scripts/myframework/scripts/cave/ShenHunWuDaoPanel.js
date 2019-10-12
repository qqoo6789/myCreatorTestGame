const BaseWindow = require('BaseWindow');

cc.Class({
    extends: BaseWindow,

    properties: {
        closeBtn: cc.Button,
        confirmBtn: cc.Button,//预定按钮
        bookNameLabel:cc.Label,//书名
        ownNode:cc.Node,
        unOwnNode:cc.Node,
        shenHunPrice:cc.Label,//神魂价格
    },

    _onInit(args) {
        this.closeBtn.node.on('click', this._onCloseBtnClick, this);
        this.confirmBtn.node.on('click', this._onConfirmBtnClick, this);
        let bookingId = yx.caveMgr.getBookingId();
        if (args && bookingId){
            let wuDaoBookCfg = yx.cfgMgr.getRecordByKey("WuDaoBookConfig", {ID: bookingId});
            if (wuDaoBookCfg) {
                //书名
                this.bookNameLabel.string = "《" + wuDaoBookCfg["Name"] + "》";
            }
        }


        //已改版，能进入此界面，就已经是习得神魂悟道了
        this.ownNode.active = true;//已拥有界面
        this.unOwnNode.active = false;

        /*if (true){

        }else {
            let payItemCfg = yx.cfgMgr.getRecordByKey("PayItemConfig",{ID:6});
            this.shenHunPrice.string = payItemCfg["TypeValue"][0]["count"];
            this.ownNode.active = false;
            this.unOwnNode.active = true;
        }*/

    },

    _onCloseBtnClick() {
        yx.windowMgr.goBack();
    },
    _onConfirmBtnClick() {
        yx.windowMgr.goBack();
    },
});
