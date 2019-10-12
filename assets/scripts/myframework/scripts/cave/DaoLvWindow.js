const BaseWindow = require('BaseWindow');
const ColorSquareItem = require('ColorSquareItem');
//交互操作
const OPT = {
    JIAO_TAN: 1,
    QIE_CHUO: 2,
    ZENG_LI: 3,
    DAI_HUI: 4,
};
//页面
const PAGE = {
    DAO_LV: 1,
    SHUANG_XIU: 2,
};
//筛选过滤
const FILTER = {
    All: -1,//全部
    BU_XIANG_SHI: yx.proto.RelationshipType.Stranger,//素不相识  和协议保持一致
    HONG_YAN: yx.proto.RelationshipType.SoulMate,//红颜知己
};

let DaoLvWindow = cc.Class({
    extends: BaseWindow,

    properties: {
        quanBuBtn: cc.Button,//全部
        buXiangShiBtn: cc.Button,//不相识
        hongYanBtn: cc.Button,//红颜btn
        nameLabel: cc.Label,//"陈青妮"
        jiaoLabel: cc.Label,//"合欢教"
        xingGeDesRiText: cc.RichText,//性格描述
        jiaoTanBtn: cc.Button,//交谈
        qieChuoBtn: cc.Button,//切磋
        zengLiBtn: cc.Button,//赠礼
        daiHuiBtn: cc.Button,//带回洞府
        logRiZhiRiText: cc.RichText,//日志
        logScrollView: cc.ScrollView,//日志滚动
        qinMiDuLabel: cc.Label,//亲密度
        daoLvBtn: cc.Button,//道侣按钮
        shuangXiuBtn: cc.Button,//双修按钮
        jieShiNode:cc.Node,//结识的人显示节点
        unJieShiNode:cc.Node,//未结识的人显示节点
        colorSquareItemPrefab: cc.Prefab,//预制头像
        contentNode:cc.Node,//主内容节点
        headLayout: cc.Layout,//
        preBtn: cc.Button,
        nextBtn: cc.Button,
        headScrollview: cc.ScrollView,

        daoLvPageNode: cc.Node,//道侣页
        shuangXiuPageNode: cc.Node,//双修页

        //双修页的节点全部已sx开头
        sxHeadLayout: cc.Layout,//
        sxPreBtn: cc.Button,
        sxNextBtn: cc.Button,
        sxHeadScrollview: cc.ScrollView,
        sxNameLabel: cc.Label,//"陈青妮"
        sxJiaoLabel: cc.Label,//"合欢教"
        sxXingGeDesRiText: cc.RichText,//性格描述
        sxJueSeShangXianNumLabel: cc.Label,//双修角色上限 0/10
        sxShuangXiuNumLabel: cc.Label,//双修次数上限 0/3
        sxQinMiDuLabel: cc.Label,//亲密度
        sxRiZhiBtn: cc.Button,
        sxYaoQingBtn: cc.Button,//邀请入房
        sxShuangXiuBtn: cc.Button,//双修按钮
        sxYuanJinBtn: cc.Button,//缘尽
        sxXinTipLabel: cc.Label,//爱心提示文字
        sxXinTipBgNode: cc.Node,//爱心提示背景
        sxRoomSquareItem: ColorSquareItem,//头像

        shuangXiuingMaskNode: cc.Node,//双修进行中的的蒙版



    },

    _onInit(args) {
        this.curPageType = PAGE.DAO_LV;
        this.curDaoLvSelectedItemCfg = null;//道侣页面的选择item
        this.curSxSelectedItemCfg = null;//双修页面的选择item
        this.curRoomItemCfg = null;//当前邀请入房的Item

        //用于记录与人交谈的次数
        this.talkTimeList = {};

        yx.ColorSquareItem._itemPrefab = this.colorSquareItemPrefab;

        //两个页面内容先全部隐藏
        this.daoLvPageNode.active = false;
        this.shuangXiuPageNode.active = false;

        //默认
        this.sxXinTipBgNode.active = false;
        this.sxYaoQingBtn.node.active = true;
        this.sxShuangXiuBtn.node.active = false;

        //全部、素不相识、红颜 过滤回调
        this.quanBuBtn.node.on("click", this._filterBtnClick.bind(this, FILTER.All), this);
        this.buXiangShiBtn.node.on("click", this._filterBtnClick.bind(this, FILTER.BU_XIANG_SHI), this);
        this.hongYanBtn.node.on("click", this._filterBtnClick.bind(this, FILTER.HONG_YAN), this);

        //交谈、切磋、赠礼、带回洞府 操作回调
        this.jiaoTanBtn.node.on("click", this._optBtnClick.bind(this, OPT.JIAO_TAN), this);
        this.qieChuoBtn.node.on("click", this._optBtnClick.bind(this, OPT.QIE_CHUO), this);
        this.zengLiBtn.node.on("click", this._optBtnClick.bind(this, OPT.ZENG_LI), this);
        this.daiHuiBtn.node.on("click", this._optBtnClick.bind(this, OPT.DAI_HUI), this);

        //道侣 双修页回调
        this.daoLvBtn.node.on("click", this._pageBtnClick.bind(this, PAGE.DAO_LV), this);
        this.shuangXiuBtn.node.on("click", this._pageBtnClick.bind(this, PAGE.SHUANG_XIU), this);

        //滚动
        this.preBtn.node.on('click', this._onPreBtnClick, this);
        this.sxPreBtn.node.on('click', this._onPreBtnClick, this);
        this.nextBtn.node.on('click', this._onNextBtnClick, this);
        this.sxNextBtn.node.on('click', this._onNextBtnClick, this);

        //邀请入房
        this.sxYaoQingBtn.node.on("click", this._yaoQingBtnClick.bind(this), this);
        this.sxShuangXiuBtn.node.on("click", this._shuangXiuBtnClick.bind(this), this);
        this.sxRiZhiBtn.node.on("click", this._riZhiBtnClick.bind(this), this);
        this.sxYuanJinBtn.node.on("click", this._yuanJinBtn.bind(this), this);

        yx.eventDispatch.addListener(yx.EventType.DAOLV_REFRESH_INFO, this._refresh, this);
        yx.eventDispatch.addListener(yx.EventType.DAOLV_ZENGLI, this._onEventZengLi, this);
        yx.eventDispatch.addListener(yx.EventType.DAOLV_DAIHUI, this._onEventDaiHui, this);
        yx.eventDispatch.addListener(yx.EventType.DAOLV_YUANJIN, this._onEventYuanJin, this);
        yx.eventDispatch.addListener(yx.EventType.DAOLV_TAKEHOME, this._onEventTakeHome, this);
        yx.eventDispatch.addListener(yx.EventType.DAOLV_SHUANGXIU, this._onEventShuangXiu, this);
        yx.eventDispatch.addListener(yx.EventType.DAOLV_SHUANGXIU_LOG, this._onEventShuangXiuLog, this);
        yx.eventDispatch.addListener(yx.EventType.DAOLV_ERROR_TIP, this._onEventErrorTip, this);

        //将信息重置为""
        this._resetMessage();

        //房间框默认无人
        this.sxRoomSquareItem.init(null, this._updateContent.bind(this, PAGE.SHUANG_XIU), yx.ColorSquareItem.ColorSquareType.PLAYER);

        //加载全部道侣配置信息列表
        this.daoLvConfigs = {};
        this._loadConfig();

        this.curFilter = FILTER.All;
        //默认选中全部 且先加载全部道侣头部item
        this._filterBtnClick(this.curFilter);

        //默认选中道侣页面
        this._pageBtnClick(PAGE.DAO_LV);

        //其余的需要联网的数据，在请求之后放_refresh刷新
    },


    _onEventErrorTip(resp) {
        if (!this.isShown()){
            return;
        }
    
        if (resp.result && resp.result.errorCode) {
            switch (resp.result.errorCode) {
                case yx.proto.ErrorCodeType.DAO_LV_INTIMACY_MAX:this._showToastOrLog(resp.result.type,"道侣亲密度达最大值");break;
                case yx.proto.ErrorCodeType.DAO_LV_ALREADY_IN_HOME:this._showToastOrLog(resp.result.type,"该道侣已在洞府中");break;
                case yx.proto.ErrorCodeType.DAO_LV_INTIMACY_LOWER:this._showToastOrLog(resp.result.type,"我们好友度尚浅");break;
                case yx.proto.ErrorCodeType.DAO_LV_ALREADY_NOT_IN_HOME:this._showToastOrLog(resp.result.type,"该道侣不在洞府中");break;
                case yx.proto.ErrorCodeType.DAO_LV_SHUANG_XIU_MAX:this._showToastOrLog(resp.result.type,"今日双休已达最大次数");break;
                case yx.proto.ErrorCodeType.DAO_LV_SHUANG_XIU_CHILL_DOWN:this._showToastOrLog(resp.result.type,"双休时间未到");break;
                case yx.proto.ErrorCodeType.DAO_LV_ALREADY_SHUANG_XIU:this._showToastOrLog(resp.result.type,"已经双休过");break;
                case yx.proto.ErrorCodeType.DAO_LV_SHUANG_XIU_COUNT_MAX:this._showToastOrLog(resp.result.type,"双修人数达最大");break;
                case yx.proto.ErrorCodeType.DAO_LV_REFUSE_SHUANG_XIU:this._showToastOrLog(resp.result.type,"该道侣拒绝与你双休");break;
                case yx.proto.ErrorCodeType.DAO_LV_CAN_NOT_GIFT_GIVING:this._showToastOrLog(resp.result.type,"我不能接受你的礼物");break;
                case yx.proto.ErrorCodeType.NO_AVALIABLE_GIFT:this._showToastOrLog(resp.result.type,"没有可以赠送的礼物");break;
                case yx.proto.ErrorCodeType.DAO_LV_STRAGE:this._showToastOrLog(resp.result.type,"还未结识道侣");break;
            }
        }

    },
    _showToastOrLog(tipType, content) {
        if (tipType === yx.proto.ErrorTipsType.Console) {
            yx.ToastUtil.showListToast(content);
        } else {
            //talkContent = talkContent.format({npcName: npcName, talk: talkConfig["Talk"]});
            yx.DiarysUtil.addShowTextToRichText(this.logRiZhiRiText, "daoLv", {index: 0, str: content});
            this.logScrollView.scrollToBottom();
        }
    },

    _onEventZengLi(resp) {

        //赠礼的，一定是认识的
        let daoLvInfo = resp.daoLvInfo;
        if (daoLvInfo) {

            for (let i = 0; i < daoLvInfo.length; i++) {
                let info = daoLvInfo[i];

                //因为可能赠礼会导致关系升级、这里先清除原本的数据
                this.daoLvData.relationShipCfgList[yx.proto.RelationshipType.Stranger][info.id] = null;//素不相识
                this.daoLvData.relationShipCfgList[yx.proto.RelationshipType.SoulMate][info.id] = null;//红颜
                this.daoLvData.relationShipCfgList[yx.proto.RelationshipType.HappyCouple][info.id] = null;//比翼双飞 [暂且用不上]

                //在添加数据
                this.daoLvData.relationShipCfgList[info.relationship][info.id] = this.daoLvConfigs[info.id];
                this.daoLvData.qinMiList[info.id] = info.intimacy;

                //赠礼，不会变成双修，不用处理
                this._updateContent(PAGE.DAO_LV, this.daoLvPlayerItemScrArr[info.id], this.daoLvConfigs[info.id]);

                yx.ToastUtil.showListToast("好感度增加10");
            }
        }
    },
    //带回洞府事件
    _onEventDaiHui(resp) {
        let daoLvInfo = resp.daoLvInfo;
        if (daoLvInfo) {

            for (let i = 0; i < daoLvInfo.length; i++) {
                let info = daoLvInfo[i];
                if (info.relationship === yx.proto.RelationshipType.ShuangXiu) {
                    yx.ToastUtil.showListToast("带回到洞府");
                    //刷新界面
                    yx.daoLvMgr.reqDaoLv(yx.proto.DaoLvCmdType.GetDaoLv_Cmd);

                }
            }
        }


        let npcName = this.curDaoLvSelectedItemCfg.npcListCfg.Name;
        yx.DiarysUtil.addShowTextToRichText(this.logRiZhiRiText, "daoLv", {index: 3, npcName: npcName});
        this.logScrollView.scrollToBottom();
    },
    _onEventYuanJin(resp) {
        yx.ToastUtil.showListToast("缘分已尽");
        //刷新界面
        yx.daoLvMgr.reqDaoLv(yx.proto.DaoLvCmdType.GetDaoLv_Cmd);
    },
    _onEventTakeHome(resp) {
        this.sxRoomSquareItem.refresh(this.curSxSelectedItemCfg);
        this.curRoomItemCfg = this.curSxSelectedItemCfg;

        //邀请成功、
        this.sxYaoQingBtn.node.active = false;
        this.sxShuangXiuBtn.node.active = true;
    },
    _onEventShuangXiu(resp) {

        if (resp.natureRefuseShuangXiu){
            yx.ToastUtil.showListToast("对方拒绝与你双修");
            return;
        }

        //双修界面显示
        this.sxXinTipBgNode.active = true;
        this.shuangXiuingMaskNode.active = true;
        //this.sxXinTipLabel.string = "嘿嘿嘿";

        //按钮全部隐藏
        this.sxYaoQingBtn.node.active = false;
        this.sxShuangXiuBtn.node.active = false;

        this.node.runAction(cc.sequence(
            cc.delayTime(3),
            cc.callFunc(function () {
                //双修界面隐藏
                this.sxXinTipBgNode.active = false;
                this.shuangXiuingMaskNode.active = false;
                //邀请按钮显示
                this.sxYaoQingBtn.node.active = true;
                //room头像清楚
                this.sxRoomSquareItem.refresh(null);
                this.curRoomItemCfg = null;
                //次数
                this.sxShuangXiuNumLabel.string = resp.curShungXiuCount + "/3";

                this._showShuangXiuReword(resp);

            }.bind(this))
        ));

    },
    //双修日志
    _onEventShuangXiuLog(resp) {
        this._createShuangXiuLog(resp);
        yx.windowMgr.showWindow("shuoMingPanel", {shuoMingType: yx.ShuoMingPanel.SHUOMING_TYPE.DAOLVRIZHI});
    },

    //创建双修日志
    _createShuangXiuLog(resp) {

        //每次清理本地日志
        yx.DiarysUtil.resetLocalDataByType("daoLvLog");

        //生成日志
        let xiuLianLogs = resp.xiuLianLog;
        for (let i = 0; i < xiuLianLogs.length; i++) {
            let xiuLianLog = xiuLianLogs[i];
            if (xiuLianLog) {
                let shuangXiuTime = xiuLianLog.shuangXiuTime;
                let xiuLianInfo = xiuLianLog.xiuLianInfo;
                let daoLvInfo = xiuLianInfo.daoLvInfo;
                if (daoLvInfo && daoLvInfo[0]) {
                    let id = daoLvInfo[0].id;
                    if (id && this.daoLvConfigs[id]) {

                        let tiZhiId = this.daoLvConfigs[id]["TiZhiID"];
                        let xingGeId = this.daoLvConfigs[id]["XingGeID"];
                        let natureAllMultiple = xiuLianInfo.natureAllMultiple;//性格是否生效
                        let cmdType = xiuLianInfo.cmdType;//类型

                        let natureEffect = xiuLianInfo.natureEffect;//性格产生的体质积极影响(是[xx]这种类型的，服务器直接发具体值，其余的要自己查配置表)
                        let physiqueReduceEffect = xiuLianInfo.physiqueReduceEffect;//性格产生的体质消极影响(是[xx]这种类型的，服务器直接发具体值，其余的要自己查配置表)
                        let physiqueCfg = this.daoLvConfigs[id].physiqueCfg;

                        let args = {};
                        args.year = yx.timeUtil.getXiuLianByTime(shuangXiuTime);
                        args.npcName = this.daoLvConfigs[id].npcListCfg.Name;
                        args.name = yx.playerMgr.getName();


                        //修炼
                        switch (tiZhiId) {
                            case 1: {//负气含灵   -- 修为增加了
                                args.index = 4;
                                args.xiuwei = natureEffect;
                                args.xiuwei = Math.abs(args.xiuwei);
                                break;
                            }
                            case 2: {//纯金之体   -- 炼器经验增加
                                args.index = 5;
                                args.lianqi = physiqueCfg.Type1Value[0]["count"];
                                args.lianqi = Math.abs(args.lianqi);
                                break;
                            }
                            case 3: {//纯阳之体  -- 炼丹经验增加了
                                args.index = 6;
                                args.liandan = physiqueCfg.Type1Value[0]["count"];
                                args.liandan = Math.abs(args.liandan);
                                break;
                            }
                            case 4: {//名门之后  -- 获得威望
                                args.index = 7;
                                args.weiwang = physiqueCfg.Type1Value[0]["count"];
                                args.weiwang = Math.abs(args.weiwang);
                                break;
                            }
                            case 5: {//吉人天相    --突破成功率提升
                                args.index = 8;
                                args.radio = natureEffect;
                                break;
                            }
                            case 6: {//魔道中人  -- 修为增加了  威望下降
                                args.index = 9;
                                args.xiuwei = natureEffect;
                                args.weiwang = physiqueCfg.Type2Value[0]["count"];

                                args.xiuwei = Math.abs(args.xiuwei);
                                args.weiwang = Math.abs(args.weiwang);

                                break;
                            }
                            case 7: {//纯阴之体   -- 渡劫成功率提升  修为下降
                                args.index = 10;
                                args.radio = natureEffect;
                                args.xiuwei = physiqueReduceEffect;

                                args.radio = Math.abs(args.radio);
                                args.xiuwei = Math.abs(args.xiuwei);
                                break;
                            }
                            case 8: {//六根功德   -- 突破成功率提升
                                args.index = 11;
                                args.gongde = physiqueCfg.Type1Value[0]["count"];
                                args.gongde = Math.abs(args.gongde);
                                break;
                            }
                            case 12:
                            case 9: {//通真达灵      --灵玉
                                args.index = 12;
                                args.lingyu = physiqueCfg.Type1Value[0]["count"];
                                args.lingyu = Math.abs(args.lingyu);
                                break;
                            }
                            case 10: {//香润玉温
                                args.index = 13;
                                args.yuhe = physiqueCfg.Type1Value[0]["count"];
                                args.yuhe = Math.abs(args.yuhe);
                                break;
                            }//祖功宗德
                            case 11: {
                                args.index = 11;
                                args.gongde = physiqueCfg.Type1Value[0]["count"];
                                args.gongde = Math.abs(args.gongde);
                                break;
                            }
                            case 13: {//双生花灵    --炼丹、炼器经验分别增加
                                args.index = 14;
                                args.jingyan = physiqueCfg.Type1Value[0]["count"];
                                args.jingyan = Math.abs(args.jingyan);
                                break;
                            }
                        }

                        //拒绝双修
                        if (xiuLianInfo.natureRefuseShuangXiu){
                            args.index = 16;
                        }

                        yx.DiarysUtil.addShowTextToRichText(this.textRitext, "daoLvLog", args);

                        //性格生效记录
                        if (natureAllMultiple) {
                            switch (xingGeId) {
                                case 2: {//感情用事
                                    args.index = 1;
                                    break;
                                }
                                case 8: {//善解人意
                                    args.index = 2;
                                    break;
                                }
                                case 5: {//贤良淑德
                                    args.index = 3;
                                    break;
                                }
                            }
                            yx.DiarysUtil.addShowTextToRichText(this.textRitext, "daoLvLog", args);
                        }

                        //缘尽记录
                        if (cmdType === yx.proto.DaoLvCmdType.YuanJin_Cmd) {
                            args.index = 15;
                            yx.DiarysUtil.addShowTextToRichText(this.textRitext, "daoLvLog", args);
                        }

                    }
                }
            }
        }


    },

    //显示双修收获
    _showShuangXiuReword(resp) {

        let daoLvInfo = resp.daoLvInfo;
        if (daoLvInfo && daoLvInfo[0]) {
            let id = daoLvInfo[0].id;
            //日志
            if (id && this.daoLvConfigs[id]) {
                let args = {};
                args.year = yx.timeUtil.getXiuLianYear();
                //args.npcName = this.curSxSelectedItemCfg.npcListCfg.Name;

                let tiZhiId = this.daoLvConfigs[id]["TiZhiID"];
                let xingGeId = this.daoLvConfigs[id]["XingGeID"];

                //赠送
                let resourceMsgs = resp.natureOtherValue;
                if (resourceMsgs) {
                    for (let i = 0; i < resourceMsgs.length; i++) {
                        let resource = resourceMsgs[i];
                        let id = resource.id;
                        if (resource.type == 0) {//货币、需要+80000
                            id += 80000;
                        }

                        let itemCfg = yx.cfgMgr.getOneRecord("ItemConfig", {ID: id});
                        if (itemCfg) {
                            yx.ToastUtil.showListToast("获得了" + itemCfg["Name"] + "x" + resource.count);
                        }
                    }
                }

                //体质奖励
                let natureEffect = resp.natureEffect;//性格产生的体质积极影响(是[xx]这种类型的，服务器直接发具体值，其余的要自己查配置表)
                let physiqueReduceEffect = resp.physiqueReduceEffect;//性格产生的体质消极影响(是[xx]这种类型的，服务器直接发具体值，其余的要自己查配置表)
                let physiqueCfg = this.daoLvConfigs[id].physiqueCfg;

                //
                args.npcName = this.daoLvConfigs[id].npcListCfg.Name;
                args.name = yx.playerMgr.getName();

                //shouToast
                switch (tiZhiId) {
                    case 1: {//负气含灵   -- 修为增加了
                        args.index = 4;
                        args.xiuwei = natureEffect;
                        args.xiuwei = Math.abs(args.xiuwei);
                        yx.ToastUtil.showListToast("修为提升" + args.xiuwei + "点");
                        break;
                    }
                    case 2: {//纯金之体   -- 炼器经验增加
                        args.index = 5;
                        args.lianqi = physiqueCfg.Type1Value[0]["count"];
                        args.lianqi = Math.abs(args.lianqi);
                        yx.ToastUtil.showListToast("炼器经验提升" + args.lianqi + "点");
                        break;
                    }
                    case 3: {//纯阳之体  -- 炼丹经验增加了
                        args.index = 6;
                        args.liandan = physiqueCfg.Type1Value[0]["count"];
                        args.liandan = Math.abs(args.liandan);
                        yx.ToastUtil.showListToast("炼丹经验提升" + args.liandan + "点");
                        break;
                    }
                    case 4: {//名门之后  -- 获得威望
                        args.index = 7;
                        args.weiwang = physiqueCfg.Type1Value[0]["count"];
                        args.weiwang = Math.abs(args.weiwang);
                        yx.ToastUtil.showListToast("威望提升" + args.weiwang + "点");
                        break;
                    }
                    case 5: {//吉人天相    --突破成功率提升
                        args.index = 8;
                        args.radio = natureEffect;
                        yx.ToastUtil.showListToast("渡劫成功率提升" + args.radio + "%");
                        break;
                    }
                    case 6: {//魔道中人  -- 修为增加了  威望下降
                        args.index = 9;
                        args.xiuwei = natureEffect;
                        args.weiwang = physiqueCfg.Type2Value[0]["count"];

                        args.xiuwei = Math.abs(args.xiuwei);
                        args.weiwang = Math.abs(args.weiwang);

                        yx.ToastUtil.showListToast("修为提升" + args.xiuwei + "点");
                        yx.ToastUtil.showListToast("威望下降" + args.weiwang + "点");
                        break;
                    }
                    case 7: {//纯阴之体   -- 渡劫成功率提升  修为下降
                        args.index = 10;
                        args.radio = natureEffect;
                        args.xiuwei = physiqueReduceEffect;

                        args.radio = Math.abs(args.radio);
                        args.xiuwei = Math.abs(args.xiuwei);
                        yx.ToastUtil.showListToast("渡劫成功率提升" + args.radio + "%");
                        yx.ToastUtil.showListToast("修为下降" + args.xiuwei + "点");
                        break;
                    }
                    case 8: {//六根功德   -- 突破成功率提升
                        args.index = 11;
                        args.gongde = physiqueCfg.Type1Value[0]["count"];
                        args.gongde = Math.abs(args.gongde);
                        yx.ToastUtil.showListToast("功德提升" + args.gongde + "点");
                        break;
                    }
                    case 12:
                    case 9: {//通真达灵      --灵玉
                        args.index = 12;
                        args.lingyu = physiqueCfg.Type1Value[0]["count"];
                        args.lingyu = Math.abs(args.lingyu);
                        yx.ToastUtil.showListToast("获取灵玉x" + args.lingyu);
                        break;
                    }
                    case 10: {//香润玉温
                        args.index = 13;
                        args.yuhe = physiqueCfg.Type1Value[0]["count"];
                        args.yuhe = Math.abs(args.yuhe);
                        yx.ToastUtil.showListToast("获取玉盒x" + args.yuhe);
                        break;
                    }//祖功宗德
                    case 11: {
                        args.index = 11;
                        args.gongde = physiqueCfg.Type1Value[0]["count"];
                        args.gongde = Math.abs(args.gongde);
                        yx.ToastUtil.showListToast("功德提升" + args.gongde + "点");
                        break;
                    }
                    case 13: {//双生花灵    --炼丹、炼器经验分别增加
                        args.index = 14;
                        args.jingyan = physiqueCfg.Type1Value[0]["count"];
                        args.jingyan = Math.abs(args.jingyan);
                        yx.ToastUtil.showListToast("炼丹经验提升" + args.jingyan + "点");
                        yx.ToastUtil.showListToast("炼器经验提升" + args.jingyan + "点");
                        break;
                    }
                }

                switch (xingGeId) {
                    case 2:
                        args.index = 1;
                        break;//感情用事
                    case 8:
                        args.index = 2;
                        break;//善解人意
                    case 5:
                        args.index = 3;
                        break;//贤良淑德
                }


                //日志放到了服务器返回，所以本地无需再存
                //yx.DiarysUtil.addShowTextToRichText(this.textRitext, "daoLvLog", args);
            }
        }
    },

    _resetMessage() {
        this._resetDaoLvPageMessage();
        this._resetShuangXiuPageMessage();
    },
    //重置道侣页面的信息
    _resetDaoLvPageMessage() {
        this.nameLabel.string = "";
        this.jiaoLabel.string = "";
        this.xingGeDesRiText.string = "";
    },
    //重置双修页面的信息
    _resetShuangXiuPageMessage() {
        this.sxJueSeShangXianNumLabel.string = "0/10";
        this.sxShuangXiuNumLabel.string = "0/3";
        this.sxNameLabel.string = "";
        this.sxJiaoLabel.string = "";
        this.sxXingGeDesRiText.string = "";
    },

    _refresh(resp) {
        //this
        if (!resp) return;

        this.daoLvData = resp;

        //素不相识、红颜 放入不同列表
        this.daoLvData.relationShipCfgList = [];
        this.daoLvData.relationShipCfgList[yx.proto.RelationshipType.Stranger] = {};//素不相识
        this.daoLvData.relationShipCfgList[yx.proto.RelationshipType.SoulMate] = {};//红颜
        this.daoLvData.relationShipCfgList[yx.proto.RelationshipType.HappyCouple] = {};//比翼双飞 [暂且用不上]
        this.daoLvData.relationShipCfgList[yx.proto.RelationshipType.ShuangXiu] = {};//双修

        //亲密按Id为索引存起来
        this.daoLvData.qinMiList = {};
        //双修角色数量
        this.daoLvData.curShuangXiuNum = 0;

        //把不同关系的人放不同数组里
        let daoLvInfo = resp.daoLvInfo;
        for (let i = 0; i < daoLvInfo.length; i++) {
            let info = daoLvInfo[i];
            //relationShip的子元素不是数组，且注意index 为id，不是从0开始，方便直接用id取
            this.daoLvData.relationShipCfgList[info.relationship][info.id] = this.daoLvConfigs[info.id];
            this.daoLvData.qinMiList[info.id] = info.intimacy;

            if (info.relationship === yx.proto.RelationshipType.ShuangXiu) {
                this.daoLvData.curShuangXiuNum++;
            }
        }

        //素不相识的 为在配置表里，排除掉服务器发下来的
        for (let i in this.daoLvConfigs) {
            let isStrager = true;//是否陌生
            let localDaoLvCfg = this.daoLvConfigs[i];
            for (let j = 0; j < daoLvInfo.length; j++) {
                if (localDaoLvCfg.ID == daoLvInfo[j].id) {
                    isStrager = false;//不是陌生
                    break;
                }
            }
            //陌生人进集合
            if (isStrager) {
                this.daoLvData.relationShipCfgList[yx.proto.RelationshipType.Stranger][localDaoLvCfg.ID] = localDaoLvCfg;
                this.daoLvData.qinMiList[localDaoLvCfg.ID] = 0;
            }
        }

        //刷新道侣界面
        this._filterBtnClick(this.curFilter);

        //双修头部的列表
        this._loadShuangXiuHeadLayoutItem(this.daoLvData.relationShipCfgList[yx.proto.RelationshipType.ShuangXiu]);

        //刷新 今日双修次数
        this.sxShuangXiuNumLabel.string = this.daoLvData.curShungXiuCount + "/3";

        //刷新 双修角色上限
        this.sxJueSeShangXianNumLabel.string = this.daoLvData.curShuangXiuNum + "/10"

        //网络获取数据之后，对当前选中的数据刷新
        if (this.curDaoLvSelectedItemCfg) {
            this._updateContent(PAGE.DAO_LV, this.daoLvPlayerItemScrArr[this.curDaoLvSelectedItemCfg.ID], this.curDaoLvSelectedItemCfg);
        }
        if (this.curSxSelectedItemCfg) {
            this._updateContent(PAGE.SHUANG_XIU, this.sxPlayerItemScrArr[this.curSxSelectedItemCfg.ID], this.curSxSelectedItemCfg);
        }


    },
    _onShow() {
        yx.DiarysUtil.setRichTextWithShowList(this.logRiZhiRiText, "daoLv");

        //请求道侣信息
        yx.daoLvMgr.reqDaoLv(yx.proto.DaoLvCmdType.GetDaoLv_Cmd);

    },
    _yaoQingBtnClick() {
        if (!this.curSxSelectedItemCfg || !this.curSxSelectedItemCfg.npcListCfg || !this.daoLvData) {
            return
        }
        yx.daoLvMgr.reqDaoLv(yx.proto.DaoLvCmdType.TakeRoom_Cmd, this.curSxSelectedItemCfg.ID);

    },
    _shuangXiuBtnClick() {
        if (!this.curRoomItemCfg || !this.daoLvData) return;

        yx.daoLvMgr.reqDaoLv(yx.proto.DaoLvCmdType.ShuangXiu_Cmd, this.curSxSelectedItemCfg.ID);
    },
    _riZhiBtnClick() {
        //请求道侣的日志
        yx.daoLvMgr.reqDaoLv(yx.proto.DaoLvCmdType.ShuangXiuLog_Cmd);
    },
    _yuanJinBtn() {
        if (!this.curSxSelectedItemCfg || !this.daoLvData) {
            return
        }

        let arg = {};
        arg.content = " 缘尽后将无法与该道侣双修，且友好度变为 60，是否确定。<color=#bb1f29>（该道侣的特殊技能缘尽后不再生效）</color>";

        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "DaoLvWindow";
        clickEventHandler.handler = "_onyuanJinBtnConfirm";
        arg.confirmCallback = clickEventHandler;

        yx.windowMgr.showWindow("textConfirm", arg);
    },
    _onyuanJinBtnConfirm() {
        if (!this.curSxSelectedItemCfg || !this.daoLvData) {
            return
        }
        yx.daoLvMgr.reqDaoLv(yx.proto.DaoLvCmdType.YuanJin_Cmd, this.curSxSelectedItemCfg.ID);

    },

    _onPreBtnClick() {
        switch (this.curPageType) {
            case PAGE.DAO_LV: {
                let curOffsetX = this.headScrollview.getScrollOffset().x;
                this.headScrollview.scrollToOffset(cc.v2(Math.abs(curOffsetX) - this.headScrollview.node.width, 0), 1.5);
                break;
            }
            case PAGE.SHUANG_XIU: {

                let curOffsetX = this.sxHeadScrollview.getScrollOffset().x;//相对左上角的偏移值，若左滑，则得到负数
                this.sxHeadScrollview.scrollToOffset(cc.v2(Math.abs(curOffsetX) - this.sxHeadScrollview.node.width, 0), 1.5);
                break;
            }
        }


    },
    _onNextBtnClick() {
        switch (this.curPageType) {
            case PAGE.DAO_LV: {
                let curOffsetX = this.headScrollview.getScrollOffset().x;//相对左上角的偏移值，若左滑，则得到负数
                this.headScrollview.scrollToOffset(cc.v2(Math.abs(curOffsetX) + this.headScrollview.node.width, 0), 1.5);
                break;
            }
            case PAGE.SHUANG_XIU: {
                let curOffsetX = this.sxHeadScrollview.getScrollOffset().x;//相对左上角的偏移值，若左滑，则得到负数
                this.sxHeadScrollview.scrollToOffset(cc.v2(Math.abs(curOffsetX) + this.sxHeadScrollview.node.width, 0), 1.5);
                break;
            }
        }

    },

    _loadConfig() {

        let daoLvListCfgs = yx.cfgMgr.getAllConfig("DaoLvListConfig");
        if (daoLvListCfgs) {
            for (let i = 0; i < daoLvListCfgs.length; i++) {
                let daoLvItem = daoLvListCfgs[i];
                let ID = daoLvListCfgs[i]["ID"];
                //获取性格
                let xingGeId = daoLvListCfgs[i]["XingGeID"];
                let natureCfg = yx.cfgMgr.getOneRecord("DaoLvNatureConfig", {ID: xingGeId});
                if (natureCfg) {
                    daoLvItem.natureCfg = natureCfg;
                }

                //获取体质
                let tizhiId = daoLvListCfgs[i]["TiZhiID"];
                let physiqueCfg = yx.cfgMgr.getOneRecord("DaoLvPhysiqueConfig", {ID: tizhiId});
                if (physiqueCfg) {
                    daoLvItem.physiqueCfg = physiqueCfg;
                }
                //获取Npc 名称等相关信息
                let npcID = daoLvListCfgs[i]["NpcID"];
                let npcListCfg = yx.cfgMgr.getOneRecord("NpcListConfig", {ID: npcID});
                if (npcListCfg) {
                    daoLvItem.npcListCfg = npcListCfg;

                    //获取门派
                    let menPaiId = npcListCfg["MenPaiID"];
                    let menPaiCfg = yx.cfgMgr.getOneRecord("MenPaiConfig", {ID: menPaiId});
                    if (menPaiCfg) {
                        daoLvItem.menPaiCfg = menPaiCfg;
                    }

                }

                //存起来
                this.daoLvConfigs[ID] = daoLvItem;
            }
        }
    },

    //加载双修的Item
    _loadShuangXiuHeadLayoutItem(daoLvConfigs) {

        this.sxPlayerItemScrArr = {};
        this.sxHeadLayout.node.removeAllChildren(true);

        this.sxScrollviewItemChang = true;//布局内容变化

        let firstConfig = null;
        let firstItemScr = null;

        for (let i in daoLvConfigs) {
            if (daoLvConfigs[i]) {
                let itemSrc = yx.ColorSquareItem.CreateItem(daoLvConfigs[i]
                    , this.sxHeadLayout.node, "playerItem"
                    , this._updateContent.bind(this, PAGE.SHUANG_XIU)
                    , yx.ColorSquareItem.ColorSquareType.PLAYER);

                this.sxPlayerItemScrArr[daoLvConfigs[i].ID] = itemSrc;

                if (!firstConfig) firstConfig = daoLvConfigs[i];
                if (!firstItemScr) firstItemScr = itemSrc;
            }
        }

        /* this.node.runAction(cc.sequence(cc.delayTime(0.2), cc.callFunc(function () {
             this.sxHeadScrollview.scrollToOffset(cc.v2(0, 0), 0.1);
         }.bind(this))));*/

        //默认选中第一个
        if (firstItemScr && firstConfig) {
            this._updateContent(PAGE.SHUANG_XIU, firstItemScr, firstConfig);
        }

    },

    //加载道侣 头部的Item
    _loadDaoLvHeadLayoutItem(filter) {

        let daoLvConfigs = null;

        if (filter == FILTER.All) {
            daoLvConfigs = this.daoLvConfigs;//默认全部显示
        } else if (this.daoLvData) {
            daoLvConfigs = this.daoLvData.relationShipCfgList[filter];//筛选显示
        }

        if (!daoLvConfigs) {
            daoLvConfigs = {}
        }

        this.daoLvPlayerItemScrArr = {};
        this.headLayout.node.removeAllChildren(true);

        let firstConfig = null;
        let firstItemScr = null;


        let allDaoLvItemNodeArr = [];
        for (let i in daoLvConfigs) {
            //
            if (daoLvConfigs[i]) {
                let itemSrc = yx.ColorSquareItem.CreateItem(daoLvConfigs[i]
                    , this.headLayout.node, "playerItem"
                    , this._updateContent.bind(this, PAGE.DAO_LV)
                    , yx.ColorSquareItem.ColorSquareType.PLAYER);

                this.daoLvPlayerItemScrArr[daoLvConfigs[i].ID] = itemSrc;
                if (!firstConfig) firstConfig = daoLvConfigs[i];
                if (!firstItemScr) firstItemScr = itemSrc;

                //当前若是全部道侣分类，将Node记录下来，用于重新排序
                if (filter == FILTER.All){
                    allDaoLvItemNodeArr.push(itemSrc.node.parent);
                    itemSrc.node.parent.daiLvId = daoLvConfigs[i].ID;
                    itemSrc.node.parent.src = itemSrc;
                }
            }
        }

        //全部分类里，从新排序，认识的排在前面
        if (filter == FILTER.All && this.daoLvData){
            //因为重新排序了，那么首个数据发生了变化，需要重新获得
            firstConfig = null;
            firstItemScr = null;

            //辅助数据重排序
            allDaoLvItemNodeArr.sort(function (a, b) {
                let isAMoSheng = this.daoLvData.relationShipCfgList[yx.proto.RelationshipType.Stranger][a.daiLvId];
                let isBMoSheng = this.daoLvData.relationShipCfgList[yx.proto.RelationshipType.Stranger][b.daiLvId];
                if (isAMoSheng && isBMoSheng) {
                    return 0;
                } else if (isAMoSheng) {
                    return 1;
                } else {
                    return -1;
                }
            }.bind(this));

            //ui重排序
            for (let i = 0; i < allDaoLvItemNodeArr.length; i++) {
                this.headLayout.node.insertChild(allDaoLvItemNodeArr[i],i);
                if (!firstConfig) firstConfig = daoLvConfigs[allDaoLvItemNodeArr[i].daiLvId];
                if (!firstItemScr) firstItemScr = allDaoLvItemNodeArr[i].src;
            }
        }

        //置灰处理： 未结识的人，要置灰色
        if (this.daoLvData){
            for (let id in this.daoLvPlayerItemScrArr){
                //陌生人，需要设灰色
                let isMoSheng = this.daoLvData.relationShipCfgList[yx.proto.RelationshipType.Stranger][id];
                this.daoLvPlayerItemScrArr[id].setPlayerGray(isMoSheng);
            }
        }

        //回到开始的位置
        this.node.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(function () {
            this.headScrollview.scrollToOffset(cc.v2(0, 0), 0.1);
        }.bind(this))));

        //默认选中第一个
        if (firstItemScr && firstConfig) {
            this.contentNode.active = true;
            this._updateContent(PAGE.DAO_LV, firstItemScr, firstConfig);//内容index从1开始，为ID
        }else {
            //此分类为无人
            this.contentNode.active = false;
        }

    },

    //info -> this.daoLvConfigs[x]
    _updateContent(page, itemSrc, daoLvCfg) {

        let srcArr = null;
        let nameLabel = null;
        let jiaoLabel = null;
        let xingGeDesRiText = null;
        let qinMiLabel = null;

        if (page == PAGE.DAO_LV) {
            this.curDaoLvSelectedItemCfg = daoLvCfg;
            srcArr = this.daoLvPlayerItemScrArr;
            nameLabel = this.nameLabel;
            jiaoLabel = this.jiaoLabel;
            xingGeDesRiText = this.xingGeDesRiText;
            qinMiLabel = this.qinMiDuLabel;
        } else {
            this.curSxSelectedItemCfg = daoLvCfg;
            srcArr = this.sxPlayerItemScrArr;
            nameLabel = this.sxNameLabel;
            jiaoLabel = this.sxJiaoLabel;
            xingGeDesRiText = this.sxXingGeDesRiText;
            qinMiLabel = this.sxQinMiDuLabel;

            //当前有入房的人，且入房的人正是选中的人
            if (this.curRoomItemCfg && this.curRoomItemCfg === this.curSxSelectedItemCfg) {
                this.sxYaoQingBtn.node.active = false;
                this.sxShuangXiuBtn.node.active = true;
            } else {
                this.sxYaoQingBtn.node.active = true;
                this.sxShuangXiuBtn.node.active = false;
            }
        }


        if (itemSrc) {
            //实现单选 只有选中的会被显示外框
            for (let i in srcArr) {
                if (srcArr[i]) {
                    srcArr[i].showIsCheck(srcArr[i] === itemSrc);
                }
            }
        }

        if (daoLvCfg) {
            //刷新姓名
            if (daoLvCfg.npcListCfg && nameLabel) nameLabel.string = daoLvCfg.npcListCfg.Name;
            //刷新门派
            if (daoLvCfg.menPaiCfg && jiaoLabel) jiaoLabel.string = daoLvCfg.menPaiCfg.DefName;

            //只有结识的道侣才显示体质和性格
            if (this.daoLvData && !this.daoLvData.relationShipCfgList[yx.proto.RelationshipType.Stranger][this.curDaoLvSelectedItemCfg.ID]){//不在陌生人中

                this.jieShiNode.active = true;
                this.unJieShiNode.active = false;
                //刷新性格、体质描述
                let xingGeStr = "";
                xingGeStr += yx.colorUtil.AddColorString("【" + daoLvCfg.natureCfg.Name + "】", yx.textDict.QualityColor[daoLvCfg.PinZhi]);//"贤良淑德"
                xingGeStr += yx.colorUtil.AddColorString(daoLvCfg.natureCfg.XingGeDesc + "\n", yx.colorUtil.TextBlueLigth);//"小概率使得与其双修后，百年内的双修效率提高。"
                xingGeStr += yx.colorUtil.AddColorString("【" + daoLvCfg.physiqueCfg.Name + "】", yx.textDict.QualityColor[daoLvCfg.PinZhi]);//纯金之体
                xingGeStr += yx.colorUtil.AddColorString(daoLvCfg.physiqueCfg.TiZhiDesc, yx.colorUtil.TextBlueLigth);//双修后炼器经验提升

                //性格信息
                if (xingGeDesRiText) xingGeDesRiText.string = xingGeStr;
            }else {
                xingGeDesRiText.string = "";
                this.jieShiNode.active = false;
                this.unJieShiNode.active = true;
            }



            //亲密度
            let qinMiDu = (this.daoLvData && this.daoLvData.qinMiList && this.daoLvData.qinMiList[daoLvCfg.ID]) ? this.daoLvData.qinMiList[daoLvCfg.ID] : 0;
            if (qinMiLabel) qinMiLabel.string = qinMiDu;


        }
    },

    _filterBtnClick(filter) {
        this._resetFilterBtnCheck();
        this.curFilter = filter;
        switch (filter) {
            case FILTER.All: {
                this.quanBuBtn.node.getChildByName("selectBg").active = true;

                break;
            }
            case FILTER.BU_XIANG_SHI: {
                this.buXiangShiBtn.node.getChildByName("selectBg").active = true;
                break;
            }
            case FILTER.HONG_YAN: {
                this.hongYanBtn.node.getChildByName("selectBg").active = true;
                break;
            }
        }
        this._loadDaoLvHeadLayoutItem(filter);
    },
    _optBtnClick(opt) {
        if (!this.curDaoLvSelectedItemCfg || !this.curDaoLvSelectedItemCfg.npcListCfg || !this.daoLvData) {
            return
        }

        if (this.daoLvData.relationShipCfgList[yx.proto.RelationshipType.Stranger][this.curDaoLvSelectedItemCfg.ID]) {
            yx.ToastUtil.showListToast("未结识");
            return;
        }

        switch (opt) {
            case OPT.JIAO_TAN: {//交谈
                let curTalkTime = this.talkTimeList[this.curDaoLvSelectedItemCfg.ID];
                if (curTalkTime && curTalkTime.talkCount >= 3) {
                    //5秒内最多交谈三次、否则给予不交谈  对方似乎不想再与你交谈
                    if ((curTalkTime.endTime - curTalkTime.beginTime) / 1000 <= 5) {
                        yx.DiarysUtil.addShowTextToRichText(this.logRiZhiRiText, "daoLv", {index: 1});
                        this.logScrollView.scrollToBottom();

                        if (!curTalkTime.isRunAciton) {
                            curTalkTime.isRunAciton = true;
                            let id = this.curDaoLvSelectedItemCfg.ID;
                            this.node.runAction(cc.sequence(cc.delayTime(5), cc.callFunc(function () {
                                //五秒之后重置
                                this.talkTimeList[id] = null;
                            }.bind(this))));
                        }
                        return;
                    }
                }

                let taklId = this.curDaoLvSelectedItemCfg.npcListCfg["TalkID"];
                this._showTalkLogText(taklId);

                let nowTime = new Date().getTime();
                if (!this.talkTimeList[this.curDaoLvSelectedItemCfg.ID]) {
                    this.talkTimeList[this.curDaoLvSelectedItemCfg.ID] = {};
                    this.talkTimeList[this.curDaoLvSelectedItemCfg.ID].beginTime = nowTime;//开始交谈时间
                    this.talkTimeList[this.curDaoLvSelectedItemCfg.ID].talkCount = 0;//交谈次数
                }
                this.talkTimeList[this.curDaoLvSelectedItemCfg.ID].endTime = nowTime;//结束交谈时间
                this.talkTimeList[this.curDaoLvSelectedItemCfg.ID].talkCount++;

                break;
            }
            case OPT.QIE_CHUO: {//切磋
                //yx.daoLvMgr.reqDaoLv(yx.proto.DaoLvCmdType);
                //let taklId = this.curDaoLvSelectedItemCfg.npcListCfg["JuJieQieCuoTalkID"];
                //this._showTalkLogText(taklId);
                break;
            }
            case OPT.ZENG_LI: {//赠礼
                //必须现有数据，才赠礼
                if (this.daoLvData) {
                    yx.daoLvMgr.reqDaoLv(yx.proto.DaoLvCmdType.GifgGiving_Cmd, this.curDaoLvSelectedItemCfg.ID);
                }
                break;
            }
            case OPT.DAI_HUI: {//带回洞府

                if (this.daoLvData) {
                    yx.daoLvMgr.reqDaoLv(yx.proto.DaoLvCmdType.TakeHome_Cmd, this.curDaoLvSelectedItemCfg.ID);
                }

                break;
            }
        }
    },
    _showTalkLogText(talkId) {
        if (talkId && this.curDaoLvSelectedItemCfg && this.curDaoLvSelectedItemCfg.npcListCfg) {
            let talkConfig = yx.cfgMgr.getRecordByKey("TalkListConfig", {ID: talkId});
            if (talkConfig) {
                let talkContent = "<color=#e7452f>{npcName}</color>:{talk}";
                let npcName = this.curDaoLvSelectedItemCfg.npcListCfg.Name;
                talkContent = talkContent.format({npcName: npcName, talk: talkConfig["Talk"]});
                yx.DiarysUtil.addShowTextToRichText(this.logRiZhiRiText, "daoLv", {index: 0, str: talkContent});
                this.logScrollView.scrollToBottom();
            }
        }
    },

    _pageBtnClick(page) {
        if (page == PAGE.SHUANG_XIU) {
            if (!this.daoLvData) {
                return;
            }
            if (this.daoLvData.curShuangXiuNum <= 0) {
                yx.ToastUtil.showListToast("目前还没有愿意与你双修的道侣");
                return;
            }
        }

        this._resetPageBtnCheck();
        switch (page) {
            case PAGE.DAO_LV: {
                this.daoLvBtn.node.getChildByName("checkMark").active = true;
                this.daoLvPageNode.active = true;
                this.shuangXiuPageNode.active = false;
                break;
            }
            case PAGE.SHUANG_XIU: {
                this.shuangXiuBtn.node.getChildByName("checkMark").active = true;
                this.daoLvPageNode.active = false;
                this.shuangXiuPageNode.active = true;

                //
                if (this.sxScrollviewItemChang) {
                    this.sxScrollviewItemChang = false;
                    this.node.runAction(cc.sequence(cc.delayTime(0.2), cc.callFunc(function () {
                        this.sxHeadScrollview.scrollToOffset(cc.v2(0, 0), 0.1);
                    }.bind(this))));
                }
                break;
            }
        }
        this.curPageType = page;
    },

    //全部过滤按钮设为未选中状态
    _resetFilterBtnCheck() {
        this.quanBuBtn.node.getChildByName("selectBg").active = false;
        this.buXiangShiBtn.node.getChildByName("selectBg").active = false;
        this.hongYanBtn.node.getChildByName("selectBg").active = false;
    },

    //全部页面按钮设为未选中状态
    _resetPageBtnCheck() {
        this.daoLvBtn.node.getChildByName("checkMark").active = false;
        this.shuangXiuBtn.node.getChildByName("checkMark").active = false;
    },
});
yx.DaoLvWindow = module.exports = DaoLvWindow;