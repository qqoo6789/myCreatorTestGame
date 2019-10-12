const BaseWindow = require('BaseWindow');

cc.Class({
    extends: BaseWindow,

    properties: {
        // maskSp:               cc.Button,

        // 没有额外奖励
        normalGroup:          cc.Node,
        titleLabel:           cc.Label,
        iconSp:               cc.Sprite,
        descLabel:            cc.RichText,
        rewardLabel:          cc.Label,
        getBtn:               cc.Button,
        rewardBtnDesc:        cc.Label,

        // 有额外奖励
        extraGroup:            cc.Node,
        titleLabel2:           cc.Label,
        iconSp2:               cc.Sprite,
        descLabel2:            cc.RichText,
        rewardLabel2:          cc.Label,
        getBtn2:               cc.Button,
        rewardBtnDesc2:        cc.Label,
        extraNode:             cc.Node,

    },

    _onInit(args) {

        this._args = args;

        // this.maskSp.node.on('click', this.onMaskSpClick, this);
        this.getBtn.node.on('click', this.onGetReward, this);
        this.getBtn2.node.on('click', this.onGetReward2, this);
    },
   

    _onShow(){
        this._refresh();
    },

    _onHide(){
    },

    _onDeInit(){

    },

    _refresh(){
        if(this._args)
        {

            let config = yx.cfgMgr.getRecordByKey("HeiShiItemConfig", {"ID":this._args.selectItemID});
            if(config)
            {
                this.titleLabel.string = config.Name;
                this.descLabel.string = config.DefDesc;
                if(config.Icon != null)
                {
                    yx.resUtil.LoadSpriteFromResConfigById(config.Icon,this.iconSp);
                }

                this.titleLabel2.string = config.Name;
                this.descLabel2.string = config.DefDesc;
                if(config.Icon != null)
                {
                    yx.resUtil.LoadSpriteFromResConfigById(config.Icon,this.iconSp2);
                }
                
            }

            if(this._args.reward == null)
            {
                cc.log("this._args.reward is null");
                this.normalGroup.active = false;
                this.extraGroup.active = false;
                return;
            }

            // 除了灵石，还有额外奖励
            if(this._args.reward.length == 2)
            {   
                this.normalGroup.active = false;
                this.extraGroup.active = true;

                let lingshiIndex = 0;
                let extraIndex = 1;
                if(this._args.reward[0].type != yx.CyType.LINGSHI)
                {
                    lingshiIndex = 1;
                    extraIndex = 0;
                }

                this.rewardLabel2.string = "价值"+this._args.reward[lingshiIndex].count+"灵石";
                this.rewardBtnDesc2.string = "收下奖励";

                let itemInfo = {};
                itemInfo["content"] = ""+this._args.reward[extraIndex].count;
                itemInfo["ID"] = this._args.reward[extraIndex].id;
                yx.ItemRichTextWidget.CreateItemSlot(itemInfo, this.extraNode, "reward",null);
        
            }
            else if(this._args.reward.length == 1)
            {
                this.normalGroup.active = true;
                this.extraGroup.active = false;

                this.rewardLabel.string = "价值"+this._args.reward[0].count+"灵石";
                this.rewardBtnDesc.string = "收下奖励";
            }
            else
            {
                cc.log("reward error count = "+this._args.reward.length);
                this.normalGroup.active = true;
                this.extraGroup.active = false;

                this.rewardLabel.string = "价值"+0+"灵石";
                this.rewardBtnDesc.string = "收下奖励";
            }

          


        }
    },

    // onMaskSpClick(){
    //     yx.windowMgr.goBack();
    // },

    onGetReward(){
        yx.windowMgr.goBack();
    },

    onGetReward2(){
        yx.windowMgr.goBack();
    },

});
