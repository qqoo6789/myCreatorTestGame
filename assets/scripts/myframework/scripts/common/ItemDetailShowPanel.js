const BaseWindow = require('BaseWindow');

const _lingShiItemIcon = "item_1";
const _yuItemIcon = "item_2";


let ItemDetailShowPanel = cc.Class({
    extends: BaseWindow,

    properties: {

        //简单类型
        simpleTitleLabel:             cc.Label,
        simpleIconSp:                 cc.Sprite,
        simpleContentLabel:           cc.Label,
        simpleCloseBtn:               cc.Button,

        //购买类型
        buyTitleLabel:              cc.Label,
        buyIconSp:                  cc.Sprite,
        buyContentLabel:            cc.Label,
        buyLevelLabel:              cc.Label,//几阶段
        buyCloseBtn:                cc.Button,
        buyCostLabel:               cc.Label,
        buyCostSp:                  cc.Sprite,
        buyBuyBtn:                  cc.Button,

        //控制两种显示隐藏的node
        simpleNode:                 cc.Node,
        buyNode:                    cc.Node,
    },

    //两种显示样式
    statics:{
        SHOW_TYPE_SIMPLE  : 1, // 1 简单类型 ->材料名称、   材料icon、材料描述                        信息从itemConfig.json查
        SHOW_TYPE_BUY     : 2, // 2 购买类型 ->材料名称*n、 材料icon、材料描述、材料几阶、材料价格、购买   信息从XianNiangStoreConfig.json查
    },

    /**
     * 参数传入 需要 1 -ID  、2 -showType
     * @param args
     * @private
     */
    _onInit(args){
        this._args = args;

        if (args == null || args.ID == null )
        {
            cc.error("[ItemDetailShowPanel oninit error]");
            return;
        }

        this.simpleCloseBtn.node.on('click', this.onCloseBtnClick, this);
        this.buyCloseBtn.node.on('click', this.onCloseBtnClick, this);

        this.simpleNode.active = false;
        this.buyNode.active = false;

    },
    _onShow(){
        this._refresh();
    },

    _refresh(){

        //仙酿购买页面
        if (this._args.showType == ItemDetailShowPanel.SHOW_TYPE_BUY){

            this.simpleNode.active = false;
            this.buyNode.active = true;

            this._xianNiangStoreCfgInfo =  yx.cfgMgr.getRecordByKey("XianNiangStoreConfig", {ID: this._args.ID});

            if (this._xianNiangStoreCfgInfo){

                //获取对应的item
                this._itemCfgInfo =  yx.cfgMgr.getRecordByKey("ItemConfig", {ID: this._xianNiangStoreCfgInfo["Reward"][0]["id"]});

                if (this._itemCfgInfo){

                    //显示材料描述
                    this.buyContentLabel.string = this._itemCfgInfo.DefDesc;

                    //显示材料icon
                    this._setSprite(this._itemCfgInfo.Icon,this._itemCfgInfo.Type,this.buyIconSp);

                    //显示材料几阶
                    this.buyLevelLabel.string = yx.textDict.ChineseNum[this._itemCfgInfo["PinZhi"]]+'阶';

                    //let color = yx.textDict.QualityColor[this._itemCfgInfo["PinZhi"]];

                    //this.buyTitleLabel.node.color = yx.colorUtil.toCCColor(color);

                }
                //显示材料名称
                this.buyTitleLabel.string   = this._xianNiangStoreCfgInfo["Name1"];

                //材料价格
                this.buyCostLabel.string = this._xianNiangStoreCfgInfo["Cost"][0]["count"];

                //购买按钮
                this.buyBuyBtn.node.on('click', this.onBuyBtnClick, this);

                if (this._xianNiangStoreCfgInfo["Cost"][0]["id"] == 1){
                    //灵石消耗
                    yx.resUtil.LoadSpriteByType(_lingShiItemIcon, yx.ResType.ITEM, this.buyCostSp);
                }else if (this._xianNiangStoreCfgInfo["Cost"][0]["id"] == 2){
                    //玉石消耗
                    yx.resUtil.LoadSpriteByType(_yuItemIcon, yx.ResType.ITEM, this.buyCostSp);
                }
            }

        }
        //一般的页面
        else if (this._args.showType == ItemDetailShowPanel.SHOW_TYPE_SIMPLE){
            this._itemCfgInfo =  yx.cfgMgr.getRecordByKey("ItemConfig", {ID: this._args.ID});
            this.simpleNode.active = true;
            this.buyNode.active = false;

            if (this._itemCfgInfo){
                let color = yx.textDict.QualityColor[this._itemCfgInfo["PinZhi"]];

                this.simpleTitleLabel.node.color = yx.colorUtil.toCCColor(color);

                //显示材料名称
                this.simpleTitleLabel.string   = this._itemCfgInfo.Name;

                //显示材料描述
                this.simpleContentLabel.string = this._itemCfgInfo.DefDesc;

                //显示材料icon
                this._setSprite(this._itemCfgInfo.Icon,this._itemCfgInfo.Type,this.simpleIconSp)

            }
        }
    },

    _setSprite(icon,type,sprite){

        if (icon != null ){
            //如果是数字，要去ResConfig中查: 目前遇到鱼是要去查resConfig的。若还要其他的，需要另传参数做区分；
            if(!(parseFloat(icon).toString() == "NaN")){
                let resCfg = yx.cfgMgr.getRecordByKey("ResConfig",{ID:icon});
                if (resCfg){
                    yx.resUtil.LoadSpriteByType(resCfg["Head"],yx.ResType.FISH,sprite);
                }
            }else if (icon.length > 0)
            {
                if (type == yx.ItemType.EQUIP)
                {
                    yx.resUtil.LoadSpriteByType(icon, yx.ResType.EQUIP, sprite);
                }
                else
                {
                    yx.resUtil.LoadSpriteByType(icon, yx.ResType.ITEM, sprite);
                }
            }
        }

    },

    onCloseBtnClick(){
        yx.windowMgr.goBack();
    },
    onBuyBtnClick(){

        if (this._args.buyCallback){
            this._args.buyCallback(this._xianNiangStoreCfgInfo);
        }

    },
});


yx.ItemDetailShowPanel = module.exports = ItemDetailShowPanel;