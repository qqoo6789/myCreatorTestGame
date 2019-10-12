
/**
 * !#en HeiShiManager
 * !#zh 黑市数据类。
 * @class HeiShiManager
 * @extends 
 */
yx.HeiShiManager = function () {
    this._data = null;
};

yx.HeiShiManager.prototype = {
    constructor: yx.HeiShiManager,
    /**
     * 初始化函数
     */
    init: function () {
        yx.network.addHandler(yx.proto.CmdId.HEI_SHI, this.onMessageHandle); 
    },

    //////////////////////////////////以下是请求//////////////////////////////////

    // 获取黑市信息
    Info(){
        cc.log("HeiShiManager  Info")
        let req = new yx.proto.C2S_HeiShi();
        req.cmdType = yx.proto.HeiShiCmdType.Reconnect_Cmd;
        yx.network.sendMessage(yx.proto.CmdId.HEI_SHI, req);
    },

    // 进入游戏
    enter(){
        cc.log("HeiShiManager  enter")
        let req = new yx.proto.C2S_HeiShi();
        req.cmdType = yx.proto.HeiShiCmdType.EnterHeiShi_Cmd;
        yx.network.sendMessage(yx.proto.CmdId.HEI_SHI, req);
    },

    // 打开箱子
    openBox(id){
        cc.log("HeiShiManager  openBox  =="+id)
        let req = new yx.proto.C2S_HeiShi();
        req.cmdType = yx.proto.HeiShiCmdType.SelectShop_Cmd;
        req.selectItemID = id;
        yx.network.sendMessage(yx.proto.CmdId.HEI_SHI, req);
    },

    //////////////////////////////////以下是消息处理//////////////////////////////////

    // 黑市响应处理
    onMessageHandle(errMsg, data)
    {
        cc.log("onMessageHandle-----");
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[HeiShiManager onMessageHandle] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_HeiShi.decode(data);
        yx.heiShiMgr.setData(resp);
        if(resp.cmdType == yx.proto.HeiShiCmdType.Reconnect_Cmd)
        {
            yx.eventDispatch.dispatchMsg(yx.EventType.HEISHI_REFRESH);
        }
        else if(resp.cmdType == yx.proto.HeiShiCmdType.EnterHeiShi_Cmd)
        {
            yx.eventDispatch.dispatchMsg(yx.EventType.HEISHI_REFRESH);
        }
        else if(resp.cmdType == yx.proto.HeiShiCmdType.SelectShop_Cmd)
        {   
            let args = {};
            args.reward = resp.reward;

            if(args.reward)
            {   
                cc.log("args.reward.length=="+args.reward.length);
                for (let index = 0; index < args.reward.length; index++) {
                    const element = args.reward[index];
                    cc.log("element id="+element.id);
                    cc.log("element count="+element.count);
                }
            }   
            else
            {
                cc.log("reward is null");
            }

            args.selectItemID = resp.selectItemID;
            yx.windowMgr.showWindow("heishiRewardPanel",args);

            yx.heiShiMgr.Info();
        }

    },

    //////////////////////////////////以下逻辑接口//////////////////////////////////    
    
    setData(resp){
        this._data = {};
        if(resp.heiShiConsume != null)
        {
            this._data.heiShiConsume = resp.heiShiConsume;
            cc.log("heiShiConsume.avaliableLevel"+resp.heiShiConsume.avaliableLevel);
            cc.log("heiShiConsume.avaliableCount"+resp.heiShiConsume.avaliableCount);
            // cc.log("heiShiConsume.resource"+resp.heiShiConsume.resource);
        }
        if(resp.gameState != null)
        {
            this._data.gameState = resp.gameState;
            cc.log("gameState"+resp.gameState);
        }
        if(resp.countDown != null)
        {
            this._data.countDown = resp.countDown;
            cc.log("countDown"+resp.countDown);
        }
        if(resp.heiShiList != null)
        {
            this._data.heiShiList = resp.heiShiList;
        }
    },

    getData(){
        return this._data;
    },

    // 是否游戏选择状态
    IsPalying(){
        return this._data.gameState == yx.proto.HeiShiGameState.Select;
    },

    // 是否达到等级要求
    IsLevelActive(){
        if(this._data.heiShiConsume == null || this._data.heiShiConsume.avaliableLevel == null)
            return false;
            
        return this._data.heiShiConsume.avaliableLevel;
    },

    // 剩余次数
    getLeftTimes(){
        if(this._data.heiShiConsume == null || this._data.heiShiConsume.avaliableCount == null)
            return 0;
    
        return this._data.heiShiConsume.avaliableCount;
    },

     // 消耗
     getCost(){
         if(this._data.heiShiConsume == null || this._data.heiShiConsume.resource == null)
            return [];

        return this._data.heiShiConsume.resource;
    },

    // 获取黑市列表
    getListItem(){
        if(this._data.heiShiList == null)
            return [];

        return this._data.heiShiList;
    },

    // 游戏结束时间
    getEndTime()
    {   
        if(this._data.countDown == null)
            return 0;

        return this._data.countDown;
    },
 

};

/**
 * !#en HeiShiManager
 * !#zh 黑市数据类。
 * @property heiShiMgr
 * @type {HeiShiManager}
 */
yx.heiShiMgr = new yx.HeiShiManager();

module.exports = yx.heiShiMgr;