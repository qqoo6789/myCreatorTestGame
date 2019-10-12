const BaseWindow = require('BaseWindow');

let _DescString = "\t\t当前是{pkgName}，使用一个“{stoneName}”可以提升一格容量。\n（{stoneName}可通过炼器打造获得）";
let _ContentString = "当前拥有{stoneName}：<color={amountColor}>{amount}</color>\n还可以使用<color=#00C800>{leftTimes}</color>次";

cc.Class({
    extends: BaseWindow,

    properties: { 
        descLabel:          cc.Label,
        contentRichText:    cc.RichText,

        maskBtn:            cc.Button,
        closeBtn:           cc.Button,
        useBtn:             cc.Button,
        cancelBtn:          cc.Button,
    },

    _onInit(){     
        this.maskBtn.node.on('click', this.onCloseBtnClick, this);    
        this.closeBtn.node.on('click', this.onCloseBtnClick, this);    

        this.useBtn.node.on('click', this.onUseBtnClick, this);
        this.cancelBtn.node.on('click', this.onCancelBtnClick, this);

        this._stoneItemId = 0;
        this._stoneAmount = 0;
    },

    _onShow(){
        this._refresh();
    },


    _refresh(){
        let bagLevel = yx.bagMgr.getBagLevel();
        let bagCfg = yx.cfgMgr.getOneRecord("PkgLevelConfig", {Level: bagLevel});

        if (!bagCfg)
        {
            cc.error("[PkgUpgradePanel refresh] PkgLevelConfig error level:" + bagLevel);
            return;        
        }

        let stoneItemId = bagCfg.cost[0].id;
        let leftUseTimes = bagCfg.GridNum - yx.bagMgr.getStoneUse();
        let stoneAmount = yx.bagMgr.getItemNum(stoneItemId);

        let stoneCfg = yx.cfgMgr.getOneRecord("ItemConfig", {ID: stoneItemId});

        if (!stoneCfg)
        {
            cc.error("[PkgUpgradePanel refresh] ItemConfig error ItemId:" + stoneItemId);
            return;
        }

        let args = {};
        args.pkgName = bagCfg.Name;
        args.stoneName = stoneCfg.Name;
        args.amountColor = stoneAmount > 0 ? yx.colorUtil.TextGreen : yx.colorUtil.TextRed;
        args.amount = stoneAmount;
        args.leftTimes = leftUseTimes;

        this.descLabel.string = _DescString.format(args);
        this.contentRichText.string = _ContentString.format(args);

        this._stoneItemId = stoneItemId;
        this._stoneAmount = stoneAmount;
    },

    onCloseBtnClick(){
        yx.windowMgr.goBack();
    },

    onUseBtnClick(){
        cc.log("[PkgUpgradePanel onUseBtnClick]");

        if (this._stoneItemId > 0)
        {
            if (this._stoneAmount == 0)
            {
                yx.ToastUtil.showListToast("虚空石不足");
                cc.log("[PkgUpgradePanel onUseBtnClick] stoneItemId:" + this._stoneItemId);
            }
            else
            {
                yx.bagMgr.reqUseItem(this._stoneItemId, 1);
                yx.windowMgr.goBack();
            }
        }  
    },

    onCancelBtnClick(){
        this.onCloseBtnClick();
    },
});