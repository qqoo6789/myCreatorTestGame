const BaseWindow = require('BaseWindow');
const LiLianItem = require('LiLianItem');

const LiLianPageType = {
    LILIAN: 1,//历练
    CHUIDIAO: 2,//垂钓
    SHENGSHOU: 3,//圣兽
};


let LiLianWindow = cc.Class({
    extends: BaseWindow,

    properties: {
        /************************首页公共****************************/
        homeLiLianBtn: cc.Button,//首页底部的历练按钮
        homeChuiDiaoBtn: cc.Button,//首页底部垂钓按钮
        homeShengShouBtn: cc.Button,//首页底部圣兽按钮
        homeLiLianBtnMarkNode: cc.Node,//按钮选中效果
        homeChuiDiaoBtnMarkNode: cc.Node,
        homeShengShouBtnMarkNode: cc.Node,
        homeStuffNameLabel: cc.Label,//材料名称
        homeStuffNumLabel: cc.Label,//材料数量
        homeLogRichText:cc.RichText,
        homeLogScrollView:cc.ScrollView,

        /************************历练页面****************************/
        liLianPageNode: cc.Node,//
        liLianMapContent: cc.Node,//所有地图btn的父节点
        liLianCurMapEffect: cc.Node,//当前关卡的标志
        liLianNewMapEffect: cc.Node,//新开关卡的标志
        liLianQiYuBtn:cc.Button,//奇遇按钮
        liLianShenYouBtn:cc.Button,//神游按钮
        liLianFeiShengBtn:cc.Button,//飞升按钮
        liLianShenYouEffNode:cc.Node,//神游效果
        liLianQiYuEffNode:cc.Node,//奇遇效果

        //以下历练页面的节点通通用ll开头


        /************************垂钓页面****************************/
        chuiDiaoPageNode: cc.Node,//

        //以下垂钓页面的节点通通用cd开头
        cdLeftTimesLabel: cc.Label,//剩余次数
        cdYuGanNameLabel: cc.Label,//鱼竿名称
        cdHuanHaiBtn: cc.Button,//幻海之心按钮
        cdChuiXingBtn: cc.Button,//垂星之诞按钮
        cdYuHuoBtn: cc.Button,//鱼获按钮
        cdDuiHuanBtn: cc.Button,//兑换按钮
        cdShuoMingBtn: cc.Button,//说明按钮

        /************************圣兽页面****************************/
        shengShouPageNode: cc.Node,//

        //以下圣兽页面的节点通通用ss开头
        ssFengYinBtn: cc.Button,//封印按钮
        ssDuiHuanBtn: cc.Button,//兑换按钮
        ssDuiHuanItemLayout: cc.Layout,//兑换列表
        ssDuiHuanPageNode: cc.Node,//兑换页面
        ssFengYinPageNode: cc.Node,//封印页面
        ssShuoMingBtn: cc.Button,//封印说明
        ssShenShouSp: cc.Sprite,//圣兽的大图
        ssShenShouDes: cc.RichText,//圣兽描述
        ssShenShouWanfaDes: cc.Label,//圣兽玩法描述
        ssTimeLabel: cc.Label,//每天时间
        ssYuYueFengYinBtn: cc.Button,//预约封印
        ssUnBeginNode: cc.Node,//未开始封印界面
        ssOnBeginNode: cc.Node,//已开始封印界面
        ssFengYinRiZhiRiText: cc.RichText,//封印日志
        ssFengYinRiZhiScroview: cc.ScrollView,//日志滚动
        ssFengYinFinishLabel: cc.Label,//"封印已完成，10分钟之内再次开启预约"
        ssTimeProBar: cc.ProgressBar,
        ssTimeProBarLabel: cc.Label,//进度时间
        ssFengYinNumLabel: cc.Label,//封印值
        ssWanChengNumLabel: cc.Label,//完成度数值
        ssHadYuYueNode: cc.Node,//已预约
        ssUnYuYueNode: cc.Node,//未预约
        ssOnDoingNode:cc.Node,//正在进行中
        ssOnOverNode:cc.Node,//刚好结束
        ssUnCanJiaNode:cc.Node,//封印开始，但没参加
    },
    _onInit() {
        //默认显示历练
        this.curPageType = LiLianPageType.LILIAN;

        /************************首页公共****************************/
        this.homeLiLianBtn.node.on("click", this._homeLiLianBtnClick, this);
        this.homeChuiDiaoBtn.node.on("click", this._homeChuiDiaoBtnClick, this);
        this.homeShengShouBtn.node.on("click", this._homeShengShouBtnBtnClick, this);

        this.liLianPageNode.active = true;//默认显示历练
        this.chuiDiaoPageNode.active = false;
        this.shengShouPageNode.active = false;
        this.homeStuffNumLabel.string = yx.playerMgr.getCurrency(yx.CyType.SHIWU);

        this.homeLiLianBtnMarkNode.active = true;//默认选中历练
        this.homeChuiDiaoBtnMarkNode.active = false;
        this.homeShengShouBtnMarkNode.active = false;
        this.ssOnOverNode.active = false;
        this.ssUnCanJiaNode.active = false;
        this.ssOnDoingNode.active = false;

        /************************历练页面****************************/

        this.liLianQiYuBtn.node.on("click", this._liLianQiYuBtnClick, this);
        this.liLianShenYouBtn.node.on("click", this._liLianShenYouBtnClick, this);
        this.liLianFeiShengBtn.node.on("click", this._liLianFeiShengBtnClick, this);

        /************************垂钓页面****************************/

        this.cdHuanHaiBtn.node.on("click", this._cdHuanHaiBtnClick, this);
        this.cdChuiXingBtn.node.on("click", this._cdChuiXingBtnClick, this);
        this.cdYuHuoBtn.node.on("click", this._cdYuHuoBtnClick, this);
        this.cdDuiHuanBtn.node.on("click", this.cdDuiHuanBtnClick, this);
        this.cdShuoMingBtn.node.on("click", this.cdShuoMingBtnClick, this);

        /************************圣兽页面****************************/
        this.logScheduleCallBackBind = this.logScheduleCallBack.bind(this);
        this.logScheduleTimerCallBackBind = this.logScheduleTimerCallBack.bind(this);
        this.isLogScheduleing = false;

        this.ssFengYinPageNode.active = true;//默认显示封印页
        this.ssDuiHuanPageNode.active = false;

        this.ssUnBeginNode.active = true;
        this.ssOnBeginNode.active = false;

        this.ssHadYuYueNode.active = false;
        this.ssUnYuYueNode.active = true;

        this.ssFengYinBtn.node.on("click", this.ssFengYinBtnClick, this);
        this.ssDuiHuanBtn.node.on("click", this.ssDuiHuanBtnClick, this);
        this.ssShuoMingBtn.node.on("click", this.ssShuoMingBtnClick, this);
        this.ssYuYueFengYinBtn.node.on("click", this.ssYuYueFengYinBtnClick, this);


        /************************其他****************************/
        yx.eventDispatch.addListener(yx.EventType.CHUIDIAO_RECONNECT_INFO, this._chuiDiaoReconnectInfo, this);
        yx.eventDispatch.addListener(yx.EventType.CHUIDIAO_COUNT_INFO, this._refreshChuiDiao, this);
        yx.eventDispatch.addListener(yx.EventType.CHUIDIAO_YUGAN_INFO, this._setYuGanName, this);
        yx.eventDispatch.addListener(yx.EventType.LILIAN_MAP, this.onEventLiLianMap, this);
        yx.eventDispatch.addListener(yx.EventType.ENTER_MAP, this.onEventEnterMap, this);

        yx.eventDispatch.addListener(yx.EventType.SHENGSHOU_REFRESH_INFO, this._refreshShengShou, this);
        yx.eventDispatch.addListener(yx.EventType.ITEM_EXCHANGE,this.onEventItemExChange, this);

        yx.eventDispatch.addListener(yx.EventType.SHENGYOU_LOG, this.onEventShenYouLog, this);
        yx.eventDispatch.addListener(yx.EventType.SHENGYOU_SHENYOUITEM, this.onEventShenYouBuyLog, this);
        yx.eventDispatch.addListener(yx.EventType.SHENGYOU_BEGINSHENYOU, this.onEventBeginShenYouLog, this);
        yx.eventDispatch.addListener(yx.EventType.SHENGYOU_ENDSHENYOU, this.onEventStopShenYouLog, this);
        yx.eventDispatch.addListener(yx.EventType.SHENGYOU_STOPSHENYOU, this.onEventStopShenYouLog, this);
        //yx.eventDispatch.addListener(yx.EventType.SHENGYOU_SHENYOU_ISDOING, this.onEventShenYouDoing, this);
        yx.eventDispatch.addListener(yx.EventType.SHENGYOU_ERFRESH_INFO, this.onEventShenYouInfo, this);
        //真实的数据变化
        yx.eventDispatch.addListener(yx.EventType.CURRENCY_CHANGE, this.onEventCurrencyChange, this);

        yx.eventDispatch.addListener(yx.EventType.QIYU_OPEN_WINDOW, this.onOpenQiYuWindow, this);
        //避免没网络，数据没下来的时候没显示
        this._refreshShengShou();
    },


    onEventCurrencyChange(diff){
        if (this.isShown()) {
            if (diff) {
                if (diff[yx.CyType.LINGSHI] !== 0 || diff[yx.CyType.SHIWU] !== 0) {
                    //钓鱼显示食物
                    if (this.curPageType === LiLianPageType.CHUIDIAO) {
                        this.homeStuffNumLabel.string = yx.playerMgr.getCurrency(yx.CyType.LINGSHI);
                    }else {
                        //其他显示灵石
                        this.homeStuffNumLabel.string = yx.playerMgr.getCurrency(yx.CyType.SHIWU);
                    }


                }
            }
        }
    },


    /*
     *  关闭的时候把调度器关掉
     */
    _onHide() {
        //this.ssTimeProBarWidget.unSchedule();
    },
    _onShow() {  
        yx.battleMgr.reqLiLianMap();
        //this._refresh();

        //请求神游数据，若正在进行神游，神游需要显示 特效
        if (this.curPageType === LiLianPageType.LILIAN){
            yx.shenYouMgr.reqGetShenYouInfo();
        }
        else if (this.curPageType === LiLianPageType.CHUIDIAO) {
            this._reqChuiDiaoPage();
        }
        else if (this.curPageType === LiLianPageType.SHENGSHOU){
            yx.shengShouMgr.reqGetFengyin(yx.proto.FengYinCmdType.GetFengYinBoss_Cmd);
        }

    },
    _refresh() {
        this._refreshLiLian();
        //this._refreshChuiDiao();
    },

    /************************神游区****************************/
    //神游日志
    onEventShenYouLog(resp) {
        let mapId = resp.mapId;
        let liLianCfg = yx.cfgMgr.getRecordByKey("LiLianMapConfig", {ID: parseInt(mapId)});
        if (liLianCfg){
            let args = {};
            args.index = 11;
            args.curMapName = liLianCfg["Name"];
            args.npcName = resp.npcName;
            args.year = yx.timeUtil.getXiuLianYear();
            let resources = resp.drop;
            args.reword = "";
            for (let i = 0; i < resources.length; i++) {
                let resource = resources[i];
                let id = resource.id;
                if (resource.type === 0) {//货币、需要+80000
                    id += 80000;
                }
                let itemCfg = yx.cfgMgr.getRecordByKey("ItemConfig", {ID: id});
                if (itemCfg) {
                    let endStr = (i === (resources.length-1))?"":"、";
                    args.reword += itemCfg["Name"] + "["+resource.count+"]"+endStr;
                }
            }

            yx.DiarysUtil.addShowTextToRichText(this.homeLogRichText, "liLian", args);
            this.homeLogScrollView.scrollToBottom();
        }
    },
    //神游info
    onEventShenYouInfo(resp){
        if (resp["state"] === yx.ShenYouPanel.SHENGYOU_STATE.ON_BEGIN){
            this.liLianShenYouEffNode.active = true;
        }else {
            this.liLianShenYouEffNode.active = false;
        }
    },
    //神游开通购买书籍日志
    onEventShenYouBuyLog(resp){

    },
    //神游进行中
    /*onEventShenYouDoing(){
        this.liLianShenYouEffNode.active = true;
    },*/
    //神游结束
    onEventStopShenYouLog(){
        //动效去除
        this.liLianShenYouEffNode.active = false;

        //结束日志
        let args = {};
        args.index = 12;
        args.year = yx.timeUtil.getXiuLianYear();
        yx.DiarysUtil.addShowTextToRichText(this.homeLogRichText, "liLian", args);
        this.homeLogScrollView.scrollToBottom();
    },
    //神游开始日志
    onEventBeginShenYouLog(resp){
        //动效显示
        this.liLianShenYouEffNode.active = true;

        //开始日志
        let mapId = resp.mapId;
        let liLianCfg = yx.cfgMgr.getRecordByKey("LiLianMapConfig", {ID: parseInt(mapId)});
        if (liLianCfg){
            let args = {};
            args.index = 10;
            args.curMapName = liLianCfg["Name"];
            args.year = yx.timeUtil.getXiuLianYear();
            yx.DiarysUtil.addShowTextToRichText(this.homeLogRichText, "liLian", args);
            this.homeLogScrollView.scrollToBottom();
        }
    },

    /************************首页区****************************/
    _homeLiLianBtnClick() {

        if (this.curPageType == LiLianPageType.LILIAN) {
            return;
        }

        this.homeStuffNameLabel.string = "食物";
        this.homeStuffNumLabel.string = yx.playerMgr.getCurrency(yx.CyType.SHIWU);

        this.curPageType = LiLianPageType.LILIAN;
        this._setCheckMark();
        this._setCheckPage();
    },
    _homeChuiDiaoBtnClick() {
        //检查等级限制
        let openCfg = yx.cfgMgr.getRecordByKey("FuncOpenConfig", {ID:25});
        if (yx.playerMgr.getDuJieLevel() < openCfg["conditionnum"]) {
            yx.ToastUtil.showListToast(openCfg["opencondition"]);
            return;
        }

        if (this.curPageType == LiLianPageType.CHUIDIAO) {
            return;
        }

        this.homeStuffNameLabel.string = "灵石";
        this.homeStuffNumLabel.string = yx.playerMgr.getCurrency(yx.CyType.LINGSHI);
        this._reqChuiDiaoPage();

        this.curPageType = LiLianPageType.CHUIDIAO;
        this._setCheckMark();
        this._setCheckPage();
        //this._refreshChuiDiao();
    },
    _reqChuiDiaoPage(){
        //获取垂星钓鱼消耗信息
        yx.chuiDiaoMgr.reqGoFishing(yx.proto.GoFishingCmdType["GetConsume_Cmd"], yx.proto.GoFishingFieldType["AboveGround"]);
        //获取幻海钓鱼消耗信息
        yx.chuiDiaoMgr.reqGoFishing(yx.proto.GoFishingCmdType["GetConsume_Cmd"], yx.proto.GoFishingFieldType["TheSky"]);
        //获取鱼竿信息
        yx.chuiDiaoMgr.reqGoFishing(yx.proto.GoFishingCmdType["GetFishingRod_Cmd"], yx.proto.GoFishingFieldType["AboveGround"]);

    },

    _homeShengShouBtnBtnClick() {

        if (this.curPageType == LiLianPageType.SHENGSHOU) {
            return;
        }

        this.homeStuffNameLabel.string = "食物";
        this.homeStuffNumLabel.string = yx.playerMgr.getCurrency(yx.CyType.SHIWU);

        this.curPageType = LiLianPageType.SHENGSHOU;
        this._setCheckMark();
        this._setCheckPage();

        yx.shengShouMgr.reqGetFengyin(yx.proto.FengYinCmdType.GetFengYinBoss_Cmd);
    },
    /************************历练区****************************/
    //历练
    _refreshLiLian() {
        let lilianItems = this.liLianMapContent.getComponentsInChildren(LiLianItem);
        let curLilian = null;

        lilianItems.forEach(elem => {
            elem.node.active = elem.getMapId() > 0 && elem.getMapId() <= yx.battleMgr.getLiLianTopMapId();
 
            if (yx.battleMgr.getLiLianCurMapId() > 0 && elem.getMapId() == yx.battleMgr.getLiLianCurMapId())
            {
                curLilian = elem;
            }
        });

        if (curLilian)
        {
            curLilian.node.insertChild(this.liLianCurMapEffect, 0);
            this.liLianCurMapEffect.setPosition(cc.v2(0, 110));

            curLilian.node.insertChild(this.liLianNewMapEffect, 10);
            this.liLianNewMapEffect.setPosition(cc.v2(0, 16));
            this.liLianNewMapEffect.getComponent(cc.Animation).play();
        }
        else
        {
            this.liLianPageNode.insertChild(this.liLianCurMapEffect, 0);
            this.liLianCurMapEffect.setPosition(cc.v2(0, 0));


            this.liLianPageNode.insertChild(this.liLianNewMapEffect, 0);
            this.liLianNewMapEffect.setPosition(cc.v2(0, 0));

        }
    },

    //奇遇
    _liLianQiYuBtnClick(){
        //检查等级限制
        let openCfg = yx.cfgMgr.getRecordByKey("FuncOpenConfig", {ID:24});
        if (yx.playerMgr.getDuJieLevel() < openCfg["conditionnum"]) {
            yx.ToastUtil.showListToast(openCfg["opencondition"]);
            return;
        }
        yx.JiYuanMgr.QiYuInfo();
    },
    //神游
    _liLianShenYouBtnClick(){
        //检查等级限制
        let openCfg = yx.cfgMgr.getRecordByKey("FuncOpenConfig", {ID:9});
        if (yx.playerMgr.getDuJieLevel() < openCfg["conditionnum"]) {
            yx.ToastUtil.showListToast(openCfg["opencondition"]);
            return;
        }

        yx.windowMgr.showWindow("shenYouPanel");
    },
    //飞升
    _liLianFeiShengBtnClick(){

        //检查等级限制
        let openCfg = yx.cfgMgr.getRecordByKey("FuncOpenConfig", {ID:10});

        //飞升开启
        if (yx.battleMgr.getLiLianTopMapId() < openCfg["conditionnum"]) {
            yx.ToastUtil.showListToast(openCfg["opencondition"]);
            return;
        }
    },

    /************************垂钓区****************************/
    //垂钓
    _refreshChuiDiao(diaoYuData) {

        let leftOverCount = 0;
        //此count是两个场地共有的
        if (diaoYuData.chuiXingConsumeData){
            leftOverCount += diaoYuData.chuiXingConsumeData.count;
        }

        this.cdLeftTimesLabel.string = leftOverCount;//当前剩余次数

    },

    _setYuGanName(yuGanInfo){
        if (yuGanInfo && yuGanInfo.useing){
            let itemCfg = yx.cfgMgr.getOneRecord("ItemConfig",{ID:yuGanInfo.useing});
            if (itemCfg){
                this.cdYuGanNameLabel.string = itemCfg["Name"];//当前鱼竿名称
            }

        }
    },

    _cdChuiXingBtnClick() {

        let cmdType = yx.proto.GoFishingCmdType["Reconnect_Cmd"];//获取当前状态等信息
        let fieldType = yx.proto.GoFishingFieldType["AboveGround"];//地上(场地1)

        //请求垂星重连信息
        yx.chuiDiaoMgr.reqGoFishing(cmdType, fieldType);

    },

    _cdHuanHaiBtnClick() {
        let cmdType = yx.proto.GoFishingCmdType["Reconnect_Cmd"];//获取当前状态等信息
        let fieldType = yx.proto.GoFishingFieldType["TheSky"];//地上(场地2)
        //请求幻海重连信息
        yx.chuiDiaoMgr.reqGoFishing(cmdType, fieldType);
    },
    _cdYuHuoBtnClick() {
        yx.windowMgr.showWindow("yuHuoPanel");
    },
    cdDuiHuanBtnClick() {
        yx.windowMgr.showWindow("duiHuanPanel");
    },
    cdShuoMingBtnClick() {
        yx.windowMgr.showWindow("shuoMingPanel", {shuoMingType: yx.ShuoMingPanel.SHUOMING_TYPE.CHUIDIAO});
    },


    //垂钓状态信息获取
    _chuiDiaoReconnectInfo(resp) {
        //未开始钓鱼，弹出提示框
        if (resp["gameState"] == yx.proto.GameState.Stop) {
            let fieldType = resp["fieldType"];
            let name = "";
            let count = 0;
            let consumeStr = "";
            let resources = null;
            if (resp["fieldType"] == yx.proto.GoFishingFieldType["AboveGround"]) {
                name = "垂星之诞";
                count = resp.chuiXingConsumeData.count;
                resources = resp.chuiXingConsumeData.resource;
            } else {
                name = "幻海之心";
                count = resp.huanHaiConsumeData.count;
                resources = resp.huanHaiConsumeData.resource;
            }

            if (resources) {
                for (let i = 0; i < resources.length; i++) {
                    let resource = resources[i];
                    let id = resource.id;
                    if (resource.type == 0) {//货币、需要+80000
                        id += 80000;
                    }
                    let itemCfg = yx.cfgMgr.getRecordByKey("ItemConfig", {ID: id});
                    if (itemCfg) {
                        consumeStr = itemCfg["Name"] + resource.count;
                    }
                }
            }

            let arg = {};
            arg.content = yx.colorUtil.AddColorString("进入", yx.colorUtil.TextWhite);
            arg.content += yx.colorUtil.AddColorString(name, yx.colorUtil.TextBlueLigth);
            arg.content += yx.colorUtil.AddColorString("需要消耗", yx.colorUtil.TextWhite);
            arg.content += yx.colorUtil.AddColorString(consumeStr, yx.colorUtil.TextBlueLigth);
            arg.content += yx.colorUtil.AddColorString("，道友今日还可以进入", yx.colorUtil.TextWhite);
            arg.content += yx.colorUtil.AddColorString(count, count > 0 ? yx.colorUtil.TextGreen : yx.colorUtil.TextRed);
            arg.content += yx.colorUtil.AddColorString("次", yx.colorUtil.TextWhite);
            arg.content += "\n\n\n";
            arg.content += "拥有天庭官职可以获得一次额外机会";

            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "LiLianWindow";
            clickEventHandler.handler = "onGoChuiDiaoConfirmClick";
            clickEventHandler.customEventData = {fieldType: fieldType};
            arg.confirmCallback = clickEventHandler;
            yx.windowMgr.showWindow("textConfirm", arg);
        }
        //使用此重连数据恢复游戏
        else {
            yx.windowMgr.showWindow("chuiDiaoWindow", resp);
        }
    },
    //确认垂钓
    onGoChuiDiaoConfirmClick(args) {
        let cmdType = yx.proto.GoFishingCmdType["EnterField_Cmd"];//获取当前状态等信息
        let fieldType = args.fieldType;
        yx.chuiDiaoMgr.reqGoFishing(cmdType, fieldType);
    },
    /************************圣兽区****************************/
    logScheduleTimerCallBack(){
        let curDate = new Date();
        let curTimestamp = curDate.getTime();//当前时间戳

        curDate.setHours(this.fengYinAtkData.EndTime.split(":")[0], this.fengYinAtkData.EndTime.split(":")[1],0,0);
        let halfPartEightTimestamp = curDate.getTime();

        let leftOverTime = (halfPartEightTimestamp - curTimestamp)/ 1000;

        leftOverTime = leftOverTime <= 0?0:leftOverTime;

        this.ssTimeProBarLabel.string = "距离圣兽消失还剩  "+yx.timeUtil.seconds2hourMinSecond(leftOverTime);
    },
    logScheduleCallBack() {


        /**
         日志规则：
         每一分钟攻击一次，按50来显示做日志显示，但是具体进度是按 服务器下发的人数来定 服务器下发[所有人的平均攻击]
         总输出 = 平均输出 * 进行的分钟
         剩余血量 = 总血量 - 总输出
         平均每1.5秒来一次log显示；  按50人来算，1.5*50 = 75，也就每75秒来一次boss的攻击、暴怒行为；
         血量每减少20% 就显示一次虚弱;
         每75秒为一轮，新的一轮里，玩家的攻击在第三次出现；

         在显示层面上，无论实际人数是多少，都是按照75秒为一轮。
         对于个人的输出，也是按照每75秒攻击一次来计算。
         严格上：平均攻击就是不完全准确的。这里的攻击计算也是不完全准确的。这里都无视。
         */

        let curDate = new Date();
        let curTimestamp = curDate.getTime();//当前时间戳
        //走配置
        curDate.setHours(this.fengYinAtkData.StartTime.split(":")[0], this.fengYinAtkData.StartTime.split(":")[1], 0, 0);
        //curDate.setHours(18, 39, 0, 0);
        let halfPartSixTimestamp = curDate.getTime();//当天6点30的时间戳
        let second = parseInt((curTimestamp - halfPartSixTimestamp) / 1000);//从六点半到现在，一共过了多少秒
        let minute = parseInt((curTimestamp - halfPartSixTimestamp) / 1000 / 60);//从六点半到现在，一共过了多少分钟

        //时间还没到、距离开始时间还有一段时间
        if (minute < 0) {
            // cc.Canvas.instance.unschedule(this.logScheduleCallBackBind);
            // cc.Canvas.instance.unschedule(this.logScheduleTimerCallBackBind);
            // this.isLogScheduleing = false;
            return;
        }

        //当前总伤害
        let curMaxAck = minute * this.fengYinAtkData.maxPlayerNum * this.fengYinAtkData.averageAtk;

        //当前boss剩余血量
        let curLeftOverHp = this.fengYinAtkData.maxHp - curMaxAck;

        //当前血量最多扣到0
        curLeftOverHp = curLeftOverHp <= 0 ? 0 : curLeftOverHp;

        //总伤害不超过最大血量
        curMaxAck = curMaxAck >= this.fengYinAtkData.maxHp ? this.fengYinAtkData.maxHp : curMaxAck;

        //是否轮到展示boss攻击了
        let isShowBossAtk = false;

        //是否轮到虚弱
        let isShowBossXuRuo = false;

        //每破一次20%血量，虚弱一次
        if (this.fengYinAtkData.preLeftOverHp) {//radioLine
            isShowBossXuRuo = this.fengYinAtkData.isBetween(curLeftOverHp, this.fengYinAtkData.preLeftOverHp);
        }

        //完成度
        this.ssWanChengNumLabel.string = parseInt(curMaxAck) + "/" + this.fengYinAtkData.maxHp;

        //最多是每X秒来一次boss攻击  （也就是没times秒 为一轮）
        let times = 50 * 1.5;//此值必须为1.5的倍数，否则不准确。因为调度器是1.5一次；


        let yuShu = parseInt(second % times);
        //这里的second % times 可能会越过 0;  这里单纯判断为0，可能会出现越过问题；
        if (this.fengYinAtkData.isCanNew && (yuShu == 0 || yuShu == 1)) {
            isShowBossAtk = true;
            this.fengYinAtkData.newFor = 0;//新的一轮开始
            this.fengYinAtkData.isCanNew = false;//是否可以开启 新的一轮开始
        } else {
            if (this.fengYinAtkData.newFor != -1){//-1为初始值，只有进入了一次this.fengYinAtkData.newFor = 0; 赋0 才可以开始计算。避免重连此值重新计算导致输出错误；
                this.fengYinAtkData.newFor += 1;
            }
        }

        //由于调度器1.5一次，这里的second % times 可能会越过 0;未解决此问题，引入isCanNew，当余数过半的时候，认为可以重新开始
        if (yuShu >= (times / 2)) {
            this.fengYinAtkData.isCanNew = true;//是否可以开启 新的一轮开始
        }

        cc.log("second % times:" + yuShu + "isCanNew"+this.fengYinAtkData.isCanNew+" newFor " + this.fengYinAtkData.newFor);

        let myPlayer = this.fengYinAtkData.orderInfos[this.fengYinAtkData.myIndex];

        //封印值 将时间延迟 3秒 = 1.5*2    (每75秒算一次自己的伤害)
        this.ssFengYinNumLabel.string = parseInt(Math.ceil((second - 3) / times) * myPlayer["averageAtk"]);

        //进度
        this.ssTimeProBar.progress = curLeftOverHp / this.fengYinAtkData.maxHp;


        //记录上一次的Hp量
        this.fengYinAtkData.preLeftOverHp = curLeftOverHp;

        //boss已死
        if (curLeftOverHp <= 0) {
            let args = {};
            args.year = yx.timeUtil.getXiuLianYear();
            args.index = 7;
            args.title1 = this.fengYinAtkData["title1"];
            args.title = this.fengYinAtkData["title"];
            this.ssShenShouDes.string = yx.DiarysDict["fengyin"].getText(args);
            cc.Canvas.instance.unschedule(this.logScheduleCallBackBind);
            cc.Canvas.instance.unschedule(this.logScheduleTimerCallBackBind);
            this.isLogScheduleing = false;
        } else {
            //boss虚弱
            if (isShowBossXuRuo) {
                let args = {};
                args.year = yx.timeUtil.getXiuLianYear();
                args.title = this.fengYinAtkData["title"];
                args.title1 = this.fengYinAtkData["title1"];
                args.fengYinAdd = this.fengYinAtkData["FengYinAdd"];
                args.index = 4;
                yx.DiarysUtil.addShowTextToRichText(this.ssFengYinRiZhiRiText, "fengyin", args);
                this.ssFengYinRiZhiScroview.scrollToBottom();
            }
            //boss攻击
            else if (isShowBossAtk) {

                //0-3 随机
                let random0_3 = parseInt(Math.random() * 4, 10);
                let args = {};
                args.year = yx.timeUtil.getXiuLianYear();
                args.name = yx.playerMgr.getName();
                args.title = this.fengYinAtkData["title"];
                args.title1 = this.fengYinAtkData["title1"];
                args.index = random0_3;
                yx.DiarysUtil.addShowTextToRichText(this.ssFengYinRiZhiRiText, "fengyin", args);
                this.ssFengYinRiZhiScroview.scrollToBottom();
            }
            //角色攻击
            else {
                //1~50 随机
                let orderInfos = this.fengYinAtkData.orderInfos;
                let playerInfo = null;

                //每一轮新的启动，自己放在第三个位置
                if (this.fengYinAtkData.newFor == 3) {
                    playerInfo = orderInfos[this.fengYinAtkData.myIndex];
                } else {
                    let count = 1000;
                    //否则随机其他人
                    while (count > 0) {
                        //无论具体人数有多少，这里都是 随机0~49
                        let random = parseInt(Math.random() * (50), 10);
                        playerInfo = orderInfos[random];

                        //随机到一个不是自己的名字
                        if (this.fengYinAtkData.myIndex !== random){
                            break;
                        }
                        count--;
                    }
                }

                //角色攻击显示
                if (playerInfo) {
                    let args = {};
                    args.year = yx.timeUtil.getXiuLianYear();
                    args.name = playerInfo["nickName"];

                    let random0_1 = parseInt(Math.random() * (2), 10);

                    args.atkOne = playerInfo["DamageArea"][random0_1];

                    args.title1 = this.fengYinAtkData.title1;

                    args.index = 5;

                    //是玩家自己
                    if (yx.playerMgr.getPid() == playerInfo["playerID"]) {
                        args.index = 6;
                        //this.ssFengYinNumLabel.string += parseInt(this.ssFengYinNumLabel.string) + parseInt(args.atkOne);
                    }

                    yx.DiarysUtil.addShowTextToRichText(this.ssFengYinRiZhiRiText, "fengyin", args);
                    this.ssFengYinRiZhiScroview.scrollToBottom();
                }
            }
        }

    },

    //开始封印日志调度
    showFengYinRiZhiDetail() {

        if (!this.fengYinData) {
            return;
        }
        if (this.isLogScheduleing) {
            return;
        }

        let curfengYinCfg = yx.cfgMgr.getOneRecord("FengYinBossConfig", {ID: this.fengYinData.bossID});

        let averagePlayerLevel = this.fengYinData.fightingBossInfo["averagePlayerLevel"];//平均等级

        this.fengYinAtkData = {};//封印战斗缓存数据
        this.fengYinAtkData.newFor = -1;//新的一轮开始
        this.fengYinAtkData.averageAtk = 0;//平均伤害
        this.fengYinAtkData.maxPlayerNum = this.fengYinData.fightingBossInfo.totalOrder;//服务器
        this.fengYinAtkData.maxHp = curfengYinCfg["FengYinVal"];//boss总血量
        this.fengYinAtkData.title1 = curfengYinCfg["Title1"];//
        this.fengYinAtkData.title = curfengYinCfg["Title"];//
        this.fengYinAtkData.FengYinAdd = curfengYinCfg["FengYinAdd"];//
        this.fengYinAtkData.StartTime = curfengYinCfg["StartTime"];
        this.fengYinAtkData.EndTime = curfengYinCfg["EndTime"];
        this.fengYinAtkData.orderInfos = [];

        //这里需要clone一个备份,否则会被协议收到的数据给改了
        yx.CodeHelper.deepClone(this.fengYinData.fightingBossInfo.orderInfos, this.fengYinAtkData.orderInfos);

        //辅助运算radioLine 记录 20%,40%,60%,80%,100%时候的血量
        this.fengYinAtkData.radioLine = [0.2, 0.4, 0.6, 0.8, 1.0];
        for (let i = 0; i < this.fengYinAtkData.radioLine.length; i++) {
            this.fengYinAtkData.radioLine[i] = this.fengYinAtkData.radioLine[i] * this.fengYinAtkData.maxHp;
        }

        //用于判断是否当前收到攻击之后，Boss的血量扣除是否跨越了 20%,40%,60%,80%,100% 这几个点
        this.fengYinAtkData.isBetween = function (a, b) {
            for (let i = 0; i < this.radioLine.length; i++) {
                if (a < this.radioLine[i] && b >= this.radioLine[i]) {
                    return true;
                }
            }
            return false;
        };

        //let orderInfos = this.fengYinData.fightingBossInfo.orderInfos;
        let damageConfigs = yx.cfgMgr.getAllConfig("FengYinBossDamageConfig");

        //默认值，避免匹配不到空数据
        this.fengYinAtkData.myIndex = 0;

        for (let i = 0; i < this.fengYinAtkData.orderInfos.length; i++) {
            let playerInfo = this.fengYinAtkData.orderInfos[i];

            //1 获取自己的index
            if (yx.playerMgr.getPid() == playerInfo["playerID"]) {
                this.fengYinAtkData.myIndex = i;
            }

            //默认值，避免匹配不到空数据
            playerInfo["DamageArea"] = [0, 0];
            playerInfo["averageAtk"] = 0;

            //2 根据每个人的Level，得到伤害区间 方便后面使用
            for (let j = 0; j < damageConfigs.length; j++) {
                if (playerInfo["level"] >= damageConfigs[j]["LevelArea"][0] && playerInfo["level"] <= damageConfigs[j]["LevelArea"][1]) {
                    playerInfo["DamageArea"] = damageConfigs[j]["DamageArea"];
                    playerInfo["averageAtk"] = (damageConfigs[j]["DamageArea"][0] + damageConfigs[j]["DamageArea"][1]) / 2;
                    break;
                }
            }
        }

        //获取总平均输出
        for (let i = 0; i < damageConfigs.length; i++) {
            if (averagePlayerLevel >= damageConfigs[i]["LevelArea"][0] && averagePlayerLevel <= damageConfigs[i]["LevelArea"][1]) {
                this.fengYinAtkData.averageAtk = (damageConfigs[i]["DamageArea"][0] + damageConfigs[i]["DamageArea"][1]) / 2;
                break;
            }
        }


        //------------test data
        //this.fengYinAtkData.StartTime = "17:16";
        //this.fengYinAtkData.EndTime = "18:00";
        //--------------test data

        this.isLogScheduleing = true;

        cc.log("开始圣兽日志调度");
        //开始调度 log 每1.5秒一次
        cc.Canvas.instance.schedule(this.logScheduleCallBackBind, 1.5, cc.macro.REPEAT_FOREVER, 0);
        // 时间倒计时 每一秒一次
        cc.Canvas.instance.schedule(this.logScheduleTimerCallBackBind, 1, cc.macro.REPEAT_FOREVER, 0);


    },
    //兑换结果回调 S2C_ExchangeItem 显示
    onEventItemExChange(resp){
        if (this.curPageType != LiLianPageType.SHENGSHOU) return;

        let id = resp.id;//
        let exchangCfgs = yx.cfgMgr.getOneRecord("ExchangeConfig",{ID:id});
        if (exchangCfgs){
            let itemId = exchangCfgs["GetReward"][0]["id"];
            let itemCfgItem = yx.cfgMgr.getOneRecord("ItemConfig",{ID:itemId});
            if (itemCfgItem){
                yx.ToastUtil.showListToast("获取"+itemCfgItem["Name"]+"x"+exchangCfgs["GetReward"][0]["count"]);
            }
        }
        this._refreshShengShou();
    },
    //圣兽
    _refreshShengShou(fengYinData) {

        //兑换列表
        let exchangCfgs = yx.cfgMgr.getRecordList("ExchangeConfig", {Type: 3});
        if (exchangCfgs) {

            exchangCfgs.sort(function (a,b) {
                if (a.Top < b.Top) {
                    return -1;
                } else if (a.Top == b.Top) {
                    return 0;
                } else {
                    return 1;
                }
            });

            for (let i = 0; i < exchangCfgs.length; i++) {
                let exchangCfgItem = exchangCfgs[i];
                let nodeName = "DuiHuanWidget_" + i;

                //无需每次都重新建造，存在的话，只需刷新
                let itemSlotNode = this.ssDuiHuanItemLayout.node.getChildByName(nodeName);
                if (itemSlotNode) {
                    let duiHuanWidgetSrc = itemSlotNode.getComponentInChildren(yx.DuiHuanWidget);
                    if (duiHuanWidgetSrc) {
                        duiHuanWidgetSrc.refresh(exchangCfgItem);
                        continue;
                    }
                }

                yx.DuiHuanWidget.CreateItemSlot(exchangCfgItem, this.ssDuiHuanItemLayout.node, nodeName, 681);
            }
        }


        if (fengYinData) {
            this.fengYinData = fengYinData;
        }

        if (!this.fengYinData) return;

        //封印进行中
        if (this.fengYinData.fengYinState == yx.proto.FengYinStateType.Fighting) {

            this.ssUnBeginNode.active = false;
            this.ssOnBeginNode.active = true;

            if (this.fengYinData.isOrder) {

                let curfengYinCfg = yx.cfgMgr.getOneRecord("FengYinBossConfig", {ID: this.fengYinData.bossID});
                if (curfengYinCfg) {
                    this.ssWanChengNumLabel.string = "0" + "/" + curfengYinCfg["FengYinVal"];
                }

                //this.ssFengYinNumLabel.string = "0";

                this.ssOnOverNode.active = false;
                this.ssUnCanJiaNode.active = false;
                this.ssOnDoingNode.active = true;

                //显示日志
                yx.DiarysUtil.setRichTextWithShowList(this.ssFengYinRiZhiRiText, "fengyin");
                this.ssFengYinRiZhiScroview.scrollToBottom();

                //封印进行中 日志与进度
                this.showFengYinRiZhiDetail();

            }
            //游戏一开始，且没有预约
            else {

                this.ssOnOverNode.active = false;
                this.ssUnCanJiaNode.active = true;
                this.ssOnDoingNode.active = false;
                let curfengYinCfg = yx.cfgMgr.getOneRecord("FengYinBossConfig", {ID: this.fengYinData.bossID});
                if (curfengYinCfg) {
                    this.ssFengYinRiZhiRiText.string = curfengYinCfg["Txt1"];
                }

            }


        } else if (this.fengYinData.fengYinState == yx.proto.FengYinStateType.Ordering) {

            this.ssUnBeginNode.active = true;
            this.ssOnBeginNode.active = false;

            //已预约
            if (this.fengYinData.isOrder) {
                this.ssUnYuYueNode.active = false;
                this.ssHadYuYueNode.active = true;
            }
            //未预约
            else {
                this.ssUnYuYueNode.active = true;
                this.ssHadYuYueNode.active = false;
            }


        } else if (this.fengYinData.fengYinState == yx.proto.FengYinStateType.GameOver) {
            cc.Canvas.instance.unschedule(this.logScheduleCallBackBind);
            cc.Canvas.instance.unschedule(this.logScheduleTimerCallBackBind);

            this.ssUnBeginNode.active = false;
            this.ssOnBeginNode.active = true;

            this.ssOnOverNode.active = true;
            this.ssOnDoingNode.active = false;
            this.ssUnCanJiaNode.active = false;

            let curfengYinCfg = yx.cfgMgr.getOneRecord("FengYinBossConfig", {ID: this.fengYinData.bossID});
            if (curfengYinCfg) {
                this.ssWanChengNumLabel.string = curfengYinCfg["FengYinVal"] + "/" + curfengYinCfg["FengYinVal"];
                this.ssFengYinRiZhiRiText.string = curfengYinCfg["Txt1"];
            }

        }

        //封印圣兽共有信息
        let fengYinCfg = yx.cfgMgr.getOneRecord("FengYinBossConfig", {ID: this.fengYinData.bossID});
        if (fengYinCfg) {
            this.ssShenShouDes.string = fengYinCfg["Txt"];
            this.ssShenShouWanfaDes.string = fengYinCfg["Txt1"];
            let resCfg = yx.cfgMgr.getRecordByKey("ResConfig", {ID: fengYinCfg["ResID1"]});
            if (resCfg) {
                yx.resUtil.LoadSpriteByType(resCfg["Head"], yx.ResType.SHENGSHOU, this.ssShenShouSp);
            }
        }


    },
    //兑换
    ssDuiHuanBtnClick() {

        //单选按钮实现
        this.ssDuiHuanBtn.node.getChildByName("selectBg").active = true;
        this.ssDuiHuanBtn.node.getChildByName("unSelectBg").active = false;
        this.ssFengYinBtn.node.getChildByName("selectBg").active = false;
        this.ssFengYinBtn.node.getChildByName("unSelectBg").active = true;

        //显示兑换页
        this.ssFengYinPageNode.active = false;
        this.ssDuiHuanPageNode.active = true;
    },
    //封印
    ssFengYinBtnClick() {


        //单选按钮实现
        this.ssDuiHuanBtn.node.getChildByName("selectBg").active = false;
        this.ssDuiHuanBtn.node.getChildByName("unSelectBg").active = true;
        this.ssFengYinBtn.node.getChildByName("selectBg").active = true;
        this.ssFengYinBtn.node.getChildByName("unSelectBg").active = false;

        //显示封印页
        this.ssFengYinPageNode.active = true;
        this.ssDuiHuanPageNode.active = false;


    },

    //封印说明
    ssShuoMingBtnClick() {

        if (this.fengYinData && this.fengYinData.bossID) {
            yx.windowMgr.showWindow("shuoMingPanel", {
                shuoMingType: yx.ShuoMingPanel.SHUOMING_TYPE.SHENGSHOU,
                ID: this.fengYinData.bossID
            });
            return;
        }

        cc.warn("ssShuoMingBtnClick this.fengYinData null")
    },
    //封印预约
    ssYuYueFengYinBtnClick() {
        yx.shengShouMgr.reqGetFengyin(yx.proto.FengYinCmdType.OrderFengYinBoss_Cmd);
    },

    _setCheckMark() {
        switch (this.curPageType) {
            case LiLianPageType.LILIAN: {
                this.homeLiLianBtnMarkNode.active = true;
                this.homeChuiDiaoBtnMarkNode.active = false;
                this.homeShengShouBtnMarkNode.active = false;
                break;
            }
            case LiLianPageType.CHUIDIAO: {
                this.homeLiLianBtnMarkNode.active = false;
                this.homeChuiDiaoBtnMarkNode.active = true;
                this.homeShengShouBtnMarkNode.active = false;
                break;
            }
            case LiLianPageType.SHENGSHOU: {
                this.homeLiLianBtnMarkNode.active = false;
                this.homeChuiDiaoBtnMarkNode.active = false;
                this.homeShengShouBtnMarkNode.active = true;
                break;
            }
        }
    },
    _setCheckPage() {
        switch (this.curPageType) {
            case LiLianPageType.LILIAN: {
                this.liLianPageNode.active = true;
                this.chuiDiaoPageNode.active = false;
                this.shengShouPageNode.active = false;
                break;
            }
            case LiLianPageType.CHUIDIAO: {
                this.liLianPageNode.active = false;
                this.chuiDiaoPageNode.active = true;
                this.shengShouPageNode.active = false;
                break;
            }
            case LiLianPageType.SHENGSHOU: {
                this.liLianPageNode.active = false;
                this.chuiDiaoPageNode.active = false;
                this.shengShouPageNode.active = true;
                break;
            }
        }
    },

    //刷新当前关卡和最大关卡
    onEventLiLianMap() {
        // yx.battleMgr.getCurMapId();
        // yx.battleMgr.getTopMapId();
        this._refreshLiLian();
        

    },

    
    onEventEnterMap(resp){
        if (!this.isShown())
        {
            return;
        }
        
        //902 进入地图副本
        // message S2C_EnterMap {
        //     optional int32 posX = 1;//当前坐标
                // optional int32 posY = 2;//当前坐标
                // repeated MapInfo mapInfo = 3;//当前副本走过的格子
                // optional int32 backX = 4;//回退坐标
                // optional int32 backY = 5;//回退坐标
                // optional int32 mapId = 6;

        let args = {};
        args.posX = resp.posX;
        args.posY = resp.posY;
        args.mapInfo = resp.mapInfo;
        args.mapId = resp.mapId;
        args.backX = resp.backX;
        args.backY = resp.backY;

        yx.windowMgr.showWindow("battleMap", args);
    },


    onOpenQiYuWindow(){
        yx.windowMgr.showWindow("qiYuWindow");
    },

});

yx.LiLianWindow = module.exports = LiLianWindow;
