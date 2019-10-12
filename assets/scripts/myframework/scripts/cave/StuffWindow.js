const BaseWindow = require('BaseWindow');
const GoBackWidget = require('GoBackWidget');
const StuffItemWidget = require('StuffItemWidget');

const MaxTime = 10.5;
let StuffWindow = cc.Class({
    extends: BaseWindow,

    properties: {
        backWidget: GoBackWidget,//返回组件
        timeProgressBar: cc.ProgressBar,//时间进度
        timeLabel: cc.Label,//时间值
        idleXianpuLabel: cc.Label,//空闲仙仆数量
        idleXianpuAddBtn: cc.Button,//空闲仙仆添加按钮

        itemLayout: cc.Layout,//中间的条目

        lingShiSrc: StuffItemWidget,
        shiWuSrc: StuffItemWidget,
        muCaiSrc: StuffItemWidget,
        yunTieSrc: StuffItemWidget,


        logRichText: cc.RichText,//日志RichText
        logScrollView:cc.ScrollView//日志滚动

    },

    //此窗口第一次被创建的时候，由windownMgr自动调用
    _onInit() {

        this.stuffItemWidgetArr = [];
        this.stuffItemWidgetArr.push(this.lingShiSrc);
        this.stuffItemWidgetArr.push(this.shiWuSrc);
        this.stuffItemWidgetArr.push(this.muCaiSrc);
        this.stuffItemWidgetArr.push(this.yunTieSrc);

        this.curTime  = 10.5; //此值作为静态的。

        this._initLogEvent();
        //初始化点击事件监听
        this.initEvenListener();
        //初始化日志的事件监听
        this.initLogRichListener();
        //初始化洞穴中间item区域
        this.initItemGroup();
        //倒计时进度条
        //this._updateProgressBar(0);
    },

    _onShow() {
        //yx.caveMgr.reqDongfuInfo();
        this._refresh();

        yx.DiarysUtil.setRichTextWithShowList(this.logRichText, "dongfu");
    },

    _refresh() {
        this.idleXianpuLabel.string = yx.playerMgr.getCurrency(yx.CyType["PUCON"]);

        //刷新ui
        this.lingShiSrc.refresh();
        this.muCaiSrc.refresh();
        this.yunTieSrc.refresh();
        //食物的部分计算以来前面的，所以放到最后刷新
        this.shiWuSrc.refresh();
    },
    //初始化事件监听
    initEvenListener() {

        this.idleXianpuAddBtn.node.on('click', this.onIdleXianpuAddBtnClick, this);

        yx.eventDispatch.addListener(yx.EventType.REFRESH_STUFF_WINDOW, this._refresh, this);

        // yx.eventDispatch.addListener(yx.EventType.PLAYER_ITEM_CHG, this.onEventItemChange, this);

        //真实的数据变化
        yx.eventDispatch.addListener(yx.EventType.CURRENCY_CHANGE, this.onEventCurrencyChange, this);

        //仅仅用于显示
        yx.eventDispatch.addListener(yx.EventType.CURRENCY_CHANGE_SHOW, this.onEventCurrencyChangeShow, this);

    },

    /**
     * 材料数量变化
     * @param diff
     */
    onEventCurrencyChange(diff) {
        if (this.isShown()) {
            if (diff) {
                if (diff[yx.CyType.LINGSHI] != 0 || diff[yx.CyType.SHIWU] != 0 || diff[yx.CyType.MUCAI] != 0 || diff[yx.CyType.YUNTIE] != 0) {
                    this._refresh();
                }

            }
        }
    },
    /**
     * 票提示
     * @param retObj
     */
    onEventCurrencyChangeShow(retObj) {
        if (this.isShown() && retObj) {
            let currencyArr = retObj["currency"];
            let toastObj = {lingshiNum:0,shiwuNum:0,mucaiNum:0,yuntieNum:0};
            for (let i = 0; i < currencyArr.length; i++) {
                let itemMsg = currencyArr[i];
                switch (itemMsg.itemId) {
                    case yx.CyType.LINGSHI:
                        toastObj["lingshiNum"] = itemMsg.amount;
                        break;
                    case yx.CyType.SHIWU:
                        toastObj["shiwuNum"] = itemMsg.amount;
                        break;
                    case yx.CyType.MUCAI:
                        toastObj["mucaiNum"] = itemMsg.amount;
                        break;
                    case yx.CyType.YUNTIE:
                        toastObj["yuntieNum"] = itemMsg.amount;
                        break;
                }
            }
            yx.ToastUtil.showCaveToast(toastObj, this.node);
        }
        this.curTime = MaxTime;
    },
    //初始化日志的事件监听
    initLogRichListener() {
        //添加各种Log的事件监听
        this.node.on('Log_Event_Type', function (event) {
            //触发日志
            //yx.eventText.addShowTextToRichText(this.logRichText, "cave", {list: 1, year:"198", name:"丹道"});
            event.stopPropagation();
        });
    },
    //初始化洞穴中间item区域
    initItemGroup() {

        this.lingShiSrc.init();
        this.shiWuSrc.init();
        this.muCaiSrc.init();
        this.yunTieSrc.init();

        this._sortItem();

    },

    _sortItem() {

        //获取顺序
        this.shiWuSrc.index = yx.cfgMgr.getRecordByKey("DongFuOrderConfig", {Type: yx.StuffItemType.SHIWU})["Index"];
        this.muCaiSrc.index = yx.cfgMgr.getRecordByKey("DongFuOrderConfig", {Type: yx.StuffItemType.MUCAI})["Index"];
        this.yunTieSrc.index = yx.cfgMgr.getRecordByKey("DongFuOrderConfig", {Type: yx.StuffItemType.YUNTIE})["Index"];
        this.lingShiSrc.index = yx.cfgMgr.getRecordByKey("DongFuOrderConfig", {Type: yx.StuffItemType.LINGSHI})["Index"];

        //重排序
        this.stuffItemWidgetArr.sort(function (a, b) {
            if (a.index < b.index) {
                return -1;
            } else if (a.index == b.index) {
                return 0;
            } else {
                return 1;
            }
        });

        //移除
        //this.itemLayout.node.removeAllChildren(false);

        //重新添加
        for (let i = 0; i < this.stuffItemWidgetArr.length; i++) {
            this.itemLayout.node.insertChild(this.stuffItemWidgetArr[i].node,i);
        }

        //因为layout不会根据zIndex或者localZOrder来排序，他只和加入顺序有关。所以这里只能先暂时移除，在重新添加进来。
        //this.itemLayout.updateLayout();
    },

    //倒计时进度条
    _updateProgressBar(dt) {
        if (this.curTime <= 0) {
            return;
        }
        this.curTime -= dt;
        this.timeProgressBar.progress = this.curTime / MaxTime;
        this.timeLabel.string = yx.timeUtil.seconds2hourMinSecond(this.curTime);

    },

    update(dt) {
        this._updateProgressBar(dt);
    },

    //添加可用仙仆
    onIdleXianpuAddBtnClick() {
        cc.log("onIdleXianpuAddBtnClick");

        this.isEnougnFood = false;//是否有足够食物去增加仙仆
        let caveData = yx.caveMgr.getCaveData();

        if (!caveData){
            return;
        }

        let curBuyTimes = caveData["buyTimes"];
        let nextTimes = curBuyTimes + 1;
        let xianPuCfg = yx.cfgMgr.getRecordByKey("XianPuExpandConfig", {Times: nextTimes});
        if (!xianPuCfg) {
            return;
        }
        let costFoodNum = xianPuCfg["Cost"][0]["count"];
        let shiWuStuffData = yx.caveMgr.getStuffDataByType(yx.StuffItemType.SHIWU);
        let curFoodNum = shiWuStuffData["curChuLiang"];// 获取食物储量

        let arg = {};
        arg.content = "";
        arg.content += "是否需要花费" + costFoodNum + "食物招募一名仙仆？\n当前剩余食物:" + curFoodNum + "\n";

        if (curFoodNum >= costFoodNum) {
            this.isEnougnFood = true
        }

        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "StuffWindow";
        clickEventHandler.handler = "onIdleXianpuAddConfirmBtnClick";
        arg.confirmCallback = clickEventHandler;

        yx.windowMgr.showWindow("textConfirm", arg);
    },

    //确认回掉
    onIdleXianpuAddConfirmBtnClick() {
        cc.log("onIdleXianpuAddConfirmBtnClick");
        if (!this.isEnougnFood) {
            yx.ToastUtil.showListToast("食物不足");
            return;
        }

        yx.caveMgr.reqAddTotalWorker();
    },

    ////////////////////////////////////////////日志事件////////////////////////////////////////////////////////

    _initLogEvent(){
        //炼药 修炼开始  //炼器 修炼开始
        yx.eventDispatch.addListener(yx.EventType.XIULIAN, this.onEventXiuLian, this);
        //炼药开始
        yx.eventDispatch.addListener(yx.EventType.LIANYAO_MAKE, this.onEventLianYaoBegin, this);
        //炼器开始
        yx.eventDispatch.addListener(yx.EventType.LIANQI_MAKE, this.onEventLianQiBegin, this);
        //炼器成功或失败
        yx.eventDispatch.addListener(yx.EventType.LIANQI_AWARD, this.onEventLianQiEnd, this);
        //炼药成功或失败
        yx.eventDispatch.addListener(yx.EventType.LIANYAO_AWARD, this.onEventLianYaoEnd, this);
        //建造
        yx.eventDispatch.addListener(yx.EventType.DONGFU_UNLOCK_RES, this.onEventBuildUnLock, this);
        //升级 灵石、木材、。。
        yx.eventDispatch.addListener(yx.EventType.DONGFU_BUILD_LEVELUP, this.onEventStuffUpgrade, this);
        //悟道开始
        yx.eventDispatch.addListener(yx.EventType.WUDAO_NOTIFY, this.onEventWuDaoAddNotifyRes, this);
    },


    onEventXiuLian(resp){
        if (!this.isShown()){return;}
        if (!resp){return;}

        let args = {};
        args.year = yx.timeUtil.getXiuLianYear();
        args.index = 0;
        if (resp["type"] == yx.ShuGeItemType.DANDAO){
            args.name = "丹道";
        }else {
            args.name = "器道";
        }

        yx.DiarysUtil.addShowTextToRichText(this.logRichText, "dongfu", args);
        this.logScrollView.scrollToBottom();
    },
    onEventWuDaoAddNotifyRes(name){
        //if (!this.isShown()){return;}

        let args = {};
        args.year = yx.timeUtil.getXiuLianYear();
        args.index = 11;
        args.name = name;
        yx.DiarysUtil.addShowTextToRichText(this.logRichText, "dongfu", args);
        this.logScrollView.scrollToBottom();
    },
    onEventLianYaoBegin(){
        if (!this.isShown()){return;}

        let args = {};
        args.year = yx.timeUtil.getXiuLianYear();
        args.index = 3;
        args.name = "丹道";
        yx.DiarysUtil.addShowTextToRichText(this.logRichText, "dongfu", args);
        this.logScrollView.scrollToBottom();
    },
    onEventLianQiBegin(){
        if (!this.isShown()){return;}

        let args = {};
        args.year = yx.timeUtil.getXiuLianYear();
        args.index = 4;
        args.name = "器道";
        yx.DiarysUtil.addShowTextToRichText(this.logRichText, "dongfu", args);
        this.logScrollView.scrollToBottom();
    },
    onEventLianYaoEnd(data){
        if (!this.isShown()){return;}
        let args = {};
        args.year = yx.timeUtil.getXiuLianYear();
        if (data.success){
            args.index = 5;
        }else {
            args.index = 13;
        }

        args.name = data.name;
        yx.DiarysUtil.addShowTextToRichText(this.logRichText, "dongfu", args);
        this.logScrollView.scrollToBottom();
    },
    onEventLianQiEnd(data){
        if (!this.isShown()){return;}
        let args = {};
        args.year = yx.timeUtil.getXiuLianYear();
        if (data.success){
            args.index = 6;
        }else {
            args.index = 12;
        }

        args.name = data.name;
        yx.DiarysUtil.addShowTextToRichText(this.logRichText, "dongfu", args);
        this.logScrollView.scrollToBottom();

    },
    onEventBuildUnLock(buildName){
        if (!this.isShown()){return;}
        let args = {};
        args.year = yx.timeUtil.getXiuLianYear();
        args.index = 7;
        args.name = buildName;
        yx.DiarysUtil.addShowTextToRichText(this.logRichText, "dongfu", args);
        this.logScrollView.scrollToBottom();
    },
    onEventStuffUpgrade(data){
        if (!this.isShown()){return;}
        let args = {};
        args.year = yx.timeUtil.getXiuLianYear();
        args.index = 8;
        switch (data["type"]) {
            case yx.StuffItemType.LINGSHI:args.name = "灵石坊";break;
            case yx.StuffItemType.SHIWU:args.name = "兽栏";break;
            case yx.StuffItemType.MUCAI:args.name = "木枋";break;
            case yx.StuffItemType.YUNTIE:args.name = "陨铁坊";break;
        }
        args.level = data["curLevel"];
        yx.DiarysUtil.addShowTextToRichText(this.logRichText, "dongfu", args);
        this.logScrollView.scrollToBottom();
    },

});

yx.StuffWindow = module.exports = StuffWindow;