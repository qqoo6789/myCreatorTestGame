const BaseWindow = require('BaseWindow');


let XianNiangWindow = cc.Class({
    extends: BaseWindow,

    statics:{
        SHOW_TYPE_BUY     : 2,
        SHOW_TYPE_TIAO_ZHI: 3,
    },
    properties: {
        buyPageNode:cc.Node,//购买页节点

        homeHeadScrollview:cc.ScrollView,
        homeHeadLayout:cc.Layout,
        homePreBtn:cc.Button,
        homeNextBtn:cc.Button,
        homeContentLayout:cc.Layout,
        homeTextLabel:cc.Label,
        homeBuyBtn:cc.Button,
        homeTiaoZhiBtn:cc.Button,
        homeNormalCountRiText:cc.RichText,
        homeJPCountRiText:cc.RichText,
        colorSquareItemPrefab:cc.Prefab,
        xianNiangItemPrefab:cc.Prefab,
        buyPageClostBtn:cc.Button,
        buyPageLayout:cc.Layout,
    },

    _onInit(args) {
        yx.ColorSquareItem._itemPrefab = this.colorSquareItemPrefab;
        yx.XianNiangItem._itemPrefab = this.xianNiangItemPrefab;

        this.buyPageNode.active = false;
        this.homePreBtn.node.on('click', this._onHomePreBtnClick, this);
        this.homeNextBtn.node.on('click', this._onHomeNextBtnClick, this);
        this.homeBuyBtn.node.on('click', this._onHomeBuyBtnClick, this);
        this.homeTiaoZhiBtn.node.on('click', this._onHomeTiaoZhiBtnClick, this);
        this.buyPageClostBtn.node.on('click', this._onBuyPageClostBtnClick, this);

        yx.eventDispatch.addListener(yx.EventType.REFRESH_CAVE_LIAN_XIANNIANG, this._refresh, this);

        yx.eventDispatch.addListener(yx.EventType.CURRENCY_CHANGE, this.onEventCurrencyChange, this);


        //加载与显示头部的制作target
        this._loadHeadLayoutItem();

    },
    //加载头部的Item
    _loadHeadLayoutItem(){
        //仙酿制作配置
        let xianNiangMakeCfgMap =  yx.cfgMgr.getAllConfig("XianNiangMakeConfig");

        this.colorSquareItemSrc = [];

        for (let value of xianNiangMakeCfgMap.values()){
            this.colorSquareItemSrc[value.ID] = (yx.ColorSquareItem.CreateItem(value,this.homeHeadLayout.node,"colorSquareItem",this._updateTiaoZhiStuff.bind(this)));
        }

        this.curSelectXianNiangMakeID = 1;//默认选中第一本书

        this.homeHeadScrollview.scrollToOffset(cc.v2(0,0), 1.5);
    },

    //购买页面，购买Item加载
    _onHomeBuyBtnClick(){
        this.buyPageNode.active = true;

        if (this._buyPageNodeInit){return}

        this._buyPageNodeInit = true;

        /**
         *
         * @param xianNiangItemSrc
         * @param type
         * @param info XianNiangStoreConfig 查询的某个对象
         */
        let onBuyBtnClick = function(xianNiangItemSrc,type,info){
            let cost = info["Cost"][0];
            let isEnough = false;
            let name = "";
            if (cost && cost["id"] == 1){
                let ownLingShi = yx.playerMgr.getCurrency(yx.CyType.LINGSHI);
                let needLingShi = cost["count"];
                name = "灵石";
                if (ownLingShi >= needLingShi){isEnough = true}
            }

            if (cost && cost["id"] == 2){
                let ownXianyu = yx.playerMgr.getCurrency(yx.CyType.SHENYU);
                let needLingyu = cost["count"];
                name = "仙玉";
                if (ownXianyu >= needLingyu){isEnough = true}
            }

            if (isEnough){
                yx.caveMgr.reqBuyWine(info["ID"]);
            }else {
                yx.ToastUtil.showListToast(name+"不足");
            }
        };

        //仙酿商店配置
        let xianNiangStoreCfgMap =  yx.cfgMgr.getAllConfig("XianNiangStoreConfig");

        for (let value of xianNiangStoreCfgMap.values()){
            yx.XianNiangItem.CreateItem(value,this.buyPageLayout.node,"xianNiangStoreItem",yx.XianNiangWindow.SHOW_TYPE_BUY,null,onBuyBtnClick.bind(this))
        }
    },

    _onHomePreBtnClick(){
        this.homeHeadScrollview.scrollToOffset(cc.v2(0,0), 1.5);
    },
    _onHomeNextBtnClick(){
        let maxOffset = this.homeHeadLayout.node.getContentSize().width;
        this.homeHeadScrollview.scrollToOffset(cc.v2(maxOffset,0), 1.5);
    },

    _onHomeTiaoZhiBtnClick(){

        if (!this.curSelectXianNiangMakeID){
            yx.ToastUtil.showListToast("请先选择需要的调制的仙酿");
            return;
        }

        if (this.isEnougnStuff){
            //开始调制
            //yx.ToastUtil.showListToast("开始调制");
            if (!this.curSelectXianNiangPinZhi){
                return;
            }

            yx.caveMgr.reqMakeTreasure(yx.CaveBuildType.XIANNIANG,this.curSelectXianNiangMakeID,this.curSelectXianNiangPinZhi,1);
            return;
        }

        yx.ToastUtil.showListToast("道具不足");
    },
    _onBuyPageClostBtnClick(){
        this.buyPageNode.active = false;
    },
    _onShow(){

        //这个请求仅仅为了获得两个显示的数值
        yx.caveMgr.reqMakeRoom(yx.CaveBuildType.XIANNIANG);
    },



    onEventCurrencyChange(diff){

        if (!this.isShown()) return;

        //可优化,针对性的刷新

        //更新数值
        if ( this.curSelectXianNiangMakeID){
            let xianNiangMakeCfg =  yx.cfgMgr.getRecordByKey("XianNiangMakeConfig",{ID:this.curSelectXianNiangMakeID});
            if (xianNiangMakeCfg){
                this._updateTiaoZhiStuff(this.colorSquareItemSrc[this.curSelectXianNiangMakeID],xianNiangMakeCfg);
            }
        }
    },

    _refresh(){

        if ( this.curSelectXianNiangMakeID){
            let xianNiangMakeCfg =  yx.cfgMgr.getRecordByKey("XianNiangMakeConfig",{ID:this.curSelectXianNiangMakeID});
            if (xianNiangMakeCfg){
                this._updateTiaoZhiStuff(this.colorSquareItemSrc[this.curSelectXianNiangMakeID],xianNiangMakeCfg);
            }
        }

        if (yx.caveMgr.getCaveLianZhiData()){
            this.xianNiangData = yx.caveMgr.getCaveLianZhiData()[yx.CaveBuildType.XIANNIANG];
            if (this.xianNiangData){

                //设置次数
                let normalNum = this.xianNiangData["normalLeft"] || 0;
                let jpNum = this.xianNiangData["bestLeft"] || 0;

                let strJp = yx.colorUtil.AddColorString("极品仙酿调制次数：",yx.colorUtil.TextBlueLigth);
                this.homeJPCountRiText.string =strJp +this._setColor(jpNum);

                let strNomal = yx.colorUtil.AddColorString("普通仙酿调制次数：",yx.colorUtil.TextBlueLigth);
                this.homeNormalCountRiText.string = strNomal+this._setColor(normalNum);
            }
        }
    },
    //如果num <= 0 ，那么红色 ，否则绿色
    _setColor(num){
        if (num <= 0){
            return yx.colorUtil.AddColorString(num+"次",yx.colorUtil.TextRed);
        }
        return yx.colorUtil.AddColorString(num+"次",yx.colorUtil.TextGreen);
    },

    /**
     * 根据选中的item显示对应的制作草材料
     * @param colorSquareItem
     * @info  XianNiangMakeConfig的查询对应
     * @private
     */
    _updateTiaoZhiStuff(colorSquareItem,info){

        if (colorSquareItem){
            //实现单选 只有选中的会被显示外框
            for (let i in this.colorSquareItemSrc){
                this.colorSquareItemSrc[i].showIsCheck(this.colorSquareItemSrc[i] === colorSquareItem);
            }
        }

        if (!info) return;

        this.curSelectXianNiangMakeID = info["ID"];

        //info为 XianNiangMake.json的指定的对象
        this.isEnougnStuff = true;//是否有足够材料

        //this.homeContentLayout.node.removeAllChildren(true);

        //显示调制的产出品
        let realStuffItemCfg = yx.cfgMgr.getRecordByKey("ItemConfig", {ID:info["Reward"][0]["id"]});
        if (realStuffItemCfg){
            this.curSelectXianNiangPinZhi = realStuffItemCfg["PinZhi"];
            //yx.resUtil.LoadSpriteByType(realStuffItemCfg["Icon"],yx.ResType.ITEM,this.realStuffSp);
        }

        //显示调制的产出品的描述
        this.homeTextLabel.string = info["DefDesc1"];

        //开始item的显示
        let costInfos = [];

        //XiangNiangCost 放第一位
        let needNum = info["XiangNiangCost"][0]["count"];
        let ownNum = yx.bagMgr.getItemNum(info["XiangNiangCost"][0]["id"]);//从背包取
        if (ownNum < needNum){this.isEnougnStuff = false;}
        let ownNumStr = this._getRichTextStr(ownNum,needNum);
        //查名字
        let itemName = "";
        let xiangNiangCostItemCfg = yx.cfgMgr.getRecordByKey("ItemConfig", {ID:info["XiangNiangCost"][0]["id"]});
        if (xiangNiangCostItemCfg){
            itemName = yx.colorUtil.AddColorString(xiangNiangCostItemCfg["Name"],yx.colorUtil.TextWhite)+"\n";
        }

        let itemInfo = {};
        itemInfo["content"] = itemName + ownNumStr+yx.colorUtil.AddColorString("/"+needNum,yx.colorUtil.TextWhite);
        itemInfo["ID"] = info["XiangNiangCost"][0]["id"];
        costInfos.push(itemInfo);

        //接着处理 Cost
        for (let i = 0; i < info["Cost"].length; i ++){

            let needNum = info["Cost"][i]["count"];
            let ownNum = yx.bagMgr.getItemNum(info["Cost"][i]["id"]);//从背包取
            let ownNumStr = this._getRichTextStr(ownNum,needNum);
            if (ownNum < needNum){this.isEnougnStuff = false;}//有一个不足，就不足
            //查名字
            let itemName = "";
            let itemCfg = yx.cfgMgr.getRecordByKey("ItemConfig", {ID:info["Cost"][i]["id"]});
            if (itemCfg){
                itemName = yx.colorUtil.AddColorString(itemCfg["Name"],yx.colorUtil.TextWhite)+"\n";
            }

            let itemInfo = {};
            itemInfo["content"] = itemName + ownNumStr+yx.colorUtil.AddColorString("/"+needNum,yx.colorUtil.TextWhite);
            itemInfo["ID"] = info["Cost"][i]["id"];
            costInfos.push(itemInfo);
        }



        //生产item
        for (let i = 0; i < costInfos.length; i++){
            let itemSlotNode = this.homeContentLayout.node.getChildByName("ItemSlot_"+i);
            if (itemSlotNode){
                let itemRichTextWidgetSrc = itemSlotNode.getComponentInChildren(yx.ItemRichTextWidget);
                if (itemRichTextWidgetSrc){
                    itemRichTextWidgetSrc.refresh(costInfos[i]);
                    continue;
                }
            }

            yx.ItemRichTextWidget.CreateItemSlot(costInfos[i], this.homeContentLayout.node, "ItemSlot_" + (i),this._onTiaoZhiItemStuffClickCb.bind(this));
        }

    },



    _getRichTextStr(num,needNum){
        if (num < needNum){
            //材料不够- >红色
            return yx.colorUtil.AddColorString(""+num,yx.colorUtil.TextRed)
        }
        //材料足够- >白色
        return  yx.colorUtil.AddColorString(""+num,yx.colorUtil.TextWhite);

    },

    //real调制所需材料item被点击的时候的回调  这里的Info 为 ItemConfig.json 指定对象
    _onTiaoZhiItemStuffClickCb(info){
        let args = {};
        //传入Item 的id
        args.ID = info["ID"];
        //设置itemDetailShowPanel显示方式
        args.showType = yx.ItemDetailShowPanel.SHOW_TYPE_SIMPLE;
        //打开
        yx.windowMgr.showWindow("itemDetailShowPanel", args);
    },

});

yx.XianNiangWindow = module.exports = XianNiangWindow;