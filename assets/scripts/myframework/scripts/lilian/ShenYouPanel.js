const BaseWindow = require('BaseWindow');
const NumberWidget = require("NumberWidget");

const SHENGYOU_CONTENT = {
    "shenHunChuQiao": {
        "content": "炼神还虚，神魂出窍，游历四海八荒，是为神游境。学会<color=#bb1f29 click='chuQiaoBookClickHandler'><u>《神魂出窍术》</u></color>，即可使用神魂斩妖除魔，探索搜集。",
    },
    "shenYouTaiXu": {
        "content": "凝魂炼魄，强神锻意，即为<color=#bb1f29 click='taiXuBookClickHandler'><u>《神游太虚术》</u></color>。学会该术，即可强大神魂，更可提高探索搜集的效率。",
    },
    "default": {
        "content": "凝魂炼魄，强神锻意，道友当下神魂强大，于神游历练时可高效探索搜集。",
    }
};

const ShuaiRuoDes100= "肉灵分离过久，将会神魂虚弱，则神游收益效果降低。距离神魂虚弱剩余可神游次数<color=#B6222E>{count}</color>次。";
const ShuaiRuoDes200= "神魂虚弱中，神游收益降低<color=#ff0000>50%</color>，距离神魂衰竭剩余神游次数<color=#ff0000>{count}</color>次。每百年神魂恢复如初，距离神魂恢复尚有<color=#18AA31>{year}</color>年。";
const ShuaiRuoDes300= "神魂衰竭中，神游收益降低<color=#ff0000>80%</color>。每百年神魂可恢复如初，距离神魂恢复尚有<color=#18AA31>{year}</color>年。";
const ShenYouDes= "注:当前每轮可神游{maxCount}(蕴魂花增加{addCount})次";

const SHENGYOU_STATE = {
    ON_BEGIN: 1,
    UN_BEGIN: 2,
};

let ShenYouPanel = cc.Class({
    extends: BaseWindow,

    statics: {
        SHENGYOU_STATE: SHENGYOU_STATE,
    },
    properties: {

        closeBtn: cc.Button,
        ShenYouBeginBtn: cc.Button,//开始神游按钮
        itemLayout: cc.Layout,//

        mapNameLabel: cc.Label,//当前选中的地图名称
        comsumeNumLabel: cc.RichText,//地图每轮消耗

        textRichText: cc.RichText,//"炼神还虚，神魂出窍..."
        shuaiRuoLabel: cc.RichText,//"肉灵分离过久，将会神魂虚弱..."
        tipRiText: cc.RichText,//底部提示
        shenHunShiYiBtn: cc.Button,
        numberWidget: NumberWidget,//
        unBeginNode: cc.Node,//未开始节点

        onBeginNode: cc.Node,//已开始节点
        shenYouLabel: cc.Label,//"神游若君山    1/1"
        progressBar: cc.ProgressBar,
        progressBarTime: cc.Label,
        shenHunGuiQiao: cc.Button,

        shenYouItemPrefab: cc.Prefab,
    },
    _onInit(args) {

        yx.ShenYouItem._itemPrefab = this.shenYouItemPrefab;

        this.unBeginNode.active = false;
        this.onBeginNode.active = false;

        this.closeBtn.node.on('click', this.onCloseBtnClick, this);
        this.shenHunShiYiBtn.node.on('click', this.onShenHunShiYiBtnClick, this);
        this.shenHunGuiQiao.node.on('click', this.onShenHunGuiQiaoClick, this);
        this.ShenYouBeginBtn.node.on('click', this.onShenYouBeginBtnClick, this);

        this.shenYouItemSrcArr = [];
        let liLianCfgs = yx.cfgMgr.getAllConfig("LiLianMapConfig");
        if (liLianCfgs) {
            for (let i = 0; i < liLianCfgs.length; i++) {
                this.shenYouItemSrcArr[liLianCfgs[i].ID] = yx.ShenYouItem.CreateItemSlot(liLianCfgs[i], this.itemLayout.node, "shenyouitem" + i, this.itemClickCb.bind(this));
            }
        }

        //文字内容回调
        this.textRichText.chuQiaoBookClickHandler = this.chuQiaoBookClickHandler;//出窍
        this.textRichText.taiXuBookClickHandler = this.taiXuBookClickHandler;//太虚

        //根据服务器状态显示
        this.textRichText.string = "";
        this.shuaiRuoLabel.string = "";
        this.tipRiText.string = "";

        //默认
        this.numberWidget.init(1, 1);
        this.mapNameLabel.string = "";
        this.comsumeNumLabel.string = "";

        yx.eventDispatch.addListener(yx.EventType.SHENGYOU_ERFRESH_INFO, this.refresh, this);

        //此购买方式废弃
        //yx.eventDispatch.addListener(yx.EventType.SHENGYOU_SHENYOUITEM, this.onEventBuyShenYouItem, this);
        yx.eventDispatch.addListener(yx.EventType.SHENGYOU_SET_AUTOSELL, this.onEventShengYouSetAutosell, this);

        yx.eventDispatch.addListener(yx.EventType.SHENGYOU_STOPSHENYOU, this.onEventStopShenYou, this);
        yx.eventDispatch.addListener(yx.EventType.SHENGYOU_BEGINSHENYOU, this.onEventBeginShenYou, this);
        yx.eventDispatch.addListener(yx.EventType.PURCHASE_GOODS, this.onEventGoodsChange, this);

    },

    //开始神游
    onEventBeginShenYou(resp) {
        yx.shenYouMgr.reqGetShenYouInfo();
    },
    //停止神游
    onEventStopShenYou(resp) {
        cc.Canvas.instance.unschedule(cc.Canvas.instance.shenYouEndCallBack);
        //cc.Canvas.instance.shenYouEndCallBack = null;

        yx.shenYouMgr.reqGetShenYouInfo();
    },

    //设置自动售卖
    onEventShengYouSetAutosell(resp) {
        if (this.shenYouData) {
            this.shenYouData["autoSellItem"] = resp["pinzhi"];
        }
    },

    //购买
    onEventGoodsChange(resp){
        if (this.isShown() && resp && resp.shopInfo)
        {
            yx.ToastUtil.showListToast("购买成功");
        }
    },

    //此购买方式废弃
    /*onEventBuyShenYouItem(resp) {
        let systemId = resp.systemId;
        if (this.shenYouData) {
            if (systemId === yx.ShenYouBookPanel.SHENYOU_CHUQIAO_SYSTEMID) {//出窍
                this.shenYouData["autoFight"] = true;
            } else if (systemId === yx.ShenYouBookPanel.SHENYOU_SHIYI_SYSTEMID) {//拾遗
                this.shenYouData["autoSell"] = true;
            } else if (systemId === yx.ShenYouBookPanel.SHENYOU_TAIXU_SYSTEMID) {//太虚
                this.shenYouData["quick"] = true;
            }
        }

        yx.ToastUtil.showListToast("购买成功");
        this.refreshTitleContent();

    },*/
    refresh(resp) {
        if (resp){this.shenYouData = resp;}

        if (!this.shenYouData) return;

        if (!cc.Canvas.instance.shenYouEndCallBack){
            cc.Canvas.instance.shenYouEndCallBack = this.shenYouEndCallBack.bind(this);
        }
        //
        if (this.shenYouData["state"] === ShenYouPanel.SHENGYOU_STATE.ON_BEGIN){
            let leftTime = (this.shenYouData["endTime"] - yx.timeUtil.getServerTime())/1000;
            if (leftTime > 0){
                cc.Canvas.instance.unschedule(cc.Canvas.instance.shenYouEndCallBack);

                cc.log("更新调度时间：神游结束调度scheduleOnce 在"+leftTime+"秒之后调度一次");
                cc.Canvas.instance.scheduleOnce(cc.Canvas.instance.shenYouEndCallBack,leftTime+1);
            }
        }

        this.curSelectMapID = this.shenYouData["mapId"];

        //若没有选中的，那么默认最后一个
        if (!this.curSelectMapID) this.curSelectMapID = yx.battleMgr.getLiLianTopMapId();

        //显示与隐藏对应Ui
        if (this.shenYouData["state"] === ShenYouPanel.SHENGYOU_STATE.UN_BEGIN) {
            this.unBeginNode.active = true;
            this.onBeginNode.active = false;
        } else if (this.shenYouData["state"] === ShenYouPanel.SHENGYOU_STATE.ON_BEGIN) {
            this.unBeginNode.active = false;
            this.onBeginNode.active = true;
            this.shenYouLabel.string = "神游" + this.shenYouItemSrcArr[this.curSelectMapID].getName() + this.shenYouData["currentCount"] + "/" + this.shenYouData["count"];

            //通知神游进行中，要显示神游进行特效
            //yx.eventDispatch.dispatchMsg(yx.EventType.SHENGYOU_SHENYOU_ISDOING);

        }

        if (this.curSelectMapID) {
            //选中item
            this.shenYouItemSrcArr[this.curSelectMapID].setSelect(true);
            //地图与消耗显示
            this.refreshMainMessage(this.shenYouItemSrcArr[this.curSelectMapID].getMapCfgItem());
        }

        //历练头部的信息更新
        this.refreshTitleContent();

        //历练次数信息更新
        let systemCfg = yx.cfgMgr.getOneRecord("SystemConfig",{id:17});
        if (systemCfg){
            let count = 0;
            let left = 0;
            if (this.shenYouData["fightMapCount"] >= 0 && this.shenYouData["fightMapCount"] < systemCfg.str_value[0]){
                count = systemCfg.str_value[0] - this.shenYouData["fightMapCount"];
                this.shuaiRuoLabel.string = ShuaiRuoDes100.format({count:count});
            }
            else if (this.shenYouData["fightMapCount"] >= systemCfg.str_value[0] && this.shenYouData["fightMapCount"] < systemCfg.str_value[1]){
                count = systemCfg.str_value[1] - this.shenYouData["fightMapCount"];
                left =  Math.floor((this.shenYouData["endTime"]/1000 + 24*60*60 - yx.timeUtil.getServerTime()/1000)/(15*60));
                this.shuaiRuoLabel.string = ShuaiRuoDes200.format({count:count,year:left});

            }
            else if (this.shenYouData["fightMapCount"] >= systemCfg.str_value[1] && this.shenYouData["fightMapCount"] < systemCfg.str_value[2]){
                //count = systemCfg.str_value[2] - this.shenYouData["fightMapCount"];
                left =  Math.floor((this.shenYouData["endTime"]/1000 + 24*60*60 - yx.timeUtil.getServerTime()/1000)/(15*60));
                this.shuaiRuoLabel.string = ShuaiRuoDes300.format({year:left});
            }
        }

        //此数值在道具使用功能完成后 完善。
        //更新数值
        let dujieConfig = yx.cfgMgr.getRecordByKey("DuJieConfig", {Level:yx.playerMgr.getDuJieLevel()});
        if (dujieConfig){
            let addCount = yx.playerMgr.getItemUseCount(1032);//蕴魂花 的使用次数。
            let maxCount = dujieConfig["GuaJiOnceMax"] + addCount;
            this.numberWidget.init(1, maxCount);
            this.tipRiText.string = ShenYouDes.format({maxCount:maxCount,addCount:addCount});
        }

    },
    refreshTitleContent(){
        //显示对应的title
        if (!this.shenYouData["autoFight"]) {//若没开启神游
            this.textRichText.string = SHENGYOU_CONTENT.shenHunChuQiao.content;
        } else if (!this.shenYouData["quick"]) {//若没开启太虚 -- 加速
            this.textRichText.string = SHENGYOU_CONTENT.shenYouTaiXu.content;
        } else{
            this.textRichText.string = SHENGYOU_CONTENT.default.content;
        }
    },

    update(dt) {
        //有数据，有选中，状态已开始游戏
        if (this.shenYouData && this.curSelectMapID && this.shenYouData["state"] === ShenYouPanel.SHENGYOU_STATE.ON_BEGIN) {
            this.shenYouData["curTime"] -= dt;

            if (this.shenYouData["curTime"] < 0) {
                //
                if (this.shenYouData["currentCount"] < this.shenYouData["count"] && this.shenYouData["currentCount"] >= 0) {
                    this.shenYouData["currentCount"] += 1;
                    this.shenYouData["curTime"] = this.shenYouData["maxTime"];
                } else {
                    this.shenYouData["curTime"] = 0;
                    this.shenYouData["mapId"] = 0;
                    this.shenYouData["state"] = yx.ShenYouPanel.SHENGYOU_STATE.UN_BEGIN;
                    /*
                    yx.eventDispatch.dispatchMsg(yx.EventType.SHENGYOU_ENDSHENYOU);
                    this.refresh();*/
                    return;
                }
            }
            this.shenYouLabel.string = "神游" + this.shenYouItemSrcArr[this.curSelectMapID].getName() + this.shenYouData["currentCount"] + "/" + this.shenYouData["count"];
            this.progressBar.progress = this.shenYouData["curTime"] / this.shenYouData["maxTime"];

            let leftTime = (this.shenYouData["endTime"] - yx.timeUtil.getServerTime())/1000;
            leftTime = leftTime < 0? 0:leftTime;
            this.progressBarTime.string = yx.timeUtil.seconds2hourMinSecond(leftTime);
        }
    },

    shenYouEndCallBack(){
        cc.log("神游结束调度1");
        let shenYouData = yx.shenYouMgr.getShenYouData();

        if (!shenYouData){
            yx.eventDispatch.dispatchMsg(yx.EventType.SHENGYOU_ENDSHENYOU);
            return;
        }
        cc.log("神游结束调度2");
        shenYouData["curTime"] = 0;
        shenYouData["mapId"] = 0;
        shenYouData["state"] = yx.ShenYouPanel.SHENGYOU_STATE.UN_BEGIN;
        yx.eventDispatch.dispatchMsg(yx.EventType.SHENGYOU_ENDSHENYOU);

        if (this && this.isShown && this.isShown()){
            this.refresh();
        }

        //cc.Canvas.instance.shenYouEndCallBack = null;
    },

    itemClickCb(mapCfgItem) {
        if (!this.shenYouData){
            return true;
        }

        //当前正在神游
        if (this.shenYouData && this.shenYouData.mapId){
            yx.ToastUtil.showListToast("正在神游");
            return true;
        }

        this.refreshMainMessage(mapCfgItem);

        return false;
    },

    //刷新主页地图与食物信息
    refreshMainMessage(mapCfgItem){
        if (!mapCfgItem) return;

        //地图名称显示
        this.mapNameLabel.string = mapCfgItem["Name"];
        this.curSelectMapID = mapCfgItem["ID"];

        //食物消耗显示
        let guaJiCfg = yx.cfgMgr.getOneRecord("LiLianGuaJiRewardConfig", {ID: mapCfgItem.ID})
        if (guaJiCfg) {
            this.comsumeNumLabel.string =  guaJiCfg["Cost"][0]["count"] + "食物";
        }
    },

    onCloseBtnClick() {
        yx.windowMgr.goBack();
    },

    _onShow(args) {
        yx.shenYouMgr.reqGetShenYouInfo();
    },

    _onHide() {
        yx.eventDispatch.removeListenersByTarget(this);
    },

    //神魂出窍书籍点击
    chuQiaoBookClickHandler(event) {
        yx.windowMgr.showWindow("itemQuickBuyPanel", {bookType: yx.ItemQuickBuyPanel.SHENYOU_BOOKTYPE_CHUQIAO});
    },

    //神魂太虚书籍点击
    taiXuBookClickHandler(event) {
        yx.windowMgr.showWindow("itemQuickBuyPanel", {bookType: yx.ItemQuickBuyPanel.SHENYOU_BOOKTYPE_TAIXU});
    },

    //神魂拾遗
    onShenHunShiYiBtnClick() {
        if (!this.shenYouData) {
            return;
        }

        //没有开通，则去书籍购买
        if (!this.shenYouData["autoSell"]) {
            yx.windowMgr.showWindow("itemQuickBuyPanel", {bookType: yx.ItemQuickBuyPanel.SHENYOU_BOOKTYPE_SHIYI});
            return;
        }

        //
        yx.windowMgr.showWindow("shenHunShiYiPanel", this.shenYouData);

    },

    //神魂归窍
    onShenHunGuiQiaoClick() {
        let arg = {};
        arg.content = yx.colorUtil.AddColorString("正在神游中，确认要终止神游？", yx.colorUtil.TextWhite);
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "ShenYouPanel";
        clickEventHandler.handler = "onShenHunGuiQiaoConfirmClick";
        arg.confirmCallback = clickEventHandler;
        yx.windowMgr.showWindow("textConfirm", arg);
    },
    onShenHunGuiQiaoConfirmClick() {
        yx.shenYouMgr.reqStopShenYou();
    },

    onShenYouBeginBtnClick(){
        if (!this.shenYouData) return;
        if (!this.shenYouData["autoFight"]) {
            yx.ToastUtil.showListToast("未学习《神魂出窍术》");
            return;
        }

        if (this.curSelectMapID > yx.battleMgr.getLiLianTopMapId())  {
            yx.ToastUtil.showListToast("关卡未通过");
            return;
        }

        yx.shenYouMgr.reqShenYou(this.numberWidget.getCurNum(),this.curSelectMapID);
    }

});

yx.ShenYouPanel = module.exports = ShenYouPanel;