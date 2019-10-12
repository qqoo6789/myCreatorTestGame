/**
 * 炼制panel ：用于丹房炼制，器室炼制
 *
 *
 */
const LayoutPerWidth = 159;

//炼制状态
const LIANZHI_STATE = {
    UN_LIANZHI: 1,//未炼制
    ON_LIANZHI: 2,//正在炼制
};

const NumberWidget = require('NumberWidget');
const TimeProBarWidget = require('TimeProBarWidget');
const ItemRichTextWidget = require('ItemRichTextWidget');
const BaseWindow = require('BaseWindow');
let LianZhiPanel = cc.Class({
    extends: BaseWindow,

    statics: {
        LIANZHI_STATE: LIANZHI_STATE
    },

    properties: {
        //标题 "炼丹学徒"
        homeTitleLable:cc.Label,

        homePageNode: cc.Node,
        //首页选择按钮
        homeSelectBtn: cc.Button,
        //首页关闭按钮
        homeCloseBtn: cc.Button,
        // 向左
        homeLeftBtn: cc.Button,
        // 向右
        homeRightBtn: cc.Button,
        // 当前选中的丹方、器方
        homeSelectItemSp: cc.Sprite,
        // "未选择" label
        homeUnSelectLabel: cc.Label,
        // 成功率
        homeSuccessRatioLabel: cc.Label,
        // 数字组件
        homeNumberWidget: NumberWidget,
        //"炼制中"节点
        homeOnLianZhiNode: cc.Node,
        //"未开始炼制"节点
        homeUnLianZhiNode: cc.Node,
        //进度条组件
        homeTimeProBarWidget: TimeProBarWidget,
        //属性内容
        homeShuXingRichText: cc.RichText,
        //三个所需材料框的显示控制节点
        homeLianZhiNeedNode:cc.Node,
        //三个所需材料框
        homeItemWidget1: ItemRichTextWidget,
        homeItemWidget2: ItemRichTextWidget,
        homeItemWidget3: ItemRichTextWidget,
        //炼制完成材料框的显示控制节点
        homeLianZhiFinishNode:cc.Node,
        //完成炼制框
        homeFinishItemWidget: ItemRichTextWidget,
        //炼制材料文字 “炼器所需材料”
        homeLianZhiNeedLabel:cc.Label,
        //"炼丹成功1次，失败0次。"
        homeFinishRichText:cc.RichText,

        //控制调制中的进度条信息显示与否
        homeRunningNode:cc.Node,
        //控制调制中的炼制完毕信息显示与否
        homeFinishNode:cc.Node,
        //领取按钮
        homeLingQuZhiBtn:cc.Button,
        //调制结束领取界面的提示
        homeFinishTipRichText:cc.RichText,
        //默认描述
        homeDefaultDesrLabel: cc.Label,
        //'开始调制'按钮
        homeBeginTiaoZhiBtn: cc.Button,
        //'终止'按钮
        homeEndTiaoZhiBtn: cc.Button,
        //'图鉴'按钮
        homeTuJianBtn: cc.Button,
        //炉器滑动器
        homeScrollView: cc.ScrollView,
        //炉器滑动器 禁止滑动Node
        homeScrollViewBlockNode: cc.Node,
        //炉器装载器
        homeLayout: cc.Layout,
        //上、下 切换炉
        homePreBtn:cc.Button,
        homeNextBtn:cc.Button,
        //自动匹配按钮
        homeAutoChooseToggle:cc.Toggle,
        //炼炉名称
        homeLianLuName:cc.Label,
        //第二界面：选择材料界面
        selectDanFangNode: cc.Node,
        //选择材料界面 ，用stu开头标志， "stuff" 材料的意思
        stuCloseBtn: cc.Button,
        stuLayout: cc.Layout,
        stuHideStuffBtn:cc.Button,//隐藏材料单选
        stuHideMarkNode:cc.Node,//隐藏材料单选
        stuHideChemarkTipLabel:cc.Label,//"隐藏材料不足图纸"

        //第三界面 图鉴界面  全部使用tuJian开头
        tuJianPageNode: cc.Node,
        //
        tuJianLayout: cc.Layout,
        //
        tuJianCloseBtn: cc.Button,

        //丹方条目预制品
        danFangItemPrefab: cc.Prefab,
        //丹方条目预制品里面用到的预制品
        danSelectItemPrefab: cc.Prefab,
        //图鉴条目预制品里面用到的预制品
        tuJianItemPrefab: cc.Prefab,
        //炼炉预制品
        lianLuItemPrefab: cc.Prefab,

        //炉子特效
        luZiEffectPrafab:cc.Prefab,

    },
    _onInit(args) {
        this.curBuildType = args.buildType;
        //this.buildType = this.curBuildType == yx.CaveBuildType.DANFANG? yx.

        this.homePageNode.active = true;
        this.selectDanFangNode.active = false;
        this.tuJianPageNode.active = false;

        this.homeLianZhiNeedNode.active = true;
        this.homeLianZhiFinishNode.active = false;

        this.homeRunningNode.active = false;
        this.homeFinishNode.active = false;
        this.homeLianLuName.node.parent.active = false;
        this.homeSuccessRatioLabel.node.active = false;
        //
        this.homeItemWidgetArr = [];
        this.homeItemWidgetArr.push(this.homeItemWidget1);
        this.homeItemWidgetArr.push(this.homeItemWidget2);
        this.homeItemWidgetArr.push(this.homeItemWidget3);

        this.homeSelectBtn.node.on('click', this._onHomeSelectBtnClick, this);
        this.homeCloseBtn.node.on('click', this._onHomeCloseBtnClick, this);
        this.homeBeginTiaoZhiBtn.node.on('click', this._onHomeBeginTiaoZhiBtnClick, this);
        this.homeEndTiaoZhiBtn.node.on('click', this._onHomeEndTiaoZhiBtnClick, this);
        this.homeTuJianBtn.node.on('click', this._onHomeTuJianBtnClick, this);

        this.stuCloseBtn.node.on('click', this._onStuCloseBtnClick, this);
        this.tuJianCloseBtn.node.on('click', this._onTuJianCloseBtnClick, this);
        this.homePreBtn.node.on('click', this._onHomePreBtnClick, this);
        this.homeNextBtn.node.on('click', this._onHomeNextBtnClick, this);
        this.homeLingQuZhiBtn.node.on('click', this._onHomeLingQuZhiBtnClick, this);
        this.homeAutoChooseToggle.node.on('click', this._onHomeAutoChooseToggleClick, this);
        this.stuHideStuffBtn.node.on('click', this._onStuHideStuffBtnClick, this);

        yx.LianZhiItem._itemPrefab = this.danFangItemPrefab;
        yx.LianZhiSelectItem._itemPrefab = this.danSelectItemPrefab;
        yx.TuJianItemWidget._itemPrefab = this.tuJianItemPrefab;
        yx.LianLuItem._itemPrefab = this.lianLuItemPrefab;

        this._initScrollview();
        //

        if (this.curBuildType == yx.CaveBuildType.DANFANG) {
            yx.eventDispatch.addListener(yx.EventType.REFRESH_CAVE_LIAN_DANFANG, this._refresh, this);
            this.homeLianZhiNeedLabel.string = "炼丹所需材料";
            this.homeDefaultDesrLabel.string = "　　修真之人通过各种秘法烧炼丹药，用来服食，以化为自身的灵气修为。\n　　而上品的丹药令人身安、命延，辅助渡劫、飞升。";
            this.stuHideChemarkTipLabel.string = "隐藏材料不足（和已经吃满的）的丹方";
        }//炼器
        else if (this.curBuildType == yx.CaveBuildType.QISHI) {
            yx.eventDispatch.addListener(yx.EventType.REFRESH_CAVE_LIAN_QISHI, this._refresh, this);
            this.homeLianZhiNeedLabel.string = "炼器所需材料";
            this.homeDefaultDesrLabel.string = "　　修真之人通过各种秘法炼制新的武器和法宝，或者把原来的武器和法宝功能增强，赋予新的神通。\n　　而上品的武器法宝于修真有益，在战斗时更是提升显著。";
            this.stuHideChemarkTipLabel.string = "隐藏材料不足的图纸";
        }

        this.homeShuXingRichText.string = "";

    },

    _onShow() {
        yx.caveMgr.reqMakeRoom(this.curBuildType);
    },
    /*
       *  关闭的时候把调度器关掉
       */
    _onHide() {
        this.homeTimeProBarWidget.unSchedule();
        yx.eventDispatch.removeListenersByTarget(this);
    },
    _refresh() {

        if (!yx.caveMgr.getCaveLianZhiData()) return;
        if (!yx.caveMgr.getCaveLianZhiData()[this.curBuildType]) return;

        this.lianZhiData = yx.caveMgr.getCaveLianZhiData()[this.curBuildType];

        if (!this.lianZhiData){
            cc.warn("炼制数据为null");
            return;
        }

        if (this.curBuildType == yx.CaveBuildType.QISHI){
            //器室没有数字数量条
            this.homeNumberWidget.node.active = false;
            // 炼丹师
            let qiDaoCfg = yx.cfgMgr.getRecordByKey("LianQiLevelConfig", {Level: this.lianZhiData["level"]});
            if (qiDaoCfg) {
                this.homeTitleLable.string = qiDaoCfg["Name"];
            }

            //设置是否自动匹配 ,默认开启
            let isAutoAdaptQi = yx.localStorage.Load(yx.LSKey.AUTO_ADAPT_QI);
            if (isAutoAdaptQi === null) isAutoAdaptQi = true;
            this.homeAutoChooseToggle.isChecked = isAutoAdaptQi;

            //设置是否隐藏，默认开启
            let isAutoHideQi = yx.localStorage.Load(yx.LSKey.AUTO_HIDE_QI);
            if (isAutoHideQi === null) isAutoHideQi = false;
            this.stuHideMarkNode.active = isAutoHideQi;
        }else {
            //锻造师
            let danDaoCfg = yx.cfgMgr.getRecordByKey("LianYaoLevelConfig", {Level: this.lianZhiData["level"]});
            if (danDaoCfg) {
                this.homeTitleLable.string = danDaoCfg["Name"];
            }

            //设置是否自动匹配 ,默认开启
            let isAutoAdaptDan = yx.localStorage.Load(yx.LSKey.AUTO_ADAPT_DAN);
            if (isAutoAdaptDan === null) isAutoAdaptDan = true;
            this.homeAutoChooseToggle.isChecked = isAutoAdaptDan;


            //设置是否隐藏，默认关闭
            let isAutoHideDan = yx.localStorage.Load(yx.LSKey.AUTO_HIDE_DAN);
            if (isAutoHideDan === null) isAutoHideDan = false;
            this.stuHideMarkNode.active = isAutoHideDan;
        }


        //设置丹炉
        this._updateDanLu();

        //设置当前炉的修炼时间
        //this._setMaxTime();

        //设置丹房、图纸数据
        this._updateDanFangOrTuzhi();

        this.homeShuXingRichText.string = "";

        //当前是炼制状态
        if (this.lianZhiData["curState"] == LIANZHI_STATE.ON_LIANZHI) {
            this.homeOnLianZhiNode.active = true;
            this.homeUnLianZhiNode.active = false;

            //检查是否炼制完成，显示炼制信息
            this._checkLianZhiFinish();

            let contentStr = "炼制丹药中";
            if (this.curBuildType == yx.CaveBuildType.QISHI){
                contentStr = "锻造器件中";
            }

            this.homeTimeProBarWidget.updateAndBegin("LianZhiPanel", this.lianZhiData, contentStr, this._lianZhiPregressCallBack.bind(this));
        }//非炼制状态
        else if (this.lianZhiData["curState"] == LIANZHI_STATE.UN_LIANZHI) {
            this.homeOnLianZhiNode.active = false;
            this.homeUnLianZhiNode.active = true;


            this.homeLianZhiNeedNode.active = true;
            this.homeLianZhiFinishNode.active = false;

            //强制终止
            this.homeTimeProBarWidget.unSchedule();
        }

        //当前配方
        let formulaItem = null;

        if (this.lianZhiData["curSelectFormulaId"]) {

            //获取配置信息,设置数值大小
            let formulaConfig = yx.cfgMgr.getRecordByKey(this._getFormulaConfigName(),{ID:this.lianZhiData["curSelectFormulaId"]});
            if (formulaConfig){
                let maxValue = this._calcuMaxValueCanLianZhi(formulaConfig);

                this.homeNumberWidget.init(maxValue <= 0?0:1, maxValue >=10?10:maxValue);
            }

            this.homeUnSelectLabel.node.active = false;

            formulaItem = formulaConfig;
            //_getFormulaConfigName

           /* //炼丹
            if (this.curBuildType == yx.CaveBuildType.DANFANG) {
                formulaItem = yx.cfgMgr.getRecordByKey("LianYaoFormulaConfig", {ID: this.lianZhiData["curSelectFormulaId"]});
            }//炼器
            else if (this.curBuildType == yx.CaveBuildType.QISHI) {
                formulaItem = yx.cfgMgr.getRecordByKey("LianQiFormulaConfig", {ID: this.lianZhiData["curSelectFormulaId"]});
            }*/

        }else{
            //默认值
            this.homeNumberWidget.init(1, 10);
        }

        //设置 所需材料、属性
        if (formulaItem) {
            //this.lianZhiData["maxTime"] = formulaItem;

            let costs = formulaItem["Cost"];
            //显示选中的item
            let itemId = formulaItem["ItemID"];
            let itemConfig = yx.cfgMgr.getRecordByKey("ItemConfig", {ID: itemId});

            //显示选中图片
            if (itemConfig.Icon != null && itemConfig.Icon.length > 0)
            {
                if (itemConfig.Type == yx.ItemType.EQUIP)
                {
                    yx.resUtil.LoadSpriteByType(itemConfig.Icon, yx.ResType.EQUIP, this.homeSelectItemSp);
                }
                else
                {
                    yx.resUtil.LoadSpriteByType(itemConfig.Icon, yx.ResType.ITEM, this.homeSelectItemSp);
                }
            }

            //成功率
            this._setSuccessRation();


            //遍历组件，显示3个所需材料
            for (let i = 0; i < this.homeItemWidgetArr.length; i++) {
                if (costs[i]) {
                    let ID = costs[i]["id"];
                    let ownNum = yx.bagMgr.getItemNum(ID);
                    let needNum = costs[i]["count"];
                    let content = this._setColor(ownNum, needNum, ownNum + "") + yx.colorUtil.AddColorString("/" + needNum, yx.colorUtil.TextWhite);
                    this.homeItemWidgetArr[i].node.active = true;
                    this.homeItemWidgetArr[i].init({ID: ID, content: content}, this._homeItemWidgetCallback.bind(this));
                } else {
                    this.homeItemWidgetArr[i].node.active = false;
                }
            }

            // 显示属性, 先查 itemConfig
            let subType = itemConfig["SubType"];
            if (subType == 0) {//非装备
                //属性 = DefDesc
                this.homeShuXingRichText.string = itemConfig["DefDesc"];
            } else {//装备
                let attrID = itemConfig["AttrID"];
                let equipConfig = yx.cfgMgr.getRecordByKey("EquipConfig", {ID: attrID});
                let attrpower = equipConfig["attrpower"];
                let shuXingStr = "";
                for (let i in attrpower) {
                    let name = yx.textDict.Attr[attrpower[i]["type"]];
                    shuXingStr += (name + "  " + attrpower[i]["value"][0] + "~" + attrpower[i]["value"][1] + "\n");
                }

                this.homeShuXingRichText.string = shuXingStr;
            }

        }

        //匹配模式，不能滑动
        this.homeScrollViewBlockNode.active = this.homeAutoChooseToggle.isChecked;

        //正在炼制中，不能滑动
        if (this.lianZhiData && this.lianZhiData["curState"] === LIANZHI_STATE.ON_LIANZHI){
            this.homeScrollViewBlockNode.active = true;
        }

    },

    _setSuccessRation(){
        if (this.lianZhiData["curSelectFormulaId"]) {
            let formulaConfig = yx.cfgMgr.getRecordByKey(this._getFormulaConfigName(),{ID:this.lianZhiData["curSelectFormulaId"]});
            if (formulaConfig){
                let formulaPinZhi = formulaConfig["PinZhi"]; //配方品质
                let luziPinZhi =  this._getCurSelectLuPinZhi();//炉子的品质
                if (luziPinZhi){
                    this.homeSuccessRatioLabel.node.active = true;

                    let sucRadio = this._calcuSuccessRatio(luziPinZhi,formulaPinZhi);

                    this.homeSuccessRatioLabel.string = "成功率:"+sucRadio+"%";
                    /*let offsetPinZhi = formulaPinZhi - luziPinZhi;
                    offsetPinZhi = offsetPinZhi < 0 ? 0 : offsetPinZhi;// 若小于0，说明炉子高级。说明是百分百

                    let ratioCfg = yx.cfgMgr.getRecordByKey(this._getFormulaRateConfigName(),{ID:offsetPinZhi});
                    if (ratioCfg){

                    }*/
                }
            }
        }
    },

    //计算成功率
    _calcuSuccessRatio(luZiPinZhi,formulaPinZhi){
        let offsetPinZhi = formulaPinZhi - luZiPinZhi;
        offsetPinZhi = offsetPinZhi < 0 ? 0 : offsetPinZhi;// 若小于0，说明炉子高级。说明是百分百
        let ratioCfg = yx.cfgMgr.getRecordByKey(this._getFormulaRateConfigName(),{ID:offsetPinZhi});
        if (ratioCfg){
            return (parseInt(ratioCfg["Rate"])/100);
        }
        return "0";

    },

    //设置炼炉
    _updateDanLu(){//LianLu0 -> LianLuN

        if (this.initDanLu){return;}

        this.initDanLu = true;

        this.homeLayout.node.removeAllChildren(true);

        let len = this.lianZhiData["machine"].length;

        if (len <= 0){return}

        //首部给一个辅助的空item
        yx.LianLuItem.CreateItemSlot({},this.homeLayout.node,"LianLu0");

        //主内容,注意此machine 对应于品质
        let lianLuConfigName = "LianQiLuConfig";
        if (this.curBuildType == yx.CaveBuildType.DANFANG) {
            lianLuConfigName = "LianYaoLuConfig";
        }

        for (let i = 0; i < len ; i ++){
            let lianLu = yx.cfgMgr.getRecordByKey(lianLuConfigName,{PinZhi:this.lianZhiData["machine"][i]});
            if (lianLu){
                let resCfg = yx.cfgMgr.getRecordByKey("ResConfig",{ID:lianLu["Icon"]});
                if (resCfg){
                    yx.LianLuItem.CreateItemSlot({"Icon":resCfg["Head"]},this.homeLayout.node,"LianLu"+(i+1));
                }
            }
        }

        //尾部给一个辅助的空item
        yx.LianLuItem.CreateItemSlot({},this.homeLayout.node,"LianLu"+(len + 1));

        //目前正在炼制
        if (this.lianZhiData && (this.lianZhiData["curState"] == yx.LianZhiPanel.LIANZHI_STATE.ON_LIANZHI)){
            this._setCurLu(this.lianZhiData["curMakeMachinePinZhi"]);//
        }//自动选炉，且目前选择了丹方、
        else if (this.homeAutoChooseToggle.isChecked && this.lianZhiData["curSelectFormulaId"]){
            //自动匹配
            this._autoSelectLu();
        }else {
            //默认到第一个
            this.homeScrollView.scrollToOffset(cc.v2(0, 0), 0.1);
        }

    },
    //设置当前炉为指定炉
    _setCurLu(pinzhi){
        if (!pinzhi) return;

        let index = pinzhi - 1;
        if (index < 0){
            return;
        }
        this.node.runAction(cc.sequence(cc.delayTime(0.1),cc.callFunc(function () {
            this.homeScrollView.scrollToOffset(cc.v2(LayoutPerWidth*index, 0), 0.1);
        }.bind(this))));
    },

    //自动选炉
    _autoSelectLu(){
        if (!this.lianZhiData|| !this.lianZhiData["machine"])  return;
        if (!this.homeAutoChooseToggle.isChecked)  return;

        let formulaConfig = yx.cfgMgr.getRecordByKey(this._getFormulaConfigName(),{ID:this.lianZhiData["curSelectFormulaId"]});
        if (formulaConfig){
            let pinzhi = formulaConfig["PinZhi"];//当前选中炼制的品质

            let maxRadio = 0;
            let index = 0;
            //我们拥有的品质
            for (let i = 0; i < this.lianZhiData["machine"].length; i ++){
                let sucRadio = this._calcuSuccessRatio(this.lianZhiData["machine"][i],pinzhi);
                if (sucRadio > maxRadio){
                    maxRadio = sucRadio;
                    index = i;
                }
            }

            //由于layout正在处于布局状态，layout的contentsize会发生变化。所以这里延迟一会在操作；
            this.node.runAction(cc.sequence(cc.delayTime(0.1),cc.callFunc(function () {
                this.homeScrollView.scrollToOffset(cc.v2(LayoutPerWidth*index, 0), 0.1);
            }.bind(this))));
            //let layoutPerWidth = this.homeLayout.node.getContentSize().width / this.homeLayout.node.childrenCount;
        }
    },


    _initScrollview() {
        //距离scrollview中心最近的相关数据[ui里面必须得有第一个和最后一个"空"的辅助item,而这里的min数据是不包含第一个与最后一个的]
        this.minDisNodeData = null;

        this.homeScrollView.node.on('scrolling', function (event) {
            if (this.homeLayout.node.childrenCount <= 0){
                return;
            }
            /*if (this.lianZhiData && this.lianZhiData["curState"] === LIANZHI_STATE.ON_LIANZHI){
                return;//正在炼制中，不能滑动
            }
            if (this.homeAutoChooseToggle.isChecked ){
                return;//当前是匹配模式，不能滑动
            }*/

            //获取所有子节点
            let childrens = this.homeLayout.node.children;
            //获取距离中心最近的节点信息
            this.minDisNodeData = this._getMinDisNodeData(this.homeScrollView.node, childrens);
            this._setNodeByDistance(this.minDisNodeData.minDis,this.minDisNodeData.minNode);
            //cc.log(" 最近的Node距离中心：" + this.minDisNodeData.minDis);

            //前一个node
            let preNode = this.homeLayout.node.getChildByName("LianLu"+(this.minDisNodeData.index - 1));
            let preNodeDisData = this._getDistance(preNode,this.homeScrollView.node);//minDis
            this._setNodeByDistance(preNodeDisData.minDis,preNode);

            //后一个node
            let nextNode = this.homeLayout.node.getChildByName("LianLu"+(this.minDisNodeData.index + 1));
            let nextNodeDisData = this._getDistance(nextNode,this.homeScrollView.node);//minDis
            this._setNodeByDistance(nextNodeDisData.minDis,nextNode);

            this._setLianLuName();
            this._setLianLuEffect();
        }, this);


        this.homeScrollView.node.on("touchend", function (event) {
            if (this.homeLayout.node.childrenCount <= 0){
                return;
            }

            let moveOffset = this._calcuCurMoveOffset();

            if (moveOffset){
                //跳到到目标位置
                this.homeScrollView.scrollToOffset(moveOffset, 1.5);
            }
        }, this);
        this.homeScrollView.node.on("touchcancel", function (event) {
            if (this.homeLayout.node.childrenCount <= 0){
                return;
            }

            let moveOffset = this._calcuCurMoveOffset();

            if (moveOffset){
                //跳到到目标位置
                this.homeScrollView.scrollToOffset(moveOffset, 1.5);
            }
        }, this);
        //--------------
    },

    /**
     * 设置精度条最大时间
     * @private
     */
    /*_setMaxTime(){
        this.lianZhiData["maxTime"] = -1;
        let pinzhi = this._getCurSelectLuPinZhi();
        if (pinzhi){
            let lianLuConfigName = "LianQiLuConfig";
            if (this.curBuildType == yx.CaveBuildType.DANFANG) {
                lianLuConfigName = "LianYaoLuConfig";
            }

            let lianLu = yx.cfgMgr.getRecordByKey(lianLuConfigName,{PinZhi:pinzhi});
            if (lianLu){
                this.lianZhiData["maxTime"] = lianLu["MakeTime"];
            }
        }
    },*/

    //获取当前炉的品质
    _getCurSelectLuPinZhi(){
        if (!this.minDisNodeData || !this.minDisNodeData["index"]) return;
        if (!this.lianZhiData|| !this.lianZhiData["machine"])  return;

        let curIndex = this.minDisNodeData["index"];
        let machineArr = this.lianZhiData["machine"];
        if ( curIndex  && machineArr && machineArr[curIndex-1]){
            return machineArr[curIndex-1];
        }
    },

    /**
     * 设置丹炉名称
     * @private
     */
    _setLianLuName(){
        if (!this.minDisNodeData || !this.minDisNodeData["index"]) return;
        if (!this.lianZhiData|| !this.lianZhiData["machine"])  return;

        let curIndex = this.minDisNodeData["index"];
        let machineArr = this.lianZhiData["machine"];
        if ( curIndex  && machineArr && machineArr[curIndex-1]){
            let pinZhi = machineArr[curIndex-1];
            let luName = this.curBuildType == yx.CaveBuildType.QISHI?"{pinZhi}品器鼎":"{pinZhi}品丹炉";
            if (pinZhi >= 10){
                luName = this.curBuildType == yx.CaveBuildType.QISHI?"{pinZhi}品神器鼎":"{pinZhi}品神丹炉";
                pinZhi -= 9;
            }
            this.homeLianLuName.node.parent.active = true;
            let finalLuName = luName.format({pinZhi:yx.textDict.ChineseNum[pinZhi]});

            //名字变更，修改成功率
            if (this.homeLianLuName.string != finalLuName){
                this._setSuccessRation();
            }
            this.homeLianLuName.string = finalLuName;


        }
    },
    /**
     * 设置丹炉特效
     * @private
     */
    _setLianLuEffect(){
        if (!this.minDisNodeData || !this.minDisNodeData["index"]) return;
        if (!this.lianZhiData|| !this.lianZhiData["machine"])  return;

        return;//不知道啥时候显示特效，先隐藏

        let curLuZiNode = this.homeLayout.node.getChildByName("LianLu"+this.minDisNodeData.index);
        if (curLuZiNode){
            let eff = curLuZiNode.getChildByName(this.luZiEffectPrafab.name);
            if (eff){return;}
            /*let luZiNodes = curLuZiNode.children.filter(node => node.name == this.luZiEffectPrafab.name);
            luZiNodes.forEach(node => {
                node.removeFromParent(true);
            });*/

            let luZiEffect = cc.instantiate(this.luZiEffectPrafab);
            curLuZiNode.addChild(luZiEffect,1);
            luZiEffect.y = 10;
        }
    },


    _onHomePreBtnClick(){
        if (this.homeLayout.node.childrenCount <= 0){
            return;
        }
        //匹配模式不能动
        if (this.homeAutoChooseToggle.isChecked){
            return ;
        }

        //每一个item的宽
        //let layoutPerWidth = this.homeLayout.node.getContentSize().width / this.homeLayout.node.childrenCount;

        let index = this.minDisNodeData.index -2;

        if (index < 0 ){//拉到了后面
            return null;
        }
        this.homeScrollView.scrollToOffset(cc.v2(LayoutPerWidth * index, 0), 1.5);

    },
    _onHomeNextBtnClick(){
        if (this.homeLayout.node.childrenCount <= 0){
            return;
        }

        //匹配模式不能动
        if (this.homeAutoChooseToggle.isChecked){
            return ;
        }
        //每一个item的宽
        //let layoutPerWidth = this.homeLayout.node.getContentSize().width / this.homeLayout.node.childrenCount;

        let index = this.minDisNodeData.index ;

        if (index > this.homeLayout.node.childrenCount - 3){//拉到了后面
            return null;
        }
        this.homeScrollView.scrollToOffset(cc.v2(LayoutPerWidth * index, 0), 1.5);

    },



    _calcuCurMoveOffset(){
        if (this.homeLayout.node.childrenCount <= 0){
            return;
        }
        if (!this.minDisNodeData) return ;
        //每一个item的宽
        //let layoutPerWidth = this.homeLayout.node.getContentSize().width / this.homeLayout.node.childrenCount;

        let index = this.minDisNodeData.index - 1;

        /*if ((index < 0) || (index > (this.homeLayout.node.childrenCount - 3))) {
            //scrollview自动回弹
            return;
        }*/

        if ((index <= 0) && (this.minDisNodeData.minOriginDis >= 0)){//拉到了前面
            //scrollview自动回弹
            return null;
        }

        if ((index >= this.homeLayout.node.childrenCount - 3) && (this.minDisNodeData.minOriginDis <= 0)){//拉到了后面
            //scrollview自动回弹
            return null;
        }

        return cc.v2(LayoutPerWidth * index, 0);
    },

    _setNodeByDistance(minDis,node){
        if (!node) return;

        let radio = 0.7;
        //获取距离中心最近的节点
        let scale = (160 - minDis) / 100;
        if (scale <= 0.8) {
            scale = 0.8
        }


        node.setScale(scale * radio);
        //cc.log("_setNodeByDistance:"+scale);

    },

    _getDistance(node1, targetNode) {
        if (!node1) return;
        if (!targetNode) return;

        var position1 = node1.convertToWorldSpaceAR(cc.v2(0, 0));
        var position2 = targetNode.convertToWorldSpaceAR(cc.v2(0, 0));
        // var dx = Math.abs(position1.x - position2.x);
        // var dy = Math.abs(position1.y - position2.y);
        //return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        return {
            minDis : Math.abs(position1.x - position2.x),
            minOriginDis:(position1.x - position2.x)
        };
    },


    /**
     * targetNode 参照node
     * @param targetNode
     * @param nodes
     * @private
     */
    _getMinDisNodeData(targetNode, nodes) {
        if (!targetNode) return;
        if (!nodes) return;

        let minDis = 100000000;
        let index = -1;
        let minNode = null;
        let minOriginDis = 100000000;

        for (let i in nodes) {
            //首尾不参与比较，而ui里面必须包含一头一尾
            if (i == 0 || i == nodes.length - 1) continue;

            let disanceData  = this._getDistance(nodes[i],targetNode);
            if (disanceData.minDis < minDis) {
                minDis = disanceData.minDis;
                minOriginDis = disanceData.minOriginDis;
                index = parseInt(i);
                minNode = nodes[i];
            }
        }
        //因为去掉了首位，那么这里返回的index必然不是 0 与 最后一个。此Index的数值对应于layout内的 item0 item1 item2 ..
        return {index:index,minNode:minNode,minDis:minDis,minOriginDis:minOriginDis};
    },


    //所需材料点击回调
    _homeItemWidgetCallback(itemCfg) {
        let args = {};
        //传入Item 的id
        args.ID = itemCfg["ID"];
        //设置itemDetailShowPanel显示方式
        args.showType = yx.ItemDetailShowPanel.SHOW_TYPE_SIMPLE;
        //打开
        yx.windowMgr.showWindow("itemDetailShowPanel", args);
    },

    //
    _setColor(ownNum, needNum, Str) {
        if (ownNum >= needNum) {
            return yx.colorUtil.AddColorString(Str, yx.colorUtil.TextGreen);
        }
        return yx.colorUtil.AddColorString(Str, yx.colorUtil.TextRed);

    },

    //更新丹房、图纸、
    _updateDanFangOrTuzhi(){
        //instructions
        //这个指的是 LianQiFormulaConfig LianYaoFormulaConfig 两个炼器炼药图纸的ID

        let instructions = this.lianZhiData["instructions"];
        //按品质整理
        let infos = {};

        for (let i = 0; i < instructions.length; i ++){
            let formulaConfig = yx.cfgMgr.getRecordByKey(this._getFormulaConfigName(),{ID:instructions[i]});
            if (formulaConfig){
                let itemConfig = yx.cfgMgr.getRecordByKey("ItemConfig",{ID:formulaConfig["ItemID"]});
                if (itemConfig){

                    let pinzhi = formulaConfig["PinZhi"];
                    let namePinZhi = pinzhi;
                    let formulaName = this.curBuildType === yx.CaveBuildType.DANFANG?"{pinZhi}品丹方":"{pinZhi}品方图纸";
                    if (pinzhi >= 10){
                        formulaName = this.curBuildType === yx.CaveBuildType.DANFANG?"仙{pinZhi}品丹方":"仙{pinZhi}品方图纸";
                        namePinZhi = pinzhi - 9;
                    }

                    let item = {};
                    item["id"] = formulaConfig["ID"];
                    item["name"] = itemConfig["Name"];
                    //丹方需要显示数量
                    item["showNum"] = this.curBuildType === yx.CaveBuildType.DANFANG?true:false;
                    item["num"] = this._calcuMaxValueCanLianZhi(formulaConfig);//当前自身的材料，最多能制造多少个
                    item["isEatFull"] = this.curBuildType === yx.CaveBuildType.DANFANG?yx.playerMgr.checkDanYaoIsEatFull(item["id"]):false;//丹方是否已经吃满了
                    if (infos[pinzhi]) {
                        infos[pinzhi]["items"].push(item);
                    } else {
                        infos[pinzhi] = {};
                        infos[pinzhi]["title"] = formulaName.format({pinZhi:yx.textDict.ChineseNum[namePinZhi]});
                        infos[pinzhi]["showType"] = yx.LianZhiItem.SHOW_TYPE.BAR;
                        infos[pinzhi]["items"] = [];
                        infos[pinzhi]["items"].push(item);
                    }
                }
            }
        }
        //丹房、图纸信息
        this.danfangOrTuzhis = infos;
    },

    //计算当前自身的材料，最多能炼制多少个
    _calcuMaxValueCanLianZhi(formulaConfig){
        let costs = formulaConfig["Cost"];
        //每一种材料，最大能炼制的数量集合。
        let canLianZhiNumArr = [];
        for (let i = 0; i < costs.length; i ++){
            let itemPerCost = costs[i]["count"];
            let itemId = costs[i]["id"];
            let ownItemNum = yx.bagMgr.getItemNum(itemId);
            let canLianZhiNum = Math.floor(ownItemNum / itemPerCost);// 得到可炼制的
            canLianZhiNumArr.push(canLianZhiNum);
        }
        //取最小的炼制数值
        return Math.min.apply(Math,canLianZhiNumArr);
    },

    //首页的选择按钮
    _onHomeSelectBtnClick() {

        if (this.lianZhiData && (this.lianZhiData["curState"] == yx.LianZhiPanel.LIANZHI_STATE.ON_LIANZHI)){
            yx.ToastUtil.showListToast("正在炼制中");
            return;
        }

        this.selectDanFangNode.active = true;

        this._showFormula(this.danfangOrTuzhis);

       /* this.stuLayout.node.removeAllChildren(true);

        for (let i in this.danfangOrTuzhis){
            yx.LianZhiItem.CreateItem(this.danfangOrTuzhis[i], this.stuLayout.node, "danfang" + i, this.onSelectStuffItem.bind(this));
        }*/
    },

    //显示 图纸
    _showFormula(danfangOrTuzhis){
        this.stuLayout.node.removeAllChildren(true);

        for (let i in danfangOrTuzhis){
            yx.LianZhiItem.CreateItem(danfangOrTuzhis[i], this.stuLayout.node, "danfang" + i, this.onSelectStuffItem.bind(this),this.stuHideMarkNode.active);
        }
    },


    //图鉴按钮 点击
    _onHomeTuJianBtnClick() {
        if (this.lianZhiData && (this.lianZhiData["curState"] == yx.LianZhiPanel.LIANZHI_STATE.ON_LIANZHI)){
            yx.ToastUtil.showListToast("正在炼制中");
            return;
        }

        this.tuJianPageNode.active = true;

        this.tuJianLayout.node.removeAllChildren(true);

        let allConfigMap = null;
        if (this.curBuildType == yx.CaveBuildType.DANFANG) {
            allConfigMap = yx.cfgMgr.getAllConfig("LianYaoFormulaConfig");
        } else {
            allConfigMap = yx.cfgMgr.getAllConfig("LianQiFormulaConfig");
        }

        if (!allConfigMap) return;


        //这个指的是 LianQiFormulaConfig LianYaoFormulaConfig 两个炼器炼药图纸的ID
        let instructions = this.lianZhiData["instructions"];

        //按品质整理

        let infos = {};
        for (let value of allConfigMap.values()) {
            let pinzhi = value["PinZhi"];
            let namePinZhi = pinzhi;
            let item = {};
            item["id"] = value["ID"];
            item["itemId"] = value["ItemID"];
            item["own"] = false;
            if (instructions){
                for (let i = 0;i < instructions.length; i ++){
                    if (instructions[i] == value["ID"]){
                        item["own"] = true;//以获取
                    }
                }
            }

            item["sortTop"] = value["SortTop"];
            item["pinzhi"] = pinzhi;

            let nameEnd = this.curBuildType === yx.CaveBuildType.DANFANG?"{pinZhi}品丹方":"{pinZhi}品图纸";
            if (pinzhi >= 10){
                nameEnd = this.curBuildType === yx.CaveBuildType.DANFANG?"仙{pinZhi}品丹方":"仙{pinZhi}品图纸";
                namePinZhi = pinzhi - 9;
            }

            if (infos[pinzhi]) {
                infos[pinzhi]["items"].push(item);
            } else {
                infos[pinzhi] = {};
                infos[pinzhi]["title"] = nameEnd.format({pinZhi:yx.textDict.ChineseNum[namePinZhi]});
                infos[pinzhi]["showType"] = yx.LianZhiItem.SHOW_TYPE.TUJIAN;
                infos[pinzhi]["items"] = [];
                infos[pinzhi]["items"].push(item);
            }
        }


        for (let i in infos) {
            let items = infos[i]["items"];
            //按sortTop排序
            items.sort(this.sort);
            //创建
            yx.LianZhiItem.CreateItem(infos[i], this.tuJianLayout.node, "tujian" + i, this.onTuJianStuffItem.bind(this));

        }

    },

    //关闭选中框
    _onStuCloseBtnClick() {
        this.selectDanFangNode.active = false;
    },

    //关闭选中框
    _onTuJianCloseBtnClick() {
        this.tuJianPageNode.active = false;
    },

    //
    _onHomeCloseBtnClick() {
        yx.windowMgr.goBack();
    },

    //首页开始炼制按钮
    _onHomeBeginTiaoZhiBtnClick() {

        if (!this.lianZhiData){return}

        if (!this.lianZhiData["curSelectFormulaId"]){
            if (this.curBuildType == yx.CaveBuildType.DANFANG){
                yx.ToastUtil.showListToast("请先选择丹方");
            }else{
                yx.ToastUtil.showListToast("请先选择图纸");
            }
            return;
        }

        let own = false;
        //这个指的是 LianQiFormulaConfig LianYaoFormulaConfig 两个炼器炼药图纸的ID
        let instructions = this.lianZhiData["instructions"];
        if (instructions){
            for (let i = 0;i < instructions.length; i ++){
                if (instructions[i] == this.lianZhiData["curSelectFormulaId"]){
                    own = true;
                    break;
                }
            }
        }

        if (!own){
            yx.ToastUtil.showListToast("未拥有此配方");
            return;
        }

        let formulaConfig = yx.cfgMgr.getRecordByKey(this._getFormulaConfigName(),{ID:this.lianZhiData["curSelectFormulaId"]});
        if (formulaConfig){
            let maxValue = this._calcuMaxValueCanLianZhi(formulaConfig);
            if (maxValue <= 0){
                yx.ToastUtil.showListToast("材料不足");
                return;
            }
        }


        let pinzhi =  this._getCurSelectLuPinZhi();
        if (pinzhi){
            yx.caveMgr.reqMakeTreasure(this.curBuildType,this.lianZhiData["curSelectFormulaId"],pinzhi,this.homeNumberWidget.getCurNum());
        }

    },

    _getFormulaConfigName(){
        let formulaConfigName = "LianQiFormulaConfig";
        if (this.curBuildType == yx.CaveBuildType.DANFANG) {
            formulaConfigName = "LianYaoFormulaConfig";
        }
        return formulaConfigName;
    },
    _getFormulaRateConfigName(){
        let formulaRateConfigName = "LianQiRateConfig";
        if (this.curBuildType == yx.CaveBuildType.DANFANG) {
            formulaRateConfigName = "LianYaoRateConfig";
        }
        return formulaRateConfigName;
    },
    //领取
    _onHomeLingQuZhiBtnClick(){
        yx.caveMgr.reqTakeTreasure(this.curBuildType);
    },
    _onHomeAutoChooseToggleClick(event){
        if (!this.lianZhiData) return;

        //this.homeAutoChooseToggle.isChecked = event.isChecked;

        if (this.curBuildType == yx.CaveBuildType.QISHI){
            yx.localStorage.Save(yx.LSKey.AUTO_ADAPT_QI, this.homeAutoChooseToggle.isChecked);
        }else {
            yx.localStorage.Save(yx.LSKey.AUTO_ADAPT_DAN, this.homeAutoChooseToggle.isChecked);
        }

        //匹配的时候显示阻板
        this.homeScrollViewBlockNode.active = this.homeAutoChooseToggle.isChecked;

        this._autoSelectLu();
    },
    //丹方吃满过滤
    _onStuHideStuffBtnClick(event){
        if (!this.lianZhiData) return;

        this.stuHideMarkNode.active = !this.stuHideMarkNode.active;

        if (this.curBuildType == yx.CaveBuildType.QISHI){
            yx.localStorage.Save(yx.LSKey.AUTO_HIDE_QI, this.stuHideMarkNode.active);
        }else {
            yx.localStorage.Save(yx.LSKey.AUTO_HIDE_DAN,this.stuHideMarkNode.active);
        }

        this._showFormula(this.danfangOrTuzhis);
    },

    //首页终止炼制按钮
    _onHomeEndTiaoZhiBtnClick() {
        let arg = {};
        arg.content = "强制终止会导致炼制失败，并且会失去所有的炼制材料。确认要终止吗？";
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "LianZhiPanel";
        clickEventHandler.handler = "_onEndTiaoZhiConfirmBtnClick";
        arg.confirmCallback = clickEventHandler;
        yx.windowMgr.showWindow("textConfirm", arg);

    },

    //停止调制
    _onEndTiaoZhiConfirmBtnClick() {
        if (!this.lianZhiData){return}

        yx.caveMgr.reqStopMake(this.curBuildType);
        //与服务器交互，改变状态
        //this._refresh();
    },

    sort: function (a, b) {
        if (a.sortTop < b.sortTop) {
            return -1;
        } else if (a.sortTop == b.sortTop) {
            return 0;
        } else {
            return 1;
        }
    },
    onTuJianStuffItem(itemInfo) {
        //关闭窗口
        this.tuJianPageNode.active = false;
        //
        this.lianZhiData["curSelectFormulaId"] = itemInfo.id;//注意 itemId 与 id ，对应于LianYaoFormula

        this._autoSelectLu();

        this._refresh();
    },

    _lianZhiPregressCallBack(timeProBarWidgetSrc, data) {
        cc.log("_lianZhiPregressCallBack进度定时器的回调");

        data.curTime -= 1;

        timeProBarWidgetSrc.refresh(data.curTime, data.maxTime);

        if (data.curTime <= 0) {

            //得到结果
            yx.ToastUtil.showSimpleToast("炼制完毕", yx.windowMgr.getCurWindowOrPanel());

            //结束调度
            timeProBarWidgetSrc.unSchedule();

            //重置状态
            //data.curState = yx.ShuGeWindow.SHUGE_STATE.UN_BEGIN;

            //this._checkLianZhiFinish();
            //刷新界面
            this._refresh();

        }
    },

    //检查是否炼制完成
    _checkLianZhiFinish(){
        //炼制完成
        if (this.lianZhiData["curTime"] <= 0){
            this.homeLianZhiNeedNode.active = false;
            this.homeLianZhiFinishNode.active = true;
            this.homeRunningNode.active = false;
            this.homeFinishNode.active = true;
            let formulaConfig = yx.cfgMgr.getRecordByKey(this._getFormulaConfigName(),{ID:this.lianZhiData["curSelectFormulaId"]});
            if (formulaConfig){
                let content = yx.colorUtil.AddColorString(this.lianZhiData["makeCount"], yx.colorUtil.TextWhite);
                this.homeFinishItemWidget.init({ID: formulaConfig["ItemID"], content: content}, this._homeItemWidgetCallback.bind(this));
            }

            //
            if (this.curBuildType == yx.CaveBuildType.QISHI){
                this.homeFinishRichText.string = "炼器成功"+this.lianZhiData["succCount"]+"次，失败"+(this.lianZhiData["makeCount"]-this.lianZhiData["succCount"])+"次";
                return;
            }

            //炼丹
            this.homeFinishRichText.string = "炼丹成功"+this.lianZhiData["succCount"]+"次，失败"+(this.lianZhiData["makeCount"]-this.lianZhiData["succCount"])+"次";

            //succCount

        }else{
            this.homeLianZhiNeedNode.active = true;
            this.homeLianZhiFinishNode.active = false;

            this.homeRunningNode.active = true;
            this.homeFinishNode.active = false;
        }
    },



    //当选中具体的丹方的时候，进行的回调  {name:"金源丹",num :800,itemId:j}
    onSelectStuffItem(itemInfo) {

        //关闭窗口
        this.selectDanFangNode.active = false;

        this.lianZhiData["curSelectFormulaId"] = itemInfo.id;

        this._autoSelectLu();

        this._refresh();


    },

});

yx.LianZhiPanel = module.exports = LianZhiPanel;