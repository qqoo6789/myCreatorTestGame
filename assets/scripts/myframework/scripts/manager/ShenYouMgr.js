/**
 * !#en ShenYouManager
 * !#zh 神游数据类。
 * @class ShenYouManager
 * @extends
 */
yx.ShenYouManager = function () {
};

yx.ShenYouManager.prototype = {
    constructor: yx.ShenYouManager,
    init: function () {
        //此购买方式废弃
        //yx.network.addHandler(yx.proto.CmdId.BUY_SHENYOU_ITEM, this.onMessageBuyShenYouItem.bind(this));
        yx.network.addHandler(yx.proto.CmdId.SET_AUTO_SELL, this.onMessageSetAutoSell.bind(this));
        yx.network.addHandler(yx.proto.CmdId.SHENYOU, this.onMessageShenYou.bind(this));
        yx.network.addHandler(yx.proto.CmdId.STOP_SHENYOU, this.onMessageStopShenYou.bind(this));
        yx.network.addHandler(yx.proto.CmdId.SHENYOU_LOG, this.onMessageShenYouLog.bind(this));
        yx.network.addHandler(yx.proto.CmdId.SHENYOU_INFO, this.onMessageShenYouInfo.bind(this));
    },

    getShenYouData(){
        if (!this._shenYouData){
            cc.warn("getShenYouData null");
        }
        return this._shenYouData;
    },
    //////////////////////////////////以下是请求//////////////////////////////////

    //此购买方式废弃
    /*reqBuyShenYouItem(systemId) {

        let buyShenyouItem = new yx.proto.C2S_BuyShenyouItem;
        buyShenyouItem.systemId = systemId;
        yx.network.sendMessage(yx.proto.CmdId.BUY_SHENYOU_ITEM, buyShenyouItem);
    },*/

    reqSetAutoSell(pinzhi) {

        let setAutoSell = new yx.proto.C2S_SetAutoSell;
        setAutoSell.pinzhi = pinzhi;
        yx.network.sendMessage(yx.proto.CmdId.SET_AUTO_SELL, setAutoSell);
    },

    reqShenYou(count, mapId) {

        let shenyou = new yx.proto.C2S_Shenyou;
        shenyou.count = count;
        shenyou.mapId = mapId;
        yx.network.sendMessage(yx.proto.CmdId.SHENYOU, shenyou);
    },

    reqStopShenYou() {

        let shenyou = new yx.proto.C2S_StopShenyou;
        yx.network.sendMessage(yx.proto.CmdId.STOP_SHENYOU, shenyou);
    },

    reqGetShenYouInfo() {

        let shenyouInfo = new yx.proto.C2S_ShenyouInfo;
        yx.network.sendMessage(yx.proto.CmdId.SHENYOU_INFO, shenyouInfo);
    },

    //////////////////////////////////以下是消息处理//////////////////////////////////

    //此购买方式废弃
   /* onMessageBuyShenYouItem(errMsg, data) {
        if (errMsg != null && errMsg.length > 0) {
            yx.ToastUtil.showListToast(errMsg);
            cc.log("[ShenYouManager onMessageBuyShenYouItem] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_BuyShenyouItem.decode(data);
        if (resp) {
            yx.eventDispatch.dispatchMsg(yx.EventType.SHENGYOU_SHENYOUITEM,resp);
        }

    },*/

    onMessageSetAutoSell(errMsg, data) {
        if (errMsg != null && errMsg.length > 0) {
            yx.ToastUtil.showListToast(errMsg);
            cc.log("[ShenYouManager onMessageSetAutoSell] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_SetAutoSell.decode(data);
        if (resp) {

            yx.eventDispatch.dispatchMsg(yx.EventType.SHENGYOU_SET_AUTOSELL,resp);
        }

    },
    onMessageShenYou(errMsg, data) {
        if (errMsg != null && errMsg.length > 0) {
            yx.ToastUtil.showListToast(errMsg);
            cc.log("[ShenYouManager onMessageShenYou] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_Shenyou.decode(data);
        if (resp) {

            yx.eventDispatch.dispatchMsg(yx.EventType.SHENGYOU_BEGINSHENYOU,resp);
        }

    },

    onMessageStopShenYou(errMsg, data) {
        if (errMsg != null && errMsg.length > 0) {
            yx.ToastUtil.showListToast(errMsg);
            cc.log("[ShenYouManager onMessageStopShenYou] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_StopShenyou.decode(data);
        if (resp) {

            yx.eventDispatch.dispatchMsg(yx.EventType.SHENGYOU_STOPSHENYOU,resp);
        }

    },
    onMessageShenYouLog(errMsg, data) {
        if (errMsg != null && errMsg.length > 0) {
            yx.ToastUtil.showListToast(errMsg);
            cc.log("[ShenYouManager onMessageShenYouLog] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_ShenyouLog.decode(data);
        if (resp) {

            yx.eventDispatch.dispatchMsg(yx.EventType.SHENGYOU_LOG,resp);
        }

    },
    onMessageShenYouInfo(errMsg, data) {
        if (errMsg != null && errMsg.length > 0) {
            yx.ToastUtil.showListToast(errMsg);
            cc.log("[ShenYouManager onMessageShenYouInfo] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_ShenyouInfo.decode(data);
        if (resp) {

            if (!this._shenYouData) this._shenYouData = {};
            if (resp.hasOwnProperty("mapId")) this._shenYouData.mapId = resp["mapId"];

            if (resp.hasOwnProperty("autoSellItem")) this._shenYouData.autoSellItem = resp["autoSellItem"];
            if (resp.hasOwnProperty("count")) this._shenYouData.count = resp["count"];
            if (resp.hasOwnProperty("currentCount")) this._shenYouData.currentCount = resp["currentCount"];
            if (resp.hasOwnProperty("stepIndex")) this._shenYouData.stepIndex = resp["stepIndex"];
            if (resp.hasOwnProperty("startTime")) this._shenYouData.startTime = resp["startTime"];
            if (resp.hasOwnProperty("endTime")) this._shenYouData.endTime = resp["endTime"];
            if (resp.hasOwnProperty("fightMapCount")) this._shenYouData.fightMapCount = resp["fightMapCount"];


            if (resp.hasOwnProperty("autoSell")) this._shenYouData.autoSell = resp["autoSell"];
            if (resp.hasOwnProperty("quick")) this._shenYouData.quick = resp["quick"];//是否购买加速
            if (resp.hasOwnProperty("autoFight")) this._shenYouData.autoFight = resp["autoFight"];

            //autoSell自动卖 -> 神魂拾遗
            //this._shenYouData.autoSell = this._checkItemUse(yx.ItemQuickBuyPanel.SHENGYOU_LIST.shenHunShiYi.quickId);
            //quick 加速 -> 神魂太虚
            //this._shenYouData.quick = this._checkItemUse(yx.ItemQuickBuyPanel.SHENGYOU_LIST.shenYouTaiXu.quickId);
            //autoFight 自动挂机 -> 神魂出窍
            //this._shenYouData.autoFight = this._checkItemUse(yx.ItemQuickBuyPanel.SHENGYOU_LIST.shenHunChuQiao.quickId);

            this._shenYouData["state"] = yx.ShenYouPanel.SHENGYOU_STATE.UN_BEGIN;
            this._shenYouData["curTime"] = 0;
            this._shenYouData["maxTime"] = -1;

            if (resp.mapId){
                this._shenYouData["state"] = yx.ShenYouPanel.SHENGYOU_STATE.ON_BEGIN;

                this._shenYouData["currentCount"] += 1;//从1开始算

                //当前：神游次数大于等于总次数
                if (this._shenYouData["currentCount"] > this._shenYouData["count"]){
                    this._shenYouData["state"] = yx.ShenYouPanel.SHENGYOU_STATE.UN_BEGIN;
                }

                let systemCfg = yx.cfgMgr.getOneRecord("SystemConfig",{id:this._shenYouData["quick"]?16:15});
                if (systemCfg){


                    let leftCount = this._shenYouData["count"] - this._shenYouData["currentCount"];//还需要的次数

                    this._shenYouData["maxTime"] = systemCfg.int_value;//每一轮的时间

                    //还需神游总时间 = 当前时间 + 除当前次还需神游次数*每次的时间；
                    this._shenYouData["curTime"] = ((this._shenYouData["endTime"] - yx.timeUtil.getServerTime())/1000 - (leftCount * this._shenYouData["maxTime"]));

                    //存在一种特殊情况，原本是 按照240秒来计算的。但是突然吃了 神魂太虚，重连回来之后quick为true，这里会按60秒计算；那么就会不准确； 还应该按照240计算
                    //此65为最大容忍估计误差值。若是开启了太虚，curTime一般是不超过60的；即使网络延迟误差，不会超过61；
                    if (this._shenYouData["curTime"] > 65){

                        let systemCfg15 = yx.cfgMgr.getOneRecord("SystemConfig",{id:15});
                        this._shenYouData["maxTime"] = systemCfg15 ? systemCfg15.int_value :240;

                        this._shenYouData["curTime"] = ((this._shenYouData["endTime"] - yx.timeUtil.getServerTime())/1000 - (leftCount * this._shenYouData["maxTime"]));
                    }

                    if(this._shenYouData["curTime"] > this._shenYouData["maxTime"]){
                        cc.warn("onMessageShenYouInfo curTime 大于最大值 maxTime -->"+" curTime:"+this._shenYouData["curTime"]+" maxTime:"+this._shenYouData["maxTime"]);
                    }
                    if (this._shenYouData["curTime"] < 0){
                        cc.warn("onMessageShenYouInfo curTime 小于0 -->"+" curTime:"+this._shenYouData["curTime"]);
                        this._shenYouData["curTime"] = 0;
                    }
                }
            }

            yx.eventDispatch.dispatchMsg(yx.EventType.SHENGYOU_ERFRESH_INFO, this._shenYouData);
        }

    },
    //检查是否已经使用过
    _checkItemUse(quickId){

        let goodCfg = yx.cfgMgr.getOneRecord("ShopListConfig", {QuickId: quickId});
        if (goodCfg){
            let itemCfg = yx.cfgMgr.getOneRecord("ItemConfig", {ID: goodCfg.ID});
            if (itemCfg) {
                return yx.playerMgr.getItemUseCount(itemCfg["ID"]) > 0;
            }
        }
        return  false;
    }

};

yx.shenYouMgr = new yx.ShenYouManager();

module.exports = yx.shenYouMgr;