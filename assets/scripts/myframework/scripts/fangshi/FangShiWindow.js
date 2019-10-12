const BaseWindow = require('BaseWindow');
const FangShiScrollItem = require("FangShiScrollItem");
const GoodsItemWidget = require("GoodsItemWidget");

const _pageIndexArray = [
    yx.proto.ShopType.LingBaoGe, 
    yx.proto.ShopType.CangShuGe, 
    yx.proto.ShopType.WeiWangGe, 
    yx.proto.ShopType.XianYuGe,
    yx.proto.ShopType.Recharge
];

cc.Class({
    extends: BaseWindow,

    properties:{
        fangshiScrollItemPrefab:    cc.Prefab,
    
        // 黑市
        heishiBtn:                  cc.Button,

        //属性区
        cyTitleLabel1:              cc.Label,
        cyValueLabel1:              cc.Label,
        cyTitleLabel2:              cc.Label,
        cyValueLabel2:              cc.Label,
      
        //标题 类别加楼层
        titleLabel:                 cc.Label,

        //类别按钮区
        switchTC:                   cc.ToggleContainer,

        //滚动区   
        scrollView:                 cc.ScrollView,
        scrollContent:              cc.Node,

        //底部信息区
        prevBtn:                    cc.Button,
        zhaoshiBtn:                 cc.Button,
        nextBtn:                    cc.Button,
        nextHintLabel:              cc.Label,
        
        //下次进货时间
        timeHintLabel:              cc.Label,

        //当前商店类型
        _curType:                   Number,
        //当前楼层
        _curLevel:                  Number,
        
    },

    _onInit(args){

        this.heishiBtn.node.on('click', this.onHeishiBtnClick, this);
        this.prevBtn.node.on('click', this.onPrevBtnClick, this);
        this.zhaoshiBtn.node.on('click', this.onZhaoShiBtnClick, this);
        this.nextBtn.node.on('click', this.onNextBtnClick, this);


        yx.eventDispatch.addListener(yx.EventType.CURRENCY_CHANGE, this.onEventCurrencyChange, this);

        yx.eventDispatch.addListener(yx.EventType.FANG_SHI_LIST, this.onEventFangShiList, this);
        yx.eventDispatch.addListener(yx.EventType.PURCHASE_GOODS, this.onEventGoodsChange, this);

        this._initSwitchTC();

        //起始页是门派技能
        if (args != null)
        {
            this._curType = args;
        }
        else
        {
            this._curType = _pageIndexArray[0];
        }        

        this._curLevel = 1;
        this._shopCfg = null;
        this._nextLevelCfg = null;

        this._changeTypeAndLevel(this._curType, this._curLevel);
    },

    _onShow(args) {
        if (args != null)
        {
            this._curType = args;
        }

        this._changeTypeAndLevel(this._curType, this._curLevel);

        let goodsList = yx.fangshiMgr.getGoodsList(this._curType, this._curLevel);

        if (goodsList && goodsList.length > 0)
        {
            this._refresh();
        }
        else
        {
            yx.fangshiMgr.reqShopList();
        }
    },

    _initSwitchTC(){
        this.switchTC.checkEvents.length = 0;   
        
        this.switchTC.checkEvents.push(yx.CodeHelper.NewClickEvent(this, "onSwitchTCClick"));
    },

    _changeTypeAndLevel(type, level)
    {
        this._curType = type;
        this._curLevel = level;

        if (this._curType != yx.proto.ShopType.Recharge)
        {
            this._shopCfg = yx.cfgMgr.getOneRecord("ShopBaseConfig", {Type:this._curType, Layer:this._curLevel});
            this._nextLevelCfg = yx.cfgMgr.getOneRecord("ShopBaseConfig",  {Type:this._curType, Layer:this._curLevel + 1});
        }
    },

    //刷新某一个商品
    _refreshGoods(goodsId, remain)
    {
        let goodsWidgetList = this.scrollContent.getComponentsInChildren(GoodsItemWidget);

        let findWidget = goodsWidgetList.find(elem => {
            return elem.goodsId == goodsId;
        });

        if (findWidget)
        {
            findWidget.changeRemain(remain);
        }        
    },
 
    _refreshScroll(){
        let goodsList = yx.fangshiMgr.getGoodsList(this._curType, this._curLevel);

        // if (!goodsList || goodsList.length == 0)
        // {
        //     return;
        // }

        this.scrollContent.removeAllChildren(true);

        if (!goodsList)
        {
            goodsList = new Array(9);            
        }
        else if (goodsList.length < 9)
        {
            goodsList.length = 9;
        }

        //一行三个，有多少行
        //最少显示三行，空数据也要三行
        let row = Math.ceil(goodsList.length / 3);

        for (let i = 0; i < row; i++)
        {
            let scrollItem = cc.instantiate(this.fangshiScrollItemPrefab);

            let itemSrc = scrollItem.getComponent(FangShiScrollItem);

            if (itemSrc)
            {
                itemSrc.init(goodsList[i * 3], goodsList[i * 3 + 1], goodsList[i * 3 + 2]);

                this.scrollContent.addChild(scrollItem);
            }
        }        
    },

    //充值页面
    _refreshRecharge(){
        
    },

    //除充值之外的页面
    _refreshShop(){
        if (!this._shopCfg)
        {
            return;
        }

        if (this._curType == yx.proto.ShopType.LingBaoGe || this._curType == yx.proto.ShopType.CangShuGe)
        {
            this.zhaoshiBtn.node.active = true;
        }
        else
        {
            this.zhaoshiBtn.node.active = false;
        }

        this.titleLabel.string = this._shopCfg.LayerName;

        this.prevBtn.node.active = this._curLevel > 1;
        this.nextBtn.node.active = false;
        this.nextHintLabel.string = "";
     
        if (this._nextLevelCfg)
        {
            this.nextBtn.node.active = yx.playerMgr.getDuJieLevel() >= this._nextLevelCfg.LevelLimit;

            if (this.nextBtn.node.active == false)
            {
                //达到{levelName}\n方可上楼
                let levelCfg = yx.cfgMgr.getOneRecord("DuJieConfig", {Level:this._nextLevelCfg.LevelLimit});
                
                if (levelCfg)
                {
                    this.nextHintLabel.string = "达到" + levelCfg.Name + "\n方可上楼";
                }
            }
        }
        
        this._refreshScroll();
    },

    _refreshCurrency(){
        //除了威望堂显示灵石、威望，其他都显示灵石、仙玉
        this.cyTitleLabel1.string = "灵石";
        this.cyValueLabel1.string = yx.playerMgr.getCurrency(yx.CyType.LINGSHI);

        if (this._curType == yx.proto.ShopType.WeiWangGe)
        {
            this.cyTitleLabel2.string = "威望";
            this.cyValueLabel2.string = yx.playerMgr.getCurrency(yx.CyType.WEIWANG);
        }
        else
        {
            this.cyTitleLabel2.string = "仙玉";
            this.cyValueLabel2.string = yx.playerMgr.getCurrency(yx.CyType.SHENYU);
        }
    },
 

    _refresh(){
        this._refreshCurrency();

        if (this._curType == yx.proto.ShopType.Recharge)
        {
            this._refreshRecharge();
        }
        else
        {
            this._refreshShop();
        }
    },

    onSwitchTCClick(event, customEventData){
        cc.log("onSwitchTCClick");

        let newIndex = this.switchTC.toggleItems.indexOf(event);

        if (newIndex >= 0)
        { 
            let newPage = _pageIndexArray[newIndex];

            if (newPage != undefined && newPage != this._curType)
            {
                this._changeTypeAndLevel(newPage, this._curLevel);
                //this._curType = newPage;
                this._refresh();
            }
        }        
    },

    //下楼
    onPrevBtnClick(){
        if (this._curLevel > 1)
        {
            this._changeTypeAndLevel(this._curType, this._curLevel - 1);

            this._refresh();
        }
    },

    //找事
    onZhaoShiBtnClick(){

    },

    //上楼
    onNextBtnClick(){
        if (this._nextLevelCfg && yx.playerMgr.getDuJieLevel() >= this._nextLevelCfg.LevelLimit)
        {
            this._changeTypeAndLevel(this._curType, this._curLevel + 1);

            this._refresh();
        }
        else
        {
            yx.ToastUtil.showListToast("等级不足");
        }
    },

    // 黑市
    onHeishiBtnClick(){
        yx.windowMgr.showWindow("heishi");
    },

    onEventCurrencyChange(diff){
        if (this.isShown() && diff != null)
        {     
            if (diff[yx.CyType.LINGSHI] != undefined 
                || diff[yx.CyType.WEIWANG] != undefined 
                || diff[yx.CyType.SHENYU] != undefined)
            {
                this._refreshCurrency();
            }            
        }
    },

    onEventFangShiList(){
        if (this.isShown())
        {
            this._refresh();
        }        
    },

    onEventGoodsChange(resp){
        if (this.isShown() && resp && resp.shopInfo)
        {
            let shopType = resp.shopInfo.shopType;
            let level = resp.shopInfo.layer;

            if (this._curType == shopType && this._curLevel == level)
            {
                this._refreshGoods(resp.shopInfo.goodsID, resp.shopInfo.remainCount);
            }
        }
    },
   
});