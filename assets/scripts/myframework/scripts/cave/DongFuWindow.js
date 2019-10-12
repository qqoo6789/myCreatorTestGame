const BaseWindow = require('BaseWindow');
const GoBackWidget = require('GoBackWidget');
cc.Class({
    extends: BaseWindow,

    properties: {
        shuGebtn: cc.Button,//书阁按钮
        resourceBtn: cc.Button,//资源按钮
        danFangBtn: cc.Button,//丹房按钮
        qiShiBtn: cc.Button,//器室Btn
        xianNiangBtn: cc.Button,//仙酿Btn
        daoLvBtn: cc.Button,//道侣Btn
        logRichText: cc.RichText,//日志RichText
        logScrollView:cc.ScrollView//日志滚动
    },

    _onInit(){
        this.shuGebtn.node.on('click', this.onShuGeBtnClick, this);
        this.danFangBtn.node.on('click', this.onDanFangBtnClick, this);
        this.qiShiBtn.node.on('click', this.onQiShiBtnClick, this);
        this.xianNiangBtn.node.on('click', this.onXianNiangBtnClick, this);
        this.daoLvBtn.node.on('click', this.onDaoLvBtnClick, this);
        this.resourceBtn.node.on('click', this.onStuffBtnClick, this);


        this._initLogEvent();
    },



    _onShow() {
        yx.caveMgr.reqDongfuInfo();
        yx.caveMgr.reqAllBook();

        //如果没有鼎，先去获取一下。
        let isOwnQiDIng = yx.caveMgr.checkIsOwnMachine(yx.CaveBuildType.QISHI);
        if (!isOwnQiDIng){
            yx.caveMgr.reqMakeRoom(yx.CaveBuildType.QISHI);
        }

        let isOwnDanFang = yx.caveMgr.checkIsOwnMachine(yx.CaveBuildType.DANFANG);
        if (!isOwnDanFang){
            yx.caveMgr.reqMakeRoom(yx.CaveBuildType.DANFANG);
        }

        yx.DiarysUtil.setRichTextWithShowList(this.logRichText, "dongfu");
    },
    //书阁点击
    onShuGeBtnClick() {
        cc.log("onShuGeBtnClick");

        //检查等级限制
        let openCfg = yx.cfgMgr.getRecordByKey("FuncOpenConfig", {ID:3});

        //级别不够，不能建造
        if (yx.playerMgr.getDuJieLevel() < openCfg["conditionnum"]) {
            yx.ToastUtil.showListToast(openCfg["opencondition"]);
            return;
        }

        let caveData = yx.caveMgr.getCaveData();
        if (caveData){
            //未建造
            if (!caveData["isBuild"][yx.CaveBuildType.SHUGE]) {
                let args = {type: yx.CaveBuildType.SHUGE};
                yx.windowMgr.showWindow("buildPanel", args);
            }
            //已建造，则直接打开
            else {
                yx.windowMgr.showWindow("shuge", null);
            }
        }


    },
    //丹房点击
    onDanFangBtnClick() {
        //yx.ToastUtil.showSimpleToast("修为提升：305",this.node);
        cc.log("onDanFangBtnClick");

        //检查等级限制
        let openCfg = yx.cfgMgr.getRecordByKey("FuncOpenConfig", {ID:6});

        //级别不够，不能建造
        if (yx.playerMgr.getDuJieLevel() < openCfg["conditionnum"]) {
            yx.ToastUtil.showListToast(openCfg["opencondition"]);
            return;
        }

        let caveData = yx.caveMgr.getCaveData();
        if (caveData){
            //未建造
            if (!caveData["isBuild"][yx.CaveBuildType.DANFANG]) {
                let args = {type: yx.CaveBuildType.DANFANG};
                yx.windowMgr.showWindow("buildPanel", args);
            }
            //已建造，则直接打开
            else {

                //若果没有丹炉，提示购买丹炉
                let isOwn = yx.caveMgr.checkIsOwnMachine(yx.CaveBuildType.DANFANG);
                if (!isOwn){
                    yx.ToastUtil.showListToast("请先购买丹炉");
                    return;
                }

                yx.windowMgr.showWindow("lianZhiPanel", {buildType: yx.CaveBuildType.DANFANG});
            }
        }
    },
    //器室点击
    onQiShiBtnClick() {
        cc.log("onQiShiBtnClick");
        //检查等级限制
        let openCfg = yx.cfgMgr.getRecordByKey("FuncOpenConfig", {ID:7});

        //级别不够，不能建造
        if (yx.playerMgr.getDuJieLevel() < openCfg["conditionnum"]) {
            yx.ToastUtil.showListToast(openCfg["opencondition"]);
            return;
        }


        let caveData = yx.caveMgr.getCaveData();
        if (caveData){
            //未建造
            if (!caveData["isBuild"][yx.CaveBuildType.QISHI]) {
                let args = {type: yx.CaveBuildType.QISHI};
                yx.windowMgr.showWindow("buildPanel", args);
            }
            //已建造，则直接打开
            else {
                //若果没有丹炉，提示购买丹炉
                let isOwn = yx.caveMgr.checkIsOwnMachine(yx.CaveBuildType.QISHI);
                if (!isOwn){
                    yx.ToastUtil.showListToast("请先购买器炉");
                    return;
                }
                yx.windowMgr.showWindow("lianZhiPanel", {buildType: yx.CaveBuildType.QISHI});
            }
        }


    },
    //仙酿点击
    onXianNiangBtnClick() {
        cc.log("onXianNiangBtnClick");
        //检查等级限制
        let openCfg = yx.cfgMgr.getRecordByKey("FuncOpenConfig", {ID:8});

        //级别不够，不能建造
        if (yx.playerMgr.getDuJieLevel() < openCfg["conditionnum"]) {
            yx.ToastUtil.showListToast(openCfg["opencondition"]);
            return;
        }

        yx.windowMgr.showWindow("xianNiangWindow", null);
    },
    //道侣点击
    onDaoLvBtnClick() {
        //检查等级限制
        let openCfg = yx.cfgMgr.getRecordByKey("FuncOpenConfig", {ID:22});

        //级别不够，不能建造
        if (yx.playerMgr.getDuJieLevel() < openCfg["conditionnum"]) {
            yx.ToastUtil.showListToast(openCfg["opencondition"]);
            return;
        }

        cc.log("onDaoLvBtnClick");
        yx.windowMgr.showWindow("daoLv");


    },
    //资源点击
    onStuffBtnClick() {
        cc.log("onStuffBtnClick");
        yx.windowMgr.showWindow("stuff");
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
