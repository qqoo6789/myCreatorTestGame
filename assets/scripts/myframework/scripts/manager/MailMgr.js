
/**
 * !#en MailManager
 * !#zh 邮件管理类。
 * @class MailManager
 * @extends 
 */
yx.MailManager = function () {
   this._mailList = [];
};

yx.MailManager.prototype = {
    constructor: yx.MailManager,
  
    init: function () {
        yx.network.addHandler(yx.proto.CmdId.MAIL_LIST, this.onMessageMailList);
        yx.network.addHandler(yx.proto.CmdId.MAIL_OPT, this.onMessageAction);
        yx.network.addHandler(yx.proto.CmdId.MAIL_PUSH, this.onMessagePush);
    },

    //////////////////////////////////以下是请求//////////////////////////////////

    reqMailList(){
        let req = new yx.proto.C2S_MailList();
        yx.network.sendMessage(yx.proto.CmdId.MAIL_LIST, req);
    },  

    doAction(type,id){
        let req = new yx.proto.C2S_MailOperate();
        req.type = type;
        req.id = id;
        yx.network.sendMessage(yx.proto.CmdId.MAIL_OPT, req);
    },
   

    //////////////////////////////////以下是消息处理//////////////////////////////////

    onMessageMailList(errMsg, data){
        cc.log("onMessageMailList-----");
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[MailManager onMessageMailList] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_MailList.decode(data);
        yx.mailMgr.updateMailList(resp.mails);
        
        // 刷新邮件界面
        yx.eventDispatch.dispatchMsg(yx.EventType.MAIL_REFRESH);
    },

    onMessageAction(errMsg, data){
        cc.log("onMessageAction-----");
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[MailManager onMessageAction] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_MailOperate.decode(data);
        yx.mailMgr.updateMailList(resp.mails);   

        if(resp.type == yx.proto.MailOptType.RECEIVE)
        {
            yx.ToastUtil.showListToast("领取成功");
        }
        else if(resp.type == yx.proto.MailOptType.DELETE)
        {
            yx.ToastUtil.showListToast("删除成功");
        }

        // 刷新邮件界面
        yx.eventDispatch.dispatchMsg(yx.EventType.MAIL_REFRESH);
        
    },

    onMessagePush(errMsg, data){
        cc.log("onMessagePush-----");
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[MailManager onMessagePush] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_NewMail.decode(data);
        let noReadCount = resp.nCount;

        // 刷新主界面提示

    },

    //////////////////////////////////以下逻辑接口//////////////////////////////////    

    updateMailList(mails){
        this._mailList = [];

        let mailList = mails;
        if(mailList && mailList.length > 0)
        {
            for (let index = 0; index < mailList.length; index++) {
                const element = mailList[index];
                let mailData = {};
                mailData.id = element.id;
                mailData.title = element.title;
                mailData.content = element.content;
                mailData.reward = JSON.parse(element.reward);
                mailData.received = element.received;
                mailData.read = element.read;
                this._mailList[index] = mailData;

                cc.log("received== "+mailData.received );
            }
        }

    },

    getMailList(){
        return this._mailList;
    },

};

/**
 * !#en MailManager
 * !#zh 邮件管理类。
 * @property mailMgr
 * @type {MailManager}
 */
yx.mailMgr = new yx.MailManager();

module.exports = yx.mailMgr;