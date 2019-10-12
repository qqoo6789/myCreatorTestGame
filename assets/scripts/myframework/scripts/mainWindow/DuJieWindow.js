const BaseWindow = require('BaseWindow');



cc.Class({
    extends: BaseWindow,

    properties: {
        uilayer:            cc.Node,
        dujieBtn:           cc.Button,
        waitBtn:            cc.Button,
        exitBtn:            cc.Button,
        succValueLabel:     cc.Label,
        failHintLabel:      cc.Label,
        danItemWidget:      yx.ItemWidget,
        danNameLabel:       cc.Label,
        hintRichText:       cc.RichText,

        startGroup:         cc.Node,
        endGroup:           cc.Node,

        //effect
        effectLayer:        cc.Node,
        dujieEffectAnim:    cc.Animation,
        succEffectNode:     cc.Node,
        failEffectNode:     cc.Node,
        roleAnim:           cc.Animation,
    },

    _onInit(){     
        
        this.dujieBtn.node.on('click', this.onDuJieBtnClick, this);
        this.waitBtn.node.on('click', this.onWaitBtnClick, this);
        this.exitBtn.node.on('click', this.onExitBtnClick, this);
        //this.roleAnim.on('finished', this.onDuJieEffectFinished, this);
        //this.dujieEffectAnim.on('finished', this.onDuJieEffectFinished, this);

        yx.eventDispatch.addListener(yx.EventType.LEVEL_UP, this.onEventLevelUp, this);
        yx.eventDispatch.addListener(yx.EventType.PLAYER_ITEM_CHG, this.onEventItemChange, this);       

        this._succ = false;
        this._lostXiuWei = 0;
        this._danItemId = 0;
    },

 
    _onShow(){      
        this._refresh(); 
    },

    _setSucc(succ)
    {
        this._succ = succ;

        if (this._succ)
        {
            this._textlist = yx.textDict.DuJie.DuJieing.concat(yx.textDict.DuJie.Succ);
        }
        else
        {
            this._textlist = yx.textDict.DuJie.DuJieing.concat(yx.textDict.DuJie.Fail);
        }
    },

    _refresh(){
        this.effectLayer.active = false;
        //this.uilayer.active = true;
        this.succEffectNode.active = false;
        this.failEffectNode.active = false;
        
        this.endGroup.active = false;
        this.startGroup.opacity = 255;
        this.startGroup.active = true;

        this.roleAnim.node.color = new cc.Color(100, 100, 100, 255);

        this.succValueLabel.string = "";
        this.failHintLabel.string = "若失败降低修为" + 0;

        this._refreshDanItem();
    },

    _refreshDanItem()
    {
        let dujieInfo = yx.playerMgr.dujieInfo;

        if (dujieInfo.UseItemID > 0)
        {         
            this._lostXiuWei = dujieInfo.FailCost[0].count;

            this.succValueLabel.string = dujieInfo.UpSuccRate / 100 + "%";
            this.failHintLabel.string = "若失败降低修为" + this._lostXiuWei;      
            
            this._danItemId = dujieInfo.UseItemID;

            let danyaoCfg = yx.cfgMgr.getOneRecord("ItemConfig", {ID:this._danItemId});

            if (danyaoCfg)
            {
                this.danNameLabel.string = danyaoCfg.Name;            
    
                let itemInfo = {};
                itemInfo.itemId = danyaoCfg.ID;
                itemInfo.amount = yx.bagMgr.getItemNum(danyaoCfg.ID);
                itemInfo.clickCallBack = this._danItemClick;
    
                this.danItemWidget.init(itemInfo);
            }
        }        
    },

    _refreshDanAmount(){
        let danAmount = yx.bagMgr.getItemNum(this._danItemId);

        this.danItemWidget.changeAmount(danAmount);
    },

    //点击丹药
    _danItemClick(itemInfo){
        if (itemInfo.amount == 0)
        {
            yx.ToastUtil.showListToast(itemInfo.Name + "不足");
        }
        else
        {
            let itemMsg = yx.bagMgr.getItemByItemId(itemInfo.itemId);

            if (itemMsg)
            {
                yx.windowMgr.showWindow("itemUsePanel", itemMsg);
            }            
        }
    },

    _refreshRichText()
    {
        if (this._textlist.length > 0)
        {
            this.hintRichText.string = this._textlist.shift().format({name:yx.playerMgr.getName(), levelName:yx.playerMgr.dujieInfo.Name, num:this._lostXiuWei});
        }        
    },

    onDuJieBtnClick(){
        if (yx.playerMgr.getExp() >= yx.playerMgr.dujieInfo.Cost[0].count)
        {
            yx.playerMgr.reqDuJieLevelUp();
        }
        else
        {
            yx.ToastUtil.showListToast("修为不足");
            return;
        }
    },

    _startDuJieEffect(){

        //this.uilayer.active = false;
        //this.succEffectNode.active = this._succ;
        //this.failEffectNode.active = !this._succ;
        let action = cc.fadeOut(0.2);
        this.startGroup.runAction(action);

        this.effectLayer.active = true;
        
        this.dujieEffectAnim.play();
        //this.roleAnim.play();

        this.exitBtn.node.active = false;
        this.hintRichText.node.active = true;
        this.endGroup.active = true;   
        
        let lightColor = cc.Color.WHITE;
        let darkColor = new cc.Color(100, 100, 100, 255);
        let aColor = darkColor;
        let bColor = lightColor;

        this.roleAnim.node.color = aColor;
        
        let roleAction = cc.sequence(
            cc.delayTime(7.1), cc.tintTo(0.1, bColor.getR(), bColor.getG(), bColor.getB()), cc.tintTo(0.1, aColor.getR(), aColor.getG(), aColor.getB()),
            cc.delayTime(1.2), cc.tintTo(0.1, bColor.getR(), bColor.getG(), bColor.getB()), cc.tintTo(0.1, aColor.getR(), aColor.getG(), aColor.getB()),
            cc.delayTime(1.4), cc.tintTo(0.1, bColor.getR(), bColor.getG(), bColor.getB()), cc.tintTo(0.1, aColor.getR(), aColor.getG(), aColor.getB()),
            cc.delayTime(1.4), cc.tintTo(0.1, bColor.getR(), bColor.getG(), bColor.getB()), cc.tintTo(0.1, aColor.getR(), aColor.getG(), aColor.getB()),
            cc.delayTime(1.2), cc.tintTo(0.1, bColor.getR(), bColor.getG(), bColor.getB()), cc.tintTo(0.1, aColor.getR(), aColor.getG(), aColor.getB()),
            cc.delayTime(0.5), cc.tintTo(0.1, bColor.getR(), bColor.getG(), bColor.getB()), cc.tintTo(0.1, aColor.getR(), aColor.getG(), aColor.getB()),
            cc.delayTime(1.0), cc.tintTo(0.1, bColor.getR(), bColor.getG(), bColor.getB()), cc.tintTo(0.1, aColor.getR(), aColor.getG(), aColor.getB()),
            cc.delayTime(0.7), cc.tintTo(0.1, bColor.getR(), bColor.getG(), bColor.getB()), cc.tintTo(0.1, aColor.getR(), aColor.getG(), aColor.getB()),
            cc.delayTime(2.1), cc.tintTo(0.1, bColor.getR(), bColor.getG(), bColor.getB()), cc.tintTo(0.1, aColor.getR(), aColor.getG(), aColor.getB()),
            cc.tintTo(0.1, bColor.getR(), bColor.getG(), bColor.getB()), cc.tintTo(0.1, aColor.getR(), aColor.getG(), aColor.getB()),
            cc.tintTo(0.1, bColor.getR(), bColor.getG(), bColor.getB()), cc.tintTo(0.1, aColor.getR(), aColor.getG(), aColor.getB()),
        );

        let textAction = cc.sequence(
            cc.callFunc(this._refreshRichText, this), /*cc.hide(),*/ cc.fadeIn(0.5), cc.delayTime(1), cc.fadeOut(0.5),          //第一句2s
            cc.delayTime(0.5), cc.callFunc(this._refreshRichText, this), cc.fadeIn(0.5), cc.delayTime(1), cc.fadeOut(0.5),      //第二句4.5s
            cc.delayTime(0.5), cc.callFunc(this._refreshRichText, this), cc.fadeIn(0.5), cc.delayTime(1), cc.fadeOut(0.5),      //第三句7s    
            cc.delayTime(3.3), cc.callFunc(this._refreshRichText, this), cc.fadeIn(0.5), cc.delayTime(1), cc.fadeOut(0.5),      //第四句12.3s 从10.3秒开始
            cc.delayTime(5.9), cc.callFunc(this._refreshRichText, this), cc.fadeIn(0.5), cc.hide(),                             //第五句18.7s   从18.2s开始
            cc.delayTime(1.2), cc.callFunc(this._refreshRichText, this), cc.show(),                                             //第六句19.9s
            cc.delayTime(0.1), cc.callFunc(this.onDuJieEffectFinished, this),                                                         
        );

        this.roleAnim.node.runAction(roleAction);
        this.hintRichText.node.runAction(textAction);
    },

    onWaitBtnClick(){
        yx.windowMgr.goBack();
    },

    onExitBtnClick(){
        yx.windowMgr.goBack();
    },

    //渡劫所有动画特效结果
    onDuJieEffectFinished(){
        if (this._succ)
        {
            this.succEffectNode.active = true;
        }
        else
        {
            this.failEffectNode.active = true;
        }

        this.exitBtn.node.active = true;


        // let action = cc.fadeIn(1);

        // this.exitBtn.node.runAction(action);

        this._refreshDanItem();
    },

    onEventLevelUp(resp){
        // message S2C_LevelUp {
        //     optional int32 level = 1;//当前等级
        //     optional LevelUpType type = 2;
        // }
        if (this.isShown())
        {  
            if (resp.type == yx.proto.LevelUpType.DU_JIE)
            { 
                this._setSucc(resp.succ);       
                
                this._startDuJieEffect();
            }
        }
    },

    onEventItemChange(changeNotify){
        if (this.isShown())
        {
            let findList = changeNotify.add.concat(changeNotify.sub);
            let findItem =  findList.find(elem => {
                return elem.itemId == this._danItemId;
            });

            if (findItem != null)
            {
                //刷新丹药数量
                this._refreshDanAmount();
            }   
        }
    },  
});