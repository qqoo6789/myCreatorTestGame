const BaseWindow = require('BaseWindow');
const HeiShiItem = require('HeiShiItem');

cc.Class({
    extends: BaseWindow,
    properties: {
        lingshiLabel:       cc.Label,

        // 进入界面
        openGroup:      cc.Node,
        desc:           cc.RichText,
        intoBtn:        cc.Button,
        intoBtnDesc:    cc.Label,
        conditionDesc:       cc.RichText,

        // 游戏界面
        playGroup:      cc.Node,
        boxGroup:       cc.Node,
        progress:       cc.ProgressBar,
        progresstime:           cc.RichText,
        progressdesc:           cc.RichText,
    },

    _onInit(){
        yx.eventDispatch.addListener(yx.EventType.HEISHI_REFRESH, this.onRefreshContent, this);
        this.intoBtn.node.on('click',this.onBtnEnterClick,this);

        this._btnItemList = [];
        for (let index = 0; index < 12; index++) {
            let scrollItem = this.boxGroup.getChildByName("box"+(index+1));
            let itemSrc = scrollItem.getComponent(HeiShiItem);
            this._btnItemList[index] = itemSrc;
        }
    },

    _onShow(){
        yx.heiShiMgr.Info();
    },

    _onHide(){
        this.unscheduleAllCallbacks();
    },

    _onDeInit(){

    },

    _refreshOpenPage(){
        this.desc.string = "　　<color=#745937>嘿嘿嘿，这位道友，要不要来点刺激的？\r\n\r\n　　我这里有几个储物袋，道友只要花少许灵石就能</color><color=#ff6565>挑一个</color>"+
        "<color=#745937>，我会按照市价</color><color=#ff6565>收购</color><color=#745937>里面的东西。至于是赔还是赚，就看道友的眼光了。\r\n\r\n　　名额有限，道友可要珍惜机会。"+
        "另外，道友只有</color><color=#ff6565>30</color><color=#745937>秒时间探查，并且选了就不能反悔。</color>";

        if(yx.heiShiMgr.IsLevelActive())
        {
            if(yx.heiShiMgr.getLeftTimes() > 0)
            {
                let costData = yx.heiShiMgr.getCost();
                let rewardName = yx.bagMgr.GetItemName(costData[0].type,costData[0].id);
                let btnDesc = "入场({rewardValue}{rewardName})";
                btnDesc = btnDesc.format({rewardValue:costData[0].count,rewardName:rewardName});
                this.intoBtnDesc.string = btnDesc;
                this.intoBtn.node.active = true;

                let timeDesc = "<color=#745937>今日剩余：</color><color=#52b33a>{count}次</color>";
                timeDesc = timeDesc.format({count:yx.heiShiMgr.getLeftTimes()});
                this.conditionDesc.string = timeDesc;
            }
            else
            {
                this.intoBtn.node.active = false;
                this.conditionDesc.string = "<color=#745937>每人限定三次，道友改日再来吧</color>\n<color=#52b33a>每日0点重置入场次数</color>";
            }
        }
        else
        {
            this.intoBtn.node.active = false;
            this.conditionDesc.string = "<color=#745937>道友还是不要凑热闹了</color>\n<color=#52b33a>(一品炼丹\\锻器师方可进入)</color>";
        }

    },

    _refreshPlayPage(){
        this._list = yx.heiShiMgr.getListItem();
        for (let index = 0; index < this._list.length; index++) {
            this._btnItemList[index].init( this._list[index]);
            this._btnItemList[index].showOrHide(true);
        }

        if(this._list.length < 12)
        {
            for (let index = this._list.length; index < 12; index++) {
                this._btnItemList[index].showOrHide(false);
            }
        }

        this._effectList = {};
        for (let index = 0; index < this._list.length; index++) {
            const element = this._list[index];
            cc.log("element.id==="+element);
            let heishiItemCfg = yx.cfgMgr.getRecordByKey("HeiShiItemConfig", {"ID":element});
            if(heishiItemCfg.EffectType == 1)
            {
                this._effectList[index] = [];
                this._effectList[index][0] =  0+Math.ceil(Math.random()*5);
				this._effectList[index][1]  = 5+Math.ceil(Math.random()*5);
				this._effectList[index][2]  = 10+Math.ceil(Math.random()*5);
				this._effectList[index][3]  = 15+Math.ceil(Math.random()*5);
				this._effectList[index][4]  = 20+Math.ceil(Math.random()*5);
                this._effectList[index][5]  = 25+Math.ceil(Math.random()*5);
            }
            else if(heishiItemCfg.EffectType == 2)
            {
                this._effectList[index] = [];
                this._effectList[index][0] =  0+Math.ceil(Math.random()*15);
				this._effectList[index][1]  = 15+Math.ceil(Math.random()*15);
            }
            else if(heishiItemCfg.EffectType == 3)
            {
                this._effectList[index] = [];
                this._effectList[index][0] =  0+Math.ceil(Math.random()*30);
            }
            else if(heishiItemCfg.EffectType == 4)
            {
                this._effectList[index] = [];
                this._effectList[index][0] =  0+Math.ceil(Math.random()*30);
            }
            else
            {
                this._effectList[index] = null;
            }
        }

        this.progressdesc.string = "炼丹/锻器等级越高\n越容易探查到高品质宝物";

        this._update = false;
        let diff = yx.heiShiMgr.getEndTime() - yx.timeUtil.getServerTime();
        if(diff > 0)
        {
            this._update = true;    
            let timeContent = "<color=#ffffff>剩余探查时间：</color><color=#ffeae1>{time}</color><color=#ffffff>秒</color>";
            timeContent  = timeContent.format({time:parseInt(diff/1000)});
            this.progresstime.string = timeContent;
            this.progress.progress = diff/(30*1000);

            // this._lastPlayAnimTime = yx.timeUtil.getServerTime();
            this.progress.node.active = true;
        }
        else
        {
            this.progresstime.string = "<color=#ffffff>探查已经结束，道友请选择一个</color>";
            this.progress.progress = 0;
            this.progress.node.active = false;
        }

    },

    update(dt){
        if(this._update)
        {
            let diff = yx.heiShiMgr.getEndTime() - yx.timeUtil.getServerTime();
            if(diff > 0)
            {
                let timeContent = "<color=#ffffff>剩余探查时间：</color><color=#ffeae1>{time}</color><color=#ffffff>秒</color>";
                timeContent  = timeContent.format({time:parseInt(diff/1000)});
                this.progresstime.string = timeContent;
                this.progress.progress = diff/(30*1000);

                for (let index = 0; index < this._btnItemList.length; index++) {
                    const element = this._effectList[index];
                    if(element != null)
                    {
                        for (let index2 = 0; index2 < element.length; index2++) {
                            const noewSec = element[index2];
                            if(Math.ceil(diff/1000) == noewSec)
                            {
                                // 播放动画
                                this._btnItemList[index].playAnim(noewSec);
                                // this._lastPlayAnimTime = yx.timeUtil.getServerTime();
                            }                            
                        }
                    }
                }
                
            }
            else
            {
                this._refreshPlayPage();
            }
        }
    },

    _refresh(){
        this.lingshiLabel.string = yx.playerMgr.getCurrency(yx.CyType.LINGSHI);

        if(yx.heiShiMgr.IsPalying())
        {
            this.playGroup.active = true;
            this.openGroup.active = false;
            this._refreshPlayPage();
        }
        else
        {
            this.playGroup.active = false;
            this.openGroup.active = true;
            this._refreshOpenPage();
        }


    },

    onBtnEnterClick(){

        let costData = yx.heiShiMgr.getCost();
        let rewardName = yx.bagMgr.GetItemName(costData[0].type,costData[0].id);
        cc.log("costData[0].id="+costData[0].id);
        if(yx.bagMgr.GetItemOwnCount(costData[0].type,costData[0].id) < costData[0].count)
        {
            yx.ToastUtil.showListToast(rewardName+"不足");
            return;
        }

        yx.heiShiMgr.enter();
    },

    onRefreshContent(){
        this._refresh();
    },

});