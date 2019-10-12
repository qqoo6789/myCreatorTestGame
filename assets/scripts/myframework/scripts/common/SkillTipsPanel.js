const BaseWindow = require('BaseWindow');

cc.Class({
    extends: BaseWindow,

    properties: {
        contentNode:    cc.Node,
        maskSp:         cc.Sprite,
        nameLabel:      cc.Label,
        descRichText:      cc.RichText,
        iconSp:         cc.Sprite,
    },

    _onInit(args) {

        this.iconSp.node.scale = 0.7;

        cc.log("contentNodePoint=="+this.contentNode.x+":"+this.contentNode.y);
        let node = args.skillIconNode;
        let worldPoint = node.convertToWorldSpaceAR(cc.v2(0, 0));
        cc.log("worldPoint=="+worldPoint.x+":"+worldPoint.y);
        let localPoint = this.contentNode.parent.convertToNodeSpaceAR(worldPoint);
        cc.log("localPoint=="+localPoint.x+":"+localPoint.y);
        // this.contentNode.x = localPoint.x;
        this.contentNode.y = localPoint.y;

        this.maskSp.node.on('click', this.onMaskSpClick, this);

        this.nameLabel.string = args.configData.Name;
        this.descRichText.string = args.configData.GongFaDesc;
        // yx.resUtil.LoadSpriteFromResConfig(args.configData.Icon, yx.ResType.SKILL, this.iconSp);

        if(args.configData.Type == 1)
        {
            yx.resUtil.LoadSpriteFromResConfig( args.configData.Icon, yx.ResType.SKILL, this.iconSp);
        }
        else
        {
            yx.resUtil.LoadSpriteFromResConfig( args.configData.Icon, yx.ResType.ITEM, this.iconSp);
        }
        
    },
   

    _onShow(){
        this._refresh();
    },

    _onHide(){
    },

    _onDeInit(){

    },

    onMaskSpClick(){
        yx.windowMgr.goBack();
    },

    onRandomJoinBtnClick(){

    },

    _refresh(){
       
    },

});
