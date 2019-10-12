const BaseWindow = require('BaseWindow');
const MailItem = require('MailItem');

cc.Class({
    extends: BaseWindow,

    properties: { 
        scrollContent:      cc.Node,
        mailItemPrefab:     cc.Prefab,

        deleteAllBtn:       cc.Button,       
        getAllBtn:          cc.Button,

        noMailNode:         cc.Node,
    },

    _onInit(){

        yx.eventDispatch.addListener(yx.EventType.MAIL_REFRESH, this.onRefreshList, this);

        this.deleteAllBtn.node.on('click', this.onDeleteAllBtnClick, this);
        this.getAllBtn.node.on('click', this.onGetAllBtnClick, this);
    },

    _onShow(){
        // 每次打开邮件界面都请求
        yx.mailMgr.reqMailList();
    },

    _onHide(){
        this.unscheduleAllCallbacks();
    },

    _onDeInit(){

    },

    _refresh(){
        let emailList = yx.mailMgr.getMailList();
        this._itemList = new Array();
        
        let self = this;
        self.scrollContent.removeAllChildren(true);
        emailList.forEach(data => {
            let scrollItem = cc.instantiate(self.mailItemPrefab);
            let itemSrc = scrollItem.getComponent(MailItem);
            if (itemSrc)
            {
                itemSrc.init(data);
                self.scrollContent.addChild(scrollItem);
                self._itemList.push(itemSrc);
            }
         });


         if(this._itemList.length > 0)
         {
            this.noMailNode.active = false;
         }
         else
         {
            this.noMailNode.active = true;
         }
    },

    onGetAllBtnClick(){

        if(this._itemList.length <= 0)
            return;

       yx.mailMgr.doAction(yx.proto.MailOptType.RECEIVE,-1);
    },

    onDeleteAllBtnClick(){
        if(this._itemList.length <= 0)
            return;
            
        yx.mailMgr.doAction(yx.proto.MailOptType.DELETE,-1);
    },

    onRefreshList(){
        this._refresh();
    },

   
});