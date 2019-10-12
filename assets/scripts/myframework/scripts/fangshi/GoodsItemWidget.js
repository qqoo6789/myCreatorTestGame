
/**
 * 坊市的商品控件
 */

const IconStatusHasLearnPath = "textures/fangshi/iocn-123";
const IconStatusSellOutPath = "textures/fangshi/iocn-124";

cc.Class({
    extends: cc.Component,

    properties: {   
        cyIconSp:       cc.Sprite,
        goodsIconSp:    cc.Sprite,
        numLabel:       cc.Label,
        statusSp:       cc.Sprite,
        nameLabel:      cc.Label,

        itemNode:       cc.Node,

        _goodsId:       Number,
        _remain:        Number,
        _goodsCfg:      null,
        _itemCfg:       null,

        goodsId: {
            get: function() {
                return this._goodsId;
            }
        }
    },

    /**
     * GoodsItemWidget的初始化函数
     * @param {goodsMsg} info 道具信息
     */
    init(info){
        this.node.on('click', this.onBtnClick, this);
        //this.node.setContentSize(this.bgSprite.node.getContentSize());

        if (info == null)
        {
            this.itemNode.active = false;
            return;
        }
     
        this._goodsCfg = yx.cfgMgr.getOneRecord("ShopListConfig", {ID:info.goodsID, Type: info.shopType, Layer:info.layer});
        
        if (!this._goodsCfg)
        {
            this.itemNode.active = false;
            return;
        }

        this._itemCfg = yx.cfgMgr.getOneRecord("ItemConfig", this._goodsCfg.Reward[0].id);

        if (!this._itemCfg)
        {
            this.itemNode.active = false;
            return;
        }

        this._goodsId = info.goodsID;
        this._remain = info.remainCount;

        //货币图片
        let costItemCfg = yx.cfgMgr.getOneRecord("ItemConfig", this._goodsCfg.Cost[0].id + 80000);

        if (costItemCfg)
        {
            yx.resUtil.LoadSpriteByType(costItemCfg.Icon, yx.ResType.ITEM, this.cyIconSp);
        }

        //消耗数量
        this.numLabel.string = this._goodsCfg.Cost[0].count;

        //道具图片
        yx.resUtil.LoadSpriteByType(this._itemCfg.Icon, yx.ResType.ITEM, this.goodsIconSp);
        //道具名称
        this.nameLabel.string = this._itemCfg.Name;

        this._refreshRemain();

        this.itemNode.active = true;
    },

    _refreshRemain(){
        if (this._remain > 0)
        {
            this.statusSp.spriteFrame = null;
        }
        else if (this._checkHasLearn())//如果是书、图纸，判断学习情况
        {
            yx.resUtil.LoadSprite(IconStatusHasLearnPath, this.statusSp);
        }
        else
        {
            yx.resUtil.LoadSprite(IconStatusSellOutPath, this.statusSp);
        }
    },

    _checkHasLearn(){
        switch (this._itemCfg.UseType)
        {
            case 7:
                //锻器
                return true;
            case 9:
                //炼丹
                return false;
            case 11:
                return yx.gongfaMgr.hasLearnByIndex(this._itemCfg.UseArg[0]);
        }
        return false;
    },
    
 
    changeRemain(remain){
        this._remain = remain;

        this._refreshRemain();
    },

    //点击道具栏
    onBtnClick(){    
        cc.log("[GoodsItemWidget onBtnClick]");

        if (this._checkHasLearn())
        {
            //已学习
            yx.ToastUtil.showListToast(this._itemCfg.Name + "已学习");
            return;
        }
        else if (this._remain == 0)
        {
            //该商品已售罄
            yx.ToastUtil.showListToast("该商品已售罄");
            return;
        }
     
        let args = {};
        args.remain = this._remain;
        args.goodsCfg = this._goodsCfg;

        yx.windowMgr.showWindow("goodsDetail", args);
    },
});