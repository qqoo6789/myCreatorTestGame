/**
 * 道具使用面板 只有使用和全部使用两种按钮
 */
const BaseWindow = require('BaseWindow');


cc.Class({
    extends: BaseWindow,

    properties: { 
        titleLabel:             cc.Label,
        iconSp:                 cc.Sprite,
        contentLabel:           cc.Label,
        amountLabel:            cc.Label,

        closeBtn:               cc.Button,

        btn1:                   cc.Button,
        btn2:                   cc.Button,

        _num:                   Number,
        _itemCfg:              null,
        _itemMsg:               null,
    },

    _onInit(args){
        if (args == null || args.id == null)
        {
            cc.error("[ItemUsePanel oninit error]");
            return;
        }

        this._uid = args.id;     

        this.closeBtn.node.on('click', this.onCloseBtnClick, this);    
        this.btn1.node.on('click', this.onUseBtnClick, this);
        this.btn2.node.on('click', this.onAllUseBtnClick, this);

        this._itemMsg = args;//yx.bagMgr.getItemById(this._uid);
        this._itemCfg = yx.cfgMgr.getRecordByKey("ItemConfig", {ID: this._itemMsg.itemId});

        if (this._itemCfg == null)
        {
            cc.error("[ItemUsePanel get iteminfo faild] id:" + this._itemMsg.itemId);
            return;
        }

        cc.log("[ItemUsePanel _onInit] itemId:" + this._itemMsg.itemId);
    },

    _onShow(){
        this._refresh();
    },

    _refresh(){
        yx.resUtil.LoadSpriteByType(this._itemCfg.Icon, yx.ResType.ITEM, this.iconSp);

        this.titleLabel.string = this._itemCfg.Name;
        this.contentLabel.string = this._itemCfg.DefDesc;
        this.amountLabel.string = this._itemMsg.amount;
    },

    onCloseBtnClick(){
         yx.windowMgr.goBack();
     },

    //使用
    onUseBtnClick(){
       cc.log("[ItemUsePanel onUseBtnClick]");

        yx.bagMgr.reqUseItem(this._itemMsg.itemId, 1);

        yx.windowMgr.goBack();
    },

    //全部使用
    onAllUseBtnClick(){
        cc.log("[ItemUsePanel onAllUseBtnClick]");

        yx.bagMgr.reqSellItem(this._itemMsg.id, this._itemMsg.itemId, this._itemMsg.amount);

        yx.windowMgr.goBack();
    },
});