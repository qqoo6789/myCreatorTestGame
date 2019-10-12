const BaseWindow = require('BaseWindow');

cc.Class({
    extends: BaseWindow,
    properties: {
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
        resultDesc:            cc.Label,
        resultReward:           cc.Node,
        nextBtn:                cc.Button,
    },

    _onInit(){
        yx.eventDispatch.addListener(yx.EventType.QIYU_DOACTION_REFRESH, this.onActionRefresh, this);

        this.btn1.node.on('click',this.onBtn1Click,this);
        this.btn2.node.on('click',this.onBtn2Click,this);
        this.btn3.node.on('click',this.onBtn3Click,this);
        this.nextBtn.node.on('click',this.onNext, this);
    },

    _onShow(){
        this._refresh();
    },

    _onHide(){
        this.unscheduleAllCallbacks();
    },

    _onDeInit(){

    },

    _refresh(){
        this._eventList = yx.JiYuanMgr.getQiYuEventList();
        this._finishList = {};
        this._curIndex = 0;
        this._refreshPageContent();
    },


    _sameUpdate(eventData,evnetConfig){
        this.titleLabel.string = evnetConfig.Name2;
        this.descRichText.string = evnetConfig.DefDesc;

        this.npcNameLabel.string =  evnetConfig.Name;
        this.menpaiNameLabel.string = evnetConfig.Name1;
        
        if (evnetConfig.Icon != null )//&& this._itemInfo.Icon.length > 0)
        {
            yx.resUtil.LoadSpriteFromResConfig(evnetConfig.Icon, yx.ResType.NPC, this.npcIconSp);
        }

        let qiyuRewardCfgs = [];
        for (let index = 0; index < evnetConfig.EventIDs.length; index++) {
            const element = evnetConfig.EventIDs[index];
            let qiyuRewardCfg = yx.cfgMgr.getRecordByKey("QiYuRewardConfig", {"ID":element});
            qiyuRewardCfgs[index] = qiyuRewardCfg;
        }
        
    
        let finishData = this._finishList[eventData.type+"_"+eventData.id];
        if(!finishData)
        {
            this.btn1.node.active = false;
            this.btn2.node.active = false;
            this.btn3.node.active = false;

            this.btnGroup.active = true;
            this.resultGroup.active = false;
            
            if(qiyuRewardCfgs[0].Desc1 != "")
            {
                this.btn1.node.active = true;
                this.btn1.node.getChildByName("Label").getComponent(cc.Label).string = qiyuRewardCfgs[0].Desc1;
            }

            if(qiyuRewardCfgs[1].Desc1 != "")
            {
                this.btn2.node.active = true;
                this.btn2.node.getChildByName("Label").getComponent(cc.Label).string = qiyuRewardCfgs[1].Desc1;
            }

            if(qiyuRewardCfgs[2].Desc1 != "")
            {
                this.btn3.node.active = true;
                this.btn3.node.getChildByName("Label").getComponent(cc.Label).string = qiyuRewardCfgs[2].Desc1;
            }
        }
        else
        {
            this.btnGroup.active = false;
            this.resultGroup.active = true;
           if(finishData.index == 0)
           {
                this.descRichText.string = qiyuRewardCfgs[0].Desc2;
           }
           else if(finishData.index == 1)
           {
                this.descRichText.string = qiyuRewardCfgs[1].Desc2;
           }
           else if(finishData.index == 2)
           {
                this.descRichText.string = qiyuRewardCfgs[2].Desc2;
           }

            this._updateResultDesc(finishData,qiyuRewardCfgs);
        }
    },

    _updateResultDesc(finishData,qiyuRewardCfgs){

        this.resultDesc.string = "";
        this.resultReward.active = false;

        if(finishData.rewards && finishData.rewards.length > 0)
        {
            if(finishData.rewards[0].type == 0)
            {   
              
            }
            else
            {
                this.resultReward.active = true;
                let itemInfo = {};
                itemInfo["content"] = ""+finishData.rewards[0].count;
                itemInfo["ID"] = finishData.rewards[0].id;
                yx.ItemRichTextWidget.CreateItemSlot(itemInfo, this.resultReward, "reward",null);
            }
        }

        if(finishData.index == 0)
        {
            this.resultDesc.string = qiyuRewardCfgs[0].Desc3;
        }
        else if(finishData.index == 1)
        {
            this.resultDesc.string = qiyuRewardCfgs[1].Desc3;
        }
        else if(finishData.index == 2)
        {
            this.resultDesc.string = qiyuRewardCfgs[2].Desc3;
        }
        
        //战斗，并且失败 
        if(finishData.result &&　!finishData.result.win)
        {
            if(finishData.index == 0)
            {
                this.descRichText.string = qiyuRewardCfgs[0].FightDesc1;
                this.resultDesc.string = qiyuRewardCfgs[0].FightDesc2;
            }
            else if(finishData.index == 1)
            {
                this.descRichText.string = qiyuRewardCfgs[1].FightDesc1;
                this.resultDesc.string = qiyuRewardCfgs[1].FightDesc2;
            }
            else if(finishData.index == 2)
            {
                this.descRichText.string = qiyuRewardCfgs[1].FightDesc1;
                this.resultDesc.string = qiyuRewardCfgs[2].FightDesc2;
            }
        }
    
    },

    _refreshPageContent(){ 

        let eventData = this._eventList[this._curIndex];
        let evnetConfig = null;
        if(eventData.type == yx.proto.JiYuanType.QiYu)//奇遇
        {   
            evnetConfig = yx.cfgMgr.getRecordByKey("QiYuListConfig", {"ID":eventData.id});
            if(!evnetConfig){
                return;
            }

            this._sameUpdate(eventData,evnetConfig);

        }

    },

    onBtn1Click(){
        let evetData = this._eventList[this._curIndex];
        yx.JiYuanMgr.DoAction(evetData,0);
    },

    onBtn2Click(){
        let evetData = this._eventList[this._curIndex];
        yx.JiYuanMgr.DoAction(evetData,1);
    },

    onBtn3Click(){
        let evetData = this._eventList[this._curIndex];
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


        if(args.result)
        {
            yx.FightPanel.ShowFightResult("qiyu_fight", "aaa", args.result, false, null, null);
        }
    },

    onNext(){
        this._curIndex = this._curIndex + 1;
        if(this._curIndex < this._eventList.length)
        {
            // 刷新下一个
            this._refreshPageContent();
        }
        else
        {
            // 关闭窗口
            yx.windowMgr.goBack();
        }
    },

});