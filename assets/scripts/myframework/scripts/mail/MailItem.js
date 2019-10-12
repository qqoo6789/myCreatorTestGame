cc.Class({
    extends: cc.Component,

    properties: {
        itemNode:        cc.Node,
        readSp:          cc.Sprite,
        readSp2:         cc.Sprite,
        noreadSp:        cc.Sprite,
        noreadSp2:       cc.Sprite,
        rewardSp:        cc.Sprite,
        title:           cc.Label,
        desc:            cc.Label,
    },

    init(data){
        this._data = data;
        

        let button = this.itemNode.getComponent(cc.Button);
        button.node.on('click', this.onOepnInfoClick, this);

        if(data.read)
        {
            this.readSp.node.active = true;
            this.readSp2.node.active = true;
            this.noreadSp.node.active = false;
            this.noreadSp2.node.active = false;

            let s = this.itemNode.getComponentsInChildren(cc.Sprite);
            for (let index = 0; index < s.length; index++) {
                const element = s[index];
                element.setState(cc.Sprite.State.GRAY);
            }

            this.title.string = data.title;
            this.desc.string = data.content;
            this.title.node.color = new cc.Color(206,206,206);
            this.desc.node.color = new cc.Color(206,206,206);
        }
        else
        {
            this.readSp.node.active = false;
            this.readSp2.node.active = false;
            this.noreadSp.node.active = true;
            this.noreadSp2.node.active = true;

            let s = this.itemNode.getComponentsInChildren(cc.Sprite);
            for (let index = 0; index < s.length; index++) {
                const element = s[index];
                element.setState(cc.Sprite.State.NORMAL);
            }

            this.title.string = data.title;
            this.desc.string = data.content;
            this.title.node.color = new cc.Color(255,255,255);
            this.desc.node.color = new cc.Color(152,186,240);
        }

        if(data.reward && data.reward.length > 0)
        {
            this.rewardSp.node.active  = true;
        }
        else
        {
            this.rewardSp.node.active  = false;
        }
        
    },

    onOepnInfoClick(){
        yx.windowMgr.showWindow("mailInfo",this._data);
        yx.mailMgr.doAction(yx.proto.MailOptType.READ,this._data.id);
    },

});