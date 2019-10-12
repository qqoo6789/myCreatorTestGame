const BaseWindow = require('BaseWindow');

cc.Class({
    extends: BaseWindow,

    properties: {
        closeBtn:          cc.Button,
        maskSp:            cc.Button,
        lingquBtn:         cc.Button,
        deleteBtn:         cc.Button,
        content:           cc.RichText,
        rewardGroup:       cc.Node,
        scrollContent:     cc.Node,
    
    },

    _onInit(args) {

        this._data = args;

        this.closeBtn.node.on('click', this.onCloseBtnClick, this);
        this.maskSp.node.on('click', this.onMaskSpClick, this);
        this.lingquBtn.node.on('click', this.onLingQuClick, this);
        this.deleteBtn.node.on('click', this.onDeleteBtnClick, this);
    },
   

    _onShow(){
        this._refresh();
    },

    _onHide(){
    },

    _onDeInit(){

    },

    _refresh(){

        this.content.string = this._data.content;

        let self = this;
        self.scrollContent.removeAllChildren(true);

        if(this._data.reward && this._data.reward.length > 0)
        {
            this.rewardGroup.active  = true;

            for (let index = 0; index < this._data.reward.length; index++) {
                const element = this._data.reward[index];
                let itemInfo = {};
                itemInfo["content"] = "*"+element.count;
                itemInfo["ID"] = element.id;
                yx.ItemRichTextWidget.CreateItemSlot(itemInfo, self.scrollContent, "reward_"+index,null);
            }

            if(this._data.received)
            {
                this.deleteBtn.node.active = true;
                this.lingquBtn.node.active = false;
            }
            else
            {
                this.deleteBtn.node.active = false;
                this.lingquBtn.node.active = true;
            }
        }
        else
        {
            this.rewardGroup.active  = false;

            this.deleteBtn.node.active = true;
            this.lingquBtn.node.active = false;
        }
    },

    onCloseBtnClick(){
        yx.windowMgr.goBack();
    },

    onMaskSpClick(){
        yx.windowMgr.goBack();
    },

    onLingQuClick(){
        yx.mailMgr.doAction(yx.proto.MailOptType.RECEIVE,this._data.id);
        yx.windowMgr.goBack();
    },
    
    onDeleteBtnClick(){
        yx.mailMgr.doAction(yx.proto.MailOptType.DELETE,this._data.id);
        yx.windowMgr.goBack();
    },


});