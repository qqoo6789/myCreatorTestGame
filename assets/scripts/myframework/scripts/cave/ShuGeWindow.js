const BaseWindow = require('BaseWindow');
const TimeProBarWidget = require('TimeProBarWidget');

//修炼状态
const SHUGE_STATE = {
    UN_BEGIN: 1,//未开始
    HAD_BEGIN: 2,//已开始
};

let ShuGeWindow = cc.Class({
    extends: BaseWindow,

    statics: {
        SHUGE_STATE: SHUGE_STATE
    },
    properties: {
        danDaoNode: cc.Node,//丹道模块
        qiDaoNode: cc.Node,//器道模块
        wuDaoNode: cc.Node,//悟道模块

        //三个模块的公共单选按钮
        danDaoBtn: cc.Button,
        qiDaoBtn: cc.Button,
        wuDaoBtn: cc.Button,

        //三个模块修炼前的页面
        danDaoHomeNode: cc.Node,
        qiDaoHomeNode: cc.Node,
        wuDaoHomeNode: cc.Node,

        //三个模块修炼之后的页面
        danDaoTimeProBarWidget: TimeProBarWidget,
        qiDaoTimeProBarWidget: TimeProBarWidget,
        wuDaoTimeProBarWidget: TimeProBarWidget,

        //修炼按钮
        danDaoXiuLian10Btn: cc.Button, //丹道修炼10
        danDaoXiuLian100Btn: cc.Button,//丹道修炼100

        qiDaoXiuLian10Btn: cc.Button, //器道修炼10
        qiDaoXiuLian100Btn: cc.Button,//器道修炼100


        //经验与标题头
        danDaoExpLabel: cc.Label,
        danDaoTitleLabel: cc.Label,

        qiDaoExpLabel: cc.Label,
        qiDaoTitleLabel: cc.Label,

        wuDaoExpLabel: cc.Label,//悟道经验 "(52/288)"
        wuDaoTitleRiText: cc.RichText,//悟道标题 "悟道4级"
        wuDaoShuXingLabel: cc.Label,//悟道属性 “悟性+500”
        wuDaoShuNameLabel: cc.Label,//悟道书名 "《学习心得》"
        wuDaoProficiencyLabel: cc.Label,//悟道熟练度 "初窥门径(1/3)"
        wuDaoShuDesLabel: cc.Label,//悟道书籍描述 "记述了。。。。"
        wuDaoRewordRiText: cc.RichText,//悟道 参悟收获  “参悟后获取：123000修为，2悟道经验”
        wuDaoRocordRiText: cc.RichText,//悟道 记录  “难以理解其中要义，在洞府踱步不止”


        wuDaoAllToggle: cc.Button,//"全部"按钮
        wuDaoLunDaoToggle: cc.Button,//"论道"按钮
        wuDaoZhuanJiToggle: cc.Button,//"传记"按钮
        wuDaoXinDeToggle: cc.Button,//"心得"按钮
        wuDaoGanWuToggle: cc.Button,//"感悟"按钮

        wuDaoShuJiaScroview: cc.ScrollView,//书架滑动框
        wuDaoShuJiaItemLayout: cc.Layout,//书架条目
        wuDaoShenHunBtn:cc.Button,//神魂按钮
        wuDaoUnReadBookLabel:cc.Label,//"当前没有参悟的道书"

        //悟道修炼过程中，书籍名称
        wuDaoShuJiLabel: cc.Label,
        //悟道 参悟属性添加提示
        wuDaoAdrrRichText: cc.RichText,

        //修炼剩余年时间
        danDaoLeftYearLabel: cc.Label,
        qiDaoLeftYearLabel: cc.Label,

        shuJiaItemPrefab: cc.Prefab,//书架条目预制品
        shuItemPrefab: cc.Prefab,//书预制品

        danDaoCheckMarkNode:cc.Node,
        qiDaoCheckMarkNode:cc.Node,
        wuDaoCheckMarkNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    _onInit(args) {

        yx.ShuJiaItem._itemPrefab = this.shuJiaItemPrefab;
        yx.ShuItem._itemPrefab = this.shuItemPrefab;

        this.curWuDaoBtnType = -1;//默认

        this.danDaoNode.active = true;
        this.qiDaoNode.active = false;
        this.wuDaoNode.active = false;

        this.danDaoHomeNode.active = false;
        this.qiDaoHomeNode.active = false;
        this.wuDaoHomeNode.active = false;
        this.wuDaoUnReadBookLabel.node.active = false;
        this.danDaoTimeProBarWidget.node.active = false;
        this.qiDaoTimeProBarWidget.node.active = false;
        this.wuDaoTimeProBarWidget.node.active = false;

        this._shuGeItemType = yx.ShuGeItemType.DANDAO;

        //默认初始化：相当于点击丹道
        //this._ondanDaoBtnClick();

        this.danDaoBtn.node.on('click', this._ondanDaoBtnClick, this);
        this.qiDaoBtn.node.on('click', this._onqiDaoBtnClick, this);
        this.wuDaoBtn.node.on('click', this._onwuDaoBtnClick, this);

        this.danDaoXiuLian10Btn.node.on('click', this._onXiulianBtnClick.bind(this, yx.ShuGeItemType.DANDAO, 10), this);
        this.danDaoXiuLian100Btn.node.on('click', this._onXiulianBtnClick.bind(this, yx.ShuGeItemType.DANDAO, 100), this);

        this.qiDaoXiuLian10Btn.node.on('click', this._onXiulianBtnClick.bind(this, yx.ShuGeItemType.QIDAO, 10), this);
        this.qiDaoXiuLian100Btn.node.on('click', this._onXiulianBtnClick.bind(this, yx.ShuGeItemType.QIDAO, 100), this);


        this.wuDaoAllToggle.node.on('click', this._onShuHeadBtnClick.bind(this, -1), this);
        this.wuDaoLunDaoToggle.node.on('click', this._onShuHeadBtnClick.bind(this, yx.ShuJiType.LUNDAO), this);
        this.wuDaoZhuanJiToggle.node.on('click', this._onShuHeadBtnClick.bind(this, yx.ShuJiType.ZHUANJI), this);
        this.wuDaoXinDeToggle.node.on('click', this._onShuHeadBtnClick.bind(this, yx.ShuJiType.XINDE), this);
        this.wuDaoGanWuToggle.node.on('click', this._onShuHeadBtnClick.bind(this, yx.ShuJiType.GANWU), this);
        this.wuDaoShenHunBtn.node.on('click', this._onShenHunBtnClick.bind(this), this);
        yx.eventDispatch.addListener(yx.EventType.REFRESH_CAVE_SHUGE, this._refresh, this);
        yx.eventDispatch.addListener(yx.EventType.REFRESH_CAVE_YUDING_BOOK, this._onEventYudingBook, this);

    },

    _onShow() {

        yx.caveMgr.reqDongfuShuge(this._shuGeItemType);
        yx.caveMgr.reqAllBook();
    },

    /*
    *  关闭的时候把调度器关掉
    */
    _onHide() {
        this.danDaoTimeProBarWidget.unSchedule();
        this.qiDaoTimeProBarWidget.unSchedule();
        this.wuDaoTimeProBarWidget.unSchedule();
        //yx.eventDispatch.removeListenersByTarget(this);
    },

    _onEventYudingBook(resp){
        yx.ToastUtil.showListToast("预定成功");

    },

    _refresh() {

        if (!yx.caveMgr.getCaveShuGeData()) return;

        this.danDaoData = yx.caveMgr.getCaveShuGeData()[yx.ShuGeItemType.DANDAO];
        this.qiDaoData = yx.caveMgr.getCaveShuGeData()[yx.ShuGeItemType.QIDAO];
        this.wuDaoData = yx.caveMgr.getCaveShuGeData()[yx.ShuGeItemType.WUDAO];

        //--------------未开始修炼/已开始修炼 界面的切换-------------------------------
        if (this.danDaoData && this.danDaoData.curState == ShuGeWindow.SHUGE_STATE.UN_BEGIN) {
            this.danDaoHomeNode.active = true;
            this.danDaoTimeProBarWidget.node.active = false;
        } /*else if (this.danDaoData && this.danDaoData.curState == ShuGeWindow.SHUGE_STATE.HAD_BEGIN) {
            this.danDaoHomeNode.active = false;
            this.danDaoTimeProBarWidget.node.active = true;
        }*/

        if (this.qiDaoData && this.qiDaoData.curState == ShuGeWindow.SHUGE_STATE.UN_BEGIN) {
            this.qiDaoHomeNode.active = true;
            this.qiDaoTimeProBarWidget.node.active = false;
        } /*else if (this.qiDaoData && this.qiDaoData.curState == ShuGeWindow.SHUGE_STATE.HAD_BEGIN) {
            this.qiDaoHomeNode.active = false;
            this.qiDaoTimeProBarWidget.node.active = true;
        }*/

        if (this.wuDaoData && this.wuDaoData.curState == ShuGeWindow.SHUGE_STATE.UN_BEGIN) {
            this.wuDaoHomeNode.active = false;
            this.wuDaoTimeProBarWidget.node.active = false;
            this.wuDaoUnReadBookLabel.node.active = true;
        } /*else if (this.wuDaoData && this.wuDaoData.curState == ShuGeWindow.SHUGE_STATE.HAD_BEGIN) {
            //this.wuDaoHomeNode.active = false;
            this.wuDaoTimeProBarWidget.node.active = true;
        }*/

        //--------------刷新当前tab界面的信息-------------------------------
        switch (this._shuGeItemType) {
            case yx.ShuGeItemType.DANDAO: {
                let danDaoCfg = yx.cfgMgr.getRecordByKey("LianYaoLevelConfig", {Level: this.danDaoData["curLevel"]});
                if (danDaoCfg) {
                    this.danDaoTitleLabel.string = danDaoCfg["Name"];
                    this.danDaoExpLabel.string = this.danDaoData["curExp"] + "/" + danDaoCfg["Cost"][0]["count"];
                }
                break;
            }
            case yx.ShuGeItemType.QIDAO: {

                let qiDaoCfg = yx.cfgMgr.getRecordByKey("LianQiLevelConfig", {Level: this.qiDaoData["curLevel"]});
                if (qiDaoCfg) {

                    this.qiDaoTitleLabel.string = qiDaoCfg["Name"];
                    this.qiDaoExpLabel.string = this.qiDaoData["curExp"] + "/" + qiDaoCfg["NextExp"][0]["count"];
                }
                break;
            }
            case yx.ShuGeItemType.WUDAO: {
                let wuDaoCfg = yx.cfgMgr.getRecordByKey("WuDaolevelConfig", {Level: this.wuDaoData["curLevel"]});
                if (wuDaoCfg) {
                    //悟道级别
                    let wuDaoStr = yx.colorUtil.AddColorString("悟道", yx.colorUtil.TextWhite);
                    let wuDaoJiStr = yx.colorUtil.AddColorString("级", yx.colorUtil.TextWhite);
                    let wuDaoLevelStr = yx.colorUtil.AddColorString(this.wuDaoData["curLevel"] + "", yx.colorUtil.TextGreen);
                    this.wuDaoTitleRiText.string = wuDaoStr + wuDaoLevelStr + wuDaoJiStr;
                    //悟道经验
                    this.wuDaoExpLabel.string = "(" + this.wuDaoData["curExp"] + "/" + wuDaoCfg["Cost"][0]["count"] + ")";
                    //悟性数值
                    let wuXingNum = wuDaoCfg["Attr"][0] ? wuDaoCfg["Attr"][0]["value"] : 0;
                    this.wuDaoShuXingLabel.string = "悟性+" + wuXingNum;
                    //熟练度
                    this.wuDaoProficiencyLabel.string = "初窥门径(1/3)";

                    let curBook = yx.caveMgr.getCurReadingBook();
                    if (curBook) {
                        let wuDaoBookCfg = yx.cfgMgr.getRecordByKey("WuDaoBookConfig", {ID: curBook["id"]});
                        if (wuDaoBookCfg) {
                            //书名
                            this.wuDaoShuNameLabel.string = "《" + wuDaoBookCfg["Name"] + "》";
                            //描述
                            if (wuDaoBookCfg["DefDesc"]) {
                                this.wuDaoShuDesLabel.string = wuDaoBookCfg["DefDesc"];
                            }
                            //参悟收获
                            if (wuDaoBookCfg["Reward"]) {
                                let str = yx.colorUtil.AddColorString("参悟后获得：", yx.colorUtil.TextYellowLight);
                                let wuDaoNum = wuDaoBookCfg["Reward"][0]["count"];
                                let xiuWeiNum = wuDaoBookCfg["Reward"][1]["count"];
                                let numStr = yx.colorUtil.AddColorString(xiuWeiNum + "修为，" + wuDaoNum + "悟道经验", yx.colorUtil.TextGreen);
                                this.wuDaoRewordRiText.string = str + numStr;
                            }
                            //悟道记录
                            this.wuDaoRocordRiText.string = yx.textDict.shuGeWuDaoRecord.getRandomValues();
                        }
                        //熟练度
                        let wuDaoProficiencyCfg = yx.cfgMgr.getRecordByKey("WuDaoProficiencyConfig", {Level: curBook["level"]});
                        if (wuDaoProficiencyCfg) {
                            this.wuDaoProficiencyLabel.string = wuDaoProficiencyCfg["Name"]
                                + "("
                                + curBook["readNum"]
                                + "/"
                                + wuDaoProficiencyCfg["CanWuNum"]
                                + ")";
                        }
                    }
                }

                //默认
                this._onShuHeadBtnClick();

                break;
            }
        }

        //------------当前还在修炼，刷新数据到Progress或启动Progress---------------
        if (this.danDaoData && this.danDaoData.curState == ShuGeWindow.SHUGE_STATE.HAD_BEGIN) {

            this.danDaoHomeNode.active = false;
            this.danDaoTimeProBarWidget.node.active = true;

            this.danDaoTimeProBarWidget.updateAndBegin("ShuGeWindow" + yx.ShuGeItemType.DANDAO, this.danDaoData, "研读丹籍中", this._shuGePregressCallBack.bind(this));
            this.danDaoLeftYearLabel.string = "剩余修炼时间" + this.danDaoData.curYear + "年";
        }

        if (this.qiDaoData && this.qiDaoData.curState == ShuGeWindow.SHUGE_STATE.HAD_BEGIN) {
            this.qiDaoHomeNode.active = false;
            this.qiDaoTimeProBarWidget.node.active = true;

            this.qiDaoTimeProBarWidget.updateAndBegin("ShuGeWindow" + yx.ShuGeItemType.QIDAO, this.qiDaoData, "研读书籍中", this._shuGePregressCallBack.bind(this));
            this.qiDaoLeftYearLabel.string = "剩余修炼时间" + this.qiDaoData.curYear + "年";
        }

        if (this.wuDaoData && this.wuDaoData.curState == ShuGeWindow.SHUGE_STATE.HAD_BEGIN) {
            this.wuDaoHomeNode.active = true;
            this.wuDaoTimeProBarWidget.node.active = true;
            this.wuDaoUnReadBookLabel.node.active = false;

            let isUpdateProgress = true;
            let readingBook = yx.caveMgr.getCurReadingBook();
            if (readingBook && readingBook.endTime) {
                let curTimestap = yx.timeUtil.getServerTime();
                if (readingBook.endTime <= curTimestap) {//已完成
                    isUpdateProgress = false;
                    this.wuDaoTimeProBarWidget.node.active = false;
                }
            }

            if (isUpdateProgress) {
                this.wuDaoTimeProBarWidget.updateAndBegin("ShuGeWindow" + yx.ShuGeItemType.WUDAO, this.wuDaoData, "参悟中", this._shuGeWuDaoPregressCallBack.bind(this));
            }

            //this.wuDaoShuJiLabel.string
            //this.wuDaoAdrrRichText
        }
    },

    _shuGePregressCallBack(timeProBarWidgetSrc, data) {
        cc.log("_shuGePregressCallBack进度定时器的回调");
        data.curTime -= 1;
        //let contentStr = timeProBarWidgetSrc.contentStr;

        //进度内容
        let contentStr = "";
        if (data["endTime"]) {
            let leftSecondTime = (data["endTime"] - yx.timeUtil.getServerTime()) / 1000;
            let h = Math.floor(leftSecondTime / 60 / 15);
            let index = h % 5;
            if (index != 0) index = 5 - index;

            if (data["type"] == yx.ShuGeItemType.DANDAO) {
                contentStr = yx.textDict.shuGeDanDaoRecord.getValue(index);
            } else if (data["type"] == yx.ShuGeItemType.QIDAO) {
                contentStr = yx.textDict.shuGeQiDaoRecord.getValue(index);
            }
        }


        timeProBarWidgetSrc.refresh(data.curTime, data.maxTime, contentStr);

        if (data.curTime <= 0) {

            data.curYear--;

            if (data.curYear <= 0) {
                //得到结果
                yx.ToastUtil.showSimpleToast("修炼完毕", yx.windowMgr.getCurWindowOrPanel());

                //结束调度
                timeProBarWidgetSrc.unSchedule();

                //重置状态
                data.curState = yx.ShuGeWindow.SHUGE_STATE.UN_BEGIN;

                //刷新界面
                this._refresh();
                return;
            }

            data.curTime = data.maxTime;
            //刷新界面
            this._refresh();

        }
    },
    //悟道
    _shuGeWuDaoPregressCallBack(timeProBarWidgetSrc, data) {
        cc.log("悟道_shuGePregressCallBack进度定时器的回调");
        data.curTime -= 1;

        timeProBarWidgetSrc.refresh(data.curTime, data.maxTime);

        if (data.curTime <= 0) {

            //得到结果
            yx.ToastUtil.showSimpleToast("参悟完毕", yx.windowMgr.getCurWindowOrPanel());

            //结束调度
            timeProBarWidgetSrc.unSchedule();

            let allBook = this.getAllBook();
            if (allBook && allBook.readingBook){
                let readingBook = allBook.readingBook;
                let wuDaoProficiencyCfg = yx.cfgMgr.getRecordByKey("WuDaoProficiencyConfig",{Level:readingBook["level"]});
                readingBook["readNum"] = wuDaoProficiencyCfg["CanWuNum"];

                allBook.readingBook = null;//当前书已读完
            }
            //刷新界面
            this._refresh();

        }
    },

    _onXiulianBtnClick(type, year) {

        let shuGeItemData = yx.caveMgr.getCaveShuGeData()[this._shuGeItemType];

        if (!shuGeItemData) {
            cc.log("_onXiulianBtnClick shuGeItemData null");
            return;
        }

        let arg = {};
        if (type == yx.ShuGeItemType.DANDAO) {
            arg.content = "您确定要使用" + 100 * year + "灵石修炼" + year * 10 + "点丹道吗?";
            if (shuGeItemData["curLevel"] >= 18) return;//满级
        } else if (type == yx.ShuGeItemType.QIDAO) {
            arg.content = "您确定要使用" + 100 * year + "灵石修炼" + year * 10 + "点器道吗?";
            if (shuGeItemData["curLevel"] >= 18) return;//满级
        }
        if (type == yx.ShuGeItemType.WUDAO) {
            arg.content = "您确定要使用" + 100 * year + "灵石修炼" + year * 10 + "点悟道吗?";
            if (shuGeItemData["curLevel"] >= 25) return; //满级
        }

        let isEnougnStuff = false;
        if (yx.playerMgr.getCurrency(yx.CyType.LINGSHI) > 100 * year) {
            isEnougnStuff = true;
        }

        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "ShuGeWindow";
        clickEventHandler.handler = "_onXiulianConfirmClick";
        clickEventHandler.customEventData = {type: type, year: year, isEnougnStuff: isEnougnStuff};
        arg.confirmCallback = clickEventHandler;
        yx.windowMgr.showWindow("textConfirm", arg);

    },
    _onXiulianConfirmClick(eventDate) {
        if (!eventDate.isEnougnStuff) {
            yx.ToastUtil.showListToast("灵石不足");
            return;
        }
        yx.caveMgr.reqXiuLian(eventDate.type, eventDate.year);
    },


    //全部、论道、传记、心得、感悟 按钮的点击时间
    _onShuHeadBtnClick(type) {
        if (type) this.curWuDaoBtnType = type;

        this.wuDaoShuJiaItemLayout.node.removeAllChildren(true);

        let typeInfos = [];
        let allBook = yx.caveMgr.getAllBook();
        if (allBook) {
            for (let index in allBook.items) {
                if (!allBook.items[index]["id"]) continue;

                let wuDaoBookCfg = yx.cfgMgr.getRecordByKey("WuDaoBookConfig", {ID: allBook.items[index]["id"]});
                if (wuDaoBookCfg) {
                    if (this.curWuDaoBtnType == -1) {
                        typeInfos.push(wuDaoBookCfg);
                        continue;
                    }
                    if (this.curWuDaoBtnType && wuDaoBookCfg["Type"] == this.curWuDaoBtnType) {
                        typeInfos.push(wuDaoBookCfg);
                    }
                }
            }
        }

        let count = 0;// 当前书架有几层
        for (let i = 0, len = Math.ceil(typeInfos.length / 3); i < len; i++) {
            count ++;
            let beginIndex = i * 3;
            let endIndex = beginIndex + 3;
            let infoItem = typeInfos.slice(beginIndex, endIndex);
            yx.ShuJiaItem.CreateItem(infoItem, this.wuDaoShuJiaItemLayout.node, "ShuJiaItem" + i, null);
        }

        // 少于两层的书，那么空书的架条
        for (let i = 0; i < 2 - count; i ++){
            yx.ShuJiaItem.CreateItem([], this.wuDaoShuJiaItemLayout.node, "ShuJiaItem" + i, null);
        }


    },

    //神魂悟道
    _onShenHunBtnClick(){
        cc.log("_onShenHunBtnClick");

        //如果没使用过神魂悟道，去购买页面
        if (!this._checkShenHunWuDaoItemUse()){
            yx.windowMgr.showWindow("itemQuickBuyPanel", {bookType: yx.ItemQuickBuyPanel.SHENYOU_BOOKTYPE_WUDAO});
            return;
        }

        //去预定页
        yx.windowMgr.showWindow("shenHunWuDaoPanel");

    },
    _checkShenHunWuDaoItemUse(){
        let goodCfg = yx.cfgMgr.getOneRecord("ShopListConfig", {QuickId: yx.ItemQuickBuyPanel.SHENGYOU_LIST.shenHunWudao.quickId});
        if (goodCfg){
            let itemCfg = yx.cfgMgr.getOneRecord("ItemConfig", {ID: goodCfg.ID});
            if (itemCfg) {
                return yx.playerMgr.getItemUseCount(itemCfg["ID"]) > 0;
            }
        }
        return false;
    },

    //丹道单选
    _ondanDaoBtnClick(event) {
        cc.log("_ondanDaoBtnClick");

        if (this._shuGeItemType == yx.ShuGeItemType.DANDAO) {
            return;
        }

        this._shuGeItemType = yx.ShuGeItemType.DANDAO;
        this._setToggle();
        this.danDaoNode.active = true;
        this.qiDaoNode.active = false;
        this.wuDaoNode.active = false;

        yx.caveMgr.reqDongfuShuge(this._shuGeItemType);

    },
    _onqiDaoBtnClick(event) {
        cc.log("_onqiDaoBtnClick");

        //检查等级限制
        let openCfg = yx.cfgMgr.getRecordByKey("FuncOpenConfig", {ID:4});

        //级别不够，不能建造
        if (yx.playerMgr.getDuJieLevel() < openCfg["conditionnum"]) {
            yx.ToastUtil.showListToast(openCfg["opencondition"]);
            return;
        }


        if (this._shuGeItemType == yx.ShuGeItemType.QIDAO) {
            return;
        }
        this._shuGeItemType = yx.ShuGeItemType.QIDAO;
        this._setToggle();
        this.danDaoNode.active = false;
        this.qiDaoNode.active = true;
        this.wuDaoNode.active = false;


        yx.caveMgr.reqDongfuShuge(this._shuGeItemType);
    },
    _onwuDaoBtnClick(event) {
        cc.log("_onwuDaoBtnClick");

        //检查等级限制
        let openCfg = yx.cfgMgr.getRecordByKey("FuncOpenConfig", {ID:5});

        //级别不够，不能建造
        if (yx.playerMgr.getDuJieLevel() < openCfg["conditionnum"]) {
            yx.ToastUtil.showListToast(openCfg["opencondition"]);
            return;
        }

        //避免重复点
        if (this._shuGeItemType == yx.ShuGeItemType.WUDAO) {
            return;
        }
        this._shuGeItemType = yx.ShuGeItemType.WUDAO;
        this._setToggle();
        this.danDaoNode.active = false;
        this.qiDaoNode.active = false;
        this.wuDaoNode.active = true;

        yx.caveMgr.reqDongfuShuge(this._shuGeItemType);
    },


    _setToggle(){
        if (this._shuGeItemType == yx.ShuGeItemType.WUDAO){
            this.danDaoCheckMarkNode.active = false;
            this.qiDaoCheckMarkNode.active = false;
            this.wuDaoCheckMarkNode.active = true;
        }else if (this._shuGeItemType == yx.ShuGeItemType.QIDAO){

            this.danDaoCheckMarkNode.active = false;
            this.qiDaoCheckMarkNode.active = true;
            this.wuDaoCheckMarkNode.active = false;
        }else {

            this.danDaoCheckMarkNode.active = true;
            this.qiDaoCheckMarkNode.active = false;
            this.wuDaoCheckMarkNode.active = false;
        }
    }

});

yx.ShuGeWindow = module.extends = ShuGeWindow;