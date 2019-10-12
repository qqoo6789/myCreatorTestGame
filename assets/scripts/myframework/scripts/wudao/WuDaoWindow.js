const BaseWindow = require('BaseWindow');
const GoBackWidget = require('GoBackWidget');

//test code
//let _testData = [23, 24, 12, 23, 9];
//let _testAttr = [239, 34432];
//let _testLingChiLevel = 32;
//let _testLingQiValue = 34324;

//0 神 1人 2畜 3鬼 4狱 
let _wudaoColorArray = ["#FFC333", "#30C5FF", "#2BFF77", "#FF27FF", "#FC3B3B"];
//灵池转圈速度，单位秒
const _progressBarSpeed = 5.3;//比后台下发的时间稍长一点点就可以了

cc.Class({
    extends: BaseWindow,

    properties: {              

        backWidget:             GoBackWidget,

        //资源
        nameEffectPrefab:       cc.Prefab,
        baodianEffectPrefab:    cc.Prefab,
        flyGenEffectPrefab:     cc.Prefab,

        //标题区
        titleMuCaiValueLabel:   cc.Label,
        titleYunTieValueLabel:  cc.Label,

        //自动升级
        autoUpgradeGroupNode:   cc.Node,
        autoUpgradeToggle:      cc.Toggle,

        //五道区 注意五个节点的结构必须保持一致，设置的时候才能省事
        shenNode:               cc.Node,
        chuNode:                cc.Node,
        yuNode:                 cc.Node,
        guiNode:                cc.Node,
        renNode:                cc.Node,
        progressBar:            cc.ProgressBar,

        //灵池信息区
        lingChiTitleLabel:      cc.Label,
        shengchanLabel:         cc.Label,
        needMuCaiValueLabel:    cc.Label,
        needYunTieValueLabel:   cc.Label,
        lingQiValueLabel:       cc.Label,
        upgradeBtn:             cc.Button,
        flyGenParent:           cc.Node,
        shoujiEffectAnim:       cc.Animation,
        neidanbaoAnim:          cc.Animation,
        //flyGenEffectAni:        cc.Animation,

        //日志区
        logRichText:            cc.RichText,
        logScrollView:          cc.ScrollView,

        _lingChiInfo:           null,
        _daoNodeArray:          null,

    },

    _onInit(){
        this.upgradeBtn.node.on('click', this.onUpgradeBtnClick, this);
       
        yx.eventDispatch.addListener(yx.EventType.CURRENCY_CHANGE, this.onEventCurrencyChange, this);
        yx.eventDispatch.addListener(yx.EventType.WUDAO, this.onEventWuDaoInfo, this);
        yx.eventDispatch.addListener(yx.EventType.UPGRADE_WUDAO, this.onEventWudaoUpgrade, this);
        yx.eventDispatch.addListener(yx.EventType.UPGRADE_WUDAO_ATTR, this.onEventAttrUpgrade, this);  

        this._daoNodeArray = [this.shenNode,  this.renNode, this.chuNode, this.guiNode, this.yuNode];
    },

    _onShow () {
        this._resetProgressBar();

        this._refresh();

        yx.DiarysUtil.setRichTextWithShowList(this.logRichText, "wudao");
    },

    _onHide(){
        this.unscheduleAllCallbacks();

        this._clearAllEffect();
    },

    // update(dt){
    //     if (!this.isShown()){
    //         return;
    //     }

    //     if (this.progressBar.progress > 0)
    //     {
    //         this.progressBar.progress -= dt * 1 / _progressBarSpeed;            
    //     }
        
    //     if (this.progressBar.progress < 0)
    //     {
    //         this.progressBar.progress = 0;
    //     }
    // },

    _onDeInit(){
        
    },

    _resetProgressBar(){        
        this.progressBar.progress = 1;
    },

    _refreshLingQi(){
        this.lingQiValueLabel.string = yx.playerMgr.getCurrency(yx.CyType.LINGQI) + "/" + this._lingChiInfo.MaxLingQi;
    },

    _refresh()
    {    
        this.titleMuCaiValueLabel.string = yx.playerMgr.getCurrency(yx.CyType.MUCAI);
        this.titleYunTieValueLabel.string = yx.playerMgr.getCurrency(yx.CyType.YUNTIE);//_testAttr[1];

        //501 神 502人 503畜 504鬼 505狱 
        let attrList = yx.wudaoMgr.getAttr();
        if (attrList.length == 5)
        {
            for (let i = 0; i < this._daoNodeArray.length; i++){
                this._setNode(this._daoNodeArray[i], i, attrList[i]);
            }
        }
        else
        {
            cc.warn("[WuDaoWindow refresh warn] attrlist error len:" + attrList.length);
        }        

        this._setLingChi();
        
        this.logRichText.node.parent.setContentSize(this.logRichText.node.getContentSize());
    },

    _clearFlyGenEffect(){
        this.flyGenParent.removeAllChildren(true);
    },

    _clearLingGenNodeEffect(daoNode){
        let nodes =  daoNode.getChildByName("AddButton").children.filter(node => node.name == this.baodianEffectPrefab.name);

        nodes = nodes.concat(daoNode.getChildByName("LevelLabel").children.filter(node => node.name == this.nameEffectPrefab.name));

        nodes.forEach(node => {
            node.removeFromParent(true);
        });
    },

    _clearAllEffect(){
        this._clearFlyGenEffect();

        for (let i = 0; i < this._daoNodeArray.length; i++)
        {
            let daoNode = this._daoNodeArray[i];

            this._clearLingGenNodeEffect(daoNode);
        }
    },

    //播放灵根升级特效
    _playEffectNodeUpgrade(type){
        if (!this._daoNodeArray[type])
        {
            return;
        }

        let daoNode = this._daoNodeArray[type];

        //播飞灵根
        let flyGenEffect = cc.instantiate(this.flyGenEffectPrefab);
        this.flyGenParent.addChild(flyGenEffect);
        flyGenEffect.setPosition(cc.v2());

        let flyGenAni = flyGenEffect.getComponent(cc.Animation);
        let aniName = "flygen" + type;
        flyGenAni.play(aniName);

        let aniState = flyGenAni.getAnimationState(aniName);
        
        this.scheduleOnce(function(){
            flyGenEffect.removeFromParent(true);

            //加爆点到灵根节点上 AddBtn
            let baodiaoEffect = cc.instantiate(this.baodianEffectPrefab);
            daoNode.getChildByName("AddButton").addChild(baodiaoEffect);
            baodiaoEffect.color = new cc.Color().fromHEX(_wudaoColorArray[type]);
            baodiaoEffect.setPosition(cc.v2());

            this.scheduleOnce(function(){
                baodiaoEffect.removeFromParent(true);

                //名字闪光
                let nameEffect = cc.instantiate(this.nameEffectPrefab);
                daoNode.getChildByName("LevelLabel").addChild(nameEffect);
                nameEffect.setPosition(cc.v2());

                let action = cc.sequence(cc.delayTime(0.6), cc.removeSelf());

                nameEffect.runAction(action);
            }, 0.4);
        }, aniState.duration);

        

        // //名字闪光
        // let nameEffect = cc.instantiate(this.nameEffectPrefab);
        // daoNode.getChildByName("LevelLabel").addChild(nameEffect);
        // nameEffect.setPosition(cc.v2());
    },

    //设置五灵根
    _setNode(node, type, level)
    {
        //注意type下标从0到4，查表时要加1
        let wudaoInfo = yx.cfgMgr.getRecordByKey("WuDaoAttrConfig", {Level: level, Type: type + 1});

        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "WuDaoWindow";
        clickEventHandler.handler = "onDaoNodeBtnClick";
        clickEventHandler.customEventData = type;

        let nodeBtn = node.getChildByName("AddButton").getComponent(cc.Button);
        nodeBtn.clickEvents.length = 0;
        nodeBtn.clickEvents.push(clickEventHandler);

        if (wudaoInfo != null)
        {
            node.getChildByName("LevelLabel").getComponent(cc.Label).string = wudaoInfo.Name;
            node.getChildByName("AddValueLabel").getComponent(cc.Label).string = "+" + wudaoInfo.attr[0].value;
            node.getChildByName("LiQiValueLabel").getComponent(cc.Label).string = wudaoInfo.Cost[0].count;            
        }
        else
        {
            node.getChildByName("LevelLabel").getComponent(cc.Label).string = "废品一阶";
            node.getChildByName("AddValueLabel").getComponent(cc.Label).string = "2";
            node.getChildByName("LiQiValueLabel").getComponent(cc.Label).string = "60";    
        }

        node.getChildByName("AddButton").getChildByName("EffectSp").color = new cc.Color().fromHEX(_wudaoColorArray[type]);
    },

    //灵池
    _setLingChi()
    {
        let lingchiLevel = yx.wudaoMgr.getLingChiLevel();

        this._lingChiInfo = yx.cfgMgr.getRecordByKey("WuDaoChingConfig", {Level:lingchiLevel});

        if (this._lingChiInfo != null)
        {
            this.lingChiTitleLabel.string = this._lingChiInfo.Name;
            this.shengchanLabel.string = "每5秒生产" + this._lingChiInfo.AddLingQi[0].count + "点灵气";            

            let curMuCai =  yx.playerMgr.getCurrency(yx.CyType.MUCAI);
            let curYunTie = yx.playerMgr.getCurrency(yx.CyType.YUNTIE);

            let needMuCai = this._lingChiInfo.Cost[0].count;
            let needYunTie = this._lingChiInfo.Cost[1].count;

            let mucaiColor =  curMuCai >= needMuCai ? yx.colorUtil.TextGreen : yx.colorUtil.TextRed;
            let yuntieColor = curYunTie >= needYunTie ? yx.colorUtil.TextGreen : yx.colorUtil.TextRed;

            this.needMuCaiValueLabel.string = needMuCai;
            this.needYunTieValueLabel.string = needYunTie;

            this.needMuCaiValueLabel.node.color = new cc.Color().fromHEX(mucaiColor);
            this.needYunTieValueLabel.node.color = new cc.Color().fromHEX(yuntieColor);

            this._refreshLingQi();
            //this.lingQiValueLabel.string = _testLingQiValue + "/" + this._lingChiInfo.MaxLingQi;
        }
        else
        {
            cc.error("[WuDaoWindow setLingChi] lingchiinfo error level:" + lingchiLevel);
        }
    },

    

    onUpgradeBtnClick(){
        cc.log("onUpgradeBtnClick");

        let arg = {};
        arg.content = "";
        arg.content += ("确定要升级灵池吗？\n所需要材料\n");    

        let curMuCai =  yx.playerMgr.getCurrency(yx.CyType.MUCAI);
        let curYunTie = yx.playerMgr.getCurrency(yx.CyType.YUNTIE);

        let needMuCai = this._lingChiInfo.Cost[0].count;
        let needYunTie = this._lingChiInfo.Cost[1].count;
        
        let mucaiString = curMuCai + "/" + needMuCai;
        let yuntieString = curYunTie + "/" + needYunTie;

        let mucaiColor =  curMuCai >= needMuCai ? yx.colorUtil.TextGreen : yx.colorUtil.TextRed;
        let yuntieColor = curYunTie >= needYunTie ? yx.colorUtil.TextGreen : yx.colorUtil.TextRed;
        
        arg.content += "木材：" + yx.colorUtil.AddColorString(mucaiString, mucaiColor) + "\n";
        arg.content += "陨铁：" + yx.colorUtil.AddColorString(yuntieString, yuntieColor) + "\n";

        arg.content = yx.colorUtil.AddColorString(arg.content, yx.colorUtil.TextBlueLigth);

        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "WuDaoWindow";
        clickEventHandler.handler = "onUpgradeConfirmBtnClick";
        //arg.confirmCallback = clickEventHandler;       

        //yx.windowMgr.showWindow("textConfirm", arg);

        yx.TextConfirm.ShowConfirm(arg.content, clickEventHandler);
    },

    onDaoNodeBtnClick(event, customEventData){
        let type = customEventData + 1;
        let index = customEventData;

        cc.log("onDaoNodeBtnClick type:" + type);

        let wudaoInfo = yx.cfgMgr.getRecordByKey("WuDaoAttrConfig", {Level: yx.wudaoMgr.getAttrLevel(index), Type: type});

        if (wudaoInfo)
        {
            if (yx.playerMgr.getCurrency(yx.CyType.LINGQI) >= wudaoInfo.Cost[0].count)
            {
                yx.wudaoMgr.reqWuDaoAttrUpgrade(type);
            }
            else
            {
                yx.ToastUtil.showListToast("灵气不足");
            }
        }        
    },

    onUpgradeConfirmBtnClick(){
        cc.log("onUpgradeConfirmBtnClick");

        let curMuCai =  yx.playerMgr.getCurrency(yx.CyType.MUCAI);
        let curYunTie = yx.playerMgr.getCurrency(yx.CyType.YUNTIE);

        let needMuCai = this._lingChiInfo.Cost[0].count;
        let needYunTie = this._lingChiInfo.Cost[1].count;
        
        if (curMuCai >= needMuCai && curYunTie >= needYunTie)
        {
            yx.wudaoMgr.reqWuDaoUpgrade();
        }
        else
        {
            yx.ToastUtil.showListToast("材料不足");
        }
    },   

    onEventCurrencyChange(diff){
        if (this.isShown())
        {
            //只管灵气变化
            if (diff != null)
            {
                let addLingQi = diff[yx.CyType.LINGQI];
                if (addLingQi > 0)
                {
                    yx.ToastUtil.showSimpleToast("灵气：" + addLingQi,this.node);
                    this._refreshLingQi();
                    this._resetProgressBar();
                }

                let diffMuCai = diff[yx.CyType.MUCAI];
                if (diffMuCai != 0)
                {
                    this.titleMuCaiValueLabel.string = yx.playerMgr.getCurrency(yx.CyType.MUCAI);
                    this.titleYunTieValueLabel.string = yx.playerMgr.getCurrency(yx.CyType.YUNTIE);
                }
            }            
        }
    },

    onEventWuDaoInfo(){
        if (this.isShown())
        {
            this._refresh();
        }
    },


    // "list": [
    //     //     "【<color=#1d8d00>{year}年</color>】合抱之木，生于毫末；九层之台，起于累土。<color=#bb1f29>{name}</color>汇集天材地宝将灵池成功提升到了<color=#bb1f29>{level}</color>级。", //灵池升级
    // ], 

    //灵池升级
    onEventWudaoUpgrade(){
        if (this.isShown())
        {
            this._refresh();

            let args = {};
            args.index = 1;
            args.year = yx.timeUtil.getXiuLianYear();
            args.name = yx.playerMgr.getName();          
            args.level = yx.wudaoMgr.getLingChiLevel();                        

            yx.DiarysUtil.addShowTextToRichText(this.logRichText, "wudao", args);
            this.logScrollView.scrollToBottom();
        }
    },


    //灵根升级
    onEventAttrUpgrade(resp){
        // message S2C_UpgradeWudaoAttr {
        //     optional int32 level = 1;
        //     optional int32 index = 2;
        // }
        //"【<color=#1d8d00>{year}年</color>】<color=#bb1f29>{name}</color>盘坐入定，从灵池拨出一缕灵气，
        //注入<color={color}>{type}</color>系灵根，灵气逐渐凝练并且被灵根吸收，该灵根成功提升到<color=#bb1f29>{levelName}</color>", //灵根升级
    

        if (this.isShown())
        {
            this._refresh();

            if (resp)
            {
                this._playEffectNodeUpgrade(resp.index);   

                let wudaoInfo = yx.cfgMgr.getRecordByKey("WuDaoAttrConfig", {Level: resp.level, Type: resp.index + 1});                

                let args = {};
                args.index = 0;
                args.year = yx.timeUtil.getXiuLianYear();
                args.name = yx.playerMgr.getName();
                args.color = "#bb1f29";
                args.type = yx.textDict.WuDaoTypeName[resp.index + 1];

                if (wudaoInfo)
                {
                    args.levelName = wudaoInfo.Name;
                }
                else
                {
                    args.levelName = "";
                }               

                yx.DiarysUtil.addShowTextToRichText(this.logRichText, "wudao", args);
                this.logScrollView.scrollToBottom();
            }         
        }
    },
   
});