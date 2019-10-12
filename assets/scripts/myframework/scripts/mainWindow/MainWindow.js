const BaseWindow = require('BaseWindow');

const _TuPoLevel = 10;
const _XiuLianPbDuration = 5.2;

cc.Class({
    extends: BaseWindow,

    properties: { 
        //角色信息区       
        headBtn:                cc.Button,
        roleNameLabel:          cc.Label,
        roleMenPaiLabel:        cc.Label,
        roleLevelLabel:         cc.Label,
        //roleHeadSprite:         cc.Sprite,
        lingshiValueLabel:      cc.Label,
        weiwangValueLabel:      cc.Label,
        xiulianValueLabel:      cc.Label,

        //角色展示区
        roleSpine:              sp.Skeleton,
        roleDragon:             dragonBones.ArmatureDisplay,
        bgSprite:               cc.Sprite,
        shadowSprite:           cc.Sprite,

        //活动按钮区
        bagBtn:                 cc.Button,
        huodongBtn:             cc.Button,
        fangshiBtn:             cc.Button,
        mailBtn:                cc.Button,
        xianduBtn:              cc.Button,
        settingBtn:             cc.Button,

        //机缘区
        jiyuanBtn:              cc.Button,

        //渡劫区
        dujieBtn:               cc.Button,
        cuitiBtn:               cc.Button,
        dujieLevelLabel:        cc.Label,
        cuitiLevelLabel:        cc.Label,
        dujieUnlockNode:        cc.Node,
        dujieLockNode:          cc.Node,
        dujieBtnEffect:         cc.Node,//渡劫按钮上的特效
        //tupoLoopEffect:         cc.Node,


        //修为区
        xiuweiLabel:            cc.Label,
        xiaolvLabel:            cc.Label,
        xiulianPbNode:          cc.Node,
        xiulianProgressBar:     cc.ProgressBar,
        xiulianBtn:             cc.Button,
        tupoBtn:                cc.Button,
        hintLabel:              cc.Label,
        tupoBaoAnim:            cc.Animation,
        xiulianTimeNode:        cc.Node,
        xiulianTimeLabel:       cc.Label,

        //灵根区
        linggenBtn:             cc.Button,
        gongfaBtn:              cc.Button,
        menpaiBtn:              cc.Button,
        dongfuBtn:              cc.Button,
        lilianBtn:              cc.Button,

        //日志区
        bigEventBtn:            cc.Button,
        diaryScrollView:        cc.ScrollView,
        diaryRichText:          cc.RichText,
    },

    _onInit(){
        this.headBtn.node.on('click', this.onHeadBtnClick, this);

        this.bagBtn.node.on('click', this.onBagBtnClick, this);
        this.huodongBtn.node.on('click', this.onHuoDongBtnClick, this);
        this.fangshiBtn.node.on('click', this.onFangShiBtnClick, this);
        this.mailBtn.node.on('click', this.onMailBtnClick, this);
        this.xianduBtn.node.on('click', this.onXianDuBtnClick, this);
        this.settingBtn.node.on('click', this.onSettingBtnClick, this);

        this.jiyuanBtn.node.on('click', this.onJiYuanBtnClick, this);

        this.dujieBtn.node.on('click', this.onDuJieBtnClick, this);
        this.cuitiBtn.node.on('click', this.onCuiTiBtnClick, this);

        this.tupoBtn.node.on('click', this.onTuPoBtnClick, this);
        this.xiulianBtn.node.on('click', this.onXiuLianBtnClick, this);

        this.linggenBtn.node.on('click', this.onLingGenBtnClick, this);
        this.gongfaBtn.node.on('click', this.onGongFaBtnClick, this);
        this.menpaiBtn.node.on('click', this.onMenPaiBtnClick, this);
        this.dongfuBtn.node.on('click', this.onDongFuBtnClick, this);
        this.lilianBtn.node.on('click', this.onLiLianBtnClick, this);

        this.bigEventBtn.node.on('click', this.onBigEventBtnClick, this);      
        
        this.tupoBaoAnim.on('finished', this.onTuPoBaoAnimFinished, this);

        yx.eventDispatch.addListener(yx.EventType.CURRENCY_CHANGE, this.onEventCurrencyChange, this);
        yx.eventDispatch.addListener(yx.EventType.LEVEL_UP, this.onEventLevelUp, this);
        yx.eventDispatch.addListener(yx.EventType.XIU_LIAN, this.onEventXiuLian, this);
  
        yx.DiarysUtil.setRichTextWithShowList(this.diaryRichText, "main");

        this._tupoAnimPlaying = false;
        this._xiulianElapse = 0;
        this._xiulianPbElapse = 0;

        //在某些地方需要用到的数据，先执行一次
        yx.caveMgr.reqMakeRoom(yx.CaveBuildType.DANFANG);
        yx.caveMgr.reqMakeRoom(yx.CaveBuildType.QISHI);
        yx.caveMgr.reqAllBook();
    },

    _onShow(){
        //test code
        if (YX_LOCAL_TEST)
        {
            let playerMsg = {};
     
            playerMsg.pid = 0;
            playerMsg.name = "方世玉";
            playerMsg.icon = "1";
            playerMsg.channel = "channel";
            playerMsg.level1 = 99;
            playerMsg.level2 = 35;
            playerMsg.exp = 0;     
            playerMsg.registerTime = 1564628040000;

            yx.timeUtil.setServerTime(Date.now());
            yx.playerMgr.setPlayerMsg(playerMsg);
        }

        this._refresh();

        //cc.log(yx.textDict.CyText(yx.CyType.LINGSHI));

        this._showLiXian();
    },

    _onHide(){
        this.unscheduleAllCallbacks();
    },

    _onDeInit(){

    },

    update(dt){
        //更新修炼进度条
        if (this.xiulianPbNode.active == true)
        {
            //if (this._xiulianPbElapse > 0)
            {
                this._xiulianPbElapse += dt;
    
                this.xiulianProgressBar.progress = this._xiulianPbElapse / _XiuLianPbDuration;
            }
        }        
    },

    _showLiXian(){     
        if (yx.playerMgr.getLiXian() == null)
        {
            return;
        }

        yx.windowMgr.showWindow("lixian");
    },

    _refresh(){
        this.roleNameLabel.string = yx.playerMgr.getName();
        //this.roleMenPaiLabel.string =      
        this._refreshLevel();

        this._refreshXiuWei();

        this._refreshCurrency();

        this.onEventXiuLian();
    },

    //等级变化时刷新
    _refreshLevel(){
        this.roleLevelLabel.string = yx.playerMgr.dujieInfo.Name;

        this.dujieLevelLabel.string = "境界·" + yx.playerMgr.dujieInfo.Name + "\n" 
        + yx.playerMgr.dujieInfo.Cost[0].count + "修为";
        this.cuitiLevelLabel.string = "肉身·" + yx.playerMgr.cuitiInfo.Name + "\n" 
        + yx.playerMgr.cuitiInfo.UpCost[0].count + "修为";     

        this.xiaolvLabel.string = "(" + yx.playerMgr.dujieInfo.MinExp + "~" + yx.playerMgr.dujieInfo.MaxExp + ")/5秒";
     
        this.dujieUnlockNode.active = yx.playerMgr.getDuJieLevel() > _TuPoLevel;
        this.dujieLockNode.active = !this.dujieUnlockNode.active;

        let charCfg = yx.cfgMgr.getOneRecord("CharacterAvatarConfig", {ZhongZu: yx.playerMgr.getZhongZu(), Level: yx.playerMgr.getDuJieLevel()});

        if (charCfg)
        {
            //场景
            yx.resUtil.LoadSpriteByType(charCfg.BG, yx.ResType.SCENE_BG, this.bgSprite);

            let avatarId = charCfg.AvatarID;
            let avatarCfg = yx.cfgMgr.getOneRecord("AvatarListConfig", {ID: avatarId});

            if (avatarCfg)
            {
                let type = avatarCfg.Type;
                let avatarName = avatarCfg.Avatar;//"huliegg1";
                let animName = avatarCfg.AnimName;//"egg";

                let offset = yx.CodeHelper.array2ccv2(avatarCfg.Offset);

                //角色
                if (type == 1)//dragonbones
                {
                    this.roleSpine.node.active = false;
                    this.roleDragon.node.active = true;

                    this.roleDragon.node.setScale(avatarCfg.Rate / 100);
                    this.roleDragon.node.setPosition(offset.sub(this.roleDragon.node.parent.getPosition()));       
                    
                    this.shadowSprite.node.setPosition(this.roleDragon.node.getPosition());
             
                    yx.resUtil.loadRoleDragonBones(this.roleDragon, avatarName, animName);
                }
                else if (type == 2)//spine
                {
                    this.roleSpine.node.active = true;
                    this.roleDragon.node.active = false;

                    this.roleSpine.node.setScale(avatarCfg.Rate / 100);
                    this.roleSpine.node.setPosition(offset.sub(this.roleSpine.node.parent.getPosition()));

                    this.shadowSprite.node.setPosition(this.roleSpine.node.getPosition());

                    yx.resUtil.loadRoleSpineAnimation(this.roleSpine, avatarName, animName);
                }

                //角色阴影              
                let shadowSize = yx.CodeHelper.array2ccv2(avatarCfg.Shadow);
                this.shadowSprite.node.setContentSize(shadowSize.x, shadowSize.y);                
            }       
        }       
    },

    _refreshCurrency(){
        this.lingshiValueLabel.string = yx.playerMgr.getCurrency(yx.CyType.LINGSHI);
        this.weiwangValueLabel.string = yx.playerMgr.getCurrency(yx.CyType.WEIWANG);
        this.xiulianValueLabel.string = yx.timeUtil.getXiuLianYear() + "年";
    },

    //刷新与修炼经验值相关的UI
    _refreshXiuWei(){
        let expEnough = yx.playerMgr.getExp() >= yx.playerMgr.dujieInfo.Cost[0].count;
        this.xiuweiLabel.string =  yx.playerMgr.getExp() + "/" + yx.playerMgr.dujieInfo.Cost[0].count;      

        if (yx.playerMgr.getDuJieLevel() > _TuPoLevel)//达到等级，自动修炼
        {
            this.xiuweiLabel.node.parent.getComponent(cc.Label).string = "总修为：";         

            this.xiulianBtn.node.active = false;
            this.tupoBtn.node.active = false;
            this.hintLabel.node.active = false;

            this.dujieBtnEffect.active = expEnough;            

            this.xiulianPbNode.active = true;
        }
        else//低等级，手动修炼
        {
            this.xiuweiLabel.node.parent.getComponent(cc.Label).string = "突破需要修为：";

            this.xiulianBtn.node.active = this._xiulianElapse <= 0;
            this.tupoBtn.node.active = expEnough && !this._tupoAnimPlaying;
            this.hintLabel.node.active = true;

            this.xiulianPbNode.active = false;
        }  
    }, 

    //刷新修炼时间
    _refreshXiuLianTime()
    {
        if (this._xiulianElapse > 0)
        {
            this._xiulianElapse--;
        }     

        this.xiulianTimeLabel.string = yx.timeUtil.seconds2hourMinSecond(this._xiulianElapse);

        if (this._xiulianElapse <= 0)
        {
            this.unschedule(this._refreshXiuLianTime, this);
            this.xiulianBtn.node.active = yx.playerMgr.getDuJieLevel() <= _TuPoLevel;
            this.xiulianTimeNode.active = false;
        }
    },

    //按钮响应事件
    //头像点击    要进设置
    onHeadBtnClick(){
        //yx.windowMgr.showWindow("bag");
    },

    onBagBtnClick(){
        yx.windowMgr.showWindow("bag");
    },


    onHuoDongBtnClick(){
        yx.windowMgr.showWindow("activity");
    },

    onFangShiBtnClick(){
        yx.windowMgr.showWindow("fangshi");
    },

    onMailBtnClick(){
        yx.windowMgr.showWindow("mail");
    },

    onXianDuBtnClick(){

    },

    onSettingBtnClick(){
        //test code 点设置返回登录界面 测试场景跳转
        cc.log("onSettingBtnClick");

        yx.sceneMgr.loadScene("login", function(isSucc){
            cc.log("onSettingBtnClick load scene succ:" + isSucc);

            if (isSucc)
            {
                //要改到windowMgr自己的注册事件中处理
                //yx.windowMgr.resetRootNode();
                yx.windowMgr.showWindow("login");
                //yx.windowMgr.showWindow("TownWindow");
            }
        });
    },   

    onJiYuanBtnClick(){
        yx.windowMgr.showWindow("jiyuan");
    },

    //渡劫
    onDuJieBtnClick(){
        // yx.windowMgr.showWindow("dujie");
        // return;

        if (yx.playerMgr.getDuJieLevel() <= _TuPoLevel)
        {
            return;
        }

        if (yx.playerMgr.getExp() >= yx.playerMgr.dujieInfo.Cost[0].count)
        {
            yx.windowMgr.showWindow("dujie");
            //yx.playerMgr.reqDuJieLevelUp();
        }
        else
        {
            yx.ToastUtil.showListToast("修为不足");
        }
    },

    //淬体
    onCuiTiBtnClick(){
        if (yx.playerMgr.getExp() >= yx.playerMgr.cuitiInfo.UpCost[0].count)
        {
            yx.playerMgr.reqCuiTiLevelUp();
        }
        else
        {
            yx.ToastUtil.showListToast("修为不足");
        }
    },

    onTuPoBtnClick(){
        if (yx.playerMgr.getDuJieLevel() <= _TuPoLevel)
        {            
            //this.onDuJieBtnClick();
            yx.playerMgr.reqDuJieLevelUp();
        }        
    },

    onXiuLianBtnClick(){
        if (yx.playerMgr.getDuJieLevel() <= _TuPoLevel)
        {
            yx.playerMgr.reqPlayerXiuLian();
        }
    },

    onLingGenBtnClick(){
        yx.windowMgr.showWindow("wudao");
    },

    onGongFaBtnClick(){
        yx.windowMgr.showWindow("gongfa");
    },

    onMenPaiBtnClick(){
        yx.windowMgr.showWindow("menPai");
    },

    onDongFuBtnClick(){
        //检查等级限制
        let openCfg = yx.cfgMgr.getRecordByKey("FuncOpenConfig", {ID:21});
        if (yx.playerMgr.getDuJieLevel() < openCfg["conditionnum"]) {
            yx.ToastUtil.showListToast(openCfg["opencondition"]);
            return;
        }

        yx.windowMgr.showWindow("dongfu");
    },

    onLiLianBtnClick(){
        //检查等级限制
        let openCfg = yx.cfgMgr.getRecordByKey("FuncOpenConfig", {ID:23});
        if (yx.playerMgr.getDuJieLevel() < openCfg["conditionnum"]) {
            yx.ToastUtil.showListToast(openCfg["opencondition"]);
            return;
        }
        yx.windowMgr.showWindow("liLianWindow");
    },

    onBigEventBtnClick(){

    },

    onTuPoBaoAnimFinished(){
        this._tupoAnimPlaying = false;
        this._refreshXiuWei();
    },


    onEventCurrencyChange(diff){
        if (this.isShown())
        {
            if (diff[yx.CyType.XIUWEI])
            {
                yx.ToastUtil.showSimpleToast("修为提升：" + diff[yx.CyType.XIUWEI], this.node);
                this._xiulianPbElapse = 0;
                this._refreshXiuWei();                
            }
            
            //货币每次都刷新
            this._refreshCurrency();
        }
    },

    onEventLevelUp(resp){
        // message S2C_LevelUp {
        //     optional int32 level = 1;//当前等级
        //     optional LevelUpType type = 2;
        // }
        if (this.isShown())
        {
            this._refreshLevel();
            this._refreshXiuWei();

            let args = {};
            args.name = yx.playerMgr.getName();
            args.year = yx.timeUtil.getXiuLianYear();
            args.levelName = yx.playerMgr.dujieInfo.Name;            

            if (resp.type == yx.proto.LevelUpType.DU_JIE)
            {                
                if (resp.succ)
                {
                    args.index = 0;
                    args.amount = 0;

                    let dropCfg = yx.cfgMgr.getRecordByKey("DropConfig", yx.playerMgr.dujieInfo.RewardId);

                    if (dropCfg)
                    {
                        args.amount = dropCfg.drop_value[0].count;
                    }

                    if (yx.playerMgr.getDuJieLevel() <= _TuPoLevel + 1)
                    {
                        this._tupoAnimPlaying = true;
                        this.tupoBtn.active = false;
                        this.tupoBaoAnim.play();
                        //this.tupoBaoAnim.play("main_tupobao");
                    }
                }
                else
                {
                    args.index = 1;
                }

                yx.DiarysUtil.addShowTextToRichText(this.diaryRichText, "main", args);
                this.diaryScrollView.scrollToBottom();
            }
            else if (resp.type == yx.proto.LevelUpType.CUI_TI)
            {
                args.index = 2;
                args.cuitiLevelName = yx.playerMgr.cuitiInfo.Name;

                yx.DiarysUtil.addShowTextToRichText(this.diaryRichText, "main", args);
                this.diaryScrollView.scrollToBottom();
            }
        }
    },    

    //手动修炼
    onEventXiuLian(){     
        if (!this.isShown())
        {
            return;
        }
        
        this._xiulianElapse = yx.playerMgr.getXiuLianElapse();

        //更新手动修炼时间
        if (this._xiulianElapse > 0)
        {
            this.xiulianBtn.node.active = false;
            this.xiulianTimeNode.active = true;
            this.xiulianTimeLabel.string = yx.timeUtil.seconds2hourMinSecond(this._xiulianElapse);

            this.schedule(this._refreshXiuLianTime, 1);
        }
        else
        {
            this._refreshXiuLianTime();
        }        
    },
   
});