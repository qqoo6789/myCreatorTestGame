const BaseWindow = require('BaseWindow');

cc.Class({
    extends: BaseWindow,
    properties: {
        bg1:                    cc.Sprite,
        bg2:                    cc.Sprite,
        bg3:                    cc.Sprite,
        bg4:                    cc.Sprite,
        titleLabel:             cc.Label,
        npcIconSp:             cc.Sprite,
        npcNameLabel:      cc.Label,
        menpaiNameLabel:        cc.Label,
        descRichText:               cc.RichText,
        btnGroup:               cc.Node,
        btn1:                   cc.Button,
        btn2:                   cc.Button,
        btn3:                   cc.Button,
        resultGroup:            cc.Node,
        resultDesc1:            cc.Label,
        resultDesc2:            cc.Label,
        resultNothing:            cc.Label,
        resultReward:           cc.Node,
        
        pageLabel:              cc.Label,
        leftBtn:                cc.Button,
        rightBtn:               cc.Button,

        middleGroup:            cc.Node,
        bottomGroup:            cc.Node,
        emptyGroup:             cc.Node,
    },

    _onInit(){
        yx.eventDispatch.addListener(yx.EventType.JIYUAN_INFO_REFRESH, this.onRefresh, this);
        yx.eventDispatch.addListener(yx.EventType.JIYUAN_DOACTION_REFRESH, this.onActionRefresh, this);

        this._bgArr = [this.bg1,this.bg2,this.bg3,this.bg4];

        this.leftBtn.node.on('click',this.onLeftBtnClick, this);
        this.rightBtn.node.on('click',this.onRightBtnClick, this);

        this.btn1.node.on('click',this.onBtn1Click,this);
        this.btn2.node.on('click',this.onBtn2Click,this);
        this.btn3.node.on('click',this.onBtn3Click,this);
    },

    _onShow(){
        this.middleGroup.active = false;
        this.bottomGroup.active = false;
        this.emptyGroup.active = true;
        this.titleLabel.string = "";

        yx.JiYuanMgr.Info();
    },

    _onHide(){
        this.unscheduleAllCallbacks();
    },

    _onDeInit(){

    },

    _refresh(){
        this._eventList = yx.JiYuanMgr.getEventList();

        this._maxPage = this._eventList.length;
        this._curPage = 1;

        this._finishList = {};

        this._refreshPageContent();

    },

    _changeBg(type){
        for (let index = 0; index < this._bgArr.length; index++) {
            const element = this._bgArr[index];
            if((index + 1) == type)
            {
                element.node.active = true;
            }
            else
            {
                element.node.active = false;
            }
        }
    },

    _sameUpdate(eventData,evnetConfig,npcConfig){
        this.titleLabel.string = evnetConfig.Name;
        this.descRichText.string = evnetConfig.EventDesc;

        this.npcNameLabel.string =  npcConfig.Name;
        let menpaiCfg = yx.menPaiMgr.getMenPaiConfig(npcConfig.MenPaiID);
        this.menpaiNameLabel.string = "";
        if(menpaiCfg)
        {
            this.menpaiNameLabel.string = menpaiCfg.DefName;
        }
        if (npcConfig.Icon != null )//&& this._itemInfo.Icon.length > 0)
        {
            yx.resUtil.LoadSpriteFromResConfig(npcConfig.Icon, yx.ResType.NPC, this.npcIconSp);
        }

        this._changeBg(eventData.type);


        // 还没有做的机缘
        let finishData = this._finishList[eventData.type+"_"+eventData.id];
        if(!finishData)
        {
            this.btn1.node.active = false;
            this.btn2.node.active = false;
            this.btn3.node.active = false;

            this.btnGroup.active = true;
            this.resultGroup.active = false;
            cc.log("1111111111111");
            if(evnetConfig.OptionDesc1 != "")
            {
                this.btn1.node.active = true;
                this.btn1.node.getChildByName("Label").getComponent(cc.Label).string = evnetConfig.OptionDesc1;
            }

            if(evnetConfig.OptionDesc2 != "")
            {
                this.btn2.node.active = true;
                this.btn2.node.getChildByName("Label").getComponent(cc.Label).string = evnetConfig.OptionDesc2;
            }

            if(evnetConfig.OptionDesc3 != "")
            {
                this.btn3.node.active = true;
                this.btn3.node.getChildByName("Label").getComponent(cc.Label).string = evnetConfig.OptionDesc3;
            }
        }
        else
        {
            this.btnGroup.active = false;
            this.resultGroup.active = true;
            cc.log("finishData=="+finishData);
           if(finishData.index == 0)
           {
                this.descRichText.string = evnetConfig.TalkID1;
           }
           else if(finishData.index == 1)
           {
                this.descRichText.string = evnetConfig.TalkID2;
           }
           else if(finishData.index == 2)
           {
                this.descRichText.string = evnetConfig.TalkID3;
           }

             // 如果是赌博，并且下注了，如果有奖励，就显示第一句话，没有奖励就显示第二句话
             if(finishData.info.type == yx.proto.JiYuanType.DuBo && finishData.index != 2)
             {
                if(finishData.rewards && finishData.rewards.length > 0)
                {
                    this.descRichText.string = evnetConfig.TalkID1;
                }
                else
                {
                    this.descRichText.string = evnetConfig.TalkID2;
                }
             }

            this._updateResultDesc(finishData);
        }
    },

    _updateResultDesc(finishData){

        this.resultDesc1.string = "";
        this.resultDesc2.string = "";
        this.resultNothing.string = "";
        this.resultReward.active = false;

        let content1 = "";
        let content2 = "";
        let npcName = "";
        if(this._npcConfig)
        {
            npcName = this._npcConfig.Name;
        }
        if(finishData.haogan && finishData.haogan > 0){
            content1 = "与{npcName}好感度增加{add}";
            content1 = content1.format({npcName:npcName,add:finishData.haogan});
        }   
        else if(finishData.rewards && finishData.rewards.length > 0)
        {
            if(finishData.rewards[0].type == 0)
            {   
                // let itemId = finishData.rewards[0].id + 80000;
                let rewardName  = yx.bagMgr.GetItemName(finishData.rewards[0].type,finishData.rewards[0].id);
                content1 = rewardName + "增加了"+finishData.rewards[0].count;  
            }
            else
            {
                let rewardName = yx.bagMgr.GetItemName(finishData.rewards[0].type,finishData.rewards[0].id);
                content1 = "你获得了{rewardName}*{add}";
                content1 = content1.format({rewardName:rewardName,add:finishData.rewards[0].count});

                this.resultReward.active = true;
                let itemInfo = {};
                itemInfo["content"] = ""+finishData.rewards[0].count;
                itemInfo["ID"] = finishData.rewards[0].id;
                yx.ItemRichTextWidget.CreateItemSlot(itemInfo, this.resultReward, "reward",null);
            }
        }

        if(finishData.costs && finishData.costs.length > 0)
        {
            let costsName = yx.bagMgr.GetItemName(finishData.costs[0].type,finishData.costs[0].id);
            let content = "你失去了{cost}{costsName}";
            content = content.format({costsName:costsName,cost:finishData.costs[0].count});
            
            // 如果是赌博，并且中了，就不显示消耗的灵石
            if(finishData.info.type == yx.proto.JiYuanType.DuBo && finishData.rewards && finishData.rewards.length > 0)
            {
                content = "";
            }

            if(content1 == "")
            {
                content1 = content;
            }
            else
            {
                content2 = content;
            }

            
        }

        if(content1 == "" && content2 == "")
        {
            this.resultNothing.string = "没有发现任何事情";
        }

        
        
        this.resultDesc1.string = content1;
        this.resultDesc2.string = content2;

    
    },

    _refreshPageContent(){

        if(this._maxPage == 0)
        {   
            this.middleGroup.active = false;
            this.bottomGroup.active = false;
            this.emptyGroup.active = true;
            this.titleLabel.string = "";

            return;
        }
        this.middleGroup.active = true;
        this.bottomGroup.active = true;
        this.emptyGroup.active = false;


        this._refreshPageBtns();

        let eventData = this._eventList[this._curPage -1];
        let evnetConfig = null;
        this._npcConfig = null;
        if(eventData.type == yx.proto.JiYuanType.DaoLv)//道侣
        {   
            evnetConfig = yx.cfgMgr.getRecordByKey("DaoLvEventConfig", {"ID":eventData.id});
            if(!evnetConfig){
                return;
            }

            cc.log("111eventData.npcID=="+eventData.npcID);

            let daoLvCfg = yx.cfgMgr.getRecordByKey("DaoLvListConfig", {ID:eventData.npcID});
            if(!daoLvCfg){
                return;
            }

            this._npcConfig = yx.cfgMgr.getRecordByKey("NpcListConfig", {"ID":daoLvCfg.NpcID});

            this._sameUpdate(eventData,evnetConfig,this._npcConfig);

        }
        else if(eventData.type == yx.proto.JiYuanType.GuDing)//固定
        {
            evnetConfig = yx.cfgMgr.getRecordByKey("GuDingEventConfig", {"ID":eventData.id});
            if(!evnetConfig){
                return;
            }
            this._npcConfig = yx.cfgMgr.getRecordByKey("NpcListConfig", {"ID":evnetConfig.NpcID});

            this._sameUpdate(eventData,evnetConfig,this._npcConfig);

        }
        else if(eventData.type == yx.proto.JiYuanType.DuBo)//赌博
        {
            evnetConfig = yx.cfgMgr.getRecordByKey("DuBoEventConfig", {"ID":eventData.id});
            if(!evnetConfig){
                return;
            }
            this._npcConfig = yx.cfgMgr.getRecordByKey("NpcListConfig", {"ID":evnetConfig.NpcID});

            this._sameUpdate(eventData,evnetConfig,this._npcConfig);
        }
        else if(eventData.type == yx.proto.JiYuanType.MenPai)//门派
        {
            evnetConfig = yx.cfgMgr.getRecordByKey("MenPaiEventConfig", {"ID":eventData.id});
            if(!evnetConfig){
                return;
            }

            cc.log("222eventData.npcID=="+eventData.npcID);

            this._npcConfig = yx.cfgMgr.getRecordByKey("NpcListConfig", {"ID":eventData.npcID});

            this._sameUpdate(eventData,evnetConfig,this._npcConfig);

            
        }

        
    },

    _refreshPageBtns(){
        if(this._curPage <= 1)
        {
            this.leftBtn.interactable = false;
        }
        else
        {
            this.leftBtn.interactable = true;
        }
        if(this._curPage >= this._maxPage)
        {
            this.rightBtn.interactable = false;
        }
        else
        {
            this.rightBtn.interactable = true;
        }

        this.pageLabel.string = this._curPage+"/"+this._maxPage;
        
    },

    onLeftBtnClick(){
        this._curPage = this._curPage - 1;
        this._refreshPageContent();
    },

    onRightBtnClick(){
        this._curPage = this._curPage + 1;
        this._refreshPageContent();
    },


    onBtn1Click(){
        let evetData = this._eventList[this._curPage-1];
        yx.JiYuanMgr.DoAction(evetData,0);
    },

    onBtn2Click(){
        let evetData = this._eventList[this._curPage-1];
        yx.JiYuanMgr.DoAction(evetData,1);
    },

    onBtn3Click(){
        let evetData = this._eventList[this._curPage-1];
        yx.JiYuanMgr.DoAction(evetData,2);
    },

    onActionRefresh(args){
        for (let index = 0; index < this._eventList.length; index++) {
            const element = this._eventList[index];
            if(element.type == args.info.type  &&　element.id == args.info.id )
            {
                cc.log("element.type=="+element.type);
                cc.log("element.id=="+element.id);
                cc.log("args.index=="+args.index);
                this._finishList[element.type+"_"+element.id] = args;
            }
        }

        this._refreshPageContent();
    },

    onRefresh(){

        this._refresh();
    },

});