
/**
 * !#en JiYuanManager
 * !#zh 机缘数据类。
 * @class JiYuanManager
 * @extends 
 */
yx.JiYuanManager = function () {
    this._eventList = null;

    this._qiYuEventList = null;
};

yx.JiYuanManager.prototype = {
    constructor: yx.JiYuanManager,
    /**
     * 初始化函数
     */
    init: function () {
        yx.network.addHandler(yx.proto.CmdId.GET_JI_YUAN, this.onMessageJiYuanInfo); 
        yx.network.addHandler(yx.proto.CmdId.JI_YUAN, this.onMessageJiYuanAction); 

        yx.network.addHandler(yx.proto.CmdId.GET_QI_YUA, this.onMessageQiYuInfo); 

        this._eventList = null;
    },

    //////////////////////////////////以下是请求//////////////////////////////////

    // 获取奇遇信息
    QiYuInfo(){
        cc.log("[JiYuanManager] QiYuInfo ");
        let req = new yx.proto.C2S_GetJiYuan();
        yx.network.sendMessage(yx.proto.CmdId.GET_QI_YUA, req);
    },

    // 获取机缘信息
    Info(){
        cc.log("[JiYuanManager] Info ");
        let req = new yx.proto.C2S_GetJiYuan();
        yx.network.sendMessage(yx.proto.CmdId.GET_JI_YUAN, req);
    },

    // 执行机缘
    DoAction(info,Option){
        cc.log("[JiYuanManager] DoAction ");
        let req = new yx.proto.C2S_JiYuan();
        req.info = info;
        req.index = Option;
        yx.network.sendMessage(yx.proto.CmdId.JI_YUAN, req);

    },

    //////////////////////////////////以下是消息处理//////////////////////////////////

    // 获取奇遇信息
    onMessageQiYuInfo(errMsg, data)
    {
        cc.log("onMessageQiYuInfo-----");
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[MenPaiMgr onMessageQiYuInfo] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_GetJiYuan.decode(data);
        yx.JiYuanMgr.updateQiYuEventList(resp);


        let qiyuList = yx.JiYuanMgr.getQiYuEventList();
        if(qiyuList && qiyuList.length > 0)
        {
            
            yx.eventDispatch.dispatchMsg(yx.EventType.QIYU_OPEN_WINDOW);
        }
        else
        {
            yx.ToastUtil.showListToast("当前没有奇遇");
        }
        
    },

    // 获取机缘信息
    onMessageJiYuanInfo(errMsg, data)
    {
        cc.log("onMessageJiYuanInfo-----");
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[MenPaiMgr onMessageJiYuanInfo] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_GetJiYuan.decode(data);
        yx.JiYuanMgr.updateEventList(resp);

        yx.eventDispatch.dispatchMsg(yx.EventType.JIYUAN_INFO_REFRESH);
    },

    // 执行机缘
    onMessageJiYuanAction(errMsg, data)
    {
        cc.log("onMessageJiYuanAction-----");
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[MenPaiMgr onMessageJiYuanAction] error:" + errMsg);
            yx.ToastUtil.showListToast(errMsg);
            return;
        }

        let resp = yx.proto.S2C_JiYuan.decode(data);

        let args = {};
        args.rewards = resp.resource;
        args.costs = resp.cost;
        args.haogan = resp.intimacy;
        args.info = resp.info;
        args.index = resp.index;
        args.result = resp.result;

        for (let index = 0; index < args.rewards.length; index++) {
            const element = args.rewards[index];
            cc.log("reward id=="+element.id+";type=="+element.type+";count=="+element.count);
        }
        for (let index = 0; index < args.costs.length; index++) {
            const element = args.costs[index];
            cc.log("cost id=="+element.id+";type=="+element.type+";count=="+element.count);
        }
        cc.log("haogan=="+args.haogan);

        if(args.info.type == yx.proto.JiYuanType.QiYu)
        {
            yx.eventDispatch.dispatchMsg(yx.EventType.QIYU_DOACTION_REFRESH,args);
        }
        else
        {
            yx.eventDispatch.dispatchMsg(yx.EventType.JIYUAN_DOACTION_REFRESH,args);
        }
        
    },

    //////////////////////////////////以下逻辑接口//////////////////////////////////    

    updateQiYuEventList(resp)
    {
        cc.log("updateQiYuEventList");
        let list = resp.infos;
        this._qiYuEventList = list;

        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            cc.log("id=="+element.id);
            cc.log("type=="+element.type);
        }
    },

    updateEventList(resp)
    {
        cc.log("updateEventList");
        let list = resp.infos;
        this._eventList = list;

        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            cc.log("id=="+element.id);
            cc.log("type=="+element.type);
        }
    },


    // 获取奇遇列表
    getQiYuEventList()
    {
        return this._qiYuEventList;
    },

    // 获取机缘列表
    getEventList()
    {
        return this._eventList;
    },

};

/**
 * !#en JiYuanManager
 * !#zh 机缘数据类。
 * @property jiYuanMgr
 * @type {JiYuanManager}
 */
yx.JiYuanMgr = new yx.JiYuanManager();

module.exports = yx.JiYuanMgr;