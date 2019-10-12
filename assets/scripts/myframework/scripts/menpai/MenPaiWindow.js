
const BaseWindow = require('BaseWindow');
const MenPaiTaskScrollItem = require("MenPaiTaskScrollItem");

// 门派最小星数
const _minStar = 1;
// 门派最大星数
const _maxStar = 9;

// 第一次点击交谈时间
let firstTime = 0;
// 交谈按钮点击次数
let clickCount = 0;
// 第一次点击切磋时间
let qcfirstTime = 0
// 点击切磋次数
let qcclickCount = 0

/**
 * !#zh 交互类型 1 交谈 ，2 请安 ， 3 切磋 ，4 学习功法， 5 兑换， 6 提升职位，7 赠礼
 * @enum JiaoHuType
 */
const JiaoHuType = cc.Enum({
    /**
     * !#zh 1 交谈
     *@property {Number} JIAOTAN
     */
    JIAOTAN: 1,
    /**
     * !#zh 2 请安
     *@property {Number} QINGAN
     */
    QINGAN: 2,
    /**
     * !#zh 3 切磋
     *@property {Number} QIECUO
     */
    QIECUO: 3,
    /**
     * !#zh 4 学习功法
     *@property {Number} XUEXI
     */
    XUEXI: 4,
    /**
     * !#zh 5 兑换
     *@property {Number} DUIHUAN
     */
    DUIHUAN: 5,
    /**
     * !#zh 6 提升职位
     *@property {Number} TISHENG
     */
    TISHENG: 6,
    /**
     * !#zh 7 赠礼
     *@property {Number} ZENGLI
     */
    ZENGLI: 7,
});

/**
 * !#zh 标签类型 1 门派 ，2 练功 ， 3 任务 ，4 门派详情
 * @enum TabType
 */
const TabType = cc.Enum({
    /**
     * !#zh 1 门派
     *@property {Number} TAB1
     */
    TAB1: 1,
    /**
     * !#zh 2 练功
     *@property {Number} TAB2
     */
    TAB2: 2,
    /**
     * !#zh 3 任务
     *@property {Number} TAB3
     */
    TAB3: 3,
    /**
     * !#zh 4 门派详情
     *@property {Number} TAB4
     */
    TAB4: 4,
});


cc.Class({
    extends: BaseWindow,

    properties: {

        // 加入门派前的界面------------------------------------
        selectMenPaiGroup:      cc.Node,
        //标题区
        weiwangValueLabel:      cc.Label, 
        // 左右翻页
        leftBtn:                cc.Button,
        rightBtn:               cc.Button,
        // 选择几星门派按钮
        sureBtn:                cc.Button,
        // 宗派描述
        descRichText:           cc.RichText,
        // 几星门派字体
        starGroup:              cc.Node,


        // 存放几星门派字体UI的数组
        _starNodeArray:          null,
        //当前选的几星门派
        _curStar:                Number,

        // 加入门派后的界面------------------------------------
        menPaiGroup:            cc.Node,
        //标题区
        gongxianValueLabel:     cc.Label,
        // 门派按钮
        menpaiTabBtn:           cc.Button,
        // 练功房按钮
        liangongfangTabBtn:     cc.Button,
        // 任务按钮
        renwuTabBtn:            cc.Button,
        // 门派详情按钮
        menpaixiangqingTabBtn:  cc.Button,
        // 门派页面
        menpaiContent:          cc.Node,
        // 练功房页面
        liangongfangContent:    cc.Node,
        // 任务页面
        renwuContent:           cc.Node,
        // 门派详情页面
        menpaixiangqingContent: cc.Node,

        // 当前标签页
        _curTab:                Number,
        // 标签按钮数组
        _tabArray:              null,
        // 标签页面数组
        _tabContentArray:       null,


        // 门派页面----------------------------------------------
        fengluBtn:              cc.Button,
        tiaozhanBtn:            cc.Button,
        panjiao:                cc.Button,
        jiaohuBtn1:             cc.Button,
        jiaohuBtn2:             cc.Button,
        jiaohuBtn3:             cc.Button,
        jiaohuBtn4:             cc.Button,
        jiaohuBtn5:             cc.Button,
        headScrollContent:      cc.Node,
        npcName:                cc.Label,
        npcZhiWu:               cc.Label,
        npcDesc:                cc.RichText,
        logRichText:            cc.RichText,
        logScrollView:          cc.ScrollView,

        // 练功房页面--------------------------------------------
        liangongDesc:           cc.RichText,

        costRichText:           cc.RichText,
        liangongBtn:            cc.Button,
        liangongGroup:          cc.Node,
        liangongProgressGroup:  cc.Node,
        liangongProgress:       cc.ProgressBar,
        liangongTime:           cc.Label,

        zhangmenLiangongBtn:    cc.Button,
        zhangmenLiangongProgressGroup:  cc.Node,
        zhangmenLiangongProgress: cc.ProgressBar,
        zhangmenliangongTime:     cc.Label,


        // 任务页面----------------------------------------------
        scrollContent:          cc.Node,
        menPaiTaskItemPrefab:   cc.Prefab,
        renwuTitleLabel:        cc.Label,

        // 门派详情页面------------------------------------------
        menpaiNameLabel:        cc.Label,
        menpaiDescRichText:     cc.RichText,
        dailiGroup:             cc.Node,
        dailiZhangmenSp:        cc.Sprite,
        dailiZhangmenLabel:     cc.Label,        
    },

    _onInit(){

        yx.eventDispatch.addListener(yx.EventType.MENPAI_ADD_DAIRY_LOG, this.onAddDairyLog, this);
        yx.eventDispatch.addListener(yx.EventType.MENPAI_INFO_REFRESH, this.onInfoRefresh, this);
        yx.eventDispatch.addListener(yx.EventType.CURRENCY_CHANGE, this.onEventCurrencyChange, this);
        yx.eventDispatch.addListener(yx.EventType.MENPAI_TASK_REFRESH, this.onTaskReFreshTime, this);
        yx.eventDispatch.addListener(yx.EventType.MENPAI_LIANGONG_REFRESH, this.onLianGongRefresh, this);
        yx.eventDispatch.addListener(yx.EventType.MENPAI_PK_SHOW, this.onPKShow, this);
        yx.eventDispatch.addListener(yx.EventType.DAOLV_ERROR_TIP, this.onDaoLvEventErrorTip, this);

        this.descRichText.string = "人间修真炼道之人，多如江之鲫，数不胜数。又以神州浩土之广阔，人间奇人异士之多，"+
        "故修炼之道林林总总，俱不相同。";

        this._starNodeArray = [];
        for(let i = 0 ; i < _maxStar ;i++)
        {
            let star = this.starGroup.getChildByName("Star"+ (i+1) +"Sp")
            this._starNodeArray[i] = star;
        }
        this.leftBtn.node.on('click', this.onLeftBtnClick, this);
        this.rightBtn.node.on('click', this.onRightBtnClick, this);
        this.sureBtn.node.on('click', this.onSureBtnClick, this);


        this._tabArray = [this.menpaiTabBtn,this.liangongfangTabBtn,this.renwuTabBtn,this.menpaixiangqingTabBtn];
        this._tabContentArray = [this.menpaiContent,this.liangongfangContent,this.renwuContent,this.menpaixiangqingContent];

        this.menpaiTabBtn.node.on('click', this.onMenpaiTabClick, this);
        this.liangongfangTabBtn.node.on('click', this.onLiangongfangTabClick, this);
        this.renwuTabBtn.node.on('click', this.onRenwuTabClick, this);
        this.menpaixiangqingTabBtn.node.on('click', this.onMenpaixiangqingTabClick, this);
        
        // 门派页面
        this.fengluBtn.node.on('click',this.onFengluBtnClick, this);
        this.tiaozhanBtn.node.on('click',this.onTiaozhanBtnClick, this);
        this.panjiao.node.on('click',this.onPanjiaoBtnClick, this);
        
        this.jiaohuBtn1.node.on('click',this.onJiaohuBtn1Click, this);
        this.jiaohuBtn2.node.on('click',this.onJiaohuBtn2Click, this);
        this.jiaohuBtn3.node.on('click',this.onJiaohuBtn3Click, this);
        this.jiaohuBtn4.node.on('click',this.onJiaohuBtn4Click, this);
        this.jiaohuBtn5.node.on('click',this.onJiaohuBtn5Click, this);

        this._jiaohuBtns = [this.jiaohuBtn1,this.jiaohuBtn2,this.jiaohuBtn3,this.jiaohuBtn4,this.jiaohuBtn5];
        for (let index = 0; index < this._jiaohuBtns.length; index++) {
            const element = this._jiaohuBtns[index];
            element.node.active = false;
        }

        // 练功房页面
        this.liangongBtn.node.on('click',this.onLiangongBtnClick,this);
        this.zhangmenLiangongBtn.node.on('click',this.onZhangmenLiangongBtnClick,this);
        
        this._isUpdate = false;
        this._isUpdate1 = false;
        this._endTime = 0;
        this._endTime1 = 0;
        this._liangGongTime = 0;
        this._liangGongTime2 = 0;

        // 任务页面
    },

    _onShow(){

        let menPaiData = yx.menPaiMgr.getMineMenPaiData();
        if (menPaiData.menpaiId)
        {
            this._refresh();
        }
        else
        {
            yx.menPaiMgr.Info();
        }
    },

    _onHide(){
        this.unscheduleAllCallbacks();
    },

    _onDeInit(){

    },

    update(dt){
        if (!this.isShown()){
            return;
        }

        if(this._curTab == TabType.TAB2)
        {
            if(this._isUpdate)
            {
                if(yx.timeUtil.getServerTime() < this._endTime)
                {
                    let diff = this._endTime - yx.timeUtil.getServerTime();
                    if(diff >= 0 )
                    {
                        this.liangongProgress.progress = diff/this._liangGongTime;
                        this.liangongTime.string = yx.timeUtil.seconds2hourMinSecond(diff/1000);
                    }
                }
                else
                {
                    this._isUpdate = false;
                    this._refreshTabContent();
                }
            }

            if(this._isUpdate1)
            {
                if(yx.timeUtil.getServerTime() < this._endTime1)
                {
                    let diff = this._endTime1 - yx.timeUtil.getServerTime();
                    if(diff >= 0 )
                    {
                        this.zhangmenLiangongProgress.progress = diff/this._liangGongTime2;
                        this.zhangmenliangongTime.string = yx.timeUtil.seconds2hourMinSecond(diff/1000);
                    }
                }
                else
                {
                    this._isUpdate1 = false;
                    this._refreshTabContent();
                }
            }
        }
       
        
    },

    _refreshStar(){
        for (let i = 0; i < _maxStar; i++){
           if(this._curStar == (i+1)){
                this._starNodeArray[i].active = true;
           }
           else
           {
                this._starNodeArray[i].active = false;
           }
        }
        
        if(this._curStar <= _minStar)
        {
            this.leftBtn.interactable = false;
        }
        else
        {
            this.leftBtn.interactable = true;
        }
        if(this._curStar >= _maxStar)
        {
            this.rightBtn.interactable = false;
        }
        else
        {
            this.rightBtn.interactable = true;
        }
    },

    _refreshTabContent(){
        for(let i = 0; i < 4; i++){
            if(this._curTab == (i+1)){
                 this._tabArray[i].node.getChildByName("selected").active = true;
                 this._tabContentArray[i].active = true;
            }
            else
            {
                 this._tabArray[i].node.getChildByName("selected").active = false;
                 this._tabContentArray[i].active = false;
            }
         }

         if(this._curTab == TabType.TAB1)
         {
            let menpaiCondfig = yx.menPaiMgr.getMineMenPaiConfig();
            let npcs = menpaiCondfig.Npc;

            this._headIndexs = [];
            let index = 0;

            let self = this;
            self.headScrollContent.removeAllChildren(true);
            npcs.forEach(data => {
                if(index == 0)
                {
                    yx.NpcRichTextWidget.CreateItemSlot(data, self.headScrollContent, "npc_"+data.ID ,
                    self._onSelectHeadItemCb.bind(self),self._onSelectHeadItemCb.bind(self)); 
                }
                else
                {
                    yx.NpcRichTextWidget.CreateItemSlot(data, self.headScrollContent, "npc_"+data.ID ,
                    self._onSelectHeadItemCb.bind(self)); 
                }
                self._headIndexs[index] = "npc_"+data.ID;
                index = index + 1 ;
             });

         }
         else if(this._curTab == TabType.TAB2)
         {
            let liangongfangCfg = yx.cfgMgr.getRecordByKey("LianGongFangConfig", {ID:1});
            let descContent = "<color=#edd49b>练功房打坐可以增加{bei}倍修炼速度{nian}年，身为掌门可以修炼{nian2}年</c>";
            let nian = yx.timeUtil.minutes2year(liangongfangCfg.time);
            let nian2 = nian*2;
            descContent = descContent.format({bei:liangongfangCfg.multiple,nian:nian,nian2:nian2});
            this.liangongDesc.string = descContent;
            let costName = yx.bagMgr.GetItemName(liangongfangCfg.cost[0].type,liangongfangCfg.cost[0].id);
            let ownCount = yx.bagMgr.GetItemOwnCount(liangongfangCfg.cost[0].type,liangongfangCfg.cost[0].id);
            let content = "<color=#00c800>{cost}</color><color=#ffffff>{costName}\n当前{costName}：{lingshi}</color>";
            content = content.format({cost:liangongfangCfg.cost[0].count,lingshi:ownCount,costName:costName});
            this.costRichText.string = content;

            this._isUpdate = false;
            this._isUpdate1 = false;
            this._endTime = yx.menPaiMgr.LianGongEndTime();
            this._endTime1 = yx.menPaiMgr.ZhangMenLianGongEndTime();
            this.liangongDesc.node.active = true;

            if(yx.timeUtil.getServerTime() < this._endTime)
            {
                this._isUpdate = true;
                this.liangongGroup.active = false;
                this.liangongProgressGroup.active = true;
                this.liangongDesc.node.active = false;
                this._liangGongTime = this._endTime - yx.menPaiMgr.LianGongStartTime();
            }   
            else
            {
                this.liangongGroup.active = true;
                this.liangongProgressGroup.active = false;
            }
            if(yx.timeUtil.getServerTime() < this._endTime1)
            {
                this._isUpdate1 = true;
                this.zhangmenLiangongBtn.node.active = false;
                this.zhangmenLiangongProgressGroup.active = true;
                this.liangongDesc.node.active = false;
                this._liangGongTime2 = this._endTime1 - yx.menPaiMgr.ZhangMenLianGongStartTime();
            }
            else
            {
                this.zhangmenLiangongBtn.node.active = true;
                this.zhangmenLiangongProgressGroup.active = false;
            }
         }
         else if(this._curTab == TabType.TAB3)
         {
            this._taskItemList = new Array();

            let menPaiPostConfig = yx.cfgMgr.getRecordByKey("MenPaiPostConfig", {"ZhiWu":yx.menPaiMgr.currZhiWei()});
            this.renwuTitleLabel.string = menPaiPostConfig.ZhiWuName + "（括号内为当前职位加成）";

            let taskConfigs = yx.cfgMgr.getAllConfig("MenPaiTaskConfig");
            let self = this;
            self.scrollContent.removeAllChildren(true);
            taskConfigs.forEach(data => {
                let scrollItem = cc.instantiate(self.menPaiTaskItemPrefab);
                let itemSrc = scrollItem.getComponent(MenPaiTaskScrollItem);
                if (itemSrc)
                {
                    itemSrc.init(data);
                    self.scrollContent.addChild(scrollItem);
                    self._taskItemList.push(itemSrc);
                }
             });
         }
         else if(this._curTab == TabType.TAB4)
         {
            let menpaiCondfig = yx.menPaiMgr.getMineMenPaiConfig();
            this.menpaiNameLabel.string = menpaiCondfig.DefName;
            this.menpaiDescRichText.string = menpaiCondfig.DefDesc + "\n" + menpaiCondfig.DefDesc2;

            // 代理掌门
            let dailiZhangmen = yx.menPaiMgr.DaiLiZhangMen();
            if(dailiZhangmen)
            {
                this.dailiGroup.active = true;
                this.dailiZhangmenLabel.string = "当前代理掌门:"+dailiZhangmen.Name;
                // yx.resUtil.LoadSpriteByType(dailiZhangmen.Icon, yx.ResType.NPC, this.dailiZhangmenSp);
            }
            else
            {
                this.dailiGroup.active = false;
            }

         }
    },

    _onSelectHeadItemCb(config,name){
        cc.log("name==="+name);

        this._npcConfig = config;
        
        this.npcName.string = this._npcConfig.Name;
        this.npcZhiWu.string = this._npcConfig.ZhiWuName;
        this.npcDesc.string = this._npcConfig.DefDesc1 + "\n" + this._npcConfig.DefDesc2 + "\n" + this._npcConfig.DefDesc;


        for (let index = 0; index < this._headIndexs.length; index++) {
            const elementName = this._headIndexs[index];
            let headObj = this.headScrollContent.getChildByName(elementName).getChildByName(elementName);
            if(headObj)
            {
                let select = headObj.getChildByName("selected");
                select.active = false;
            }
        }
    
        let headObj = this.headScrollContent.getChildByName(name).getChildByName(name);
        let select = headObj.getChildByName("selected");
        select.active = true;

        let btn_num = 0;
        this._jiaohuDatas = [];
        this._jiaohuDatas[btn_num] = {type:JiaoHuType.JIAOTAN,desc:"<color=#000000>交\n\n谈</color>"};
        btn_num = btn_num + 1;
        

        if(config.IsQingAn)
        {
            this._jiaohuDatas[btn_num] = {type:JiaoHuType.QINGAN,desc:"<color=#000000>请\n\n安</color>"};
            btn_num = btn_num + 1;
        }
        if(config.IsQieCuo)
        {
            this._jiaohuDatas[btn_num] = {type:JiaoHuType.QIECUO,desc:"<color=#000000>切\n\n磋</color>"};
            btn_num = btn_num + 1;
        }
        if(config.IsXueXi)
        {
            this._jiaohuDatas[btn_num] = {type:JiaoHuType.XUEXI,desc:"<color=#000000>学\n习\n功\n法</color>"};
            btn_num = btn_num + 1;
        }
        if(config.IsDuiHuan)
        {   
            this._jiaohuDatas[btn_num] = {type:JiaoHuType.DUIHUAN,desc:"<color=#000000>兑\n\n换</color>"};
            btn_num = btn_num + 1;
        }
        if(config.IsTiShen)
        {
            this._jiaohuDatas[btn_num] = {type:JiaoHuType.TISHENG,desc:"<color=#000000>提\n升\n职\n位</color>"};
            btn_num = btn_num + 1;
        }

        if(yx.menPaiMgr.IsDaoLv(config.ID))
        {
            this._jiaohuDatas[btn_num] = {type:JiaoHuType.ZENGLI,desc:"<color=#000000>赠\n礼</color>"};
            btn_num = btn_num + 1;
        }

        for (let index = 0; index < this._jiaohuBtns.length; index++) {
            const element = this._jiaohuBtns[index];
            element.node.active = false;
        }
        for (let index = 0; index < this._jiaohuDatas.length; index++) {
            const element = this._jiaohuDatas[index];
            this._jiaohuBtns[index].node.active = true;
            let richText = this._jiaohuBtns[index].node.getChildByName("title")
            let showRichText = richText.getComponent(cc.RichText);
            showRichText.string = element.desc;
        }

    },

    _refresh(){
        if(yx.menPaiMgr.isOwnMenPai())
        {
            this.gongxianValueLabel.string = yx.menPaiMgr.getGongXian();
            this.selectMenPaiGroup.active = false;
            this.menPaiGroup.active = true;

            this._curTab = TabType.TAB1;
            this._refreshTabContent();
        }
        else
        {
            this.weiwangValueLabel.string = yx.playerMgr.getCurrency(yx.CyType.WEIWANG);
            this.selectMenPaiGroup.active = true;
            this.menPaiGroup.active = false;

            this._curStar = 1;
            this._refreshStar();
        }

        yx.DiarysUtil.setRichTextWithShowList(this.logRichText, "menpai");

    },

    onLeftBtnClick(){
        if(this._curStar <= _minStar){
            return;
        }
        this._curStar -= 1;
        this._refreshStar();
    },

    onRightBtnClick(){
        if(this._curStar >= _maxStar){
            return;
        }
        this._curStar += 1;
        this._refreshStar();
    },

    onSureBtnClick(){
        let levelConfig = yx.cfgMgr.getRecordByKey("MenpaiLevelConfig", {Star:this._curStar});
        if(!levelConfig)
            return;
        if(yx.playerMgr.getDuJieLevel() < levelConfig.Level && yx.playerMgr.getCuiTiLevel() < levelConfig.Level)
        {
            let dujieConfig = yx.cfgMgr.getRecordByKey("DuJieConfig", {Level:levelConfig.Level});
            let content = "尚未达到{name}";
            content = content.format({name:dujieConfig.Name});
            yx.ToastUtil.showListToast(content);
            return;
        }

        // 打开选择正邪门派界面
        let arg = {};
        arg.star = this._curStar;
        yx.windowMgr.showWindow("menPaiSelectPanel",arg);
    },


    onMenpaiTabClick(){
        this._curTab = TabType.TAB1;
        this._refreshTabContent();
    },
    onLiangongfangTabClick(){
        this._curTab = TabType.TAB2;
        this._refreshTabContent();
    },
    onRenwuTabClick(){
        this._curTab = TabType.TAB3;
        this._refreshTabContent();
    },
    onMenpaixiangqingTabClick(){
        this._curTab = TabType.TAB4;
        this._refreshTabContent();
    },


    onFengluBtnClick(){

        if(yx.menPaiMgr.HasGetFenglu())
        {
            yx.ToastUtil.showListToast("今日已领取俸禄");
            return;
        }

        let menPaiPostConfig =  yx.cfgMgr.getRecordByKey("MenPaiPostConfig", {"ZhiWu":yx.menPaiMgr.currZhiWei()});
        let rewardName = yx.bagMgr.GetItemName(menPaiPostConfig.FengLuReward[0].type,menPaiPostConfig.FengLuReward[0].id);

        // 购买了月卡可额外获得一定的灵石 menPaiPostConfig.ZhiWuName
        let content = '<color=#ffffff>你当前的俸禄为:{rewardValue}{rewardName}，是否领取？</color>';//\n(你当前是"{zhiwei}",可额外领取{lingshi2}{rewardName})</color>';
        content = content.format({rewardValue:menPaiPostConfig.FengLuReward[0].count,rewardName:rewardName});

        yx.TextConfirm.ShowConfirm(content, yx.CodeHelper.NewClickEvent(this, "onGetFengluConfirmBtnClick"));
    },

    onGetFengluConfirmBtnClick(){
        yx.menPaiMgr.fengLu();
    },

    onTiaozhanBtnClick(){
        yx.windowMgr.showWindow("menPaiTiaoZhanPanel");
    },

    onPanjiaoBtnClick(){
        // 购买了月卡可("巡察使"及"节度使"扣除的威望会有所减少)

        let menpaiConfig = yx.menPaiMgr.getMineMenPaiConfig();
        let menPaiLevelConfig =  yx.cfgMgr.getRecordByKey("MenpaiLevelConfig", {"Star":menpaiConfig.Star});
        let costName = yx.bagMgr.GetItemName(menPaiLevelConfig.ExitCost[0].type,menPaiLevelConfig.ExitCost[0].id);

        let content = '<color=#FFFFFF>确定要退出{menpaiName}吗？退出门派后将会扣除{weiwang}{costName}，门派贡献将被清零。</color>';
        content = content.format({menpaiName:menpaiConfig.DefName,weiwang:menPaiLevelConfig.ExitCost[0].count,costName:costName});

        yx.TextConfirm.ShowConfirm(content, yx.CodeHelper.NewClickEvent(this, "onPanjiaoConfirmBtnClick"));
    },

    onPanjiaoConfirmBtnClick(){
        let menpaiConfig = yx.menPaiMgr.getMineMenPaiConfig();
        let menPaiLevelConfig =  yx.cfgMgr.getRecordByKey("MenpaiLevelConfig", {"Star":menpaiConfig.Star});
        let ownCount = yx.bagMgr.GetItemOwnCount(menPaiLevelConfig.ExitCost[0].type,menPaiLevelConfig.ExitCost[0].id);
        let costName = yx.bagMgr.GetItemName(menPaiLevelConfig.ExitCost[0].type,menPaiLevelConfig.ExitCost[0].id);
        if(ownCount < menPaiLevelConfig.ExitCost[0].count)
        {   
            yx.ToastUtil.showListToast(costName+"不足");
            return;
        }

        yx.menPaiMgr.panJiao();
    },

    onJiaohuBtn1Click(){
        this._handleJiaoHuBtn(this._jiaohuDatas[0].type);
    },
    onJiaohuBtn2Click(){
        this._handleJiaoHuBtn(this._jiaohuDatas[1].type);
    },
    onJiaohuBtn3Click(){
        this._handleJiaoHuBtn(this._jiaohuDatas[2].type);
    },
    onJiaohuBtn4Click(){
        this._handleJiaoHuBtn(this._jiaohuDatas[3].type);
    },
    onJiaohuBtn5Click(){
        this._handleJiaoHuBtn(this._jiaohuDatas[4].type);
    },

    _diaryShow(args){
        yx.DiarysUtil.addShowTextToRichText(this.logRichText, "menpai", args);
        this.logScrollView.scrollToBottom();
    },

    _handleJiaoHuBtn(type){
        switch (type)
        {
            case JiaoHuType.JIAOTAN:
                cc.log("交谈...");
                if(!this._npcConfig)
                    return;
                
                cc.log("servertime=="+yx.timeUtil.getServerTime());
                cc.log("firstTime=="+firstTime);

                if(yx.timeUtil.getServerTime() - firstTime >= 7000)
                {
                    firstTime = yx.timeUtil.getServerTime();
                    clickCount = 0;
                }
                if(yx.timeUtil.getServerTime() - firstTime <= 5000)
                {
                    clickCount = clickCount + 1;
                    if(clickCount < 4)
                    {
                        let talkConfig =  yx.cfgMgr.getRecordByKey("TalkListConfig", {ID:this._npcConfig.TalkID});
                        if(talkConfig)
                        {
                            let talkContent = "<color=#e7452f>{npcName}</color>:{talk}";
                            talkContent =  talkContent.format({npcName:this._npcConfig.Name,talk:talkConfig.Talk});
                            let args = {index:0,str:talkContent};
                            this._diaryShow(args);
                        }
                    }
                    else
                    {
                        let args = {index:0,str:"对方似乎不想再与你交谈"};
                        this._diaryShow(args);
                    }
                }
                
            break;
            case JiaoHuType.QINGAN:
                cc.log("请安...");
                if(yx.menPaiMgr.HasQingAn())
                {
                    yx.ToastUtil.showListToast("今天已经请安过了。");
                    return;
                }    
                yx.windowMgr.showWindow("menPaiQingAnPanel");

            break;
            case JiaoHuType.QIECUO:
                cc.log("切磋...");
                if(!this._npcConfig)
                    return;
                if(this._npcConfig.Level - yx.playerMgr.getDuJieLevel() >= 20)
                {
                    if(yx.timeUtil.getServerTime() - qcfirstTime >= 7000)
                    {
                        qcfirstTime = yx.timeUtil.getServerTime();
                        qcclickCount = 0;
                    }
                    if(yx.timeUtil.getServerTime() - qcfirstTime <= 5000)
                    {
                        qcclickCount = qcclickCount + 1;
                        if(qcclickCount < 4)
                        {
                            let talkContent = "<color=#17a479>{palyerName}</color>：听闻你道法高强，今日我来请求指点一下，若有失礼之处，还望多多包涵……\n<color=#e7452f>{npcName}</color>：你境界太低，还不配做我的对手。";
                            talkContent = talkContent.format({palyerName:yx.playerMgr.getName(),npcName:this._npcConfig.Name});
                            let args = {index:0,str:talkContent};
                            this._diaryShow(args);
                        }
                        else
                        {
                            let args = {index:0,str:"对方很不屑的离开了"};
                            this._diaryShow(args);
                        }
                    }

                    return;
                }
                // 切磋请求
                yx.menPaiMgr.qieCuo(this._npcConfig.ID);

            break;
            case JiaoHuType.XUEXI:
                yx.windowMgr.showWindow("menPaiShouYePanel");
            break;
            case JiaoHuType.DUIHUAN:
                yx.windowMgr.showWindow("menPaiDuiHuanPanel");
            break;
            case JiaoHuType.TISHENG:
                yx.windowMgr.showWindow("menPaiZhiWeiPanel");
            break;
            case JiaoHuType.ZENGLI:
                cc.log("赠礼");
                yx.menPaiMgr.zengLi(this._npcConfig.ID);
            break;
            default:
                cc.warn("[MenPaiWindow jiaohuBtn] type is not exist "+ type);
            break;
        }
        
    },

    onAddDairyLog(data){
        let args = {index:0,str:data.talkContent};
        this._diaryShow(args);
        
    },


    onLiangongBtnClick(){
        if(yx.timeUtil.getServerTime() < this._endTime)
        {
            yx.ToastUtil.showListToast("修炼中。。。");
            return;
        }

        if(yx.menPaiMgr.LianGongStartTime() != 0 && yx.timeUtil.IsSameDay(yx.menPaiMgr.LianGongStartTime(),yx.timeUtil.getServerTime()))
        {
            yx.ToastUtil.showListToast("今日已经修炼过了。");
            return;
        }

        let menpaiConfig = yx.menPaiMgr.getMineMenPaiConfig();
        if(yx.menPaiMgr.currZhiWei() < menpaiConfig.XiuLianZhiwu )//&& RoleAttrMgr:curGuanZhi() == 0 )
        {
            yx.ToastUtil.showListToast("内门弟子以上才可以修炼");
            return;
        }

        let liangongfangCfg = yx.cfgMgr.getRecordByKey("LianGongFangConfig", {ID:1});
        let costName = yx.bagMgr.GetItemName(liangongfangCfg.cost[0].type,liangongfangCfg.cost[0].id);
        let ownCount = yx.bagMgr.GetItemOwnCount(liangongfangCfg.cost[0].type,liangongfangCfg.cost[0].id);

        if(ownCount < liangongfangCfg.cost[0].count)
        {
            yx.ToastUtil.showListToast(costName+"不足");
            return;
        }

        yx.menPaiMgr.LianGong(1);
    },

    onZhangmenLiangongBtnClick(){

        let args ={};
        args.endTime1 = this._endTime1;
        yx.windowMgr.showWindow("menPaiChuangongPanel",args);

    },

    onInfoRefresh(){
        this._refresh();
    },

    onEventCurrencyChange()
    {
        this.gongxianValueLabel.string = yx.menPaiMgr.getGongXian();
    },

    onTaskReFreshTime()
    {
        if(this._curTab == TabType.TAB3)
        {
            for (const item of this._taskItemList) {
                item.onReFreshTime();
            }
        }
    },  

    onLianGongRefresh()
    {
        if(this._curTab == TabType.TAB2)
        {
            this._refreshTabContent();
        }
    },

    onPKShow(args)
    {
        yx.FightPanel.ShowFightResult(args.eason, "aaa", args.result, false, null, null);
    },


    onDaoLvEventErrorTip(resp) {
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
            let args = {index:0,str:content};
            this._diaryShow(args);
        }
    },
});
