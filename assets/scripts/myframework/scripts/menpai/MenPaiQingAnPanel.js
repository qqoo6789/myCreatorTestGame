const BaseWindow = require('BaseWindow');

cc.Class({
    extends: BaseWindow,

    properties: {

        closeBtn:                 cc.Button,
        maskSp:                   cc.Button,
        qingAnBtn1:               cc.Button,
        qingAnBtn2:               cc.Button,
        qingAnBtn3:               cc.Button,

    },

    _onInit(args) {
        this.closeBtn.node.on('click', this.onCloseBtnClick, this);
        this.maskSp.node.on('click', this.onMaskSpClick, this);
        this.qingAnBtn1.node.on('click', this.onQingAnBtn1Click, this);
        this.qingAnBtn2.node.on('click', this.onQingAnBtn2Click, this);
        this.qingAnBtn3.node.on('click', this.onQingAnBtn3Click, this);
    },
   

    _onShow(){
        this._refresh();
    },

    _onHide(){
    },

    _onDeInit(){

    },

    onCloseBtnClick(){
        yx.windowMgr.goBack();
    },
    onMaskSpClick(){
        yx.windowMgr.goBack();
    },

    _refresh(){
        
    },

    qinganConfirmCallback(){

        let qingAnConfig =  yx.cfgMgr.getRecordByKey("MenPaiQingAnConfig", {ID:this.selectId_});
        let cost = qingAnConfig.Cost;
        for (let index = 0; index < cost.length; index++) {
            const element = cost[index];
            let costId = element.id;
            if(element.type == 0)
            {
                costId = costId + 80000;
                let costItemCfg = yx.cfgMgr.getOneRecord("ItemConfig", costId);
                let ownCount = yx.playerMgr.getCurrency(costId);
                if(ownCount < element.count)
                {
                    yx.ToastUtil.showListToast(costItemCfg.Name + "不足");
                    return;
                }   
            }
            else
            {
                let ownCount = yx.bagMgr.getItemNum(costId);
                let costItemCfg = yx.cfgMgr.getOneRecord("ItemConfig", costId);
                if(ownCount < element.count)
                {
                    yx.ToastUtil.showListToast(costItemCfg.Name + "不足");
                    return;
                }
            }
        }

        yx.menPaiMgr.qingAn(this.selectId_);
        yx.windowMgr.goBack();
    },

    _qinganHandle(id)
    {
        this.selectId_ = id;
        let qingAnConfig =  yx.cfgMgr.getRecordByKey("MenPaiQingAnConfig", {ID:id});
        let cost = qingAnConfig.Cost;

        let content = "需要消耗：";
        if(cost.length > 0)
        {
            for (let index = 0; index < cost.length; index++) {
                const element = cost[index];
                let costId = element.id;
                if(element.type == 0)
                {
                    costId = costId + 80000;
                }
                let costItemCfg = yx.cfgMgr.getOneRecord("ItemConfig", costId);
                content = content + element.count + costItemCfg.Name + ",";
            }
            content = content.substring(0,content.length-1);

            yx.TextConfirm.ShowConfirm(content, yx.CodeHelper.NewClickEvent(this, "qinganConfirmCallback"));
        }
        else
        {
            yx.menPaiMgr.qingAn(id);
            yx.windowMgr.goBack();
        }
        
    },

    onQingAnBtn1Click(){
        if(yx.menPaiMgr.HasQingAn())
        {
            yx.ToastUtil.showListToast("今天已经请安过了。");
            return;
        }    
        this._qinganHandle(1);
    },
    onQingAnBtn2Click(){
        if(yx.menPaiMgr.HasQingAn())
        {
            yx.ToastUtil.showListToast("今天已经请安过了。");
            return;
        }   
        this._qinganHandle(2);
    },
    onQingAnBtn3Click(){
        if(yx.menPaiMgr.HasQingAn())
        {
            yx.ToastUtil.showListToast("今天已经请安过了。");
            return;
        }   
        this._qinganHandle(3);
    },

});
