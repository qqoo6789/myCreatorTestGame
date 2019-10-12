let _titleString = "{star}阶·{name}({level}级)";
let _detailString = "{typename}+{addGongFa}({linggenType}效果+{addLinggen})";

//0 神 1人 2畜 3鬼 4狱 
let iconPath = "textures/wudao/";
let iconNameArray = ["iocn-36", "iocn-40", "iocn-39", "iocn-37", "iocn-38"];

cc.Class({
    extends: cc.Component,
    properties: {          
        titleLabel:         cc.Label,
        detailLabel:        cc.Label,
        iconSprite:         cc.Sprite,
        forgetBtn:          cc.Button,
        upgradeBtn:         cc.Button,
        needLingQiLabel:    cc.Label,

        _gongfaType:        Number,
        _gongfaId:          Number,
        _needLingQi:        Number,
    },

    init(gongfaMsg){
        this.forgetBtn.node.on('click', this.onForgetBtnClick, this);
        this.upgradeBtn.node.on('click', this.onUpgradeBtnClick, this);

        this._gongfaType = gongfaMsg.gongFaType;
        this._gongfaId = gongfaMsg.id;

        //三阶>药王秘籍(4级)
        this.titleLabel.string = _titleString.format({star:gongfaMsg.cfg.Star, name: gongfaMsg.cfg.Name, level:gongfaMsg.level});

        //真气+695(土系灵根效果+666)
        this.detailLabel.string = _detailString.format({typename: yx.textDict.Attr[gongfaMsg.cfg.BaseAttr[0].type], 
            addGongFa: yx.gongfaMgr.getWuXingAdd(gongfaMsg) + yx.gongfaMgr.getGongFaAdd(gongfaMsg), 
            linggenType: yx.textDict.WuDaoTypeName[gongfaMsg.cfg.WuXingType], 
            addLinggen: yx.gongfaMgr.getWuXingAdd(gongfaMsg)});        

        //门派技能可以遗忘
        this.forgetBtn.node.active = gongfaMsg.gongFaType == yx.proto.GongFaType.MenPai;

        this._needLingQi = 0;

        if (gongfaMsg.gongFaType != yx.proto.GongFaType.ZhaoShi)
        {
            yx.resUtil.LoadSprite(iconPath + iconNameArray[gongfaMsg.cfg.WuXingType - 1], this.iconSprite);

            let updateCfg = yx.cfgMgr.getRecordByKey("SkillUpdateConfig", {Level:gongfaMsg.level});

            if (updateCfg)
            {
                this.needLingQiLabel.string = updateCfg.Cost[0].count + "灵气";
                this.upgradeBtn.enable = true;
                this._needLingQi = updateCfg.Cost[0].count;
            }
            else
            {
                this.needLingQiLabel.string = "已经满级";
                this.upgradeBtn.enable = false;                
            }            
        }        
    },

    getGongFaId(){
        return this._gongfaId;
    },

    onForgetBtnClick(){
        if (this._gongfaType == yx.proto.GongFaType.MenPai)
        {
            let gongfaMsg = yx.gongfaMgr.getGongFa(this._gongfaType, this._gongfaId);

            if (gongfaMsg)
            {
                //弹框遗忘提示
                let content = "您确定要遗忘<color=#00C800>{name}</color>吗？";
                content = content.format({name: gongfaMsg.cfg.Name});

                yx.TextConfirm.ShowConfirm(content, yx.CodeHelper.NewClickEvent(this, "onForgetConfirmBtnClick"));
            }
        }
    },

    onUpgradeBtnClick(){
        if (this._needLingQi > 0 && this._needLingQi <= yx.playerMgr.getCurrency(yx.CyType.LINGQI))
        {
            yx.gongfaMgr.reqGongFaUpgrade(this._gongfaType, this._gongfaId);
        }
        else
        {
            yx.ToastUtil.showListToast("灵气不足");
        }
    },

    onForgetConfirmBtnClick(){
        yx.gongfaMgr.reqForgetMenPaiGongFa(this._gongfaId);
    },
});