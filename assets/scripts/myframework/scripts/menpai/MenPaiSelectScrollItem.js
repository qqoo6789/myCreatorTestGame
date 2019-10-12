

cc.Class({
    extends: cc.Component,

    properties: {
        zhengSp:         cc.Sprite,
        xieSp:           cc.Sprite,
        lianqiSp:        cc.Sprite,
        liandanSp:       cc.Sprite,
        titleLabel:      cc.Label,
        descRichText:    cc.RichText,
        jinengNode:      cc.Node,
        jinengLabel:     cc.Label,
        dailizhangmenLabel1:     cc.Label,
        dailizhangmenLabel:     cc.Label,
        weijiaru:        cc.Sprite,
        yijiaru:         cc.Sprite,
        skillIcon:       cc.Sprite,
    },

    init(data){

        cc.log("select"+ data.ID);

        this.skillIcon.node.on('click', this.onSkillBtnClick, this);

        this.titleLabel.string = data.DefName;
        this.descRichText.string = data.DefDesc;

        if(data.Type == 0)
        {
            this.zhengSp.node.active = true;
            this.xieSp.node.active = false;
        }
        else
        {
            this.zhengSp.node.active = false;
            this.xieSp.node.active = true;
        }

        if(data.AddReward.length > 0)
        {   
            if(data.AddReward[0].id == 22)
            {
                this.liandanSp.node.active = false;
                this.lianqiSp.node.active = true;
            }
            else
            {
                this.liandanSp.node.active = true;
                this.lianqiSp.node.active = false;
            }
        }
        else
        {
            this.liandanSp.node.active = false;
            this.lianqiSp.node.active = false;
        }

        this.jinengNode.active = false;
        this.skillIcon.node.active = false;
        this.skillIcon.node.scale = 0.5;

        if(data.GongFa.length > 0)
        {
            for (let index = 0; index < data.GongFa.length; index++) {
                const element = data.GongFa[index];
                if(element.ZhiWei == yx.MenPaiZhiWeiType.HUFU)
                {
                    this.jinengNode.active = true;
                    this.skillIcon.node.active = true;
                    this._skillConfig = yx.cfgMgr.getRecordByKey("SkillConfig", {"ID":element.ID, "Type":element.Type});
                    this.jinengLabel.string =  this._skillConfig.Name;
                    // this._skillConfig.Icon
                    yx.resUtil.LoadSpriteFromResConfig(this._skillConfig.Icon, yx.ResType.SKILL, this.skillIcon);

                    break;
                }
            }
        }
        
        // // 代理掌门，如果没有就不显示
        let dailiZhangmen = yx.menPaiMgr.DaiLiZhangMen();
        if(dailiZhangmen)
        {   
            this.dailizhangmenLabel.string = dailiZhangmen.Name;
        }
        else
        {
            this.dailizhangmenLabel1.string = "";
            this.dailizhangmenLabel.string = "";
            
        }
    
    },

    onSkillBtnClick(){
        let args = {};
        args.configData = this._skillConfig;
        args.skillIconNode = this.skillIcon.node;
        yx.windowMgr.showWindow("skillTipsPanel",args);
        cc.log("点击技能");
    },
});
