const TimeProBarWidget = require('TimeProBarWidget');

cc.Class({
    extends: cc.Component,

    properties: {
        titleLabel:      cc.Label,
        descRichText:    cc.RichText,
        conditionLabel:  cc.Label,
        rewardLabel:     cc.Label,
        startBtn:        cc.Button,
        progressBar:     cc.ProgressBar,
        timeLabel:       cc.Label,
        descLabel:       cc.Label,
        progressGroup:   cc.Node,
    },

    init(data){

        this._data = data;
        this.startBtn.node.on('click', this.onStartTaskBtnClick, this);

        this.titleLabel.string = data.DefName;
        this.descRichText.string = data.DefDesc;

        let dujieConfig = yx.cfgMgr.getRecordByKey("DuJieConfig", {Level:data.Level});
        this.conditionLabel.string = dujieConfig.Name;

        let curZhiWei = yx.menPaiMgr.currZhiWei();
        
        let content = "";
        for (let index = 0; index < data.BaseReward.length; index++) {
            const element = data.BaseReward[index];
            let name = yx.bagMgr.GetItemName(element.type,element.id);
            
            let extCount = 0;
            let extRewards = data["zhiwu"+curZhiWei];
            if(extRewards)
            {
                for (let index = 0; index < extRewards.length; index++) {
                    const element2 = extRewards[index];
                    if(element2.id == element.id)
                    {   
                        extCount = element2.count;
                        break;
                    }
                }
            }

            content = content + name + "*" + element.count + "("+ extCount +")"+",";

        }

        content = content.substring(0,content.length-1);
        this.rewardLabel.string = content;
        this.descLabel.string = "任务中...";

        if(yx.menPaiMgr.CurrRenWu() == data.ID)
        {
            this.startBtn.node.active = false;
            this.progressGroup.active = true;

            this._isUpdate = true;
        }
        else
        {
            this.startBtn.node.active = true;
            this.progressGroup.active = false;

            this._isUpdate = false;
        }

    },

    onStartTaskBtnClick(){
       cc.log("开始任务");

        if (yx.playerMgr.getDuJieLevel() < this._data.Level)
        {
            yx.ToastUtil.showListToast("您的境界太低");
            return;
        }

        yx.menPaiMgr.RenWuDo(this._data.ID);
    },


    update(dt){

        if(this._isUpdate)
        {
            let diff = Math.max(0,this._data.Time*60*1000 + yx.menPaiMgr.RenWuStartTime() - yx.timeUtil.getServerTime());
            this.progressBar.progress = diff/(this._data.Time*60*1000);
            this.timeLabel.string = yx.timeUtil.seconds2hourMinSecond(diff/1000);

        }
    
    },

    onReFreshTime(){
        if(yx.menPaiMgr.CurrRenWu() == this._data.ID)
        {
            this.startBtn.node.active = false;
            this.progressGroup.active = true;

            this._isUpdate = true;
        }
        else
        {
            this.startBtn.node.active = true;
            this.progressGroup.active = false;

            this._isUpdate = false;
        }


    },
});
