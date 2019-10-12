
/**
 * !#en WuDaoManager
 * !#zh 五道数据类。
 * @class WuDaoManager
 * @extends 
 */
yx.WuDaoManager = function () {
    this._lingChiLevel = 1;
    //属性等级,按501-505顺序来的
    this._attr = new Array();

  
};

yx.WuDaoManager.prototype = {
    constructor: yx.WuDaoManager,
  
    init: function () {
        yx.network.addHandler(yx.proto.CmdId.WUDAO, this.onMessageWuDaoInfo);
        yx.network.addHandler(yx.proto.CmdId.UPGRADE_WUDAO, this.onMessageWudaoUpgrade);
        yx.network.addHandler(yx.proto.CmdId.UPGRADE_WUDAO_ATTR, this.onMessageAttrUpgrade);    
    },

    getLingChiLevel(){
        return this._lingChiLevel;
    },

    getAttr(){
        return this._attr;
    },

    setWuDaoInfo(info){
        this._lingChiLevel = info.level;
        this._attr = info.attr;
    },

    setWuDaoLevel(level){
        this._lingChiLevel = level;
    },

    getAttrLevel(index){
        if (this._attr[index])
        {
            return this._attr[index];
        }

        return 1;
    },

    getAttrAdd(type)
    {
        let index = type - 1;
        let attrLevel = this.getAttrLevel(index);

        let attrInfo = yx.cfgMgr.getRecordByKey("WuDaoAttrConfig", {Level: attrLevel, Type: type});

        if (attrInfo)
        {
            return attrInfo.attr[0].value;
        }

        return 0;
    },

    setAttrLevel(index, level){
        if (this._attr[index])
        {
            this._attr[index] = level;
        }
    },

    //////////////////////////////////以下是请求//////////////////////////////////

    reqWuDaoInfo(){
        let req = new yx.proto.C2S_Wudao();

        yx.network.sendMessage(yx.proto.CmdId.WUDAO, req);
    },

    reqWuDaoUpgrade(){
        let level = this.getLingChiLevel();

        let nextInfo = yx.cfgMgr.getRecordByKey("WuDaoChingConfig", {Level:level});
        if (!nextInfo)
        {
            yx.ToastUtil.showListToast("已经达到最高等级");
            return;
        }    

        let req = new yx.proto.C2S_UpgradeWudao();

        yx.network.sendMessage(yx.proto.CmdId.UPGRADE_WUDAO, req);
    },

    reqWuDaoAttrUpgrade(type){
        let index = type - 1;
        let level = this.getAttrLevel(index);

        //index查表时要加1才是type
        let nextInfo = yx.cfgMgr.getRecordByKey("WuDaoAttrConfig", {Level: level + 1, Type: type});
        if (!nextInfo)
        {
            yx.ToastUtil.showListToast("已经达到最高等级");
            return;
        }       

        let req = new yx.proto.C2S_UpgradeWudaoAttr();
        req.index = index;

        yx.network.sendMessage(yx.proto.CmdId.UPGRADE_WUDAO_ATTR, req);
    },

    //////////////////////////////////以上是请求//////////////////////////////////
   

    //////////////////////////////////以下是消息处理//////////////////////////////////

    onMessageWuDaoInfo(errMsg, data){
        let resp = yx.proto.S2C_Wudao.decode(data);

        yx.wudaoMgr.setWuDaoInfo(resp);

        yx.eventDispatch.dispatchMsg(yx.EventType.WUDAO, resp);
    },

    onMessageWudaoUpgrade(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[WuDaoMgr onMessageWudaoUpgrade] error:" + errMsg);
            yx.ToastUtil.showListToast(errMsg);
            return;
        }

        let resp = yx.proto.S2C_UpgradeWudao.decode(data);

        yx.wudaoMgr.setWuDaoLevel(resp.level);

        yx.eventDispatch.dispatchMsg(yx.EventType.UPGRADE_WUDAO, resp);
    },

    onMessageAttrUpgrade(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[WuDaoMgr onMessageAttrUpgrade] error:" + errMsg);
            yx.ToastUtil.showListToast(errMsg);
            return;
        }

        let resp = yx.proto.S2C_UpgradeWudaoAttr.decode(data);

        yx.wudaoMgr.setAttrLevel(resp.index, resp.level);

        yx.eventDispatch.dispatchMsg(yx.EventType.UPGRADE_WUDAO_ATTR, resp);
    },

};

/**
 * !#en WuDaoManager
 * !#zh 五道数据类。
 * @property wudaoMgr
 * @type {WuDaoManager}
 */
yx.wudaoMgr = new yx.WuDaoManager();

module.exports = yx.wudaoMgr;