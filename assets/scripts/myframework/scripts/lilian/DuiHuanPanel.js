const BaseWindow = require('BaseWindow');

cc.Class({
    extends: BaseWindow,

    properties: {
        closeBtn: cc.Button,
        itemLayout: cc.Layout,
    },
    _onInit(args) {
        this.closeBtn.node.on('click', this._onCloseBtnClick, this);
        yx.eventDispatch.addListener(yx.EventType.ITEM_EXCHANGE,this.onEventItemExChange, this);
        yx.eventDispatch.addListener(yx.EventType.PLAYER_ITEM_CHG, this.onEventItemChange, this);
        //yx.eventDispatch.addListener(yx.EventType.CURRENCY_CHANGE, this.onEventCurrencyChange, this);
    },

    _onHide(){
        yx.eventDispatch.removeListenersByTarget(this);
    },
    _onShow(){
        this._refresh();
    },
    _refresh(){
        let exchangCfgs = yx.cfgMgr.getRecordList("ExchangeConfig",{Type:9});
        if (exchangCfgs){

            exchangCfgs.sort(function (a,b) {
                if (a.Top < b.Top) {
                    return -1;
                } else if (a.Top == b.Top) {
                    return 0;
                } else {
                    return 1;
                }
            });

            for (let i = 0; i < exchangCfgs.length; i++){
                let exchangCfgItem = exchangCfgs[i];
                let nodeName = "DuiHuanWidget_" + i;

                //无需每次都重新建造，存在的话，只需刷新
                let itemSlotNode = this.itemLayout.node.getChildByName(nodeName);
                if (itemSlotNode){
                    let duiHuanWidgetSrc = itemSlotNode.getComponentInChildren(yx.DuiHuanWidget);
                    if (duiHuanWidgetSrc){
                        duiHuanWidgetSrc.refresh(exchangCfgItem);
                        continue;
                    }
                }

                yx.DuiHuanWidget.CreateItemSlot(exchangCfgItem, this.itemLayout.node, nodeName);
            }
        }
    },

    _onCloseBtnClick(){
        yx.windowMgr.goBack();
    },

    onEventItemChange(){
        if (this.isShown()){
            this._refresh();
        }
    },
    //兑换结果回调 S2C_ExchangeItem 显示
    onEventItemExChange(resp){
        if (!this.isShown()) return;

        let id = resp.id;//
        let exchangCfgs = yx.cfgMgr.getOneRecord("ExchangeConfig",{ID:id});
        if (exchangCfgs){
            let itemId = exchangCfgs["GetReward"][0]["id"];
            let itemCfgItem = yx.cfgMgr.getOneRecord("ItemConfig",{ID:itemId});
            if (itemCfgItem){
                yx.ToastUtil.showListToast("获取"+itemCfgItem["Name"]+"x"+exchangCfgs["GetReward"][0]["count"]);
            }
        }
    }
});
