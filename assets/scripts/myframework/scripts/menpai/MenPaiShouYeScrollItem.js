
cc.Class({
    extends: cc.Component,

    properties: {
        gongfaSpBg:         cc.Sprite,
        gongfaSp:         cc.Sprite,
        gongfaNameLabel:      cc.Label,
        leixingLabel:     cc.Label,
        yaoqiuLabel:     cc.Label,
        xiulianBtn:      cc.Button,
        yixiulianSp:     cc.Sprite,

        maskBtn:          cc.Button,
    },

    init(data){

        this.xiulianBtn.node.on('click',this.onXiulianBtnClick,this);
        this.maskBtn.node.on('click',this.onSkillIconBtnClick,this);

        this._skillConfig = yx.cfgMgr.getRecordByKey("SkillConfig", {"ID":data.ID, "Type":data.Type});
        this._data = data;

        let menPaiPostConfig =  yx.cfgMgr.getRecordByKey("MenPaiPostConfig", {"ZhiWu":data.ZhiWei});

        this.gongfaNameLabel.string = this._skillConfig.Name;
        this.leixingLabel.string = this._skillConfig.TypeName;
        this.yaoqiuLabel.string = menPaiPostConfig.ZhiWuName;

        if(this._skillConfig.Type == 1)
        {
            this.gongfaSp.node.setScale(0.8);
            this.gongfaSpBg.node.active = false;
            yx.resUtil.LoadSpriteFromResConfig( this._skillConfig.Icon, yx.ResType.SKILL, this.gongfaSp);
        }
        else
        {
            this.gongfaSpBg.node.active = true;
            yx.resUtil.LoadSpriteFromResConfig( this._skillConfig.Icon, yx.ResType.ITEM, this.gongfaSp);
        }

        this.onReFreshSkill();
       
    },


    onReFreshSkill(){
        cc.log("onReFreshSkill   "+this._data.Type+"===="+this._data.ID);
        if(yx.gongfaMgr.hasLearn(this._data.Type,this._data.ID))
        {
            this.yixiulianSp.node.active = true;
            this.xiulianBtn.node.active = false;
        }
        else
        {
            this.yixiulianSp.node.active = false;
            this.xiulianBtn.node.active = true;
        }
    },

    onXiulianBtnClick(){
        cc.log("学习功法");

        if(yx.menPaiMgr.currZhiWei() < this._data.ZhiWei)
        {
            yx.ToastUtil.showListToast("请先提升门派职位");
            return;
        }

        yx.menPaiMgr.xueXi(this._skillConfig.Index);
    },

    onSkillIconBtnClick(){
        let args = {};
        args.configData = this._skillConfig;
        args.skillIconNode = this.gongfaSp.node;
        yx.windowMgr.showWindow("skillTipsPanel",args);
    },
});
