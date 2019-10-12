const BaseWindow = require('BaseWindow');

cc.Class({
    extends: BaseWindow,

    properties: {

        closeBtn:                 cc.Button,
        chuangongBtn:              cc.Button,
        maskSp:                   cc.Button,
        zhangmenZhiwei:             cc.Label,
        zhangmenName:             cc.Label,
        zhangmenIcon:             cc.Sprite,
        costIcon:                 cc.Sprite,
        costValue:                cc.Label,
        chuangongDesc:             cc.RichText,
    },

    _onInit(args) {

        this._endTime1 = args.endTime1;
        this.closeBtn.node.on('click', this.onCloseBtnClick, this);
        this.chuangongBtn.node.on('click', this.onChuangongBtnClick, this);
        this.maskSp.node.on('click', this.onMaskSpClick, this);

        this.costIcon.node.setScale(0.5);
    },
   

    _onShow(){
        this._refresh();
    },

    _onHide(){
    },

    _onDeInit(){

    },

    _refresh(){
        let menpaiConfig = yx.menPaiMgr.getMineMenPaiConfig();
        let npcZhangmenConfig = yx.menPaiMgr.GetNpcZhangMenConifg(menpaiConfig);
        if(npcZhangmenConfig)
        {
            this.zhangmenName.string = npcZhangmenConfig.Name;
            this.zhangmenZhiwei.string = npcZhangmenConfig.ZhiWuName;

            if (npcZhangmenConfig.Icon != null )//&& this._itemInfo.Icon.length > 0)
            {
                cc.log("icon22==="+npcZhangmenConfig.Icon);
                yx.resUtil.LoadSpriteFromResConfig(npcZhangmenConfig.Icon, yx.ResType.NPC, this.zhangmenIcon);
            }
        }

        let itemCfg = yx.cfgMgr.getRecordByKey("ItemConfig", {ID:yx.CyType.SHENYU});
        if (itemCfg)
        {
            if (itemCfg.Icon != null && itemCfg.Icon.length > 0)
            {
                yx.resUtil.LoadSpriteByType(itemCfg.Icon, yx.ResType.ITEM, this.costIcon);
            }
        }

        

        let liangongfangCfg = yx.cfgMgr.getRecordByKey("LianGongFangConfig", {ID:2});
        let descContent = "<color=#98baf0>作为掌门，我可以给你护法传功，将百年道行隔体传功给你，使你功力大增（获得{bei}倍练功速度{nian}年）</color>"
        let nian = yx.timeUtil.minutes2year(liangongfangCfg.time);
        descContent = descContent.format({bei:liangongfangCfg.multiple,nian:nian});
        this.chuangongDesc.string = descContent;
        this.costValue.string = liangongfangCfg.cost[0].count;
    },


    onCloseBtnClick(){
        yx.windowMgr.goBack();
    },

    onChuangongBtnClick(){
        if(yx.timeUtil.getServerTime() < this._endTime1)
        {
            yx.ToastUtil.showListToast("传功中。。。");
            return;
        }

        if(yx.menPaiMgr.ZhangMenLianGongStartTime() != 0 && yx.timeUtil.IsSameDay(yx.menPaiMgr.ZhangMenLianGongStartTime(),yx.timeUtil.getServerTime()) )
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

        let liangongfangCfg = yx.cfgMgr.getRecordByKey("LianGongFangConfig", {ID:2});
        let costName = yx.bagMgr.GetItemName(liangongfangCfg.cost[0].type,liangongfangCfg.cost[0].id);
        let ownCount = yx.bagMgr.GetItemOwnCount(liangongfangCfg.cost[0].type,liangongfangCfg.cost[0].id);

        if(ownCount < liangongfangCfg.cost[0].count)
        {
            yx.ToastUtil.showListToast("你所拥有的"+costName+"不足");
            return;
        }
        yx.menPaiMgr.LianGong(2);
        yx.windowMgr.goBack();

    },

    onMaskSpClick(){
        yx.windowMgr.goBack();
    },
});