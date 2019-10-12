const BaseWindow = require('BaseWindow');

cc.Class({
    extends: BaseWindow,

    properties: {

        closeBtn:                 cc.Button,
        maskSp:                   cc.Button,
        titleLabel:               cc.Label,
        zhangmenName:             cc.Label,
        zhangmenIcon:             cc.Sprite,

        tiaozhanBtn:              cc.Button,
        tiaozhanlingBtn:          cc.Button,
        tiaozhanDesc:             cc.RichText,
        tiaozhanZiGeRichText:     cc.RichText,
        tiaozhanCostRichText:     cc.RichText,
        tiaozhanCostSp:           cc.Sprite,
        tiaozhanlingTimeLabel:    cc.Label,
    },

    _onInit(args) {
        yx.eventDispatch.addListener(yx.EventType.MENPAI_TIAOZHAN_REFRESH, this.onTiaoZhanRefresh, this);

        this.closeBtn.node.on('click', this.onCloseBtnClick, this);
        this.maskSp.node.on('click', this.onMaskSpClick, this);
        this.tiaozhanBtn.node.on('click', this.onTiaozhanBtnClick, this);
        this.tiaozhanlingBtn.node.on('click', this.onTiaozhanlingBtnBtnClick, this);

        this.tiaozhanCostSp.node.setScale(0.5);
    },
   

    _onShow(){
        this._refresh();
    },

    _onHide(){
    },

    _onDeInit(){

    },

    _refresh(){

        let tiaozhanCDcfg =  yx.cfgMgr.getRecordByKey("SystemConfig", {id:76});
        let nian = yx.timeUtil.minutes2year(tiaozhanCDcfg.int_value);
        let descContent = "<color=#98baf0>修真炼道，强者为尊。门派每{nian}年开启掌门挑战，战胜上一任掌门即可担任本派掌门。</color>";
        descContent = descContent.format({nian:nian});
        this.tiaozhanDesc.string = descContent;


        let tiaozhanLingCDcfg =  yx.cfgMgr.getRecordByKey("SystemConfig", {id:80});
        let nian2 = yx.timeUtil.minutes2year(tiaozhanLingCDcfg.int_value);
        let menpaiConfig = yx.menPaiMgr.getMineMenPaiConfig();
        this.titleLabel.string = menpaiConfig.DefName;
        let costName = yx.bagMgr.GetItemName(menpaiConfig.PKZhangMenCost[0].type,menpaiConfig.PKZhangMenCost[0].id);
        let content = "<color=#98baf0>成为门派护法\n消耗{costValue}{costName}\n使用掌门挑战令，{nian2}年内在当前门派挑战代理掌门不限次数</color>";
        content = content.format({costValue:menpaiConfig.PKZhangMenCost[0].count,costName:costName,nian2:nian2});
        this.tiaozhanZiGeRichText.string = content;

        let tiaozhanLingCostcfg =  yx.cfgMgr.getRecordByKey("SystemConfig", {id:79});
        let costConfig = tiaozhanLingCostcfg.str_value;

        let itemConfig =  yx.cfgMgr.getRecordByKey("ItemConfig", {ID:costConfig[0].id}); 

        if(itemConfig.Icon != null)
        {
            yx.resUtil.LoadSpriteByType(itemConfig.Icon, yx.ResType.ITEM, this.tiaozhanCostSp);
        }
        let costText = "<color=#00c800>{own}</color><color=#ffffff>/{cost}</color>";
        costText = costText.format({cost:costConfig[0].count,own:yx.bagMgr.GetItemOwnCount(costConfig[0].type,costConfig[0].id)});
        this.tiaozhanCostRichText.string = costText;

        // 挑战令CD中
        if(yx.timeUtil.getServerTime() < yx.menPaiMgr.TiaoZhanLingEndTime())
        {
            this.tiaozhanCostRichText.node.active = false;
            this.tiaozhanCostSp.node.active = false;
            this.tiaozhanlingTimeLabel.node.active = true;
            this._update = true;
        }
        else
        {
            this.tiaozhanCostRichText.node.active = true;
            this.tiaozhanCostSp.node.active = true;
            this.tiaozhanlingTimeLabel.node.active = false;
            this._update = false;
        }


        let dailiZhangmenData = yx.menPaiMgr.DaiLiZhangMen();
        if(dailiZhangmenData)
        {
            this.zhangmenName.string = dailiZhangmenData.Name;
            // if(dailiZhangmenData.Icon)
            // {
            //     yx.resUtil.LoadSpriteByType(dailiZhangmenData.Icon, yx.ResType.NPC, this.zhangmenIcon);
            // } 
        }
        else
        {
            // 如果有代理掌门，就显示代理掌门，没有就显示npc掌门
            let npcZhangmenConfig = yx.menPaiMgr.GetNpcZhangMenConifg(menpaiConfig);
            if(npcZhangmenConfig)
            {
                this.zhangmenName.string = npcZhangmenConfig.Name;

                if (npcZhangmenConfig.Icon != null )//&& this._itemInfo.Icon.length > 0)
                {
                    cc.log("icon22==="+npcZhangmenConfig.Icon);
                    yx.resUtil.LoadSpriteFromResConfig(npcZhangmenConfig.Icon, yx.ResType.NPC, this.zhangmenIcon);
                }
            }
        }

    },


    onCloseBtnClick(){
        yx.windowMgr.goBack();
    },

    onTiaozhanBtnClick(){
        cc.log("挑战");
        if (yx.menPaiMgr.currZhiWei() == yx.MenPaiZhiWeiType.ZHANGMEN)
        {
            yx.ToastUtil.showListToast("你已经是掌门了");
            return;
        }

        if (yx.timeUtil.getServerTime() < yx.menPaiMgr.PKEndTime())
        {
            let tiaozhanCDcfg =  yx.cfgMgr.getRecordByKey("SystemConfig", {id:76});
            let nian = yx.timeUtil.minutes2year(tiaozhanCDcfg.int_value);
            yx.ToastUtil.showListToast("每"+nian+"年开启掌门挑战");
            return;
        }

        if (yx.menPaiMgr.currZhiWei() < yx.MenPaiZhiWeiType.HUFU)
        {
            yx.ToastUtil.showListToast("护法以上才能挑战");
            return;
        }

        let menpaiConfig = yx.menPaiMgr.getMineMenPaiConfig();
        if (yx.bagMgr.GetItemOwnCount(menpaiConfig.PKZhangMenCost[0].type,menpaiConfig.PKZhangMenCost[0].id) < menpaiConfig.PKZhangMenCost[0].count)
        {
            let name = yx.bagMgr.GetItemName(menpaiConfig.PKZhangMenCost[0].type,menpaiConfig.PKZhangMenCost[0].id);
            yx.ToastUtil.showListToast(name+"不足");
            return;
        }

        yx.menPaiMgr.PK(false);
        yx.windowMgr.goBack();
    },

    onTiaozhanlingBtnBtnClick(){
        cc.log("挑战令挑战");
        if (yx.menPaiMgr.currZhiWei() == yx.MenPaiZhiWeiType.ZHANGMEN)
        {
            yx.ToastUtil.showListToast("你已经是掌门了");
            return;
        }

        if (yx.timeUtil.getServerTime() < yx.menPaiMgr.PKEndTime())
        {
            let tiaozhanCDcfg =  yx.cfgMgr.getRecordByKey("SystemConfig", {id:76});
            let nian = yx.timeUtil.minutes2year(tiaozhanCDcfg.int_value);
            yx.ToastUtil.showListToast("每"+nian+"年开启掌门挑战");
            return;
        }

        // 挑战令有效期间内
        if (yx.timeUtil.getServerTime() < yx.menPaiMgr.TiaoZhanLingEndTime())
        {
            yx.menPaiMgr.PK(true);
            yx.windowMgr.goBack();
        }
        else
        {
            // 使用挑战令。
            let tiaozhanLingCostcfg =  yx.cfgMgr.getRecordByKey("SystemConfig", {id:79});
            let costConfig = tiaozhanLingCostcfg.str_value;
            if(yx.bagMgr.GetItemOwnCount(costConfig[0].type,costConfig[0].id)<costConfig[0].count){
                yx.ToastUtil.showListToast(yx.bagMgr.GetItemName(costConfig[0].type,costConfig[0].id)+"不足");
                return;
            }
            yx.menPaiMgr.PK(true);
            yx.windowMgr.goBack();
        }
        
    },

    onMaskSpClick(){
        yx.windowMgr.goBack();
    },

    update(dt){
        if(this._update)
        {
             // 挑战令CD中
            if(yx.timeUtil.getServerTime() < yx.menPaiMgr.TiaoZhanLingEndTime())
            {
                let diff = yx.menPaiMgr.TiaoZhanLingEndTime() - yx.timeUtil.getServerTime();
                this.tiaozhanlingTimeLabel.string = yx.timeUtil.seconds2hourMinSecond(diff/1000);
            }
            else
            {
                this._refresh();
            }
        }
       
    },

    onTiaoZhanRefresh(){
        this._refresh();
    },
});