const BaseWindow = require('BaseWindow');
const MenPaiDuiHuanScrollItem = require("MenPaiDuiHuanScrollItem");

cc.Class({
    extends: BaseWindow,

    properties: {

        closeBtn:                 cc.Button,
        scrollContent:            cc.Node,
        menPaiDuiHuanScrollItemPrefab:   cc.Prefab,
        maskSp:                   cc.Button,
        danyaoTab:                cc.Button,
        dandaoTab:                cc.Button,
        qidaoTab:                 cc.Button,
    },

    _onInit(args) {

        yx.eventDispatch.addListener(yx.EventType.ITEM_EXCHANGE, this.onExchangeReFresh, this);

        this.closeBtn.node.on('click', this.onCloseBtnClick, this);
        this.maskSp.node.on('click', this.onMaskSpClick, this);

        this.danyaoTab.node.on('click', this.onDanyaoTabClick, this);
        this.dandaoTab.node.on('click', this.onDandaoTabClick, this);
        this.qidaoTab.node.on('click', this.onQidaoTabClick, this);

        this._tabs = [this.danyaoTab,this.dandaoTab,this.qidaoTab];
        this._curTab = 0;
    },
   

    _onShow(){
        this._refresh();
    },

    _onHide(){
    },

    _onDeInit(){

    },

    onCloseBtnClick(){
        yx.windowMgr.goBack();
    },
    onMaskSpClick(){
        yx.windowMgr.goBack();
    },

    onDanyaoTabClick(){
        if(this._curTab == 0)
            return;
        this._curTab = 0;
        this._refreshTab();
    },

    onDandaoTabClick(){
        if(this._curTab == 1)
            return;
        this._curTab = 1;
        this._refreshTab();
    },

    onQidaoTabClick(){
        if(this._curTab == 2)
            return;
        this._curTab = 2;
        this._refreshTab();
    },

    _refreshTab()
    {
        for (let index = 0; index < this._tabs.length; index++) {
            const element = this._tabs[index];
            element.node.getChildByName("selected").active = false;
            element.node.getChildByName("Background").active = true;
        }

        this._tabs[this._curTab].node.getChildByName("selected").active = true;
        this._tabs[this._curTab].node.getChildByName("Background").active = false;


        let duihuanList = this._duihuanList[this._curTab];
        
        this._itemArr = [];
        let self = this;
        self.scrollContent.removeAllChildren(true);
        duihuanList.forEach(data => {
            let scrollItem = cc.instantiate(self.menPaiDuiHuanScrollItemPrefab);
            let itemSrc = scrollItem.getComponent(MenPaiDuiHuanScrollItem);
            if (itemSrc)
            {
                itemSrc.init(data);
                self.scrollContent.addChild(scrollItem);

                this._itemArr.push(itemSrc);
            }
        });

        
    },

    _refresh(){

        let danyaoList = yx.cfgMgr.getRecordList("ExchangeConfig",{Type:1,Page:1});
        let dandaoList = yx.cfgMgr.getRecordList("ExchangeConfig",{Type:1,Page:2});
        let qidaoList = yx.cfgMgr.getRecordList("ExchangeConfig",{Type:1,Page:3});

        this._duihuanList = [danyaoList,dandaoList,qidaoList];

        this._refreshTab();
    },


    onExchangeReFresh(){
        for (const item of this._itemArr) {
            item.refreshExchange();
        }
        yx.ToastUtil.showListToast("兑换成功");
    },

});
