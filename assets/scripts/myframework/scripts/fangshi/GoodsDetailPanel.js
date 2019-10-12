/**
 * 商品详情面板
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

        buyBtn:                 cc.Button,

        numberWidget:           NumberWidget,
        stockNumLabel:          cc.Label,
        cyIconSp:               cc.Sprite,
        costLabel:              cc.Label,

        _goodsCfg:              null,
        _stockNum:              Number,
        _costItemCfg:           null,
        _rewardItemCfg:         null,
    },

    _onInit(args){
        if (args == null)
        {
            cc.error("[GoodsDetail oninit error]");
            return;
        }

        this._goodsCfg = args.goodsCfg;   
        this._stockNum = args.remain;
 
        this.closeBtn.node.on('click', this.onCloseBtnClick, this);
        this.buyBtn.node.on('click', this.onBuyBtnClick, this);

        this._costItemCfg = yx.cfgMgr.getOneRecord("ItemConfig", this._goodsCfg.Cost[0].id + 80000);
        this._rewardItemCfg = yx.cfgMgr.getOneRecord("ItemConfig", this._goodsCfg.Reward[0].id);

        if (this._costItemCfg == null || this._rewardItemCfg == null)
        {
            cc.error("[GoodsDetail get _costItemCfg faild] id:" + this._goodsCfg.Cost[0].id);
            return;
        }
    },

    _onShow(){
        this._refresh();
    },

    _refresh(){
        if (this._costItemCfg && this._rewardItemCfg)
        {
            yx.resUtil.LoadSpriteByType(this._rewardItemCfg.Icon, yx.ResType.ITEM, this.iconSp);   
            yx.resUtil.LoadSpriteByType(this._costItemCfg.Icon, yx.ResType.ITEM, this.cyIconSp);      

            this.titleLabel.string = this._rewardItemCfg.Name;
            this.contentLabel.string = this._rewardItemCfg.DefDesc;

            this.stockNumLabel.string = this._stockNum;           
    
            this.numberWidget.init(1, this._stockNum, this.onNumberWidgetChange, this);
            this.numberWidget.setNumberClickEnable(false);

            this._refreshCostValue();
        }       
    },

    _refreshCostValue(){
        this.costLabel.string = this._goodsCfg.Cost[0].count * this.numberWidget.curNum;
    },

    onCloseBtnClick(){
         yx.windowMgr.goBack();
    },

    onNumberWidgetChange(){
        this._refreshCostValue();
    },

    //购买
    onBuyBtnClick(){
        cc.log("[GoodsDetailPanel onBuyBtnClick]");

        if (yx.playerMgr.getCurrency(this._costItemCfg.ID) >= this._goodsCfg.Cost[0].count)
        {
            yx.fangshiMgr.reqPurchaseGoods(this._goodsCfg.Type, this._goodsCfg.Layer, this._goodsCfg.ID, this.numberWidget.curNum);
            yx.windowMgr.goBack();
        }
        else
        {
            yx.ToastUtil.showListToast(this._costItemCfg.Name + "不足");
        }
    },



});