/**
 * 道具详情面板
 */
const BaseWindow = require('BaseWindow');
const NumberWidget = require("NumberWidget");


cc.Class({
    extends: BaseWindow,

    properties: { 
        titleLabel:             cc.Label,
        iconSp:                 cc.Sprite,
        contentLabel:           cc.Label,

        closeBtn:               cc.Button,

        useBtn:                 cc.Button,
        sellBtn:                cc.Button,

        numberWidget:           NumberWidget,

        //_itemid:                Number,
        _num:                   Number,
        _itemInfo:              null,
        _itemMsg:               null,
    },

    _onInit(args){
        if (args == null || args.id == null || args.num == null)
        {
            cc.error("[ItemDetail oninit error]");
            return;
        }

        this._uid = args.id;
        this._num = args.num;

        this.closeBtn.node.on('click', this.onCloseBtnClick, this);    

        this.useBtn.node.on('click', this.onUseBtnClick, this);
        this.sellBtn.node.on('click', this.onSellBtnClick, this);

        this._itemMsg = yx.bagMgr.getItemById(this._uid);
        this._itemInfo = yx.cfgMgr.getRecordByKey("ItemConfig", {ID: this._itemMsg.itemId});

        if (this._itemInfo == null)
        {
            cc.error("[ItemDetail get iteminfo faild] id:" + this._itemMsg.itemId);
            return;
        }

        cc.log("[ItemDetailPanel _onInit] itemId:" + this._itemMsg.itemId);
    },

    _onShow(){
        this._refresh();
    },

    _refresh(){
        yx.resUtil.LoadSpriteByType(this._itemInfo.Icon, yx.ResType.ITEM, this.iconSp);

        this.titleLabel.string = this._itemInfo.Name;
        this.contentLabel.string = this._itemInfo.DefDesc;

        this.numberWidget.init(1, this._num);
    },

    onCloseBtnClick(){
         yx.windowMgr.goBack();
     },

     //使用
    onUseBtnClick(){
       cc.log("[ItemDetailPanel onUseBtnClick]");

        yx.bagMgr.reqUseItem(this._itemMsg.itemId, this.numberWidget.curNum);

        yx.windowMgr.goBack();
    },

    //出售
    onSellBtnClick(){
        cc.log("[ItemDetailPanel onSellBtnClick]");

        yx.bagMgr.reqSellItem(this._itemMsg.id, this._itemMsg.itemId, this.numberWidget.curNum);

        yx.windowMgr.goBack();
    },

});