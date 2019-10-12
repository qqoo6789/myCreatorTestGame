
let _detailString = "造成100%基础伤害\n";

cc.Class({
    extends: cc.Component,
    properties: {          
        titleLabel:         cc.Label,
        detailLabel:        cc.Label,
        iconSprite:         cc.Sprite,  
        useBtn:             cc.Button,
        useLabel:           cc.Label,

        _gongfaId:          Number,
    },

    init(gongfaMsg){
        this.titleLabel.string = gongfaMsg.cfg.Name;

        this.useBtn.node.on('click', this.onUseBtnClick, this);

        this.detailLabel.string = "造成100%基础伤害\n";

        this._gongfaId = gongfaMsg.id;

        // _detailString.format({typename: yx.textDict.Attr[gongfaMsg.cfg.BaseAttr[0].type], 
        //     addGongFa: gongfaMsg.gongfaAdd + gongfaMsg.wuxingAdd, 
        //     linggenType: yx.textDict.WuDaoTypeName[gongfaMsg.cfg.WuXingType], 
        //     addLinggen: gongfaMsg.wuxingAdd});      

        yx.resUtil.LoadSpriteByType("skill_1", yx.ResType.SKILL, this.iconSprite);


        if (gongfaMsg.id == yx.gongfaMgr.getCurZhaoShi())
        {
            this.useLabel.node.active = true;
            this.useBtn.node.active = false;
        }
        else
        {
            this.useLabel.node.active = false;
            this.useBtn.node.active = true;
        }        
    },

    onUseBtnClick(){
        cc.log("[ZhaoShiScrollItem onUseBtnClick]");

        yx.gongfaMgr.reqChangeZhaoShi(this._gongfaId);
    },
});